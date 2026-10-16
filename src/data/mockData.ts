import { Siswa, Guru, AbsensiRecord, NilaiAkademik, PelanggaranBK, DokumenTugas, KritikSaran, UserProfile } from '../types/siakad';

export const INITIAL_SISWA: Siswa[] = [
  {
    id: 's-1',
    nisn: '0068492011',
    nis: '2324101',
    namaLengkap: 'Ahmad Faiz Pratama',
    kelas: 'X-IPA-1',
    jenisKelamin: 'L',
    namaOrangTua: 'Bambang Pratama, S.T.',
    noWaOrangTua: '6281234567890',
    alamat: 'Jl. Merdeka No. 45, Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    totalPoinPelanggaran: 35,
  },
  {
    id: 's-2',
    nisn: '0069418292',
    nis: '2324102',
    namaLengkap: 'Siti Nurhaliza Putri',
    kelas: 'X-IPA-1',
    jenisKelamin: 'P',
    namaOrangTua: 'Drs. Hendro Wibowo',
    noWaOrangTua: '6281398765432',
    alamat: 'Komp. Graha Indah Blok B3, Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    totalPoinPelanggaran: 5,
  },
  {
    id: 's-3',
    nisn: '0071239948',
    nis: '2324103',
    namaLengkap: 'Rian Dwi Saputra',
    kelas: 'XI-IPS-1',
    jenisKelamin: 'L',
    namaOrangTua: 'Agus Saputra',
    noWaOrangTua: '6285211223344',
    alamat: 'Jl. Cempaka Putih No. 12, Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    totalPoinPelanggaran: 65,
  },
  {
    id: 's-4',
    nisn: '0075583921',
    nis: '2324104',
    namaLengkap: 'Clarissa Maharani',
    kelas: 'XI-IPS-1',
    jenisKelamin: 'P',
    namaOrangTua: 'Ir. Rudi Maharani',
    noWaOrangTua: '6287766554433',
    alamat: 'Jl. Dago Asri Raya No. 88, Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
    totalPoinPelanggaran: 0,
  },
  {
    id: 's-5',
    nisn: '0062391054',
    nis: '2324105',
    namaLengkap: 'Bagas Aditya Nugraha',
    kelas: 'XII-MIPA-1',
    jenisKelamin: 'L',
    namaOrangTua: 'Dra. Sri Wahyuni',
    noWaOrangTua: '6281988776655',
    alamat: 'Jl. Buah Batu Regency A2, Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    totalPoinPelanggaran: 15,
  }
];

export const INITIAL_GURU: Guru[] = [
  {
    id: 'g-1',
    nip: '197805122005011003',
    namaLengkap: 'Dra. Hj. Nuraini Kusuma, M.Pd.',
    mataPelajaran: 'Bimbingan Konseling (BK)',
    jabatan: 'Guru BK',
    email: 'nuraini.bk@sman1teladan.sch.id',
    phone: '081233445566'
  },
  {
    id: 'g-2',
    nip: '198203152008011009',
    namaLengkap: 'Budi Santoso, M.Kom.',
    mataPelajaran: 'Informatika & Matematika',
    jabatan: 'Wali Kelas',
    kelasWali: 'X-IPA-1',
    email: 'budi.santoso@sman1teladan.sch.id',
    phone: '081388990011'
  },
  {
    id: 'g-3',
    nip: '198509202010012015',
    namaLengkap: 'Ratna Dewi, S.Pd.',
    mataPelajaran: 'Bahasa Indonesia',
    jabatan: 'Guru Mapel',
    email: 'ratna.dewi@sman1teladan.sch.id',
    phone: '081566778899'
  }
];

