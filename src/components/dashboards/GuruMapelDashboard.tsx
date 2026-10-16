import React from 'react';
import { PlusCircle, Award, FileText } from 'lucide-react';
import type { Siswa, NilaiAkademik, DokumenTugas } from '../../types/siakad';
import { Banner, BannerButton, Btn, Card, CardHeader, Badge, Empty } from '../ui/kit';
import { NilaiTable } from '../NilaiTable';
import { formatTanggalPendek } from '../../utils/format';

interface Props {
  view: string;
  guruNama: string;
  mapelName: string;
  siswaList: Siswa[];
  nilaiList: NilaiAkademik[];
  tugasList: DokumenTugas[];
  onOpenAddNilai: () => void;
}

export const GuruMapelDashboard: React.FC<Props> = ({ view, guruNama, mapelName, siswaList, nilaiList, tugasList, onOpenAddNilai }) => {
  const nilai = nilaiList.filter((n) => n.mataPelajaran.toLowerCase().includes(mapelName.toLowerCase()));
  const tugas = tugasList.filter((t) => t.mataPelajaran.toLowerCase().includes(mapelName.toLowerCase()));

  return (
    <div className="space-y-5">
      <Banner
        tone="amber"
        chip={`Guru Pengampu: ${guruNama}`}
        title={`Mapel: ${mapelName}`}
        desc="Input nilai tugas, UTS, UAS dan periksa dokumen tugas siswa."
        actions={<BannerButton onClick={onOpenAddNilai}><PlusCircle className="h-4 w-4 text-amber-700" /> Input Nilai Siswa</BannerButton>}
      />
      {view === 'nilai' && (
        <Card>
          <CardHeader icon={<Award className="h-4 w-4 text-amber-600" />} title={`Rekap Nilai (${nilai.length})`} right={<Btn onClick={onOpenAddNilai} tone="ghost" className="min-h-9 text-xs">+ Tambah</Btn>} />
          <NilaiTable items={nilai} siswaList={siswaList} />
          <p className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">Bobot: Tugas 30% • UTS 35% • UAS 35%</p>
        </Card>
      )}
      {view === 'tugas' && (
        <Card>
          <CardHeader icon={<FileText className="h-4 w-4 text-amber-600" />} title={`Tugas Masuk (${tugas.length})`} />
          {tugas.length === 0 ? <Empty title="Belum ada tugas masuk untuk mapel ini" /> : (
            <ul className="divide-y divide-slate-100">
              {tugas.map((t) => {
                const s = siswaList.find((x) => x.id === t.siswaId);
                return (
                  <li key={t.id} className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">{t.judulTugas}</p>
                      <p className="break-words text-[11px] text-slate-500">{s?.namaLengkap} ({s?.kelas}) • {t.namaFile} • {formatTanggalPendek(t.tanggalUnggah)}</p>
                    </div>
                    <Badge tone={t.status === 'DINILAI' ? 'emerald' : t.status === 'REVISI' ? 'rose' : 'blue'}>{t.status}</Badge>
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
