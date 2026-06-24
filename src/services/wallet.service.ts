import { apiRequest } from "@/services/api-client";
import { API_ROUTES } from "@/services/api-routes";
import type {
	CreateWalletPayload,
	TransferWalletPayload,
	Wallet,
	WalletBalanceResponse,
	WalletLedgerPayload,
} from "@/services/types";

function createWallet(projectApiKey: string, payload: CreateWalletPayload) {
	return apiRequest<Wallet>(API_ROUTES.wallets.create, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
	});
}

function getWallet(projectApiKey: string, walletId: string) {
	return apiRequest<WalletBalanceResponse>(API_ROUTES.wallets.get(walletId), {
		apiKey: projectApiKey,
		auth: false,
	});
}

function creditWallet(projectApiKey: string, payload: WalletLedgerPayload) {
	return apiRequest<unknown>(API_ROUTES.wallets.credit, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
	});
}

function debitWallet(projectApiKey: string, payload: WalletLedgerPayload) {
	return apiRequest<unknown>(API_ROUTES.wallets.debit, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
	});
}

function transferWallet(projectApiKey: string, payload: TransferWalletPayload) {
	return apiRequest<unknown>(API_ROUTES.wallets.transfer, {
		method: "POST",
		body: JSON.stringify(payload),
		apiKey: projectApiKey,
		auth: false,
	});
}

export { createWallet, creditWallet, debitWallet, getWallet, transferWallet };