export const INITIAL_PELANGGARAN: PelanggaranBK[] = [
  {
    id: 'p-1',
    siswaId: 's-1',
    tanggal: '2026-10-02',
    kategori: 'Kedisiplinan Waktu',
    namaPelanggaran: 'Terlambat Masuk Sekolah (>15 Menit)',
    poin: 10,
    deskripsiUmum: 'Siswa tiba di sekolah pukul 07.25 WIB tanpa surat izin resmi.',
    tindakanInternalBK: 'Konseling individual tahap 1. Siswa mengaku membantu orang tua mengantar adik sakit. Diberikan toleransi dan jadwal alarm pagi.',
    status: 'SELESAI',
    dicatatOleh: 'Dra. Hj. Nuraini Kusuma, M.Pd. (Guru BK)',
    isDeleted: false
  },
  {
    id: 'p-2',
    siswaId: 's-1',
    tanggal: '2026-10-10',
    kategori: 'Tata Tertib Seragam',
    namaPelanggaran: 'Sepatu Tidak Sesuai Ketentuan & Kaos Kaki Pendek',
    poin: 10,
    deskripsiUmum: 'Memakai sepatu berwarna mencolok bukan hitam polos saat upacara bendera.',
    tindakanInternalBK: 'Teguran lisan tercatat. Mengingatkan tata tertib seragam sekolah.',
    status: 'DITANGANI',
    dicatatOleh: 'Budi Santoso, M.Kom. (Wali Kelas)',
    isDeleted: false
  },
  {
    id: 'p-3',
    siswaId: 's-1',
    tanggal: '2026-10-12',
    kategori: 'Kehadiran KBM',
    namaPelanggaran: 'Meninggalkan Kelas Sebelum Waktu Istirahat (Bolos Jam ke-4)',
    poin: 15,
    deskripsiUmum: 'Tidak berada di kelas saat pergantian jam pelajaran Bahasa Inggris.',
    tindakanInternalBK: 'Siswa ditemukan di area kantin belakang bersama teman kelas lain. Diberikan sanksi pembinaan membaca buku di perpustakaan selama 2 jam dan komitmen tertulis.',
    status: 'DALAM_PROSES',
    dicatatOleh: 'Dra. Hj. Nuraini Kusuma, M.Pd. (Guru BK)',
    isDeleted: false
  },
  {
    id: 'p-4',
    siswaId: 's-3',
    tanggal: '2026-09-28',
    kategori: 'Perilaku & Ketertiban',
    namaPelanggaran: 'Membawa Rokok Elektrik (Vape) ke Lingkungan Sekolah',
    poin: 50,
    deskripsiUmum: 'Ditemukan barang yang dilarang dalam tas saat razia berkala ketertiban sekolah.',
    tindakanInternalBK: 'RAHASIA BK: Pemanggilan wali murid ke ruang konseling BK pada 30 Sept. Ayah siswa kooperatif, membuat surat pernyataan penjaminan perilaku. Siswa dijadwalkan sesi konseling pemulihan setiap hari Selasa.',
    status: 'PANGGILAN_ORTU',
    dicatatOleh: 'Dra. Hj. Nuraini Kusuma, M.Pd. (Guru BK)',
    isDeleted: false
  },
  {
    id: 'p-5',
    siswaId: 's-3',
    tanggal: '2026-10-05',
    kategori: 'Kedisiplinan Waktu',
    namaPelanggaran: 'Terlambat Masuk Sekolah (>20 Menit)',
    poin: 15,
    deskripsiUmum: 'Terlambat saat gerbang sekolah sudah dikunci.',
    tindakanInternalBK: 'Peringatan keras, akumulasi poin mencapai 65. Memasuki batas SP-1.',
    status: 'DALAM_PROSES',
    dicatatOleh: 'Dra. Hj. Nuraini Kusuma, M.Pd. (Guru BK)',
    isDeleted: false
  },
  {
    id: 'p-6',
    siswaId: 's-2',
    tanggal: '2026-10-08',
    kategori: 'Tata Tertib',
    namaPelanggaran: 'Lupa Membawa Topi Saat Upacara Bendera',
    poin: 5,
    deskripsiUmum: 'Barisan upacara tanpa atribut topi seragam resmi.',
    tindakanInternalBK: 'Teguran simpatik dan peminjaman topi cadangan koperasi.',
    status: 'SELESAI',
    dicatatOleh: 'Budi Santoso, M.Kom.',
    isDeleted: false
  }
];

