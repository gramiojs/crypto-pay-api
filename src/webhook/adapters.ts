import type { Buffer } from "node:buffer";
import type { MaybePromise } from "../utils.ts";

interface FrameworkHandler {
	body: MaybePromise<unknown>;
	response?: () => unknown;
	getSignatureHeader: () => string;
}

const HEADER_NAME = "X-Crypto-Pay-Signature";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type FrameworkAdapter = (...args: any[]) => FrameworkHandler;

// !Temporally fix slow types on JSR
export const frameworks: Record<
	| "http"
	| "std/http"
	| "Bun.serve"
	| "elysia"
	| "fastify"
	| "hono"
	| "express"
	| "koa",
	FrameworkAdapter
> = {
	elysia: ({ body, headers }) => ({
		body,
		response: () => new Response("OK"),
		getSignatureHeader: () => headers[HEADER_NAME],
	}),
	fastify: (request, reply) => ({
		body: request.body,
		response: () => reply.send("OK"),
		getSignatureHeader: () => request.headers[HEADER_NAME],
	}),
	hono: (c) => ({
		body: c.req.json(),
		response: () => c.text("OK"),
		getSignatureHeader: () => c.req.header(HEADER_NAME),
	}),
	express: (req, res) => ({
		body: req.body,
		response: () => res.send("OK"),
		getSignatureHeader: () => req.headers[HEADER_NAME],
	}),
	koa: (ctx) => ({
		body: ctx.request.body,
		response: () => {
			ctx.body = "OK";
		},
		getSignatureHeader: () => ctx.request.header[HEADER_NAME],
	}),
	http: (req, res) => ({
		body: new Promise((resolve) => {
			let body = "";

			req.on("data", (chunk: Buffer) => {
				body += chunk.toString();
			});

			req.on("end", () => resolve(JSON.parse(body)));
		}),
		response: () => res.writeHead(200).end("OK"),
		getSignatureHeader: () => req.headers[HEADER_NAME],
	}),
	"std/http": (req) => ({
		body: req.json(),
		response: () => new Response("OK"),
		getSignatureHeader: () => req.headers.get(HEADER_NAME),
	}),
	"Bun.serve": (req) => ({
		body: req.json(),
		response: () => new Response("OK"),
		getSignatureHeader: () => req.headers.get(HEADER_NAME),
	}),
} satisfies Record<string, FrameworkAdapter>;
