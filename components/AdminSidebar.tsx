import React, { useEffect, useState } from 'react';
import { LogOut, PanelLeftClose, PanelLeftOpen, UserCircle2, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LOGO_URL } from '../constants';

const SIDEBAR_STORAGE_KEY = 'lifewood_admin_sidebar_minimized';
const MINIMIZED_LOGO_URL = '/lifewood_minimized_logo_ver.png';

export type AdminSidebarItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick: () => void;
};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onSignOut: () => void;
  onHome: () => void;
  profileName: string;
  profileRole: string;
  avatarSrc?: string;
  items: AdminSidebarItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  onEditProfile,
  onSignOut,
  onHome,
  profileName,
  profileRole,
  avatarSrc,
  items
}) => {
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isMinimized));
  }, [isMinimized]);

  const isDesktopMinimized = isMinimized;

  const renderAvatar = (sizeClass: string) => (
    avatarSrc ? (
      <img src={avatarSrc} alt="Admin avatar" className={`${sizeClass} rounded-full border border-white/20 object-cover`} />
    ) : (
      <div className={`${sizeClass} flex items-center justify-center rounded-full bg-white/10 text-white`}>
        <UserCircle2 className="h-7 w-7" />
      </div>
    )
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-[130] w-[290px] border-r border-lifewood-serpent/10 bg-lifewood-serpent text-white transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktopMinimized ? 'lg:w-24' : 'lg:w-[290px]'}`}
      >
        <div className={`relative border-b border-white/10 px-4 py-4 ${isDesktopMinimized ? 'flex flex-col items-center gap-3 lg:px-3' : 'flex items-center justify-between gap-3'}`}>
          {isDesktopMinimized ? (
            <>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                aria-label="Toggle sidebar size"
                title="Expand"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onHome}
                className="group flex items-center justify-center rounded-xl p-2 transition hover:bg-white/5"
                aria-label="Go to home"
              >
                <img src={MINIMIZED_LOGO_URL} alt="Lifewood" className="h-12 w-12 rounded-full object-cover lg:h-14 lg:w-14" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onHome}
                className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-white/5"
                aria-label="Go to home"
              >
                <img src={LOGO_URL} alt="Lifewood" className="h-5 w-auto max-w-[120px] object-contain" />
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-lifewood-yellow">
                  ADMIN
                </span>
              </button>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsMinimized((prev) => !prev)}
                  className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white lg:inline-flex"
                  aria-label="Toggle sidebar size"
                  title="Collapse"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="px-4 pt-4">
          {isDesktopMinimized ? (
            <button
              type="button"
              onClick={onEditProfile}
              className="group relative mx-auto hidden rounded-2xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 lg:flex"
              aria-label="Edit profile"
              title="Profile"
            >
              {renderAvatar('h-12 w-12')}
              <span className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0d2619] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">
                {profileName || 'Profile'}
              </span>
            </button>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {renderAvatar('h-12 w-12')}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{profileName || 'Admin Profile'}</p>
                    <p className="truncate text-xs text-white/65">{profileRole || 'Internal Access'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          {items.map((item) => {
            const Icon = item.icon;
            const baseClasses = item.active
              ? 'bg-lifewood-green text-white shadow-lg shadow-lifewood-green/30'
              : 'text-white/70 hover:bg-white/10 hover:text-white';

            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`group relative flex items-center rounded-xl px-4 py-3 text-sm transition ${
                  isDesktopMinimized ? 'justify-center lg:px-0' : 'gap-3'
                } ${item.active ? 'font-semibold' : 'font-medium'} ${baseClasses}`}
                aria-label={item.label}
                title={isDesktopMinimized ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isDesktopMinimized && <span className="truncate">{item.label}</span>}
                {isDesktopMinimized && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-10 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0d2619] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto px-4 pb-4">
          <button
            type="button"
            onClick={onSignOut}
            className={`group relative flex w-full items-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white ${
              isDesktopMinimized ? 'justify-center lg:px-0' : 'gap-3'
            }`}
            aria-label="Sign out"
            title={isDesktopMinimized ? 'Sign out' : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isDesktopMinimized && <span>Sign out</span>}
            {isDesktopMinimized && (
              <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#0d2619] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block lg:block lg:opacity-0 lg:group-hover:opacity-100">
                Sign out
              </span>
            )}
          </button>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[1px] lg:hidden"
        />
      )}
    </>
  );
};
