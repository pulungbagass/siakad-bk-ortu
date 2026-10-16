import React from 'react';
import { Award, GraduationCap } from 'lucide-react';

interface KopSekolahProps {
  minimal?: boolean;
}

export const KopSekolah: React.FC<KopSekolahProps> = ({ minimal = false }) => {
  return (
    <div className="w-full mb-6 text-center select-none">
      <div className="flex items-center justify-between gap-4 px-2">
        {/* Left emblem / logo placeholder */}
        <div className="w-20 h-20 rounded-full border-2 border-blue-900 flex items-center justify-center bg-blue-50 text-blue-900 shrink-0 shadow-xs">
          <GraduationCap className="w-10 h-10" />
        </div>

        {/* Center Kop text */}
        <div className="flex-1 text-center font-serif text-slate-900">
          <h3 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-700">
            Pemerintah Daerah Provinsi Jawa Barat
          </h3>
          <h2 className="text-xs sm:text-base font-bold tracking-widest uppercase text-slate-800">
            Dinas Pendidikan Wilayah VII
          </h2>
          <h1 className="text-base sm:text-xl font-extrabold tracking-wide uppercase text-blue-950 mt-0.5">
            SMA Negeri 1 Teladan Bangsa
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
            NPSN: 20219876 • NSS: 301026001001 • Akreditasi A (Unggul)
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 italic mt-0.5">
            Jl. Pendidikan Karakter No. 100, Bandung 40132 | Telp: (022) 7234567 | Pos-el: info@sman1teladan.sch.id
          </p>
        </div>

        {/* Right accreditation emblem */}
        <div className="w-20 h-20 rounded-full border-2 border-amber-600 flex flex-col items-center justify-center bg-amber-50 text-amber-800 shrink-0 shadow-xs">
          <Award className="w-6 h-6 text-amber-600" />
          <span className="text-[9px] font-bold mt-0.5 uppercase tracking-tighter">Akreditasi A</span>
        </div>
      </div>

      {/* Official double rule divider: 3px solid + 1px solid */}
      <div className="mt-3">
        <div className="w-full border-b-[3px] border-slate-900"></div>
        <div className="w-full border-b-[1px] border-slate-900 mt-[2px]"></div>
      </div>
    </div>
  );
};
