import React from 'react';
import { Printer, X } from 'lucide-react';
import type { Siswa, NilaiAkademik, AbsensiRecord, PelanggaranBK } from '../../types/siakad';
import { KopSekolah } from '../KopSekolah';
import { Btn } from '../ui/kit';
import { average, formatTanggalPanjang } from '../../utils/format';

interface Props {
  siswa: Siswa;
  waliKelas: { nama: string; nip: string };
  guruBK: string;
  nilaiList: NilaiAkademik[];
  absensiList: AbsensiRecord[];
  pelanggaranList: PelanggaranBK[];
  onClose: () => void;
}

export const CetakRaporModal: React.FC<Props> = ({ siswa, waliKelas, guruBK, nilaiList, absensiList, onClose }) => {
  const c = (s: string) => absensiList.filter((a) => a.status === s).length;
  const rata = nilaiList.length ? average(nilaiList.map((n) => n.nilaiAkhir)).toFixed(1) : '-';
  const poin = siswa.totalPoinPelanggaran;
  const meta: [string, string][] = [
    ['Nama Siswa', siswa.namaLengkap], ['Kelas / Fase', `${siswa.kelas} (Fase E)`], ['NIS / NISN', `${siswa.nis} / ${siswa.nisn}`],
    ['Wali Kelas', waliKelas.nama], ['Nama Orang Tua', siswa.namaOrangTua], ['Guru BK', guruBK],
  ];

  return (
    <div role="dialog" aria-modal="true" aria-label="Pratinjau rapor" className="print-modal fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs sm:p-4">
      <div className="print-paper mx-auto my-0 w-full max-w-4xl overflow-hidden bg-white shadow-2xl sm:my-4 sm:rounded-2xl">
        <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-4 py-3 text-white">
          <span className="flex items-center gap-2 text-sm font-medium"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />Pratinjau Rapor</span>
          <div className="flex items-center gap-2">
            <Btn onClick={() => window.print()} className="min-h-9 text-xs sm:text-sm"><Printer className="h-4 w-4" /> Cetak / Simpan PDF</Btn>
            <button onClick={onClose} aria-label="Tutup" className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
        </div>
        <p className="no-print bg-slate-100 px-4 py-1.5 text-center text-[11px] text-slate-500 sm:hidden">Geser ke samping untuk melihat seluruh halaman rapor →</p>

        <div className="print-scroll overflow-x-auto">
          <div className="min-w-[760px] bg-white p-8 font-sans text-slate-800 sm:p-12 print:p-0">
            <KopSekolah />
            <div className="my-4 text-center">
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">Laporan Capaian Hasil Belajar & Catatan Karakter Siswa</h2>
              <p className="text-xs uppercase tracking-wide text-slate-600">Semester Ganjil — Tahun Ajaran 2026/2027</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-x-8 gap-y-1.5 rounded-lg border border-slate-300 bg-slate-50/50 p-3.5 text-sm">
              {meta.map(([k, v]) => (<div key={k} className="flex"><span className="w-36 shrink-0 font-semibold text-slate-600">{k}</span><span className="font-medium text-slate-900">: {v}</span></div>))}
            </div>

            <h3 className="mb-2 flex items-center justify-between text-sm font-bold uppercase text-slate-900"><span>A. Capaian Kompetensi Akademik</span><span className="text-xs font-normal normal-case text-slate-600">KKM: 75</span></h3>
            <div className="mb-6 overflow-hidden rounded-lg border border-slate-300">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="border-b border-slate-300 bg-slate-100 font-semibold text-slate-700">
                  <tr>{['No', 'Mata Pelajaran', 'Tugas', 'UTS', 'UAS', 'Akhir', 'Predikat', 'Keterangan'].map((h, i) => <th key={h} className={`border-r border-slate-300 px-2.5 py-2 last:border-r-0 ${i === 1 || i === 7 ? '' : 'text-center'}`}>{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {nilaiList.length === 0 ? <tr><td colSpan={8} className="py-4 text-center italic text-slate-500">Belum ada data nilai.</td></tr> : nilaiList.map((n, i) => (
                    <tr key={n.id}>
                      <td className="border-r border-slate-200 px-2.5 py-1.5 text-center">{i + 1}</td>
                      <td className="border-r border-slate-200 px-2.5 py-1.5 font-medium text-slate-900">{n.mataPelajaran}</td>
                      <td className="border-r border-slate-200 px-2.5 py-1.5 text-center">{n.tugas}</td>
                      <td className="border-r border-slate-200 px-2.5 py-1.5 text-center">{n.uts}</td>
                      <td className="border-r border-slate-200 px-2.5 py-1.5 text-center">{n.uas}</td>
                      <td className="border-r border-slate-200 px-2.5 py-1.5 text-center font-bold">{n.nilaiAkhir}</td>
                      <td className="border-r border-slate-200 px-2.5 py-1.5 text-center font-bold">{n.predikat}</td>
                      <td className="px-2.5 py-1.5 text-slate-600">{n.nilaiAkhir >= 85 ? 'Sangat baik dalam penguasaan materi' : n.nilaiAkhir >= 75 ? 'Tuntas memenuhi kriteria capaian' : 'Perlu bimbingan lanjutan'}</td>
                    </tr>))}
                  {nilaiList.length > 0 && <tr className="border-t border-slate-300 bg-slate-50 font-bold"><td colSpan={5} className="border-r border-slate-300 px-3 py-2 text-right">Rata-rata Nilai Akhir:</td><td className="border-r border-slate-300 px-2.5 py-2 text-center text-blue-900">{rata}</td><td colSpan={2} className="px-3 py-2 font-normal text-slate-600">Status: <b className={Number(rata) >= 75 ? 'text-emerald-700' : 'text-rose-700'}>{Number(rata) >= 75 ? 'Tuntas' : 'Belum Tuntas'}</b></td></tr>}
                </tbody>
              </table>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-300 p-3.5">
                <h4 className="mb-2 border-b pb-1 text-xs font-bold uppercase text-slate-900">B. Rekap Kehadiran</h4>
                <table className="w-full text-xs"><tbody>
                  {([['Hadir', 'HADIR', 'font-bold text-emerald-700'], ['Sakit (S)', 'SAKIT', ''], ['Izin (I)', 'IZIN', ''], ['Alpa (A)', 'ALPA', 'font-bold text-rose-600']] as const).map(([l, k, cls]) => (
                    <tr key={k} className="border-b border-slate-200 last:border-0"><td className="py-1 text-slate-600">{l}</td><td className={`py-1 text-right ${cls}`}>{c(k)} hari</td></tr>))}
                </tbody></table>
              </div>
              <div className="rounded-lg border border-slate-300 p-3.5">
                <h4 className="mb-2 flex justify-between gap-2 border-b pb-1 text-xs font-bold uppercase text-slate-900"><span>C. Karakter & Kedisiplinan</span><span className="font-semibold normal-case">{poin} poin</span></h4>
                <p className="text-xs italic leading-relaxed text-slate-700">
                  {poin === 0 ? 'Ananda menunjukkan integritas prima dan kepatuhan tata tertib yang konsisten sepanjang semester.'
                    : poin <= 35 ? `Rekam kedisiplinan cukup baik dengan total ${poin} poin. Diimbau menjaga konsistensi dan ketepatan waktu.`
                    : `Perlu perhatian bersama orang tua dan wali kelas terkait akumulasi ${poin} poin. Pembinaan BK berkala sedang berjalan.`}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-300 pt-6 text-xs">
              <div className="mb-6 text-right text-slate-600">Bandung, {formatTanggalPanjang()}</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[['Mengetahui,\nOrang Tua / Wali', siswa.namaOrangTua, ''], ['Wali Kelas,', waliKelas.nama, `NIP. ${waliKelas.nip}`], ['Kepala Sekolah,', 'Dr. H. Mulyadi Kartono, M.Pd.', 'NIP. 196904101994031002']].map(([t, n, nip]) => (
                  <div key={t}><p className="mb-16 whitespace-pre-line text-slate-600">{t}</p><div className="mx-6 border-b border-slate-800" /><p className="mt-1 font-bold text-slate-900">{n}</p>{nip && <p className="text-[10px] text-slate-500">{nip}</p>}</div>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
