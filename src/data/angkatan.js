const TAHUN_PERTAMA = 2006

export function getAngkatanKe(tahunLulusan) {
  const ke = parseInt(tahunLulusan) - TAHUN_PERTAMA + 1
  return ke > 0 ? ke : null
}

export const initialAngkatan = [
  {
    id: 1, tahunLulusan: 2006, angkatanKe: 1, nama: 'Angkatan Al-Fatih',
    logo: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 2, tahunLulusan: 2007, angkatanKe: 2, nama: 'Angkatan Al-Aqsa',
    logo: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 3, tahunLulusan: 2008, angkatanKe: 3, nama: 'Angkatan As-Salam',
    logo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 4, tahunLulusan: 2009, angkatanKe: 4, nama: 'Angkatan An-Nur',
    logo: 'https://images.unsplash.com/photo-1548783318-a027e63bbce8?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 5, tahunLulusan: 2010, angkatanKe: 5, nama: 'Angkatan Al-Ikhlas',
    logo: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 6, tahunLulusan: 2011, angkatanKe: 6, nama: 'Angkatan Al-Huda',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 7, tahunLulusan: 2012, angkatanKe: 7, nama: 'Angkatan Al-Badr',
    logo: 'https://images.unsplash.com/photo-1441974537869-c28eae965db1?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 8, tahunLulusan: 2013, angkatanKe: 8, nama: 'Angkatan Al-Fajr',
    logo: 'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 9, tahunLulusan: 2014, angkatanKe: 9, nama: 'Angkatan Al-Amin',
    logo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 10, tahunLulusan: 2015, angkatanKe: 10, nama: 'Angkatan Al-Karim',
    logo: 'https://images.unsplash.com/photo-1500534314209-a157f00f10ac?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 11, tahunLulusan: 2016, angkatanKe: 11, nama: 'Angkatan Al-Hafizh',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 12, tahunLulusan: 2017, angkatanKe: 12, nama: 'Angkatan Al-Furqan',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 13, tahunLulusan: 2018, angkatanKe: 13, nama: 'Angkatan Al-Mujahid',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 14, tahunLulusan: 2019, angkatanKe: 14, nama: 'Angkatan Al-Ghazali',
    logo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 15, tahunLulusan: 2020, angkatanKe: 15, nama: 'Angkatan Al-Biruni',
    logo: 'https://images.unsplash.com/photo-1445307806991-c3c5d1f8db77?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 16, tahunLulusan: 2021, angkatanKe: 16, nama: 'Angkatan Ibnu Sina',
    logo: 'https://images.unsplash.com/photo-1457369785293-6fcc69e35b36?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 17, tahunLulusan: 2022, angkatanKe: 17, nama: 'Angkatan Ibnu Rushd',
    logo: 'https://images.unsplash.com/photo-1490810194309-344b3661ba39?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 18, tahunLulusan: 2023, angkatanKe: 18, nama: 'Angkatan Ibnu Khaldun',
    logo: 'https://images.unsplash.com/photo-1535585209135-d8dac5a8b028?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 19, tahunLulusan: 2024, angkatanKe: 19, nama: 'Angkatan Al-Qushayri',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 20, tahunLulusan: 2025, angkatanKe: 20, nama: 'Angkatan Al-Nawawi',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80',
  },
]
