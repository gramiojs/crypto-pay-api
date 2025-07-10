import { CryptoPayAPI, webhookHandler } from "../../src/index.ts";

{
	const client = new CryptoPayAPI("");

	Bun.serve({
		routes: {
			"/": webhookHandler(client, "Bun.serve"),
		},
	});
}
