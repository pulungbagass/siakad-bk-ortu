import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import type { DokumenTugas, Siswa } from '../../types/siakad';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Btn, Label, inputCls } from '../ui/kit';
import { MAPEL } from './AddNilaiModal';
import { imageFileToWebp, todayISO } from '../../utils/format';
import { useToast } from '../ui/Toast';

const MAX_MB = 10;

interface Props {
  siswa: Siswa;
  onSaveTugas: (t: Omit<DokumenTugas, 'id'>) => void;
  onUpdateAvatar: (url: string) => void;
  onClose: () => void;
}

export const UploadTugasModal: React.FC<Props> = ({ siswa, onSaveTugas, onUpdateAvatar, onClose }) => {
  const toast = useToast();
  const [mode, setMode] = useState<'TUGAS' | 'AVATAR'>('TUGAS');
  const [judul, setJudul] = useState('');
  const [mapel, setMapel] = useState(MAPEL[0]);
  const [file, setFile] = useState<File | null>(null);
  const [sukses, setSukses] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) { toast(`Ukuran berkas maksimal ${MAX_MB} MB`, 'error'); e.target.value = ''; return; }
    setFile(f);
  };

  const pickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { setPreview(await imageFileToWebp(f)); } catch { toast('Gambar tidak dapat diproses', 'error'); } finally { setBusy(false); }
  };

  const submitTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !file) return;
    onSaveTugas({
      siswaId: siswa.id, judulTugas: judul.trim(), mataPelajaran: mapel, namaFile: file.name,
      ukuranFile: `${(file.size / 1048576).toFixed(1)} MB`, fileUrl: '#', tanggalUnggah: todayISO(), status: 'TERKIRIM',
      catatanGuru: 'Tercatat (mode demo: berkas tidak dikirim ke server). Menunggu penilaian guru.',
    });
    setSukses(true);
    setTimeout(onClose, 1200);
  };

  return (
    <Modal title="Berkas & Foto Profil" subtitle={siswa.namaLengkap} size="md" icon={<UploadCloud className="h-5 w-5" />} onClose={onClose}>
      <div className="-mx-4 -mt-4 mb-4 flex border-b border-slate-200 bg-slate-50 text-xs sm:-mx-6 sm:-mt-6 sm:text-sm">
        {([['TUGAS', 'Kirim Tugas', FileText], ['AVATAR', 'Foto Profil', ImageIcon]] as const).map(([m, l, I]) => (
          <button key={m} onClick={() => setMode(m)} className={`flex min-h-12 flex-1 items-center justify-center gap-2 font-semibold transition ${mode === m ? 'border-b-2 border-blue-600 bg-white text-blue-700' : 'text-slate-600'}`}><I className="h-4 w-4" />{l}</button>
        ))}
      </div>

      {mode === 'TUGAS' ? (sukses ? (
        <div className="space-y-2 py-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" /><h4 className="text-base font-bold text-slate-800">Tugas tercatat</h4></div>
      ) : (
        <form onSubmit={submitTugas} className="space-y-4">
          <div><Label htmlFor="t-mapel">Mata Pelajaran</Label><select id="t-mapel" className={inputCls} value={mapel} onChange={(e) => setMapel(e.target.value)}>{MAPEL.map((m) => <option key={m}>{m}</option>)}</select></div>
          <div><Label htmlFor="t-judul">Judul Tugas</Label><input id="t-judul" className={inputCls} value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Makalah Analisis Algoritma" required /></div>
          <div><Label>Berkas (PDF, DOCX, ZIP, gambar • maks {MAX_MB} MB)</Label>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png" onChange={pickFile} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50/40">
              <UploadCloud className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              {file ? <><p className="break-all text-sm font-bold text-slate-800">{file.name}</p><p className="mt-0.5 text-xs text-slate-500">{(file.size / 1048576).toFixed(2)} MB • ketuk untuk ganti</p></> : <p className="text-sm font-semibold text-slate-700">Ketuk untuk memilih berkas</p>}
            </button></div>
          <div className="flex gap-2 pt-1"><Btn tone="ghost" type="button" onClick={onClose} className="flex-1">Batal</Btn><Btn type="submit" disabled={!file || !judul.trim()} className="flex-[2]">Kirim Tugas</Btn></div>
        </form>
      )) : (
        <div className="space-y-4 text-center">
          <Avatar src={preview ?? siswa.avatarUrl} name={siswa.namaLengkap} className="mx-auto h-28 w-28 border-4 border-blue-600/30 shadow-md" />
          <input ref={avatarRef} type="file" accept="image/*" onChange={pickAvatar} className="hidden" />
          <Btn tone="ghost" className="w-full border-blue-600 text-blue-700" disabled={busy} onClick={() => avatarRef.current?.click()}><ImageIcon className="h-4 w-4" />{busy ? 'Memproses…' : 'Pilih Foto (otomatis dikompres WebP)'}</Btn>
          <div className="flex gap-2"><Btn tone="ghost" onClick={onClose} className="flex-1">Batal</Btn>
            <Btn disabled={!preview} className="flex-[2]" onClick={() => { if (preview) { onUpdateAvatar(preview); toast('Foto profil diperbarui'); onClose(); } }}>Terapkan Foto</Btn></div>
        </div>
      )}
    </Modal>
  );
};
