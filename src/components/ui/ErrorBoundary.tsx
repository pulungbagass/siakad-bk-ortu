import React from 'react';
import { clearPersistedState } from '../../hooks/usePersistentState';

interface State { error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[SIAKAD] Terjadi kesalahan:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">⚠️</div>
          <h1 className="text-lg font-black text-slate-900">Terjadi kesalahan</h1>
          <p className="mt-2 text-sm text-slate-600">
            Halaman tidak dapat ditampilkan. Coba muat ulang. Jika masih bermasalah, setel ulang data demo.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
            >
              Muat Ulang
            </button>
            <button
              onClick={() => {
                clearPersistedState();
                window.location.reload();
              }}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Setel Ulang Data Demo
            </button>
          </div>
        </div>
      </div>
    );
  }
}
