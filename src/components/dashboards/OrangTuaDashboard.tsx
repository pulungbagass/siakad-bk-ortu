import React from 'react';
import { Heart, Calendar, Award, AlertTriangle, ShieldCheck, Printer, Phone, CheckCircle, BookOpen } from 'lucide-react';
import type { Siswa, NilaiAkademik, AbsensiRecord, PelanggaranBK } from '../../types/siakad';
import { Avatar } from '../ui/Avatar';
import { Banner, BannerButton, Badge, Card, CardHeader, Stat } from '../ui/kit';
import { NilaiTable } from '../NilaiTable';
import { PelanggaranPublicList } from '../PelanggaranPublicList';
import { average } from '../../utils/format';

interface Props {
  view: string;
  anak: Siswa;
  nilaiList: NilaiAkademik[];
  absensiList: AbsensiRecord[];
  pelanggaranList: PelanggaranBK[];
  onCetakRapor: (s: Siswa) => void;
  onOpenWhatsAppGuruBK: () => void;
}

export const OrangTuaDashboard: React.FC<Props> = ({ view, anak, nilaiList, absensiList, pelanggaranList, onCetakRapor, onOpenWhatsAppGuruBK }) => {
  const c = (st: string) => absensiList.filter((a) => a.status === st).length;
  const hadir = c('HADIR'), sakit = c('SAKIT'), izin = c('IZIN'), alpa = c('ALPA');
  const total = absensiList.length;
  const persen = total ? Math.round((hadir / total) * 100) : 100;
  const rata = nilaiList.length ? average(nilaiList.map((n) => n.nilaiAkhir)).toFixed(1) : '-';
  const waspada = anak.totalPoinPelanggaran >= 35;

  return (
    <div className="space-y-5">
      <Banner
        tone="emerald"
        leading={<Avatar src={anak.avatarUrl} name={anak.namaLengkap} rounded="rounded-2xl" className="h-16 w-16 ring-4 ring-emerald-400/40 sm:h-20 sm:w-20" />}
        chip={<><Heart className="h-3.5 w-3.5 text-rose-300" /> Portal Wali Murid</>}
        title={anak.namaLengkap}
        desc={`Kelas ${anak.kelas} • NISN ${anak.nisn} • Wali: ${anak.namaOrangTua}`}
        actions={<>
          <BannerButton onClick={() => onCetakRapor(anak)}><Printer className="h-4 w-4 text-emerald-700" /> Cetak Rapor</BannerButton>
          <BannerButton variant="solid" onClick={onOpenWhatsAppGuruBK}><Phone className="h-4 w-4" /> Hubungi Guru BK</BannerButton>
        </>}
      />

      {view === 'ringkasan' && (
        <>
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            <Stat label="Poin Kedisiplinan" tone={waspada ? 'rose' : 'emerald'} value={<>{anak.totalPoinPelanggaran}<span className="ml-1 text-xs font-semibold text-slate-400">/ 100</span></>}
              icon={waspada ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              hint={anak.totalPoinPelanggaran === 0 ? 'Sangat baik & taat tata tertib' : waspada ? 'Perlu perhatian bersama orang tua' : 'Teguran ringan / pendampingan'} />
            <Stat label="Kehadiran" tone="blue" value={`${persen}%`} icon={<Calendar className="h-4 w-4" />} hint={`Hadir ${hadir} • Sakit ${sakit} • Izin ${izin} • Alpa ${alpa}`} />
            <Stat label="Rata-rata Nilai" tone="purple" value={rata} icon={<Award className="h-4 w-4" />} hint={`${nilaiList.length} mata pelajaran • Semester Ganjil`} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card><CardHeader icon={<BookOpen className="h-4 w-4 text-blue-700" />} title="Nilai Akademik Ananda" /><NilaiTable items={nilaiList} /></Card>
            <Card><CardHeader icon={<ShieldCheck className="h-4 w-4 text-rose-700" />} title="Catatan Kedisiplinan" right={<Badge tone="rose">{pelanggaranList.length} catatan</Badge>} />
              <div className="max-h-96 overflow-y-auto"><PelanggaranPublicList items={pelanggaranList} /></div></Card>
          </div>
        </>
      )}
      {view === 'nilai' && <Card><CardHeader icon={<BookOpen className="h-4 w-4 text-blue-700" />} title="Rekapitulasi Nilai Akademik" right={<Badge tone="blue">Rata-rata {rata}</Badge>} /><NilaiTable items={nilaiList} /></Card>}
      {view === 'bk' && (
        <>
          <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" /> Hanya ringkasan kejadian yang ditampilkan. Catatan konseling pribadi bersifat rahasia dan tidak dapat dilihat.</p>
          <Card><CardHeader icon={<ShieldCheck className="h-4 w-4 text-rose-700" />} title="Riwayat Kedisiplinan & Bimbingan" right={<Badge tone="rose">{anak.totalPoinPelanggaran} poin</Badge>} /><PelanggaranPublicList items={pelanggaranList} /></Card>
        </>
      )}
    </div>
  );
};
