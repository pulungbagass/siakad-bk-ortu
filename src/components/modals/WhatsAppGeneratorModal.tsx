import React, { useMemo, useState } from 'react';
import { MessageSquare, Copy, Check, ExternalLink, Send } from 'lucide-react';
import type { Siswa, PelanggaranBK, Guru } from '../../types/siakad';
import { Modal } from '../ui/Modal';
import { Btn, Label, inputCls } from '../ui/kit';
import { generateWhatsAppMessage, generateWhatsAppToBK } from '../../utils/whatsapp';
import { copyToClipboard } from '../../utils/format';
import { useToast } from '../ui/Toast';

interface Props {
  mode: 'KE_ORTU' | 'KE_BK';
  siswa: Siswa;
  guruBK?: Guru;
  pelanggaranTerbaru?: PelanggaranBK;
  onClose: () => void;
}

export const WhatsAppGeneratorModal: React.FC<Props> = ({ mode, siswa, guruBK, pelanggaranTerbaru, onClose }) => {
  const toast = useToast();
  const [catatan, setCatatan] = useState('');
  const [copied, setCopied] = useState(false);
  const keOrtu = mode === 'KE_ORTU';

  const { message, waUrl } = useMemo(
    () => (keOrtu ? generateWhatsAppMessage(siswa, pelanggaranTerbaru, catatan) : generateWhatsAppToBK(siswa, guruBK ?? { namaLengkap: 'Guru BK', phone: '' }, catatan)),
    [keOrtu, siswa, pelanggaranTerbaru, catatan, guruBK],
  );
  const tujuan = keOrtu ? siswa.noWaOrangTua : guruBK?.phone ?? '';
  const bisaKirim = tujuan.replace(/\D/g, '').length >= 9;

  const copy = async () => {
    const ok = await copyToClipboard(message);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2200); } else toast('Gagal menyalin. Salin manual dari pratinjau.', 'error');
  };

  return (
    <Modal title={keOrtu ? 'Pesan WhatsApp ke Wali Murid' : 'Pesan WhatsApp ke Guru BK'} subtitle="Pratinjau lalu buka WhatsApp" size="lg" headerClass="bg-emerald-700 text-white" icon={<MessageSquare className="h-5 w-5" />} onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Btn tone="ghost" onClick={copy}>{copied ? <><Check className="h-4 w-4 text-emerald-600" /> Tersalin</> : <><Copy className="h-4 w-4" /> Salin Pesan</>}</Btn>
          <Btn tone="emerald" disabled={!bisaKirim} onClick={() => window.open(waUrl, '_blank', 'noopener,noreferrer')}><Send className="h-4 w-4" /> Buka WhatsApp <ExternalLink className="h-3.5 w-3.5 opacity-80" /></Btn>
        </div>
      }>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs sm:text-sm">
          <div><span className="block text-[11px] text-slate-500">Penerima</span>
            <strong className="text-slate-900">{keOrtu ? siswa.namaOrangTua : guruBK?.namaLengkap ?? 'Guru BK'}</strong>
            <span className="text-slate-600"> {keOrtu ? `(wali dari ${siswa.namaLengkap})` : '(Guru BK)'}</span></div>
          <span className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-emerald-900">{bisaKirim ? `+${tujuan.replace(/^0/, '62').replace(/\D/g, '')}` : 'Nomor belum tersedia'}</span>
        </div>
        <div><Label htmlFor="wa-note">{keOrtu ? 'Catatan khusus Guru BK (opsional)' : 'Isi pesan Anda (opsional)'}</Label>
          <textarea id="wa-note" rows={2} value={catatan} onChange={(e) => setCatatan(e.target.value)} className={`${inputCls} resize-none`}
            placeholder={keOrtu ? 'Contoh: Mohon hadir ke ruang BK hari Kamis pukul 09.00 WIB…' : 'Contoh: Mohon informasi jadwal konsultasi minggu ini…'} /></div>
        <div><Label>Pratinjau pesan</Label>
          <pre className="max-h-64 select-all overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">{message}</pre></div>
      </div>
    </Modal>
  );
};
