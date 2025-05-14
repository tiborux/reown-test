import { Component } from '@angular/core';
import {ConnectComponent} from './components/connect.component';
import {BalanceComponent} from './components/transaction/balance.component';
import {WalletStore} from '../store/wallet.store';

@Component({
  selector: 'app-root',
  imports: [
    ConnectComponent,
    BalanceComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [WalletStore]
})
export class AppComponent {
  title = 'reown';
}
