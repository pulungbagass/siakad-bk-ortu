import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Siswa } from '../../types/siakad';
import { Modal } from '../ui/Modal';
import { Btn, Label, inputCls } from '../ui/kit';
import { normalizePhone } from '../../utils/format';

interface Props {
  kelasOptions: string[];
  existingNisn: string[];
  onSave: (s: Omit<Siswa, 'id' | 'totalPoinPelanggaran'>) => void;
  onClose: () => void;
}

export const AddSiswaModal: React.FC<Props> = ({ kelasOptions, existingNisn, onSave, onClose }) => {
  const [f, setF] = useState({ nama: '', nisn: '', nis: '', kelas: kelasOptions[0] ?? 'X-IPA-1', jk: 'L' as 'L' | 'P', ortu: '', wa: '', alamat: '' });
  const [err, setErr] = useState('');
  const up = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(f.nisn)) return setErr('NISN harus 10 digit angka.');
    if (existingNisn.includes(f.nisn)) return setErr('NISN sudah terdaftar.');
    const wa = normalizePhone(f.wa);
    if (!/^62\d{8,13}$/.test(wa)) return setErr('Nomor WhatsApp tidak valid (contoh: 081234567890).');
    onSave({
      nisn: f.nisn, nis: f.nis.trim(), namaLengkap: f.nama.trim(), kelas: f.kelas, jenisKelamin: f.jk,
      namaOrangTua: f.ortu.trim(), noWaOrangTua: wa, alamat: f.alamat.trim() || '-', avatarUrl: '',
    });
    onClose();
  };

  return (
    <Modal title="Tambah Siswa Baru" subtitle="Database master sekolah" size="md" icon={<UserPlus className="h-5 w-5" />} onClose={onClose}
      footer={<div className="flex gap-2"><Btn tone="ghost" onClick={onClose} className="flex-1 sm:flex-none">Batal</Btn><Btn type="submit" form="form-siswa" className="flex-[2] sm:flex-none">Simpan Siswa</Btn></div>}>
      <form id="form-siswa" onSubmit={submit} className="space-y-3.5">
        <div><Label htmlFor="s-nama">Nama Lengkap</Label><input id="s-nama" className={inputCls} value={f.nama} onChange={(e) => up('nama', e.target.value)} placeholder="Dimas Aditya Pratama" required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label htmlFor="s-nisn">NISN (10 digit)</Label><input id="s-nisn" inputMode="numeric" maxLength={10} className={inputCls} value={f.nisn} onChange={(e) => up('nisn', e.target.value.replace(/\D/g, ''))} placeholder="0078291029" required /></div>
          <div><Label htmlFor="s-nis">NIS</Label><input id="s-nis" inputMode="numeric" className={inputCls} value={f.nis} onChange={(e) => up('nis', e.target.value.replace(/\D/g, ''))} placeholder="2324106" required /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label htmlFor="s-kelas">Kelas</Label><select id="s-kelas" className={inputCls} value={f.kelas} onChange={(e) => up('kelas', e.target.value)}>{kelasOptions.map((k) => <option key={k}>{k}</option>)}</select></div>
          <div><Label htmlFor="s-jk">Jenis Kelamin</Label><select id="s-jk" className={inputCls} value={f.jk} onChange={(e) => up('jk', e.target.value)}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
        </div>
        <div><Label htmlFor="s-ortu">Nama Orang Tua / Wali</Label><input id="s-ortu" className={inputCls} value={f.ortu} onChange={(e) => up('ortu', e.target.value)} required /></div>
        <div><Label htmlFor="s-wa">WhatsApp Wali</Label><input id="s-wa" type="tel" inputMode="tel" className={inputCls} value={f.wa} onChange={(e) => up('wa', e.target.value)} placeholder="081234567890 atau 6281234567890" required /></div>
        <div><Label htmlFor="s-alamat">Alamat (opsional)</Label><input id="s-alamat" className={inputCls} value={f.alamat} onChange={(e) => up('alamat', e.target.value)} /></div>
        {err && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{err}</p>}
      </form>
    </Modal>
  );
};
