export type Network = "mainnet" | "testnet";

/**
 * List of supported cryptocurrency assets available in Crypto Pay.
 *
 * @see https://help.crypt.bot/crypto-pay-api#assets
 */
export type Asset =
	| "USDT"
	| "TON"
	| "BTC"
	| "ETH"
	| "LTC"
	| "BNB"
	| "TRX"
	| "USDC"
	| "JET";

/**
 * List of supported fiat currency codes accepted by Crypto Pay.
 *
 * @see https://help.crypt.bot/crypto-pay-api#currencies
 */
export type FiatCurrency =
	| "USD"
	| "EUR"
	| "RUB"
	| "BYN"
	| "UAH"
	| "GBP"
	| "CNY"
	| "KZT"
	| "UZS"
	| "GEL"
	| "TRY"
	| "AMD"
	| "THB"
	| "INR"
	| "BRL"
	| "IDR"
	| "AZN"
	| "AED"
	| "PLN"
	| "ILS";

/**
 * Identifies whether an invoice amount is specified in cryptocurrency or fiat.
 */
export type CurrencyType = "crypto" | "fiat";

/**
 * Possible lifecycle states of an invoice.
 */
export type InvoiceStatus = "active" | "paid" | "expired";

/**
 * Possible lifecycle states of a check.
 */
export type CheckStatus = "active" | "activated";

/**
 * The only status a transfer can have once completed.
 */
export type TransferStatus = "completed";

/**
 * Preset button names displayed to the user after a successful payment.
 */
export type PaidButtonName =
	| "viewItem"
	| "openChannel"
	| "openBot"
	| "callback";

/**
 * Full representation of an invoice returned by Crypto Pay API.
 */
export interface Invoice {
	/** Unique identifier of the invoice. */
	invoice_id: number;
	/** Current status of the invoice. */
	status: InvoiceStatus;
	/** Indicates whether the invoice amount is in crypto or fiat. */
	currency_type: CurrencyType;
	/** Crypto asset used when currency_type is "crypto". */
	asset?: Asset;
	/** Fiat currency code when currency_type is "fiat". */
	fiat?: FiatCurrency;
	/** Assets accepted for payment when amount is specified in fiat. */
	accepted_assets?: Asset[];
	/** Invoice amount represented as stringified float. */
	amount: string;
	/** Public hash of the invoice. */
	hash: string;
	/** Optional description visible to the payer. */
	description?: string;
	/** Deep-link URL to pay the invoice in Telegram bot. */
	bot_invoice_url?: string;
	/** Invoice URL for Telegram Mini Apps. */
	mini_app_invoice_url?: string;
	/** Invoice URL for Web Apps. */
	web_app_invoice_url?: string;
	/** Allows payer to change the amount. */
	is_flexible?: boolean;
	/** Asset used to pay the invoice. */
	paid_asset?: Asset;
	/** Amount actually paid. */
	paid_amount?: string;
	/** USD exchange rate of paid_asset at payment time. */
	paid_usd_rate?: string;
	/** Exchange rate of paid_asset to specified fiat currency. */
	paid_fiat_rate?: string;
	/** Asset in which service fee was charged. */
	fee_asset?: Asset;
	/** Charged service fee amount. */
	fee_amount?: string;
	/** Whether the payment was automatically swapped. */
	is_swapped?: boolean;
	/** Requested asset to swap to. */
	swap_to?: Asset;
	/** Internal swap transaction identifier. */
	swapped_uid?: number;
	/** Asset funds were swapped to. */
	swapped_to?: Asset;
	/** Exchange rate applied during swap. */
	swapped_rate?: string;
	/** Resulting amount after swap. */
	swapped_output?: string;
	/** USD rate of swapped_to asset at swap time. */
	swapped_usd_rate?: string;
	/** ISO-8601 creation timestamp. */
	created_at: string;
	/** True if payer can leave comments. */
	allow_comments: boolean;
	/** True if anonymous payments are allowed. */
	allow_anonymous: boolean;
	/** ISO-8601 expiration timestamp, if set. */
	expiration_date?: string;
	/** ISO-8601 timestamp when payment was received. */
	paid_at?: string;
	/** Indicates that payment was made anonymously. */
	paid_anonymously?: boolean;
	/** Comment left by the payer. */
	comment?: string;
	/** Hidden message displayed after payment. */
	hidden_message?: string;
	/** Custom payload attached to the invoice. */
	payload?: string;
	/** Post-payment button label. */
	paid_btn_name?: PaidButtonName;
	/** URL opened by the post-payment button. */
	paid_btn_url?: string;
}

/**
 * Outgoing crypto transfer executed by the app.
 */
export interface Transfer {
	/** Unique identifier of the transfer. */
	transfer_id: number;
	/** Unique spend identifier provided when creating the transfer. */
	spend_id?: string;
	/** Telegram user ID that received the transfer. */
	user_id: string;
	/** Crypto asset that was transferred. */
	asset: Asset;
	/** Amount transferred represented as stringified float. */
	amount: string;
	/** Transfer status (always "completed"). */
	status: TransferStatus;
	/** ISO-8601 timestamp when the transfer was completed. */
	completed_at: string;
	/** Optional comment attached to the transfer. */
	comment?: string;
}

