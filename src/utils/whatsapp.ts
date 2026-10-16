import { Siswa, PelanggaranBK, Guru } from '../types/siakad';
import { normalizePhone } from './format';

const SEKOLAH = 'SMA NEGERI 1 TELADAN BANGSA';

export interface WaResult {
  message: string;
  waUrl: string;
}

const buildUrl = (phone: string, message: string) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;

/** Pesan dari Guru BK ke Orang Tua/Wali murid. */
export function generateWhatsAppMessage(
  siswa: Siswa,
  pelanggaranTerbaru?: PelanggaranBK,
  catatanTambahan?: string,
): WaResult {
  const tgl = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  let m = `*PEMBERITAHUAN BIMBINGAN KONSELING (BK)*\n*${SEKOLAH}*\n-------------------------------------------\n`;
  m += `Kepada Yth. Bapak/Ibu Wali Murid dari:\n*Nama Siswa:* ${siswa.namaLengkap}\n*NISN / Kelas:* ${siswa.nisn} / ${siswa.kelas}\n*Tanggal Laporan:* ${tgl}\n\n`;

  if (pelanggaranTerbaru) {
    m += `Dengan hormat, kami sampaikan catatan kedisiplinan terbaru ananda:\n`;
    m += `• *Perihal:* ${pelanggaranTerbaru.namaPelanggaran}\n• *Kategori:* ${pelanggaranTerbaru.kategori}\n`;
    m += `• *Bobot Poin:* +${pelanggaranTerbaru.poin} Poin\n• *Keterangan:* ${pelanggaranTerbaru.deskripsiUmum}\n`;
  }

  m += `\n*Akumulasi Poin Kedisiplinan Saat Ini:* ${siswa.totalPoinPelanggaran} Poin\n`;
  if (siswa.totalPoinPelanggaran >= 75) {
    m += `⚠️ *PERHATIAN:* Akumulasi poin telah mencapai batas Surat Peringatan (SP 2 / Pemanggilan Orang Tua ke Sekolah). Mohon berkenan hadir untuk koordinasi bersama Guru BK.\n`;
  } else if (siswa.totalPoinPelanggaran >= 40) {
    m += `⚠️ *PERHATIAN:* Akumulasi poin telah mencapai ambang pembinaan khusus. Kami mohon bantuan Bapak/Ibu untuk memberikan bimbingan intensif di rumah.\n`;
  } else {
    m += `ℹ️ Status kedisiplinan masih dalam taraf pembinaan pendampingan.\n`;
  }

  if (catatanTambahan?.trim()) m += `\n*Pesan Khusus Guru BK:*\n${catatanTambahan.trim()}\n`;

  m += `\nTerima kasih atas kerja sama Bapak/Ibu dalam membimbing ananda.\n\n_Hormat kami,_\n*Guru Bimbingan Konseling (BK)*\n${SEKOLAH.replace('SMA NEGERI', 'SMA Negeri').replace('TELADAN BANGSA', 'Teladan Bangsa')}`;

  return { message: m, waUrl: buildUrl(siswa.noWaOrangTua, m) };
}

/** Pesan dari Orang Tua ke Guru BK. */
export function generateWhatsAppToBK(siswa: Siswa, guruBK: Pick<Guru, 'namaLengkap' | 'phone'>, pesan?: string): WaResult {
  let m = `Assalamualaikum Wr. Wb. / Selamat Pagi,\n\n`;
  m += `Yth. Bapak/Ibu *${guruBK.namaLengkap}* (Guru BK ${SEKOLAH}).\n\n`;
  m += `Saya *${siswa.namaOrangTua}*, orang tua/wali dari:\n• *Nama:* ${siswa.namaLengkap}\n• *Kelas:* ${siswa.kelas}\n• *NISN:* ${siswa.nisn}\n\n`;
  m += pesan?.trim()
    ? `${pesan.trim()}\n`
    : `Mohon izin berkonsultasi terkait perkembangan kedisiplinan dan bimbingan ananda. Mohon informasi waktu yang dapat kami temui.\n`;
  m += `\nTerima kasih atas perhatian dan bantuannya.`;
  return { message: m, waUrl: buildUrl(guruBK.phone, m) };
}
