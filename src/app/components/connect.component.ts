import { Component, inject, input, OnInit, signal} from '@angular/core';
import {AppKitService} from '../../services/app-kit.service';
import {AppKit, Metadata} from '@reown/appkit';
import {AppKitNetwork, bsc, mainnet, solana} from '@reown/appkit/networks';
import {WalletStore} from '../../store/wallet.store';
import {Connection, PublicKey, SystemProgram, Transaction} from '@solana/web3.js';

@Component({
  selector: 'app-connect',
  imports: [],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css',
  providers: [AppKitService],
})
export class ConnectComponent implements OnInit {
 appKitService =  inject(AppKitService);
 address =signal<string | null>('')
 metadata: Metadata = {
   name: 'AppKit',
   description: 'AppKit Example',
   url: window.location.origin, // origin must match your domain & subdomain
   icons: ['https://avatars.githubusercontent.com/u/179229932']
 }

 networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet,bsc, solana]

  modal!: AppKit;
 type = input<'solana' | 'eip155'>('eip155');
 walletStore = inject(WalletStore)
   solanaProvider: any = {} ;
   solanaConnection: any= {};
  async ngOnInit() {

    this.appKitService.createAppKit(this.networks, this.metadata, this.type());
    /*  if(this.type() === 'eip155') {
        web3Client.reconnect(this.wagmiAdapter.wagmiConfig);
        web3Client.watchAccount(this.wagmiAdapter.wagmiConfig, {
          onChange: async ({isConnected, address}) => {
            if(isConnected && address && this.type() === 'eip155' ) {
              this.walletStore.updateEvmWallet(address);
              this.address.set(this.walletStore.evmWallet());
            } else{
              this.walletStore.updateEvmWallet('');
              this.address.set('');
            }
          },
        });
      }*/
    if (this.type() === 'solana') {
this.modal.subscribeAccount(async account => {
  if(account.status === 'connected' && account.address && account.caipAddress?.includes('solana')) {
    this.walletStore.updateSolanaWallet(account.address);
    this.address.set(this.walletStore.solanaWallet());
  } else if (account.caipAddress?.includes('solana')){
    this.walletStore.updateSolanaWallet('');
    this.address.set('');
  }
})
    }

    this.modal.subscribeProviders(state => {
      this.solanaProvider = state['solana'] as any;
      const url =   this.solanaProvider.getActiveChain().rpcUrls.default.http[0];
      this.solanaConnection = new Connection(url);
    })
    }

  async connect(){
    if(this.type() === 'eip155'){
      this.appKitService.openModal('eip155');
    }
    else{
      this.appKitService.openModal('solana');
    }
  }

  disconnect(){
    this.modal.disconnect(this.type());
  }

  async sendTransaction(){
    if (!this.walletStore.solanaWallet() || !this.solanaConnection) throw Error('user is disconnected');

    const wallet = new PublicKey(this.walletStore.solanaWallet());
    if (!wallet) throw Error('wallet provider is not available');

    const latestBlockhash = await this.solanaConnection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: wallet,
      recentBlockhash: latestBlockhash?.blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: wallet,
        toPubkey: new PublicKey('56pcLGoCCeh3DzJynHqjc8Uro6TzUbq29HEcLP5xoZou'), // destination address
        lamports: 1000,
      })
    );

    return await this.solanaProvider.sendTransaction(transaction, this.solanaConnection);
  }
}
