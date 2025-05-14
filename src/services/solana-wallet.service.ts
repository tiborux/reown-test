import {Injectable} from '@angular/core';
import {Connection, LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js';
@Injectable()
export class SolanaWalletService {
  /**
   * Gets the Sol balance of the wallet.
   *
   * @param account - The wallet address to get the balance for.
   *
   * @returns The Sol balance.
   */
  public async getBalance(account?: string | null): Promise<string> {

    const connection = await this._getConnection();

    if (!account) {
      return '0';
    }

    try {
      const walletPublicKey = new PublicKey(account);
      const balance = await connection.getBalance(walletPublicKey, 'confirmed');
      const solBalance = balance / LAMPORTS_PER_SOL;

      return `${solBalance}`;
    } catch (error) {
      console.error('Solana wallet: could not get SOL balance', error);
      return '0';
    }
  }
  private _getConnection(): Connection {
    return new Connection('https://mainnet.helius-rpc.com/?api-key=7b1d1393-bdae-4a48-9967-f583d191c720', 'confirmed');
  }
}