/**
 * Crypto check (voucher) that users can redeem.
 */
export interface Check {
	/** Unique identifier of the check. */
	check_id: number;
	/** Public hash of the check used for activation. */
	hash: string;
	/** Crypto asset stored in the check. */
	asset: Asset;
	/** Amount stored in the check represented as stringified float. */
	amount: string;
	/** URL that should be provided to a user to activate the check. */
	bot_check_url: string;
	/** Current status of the check. */
	status: CheckStatus;
	/** ISO-8601 creation timestamp. */
	created_at: string;
	/** ISO-8601 activation timestamp, if the check has been redeemed. */
	activated_at?: string;
}

/**
 * Balance information for a specific crypto asset.
 */
export interface Balance {
	/** Crypto asset code. */
	currency_code: Asset;
	/** Total available balance represented as stringified float. */
	available: string;
	/** Amount currently on hold represented as stringified float. */
	onhold: string;
}

/**
 * Exchange rate between a crypto asset and a fiat currency.
 */
export interface ExchangeRate {
	/** True if the rate is up-to-date. */
	is_valid: boolean;
	/** True if the source is a cryptocurrency. */
	is_crypto: boolean;
	/** True if the source is a fiat currency. */
	is_fiat: boolean;
	/** Crypto asset code. */
	source: Asset;
	/** Fiat currency code. */
	target: FiatCurrency;
	/** Current exchange rate represented as stringified float. */
	rate: string;
}

/**
 * Aggregated statistics calculated by Crypto Pay.
 */
export interface AppStats {
	/** Total volume of paid invoices in USD. */
	volume: number;
	/** Conversion rate of all created invoices. */
	conversion: number;
	/** Unique number of users who have paid invoices. */
	unique_users_count: number;
	/** Total number of created invoices. */
	created_invoice_count: number;
	/** Total number of paid invoices. */
	paid_invoice_count: number;
	/** ISO-8601 timestamp marking the start of the calculation period. */
	start_at: string;
	/** ISO-8601 timestamp marking the end of the calculation period. */
	end_at: string;
}

/**
 * Union of possible webhook update types.
 */
export type WebhookUpdateType = "invoice_paid";

/**
 * Webhook payload delivered by Crypto Pay.
 */
export interface WebhookUpdate {
	/** Non-unique update identifier. */
	update_id: number;
	/** Type of the update (currently only "invoice_paid"). */
	update_type: WebhookUpdateType;
	/** ISO-8601 timestamp when the request was sent. */
	request_date: string;
	/** Invoice payload associated with the update. */
	payload: Invoice;
}

/**
 * Successful API response wrapper.
 */
export interface ApiSuccess<T> {
	/** Indicates success. Always true. */
	ok: true;
	/** Result of the successful API call. */
	result: T;
}

/**
 * Error API response wrapper.
 */
export interface ApiError {
	/** Indicates failure. Always false. */
	ok: false;
	/** Error code or message returned by the API. */
	error: {
		code: number;
		message: string;
	};
}

/**
 * Generic API response union.
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Parameters accepted by the createInvoice method.
 */
export interface CreateInvoiceParams {
	currency_type?: CurrencyType;
	asset?: Asset;
	fiat?: FiatCurrency;
	accepted_assets?: Asset[];
	amount: string;
	description?: string;
	hidden_message?: string;
	paid_btn_name?: PaidButtonName;
	paid_btn_url?: string;
	payload?: string;
	allow_comments?: boolean;
	allow_anonymous?: boolean;
	expires_in?: number;
	is_flexible?: boolean;
	swap_to?: Asset;
}

/**
 * Parameters accepted by the deleteInvoice method.
 */
export interface DeleteInvoiceParams {
	invoice_ids: number[];
}

/**
 * Parameters required to create a check.
 */
export interface CreateCheckParams {
	asset: Asset;
	amount: string;
}

/**
 * Parameters used to delete checks.
 */
export interface DeleteCheckParams {
	check_ids: number[];
}

/**
 * Parameters required to transfer funds to a Telegram user.
 */
export interface TransferParams {
	user_id: string;
	asset: Asset;
	amount: string;
	spend_id?: string;
	comment?: string;
}

/**
 * Filtering options for getInvoices.
 */
export interface GetInvoicesParams {
	invoice_ids?: number[];
	status?: InvoiceStatus;
	offset?: number;
	count?: number;
	from?: string;
	to?: string;
}

/**
 * Filtering options for getChecks.
 */
export interface GetChecksParams {
	check_ids?: number[];
	status?: CheckStatus;
	offset?: number;
	count?: number;
	from?: string;
	to?: string;
}

/**
 * Filtering options for getTransfers.
 */
export interface GetTransfersParams {
	transfer_ids?: number[];
	spend_id?: string;
	offset?: number;
	count?: number;
	from?: string;
	to?: string;
}

/**
 * Parameters for retrieving aggregated statistics.
 */
export interface GetStatsParams {
	start_at: string;
	end_at?: string;
}

/**
 * Basic information about an app returned by getMe.
 */
export interface AppInfo {
	/** Unique numeric identifier of the app. */
	app_id: number;
	/** Public name of the app. */
	name: string;
	/** Telegram bot username associated with the app. */
	bot_username: string;
}
