import React, { useState } from 'react';
import {
  GraduationCap, Repeat, MessageSquarePlus, FileCode2, RotateCcw, Menu as MenuIcon, ChevronRight, FlaskConical,
} from 'lucide-react';
import type { Role, UserProfile } from '../types/siakad';
import { ROLE_META, ROLE_ORDER } from './nav';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';

interface Props {
  user: UserProfile;
  view: string;
  onView: (id: string) => void;
  onSwitchRole: (r: Role) => void;
  onOpenKritik: () => void;
  onOpenDocs: () => void;
  onReset: () => void;
  children: React.ReactNode;
}

const Brand: React.FC = () => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-600 text-white shadow-md">
      <GraduationCap className="h-6 w-6" />
    </div>
    <div className="leading-tight">
      <div className="text-base font-extrabold tracking-tight text-slate-900">
        SIAKAD<span className="text-blue-700">.BK</span>
      </div>
      <div className="text-[11px] text-slate-500">SMA Negeri 1 Teladan</div>
    </div>
  </div>
);

export const AppShell: React.FC<Props> = ({ user, view, onView, onSwitchRole, onOpenKritik, onOpenDocs, onReset, children }) => {
  const [roleSheet, setRoleSheet] = useState(false);
  const [menuSheet, setMenuSheet] = useState(false);
  const meta = ROLE_META[user.role];

  const RoleChip = (
    <button
      onClick={() => setRoleSheet(true)}
      className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-left transition hover:bg-slate-200/70"
      aria-label="Ganti peran demo"
    >
      <Repeat className="h-4 w-4 text-slate-500" />
      <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${meta.tone}`}>{meta.label}</span>
    </button>
  );

  const SideLink: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-dvh lg:flex">
      {/* ===== Sidebar desktop ===== */}
      <aside className="no-print sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex xl:w-72">
        <Brand />
        <div className="mt-6 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Menu {meta.label}</div>
        <nav className="space-y-1" aria-label="Navigasi utama">
          {meta.nav.map((n) => {
            const I = n.icon;
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onView(n.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <I className="h-[18px] w-[18px]" />
                {n.label}
                {active && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-slate-100 pt-3">
          <SideLink onClick={onOpenKritik} icon={<MessageSquarePlus className="h-4 w-4 text-blue-600" />} label="Kritik & Saran" />
          <SideLink onClick={onOpenDocs} icon={<FileCode2 className="h-4 w-4 text-indigo-600" />} label="Roadmap Backend" />
          <SideLink onClick={onReset} icon={<RotateCcw className="h-4 w-4 text-slate-500" />} label="Setel Ulang Data Demo" />
          <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
            <Avatar src={user.avatarUrl} name={user.namaLengkap} className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{user.namaLengkap}</p>
              <p className="truncate text-[11px] text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="pt-1">{RoleChip}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ===== Top bar mobile/tablet ===== */}
        <header className="no-print pt-safe sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md lg:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <Brand />
            <div className="flex items-center gap-2">
              {RoleChip}
              <Avatar src={user.avatarUrl} name={user.namaLengkap} className="h-9 w-9" />
            </div>
          </div>
        </header>

        {/* Banner mode demo */}
        <div className="no-print flex items-center justify-center gap-2 bg-amber-50 px-4 py-1.5 text-center text-[11px] font-medium text-amber-900 sm:text-xs">
          <FlaskConical className="h-3.5 w-3.5 shrink-0" />
          Mode demo — data contoh tersimpan di perangkat ini, tanpa login.
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-28 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10">{children}</main>

        <footer className="no-print hidden border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 lg:block">
          © {new Date().getFullYear()} SIAKAD SMA Negeri 1 Teladan Bangsa
        </footer>
      </div>

      {/* ===== Bottom nav mobile ===== */}
      <nav
        aria-label="Navigasi bawah"
        className="no-print pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto flex max-w-xl items-stretch justify-around px-1">
          {meta.nav.slice(0, 4).map((n) => {
            const I = n.icon;
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onView(n.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold transition ${
                  active ? 'text-blue-800' : 'text-slate-500'
                }`}
              >
                <span className={`rounded-full px-4 py-1 transition ${active ? 'bg-blue-100' : ''}`}>
                  <I className="h-5 w-5" />
                </span>
                {n.label}
              </button>
            );
          })}
          <button
            onClick={() => setMenuSheet(true)}
            className="flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold text-slate-500"
          >
            <span className="px-4 py-1">
              <MenuIcon className="h-5 w-5" />
            </span>
            Menu
          </button>
        </div>
      </nav>

      {/* ===== Sheet: ganti role ===== */}
      {roleSheet && (
        <Modal title="Ganti Peran (Demo)" subtitle="Simulasi hak akses tiap pengguna" size="sm" onClose={() => setRoleSheet(false)} icon={<Repeat className="h-5 w-5" />}>
          <div className="grid gap-2">
            {ROLE_ORDER.map((r) => {
              const active = r === user.role;
              return (
                <button
                  key={r}
                  onClick={() => {
                    onSwitchRole(r);
                    setRoleSheet(false);
                  }}
                  className={`flex min-h-12 items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition ${
                    active ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${ROLE_META[r].tone}`}>{ROLE_META[r].label}</span>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {/* ===== Sheet: menu lainnya (mobile) ===== */}
      {menuSheet && (
        <Modal title="Menu" size="sm" onClose={() => setMenuSheet(false)} icon={<MenuIcon className="h-5 w-5" />}>
          <div className="grid gap-2">
            {[
              { l: 'Kritik & Saran', i: <MessageSquarePlus className="h-5 w-5 text-blue-600" />, a: onOpenKritik },
              { l: 'Roadmap Backend', i: <FileCode2 className="h-5 w-5 text-indigo-600" />, a: onOpenDocs },
              { l: 'Setel Ulang Data Demo', i: <RotateCcw className="h-5 w-5 text-slate-500" />, a: onReset },
            ].map((x) => (
              <button
                key={x.l}
                onClick={() => {
                  setMenuSheet(false);
                  x.a();
                }}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {x.i}
                {x.l}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Avatar src={user.avatarUrl} name={user.namaLengkap} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{user.namaLengkap}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
