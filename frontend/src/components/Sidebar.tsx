import React from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket, MapPin, Terminal, Award, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import byteImg from '../assets/images/byte_guide.jpg';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onOpenByteGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  onOpenByteGuide,
}) => {
  const links = [
    { name: 'Mission Control', path: '/', icon: Rocket },
    { name: 'Star Chart', path: '/sectors', icon: MapPin },
    { name: 'Java CodeLab', path: '/codelab', icon: Terminal },
    { name: 'Commendations', path: '/achievements', icon: Award },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-white/10 bg-space-900/90 backdrop-blur-lg transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Nav */}
      <div className="flex-1 py-6 px-3 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all group ${
                  isActive
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 shadow-glow-cyan/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-space-800'
                }`
              }
              title={collapsed ? link.name : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span className="truncate">{link.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Friendly Robot Guide Widget (Byte) */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onOpenByteGuide}
          className={`w-full p-2.5 rounded-xl border border-cyber-cyan/30 bg-space-950/80 hover:bg-space-850 flex items-center transition-all group ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
          title="Talk to Byte (AI Flight Companion)"
        >
          <div className="relative shrink-0">
            <img
              src={byteImg}
              alt="Byte Robot Guide"
              className="w-9 h-9 rounded-full object-cover border border-cyber-cyan/50 group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-cyber-emerald border-2 border-space-950"></span>
          </div>

          {!collapsed && (
            <div className="text-left truncate">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white font-mono">Byte</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-cyan/20 text-cyber-cyan font-mono">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">Flight Navigator Guide</p>
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-white/5 flex justify-end">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 text-xs transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
