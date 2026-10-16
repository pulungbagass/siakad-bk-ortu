import React from 'react';
import { Search } from 'lucide-react';

/** Kelas input seragam (≥16px di HP diatur global di index.css). */
export const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-transparent focus:outline-hidden focus:ring-2 focus:ring-blue-600';

export const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-slate-700 sm:text-sm">
    {children}
  </label>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs ${className}`}>{children}</section>
);

export const CardHeader: React.FC<{ icon?: React.ReactNode; title: string; right?: React.ReactNode }> = ({ icon, title, right }) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
    <div className="flex min-w-0 items-center gap-2">
      {icon}
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
    </div>
    {right}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; tone?: 'rose' | 'amber' | 'emerald' | 'blue' | 'slate' | 'purple'; className?: string }> = ({
  children,
  tone = 'slate',
  className = '',
}) => {
  const tones = {
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-bold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
};

export const Stat: React.FC<{
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: 'blue' | 'rose' | 'amber' | 'emerald' | 'purple' | 'slate';
}> = ({ label, value, hint, icon, tone = 'slate' }) => {
  const t = {
    blue: ['text-blue-700', 'bg-blue-50 text-blue-600'],
    rose: ['text-rose-600', 'bg-rose-50 text-rose-600'],
    amber: ['text-amber-600', 'bg-amber-50 text-amber-600'],
    emerald: ['text-emerald-600', 'bg-emerald-50 text-emerald-600'],
    purple: ['text-purple-700', 'bg-purple-50 text-purple-600'],
    slate: ['text-slate-900', 'bg-slate-100 text-slate-600'],
  }[tone];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold leading-tight text-slate-500 sm:text-xs">{label}</span>
        {icon && <span className={`shrink-0 rounded-xl p-1.5 sm:p-2 ${t[1]}`}>{icon}</span>}
      </div>
      <p className={`mt-1.5 text-2xl font-black sm:text-3xl ${t[0]}`}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
};

type Tone = 'rose' | 'purple' | 'amber' | 'blue' | 'emerald' | 'slate';
const bannerTone: Record<Tone, string> = {
  rose: 'from-rose-900 via-rose-800 to-indigo-950',
  purple: 'from-purple-900 via-indigo-900 to-slate-900',
  amber: 'from-amber-800 via-orange-900 to-slate-900',
  blue: 'from-blue-900 via-indigo-900 to-slate-900',
  emerald: 'from-emerald-900 via-teal-800 to-blue-950',
  slate: 'from-slate-900 via-blue-950 to-slate-900',
};

export const Banner: React.FC<{
  tone: Tone;
  chip?: React.ReactNode;
  title: string;
  desc?: string;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ tone, chip, title, desc, leading, actions }) => (
  <div className={`flex flex-col gap-4 rounded-2xl bg-gradient-to-r p-4 text-white shadow-lg sm:p-6 md:flex-row md:items-center md:justify-between ${bannerTone[tone]}`}>
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
      {leading}
      <div className="min-w-0">
        {chip && <div className="mb-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-0.5 text-[11px] font-semibold sm:text-xs">{chip}</div>}
        <h1 className="text-lg font-black leading-tight tracking-tight sm:text-2xl">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-xs text-white/75 sm:text-sm">{desc}</p>}
      </div>
    </div>
    {actions && <div className="grid shrink-0 grid-cols-1 gap-2 sm:flex sm:flex-wrap">{actions}</div>}
  </div>
);

export const BannerButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'light' | 'solid' }> = ({
  variant = 'light',
  className = '',
  children,
  ...rest
}) => (
  <button
    {...rest}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition active:scale-[.98] ${
      variant === 'light' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-white/20 text-white ring-1 ring-white/30 hover:bg-white/30'
    } ${className}`}
  >
    {children}
  </button>
);

export const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'blue' | 'rose' | 'emerald' | 'ghost' | 'dark' }> = ({
  tone = 'blue',
  className = '',
  children,
  ...rest
}) => {
  const tones = {
    blue: 'bg-blue-700 text-white hover:bg-blue-800 disabled:bg-slate-300',
    rose: 'bg-rose-700 text-white hover:bg-rose-800 disabled:bg-slate-300',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300',
    ghost: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50',
  };
  return (
    <button
      {...rest}
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
};

export const SearchBox: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string; className?: string }> = ({
  value,
  onChange,
  placeholder,
  className = '',
}) => (
  <div className={`relative ${className}`}>
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`${inputCls} pl-9`}
    />
  </div>
);

export const Empty: React.FC<{ icon?: React.ReactNode; title: string; desc?: string }> = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center px-6 py-10 text-center text-slate-500">
    {icon && <div className="mb-2 text-slate-300">{icon}</div>}
    <p className="text-sm font-semibold text-slate-700">{title}</p>
    {desc && <p className="mt-1 text-xs">{desc}</p>}
  </div>
);

export const predikatTone = (p: string) => (p === 'A' ? 'emerald' : p === 'B' ? 'blue' : p === 'C' ? 'amber' : 'rose') as 'emerald' | 'blue' | 'amber' | 'rose';

export const statusPelanggaranLabel: Record<string, string> = {
  DALAM_PROSES: 'Dalam Proses',
  DITANGANI: 'Ditangani',
  PANGGILAN_ORTU: 'Panggilan Ortu',
  SELESAI: 'Selesai',
};
