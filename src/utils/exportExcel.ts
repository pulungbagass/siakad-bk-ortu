import { NilaiAkademik, Siswa, AbsensiRecord } from '../types/siakad';

/** Escape sel CSV + cegah formula injection di Excel/Sheets. */
function cell(value: string | number | undefined | null): string {
  let s = value === undefined || value === null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s) && Number.isNaN(Number(s))) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, headers: string[], rows: (string | number | undefined)[][]) {
  const body = [headers, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  // BOM UTF-8 agar Excel membaca karakter Indonesia dengan benar
  const blob = new Blob(['\uFEFF' + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export function exportNilaiToExcel(nilaiList: NilaiAkademik[], siswaList: Siswa[]) {
  const map = new Map(siswaList.map((s) => [s.id, s]));
  downloadCsv(
    `REKAP_NILAI_SIAKAD_${stamp()}.csv`,
    ['No', 'NISN', 'NIS', 'Nama Lengkap Siswa', 'Kelas', 'Mata Pelajaran', 'Nilai Tugas', 'Nilai UTS', 'Nilai UAS', 'Nilai Akhir', 'Predikat', 'Semester'],
    nilaiList.map((n, i) => {
      const s = map.get(n.siswaId);
      return [i + 1, s?.nisn ?? '-', s?.nis ?? '-', s?.namaLengkap ?? '-', s?.kelas ?? '-', n.mataPelajaran, n.tugas, n.uts, n.uas, n.nilaiAkhir, n.predikat, n.semester];
    }),
  );
}

export function exportAbsensiToExcel(absensiList: AbsensiRecord[], siswaList: Siswa[]) {
  const map = new Map(siswaList.map((s) => [s.id, s]));
  downloadCsv(
    `REKAP_ABSENSI_SIAKAD_${stamp()}.csv`,
    ['No', 'Tanggal', 'NISN', 'Nama Siswa', 'Kelas', 'Status Kehadiran', 'Keterangan'],
    absensiList.map((a, i) => {
      const s = map.get(a.siswaId);
      return [i + 1, a.tanggal, s?.nisn ?? '-', s?.namaLengkap ?? '-', s?.kelas ?? '-', a.status, a.keterangan ?? '-'];
    }),
  );
}
