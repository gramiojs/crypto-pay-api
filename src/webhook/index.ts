import type { CryptoPayAPI } from "../index.ts";
import type { WebhookUpdate } from "../types/index.ts";
import { frameworks } from "./adapters.ts";

export function webhookHandler<Framework extends keyof typeof frameworks>(
	client: CryptoPayAPI,
	framework: Framework,
) {
	const frameworkAdapter = frameworks[framework];

	// biome-ignore lint/suspicious/noExplicitAny: cross-framework handler
	return (async (...args: any[]) => {
		const { body, response, getSignatureHeader } = frameworkAdapter(
			// @ts-expect-error
			...args,
		);

		await client.emit((await body) as WebhookUpdate, getSignatureHeader());

		if (response) return response();
	}) as unknown as ReturnType<(typeof frameworks)[Framework]> extends {
		response: () => any;
	}
		? (
				...args: Parameters<(typeof frameworks)[Framework]>
			) => ReturnType<ReturnType<(typeof frameworks)[Framework]>["response"]>
		: ReturnType<(typeof frameworks)[Framework]>["response"];
}
