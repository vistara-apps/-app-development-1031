'use client';

import { ConnectWallet } from '@coinbase/onchainkit/wallet';

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-xl">VibeFinder</span>
        </div>
        <ConnectWallet />
      </div>
    </header>
  );
}

