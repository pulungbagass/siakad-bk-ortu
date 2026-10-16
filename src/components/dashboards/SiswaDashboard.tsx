import React from 'react';
import { UploadCloud, Printer, BookOpen, FileCheck, Camera } from 'lucide-react';
import type { Siswa, NilaiAkademik, AbsensiRecord, PelanggaranBK, DokumenTugas } from '../../types/siakad';
import { Avatar } from '../ui/Avatar';
import { Banner, BannerButton, Badge, Card, CardHeader, Empty, Stat } from '../ui/kit';
import { NilaiTable } from '../NilaiTable';
import { PelanggaranPublicList } from '../PelanggaranPublicList';
import { formatTanggalPendek } from '../../utils/format';

interface Props {
  view: string;
  siswa: Siswa;
  nilaiList: NilaiAkademik[];
  absensiList: AbsensiRecord[];
  pelanggaranList: PelanggaranBK[];
  tugasList: DokumenTugas[];
  onOpenUpload: () => void;
  onCetakRapor: (s: Siswa) => void;
}

const TugasList: React.FC<{ items: DokumenTugas[] }> = ({ items }) =>
  items.length === 0 ? <Empty title="Belum ada tugas yang diunggah" /> : (
    <ul className="divide-y divide-slate-100">
      {items.map((t) => (
        <li key={t.id} className="space-y-1.5 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800">{t.judulTugas}</p>
              <p className="break-words text-[11px] text-slate-500">{t.mataPelajaran} • {t.namaFile} ({t.ukuranFile}) • {formatTanggalPendek(t.tanggalUnggah)}</p>
            </div>
            <Badge tone={t.status === 'DINILAI' ? 'emerald' : t.status === 'REVISI' ? 'rose' : 'blue'}>{t.status}</Badge>
          </div>
          {t.catatanGuru && <p className="rounded-lg border border-slate-200/70 bg-slate-50 p-2 text-xs text-slate-600">Catatan guru: <span className="italic">{t.catatanGuru}</span></p>}
        </li>
      ))}
    </ul>
  );
export { TugasList };

export const SiswaDashboard: React.FC<Props> = ({ view, siswa, nilaiList, absensiList, pelanggaranList, tugasList, onOpenUpload, onCetakRapor }) => {
  const hadir = absensiList.filter((a) => a.status === 'HADIR').length;
  const persen = absensiList.length ? Math.round((hadir / absensiList.length) * 100) : 100;

  return (
    <div className="space-y-5">
      <Banner
        tone="blue"
        leading={
          <button onClick={onOpenUpload} aria-label="Ubah foto profil" className="relative shrink-0">
            <Avatar src={siswa.avatarUrl} name={siswa.namaLengkap} rounded="rounded-2xl" className="h-16 w-16 ring-4 ring-blue-400/40 sm:h-20 sm:w-20" />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 text-blue-800 shadow"><Camera className="h-3.5 w-3.5" /></span>
          </button>
        }
        chip="Siswa Aktif"
        title={siswa.namaLengkap}
        desc={`${siswa.kelas} • NIS ${siswa.nis} • NISN ${siswa.nisn}`}
        actions={<>
          <BannerButton onClick={onOpenUpload}><UploadCloud className="h-4 w-4 text-blue-700" /> Kirim Tugas</BannerButton>
          <BannerButton variant="solid" onClick={() => onCetakRapor(siswa)}><Printer className="h-4 w-4" /> Pratinjau Rapor</BannerButton>
        </>}
      />

      {view === 'ringkasan' && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <Stat label="Poin Pelanggaran" value={siswa.totalPoinPelanggaran} tone={siswa.totalPoinPelanggaran >= 30 ? 'rose' : 'slate'} hint={siswa.totalPoinPelanggaran === 0 ? 'Kedisiplinan sempurna' : 'Jaga terus tata tertib'} />
            <Stat label="Kehadiran" value={`${persen}%`} tone="emerald" hint={`Hadir ${hadir} dari ${absensiList.length} hari`} />
            <Stat label="Tugas Terkirim" value={tugasList.length} tone="blue" hint="Dokumen portofolio" />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card><CardHeader icon={<BookOpen className="h-4 w-4 text-blue-700" />} title="Nilai Semester Ganjil" /><NilaiTable items={nilaiList} /></Card>
            <Card><CardHeader icon={<FileCheck className="h-4 w-4 text-emerald-700" />} title="Pengiriman Tugas Terbaru" right={<button onClick={onOpenUpload} className="text-xs font-semibold text-blue-700">+ Kirim</button>} /><TugasList items={tugasList.slice(0, 3)} /></Card>
          </div>
          <Card><CardHeader title="Catatan Kedisiplinan Saya" /><PelanggaranPublicList items={pelanggaranList} /></Card>
        </>
      )}
      {view === 'nilai' && <Card><CardHeader icon={<BookOpen className="h-4 w-4 text-blue-700" />} title="Nilai Hasil Belajar Semester Ganjil" /><NilaiTable items={nilaiList} /></Card>}
      {view === 'tugas' && <Card><CardHeader icon={<FileCheck className="h-4 w-4 text-emerald-700" />} title="Riwayat Tugas & Berkas" right={<button onClick={onOpenUpload} className="text-xs font-semibold text-blue-700">+ Kirim Tugas</button>} /><TugasList items={tugasList} /></Card>}
    </div>
  );
};
