import React, { useState } from 'react';
import { ShieldAlert, Lock, Eye } from 'lucide-react';
import type { Siswa, PelanggaranBK } from '../../types/siakad';
import { Modal } from '../ui/Modal';
import { Btn, Label, inputCls, statusPelanggaranLabel } from '../ui/kit';
import { todayISO } from '../../utils/format';

interface Props {
  siswaList: Siswa[];
  preselectedSiswaId?: string;
  pencatat: string;
  onSave: (p: Omit<PelanggaranBK, 'id'>) => void;
  onClose: () => void;
}

const STANDAR = [
  { c: 'Kedisiplinan Waktu', n: 'Terlambat Masuk Sekolah (10-20 Menit)', p: 10 },
  { c: 'Kedisiplinan Waktu', n: 'Terlambat Masuk Sekolah (>30 Menit)', p: 15 },
  { c: 'Kedisiplinan Waktu', n: 'Bolos Jam Pelajaran / Keluar Tanpa Izin', p: 20 },
  { c: 'Tata Tertib Seragam', n: 'Atribut Seragam Tidak Lengkap / Baju Dikeluarkan', p: 5 },
  { c: 'Tata Tertib Seragam', n: 'Sepatu / Kaos Kaki Tidak Sesuai Tata Tertib', p: 10 },
  { c: 'Perilaku & Ketertiban', n: 'Membawa / Mengisap Rokok Elektrik (Vape) di Sekolah', p: 50 },
  { c: 'Perilaku & Ketertiban', n: 'Terlibat Perkelahian / Tawuran Antar Pelajar', p: 75 },
  { c: 'Perilaku & Ketertiban', n: 'Membawa Senjata Tajam / Barang Terlarang', p: 100 },
  { c: 'Digital & Media', n: 'Penyalahgunaan Gawai / Konten Tidak Pantas Saat KBM', p: 25 },
];

export const AddPelanggaranModal: React.FC<Props> = ({ siswaList, preselectedSiswaId, pencatat, onSave, onClose }) => {
  const [siswaId, setSiswaId] = useState(preselectedSiswaId ?? siswaList[0]?.id ?? '');
  const [tanggal, setTanggal] = useState(todayISO());
  const [kategori, setKategori] = useState('Kedisiplinan Waktu');
  const [nama, setNama] = useState('');
  const [poin, setPoin] = useState(10);
  const [umum, setUmum] = useState('');
  const [internal, setInternal] = useState('');
  const [status, setStatus] = useState<PelanggaranBK['status']>('DALAM_PROSES');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siswaId || !nama.trim() || !umum.trim()) return;
    onSave({
      siswaId, tanggal, kategori, namaPelanggaran: nama.trim(),
      poin: Math.min(100, Math.max(1, Math.round(poin) || 1)),
      deskripsiUmum: umum.trim(),
      tindakanInternalBK: internal.trim() || 'Konseling awal teragendakan oleh Guru BK.',
      status, dicatatOleh: pencatat, isDeleted: false,
    });
    onClose();
  };

  return (
    <Modal
      title="Catat Pelanggaran & Tindakan BK" subtitle="Khusus Bimbingan Konseling" size="lg" headerClass="bg-rose-700 text-white"
      icon={<ShieldAlert className="h-5 w-5" />} onClose={onClose}
      footer={<div className="flex gap-2"><Btn tone="ghost" type="button" onClick={onClose} className="flex-1 sm:flex-none">Batal</Btn><Btn tone="rose" type="submit" form="form-pelanggaran" className="flex-[2] sm:flex-none">Simpan Catatan</Btn></div>}
    >
      <form id="form-pelanggaran" onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="pl-siswa">Siswa</Label>
            <select id="pl-siswa" value={siswaId} onChange={(e) => setSiswaId(e.target.value)} className={inputCls}>
              {siswaList.map((s) => <option key={s.id} value={s.id}>{s.namaLengkap} ({s.kelas})</option>)}
            </select></div>
          <div><Label htmlFor="pl-tgl">Tanggal Kejadian</Label>
            <input id="pl-tgl" type="date" value={tanggal} max={todayISO()} onChange={(e) => setTanggal(e.target.value)} className={inputCls} required /></div>
        </div>
        <div><Label htmlFor="pl-std">Pilih cepat dari tata tertib standar</Label>
          <select id="pl-std" defaultValue="" onChange={(e) => { const v = STANDAR.find((x) => x.n === e.target.value); if (v) { setKategori(v.c); setNama(v.n); setPoin(v.p); } }} className={`${inputCls} bg-slate-50`}>
            <option value="" disabled>— Pilih pelanggaran baku —</option>
            {STANDAR.map((v) => <option key={v.n} value={v.n}>[{v.c}] {v.n} (+{v.p})</option>)}
          </select></div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3 sm:col-span-2"><Label htmlFor="pl-nama">Perihal Pelanggaran</Label>
            <input id="pl-nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Terlambat apel pagi" className={inputCls} required /></div>
          <div className="col-span-3 sm:col-span-1"><Label htmlFor="pl-poin">Poin (1–100)</Label>
            <input id="pl-poin" type="number" inputMode="numeric" min={1} max={100} value={poin} onChange={(e) => setPoin(Number(e.target.value))} className={`${inputCls} font-bold text-rose-700`} required /></div>
        </div>
        <div>
          <Label htmlFor="pl-umum"><span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4 text-emerald-600" /> Kronologi umum (terlihat Orang Tua & Siswa)</span></Label>
          <textarea id="pl-umum" value={umum} onChange={(e) => setUmum(e.target.value)} rows={3} placeholder="Jelaskan kejadian secara objektif…" className={inputCls} required />
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-amber-900"><Lock className="h-4 w-4" /> Catatan internal BK (RAHASIA)</p>
          <p className="mb-2 text-[11px] text-amber-800">Tidak ditampilkan pada dasbor Siswa maupun Orang Tua.</p>
          <textarea value={internal} onChange={(e) => setInternal(e.target.value)} rows={3} aria-label="Catatan internal BK" placeholder="Hasil konseling, akar masalah, agenda sesi lanjutan…" className={`${inputCls} border-amber-300`} />
        </div>
        <div>
          <Label>Status Penanganan</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(statusPelanggaranLabel) as PelanggaranBK['status'][]).map((st) => (
              <button key={st} type="button" onClick={() => setStatus(st)} aria-pressed={status === st}
                className={`min-h-10 rounded-xl border px-2 text-xs font-semibold transition ${status === st ? 'border-rose-700 bg-rose-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                {statusPelanggaranLabel[st]}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
