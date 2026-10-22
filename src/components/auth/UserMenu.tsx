import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from './AuthModal';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Cloud,
  ChevronDown,
  Database,
} from 'lucide-react';

interface UserMenuProps {
  compact?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ compact = false }) => {
  const { user, signOut, syncStatus, triggerManualSync, isConfigured } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [syncingManual, setSyncingManual] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleManualSync = async () => {
    setSyncingManual(true);
    await triggerManualSync();
    setSyncingManual(false);
  };

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  // If user is NOT logged in: Show both "Sign In" and "Create Account" buttons
  if (!user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => {
            setAuthMode('login');
            setAuthModalOpen(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            compact
              ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs hover:shadow-xs'
          }`}
          title="Sign in to your account"
        >
          <LogIn className="w-3.5 h-3.5 text-slate-500" />
          <span>Sign In</span>
        </button>

        <button
          onClick={() => {
            setAuthMode('signup');
            setAuthModalOpen(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
            compact
              ? 'bg-slate-900 hover:bg-slate-800 text-white'
              : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-rose-600/20'
          }`}
          title="Create a free account to sync data across devices"
        >
          <UserPlus className="w-3.5 h-3.5 text-white" />
          <span>{compact ? 'Sign Up' : 'Create Account'}</span>
        </button>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />
        <SupabaseConfigModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
        />
      </div>
    );
  }

  // If user IS logged in: Show Avatar & Sync Status Pill with Dropdown
  const displayName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all text-xs font-semibold text-slate-800"
      >
        {/* User Avatar Circle */}
        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-600 to-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
          {initial}
        </div>

        {/* User name on larger screens */}
        {!compact && (
          <span className="hidden sm:inline-block max-w-[120px] truncate">
            {displayName}
          </span>
        )}

        {/* Sync Status Icon Indicator */}
        <div className="flex items-center">
          {syncStatus === 'syncing' || syncingManual ? (
            <span title="Syncing...">
              <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            </span>
          ) : syncStatus === 'synced' ? (
            <span title="Synced to Cloud">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </span>
          ) : syncStatus === 'error' ? (
            <span title="Sync Error">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            </span>
          ) : (
            <span title="Cloud Active">
              <Cloud className="w-3.5 h-3.5 text-slate-400" />
            </span>
          )}
        </div>

        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Cross-device sync active</span>
            </div>
          </div>

          {/* Sync Button */}
          <div className="px-2 py-1.5 border-b border-slate-100">
            <button
              onClick={handleManualSync}
              disabled={syncingManual || syncStatus === 'syncing'}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <RefreshCw
                  className={`w-3.5 h-3.5 text-slate-500 ${
                    syncingManual || syncStatus === 'syncing' ? 'animate-spin text-amber-500' : ''
                  }`}
                />
                <span>Sync Now</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal capitalize">
                {syncStatus}
              </span>
            </button>
          </div>

          {/* Database Config Modal Launcher */}
          <div className="px-2 py-1 border-b border-slate-100">
            <button
              onClick={() => {
                setDropdownOpen(false);
                setConfigModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Database Settings</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="px-2 pt-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
      <SupabaseConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
      />
    </div>
  );
};
