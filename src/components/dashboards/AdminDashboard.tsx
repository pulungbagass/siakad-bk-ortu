import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Siswa, Guru, UserProfile, Role, KritikSaran } from '../../types/siakad';
import { Avatar } from '../ui/Avatar';
import { Badge, Banner, BannerButton, Card, CardHeader, Empty, SearchBox, Stat, inputCls } from '../ui/kit';
import { ROLE_META, ROLE_ORDER } from '../../layout/nav';
import { formatTanggalPendek } from '../../utils/format';

interface Props {
  view: string;
  siswaList: Siswa[];
  guruList: Guru[];
  usersList: UserProfile[];
  kritikList: KritikSaran[];
  onAddRole: (userId: string, role: Role) => void;
  onOpenAddSiswa: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ view, siswaList, guruList, usersList, kritikList, onAddRole, onOpenAddSiswa }) => {
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  const siswa = siswaList.filter((s) => !t || s.namaLengkap.toLowerCase().includes(t) || s.nisn.includes(t) || s.kelas.toLowerCase().includes(t));

  return (
    <div className="space-y-5">
      <Banner
        tone="slate"
        chip="Otoritas Tertinggi: Admin Akademik"
        title="Data Induk & Penugasan Role"
        desc="Kelola pengguna, tetapkan peran (add role), dan database master sekolah."
        actions={<BannerButton onClick={onOpenAddSiswa}><Plus className="h-4 w-4 text-blue-700" /> Tambah Siswa</BannerButton>}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Stat label="Siswa" value={siswaList.length} />
        <Stat label="Guru & Konselor" value={guruList.length} />
        <Stat label="Akun Pengguna" value={usersList.length} tone="blue" />
        <Stat label="Aspirasi Masuk" value={kritikList.length} tone="emerald" />
      </div>

      {view === 'roles' && (
        <Card>
          <CardHeader title="Penugasan Role Pengguna" />
          <ul className="divide-y divide-slate-100">
            {usersList.map((u) => (
              <li key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar src={u.avatarUrl} name={u.namaLengkap} className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{u.namaLengkap}</p>
                    <p className="truncate text-[11px] text-slate-500">{u.email}</p>
                  </div>
                </div>
                <select aria-label={`Role untuk ${u.namaLengkap}`} value={u.role} onChange={(e) => onAddRole(u.id, e.target.value as Role)} className={`${inputCls} sm:w-56`}>
                  {ROLE_ORDER.map((r) => <option key={r} value={r}>{r === 'USER' ? 'USER (akses terbatas)' : ROLE_META[r].label}</option>)}
                </select>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {view === 'siswa' && (
        <Card>
          <CardHeader title={`Data Induk Siswa (${siswa.length})`} right={<SearchBox value={q} onChange={setQ} placeholder="Cari nama / NISN / kelas…" className="w-full sm:w-64" />} />
          {siswa.length === 0 ? <Empty title="Siswa tidak ditemukan" /> : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-600"><tr>
                    <th className="px-4 py-2.5">Nama</th><th className="px-3 py-2.5">NISN / NIS</th><th className="px-3 py-2.5">Kelas</th><th className="px-3 py-2.5">Wali</th><th className="px-3 py-2.5">WhatsApp</th><th className="px-3 py-2.5 text-center">Poin</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {siswa.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar src={s.avatarUrl} name={s.namaLengkap} className="h-8 w-8" /><span className="font-bold text-slate-900">{s.namaLengkap}</span></div></td>
                        <td className="px-3 py-3 text-slate-600">{s.nisn} / {s.nis}</td>
                        <td className="px-3 py-3 font-medium">{s.kelas}</td>
                        <td className="px-3 py-3">{s.namaOrangTua}</td>
                        <td className="px-3 py-3 font-mono text-emerald-800">+{s.noWaOrangTua}</td>
                        <td className="px-3 py-3 text-center font-bold">{s.totalPoinPelanggaran}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="divide-y divide-slate-100 md:hidden">
                {siswa.map((s) => (
                  <li key={s.id} className="flex items-start gap-3 p-4">
                    <Avatar src={s.avatarUrl} name={s.namaLengkap} className="h-11 w-11" />
                    <div className="min-w-0 flex-1 text-xs text-slate-600">
                      <p className="truncate text-sm font-bold text-slate-900">{s.namaLengkap}</p>
                      <p>{s.kelas} • NISN {s.nisn}</p>
                      <p className="truncate">Wali: {s.namaOrangTua}</p>
                      <p className="font-mono text-emerald-800">+{s.noWaOrangTua}</p>
                    </div>
                    <Badge tone={s.totalPoinPelanggaran >= 30 ? 'rose' : 'slate'}>{s.totalPoinPelanggaran}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      )}

      {view === 'guru' && (
        <Card>
          <CardHeader title="Data Induk Guru" />
          <ul className="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-y-0 md:gap-3 md:p-3">
            {guruList.map((g) => (
              <li key={g.id} className="space-y-1 p-4 text-xs text-slate-600 md:rounded-2xl md:border md:border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{g.namaLengkap}</p>
                  <Badge tone="blue">{g.jabatan}</Badge>
                </div>
                <p>{g.mataPelajaran}</p>
                <p className="font-mono">NIP {g.nip}</p>
                <p className="break-all">{g.email}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {view === 'kritik' && (
        <Card>
          <CardHeader title="Kritik & Saran" />
          {kritikList.length === 0 ? <Empty title="Belum ada masukan" /> : (
            <ul className="space-y-3 p-4">
              {kritikList.map((k) => (
                <li key={k.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span><strong className="text-sm text-slate-900">{k.nama}</strong> <span className="text-slate-500">({ROLE_META[k.role]?.label ?? k.role})</span></span>
                    <span className="text-[11px] text-slate-400">{formatTanggalPendek(k.tanggal)}</span>
                  </div>
                  <Badge tone="blue" className="mt-1">{k.kategori}</Badge>
                  <p className="mt-2 rounded-lg border border-slate-200 bg-white p-3 leading-relaxed text-slate-700">“{k.pesan}”</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
};
