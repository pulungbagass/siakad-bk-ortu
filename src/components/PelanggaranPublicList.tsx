import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { PelanggaranBK } from '../types/siakad';
import { Badge, Empty, statusPelanggaranLabel } from './ui/kit';
import { formatTanggalPendek } from '../utils/format';

/** Daftar pelanggaran untuk Orang Tua / Siswa. Catatan internal BK TIDAK pernah ditampilkan. */
export const PelanggaranPublicList: React.FC<{ items: PelanggaranBK[] }> = ({ items }) => {
  if (items.length === 0)
    return <Empty icon={<CheckCircle className="h-10 w-10 text-emerald-500" />} title="Tidak ada catatan pelanggaran" desc="Tata tertib sekolah dijaga dengan sangat baik." />;
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((p) => (
        <li key={p.id} className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900">{p.namaPelanggaran}</h4>
              <p className="text-[11px] text-slate-500">{formatTanggalPendek(p.tanggal)} • {p.kategori}</p>
            </div>
            <Badge tone="rose">+{p.poin} Poin</Badge>
          </div>
          <p className="rounded-lg border border-slate-200/70 bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-700">{p.deskripsiUmum}</p>
          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500">
            <span>Status: <strong className="text-slate-800">{statusPelanggaranLabel[p.status]}</strong></span>
            <span>Dicatat: {p.dicatatOleh}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
