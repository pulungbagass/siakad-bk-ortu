import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type Kind = 'success' | 'error' | 'info';
interface ToastItem { id: number; kind: Kind; text: string }

const Ctx = createContext<(text: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(Ctx);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: number) => setItems((p) => p.filter((t) => t.id !== id)), []);
  const push = useCallback(
    (text: string, kind: Kind = 'success') => {
      const id = ++counter.current;
      setItems((p) => [...p.slice(-2), { id, kind, text }]);
      setTimeout(() => remove(id), 3800);
    },
    [remove],
  );

  const style: Record<Kind, string> = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-slate-800',
  };
  const Icon = { success: CheckCircle2, error: AlertCircle, info: Info };

  return (
    <Ctx.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="no-print pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6"
      >
        {items.map((t) => {
          const I = Icon[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className={`anim-toast pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-xl ${style[t.kind]}`}
            >
              <I className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="flex-1">{t.text}</span>
              <button onClick={() => remove(t.id)} aria-label="Tutup notifikasi" className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
};
