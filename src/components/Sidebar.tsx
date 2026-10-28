import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Wallet,
  CreditCard,
  Coins,
  Settings,
  Sparkles,
  Bot,
  Clock,
  Star,
  Film,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenDemoVideo: () => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  onOpenDemoVideo,
  mobileOpen,
  onToggleMobile,
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skill-bank', label: 'Skill Bank', icon: Building2 },
    { id: 'skill-wallet', label: 'Skill Wallet', icon: Wallet, active: true },
    { id: 'skill-card', label: 'Skill Card', icon: CreditCard },
    { id: 'skill-credits', label: 'Skill Credits', icon: Coins },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onToggleMobile}
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen flex transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Leftmost Mini Icon Rail */}
        <div className="w-12 bg-[#0c3bb8] flex flex-col items-center py-4 justify-between border-r border-[#194ddc] text-white/70">
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => onSelectNav('skill-wallet')}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
              title="Quick Home"
            >
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-white font-bold text-xs">
                SW
              </div>
            </button>
            <button
              onClick={onOpenDemoVideo}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-300 hover:bg-white/10 transition-colors"
              title="Play IMovies Demo Video"
            >
              <Film className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
              title="SkillBot AI Assistant"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
              title="History"
            >
              <Clock className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
              title="Bookmarked Projects"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>

          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
            title="System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Blue Sidebar */}
        <div className="w-60 bg-[#155dfc] text-white flex flex-col justify-between py-5 px-3 shadow-xl">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-between px-2 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-extrabold tracking-wide text-sm leading-tight uppercase">
                    SKILL WALLET
                  </div>
                  <div className="text-[10px] text-white/70 font-medium">
                    A SkillAngels Product
                  </div>
                </div>
              </div>

              {/* Mobile close button */}
              <button
                onClick={onToggleMobile}
                className="p-1 rounded-md text-white/80 hover:bg-white/10 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectNav(item.id);
                      if (mobileOpen) onToggleMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? 'bg-white/20 text-white shadow-xs backdrop-blur-xs'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Demo Video Shortcut Pill */}
            <div className="mt-8 mx-1 p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-white">
                  <Film className="w-3.5 h-3.5 text-amber-300" /> Demo Video
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-slate-900 font-bold uppercase">
                  Available
                </span>
              </div>
              <p className="text-[11px] text-white/80 leading-snug mb-2.5">
                Watch full walkthrough of IMovies ticket booking & seat matrix.
              </p>
              <button
                onClick={onOpenDemoVideo}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white text-[#155dfc] text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>▶ Watch Demo (03:15)</span>
              </button>
            </div>
          </div>

          {/* Bottom Project Module Tag */}
          <div className="pt-4 border-t border-white/15 px-2">
            <div className="text-[11px] text-white/70">Current Course Track</div>
            <div className="text-xs font-bold truncate text-white mt-0.5">
              Full Stack Development (MERN)
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
