# crypto-pay-api

[![npm](https://img.shields.io/npm/v/crypto-pay-api?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/crypto-pay-api)
[![npm downloads](https://img.shields.io/npm/dw/crypto-pay-api?logo=npm&style=flat&labelColor=000&color=3b82f6)](https://www.npmjs.org/package/crypto-pay-api)
[![JSR](https://jsr.io/badges/crypto-pay-api)](https://jsr.io/crypto-pay-api)
[![JSR Score](https://jsr.io/badges/crypto-pay-api/score)](https://jsr.io/crypto-pay-api)

## Installation

```bash
npm install crypto-pay-api
```

## Usage

```ts
import { CryptoPayAPI, webhookHandler } from "crypto-pay-api";

const api = new CryptoPayAPI("your-api-key");

api.on("invoice_paid", ({ payload }) => {
    console.log(payload.amount, payload.payload);
});

const me = await api.getMe();

console.log(me);

const invoice = await api.createInvoice({
    amount: "100",
    asset: "USDT",
});

console.log(invoice, invoice.bot_invoice_url);

Bun.serve({
    routes: {
        "/webhook": {
            POST: webhookHandler(api, "Bun.serve"),
        },
    },
});
```
