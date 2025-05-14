import {Component, effect, inject, input, signal, untracked} from '@angular/core';
import {SolanaWalletService} from '../../../services/solana-wallet.service';
import {WalletStore} from '../../../store/wallet.store';

@Component({
  selector: 'app-balance',
  imports: [],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css',
  providers: [SolanaWalletService],
})
export class BalanceComponent {
  type = input<'solana' |'evm'>('solana');
  balance = signal(0)
solanaWalletService = inject(SolanaWalletService);
walletStore = inject(WalletStore);

constructor(){
  effect(() => {
    const address =  this.walletStore.solanaWallet();
    untracked(async ()=>{
      if(address && this.type() == 'solana'){
        const balance = await this.solanaWalletService.getBalance(address);
        this.balance.set(Number(balance));
      }
    })
  });
}


}
