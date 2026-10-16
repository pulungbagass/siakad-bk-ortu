import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** kelas warna header, mis. "bg-rose-700 text-white" */
  headerClass?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizes = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' };

/** Dialog responsif: bottom-sheet di HP, dialog tengah di layar lebar. */
export const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  icon,
  headerClass = 'bg-blue-900 text-white',
  size = 'md',
  onClose,
  children,
  footer,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs sm:items-center sm:p-4 anim-fade"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`anim-sheet flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-hidden sm:max-h-[90dvh] sm:rounded-2xl ${sizes[size]}`}
      >
        <div className={`flex shrink-0 items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-4 ${headerClass}`}>
          <div className="flex min-w-0 items-center gap-3">
            {icon && <div className="shrink-0 rounded-xl bg-white/15 p-2">{icon}</div>}
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold sm:text-lg">{title}</h3>
              {subtitle && <p className="truncate text-xs opacity-80">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-lg p-2 opacity-80 transition hover:bg-white/15 hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        {footer && (
          <div className="pb-safe shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">{footer}</div>
        )}
      </div>
    </div>
  );
};
