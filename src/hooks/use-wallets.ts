import { useServiceAction } from "@/hooks/use-service-action";
import type {
	CreateWalletPayload,
	TransferWalletPayload,
	WalletLedgerPayload,
} from "@/services/types";
import * as walletService from "@/services/wallet.service";

function useWallets() {
	const { isLoading, run } = useServiceAction();

	return {
		isLoading,
		createWallet: (projectApiKey: string, payload: CreateWalletPayload) =>
			run(() => walletService.createWallet(projectApiKey, payload)),
		getWallet: (projectApiKey: string, walletId: string) =>
			run(() => walletService.getWallet(projectApiKey, walletId)),
		creditWallet: (projectApiKey: string, payload: WalletLedgerPayload) =>
			run(() => walletService.creditWallet(projectApiKey, payload)),
		debitWallet: (projectApiKey: string, payload: WalletLedgerPayload) =>
			run(() => walletService.debitWallet(projectApiKey, payload)),
		transferWallet: (projectApiKey: string, payload: TransferWalletPayload) =>
			run(() => walletService.transferWallet(projectApiKey, payload)),
	};
}

export { useWallets };
