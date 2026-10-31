import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { SpaceBackground } from './SpaceBackground';

interface AppShellProps {
  backendOnline: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ backendOnline }) => {
  return (
    <SpaceBackground>
      <div className="min-h-screen flex flex-col">
        <Navbar backendOnline={backendOnline} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500 font-mono">
          CODEVOYAGE &bull; Authentic Java 21 Educational Adventure
        </footer>
      </div>
    </SpaceBackground>
  );
};
