import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import type { UserProfile, Role, Siswa, Guru, PelanggaranBK, NilaiAkademik, AbsensiRecord, DokumenTugas, KritikSaran } from './types/siakad';
import {
  INITIAL_SISWA, INITIAL_GURU, INITIAL_PELANGGARAN, INITIAL_NILAI, INITIAL_ABSENSI, INITIAL_TUGAS, INITIAL_KRITIK, MOCK_USERS_BY_ROLE,
} from './data/mockData';
import { usePersistentState, clearPersistedState } from './hooks/usePersistentState';
import { ROLE_META } from './layout/nav';
import { AppShell } from './layout/AppShell';
import { useToast } from './components/ui/Toast';
import { Modal } from './components/ui/Modal';
import { Btn } from './components/ui/kit';

import { GuruBKDashboard } from './components/dashboards/GuruBKDashboard';
import { OrangTuaDashboard } from './components/dashboards/OrangTuaDashboard';
import { SiswaDashboard } from './components/dashboards/SiswaDashboard';
import { WaliKelasDashboard } from './components/dashboards/WaliKelasDashboard';
import { GuruMapelDashboard } from './components/dashboards/GuruMapelDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { UserDefaultDashboard } from './components/dashboards/UserDefaultDashboard';

import { WhatsAppGeneratorModal } from './components/modals/WhatsAppGeneratorModal';
import { AddPelanggaranModal } from './components/modals/AddPelanggaranModal';
import { UploadTugasModal } from './components/modals/UploadTugasModal';
import { AddNilaiModal } from './components/modals/AddNilaiModal';
import { AddAbsensiModal } from './components/modals/AddAbsensiModal';
import { AddSiswaModal } from './components/modals/AddSiswaModal';
import { KritikSaranModal } from './components/modals/KritikSaranModal';

// Dimuat hanya saat dibutuhkan agar bundel awal lebih kecil
const CetakRaporModal = lazy(() => import('./components/modals/CetakRaporModal').then((m) => ({ default: m.CetakRaporModal })));
const ArchitectureDocsModal = lazy(() => import('./components/modals/ArchitectureDocsModal').then((m) => ({ default: m.ArchitectureDocsModal })));

const WALI_PREFERENSI_KELAS = 'X-IPA-1';

