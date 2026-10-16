import React, { useMemo, useState } from 'react';
import { ShieldAlert, MessageSquare, PlusCircle, AlertTriangle, CheckCircle2, Clock, Lock } from 'lucide-react';
import type { Siswa, PelanggaranBK } from '../../types/siakad';
import { Avatar } from '../ui/Avatar';
import { Badge, Banner, BannerButton, Btn, Card, CardHeader, Empty, SearchBox, Stat, inputCls, statusPelanggaranLabel } from '../ui/kit';
import { formatTanggalPendek } from '../../utils/format';

interface Props {
  view: string;
  siswaList: Siswa[];
  pelanggaranList: PelanggaranBK[];
  onOpenAddPelanggaran: (siswaId?: string) => void;
  onOpenWhatsApp: (siswa: Siswa, pelanggaran?: PelanggaranBK) => void;
  onUpdateStatusPelanggaran: (id: string, s: PelanggaranBK['status']) => void;
}

const statusTone = {
  SELESAI: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  PANGGILAN_ORTU: 'bg-rose-50 text-rose-800 border-rose-300',
  DITANGANI: 'bg-blue-50 text-blue-800 border-blue-300',
  DALAM_PROSES: 'bg-amber-50 text-amber-800 border-amber-300',
} as const;

export const GuruBKDashboard: React.FC<Props> = ({ view, siswaList, pelanggaranList, onOpenAddPelanggaran, onOpenWhatsApp, onUpdateStatusPelanggaran }) => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('ALL');

  const kasusAktif = pelanggaranList.filter((p) => p.status === 'DALAM_PROSES' || p.status === 'PANGGILAN_ORTU').length;
  const berisiko = useMemo(() => siswaList.filter((s) => s.totalPoinPelanggaran >= 30).sort((a, b) => b.totalPoinPelanggaran - a.totalPoinPelanggaran), [siswaList]);
  const selesai = pelanggaranList.filter((p) => p.status === 'SELESAI').length;

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return pelanggaranList.filter((p) => {
      const s = siswaList.find((x) => x.id === p.siswaId);
      const match = !t || s?.namaLengkap.toLowerCase().includes(t) || p.namaPelanggaran.toLowerCase().includes(t) || p.kategori.toLowerCase().includes(t);
      if (!match) return false;
      if (filter === 'ALL') return true;
      if (filter === 'RISK') return (s?.totalPoinPelanggaran ?? 0) >= 30;
      return p.status === filter;
    });
  }, [q, filter, pelanggaranList, siswaList]);

  const CaseCard: React.FC<{ p: PelanggaranBK }> = ({ p }) => {
    const s = siswaList.find((x) => x.id === p.siswaId);
    if (!s) return null;
    return (
      <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Avatar src={s.avatarUrl} name={s.namaLengkap} className="h-11 w-11" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{s.namaLengkap}</p>
            <p className="truncate text-[11px] text-slate-500">{s.kelas} • {formatTanggalPendek(p.tanggal)}</p>
          </div>
          <Badge tone="rose">+{p.poin} Poin</Badge>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{p.namaPelanggaran}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {p.kategori} • Total <strong className={s.totalPoinPelanggaran >= 30 ? 'text-rose-600' : ''}>{s.totalPoinPelanggaran}</strong> poin
          </p>
        </div>
        <p className="text-xs leading-relaxed text-slate-700">{p.deskripsiUmum}</p>
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-900"><Lock className="h-3.5 w-3.5" /> Tindakan Internal BK (RAHASIA)</p>
          <p className="text-xs font-medium leading-relaxed text-amber-950">{p.tindakanInternalBK}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <select
            aria-label="Status penanganan"
            value={p.status}
            onChange={(e) => onUpdateStatusPelanggaran(p.id, e.target.value as PelanggaranBK['status'])}
            className={`min-h-10 flex-1 rounded-xl border px-2.5 text-xs font-bold ${statusTone[p.status]}`}
          >
            {Object.entries(statusPelanggaranLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <Btn tone="emerald" onClick={() => onOpenWhatsApp(s, p)} className="flex-1 text-xs">
            <MessageSquare className="h-4 w-4" /> Hubungi Ortu
          </Btn>
        </div>
        <p className="text-[10px] italic text-slate-400">Dicatat: {p.dicatatOleh}</p>
      </article>
    );
  };

  return (
    <div className="space-y-5">
      <Banner
        tone="rose"
        chip={<><Lock className="h-3.5 w-3.5" /> Otoritas Khusus Bimbingan Konseling</>}
        title="Konseling & Kedisiplinan Siswa"
        desc="Penanganan kasus, catatan internal privat, dan koordinasi WhatsApp ke orang tua."
        actions={<BannerButton onClick={() => onOpenAddPelanggaran()}><PlusCircle className="h-4 w-4 text-rose-700" /> Catat Pelanggaran</BannerButton>}
      />

      {view === 'ringkasan' && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <Stat label="Total Kasus" value={pelanggaranList.length} hint="Seluruh kelas" tone="blue" icon={<ShieldAlert className="h-4 w-4" />} />
            <Stat label="Perlu Penanganan" value={kasusAktif} hint="Dalam proses / panggilan" tone="rose" icon={<Clock className="h-4 w-4" />} />
            <Stat label="Ambang SP (≥30)" value={berisiko.length} hint="Butuh panggilan ortu" tone="amber" icon={<AlertTriangle className="h-4 w-4" />} />
            <Stat label="Terselesaikan" value={selesai} hint="Komitmen tuntas" tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader icon={<AlertTriangle className="h-4 w-4 text-amber-600" />} title="Siswa Berisiko" />
              {berisiko.length === 0 ? <Empty title="Tidak ada siswa di ambang SP" /> : (
                <ul className="divide-y divide-slate-100">
                  {berisiko.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 p-3.5">
                      <Avatar src={s.avatarUrl} name={s.namaLengkap} className="h-10 w-10" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{s.namaLengkap}</p>
                        <p className="text-[11px] text-slate-500">{s.kelas}</p>
                      </div>
                      <Badge tone="rose">{s.totalPoinPelanggaran} poin</Badge>
                      <Btn tone="ghost" className="min-h-9 px-3 text-xs" onClick={() => onOpenWhatsApp(s)}>WA</Btn>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card>
              <CardHeader icon={<Clock className="h-4 w-4 text-rose-600" />} title="Kasus Terbaru" />
              <ul className="divide-y divide-slate-100">
                {pelanggaranList.slice(0, 5).map((p) => {
                  const s = siswaList.find((x) => x.id === p.siswaId);
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-3 p-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{p.namaPelanggaran}</p>
                        <p className="truncate text-[11px] text-slate-500">{s?.namaLengkap} • {formatTanggalPendek(p.tanggal)}</p>
                      </div>
                      <Badge tone={p.status === 'SELESAI' ? 'emerald' : p.status === 'PANGGILAN_ORTU' ? 'rose' : 'amber'}>{statusPelanggaranLabel[p.status]}</Badge>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>
        </>
      )}

      {view === 'kasus' && (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchBox value={q} onChange={setQ} placeholder="Cari siswa, kasus, kategori…" className="flex-1" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter kasus" className={`${inputCls} sm:w-60`}>
              <option value="ALL">Semua Kasus</option>
              <option value="RISK">Siswa Berisiko (≥30 Poin)</option>
              <option value="DALAM_PROSES">Status: Dalam Proses</option>
              <option value="DITANGANI">Status: Ditangani</option>
              <option value="PANGGILAN_ORTU">Status: Panggilan Ortu</option>
              <option value="SELESAI">Status: Selesai</option>
            </select>
          </div>
          <p className="text-xs text-slate-500">Menampilkan <strong className="text-slate-800">{filtered.length}</strong> catatan</p>
          {filtered.length === 0 ? (
            <Card><Empty title="Tidak ada data yang sesuai" desc="Ubah kata kunci atau filter pencarian." /></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((p) => <CaseCard key={p.id} p={p} />)}</div>
          )}
        </>
      )}

      {view === 'siswa' && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {siswaList.map((s) => (
            <article key={s.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <Avatar src={s.avatarUrl} name={s.namaLengkap} className="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{s.namaLengkap}</p>
                  <p className="text-[11px] text-slate-500">{s.kelas} • NISN {s.nisn}</p>
                </div>
                <Badge tone={s.totalPoinPelanggaran >= 30 ? 'rose' : s.totalPoinPelanggaran > 0 ? 'amber' : 'emerald'}>{s.totalPoinPelanggaran} poin</Badge>
              </div>
              <p className="text-xs text-slate-600">Wali: <strong>{s.namaOrangTua}</strong></p>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <Btn tone="ghost" className="text-xs" onClick={() => onOpenAddPelanggaran(s.id)}><PlusCircle className="h-4 w-4" /> Catat</Btn>
                <Btn tone="emerald" className="text-xs" onClick={() => onOpenWhatsApp(s)}><MessageSquare className="h-4 w-4" /> WhatsApp</Btn>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
