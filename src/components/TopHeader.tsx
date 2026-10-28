import React from 'react';
import { Menu, PlayCircle, Eye, Code, KanbanSquare, Bell, UserCheck, Share2 } from 'lucide-react';

interface TopHeaderProps {
  currentTab: 'overview' | 'demo' | 'workspace' | 'kanban';
  onSelectTab: (tab: 'overview' | 'demo' | 'workspace' | 'kanban') => void;
  onToggleMobile: () => void;
  onOpenShareModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onSelectTab,
  onToggleMobile,
  onOpenShareModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top browser-like URL breadcrumb bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
          <span className="text-slate-400">myskillwallet.ai</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">dashboard</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">module</span>
          <span className="text-slate-500">/</span>
          <span className="text-blue-400 truncate">full-stack-development-mern-stack/projects/imovies-6abbb</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400 shrink-0 font-sans text-xs">
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
            Status: Review Pending
          </span>
          <span>Zoom: 100%</span>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Project Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobile}
            className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
              IMovies - Movie ticket booking made simple.
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate">
              MERN Stack Application · Express.js · MongoDB Atlas · React 19 Client
            </p>
          </div>
        </div>

        {/* Right: View switcher tabs & User profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* View Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => onSelectTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                currentTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onSelectTab('demo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap relative ${
                currentTab === 'demo'
                  ? 'bg-[#155dfc] text-white shadow-xs'
                  : 'text-blue-700 hover:text-blue-800 hover:bg-blue-50/80'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Demo Video</span>
              <span className={`w-2 h-2 rounded-full ${currentTab === 'demo' ? 'bg-amber-300' : 'bg-red-500 animate-pulse'}`} />
            </button>

            <button
              onClick={() => onSelectTab('workspace')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                currentTab === 'workspace'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => onSelectTab('kanban')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                currentTab === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Quick share button */}
          <button
            onClick={onOpenShareModal}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            title="Share project links"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Notifications */}
          <button
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              SN
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">Neha Sahin</div>
              <div className="text-[10px] text-slate-400">Student Developer</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
