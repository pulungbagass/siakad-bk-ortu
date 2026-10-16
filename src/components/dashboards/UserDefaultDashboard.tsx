import React from 'react';
import { ShieldAlert, Clock } from 'lucide-react';
import type { UserProfile, Role } from '../../types/siakad';
import { ROLE_META } from '../../layout/nav';
import { Btn } from '../ui/kit';

interface Props {
  currentUser: UserProfile;
  onRequestRoleChange: (r: Role) => void;
  onOpenKritik: () => void;
}

export const UserDefaultDashboard: React.FC<Props> = ({ currentUser, onRequestRoleChange, onOpenKritik }) => (
  <div className="mx-auto max-w-2xl space-y-4 py-2 sm:py-6">
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-lg sm:p-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600"><Clock className="h-8 w-8" /></div>
      <span className="inline-block rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Menunggu penetapan peran</span>
      <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Selamat Datang di Portal SIAKAD</h2>
      <p className="text-sm leading-relaxed text-slate-600">Akun <strong className="text-slate-900">{currentUser.namaLengkap}</strong> ({currentUser.email}) telah terdaftar. Admin Akademik akan menetapkan hak akses Anda.</p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs leading-relaxed text-slate-600">
        <p className="mb-1 flex items-center gap-2 font-bold text-slate-800"><ShieldAlert className="h-4 w-4 text-blue-600" /> Kebijakan akses (RBAC)</p>
        Pengguna baru hanya melihat beranda ini sampai Admin menetapkan peran: Siswa, Orang Tua, Guru Mapel, Wali Kelas, atau Guru BK.
      </div>
      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Simulasi cepat (demo)</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(['GURU_BK', 'ORANG_TUA', 'SISWA', 'WALI_KELAS', 'GURU_MAPEL', 'ADMIN'] as Role[]).map((r) => (
            <Btn key={r} tone="ghost" className="text-xs" onClick={() => onRequestRoleChange(r)}>{ROLE_META[r].label}</Btn>
          ))}
        </div>
      </div>
      <button onClick={onOpenKritik} className="text-xs font-semibold text-blue-700 hover:underline">Kirim kritik & saran</button>
    </div>
  </div>
);
