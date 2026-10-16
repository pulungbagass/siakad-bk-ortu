import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, ShieldAlert, Users, BookOpen, FileText, CalendarCheck, ClipboardList,
  UserCheck, GraduationCap, MessageSquare, Heart, Clock,
} from 'lucide-react';
import type { Role } from '../types/siakad';

export interface NavItem { id: string; label: string; icon: LucideIcon }

export const ROLE_META: Record<Role, { label: string; tone: string; nav: NavItem[] }> = {
  GURU_BK: {
    label: 'Guru BK',
    tone: 'bg-rose-100 text-rose-800 border-rose-300',
    nav: [
      { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
      { id: 'kasus', label: 'Kasus', icon: ShieldAlert },
      { id: 'siswa', label: 'Siswa', icon: Users },
    ],
  },
  ORANG_TUA: {
    label: 'Orang Tua / Wali',
    tone: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    nav: [
      { id: 'ringkasan', label: 'Ringkasan', icon: Heart },
      { id: 'nilai', label: 'Nilai', icon: BookOpen },
      { id: 'bk', label: 'Catatan BK', icon: ShieldAlert },
    ],
  },
  SISWA: {
    label: 'Siswa',
    tone: 'bg-blue-100 text-blue-800 border-blue-300',
    nav: [
      { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
      { id: 'nilai', label: 'Nilai', icon: BookOpen },
      { id: 'tugas', label: 'Tugas', icon: FileText },
    ],
  },
  WALI_KELAS: {
    label: 'Wali Kelas',
    tone: 'bg-purple-100 text-purple-800 border-purple-300',
    nav: [
      { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
      { id: 'siswa', label: 'Siswa', icon: Users },
      { id: 'presensi', label: 'Presensi', icon: CalendarCheck },
    ],
  },
  GURU_MAPEL: {
    label: 'Guru Mapel',
    tone: 'bg-amber-100 text-amber-800 border-amber-300',
    nav: [
      { id: 'nilai', label: 'Nilai', icon: ClipboardList },
      { id: 'tugas', label: 'Tugas Siswa', icon: FileText },
    ],
  },
  ADMIN: {
    label: 'Admin Akademik',
    tone: 'bg-slate-800 text-white border-slate-700',
    nav: [
      { id: 'roles', label: 'Role', icon: UserCheck },
      { id: 'siswa', label: 'Siswa', icon: GraduationCap },
      { id: 'guru', label: 'Guru', icon: Users },
      { id: 'kritik', label: 'Aspirasi', icon: MessageSquare },
    ],
  },
  USER: {
    label: 'User Baru',
    tone: 'bg-slate-100 text-slate-700 border-slate-300',
    nav: [{ id: 'beranda', label: 'Beranda', icon: Clock }],
  },
};

export const ROLE_ORDER: Role[] = ['GURU_BK', 'ORANG_TUA', 'SISWA', 'WALI_KELAS', 'GURU_MAPEL', 'ADMIN', 'USER'];
