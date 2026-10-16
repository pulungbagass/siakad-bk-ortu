import React, { useState } from 'react';
import { MessageSquarePlus, Send, HeartHandshake } from 'lucide-react';
import type { KritikSaran, UserProfile } from '../../types/siakad';
import { Modal } from '../ui/Modal';
import { Btn, Label, inputCls } from '../ui/kit';
import { ROLE_META } from '../../layout/nav';
import { todayISO } from '../../utils/format';

const KAT: KritikSaran['kategori'][] = ['Layanan BK', 'Akademik', 'Fasilitas', 'Sistem'];

interface Props { currentUser: UserProfile; onSaveKritik: (k: Omit<KritikSaran, 'id'>) => void; onClose: () => void }

export const KritikSaranModal: React.FC<Props> = ({ currentUser, onSaveKritik, onClose }) => {
  const [kategori, setKategori] = useState<KritikSaran['kategori']>('Layanan BK');
  const [pesan, setPesan] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan.trim()) return;
    onSaveKritik({ nama: currentUser.namaLengkap, role: currentUser.role, kategori, pesan: pesan.trim(), tanggal: todayISO() });
    setDone(true);
    setTimeout(onClose, 1300);
  };

  return (
    <Modal title="Kritik & Saran" subtitle="Suara siswa, orang tua, dan civitas" size="sm" headerClass="bg-slate-900 text-white" icon={<MessageSquarePlus className="h-5 w-5" />} onClose={onClose}
      footer={!done && <div className="flex gap-2"><Btn tone="ghost" onClick={onClose} className="flex-1 sm:flex-none">Batal</Btn><Btn type="submit" form="form-kritik" disabled={!pesan.trim()} className="flex-[2] sm:flex-none"><Send className="h-4 w-4" /> Kirim</Btn></div>}>
      {done ? (
        <div className="space-y-2 py-6 text-center"><HeartHandshake className="mx-auto h-12 w-12 text-blue-600" /><h4 className="text-base font-bold text-slate-800">Terima kasih atas masukan Anda!</h4><p className="text-xs text-slate-600">Masukan diteruskan ke manajemen sekolah.</p></div>
      ) : (
        <form id="form-kritik" onSubmit={submit} className="space-y-4">
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">Pengirim: <strong className="text-slate-900">{currentUser.namaLengkap}</strong> ({ROLE_META[currentUser.role].label})</p>
          <div><Label>Kategori</Label>
            <div className="grid grid-cols-2 gap-2">{KAT.map((c) => (
              <button key={c} type="button" aria-pressed={kategori === c} onClick={() => setKategori(c)} className={`min-h-10 rounded-xl border text-xs font-semibold transition ${kategori === c ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>{c}</button>))}</div></div>
          <div><Label htmlFor="k-pesan">Isi masukan</Label><textarea id="k-pesan" rows={4} value={pesan} onChange={(e) => setPesan(e.target.value)} maxLength={1000} placeholder="Tuliskan aspirasi atau ide Anda…" className={inputCls} required /></div>
        </form>
      )}
    </Modal>
  );
};