export default function App() {
  const toast = useToast();

  const [role, setRole] = usePersistentState<Role>('role', 'GURU_BK');
  const [usersList, setUsersList] = usePersistentState<UserProfile[]>('users', Object.values(MOCK_USERS_BY_ROLE));
  const [siswaList, setSiswaList] = usePersistentState<Siswa[]>('siswa', INITIAL_SISWA);
  const [guruList] = usePersistentState<Guru[]>('guru', INITIAL_GURU);
  const [pelanggaranList, setPelanggaranList] = usePersistentState<PelanggaranBK[]>('pelanggaran', INITIAL_PELANGGARAN);
  const [nilaiList, setNilaiList] = usePersistentState<NilaiAkademik[]>('nilai', INITIAL_NILAI);
  const [absensiList, setAbsensiList] = usePersistentState<AbsensiRecord[]>('absensi', INITIAL_ABSENSI);
  const [tugasList, setTugasList] = usePersistentState<DokumenTugas[]>('tugas', INITIAL_TUGAS);
  const [kritikList, setKritikList] = usePersistentState<KritikSaran[]>('kritik', INITIAL_KRITIK);

  const [view, setView] = useState<string>(ROLE_META[role].nav[0]!.id);

  const [cetakSiswa, setCetakSiswa] = useState<Siswa | null>(null);
  const [wa, setWa] = useState<{ mode: 'KE_ORTU' | 'KE_BK'; siswa: Siswa; pelanggaran?: PelanggaranBK } | null>(null);
  const [addPelanggaran, setAddPelanggaran] = useState<{ siswaId?: string } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAddNilai, setShowAddNilai] = useState(false);
  const [showAddAbsensi, setShowAddAbsensi] = useState(false);
  const [showAddSiswa, setShowAddSiswa] = useState(false);
  const [showKritik, setShowKritik] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Pengguna aktif diturunkan dari daftar user agar perubahan role/foto ikut tercermin
  const currentUser: UserProfile = useMemo(
    () => usersList.find((u) => u.role === role) ?? usersList.find((u) => u.id === MOCK_USERS_BY_ROLE[role].id) ?? MOCK_USERS_BY_ROLE[role],
    [usersList, role],
  );

  const guruAktif = guruList.find((g) => g.id === currentUser.associatedGuruId);
  const guruBK = guruList.find((g) => g.jabatan === 'Guru BK');
  const waliKelasGuru = guruList.find((g) => g.jabatan === 'Wali Kelas');
  const kelasWali = (role === 'WALI_KELAS' ? guruAktif?.kelasWali : waliKelasGuru?.kelasWali) ?? WALI_PREFERENSI_KELAS;
  const activeSiswa = siswaList.find((s) => s.id === currentUser.associatedSiswaId) ?? siswaList[0];
  const kelasOptions = useMemo(() => Array.from(new Set(['X-IPA-1', 'XI-IPS-1', 'XII-MIPA-1', ...siswaList.map((s) => s.kelas)])), [siswaList]);

  const switchRole = useCallback((r: Role) => {
    setRole(r);
    setView(ROLE_META[r].nav[0]!.id);
    window.scrollTo({ top: 0 });
  }, [setRole]);

  const changeView = useCallback((v: string) => { setView(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // ===== Aksi data =====
  const savePelanggaran = (p: Omit<PelanggaranBK, 'id'>) => {
    setPelanggaranList((prev) => [{ ...p, id: `p-${Date.now()}` }, ...prev]);
    setSiswaList((prev) => prev.map((s) => (s.id === p.siswaId ? { ...s, totalPoinPelanggaran: s.totalPoinPelanggaran + p.poin } : s)));
    toast('Catatan pelanggaran disimpan');
  };
  const updateStatus = (id: string, status: PelanggaranBK['status']) => {
    setPelanggaranList((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast('Status diperbarui', 'info');
  };
  const saveNilai = (n: Omit<NilaiAkademik, 'id'>) => { setNilaiList((p) => [{ ...n, id: `n-${Date.now()}` }, ...p]); toast('Nilai disimpan'); };
  const saveAbsensi = (rs: Omit<AbsensiRecord, 'id'>[]) => {
    const t = Date.now();
    setAbsensiList((p) => [...rs.map((r, i) => ({ ...r, id: `ab-${t}-${i}` })), ...p]);
    toast(`Presensi ${rs.length} siswa disimpan`);
  };
  const saveTugas = (t: Omit<DokumenTugas, 'id'>) => { setTugasList((p) => [{ ...t, id: `doc-${Date.now()}` }, ...p]); toast('Tugas tercatat'); };
  const saveKritik = (k: Omit<KritikSaran, 'id'>) => setKritikList((p) => [{ ...k, id: `k-${Date.now()}` }, ...p]);
  const saveSiswa = (s: Omit<Siswa, 'id' | 'totalPoinPelanggaran'>) => { setSiswaList((p) => [...p, { ...s, id: `s-${Date.now()}`, totalPoinPelanggaran: 0 }]); toast('Siswa baru ditambahkan'); };

  const updateAvatar = (avatarUrl: string) => {
    if (!activeSiswa) return;
    setSiswaList((p) => p.map((s) => (s.id === activeSiswa.id ? { ...s, avatarUrl } : s)));
    if (role === 'SISWA') setUsersList((p) => p.map((u) => (u.id === currentUser.id ? { ...u, avatarUrl } : u)));
  };
  const addRole = (userId: string, newRole: Role) => {
    setUsersList((p) => p.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    toast(`Role diperbarui menjadi ${ROLE_META[newRole].label}`, 'info');
  };

  const doReset = () => { clearPersistedState(); window.location.reload(); };

  const rapor = cetakSiswa && (
    <Suspense fallback={null}>
      <CetakRaporModal
        siswa={cetakSiswa}
        waliKelas={{ nama: waliKelasGuru?.namaLengkap ?? '-', nip: waliKelasGuru?.nip ?? '-' }}
        guruBK={guruBK?.namaLengkap ?? '-'}
        nilaiList={nilaiList.filter((n) => n.siswaId === cetakSiswa.id)}
        absensiList={absensiList.filter((a) => a.siswaId === cetakSiswa.id)}
        pelanggaranList={pelanggaranList.filter((p) => p.siswaId === cetakSiswa.id)}
        onClose={() => setCetakSiswa(null)}
      />
    </Suspense>
  );

  const filt = <T extends { siswaId: string }>(l: T[]) => (activeSiswa ? l.filter((x) => x.siswaId === activeSiswa.id) : []);
  const kelasSiswa = siswaList.filter((s) => s.kelas === kelasWali);

  return (
    <AppShell
      user={currentUser}
      view={view}
      onView={changeView}
      onSwitchRole={switchRole}
      onOpenKritik={() => setShowKritik(true)}
      onOpenDocs={() => setShowDocs(true)}
      onReset={() => setConfirmReset(true)}
    >
      {role === 'GURU_BK' && (
        <GuruBKDashboard view={view} siswaList={siswaList} pelanggaranList={pelanggaranList}
          onOpenAddPelanggaran={(id) => setAddPelanggaran({ siswaId: id })}
          onOpenWhatsApp={(siswa, pelanggaran) => setWa({ mode: 'KE_ORTU', siswa, pelanggaran })}
          onUpdateStatusPelanggaran={updateStatus} />
      )}
      {role === 'ORANG_TUA' && activeSiswa && (
        <OrangTuaDashboard view={view} anak={activeSiswa} nilaiList={filt(nilaiList)} absensiList={filt(absensiList)} pelanggaranList={filt(pelanggaranList)}
          onCetakRapor={setCetakSiswa} onOpenWhatsAppGuruBK={() => setWa({ mode: 'KE_BK', siswa: activeSiswa })} />
      )}
      {role === 'SISWA' && activeSiswa && (
        <SiswaDashboard view={view} siswa={activeSiswa} nilaiList={filt(nilaiList)} absensiList={filt(absensiList)} pelanggaranList={filt(pelanggaranList)} tugasList={filt(tugasList)}
          onOpenUpload={() => setShowUpload(true)} onCetakRapor={setCetakSiswa} />
      )}
      {role === 'WALI_KELAS' && (
        <WaliKelasDashboard view={view} guruNama={guruAktif?.namaLengkap ?? currentUser.namaLengkap} kelasName={kelasWali} siswaList={siswaList} nilaiList={nilaiList} absensiList={absensiList} pelanggaranList={pelanggaranList}
          onCetakRapor={setCetakSiswa} onOpenAbsensiModal={() => setShowAddAbsensi(true)} />
      )}
      {role === 'GURU_MAPEL' && (
        <GuruMapelDashboard view={view} guruNama={guruAktif?.namaLengkap ?? currentUser.namaLengkap} mapelName={guruAktif?.mataPelajaran ?? 'Bahasa Indonesia'} siswaList={siswaList} nilaiList={nilaiList} tugasList={tugasList}
          onOpenAddNilai={() => setShowAddNilai(true)} />
      )}
      {role === 'ADMIN' && (
        <AdminDashboard view={view} siswaList={siswaList} guruList={guruList} usersList={usersList} kritikList={kritikList} onAddRole={addRole} onOpenAddSiswa={() => setShowAddSiswa(true)} />
      )}
      {role === 'USER' && <UserDefaultDashboard currentUser={currentUser} onRequestRoleChange={switchRole} onOpenKritik={() => setShowKritik(true)} />}

      {rapor}
      {wa && <WhatsAppGeneratorModal mode={wa.mode} siswa={wa.siswa} guruBK={guruBK} pelanggaranTerbaru={wa.pelanggaran} onClose={() => setWa(null)} />}
      {addPelanggaran && <AddPelanggaranModal siswaList={siswaList} preselectedSiswaId={addPelanggaran.siswaId} pencatat={`${currentUser.namaLengkap} (Guru BK)`} onSave={savePelanggaran} onClose={() => setAddPelanggaran(null)} />}
      {showUpload && activeSiswa && <UploadTugasModal siswa={activeSiswa} onSaveTugas={saveTugas} onUpdateAvatar={updateAvatar} onClose={() => setShowUpload(false)} />}
      {showAddNilai && <AddNilaiModal siswaList={siswaList} defaultMapel={guruAktif?.mataPelajaran} onSave={saveNilai} onClose={() => setShowAddNilai(false)} />}
      {showAddAbsensi && <AddAbsensiModal siswaList={kelasSiswa} kelasName={kelasWali} onSaveBatch={saveAbsensi} onClose={() => setShowAddAbsensi(false)} />}
      {showAddSiswa && <AddSiswaModal kelasOptions={kelasOptions} existingNisn={siswaList.map((s) => s.nisn)} onSave={saveSiswa} onClose={() => setShowAddSiswa(false)} />}
      {showKritik && <KritikSaranModal currentUser={currentUser} onSaveKritik={saveKritik} onClose={() => setShowKritik(false)} />}
      {showDocs && <Suspense fallback={null}><ArchitectureDocsModal onClose={() => setShowDocs(false)} /></Suspense>}
      {confirmReset && (
        <Modal title="Setel Ulang Data Demo?" size="sm" headerClass="bg-slate-900 text-white" onClose={() => setConfirmReset(false)}
          footer={<div className="flex gap-2"><Btn tone="ghost" className="flex-1" onClick={() => setConfirmReset(false)}>Batal</Btn><Btn tone="rose" className="flex-1" onClick={doReset}>Ya, Setel Ulang</Btn></div>}>
          <p className="text-sm text-slate-600">Semua perubahan yang Anda buat (pelanggaran, nilai, presensi, siswa baru, foto) akan dihapus dan data contoh dikembalikan.</p>
        </Modal>
      )}
    </AppShell>
  );
}
