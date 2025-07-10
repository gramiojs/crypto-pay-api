import { checkSignature } from "./signature.ts";
import type {
	ApiResponse,
	AppInfo,
	AppStats,
	Asset,
	Balance,
	Check,
	CreateCheckParams,
	CreateInvoiceParams,
	DeleteCheckParams,
	DeleteInvoiceParams,
	ExchangeRate,
	GetChecksParams,
	GetInvoicesParams,
	GetStatsParams,
	GetTransfersParams,
	Invoice,
	Network,
	Transfer,
	TransferParams,
	WebhookUpdate,
	WebhookUpdateType,
} from "./types/index.ts";

export * from "./types/index.ts";
export * from "./webhook/index.ts";

/**
 * CryptoPay API client.
 */
export class CryptoPayAPI {
	private readonly endpoint: string;
	private readonly listeners: ((data: WebhookUpdate) => unknown)[] = [];

	/**
	 * Creates a new CryptoPayAPI instance.
	 * @param apiKey - The API key to use for authentication.
	 * @param network - The network to use for the API.
	 */
	constructor(
		private readonly apiKey: string,
		network: Network = "mainnet",
	) {
		this.endpoint =
			network === "mainnet"
				? "https://pay.crypt.bot/"
				: "https://testnet-pay.crypt.bot/";
	}

	private async request<T>(
		method: string,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		params: Record<string, any>,
	): Promise<T> {
		const url = `${this.endpoint}api/${method}`;

		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"Content-Type": "application/json",
				"Crypto-Pay-API-Token": this.apiKey,
			},
		});

		const data = (await response.json()) as ApiResponse<T>;

		if (!data.ok) {
			throw new Error(
				`${method} failed: ${data.error.code} - ${data.error.name}`,
			);
		}

		return data.result;
	}

	async emit(data: WebhookUpdate, signature: string) {
		const isSignatureValid = checkSignature(this.apiKey, signature, data);

		if (!isSignatureValid) return false;

		for (const listener of this.listeners) {
			await listener(data);
		}

		return true;
	}

	on(_event: WebhookUpdateType, listener: (data: WebhookUpdate) => unknown) {
		this.listeners.push(listener);
	}

	/**
	 * Tests the authentication token and retrieves basic app information.
	 * @returns {@link AppInfo} wrapped in {@link ApiResponse}.
	 */
	getMe(): Promise<AppInfo> {
		return this.request<AppInfo>("getMe", {});
	}

	/**
	 * Creates a new invoice and returns the created invoice object.
	 * @param params Parameters accepted by createInvoice method.
	 */
	createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
		return this.request<Invoice>("createInvoice", params);
	}

	/**
	 * Deletes one or multiple invoices by ID.
	 * @param params List of invoice IDs to delete.
	 */
	deleteInvoice(params: DeleteInvoiceParams): Promise<Invoice[]> {
		return this.request<Invoice[]>("deleteInvoice", params);
	}

	/**
	 * Creates a crypto check (voucher).
	 * @param params Check creation parameters.
	 */
	createCheck(params: CreateCheckParams): Promise<Check> {
		return this.request<Check>("createCheck", params);
	}

	/**
	 * Deletes existing checks by IDs.
	 * @param params List of check IDs to delete.
	 */
	deleteCheck(params: DeleteCheckParams): Promise<Check[]> {
		return this.request<Check[]>("deleteCheck", params);
	}

	/**
	 * Transfers funds from the app balance to a Telegram user.
	 * @param params Transfer parameters including user ID and asset.
	 */
	transfer(params: TransferParams): Promise<Transfer> {
		return this.request<Transfer>("transfer", params);
	}

	/**
	 * Retrieves invoices optionally filtered by status, period or identifiers.
	 * @param params Optional filtering parameters.
	 */
	getInvoices(params: GetInvoicesParams = {}): Promise<Invoice[]> {
		return this.request<Invoice[]>("getInvoices", params);
	}

	/**
	 * Retrieves checks optionally filtered by status or period.
	 * @param params Optional filtering parameters.
	 */
	getChecks(params: GetChecksParams = {}): Promise<Check[]> {
		return this.request<Check[]>("getChecks", params);
	}

	/**
	 * Retrieves transfers optionally filtered by identifiers or period.
	 * @param params Optional filtering parameters.
	 */
	getTransfers(params: GetTransfersParams = {}): Promise<Transfer[]> {
		return this.request<Transfer[]>("getTransfers", params);
	}

	/**
	 * Retrieves current asset balances of the app wallet.
	 */
	getBalance(): Promise<Balance[]> {
		return this.request<Balance[]>("getBalance", {});
	}

	/**
	 * Retrieves current exchange rates for supported crypto assets.
	 */
	getExchangeRates(): Promise<ExchangeRate[]> {
		return this.request<ExchangeRate[]>("getExchangeRates", {});
	}

	/**
	 * Retrieves list of currencies supported by the platform.
	 */
	getCurrencies(): Promise<Asset[]> {
		return this.request<Asset[]>("getCurrencies", {});
	}

	/**
	 * Retrieves aggregated application statistics for a specified period.
	 * @param params Date range parameters.
	 */
	getStats(params: GetStatsParams): Promise<AppStats> {
		return this.request<AppStats>("getStats", params);
	}
}
