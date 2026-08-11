import type { Anggota } from './types';
import fotoSumanto from '../assets/pimpinan/sumanto.jpg';
import fotoSarifAbdillah from '../assets/pimpinan/sarif-abdillah.jpg';
import fotoHeriPudyatmoko from '../assets/pimpinan/heri-pudyatmoko.jpg';
import fotoMohammadSaleh from '../assets/pimpinan/mohammad-saleh.jpg';
import fotoSetyaArinugroho from '../assets/pimpinan/setya-arinugroho.jpg';

const UNCONFIRMED_FRAKSI = 'fraksi-unconfirmed';
const UNCONFIRMED_DAPIL = 'Belum Dikonfirmasi';

/** Roster-only entry: real name, role, and Komisi confirmed by the user; no synthetic personal analytics attached. */
function roster(id: string, nama: string, komisiId: string): Anggota {
  return {
    id,
    nama,
    fraksiId: UNCONFIRMED_FRAKSI,
    komisiId,
    dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Anggota',
    periode: '2024-2029',
  };
}

export const anggotaList: Anggota[] = [
  // ============================= KOMISI A LEADERSHIP =============================
  {
    id: 'anggota-01', nama: 'Imam Teguh Purnomo, S.E., Akt.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-a', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Ketua Komisi A', periode: '2024-2029', totalEkspos: 412,
    sentimentPositive: 71, sentimentNeutral: 21, sentimentNegative: 8,
    topIssueIds: ['isu-tambang-ilegal', 'isu-sampah-tpa'],
    positioning: 'Vokal dalam pengawasan tata kelola pemerintahan dan penegakan ketertiban umum',
    engagementScore: 68,
  },
  {
    id: 'anggota-26', nama: 'H. Mukafi Fadli, S.T., S.Ag.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-a', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Wakil Ketua Komisi A', periode: '2024-2029', totalEkspos: 176,
    sentimentPositive: 69, sentimentNeutral: 24, sentimentNegative: 7,
    topIssueIds: ['isu-tambang-ilegal'],
    positioning: 'Menyoroti pengawasan perizinan dan pertanahan terkait aktivitas tambang ilegal',
    engagementScore: 42,
  },
  {
    id: 'anggota-27', nama: 'Juli Krisdianto, S.E.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-a', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Sekretaris Komisi A', periode: '2024-2029', totalEkspos: 118,
    sentimentPositive: 72, sentimentNeutral: 23, sentimentNegative: 5,
    topIssueIds: ['isu-sampah-tpa'],
    positioning: 'Fokus pada koordinasi administrasi Komisi A dan pengawasan ketertiban umum',
    engagementScore: 29,
  },

  // ============================= KOMISI B LEADERSHIP =============================
  {
    id: 'anggota-02', nama: 'Hj. Sri Hartini, S.T.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-b', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Ketua Komisi B', periode: '2024-2029', totalEkspos: 568,
    sentimentPositive: 78, sentimentNeutral: 16, sentimentNegative: 6,
    topIssueIds: ['isu-harga-pangan', 'isu-umkm-naik-kelas'],
    positioning: 'Advokat ketahanan pangan dan pemberdayaan UMKM naik kelas',
    engagementScore: 82,
  },
  {
    id: 'anggota-28', nama: 'H. Endro Dwi Cahyono, S.T.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-b', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Wakil Ketua Komisi B', periode: '2024-2029', totalEkspos: 198,
    sentimentPositive: 70, sentimentNeutral: 22, sentimentNegative: 8,
    topIssueIds: ['isu-harga-pangan', 'isu-pmi-bermasalah'],
    positioning: 'Mendorong stabilitas distribusi pangan dan perlindungan pekerja migran asal Jawa Tengah',
    engagementScore: 47,
  },
  {
    id: 'anggota-29', nama: 'Dr. Hj. Sholeha Kurniawati', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-b', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Sekretaris Komisi B', periode: '2024-2029', totalEkspos: 104,
    sentimentPositive: 74, sentimentNeutral: 21, sentimentNegative: 5,
    topIssueIds: ['isu-umkm-naik-kelas'],
    positioning: 'Fokus pada koordinasi administrasi Komisi B dan pendampingan koperasi',
    engagementScore: 27,
  },

  // ============================= KOMISI C LEADERSHIP =============================
  {
    id: 'anggota-03', nama: 'Bambang Hariyanto B.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-c', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Ketua Komisi C', periode: '2024-2029', totalEkspos: 289,
    sentimentPositive: 66, sentimentNeutral: 27, sentimentNegative: 7,
    topIssueIds: ['isu-investasi-jateng'],
    positioning: 'Mendorong percepatan realisasi investasi dan efisiensi anggaran daerah',
    engagementScore: 54,
  },
  {
    id: 'anggota-30', nama: 'Dedy Endriyatno, S.E.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-c', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Wakil Ketua Komisi C', periode: '2024-2029', totalEkspos: 142,
    sentimentPositive: 67, sentimentNeutral: 26, sentimentNegative: 7,
    topIssueIds: ['isu-investasi-jateng'],
    positioning: 'Mendorong pengawasan pengelolaan keuangan daerah dan BUMD',
    engagementScore: 35,
  },
  {
    id: 'anggota-31', nama: 'Drs. Anton Lami Suhadi, M.Si.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-c', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Sekretaris Komisi C', periode: '2024-2029', totalEkspos: 96,
    sentimentPositive: 70, sentimentNeutral: 25, sentimentNegative: 5,
    topIssueIds: ['isu-investasi-jateng'],
    positioning: 'Fokus pada koordinasi administrasi Komisi C dan tata kelola aset daerah',
    engagementScore: 24,
  },

  // ============================= PIMPINAN DPRD =============================
  {
    id: 'anggota-06', nama: 'H. Sumanto, S.H.', foto: fotoSumanto, fraksiId: 'fraksi-pdip', dapilId: 'Dapil I',
    jabatan: 'Ketua DPRD', periode: '2024-2029', totalEkspos: 892,
    sentimentPositive: 74, sentimentNeutral: 20, sentimentNegative: 6,
    topIssueIds: ['isu-banjir-rob', 'isu-investasi-jateng'],
    positioning: 'Menjaga keseimbangan pengawasan legislatif dan mendorong iklim investasi',
    engagementScore: 91,
  },
  {
    id: 'anggota-07', nama: 'H. Sarif Abdillah, S.Pdi.', foto: fotoSarifAbdillah, fraksiId: 'fraksi-pkb', dapilId: 'Dapil VI',
    jabatan: 'Wakil Ketua I', periode: '2024-2029', totalEkspos: 476,
    sentimentPositive: 79, sentimentNeutral: 17, sentimentNegative: 4,
    topIssueIds: ['isu-kekerasan-anak', 'isu-bansos-tepat-sasaran'],
    positioning: 'Advokat perlindungan perempuan dan anak serta transparansi bansos',
    engagementScore: 73,
  },
  {
    id: 'anggota-08', nama: 'Drs. Heri Pudyatmoko', foto: fotoHeriPudyatmoko, fraksiId: 'fraksi-gerindra', dapilId: 'Dapil III',
    jabatan: 'Wakil Ketua II', periode: '2024-2029', totalEkspos: 503,
    sentimentPositive: 60, sentimentNeutral: 21, sentimentNegative: 19,
    topIssueIds: ['isu-phk-tekstil', 'isu-pupuk-langka'],
    positioning: 'Vokal menyoroti gelombang PHK industri tekstil dan nasib buruh',
    engagementScore: 79,
  },
  {
    id: 'anggota-09', nama: 'Mohammad Saleh, S.T.', foto: fotoMohammadSaleh, fraksiId: 'fraksi-golkar', dapilId: 'Dapil VII',
    jabatan: 'Wakil Ketua III', periode: '2024-2029', totalEkspos: 398,
    sentimentPositive: 70, sentimentNeutral: 24, sentimentNegative: 6,
    topIssueIds: ['isu-tambang-ilegal', 'isu-sampah-tpa'],
    positioning: 'Mendorong penertiban tambang ilegal dan reformasi birokrasi',
    engagementScore: 62,
  },
  {
    id: 'anggota-25', nama: 'Setya Arinugroho, A.Md.', foto: fotoSetyaArinugroho, fraksiId: 'fraksi-pks', dapilId: 'Dapil IX',
    jabatan: 'Wakil Ketua IV', periode: '2024-2029', totalEkspos: 312,
    sentimentPositive: 75, sentimentNeutral: 20, sentimentNegative: 5,
    topIssueIds: ['isu-macet-pantura', 'isu-krisis-air-bersih'],
    positioning: 'Mendorong penguatan pengawasan pembangunan infrastruktur dan aksesibilitas wilayah',
    engagementScore: 58,
  },

  // ============================= KOMISI D LEADERSHIP =============================
  {
    id: 'anggota-04', nama: 'Hj. Nur Saadah, S.Pd.I., M.H.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-d', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Ketua Komisi D', periode: '2024-2029', totalEkspos: 641,
    sentimentPositive: 58, sentimentNeutral: 22, sentimentNegative: 20,
    topIssueIds: ['isu-banjir-infrastruktur', 'isu-jalan-rusak-non-pantura'],
    positioning: 'Fokus pada percepatan perbaikan infrastruktur jalan dan mitigasi banjir',
    engagementScore: 77,
  },
  {
    id: 'anggota-92', nama: 'Ir. H. Joko Purnomo, M.H.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-d', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Wakil Ketua Komisi D', periode: '2024-2029', totalEkspos: 187,
    sentimentPositive: 68, sentimentNeutral: 23, sentimentNegative: 9,
    topIssueIds: ['isu-jalan-rusak-non-pantura', 'isu-trans-jateng'],
    positioning: 'Mendorong pemerataan pembangunan jalan dan penataan transportasi publik',
    engagementScore: 45,
  },
  {
    id: 'anggota-93', nama: 'Kholik Idris, S.E., S.H., M.Si.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-d', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Sekretaris Komisi D', periode: '2024-2029', totalEkspos: 121,
    sentimentPositive: 65, sentimentNeutral: 24, sentimentNegative: 11,
    topIssueIds: ['isu-banjir-rob', 'isu-krisis-air-bersih'],
    positioning: 'Fokus pada koordinasi administrasi Komisi D dan mitigasi banjir rob pesisir utara',
    engagementScore: 31,
  },

  // ============================= KOMISI E LEADERSHIP =============================
  {
    id: 'anggota-05', nama: 'Dr. Messy Widiastuti, M.A.R.S.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-e', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Ketua Komisi E', periode: '2024-2029', totalEkspos: 534,
    sentimentPositive: 81, sentimentNeutral: 15, sentimentNegative: 4,
    topIssueIds: ['isu-stunting-kesehatan', 'isu-ppdb-zonasi'],
    positioning: 'Fokus pada pendidikan dan pemerataan layanan kesehatan ibu-anak',
    engagementScore: 85,
  },
  {
    id: 'anggota-94', nama: 'Yudi Indras Wiendarto, S.E.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-e', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Wakil Ketua Komisi E', periode: '2024-2029', totalEkspos: 176,
    sentimentPositive: 76, sentimentNeutral: 20, sentimentNegative: 4,
    topIssueIds: ['isu-stunting-kesehatan', 'isu-ppdb-zonasi'],
    positioning: 'Mendorong pemerataan akses pendidikan dan penguatan layanan kesehatan dasar',
    engagementScore: 43,
  },
  {
    id: 'anggota-95', nama: 'H. Zainuddin, S.H.I.', fraksiId: UNCONFIRMED_FRAKSI, komisiId: 'komisi-e', dapilId: UNCONFIRMED_DAPIL,
    jabatan: 'Sekretaris Komisi E', periode: '2024-2029', totalEkspos: 113,
    sentimentPositive: 74, sentimentNeutral: 21, sentimentNegative: 5,
    topIssueIds: ['isu-bansos-tepat-sasaran', 'isu-kekerasan-anak'],
    positioning: 'Fokus pada koordinasi administrasi Komisi E dan pengawasan bantuan sosial',
    engagementScore: 28,
  },

  // ============================= KOMISI A — ANGGOTA (roster, belum ada profil analitik) =============================
  roster('anggota-32', 'Sumarsono, S.Sos.', 'komisi-a'),
  roster('anggota-33', 'H. Moch. Ichwan, S.H., M.H.', 'komisi-a'),
  roster('anggota-34', 'Ayuning Sekar Suci, B.Bus., M.A.', 'komisi-a'),
  roster('anggota-35', 'Putro Negoro Rekthosetho, S.H., M.Kn.', 'komisi-a'),
  roster('anggota-36', 'Ribut Budi Santoso, S.P.', 'komisi-a'),
  roster('anggota-37', 'Abdul Aziz, S.I.P.', 'komisi-a'),
  roster('anggota-38', 'Zaki Mubarok', 'komisi-a'),
  roster('anggota-39', 'Kholid Abdillah', 'komisi-a'),
  roster('anggota-40', 'Tietha Ernawati Suwarto, S.P., M.B.A.', 'komisi-a'),
  roster('anggota-41', 'H. Tugiman B Semita, S.P.', 'komisi-a'),
  roster('anggota-42', 'Hafidz Alhaq Fatih, S.T.', 'komisi-a'),
  roster('anggota-43', 'Dr. Agus Wijayanto, S.H., M.Kn.', 'komisi-a'),
  roster('anggota-44', 'Noval Utoyo Adji', 'komisi-a'),
  roster('anggota-45', 'Orizah Santifa', 'komisi-a'),
  roster('anggota-46', 'Drs. H. Soenarno, M.M.', 'komisi-a'),
  roster('anggota-47', 'Nur Fatwah', 'komisi-a'),
  roster('anggota-48', 'Bintang Romadhon', 'komisi-a'),
  roster('anggota-49', 'Edris Santoso', 'komisi-a'),
  roster('anggota-50', 'Antonius Yogo Prabowo', 'komisi-a'),
  roster('anggota-51', 'Subandi Padmo Rejo (PAW)', 'komisi-a'),

  // ============================= KOMISI B — ANGGOTA (roster, belum ada profil analitik) =============================
  roster('anggota-52', 'Muhammad Hajar Zainudin, S.Sos., M.Hum.', 'komisi-b'),
  roster('anggota-53', 'Endrianingsih Yunita H., S.P.', 'komisi-b'),
  roster('anggota-54', 'Kadarwati, S.H., M.H.', 'komisi-b'),
  roster('anggota-55', 'Irna Setiawati, S.E., M.M.', 'komisi-b'),
  roster('anggota-56', 'Ari Santoso', 'komisi-b'),
  roster('anggota-57', 'H. Muktafa Dimyati Rois', 'komisi-b'),
  roster('anggota-58', 'H. Abdulah Aminudin', 'komisi-b'),
  roster('anggota-59', 'Muhaimin', 'komisi-b'),
  roster('anggota-60', 'David Ishaq Aryadi, S.E., M.M.', 'komisi-b'),
  roster('anggota-61', 'Drs. H. Yusuf Hidayat', 'komisi-b'),
  roster('anggota-62', 'Amir Masduki, S.Pd.I.', 'komisi-b'),
  roster('anggota-63', 'Martono, S.Pd., M.Si.', 'komisi-b'),
  roster('anggota-64', 'H. Musyaffa', 'komisi-b'),
  roster('anggota-65', 'Ferry Wawan Cahyono, S.Pi., M.Si.', 'komisi-b'),
  roster('anggota-66', 'Harun Abdul Khafizh', 'komisi-b'),
  roster('anggota-67', 'Ardhie Kurniawan, A.Md.', 'komisi-b'),
  roster('anggota-68', 'Tri Wanto', 'komisi-b'),
  roster('anggota-69', 'H. Sofwan Sumadi', 'komisi-b'),
  roster('anggota-70', 'Muhammad Farchan, M.T.', 'komisi-b'),
  roster('anggota-71', 'Moehammad Noer Dhuha, S.H.', 'komisi-b'),

  // ============================= KOMISI C — ANGGOTA (roster, belum ada profil analitik) =============================
  roster('anggota-72', 'RR. Maria Tri Mangesti, S.E.', 'komisi-c'),
  roster('anggota-73', 'Denny Nur Cahyanto, S.E.', 'komisi-c'),
  roster('anggota-74', 'A. Baginda Muhammad Mahfuz H.', 'komisi-c'),
  roster('anggota-75', 'M.G. Marhaenis Manto', 'komisi-c'),
  roster('anggota-76', 'Leonardo Ludwig Krisnada', 'komisi-c'),
  roster('anggota-77', 'Wulan Purnama Sari', 'komisi-c'),
  roster('anggota-78', 'Ulil Albab, S.Psi.', 'komisi-c'),
  roster('anggota-79', 'Drs. H. Moh Budiyono, B.Sc.', 'komisi-c'),
  roster('anggota-80', 'Hj. Siti Rosidah, S.Ag.', 'komisi-c'),
  roster('anggota-81', "Ni'matul Azizah, S.H.I.", 'komisi-c'),
  roster('anggota-82', 'Mifta Reza NP, S.P., M.M.', 'komisi-c'),
  roster('anggota-83', 'Dwi Yasmanto', 'komisi-c'),
  roster('anggota-84', 'Sudarsono S.', 'komisi-c'),
  roster('anggota-85', 'Supriyanto', 'komisi-c'),
  roster('anggota-86', 'Catur Agus Saptono, M.H.', 'komisi-c'),
  roster('anggota-87', 'H. Muhammad Afif', 'komisi-c'),
  roster('anggota-88', 'Asrar, S.E.', 'komisi-c'),
  roster('anggota-89', 'I Putu Doddy', 'komisi-c'),
  roster('anggota-90', 'Muhammad Naryoko, M.S.I.', 'komisi-c'),
  roster('anggota-91', 'H. Akhwan, S.H.', 'komisi-c'),

  // ============================= KOMISI D — ANGGOTA (roster, belum ada profil analitik) =============================
  roster('anggota-96', 'Andang Wahyu Triyanto, S.E., M.M.', 'komisi-d'),
  roster('anggota-97', 'Dwi Adi Agung Nugroho, S.I.Kom.', 'komisi-d'),
  roster('anggota-98', 'H. Iskandar Zulkarnain', 'komisi-d'),
  roster('anggota-99', 'H. Sarei Abdul Rosyid, S.IP.', 'komisi-d'),
  roster('anggota-100', 'Mulyadi, S.E., M.M.', 'komisi-d'),
  roster('anggota-101', 'Asfirla Harisanto, S.E.', 'komisi-d'),
  roster('anggota-102', 'H. Sugiharto, S.T., S.H., M.Sos.', 'komisi-d'),
  roster('anggota-103', 'Niken Mayasari', 'komisi-d'),
  roster('anggota-104', 'H. M. Iskhak, S.H., M.A., M.M.', 'komisi-d'),
  roster('anggota-105', 'Drs. H. Masfui Masduki, M.M.', 'komisi-d'),
  roster('anggota-106', 'P. Bayu Kusuma, S.T.', 'komisi-d'),
  roster('anggota-107', 'Bondan S Bomo Aji, S.Sos., M.M.', 'komisi-d'),
  roster('anggota-108', 'H. Nurul Furqon, S.E.', 'komisi-d'),
  roster('anggota-109', 'Ir. Sukardiyono', 'komisi-d'),
  roster('anggota-110', 'H. Siswanto, S.T., M.T.', 'komisi-d'),
  roster('anggota-111', 'Andiniya K P, S.Sos., M.H.', 'komisi-d'),
  roster('anggota-112', 'Karsono, S.Pd.I.', 'komisi-d'),
  roster('anggota-113', 'Much. Muchlis Ariston, S.T.', 'komisi-d'),
  roster('anggota-114', 'M. Ali Wafa', 'komisi-d'),
  roster('anggota-115', 'Zaki Safrudin Prihatin', 'komisi-d'),

  // ============================= KOMISI E — ANGGOTA (roster, belum ada profil analitik) =============================
  roster('anggota-116', 'Saiful Hadi, S.I.Kom.', 'komisi-e'),
  roster('anggota-117', 'Yohanes Winarto, S.H., M.H.', 'komisi-e'),
  roster('anggota-118', 'Hartanto', 'komisi-e'),
  roster('anggota-119', 'Muhammad Isnaeni', 'komisi-e'),
  roster('anggota-120', 'Krisseptiana Tia Hendi', 'komisi-e'),
  roster('anggota-121', 'Bagus Suryokusumo, S.Pd.', 'komisi-e'),
  roster('anggota-122', 'H. Abdul Hamid, S.Pd.I.', 'komisi-e'),
  roster('anggota-123', 'Sumarwati, S.Pd., M.A.P.', 'komisi-e'),
  roster('anggota-124', 'Aminudin Latif, S.Pd.I.', 'komisi-e'),
  roster('anggota-125', 'Shinta Laila, S.H., M.H.', 'komisi-e'),
  roster('anggota-126', 'Muh Rizqi Iskandar Muda', 'komisi-e'),
  roster('anggota-127', 'Padmasari Mestikajati, S.IP., M.Si.', 'komisi-e'),
  roster('anggota-128', 'Arif Wahyudi, S.H.', 'komisi-e'),
  roster('anggota-129', 'H. M. Dipa Yustia Pasa, M.Kn.', 'komisi-e'),
  roster('anggota-130', 'Hj. Kartina Sukawati, S.E., M.M.', 'komisi-e'),
  roster('anggota-131', 'H. Sururul Fuad', 'komisi-e'),
  roster('anggota-132', 'Hj. Ida Nurul Farida, M.Pd.', 'komisi-e'),
  roster('anggota-133', "Ja'far Shodiq, S.Hum.", 'komisi-e'),
  roster('anggota-134', 'Drs. H. Amin Makhsum', 'komisi-e'),
  roster('anggota-135', 'dr. Faiz Alaudien Reza Mardhika', 'komisi-e'),
];

export const anggotaById = (id: string) => anggotaList.find((a) => a.id === id);
