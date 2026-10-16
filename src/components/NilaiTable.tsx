import React from 'react';
import type { NilaiAkademik, Siswa } from '../types/siakad';
import { Badge, Empty, predikatTone } from './ui/kit';

/** Tabel nilai di layar ≥md, kartu ringkas di HP. */
export const NilaiTable: React.FC<{ items: NilaiAkademik[]; siswaList?: Siswa[] }> = ({ items, siswaList }) => {
  if (items.length === 0) return <Empty title="Belum ada nilai yang direkam" />;
  const nama = (id: string) => siswaList?.find((s) => s.id === id);

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-600">
            <tr>
              {siswaList && <th className="px-4 py-2.5">Siswa</th>}
              <th className="px-4 py-2.5">Mata Pelajaran</th>
              <th className="px-2 py-2.5 text-center">Tugas</th>
              <th className="px-2 py-2.5 text-center">UTS</th>
              <th className="px-2 py-2.5 text-center">UAS</th>
              <th className="px-2 py-2.5 text-center">Akhir</th>
              <th className="px-3 py-2.5 text-center">Predikat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((n) => {
              const s = nama(n.siswaId);
              return (
                <tr key={n.id} className="hover:bg-slate-50">
                  {siswaList && (
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {s?.namaLengkap ?? 'Siswa'} <span className="font-normal text-slate-500">({s?.kelas ?? '-'})</span>
                    </td>
                  )}
                  <td className="px-4 py-3 font-semibold text-slate-800">{n.mataPelajaran}</td>
                  <td className="px-2 py-3 text-center text-slate-600">{n.tugas}</td>
                  <td className="px-2 py-3 text-center text-slate-600">{n.uts}</td>
                  <td className="px-2 py-3 text-center text-slate-600">{n.uas}</td>
                  <td className="px-2 py-3 text-center text-sm font-extrabold text-slate-900">{n.nilaiAkhir}</td>
                  <td className="px-3 py-3 text-center"><Badge tone={predikatTone(n.predikat)}>{n.predikat}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {items.map((n) => {
          const s = nama(n.siswaId);
          return (
            <li key={n.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{n.mataPelajaran}</p>
                  {siswaList && <p className="truncate text-xs text-slate-500">{s?.namaLengkap ?? 'Siswa'} • {s?.kelas ?? '-'}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xl font-black text-slate-900">{n.nilaiAkhir}</span>
                  <Badge tone={predikatTone(n.predikat)}>{n.predikat}</Badge>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
                {[['Tugas', n.tugas], ['UTS', n.uts], ['UAS', n.uas]].map(([l, v]) => (
                  <div key={l as string} className="rounded-lg bg-slate-50 py-1.5">
                    <div>{l}</div>
                    <div className="text-sm font-bold text-slate-800">{v}</div>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
