import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Megaphone, 
  HelpCircle, 
  Settings, 
  Code2, 
  MessageSquare
} from 'lucide-react';
import { GuaranteeRecord } from '../types';

interface HeaderProps {
  records?: GuaranteeRecord[];
  onOpenNewModal?: () => void;
  onOpenUploadModal?: () => void;
  onResetData?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="sticky top-0 z-30 shadow-md">
      {/* SharePoint Top Suite Bar */}
      <div className="bg-black text-white border-b border-black">
        <div className="w-full px-3 sm:px-4 h-12 flex items-center justify-between gap-3">
          {/* Left section: App Launcher 9-dots, SharePoint Brand & Bank Guarantee Tracker Name */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* 9-dot Waffle Microsoft App Launcher */}
            <button
              type="button"
              className="p-1.5 hover:bg-neutral-800 text-white rounded transition-colors flex items-center justify-center"
              title="App launcher"
              aria-label="App launcher"
            >
              <div className="grid grid-cols-3 gap-0.5 w-4 h-4 p-0.5">
                {[...Array(9)].map((_, i) => (
                  <span key={i} className="w-1 h-1 bg-white rounded-xs"></span>
                ))}
              </div>
            </button>

            {/* SharePoint Name */}
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-sm sm:text-base tracking-tight select-none">
                SharePoint
              </span>

              {/* User Avatar Badge "YD" */}
              <div 
                className="w-7 h-7 rounded-full border border-white/60 bg-transparent text-white font-semibold text-xs flex items-center justify-center hover:bg-neutral-800 cursor-pointer select-none transition-colors"
                title="Account manager (YD)"
              >
                YD
              </div>
            </div>
          </div>

          {/* Middle section: Search Box */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-[#0078d4] pointer-events-none flex items-center justify-center">
                <Search className="w-4 h-4 text-[#0078d4] stroke-[2.2]" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search this site"
                className="w-full h-8 pl-9 pr-3 text-xs sm:text-sm bg-white text-black placeholder:text-neutral-500 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0078d4] transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Right section: Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 text-white shrink-0">
            {/* Developer / Code icon */}
            <button
              type="button"
              className="p-1.5 hover:bg-neutral-800 rounded transition-colors text-white"
              title="Developer resources"
              aria-label="Developer resources"
            >
              <Code2 className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* Megaphone / What's new icon */}
            <button
              type="button"
              className="p-1.5 hover:bg-neutral-800 rounded transition-colors text-white"
              title="Announcements"
              aria-label="Announcements"
            >
              <Megaphone className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* Feedback / User message icon */}
            <button
              type="button"
              className="p-1.5 hover:bg-neutral-800 rounded transition-colors text-white"
              title="Feedback"
              aria-label="Feedback"
            >
              <MessageSquare className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* Settings gear icon */}
            <button
              type="button"
              className="p-1.5 hover:bg-neutral-800 rounded transition-colors text-white"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* Help question mark icon */}
            <button
              type="button"
              className="p-1.5 hover:bg-neutral-800 rounded transition-colors text-white"
              title="Help"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