export const INITIAL_NILAI: NilaiAkademik[] = [
  {
    id: 'n-1',
    siswaId: 's-1',
    mataPelajaran: 'Matematika Peminatan',
    tugas: 85,
    uts: 80,
    uas: 82,
    nilaiAkhir: 82.5,
    predikat: 'B',
    semester: 'Ganjil 2026/2027'
  },
  {
    id: 'n-2',
    siswaId: 's-1',
    mataPelajaran: 'Bahasa Indonesia',
    tugas: 90,
    uts: 88,
    uas: 86,
    nilaiAkhir: 88.0,
    predikat: 'A',
    semester: 'Ganjil 2026/2027'
  },
  {
    id: 'n-3',
    siswaId: 's-1',
    mataPelajaran: 'Informatika',
    tugas: 95,
    uts: 90,
    uas: 92,
    nilaiAkhir: 92.5,
    predikat: 'A',
    semester: 'Ganjil 2026/2027'
  },
  {
    id: 'n-4',
    siswaId: 's-1',
    mataPelajaran: 'Fisika',
    tugas: 78,
    uts: 75,
    uas: 80,
    nilaiAkhir: 77.5,
    predikat: 'B',
    semester: 'Ganjil 2026/2027'
  },
  {
    id: 'n-5',
    siswaId: 's-2',
    mataPelajaran: 'Matematika Peminatan',
    tugas: 92,
    uts: 95,
    uas: 96,
    nilaiAkhir: 94.5,
    predikat: 'A',
    semester: 'Ganjil 2026/2027'
  },
  {
    id: 'n-6',
    siswaId: 's-2',
    mataPelajaran: 'Bahasa Indonesia',
    tugas: 88,
    uts: 85,
    uas: 90,
    nilaiAkhir: 87.5,
    predikat: 'A',
    semester: 'Ganjil 2026/2027'
  },
  {
    id: 'n-7',
    siswaId: 's-3',
    mataPelajaran: 'Ekonomi',
    tugas: 70,
    uts: 68,
    uas: 72,
    nilaiAkhir: 70.0,
    predikat: 'C',
    semester: 'Ganjil 2026/2027'
  },
  {
    id: 'n-8',
    siswaId: 's-3',
    mataPelajaran: 'Sosiologi',
    tugas: 75,
    uts: 72,
    uas: 74,
    nilaiAkhir: 73.5,
    predikat: 'C',
    semester: 'Ganjil 2026/2027'
  }
];

export const INITIAL_ABSENSI: AbsensiRecord[] = [
  { id: 'ab-1', siswaId: 's-1', tanggal: '2026-10-10', status: 'HADIR' },
  { id: 'ab-2', siswaId: 's-1', tanggal: '2026-10-11', status: 'SAKIT', keterangan: 'Surat dokter terlampir' },
  { id: 'ab-3', siswaId: 's-1', tanggal: '2026-10-12', status: 'HADIR' },
  { id: 'ab-4', siswaId: 's-1', tanggal: '2026-10-13', status: 'HADIR' },
  { id: 'ab-5', siswaId: 's-1', tanggal: '2026-10-14', status: 'HADIR' },
  { id: 'ab-6', siswaId: 's-2', tanggal: '2026-10-14', status: 'HADIR' },
  { id: 'ab-7', siswaId: 's-3', tanggal: '2026-10-12', status: 'ALPA', keterangan: 'Tidak ada kabar saat jam masuk' },
  { id: 'ab-8', siswaId: 's-3', tanggal: '2026-10-13', status: 'IZIN', keterangan: 'Keperluan keluarga' },
  { id: 'ab-9', siswaId: 's-3', tanggal: '2026-10-14', status: 'HADIR' },
  { id: 'ab-10', siswaId: 's-4', tanggal: '2026-10-14', status: 'HADIR' },
  { id: 'ab-11', siswaId: 's-5', tanggal: '2026-10-14', status: 'HADIR' }
];

