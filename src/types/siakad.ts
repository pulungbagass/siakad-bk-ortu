export type Role =
  | 'USER'
  | 'SISWA'
  | 'ORANG_TUA'
  | 'GURU_MAPEL'
  | 'WALI_KELAS'
  | 'GURU_BK'
  | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  namaLengkap: string;
  role: Role;
  subRole?: string;
  avatarUrl?: string;
  phone?: string;
  associatedSiswaId?: string; // For Orang Tua or Siswa
  associatedGuruId?: string;  // For Guru Mapel, Wali Kelas, Guru BK
}

export interface Siswa {
  id: string;
  nisn: string;
  nis: string;
  namaLengkap: string;
  kelas: string;
  jenisKelamin: 'L' | 'P';
  namaOrangTua: string;
  noWaOrangTua: string;
  alamat: string;
  avatarUrl: string;
  totalPoinPelanggaran: number;
}

export interface Guru {
  id: string;
  nip: string;
  namaLengkap: string;
  mataPelajaran: string;
  jabatan: 'Guru Mapel' | 'Wali Kelas' | 'Guru BK' | 'Kepala Sekolah';
  kelasWali?: string;
  email: string;
  phone: string;
}

export type StatusAbsensi = 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA';

export interface AbsensiRecord {
  id: string;
  siswaId: string;
  tanggal: string; // YYYY-MM-DD
  status: StatusAbsensi;
  keterangan?: string;
}

export interface NilaiAkademik {
  id: string;
  siswaId: string;
  mataPelajaran: string;
  tugas: number;
  uts: number;
  uas: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  semester: string;
}

export type StatusPelanggaran = 'DALAM_PROSES' | 'DITANGANI' | 'PANGGILAN_ORTU' | 'SELESAI';

export interface PelanggaranBK {
  id: string;
  siswaId: string;
  tanggal: string; // YYYY-MM-DD
  kategori: string;
  namaPelanggaran: string;
  poin: number;
  deskripsiUmum: string; // Bisa dilihat Orang Tua / Siswa
  tindakanInternalBK: string; // KHUSUS internal BK & Admin (Privat/Kerahasiaan Konseling)
  status: StatusPelanggaran;
  dicatatOleh: string;
  isDeleted?: boolean;
}

export interface DokumenTugas {
  id: string;
  siswaId: string;
  judulTugas: string;
  mataPelajaran: string;
  namaFile: string;
  ukuranFile: string;
  fileUrl: string;
  tanggalUnggah: string;
  status: 'TERKIRIM' | 'DINILAI' | 'REVISI';
  catatanGuru?: string;
}

export interface KritikSaran {
  id: string;
  nama: string;
  role: Role;
  kategori: 'Akademik' | 'Layanan BK' | 'Fasilitas' | 'Sistem';
  pesan: string;
  tanggal: string;
}
