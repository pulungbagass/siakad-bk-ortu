import React, { useState } from 'react';
import { Award } from 'lucide-react';
import type { Siswa, NilaiAkademik } from '../../types/siakad';
import { Modal } from '../ui/Modal';
import { Badge, Btn, Label, inputCls, predikatTone } from '../ui/kit';

export const MAPEL = ['Matematika Peminatan', 'Bahasa Indonesia', 'Informatika', 'Fisika', 'Biologi', 'Kimia', 'Ekonomi', 'Sosiologi', 'Bahasa Inggris'];
export const hitungAkhir = (t: number, u: number, a: number) => Number((t * 0.3 + u * 0.35 + a * 0.35).toFixed(1));
export const hitungPredikat = (n: number): NilaiAkademik['predikat'] => (n >= 88 ? 'A' : n >= 78 ? 'B' : n >= 65 ? 'C' : 'D');
const clamp = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0));

interface Props {
  siswaList: Siswa[];
  defaultMapel?: string;
  onSave: (n: Omit<NilaiAkademik, 'id'>) => void;
  onClose: () => void;
}

export const AddNilaiModal: React.FC<Props> = ({ siswaList, defaultMapel, onSave, onClose }) => {
  const [siswaId, setSiswaId] = useState(siswaList[0]?.id ?? '');
  const [mapel, setMapel] = useState(defaultMapel && MAPEL.includes(defaultMapel) ? defaultMapel : MAPEL[0]);
  const [v, setV] = useState({ tugas: 85, uts: 80, uas: 85 });
  const akhir = hitungAkhir(clamp(v.tugas), clamp(v.uts), clamp(v.uas));
  const pred = hitungPredikat(akhir);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siswaId) return;
    onSave({ siswaId, mataPelajaran: mapel, tugas: clamp(v.tugas), uts: clamp(v.uts), uas: clamp(v.uas), nilaiAkhir: akhir, predikat: pred, semester: 'Ganjil 2026/2027' });
    onClose();
  };

  return (
    <Modal title="Input Nilai Akademik" size="sm" headerClass="bg-blue-800 text-white" icon={<Award className="h-5 w-5" />} onClose={onClose}
      footer={<div className="flex gap-2"><Btn tone="ghost" onClick={onClose} className="flex-1 sm:flex-none">Batal</Btn><Btn type="submit" form="form-nilai" className="flex-[2] sm:flex-none">Simpan Nilai</Btn></div>}>
      <form id="form-nilai" onSubmit={submit} className="space-y-4">
        <div><Label htmlFor="n-siswa">Siswa</Label>
          <select id="n-siswa" value={siswaId} onChange={(e) => setSiswaId(e.target.value)} className={inputCls}>{siswaList.map((s) => <option key={s.id} value={s.id}>{s.namaLengkap} ({s.kelas})</option>)}</select></div>
        <div><Label htmlFor="n-mapel">Mata Pelajaran</Label>
          <select id="n-mapel" value={mapel} onChange={(e) => setMapel(e.target.value)} className={inputCls}>{MAPEL.map((m) => <option key={m}>{m}</option>)}</select></div>
        <div className="grid grid-cols-3 gap-3">
          {([['tugas', 'Tugas 30%'], ['uts', 'UTS 35%'], ['uas', 'UAS 35%']] as const).map(([k, l]) => (
            <div key={k}><Label htmlFor={`n-${k}`}>{l}</Label>
              <input id={`n-${k}`} type="number" inputMode="numeric" min={0} max={100} value={v[k]} onChange={(e) => setV((p) => ({ ...p, [k]: Number(e.target.value) }))} className={`${inputCls} text-center font-bold`} required /></div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-3">
          <div><span className="block text-xs font-semibold text-blue-700">Nilai akhir otomatis</span><span className="text-2xl font-black text-blue-900">{akhir}</span></div>
          <Badge tone={predikatTone(pred)} className="px-3 py-1 text-base">{pred}</Badge>
        </div>
      </form>
    </Modal>
  );
};
