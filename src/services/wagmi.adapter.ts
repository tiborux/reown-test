import type { Chain } from 'viem/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import {createStorage} from 'wagmi';
import {AppKitNetwork} from '@reown/appkit/networks';

export const REOWN_PROJECT_ID = '0ba5e6cc9cb13f1b358b4c021cef4be8';

/**
 * Creates a Wagmi adapter  with the provided chains.
 *
 * @param chains - The chains to add to the config.
 * @param storageKey - The Key prefix to use when persisting data from Wagmi.
 *
 * @returns The  adapter.
 */
export function createWagmiAdapter(chains: AppKitNetwork[], storageKey?: string): WagmiAdapter {
  return new WagmiAdapter({
    networks: [chains[0], ...chains.slice(1)],
    projectId: REOWN_PROJECT_ID,
    storage: createStorage({
      key: storageKey ?? 'wagmi',
      storage: localStorage,
    }),
  });
}