export const INITIAL_TUGAS: DokumenTugas[] = [
  {
    id: 'doc-1',
    siswaId: 's-1',
    judulTugas: 'Makalah Analisis Algoritma Sorting Python',
    mataPelajaran: 'Informatika',
    namaFile: 'tugas_sorting_ahmad_faiz.pdf',
    ukuranFile: '1.4 MB',
    fileUrl: '#',
    tanggalUnggah: '2026-10-11',
    status: 'DINILAI',
    catatanGuru: 'Struktur kode sangat rapi dan pembahasannya lengkap. Nilai: 95.'
  },
  {
    id: 'doc-2',
    siswaId: 's-1',
    judulTugas: 'Resensi Novel Sastra Laskar Pelangi',
    mataPelajaran: 'Bahasa Indonesia',
    namaFile: 'resensi_ahmad_faiz.docx',
    ukuranFile: '520 KB',
    fileUrl: '#',
    tanggalUnggah: '2026-10-13',
    status: 'TERKIRIM',
    catatanGuru: 'Sedang dalam antrean penilaian.'
  },
  {
    id: 'doc-3',
    siswaId: 's-3',
    judulTugas: 'Laporan Observasi Pasar Tradisional',
    mataPelajaran: 'Ekonomi',
    namaFile: 'laporan_observasi_rian.pdf',
    ukuranFile: '890 KB',
    fileUrl: '#',
    tanggalUnggah: '2026-10-09',
    status: 'REVISI',
    catatanGuru: 'Tolong lengkapi data wawancara pedagang beras.'
  }
];

export const INITIAL_KRITIK: KritikSaran[] = [
  {
    id: 'k-1',
    nama: 'Bambang Pratama, S.T. (Wali Murid)',
    role: 'ORANG_TUA',
    kategori: 'Layanan BK',
    pesan: 'Sangat mengapresiasi notifikasi WhatsApp yang cepat dari guru BK ketika ada catatan pelanggaran. Membantu kami mengawal anak di rumah.',
    tanggal: '2026-10-11'
  },
  {
    id: 'k-2',
    nama: 'Budi Santoso, M.Kom.',
    role: 'WALI_KELAS',
    kategori: 'Sistem',
    pesan: 'Fitur cetak rapor ber-kop sangat membantu wali kelas saat pembagian hasil belajar di akhir semester.',
    tanggal: '2026-10-12'
  }
];

export const MOCK_USERS_BY_ROLE: Record<UserProfile['role'], UserProfile> = {
  USER: {
    id: 'u-guest',
    email: 'calon.user@gmail.com',
    namaLengkap: 'Rendra Kurnia (Pengguna Baru)',
    role: 'USER',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
  },
  SISWA: {
    id: 'u-siswa',
    email: 'ahmad.faiz@siswa.sman1teladan.sch.id',
    namaLengkap: 'Ahmad Faiz Pratama',
    role: 'SISWA',
    associatedSiswaId: 's-1',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces'
  },
  ORANG_TUA: {
    id: 'u-ortu',
    email: 'bambang.pratama@gmail.com',
    namaLengkap: 'Bambang Pratama, S.T.',
    role: 'ORANG_TUA',
    associatedSiswaId: 's-1',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces'
  },
  GURU_MAPEL: {
    id: 'u-gurumapel',
    email: 'ratna.dewi@sman1teladan.sch.id',
    namaLengkap: 'Ratna Dewi, S.Pd.',
    role: 'GURU_MAPEL',
    associatedGuruId: 'g-3',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces'
  },
  WALI_KELAS: {
    id: 'u-walikelas',
    email: 'budi.santoso@sman1teladan.sch.id',
    namaLengkap: 'Budi Santoso, M.Kom.',
    role: 'WALI_KELAS',
    associatedGuruId: 'g-2',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces'
  },
  GURU_BK: {
    id: 'u-gurubk',
    email: 'nuraini.bk@sman1teladan.sch.id',
    namaLengkap: 'Dra. Hj. Nuraini Kusuma, M.Pd.',
    role: 'GURU_BK',
    associatedGuruId: 'g-1',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&h=150&fit=crop&crop=faces'
  },
  ADMIN: {
    id: 'u-admin',
    email: 'admin.akademik@sman1teladan.sch.id',
    namaLengkap: 'Rizky Alamsyah (Admin Akademik)',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces'
  }
};
