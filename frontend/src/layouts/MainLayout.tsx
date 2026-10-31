import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Starfield } from '../game/Starfield';

interface MainLayoutProps {
  backendOnline: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ backendOnline }) => {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-100">
      <Starfield />
      <Navbar backendOnline={backendOnline} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 font-mono">
        CODEVOYAGE ARCHITECTURE FOUNDATION &copy; 2026 &bull; REAL JAVA SPACE ADVENTURE &bull; SPRING BOOT + DOCKER SANDBOX + REACT
      </footer>
    </div>
  );
};
