import {AppKit, createAppKit, Metadata} from "@reown/appkit";
import {Injectable} from '@angular/core';
import {createWagmiAdapter, REOWN_PROJECT_ID} from './wagmi.adapter';
import {AppKitNetwork} from '@reown/appkit/networks';
import {SolanaAdapter} from '@reown/appkit-adapter-solana';
import {forkJoin, from, lastValueFrom} from 'rxjs';
import {SolanaWalletService} from './solana-wallet.service';

@Injectable()
export class AppKitService {
  modal!: AppKit;


  createAppKit(chains: AppKitNetwork[], metadata: Metadata,storageKey?: string) {
    const customWagmiAdapter = createWagmiAdapter(chains, storageKey);
    // 2. Create Solana adapter
    const solanaAdapter = new SolanaAdapter();

    this.modal = createAppKit({
      adapters: [customWagmiAdapter, solanaAdapter],
      networks: [chains[0], ...chains.slice(1)],
      metadata,
      projectId: REOWN_PROJECT_ID,
      features: {
        analytics: true // Optional - defaults to your Cloud configuration
      }
    })
  }

  public openModal(type: 'solana' | 'eip155') {
    this.modal.open({namespace: type});
  }

  public getWalletService(){
    new SolanaWalletService()
  }

  private async  _loadEvm() {
    let libsToLoad$ = {
        wagmiCore$: from(import('@wagmi/core')),
      }
      const loadedLibs = await lastValueFrom(forkJoin(libsToLoad$));
      const { disconnect, fetchBalance, getAccount, signMessage, switchNetwork, watchAccount, reconnect, watchConnections } =
        loadedLibs.wagmiCore$;

      const web3Client = {
        disconnect,
        fetchBalance,
        getAccount,
        signMessage,
        switchNetwork,
        watchAccount,
        reconnect,
        watchConnections,
      };
    }
}
