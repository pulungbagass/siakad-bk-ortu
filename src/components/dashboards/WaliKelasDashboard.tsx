import React, { useMemo, useState } from 'react';
import { FileSpreadsheet, Printer, CalendarCheck, Download, Users, Award, AlertTriangle } from 'lucide-react';
import type { Siswa, NilaiAkademik, AbsensiRecord, PelanggaranBK } from '../../types/siakad';
import { Avatar } from '../ui/Avatar';
import { Badge, Banner, BannerButton, Btn, Card, CardHeader, Empty, SearchBox, Stat } from '../ui/kit';
import { exportAbsensiToExcel, exportNilaiToExcel } from '../../utils/exportExcel';
import { average, formatTanggalPendek } from '../../utils/format';
import { useToast } from '../ui/Toast';

interface Props {
  view: string;
  guruNama: string;
  kelasName: string;
  siswaList: Siswa[];
  nilaiList: NilaiAkademik[];
  absensiList: AbsensiRecord[];
  pelanggaranList: PelanggaranBK[];
  onCetakRapor: (s: Siswa) => void;
  onOpenAbsensiModal: () => void;
}

const statusTone = { HADIR: 'emerald', SAKIT: 'amber', IZIN: 'blue', ALPA: 'rose' } as const;

export const WaliKelasDashboard: React.FC<Props> = ({ view, guruNama, kelasName, siswaList, nilaiList, absensiList, onCetakRapor, onOpenAbsensiModal }) => {
  const toast = useToast();
  const [q, setQ] = useState('');
  const kelas = useMemo(() => siswaList.filter((s) => s.kelas === kelasName), [siswaList, kelasName]);
  const ids = new Set(kelas.map((s) => s.id));
  const nilaiKelas = nilaiList.filter((n) => ids.has(n.siswaId));
  const absKelas = absensiList.filter((a) => ids.has(a.siswaId));
  const rata = nilaiKelas.length ? average(nilaiKelas.map((n) => n.nilaiAkhir)).toFixed(1) : '-';
  const hadir = absKelas.filter((a) => a.status === 'HADIR').length;
  const persen = absKelas.length ? Math.round((hadir / absKelas.length) * 100) : 100;
  const filtered = kelas.filter((s) => s.namaLengkap.toLowerCase().includes(q.toLowerCase()) || s.nisn.includes(q));

  const doExport = (fn: () => void, label: string) => { try { fn(); toast(`${label} berhasil diunduh`); } catch { toast(`Gagal mengunduh ${label}`, 'error'); } };

  return (
    <div className="space-y-5">
      <Banner
        tone="purple"
        chip={`Wali Kelas: ${guruNama}`}
        title={`Kelas ${kelasName}`}
        desc={`${kelas.length} siswa binaan • Semester Ganjil. Cetak rapor ber-kop dan ekspor data akademik.`}
        actions={<>
          <BannerButton onClick={onOpenAbsensiModal}><CalendarCheck className="h-4 w-4 text-purple-700" /> Rekam Presensi</BannerButton>
          <BannerButton variant="solid" onClick={() => doExport(() => exportNilaiToExcel(nilaiKelas, kelas), 'Rekap nilai')}><FileSpreadsheet className="h-4 w-4" /> Export Nilai</BannerButton>
          <BannerButton variant="solid" onClick={() => doExport(() => exportAbsensiToExcel(absKelas, kelas), 'Rekap absensi')}><Download className="h-4 w-4" /> Export Absensi</BannerButton>
        </>}
      />

      {view === 'ringkasan' && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <Stat label="Jumlah Siswa" value={kelas.length} tone="purple" icon={<Users className="h-4 w-4" />} />
          <Stat label="Rata-rata Nilai" value={rata} tone="blue" icon={<Award className="h-4 w-4" />} />
          <Stat label="Kehadiran Kelas" value={`${persen}%`} tone="emerald" icon={<CalendarCheck className="h-4 w-4" />} />
          <Stat label="Siswa ≥30 Poin" value={kelas.filter((s) => s.totalPoinPelanggaran >= 30).length} tone="rose" icon={<AlertTriangle className="h-4 w-4" />} />
        </div>
      )}

      {(view === 'ringkasan' || view === 'siswa') && (
        <Card>
          <CardHeader icon={<Users className="h-4 w-4 text-purple-700" />} title="Daftar Siswa" right={<SearchBox value={q} onChange={setQ} placeholder="Cari nama / NISN…" className="w-full sm:w-64" />} />
          {filtered.length === 0 ? <Empty title="Siswa tidak ditemukan" /> : (
            <ul className="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-y-0 md:gap-3 md:p-3">
              {filtered.map((s) => {
                const sn = nilaiList.filter((n) => n.siswaId === s.id);
                const avg = sn.length ? average(sn.map((n) => n.nilaiAkhir)).toFixed(1) : '-';
                return (
                  <li key={s.id} className="flex flex-col gap-3 p-4 md:rounded-2xl md:border md:border-slate-200">
                    <div className="flex items-center gap-3">
                      <Avatar src={s.avatarUrl} name={s.namaLengkap} className="h-11 w-11" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{s.namaLengkap}</p>
                        <p className="truncate text-[11px] text-slate-500">NISN {s.nisn} • NIS {s.nis}</p>
                      </div>
                      <Badge tone={s.totalPoinPelanggaran >= 30 ? 'rose' : s.totalPoinPelanggaran > 0 ? 'amber' : 'emerald'}>{s.totalPoinPelanggaran} poin</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Wali: <strong className="text-slate-800">{s.namaOrangTua}</strong></span>
                      <span>Rata-rata: <strong className="text-slate-900">{avg}</strong></span>
                    </div>
                    <Btn onClick={() => onCetakRapor(s)} className="text-xs"><Printer className="h-4 w-4" /> Cetak Rapor Ber-Kop</Btn>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}

      {view === 'presensi' && (
        <Card>
          <CardHeader icon={<CalendarCheck className="h-4 w-4 text-purple-700" />} title="Riwayat Presensi Kelas" right={<Btn onClick={onOpenAbsensiModal} className="min-h-9 text-xs">+ Rekam</Btn>} />
          {absKelas.length === 0 ? <Empty title="Belum ada data presensi" /> : (
            <ul className="divide-y divide-slate-100">
              {[...absKelas].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 60).map((a) => {
                const s = kelas.find((x) => x.id === a.siswaId);
                return (
                  <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{s?.namaLengkap}</p>
                      <p className="truncate text-[11px] text-slate-500">{formatTanggalPendek(a.tanggal)}{a.keterangan ? ` • ${a.keterangan}` : ''}</p>
                    </div>
                    <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
};
