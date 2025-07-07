import { createHash, createHmac } from "node:crypto";

export function checkSignature(
	token: string | Buffer,
	signature: string,
	body: unknown,
) {
	const secret =
		typeof token === "string"
			? createHash("sha256").update(token).digest()
			: token;

	const checkString = JSON.stringify(body);
	const hmac = createHmac("sha256", secret).update(checkString).digest("hex");

	return hmac === signature;
}
