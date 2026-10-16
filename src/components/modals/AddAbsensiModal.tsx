import React, { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import type { Siswa, AbsensiRecord, StatusAbsensi } from '../../types/siakad';
import { Modal } from '../ui/Modal';
import { Btn, inputCls } from '../ui/kit';
import { todayISO } from '../../utils/format';

const STATUS: StatusAbsensi[] = ['HADIR', 'SAKIT', 'IZIN', 'ALPA'];
const ON = { HADIR: 'bg-emerald-600 text-white', SAKIT: 'bg-amber-500 text-white', IZIN: 'bg-blue-600 text-white', ALPA: 'bg-rose-600 text-white' };

interface Props {
  siswaList: Siswa[];
  kelasName: string;
  onSaveBatch: (r: Omit<AbsensiRecord, 'id'>[]) => void;
  onClose: () => void;
}

export const AddAbsensiModal: React.FC<Props> = ({ siswaList, kelasName, onSaveBatch, onClose }) => {
  const [tanggal, setTanggal] = useState(todayISO());
  const [data, setData] = useState<Record<string, { status: StatusAbsensi; ket: string }>>(() =>
    Object.fromEntries(siswaList.map((s) => [s.id, { status: 'HADIR' as StatusAbsensi, ket: '' }])));

  const set = (id: string, patch: Partial<{ status: StatusAbsensi; ket: string }>) => setData((p) => ({ ...p, [id]: { ...p[id]!, ...patch } }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBatch(siswaList.map((s) => ({ siswaId: s.id, tanggal, status: data[s.id]?.status ?? 'HADIR', keterangan: data[s.id]?.ket.trim() || undefined })));
    onClose();
  };

  return (
    <Modal title="Presensi Harian Kelas" subtitle={`Kelas ${kelasName} • ${siswaList.length} siswa`} size="lg" headerClass="bg-purple-800 text-white" icon={<CalendarCheck className="h-5 w-5" />} onClose={onClose}
      footer={<div className="flex gap-2"><Btn tone="ghost" onClick={onClose} className="flex-1 sm:flex-none">Batal</Btn><Btn type="submit" form="form-absen" className="flex-[2] sm:flex-none">Simpan Presensi</Btn></div>}>
      <form id="form-absen" onSubmit={submit} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">Tanggal
            <input type="date" value={tanggal} max={todayISO()} onChange={(e) => setTanggal(e.target.value)} className={`${inputCls} w-auto`} required /></label>
          <Btn tone="emerald" type="button" className="text-xs" onClick={() => setData(Object.fromEntries(siswaList.map((s) => [s.id, { status: 'HADIR' as StatusAbsensi, ket: '' }])))}>Set semua Hadir</Btn>
        </div>
        {siswaList.length === 0 && <p className="py-6 text-center text-sm text-slate-500">Tidak ada siswa di kelas ini.</p>}
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
          {siswaList.map((s) => {
            const cur = data[s.id] ?? { status: 'HADIR' as StatusAbsensi, ket: '' };
            return (
              <li key={s.id} className="space-y-2 p-3">
                <div><p className="text-sm font-bold text-slate-900">{s.namaLengkap}</p><p className="text-[11px] text-slate-500">NISN {s.nisn}</p></div>
                <div className="grid grid-cols-4 gap-1.5">
                  {STATUS.map((st) => (
                    <button key={st} type="button" aria-pressed={cur.status === st} onClick={() => set(s.id, { status: st })}
                      className={`min-h-10 rounded-lg text-[11px] font-bold transition sm:text-xs ${cur.status === st ? ON[st] : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{st}</button>
                  ))}
                </div>
                {cur.status !== 'HADIR' && <input value={cur.ket} onChange={(e) => set(s.id, { ket: e.target.value })} placeholder="Keterangan…" aria-label={`Keterangan ${s.namaLengkap}`} className={inputCls} />}
              </li>
            );
          })}
        </ul>
      </form>
    </Modal>
  );
};
