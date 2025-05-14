import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {withDevtools} from '@angular-architects/ngrx-toolkit';

interface WalletState {
  evmWallet: string;
  solanaWallet: string;
}

const walletInitialState: WalletState = {
  solanaWallet: '',
  evmWallet: ''
}
export const WalletStore =  signalStore(
  withState(walletInitialState),
  withDevtools('wallet'),
  withMethods((store) => ({
    updateSolanaWallet(account: string) {
      patchState(store, (state) => ({...state, solanaWallet: account}));
    },
    updateEvmWallet(account: string) {
      patchState(store, (state) => ({...state, evmWallet: account}));
    },
  })))
