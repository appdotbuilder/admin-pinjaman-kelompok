
import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['PETUGAS', 'MANAJER']);
export const loanStatusSchema = z.enum(['PENDING', 'VERIFIED', 'APPROVED', 'DISBURSED', 'ACTIVE', 'COMPLETED', 'DEFAULTED']);
export const paymentStatusSchema = z.enum(['PENDING', 'PAID', 'OVERDUE', 'PARTIAL']);
export const genderSchema = z.enum(['LAKI_LAKI', 'PEREMPUAN']);

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  nama_lengkap: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable()
});

export type User = z.infer<typeof userSchema>;

// Group schema
export const groupSchema = z.object({
  id: z.number(),
  nama_kelompok: z.string(),
  ketua_kelompok: z.string(),
  alamat: z.string(),
  desa: z.string(),
  kecamatan: z.string(),
  kabupaten: z.string(),
  provinsi: z.string(),
  kode_pos: z.string().nullable(),
  no_telepon: z.string().nullable(),
  tanggal_pembentukan: z.coerce.date(),
  status_aktif: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable()
});

export type Group = z.infer<typeof groupSchema>;

// Member schema
export const memberSchema = z.object({
  id: z.number(),
  kelompok_id: z.number(),
  nama_lengkap: z.string(),
  nik: z.string(),
  tempat_lahir: z.string(),
  tanggal_lahir: z.coerce.date(),
  jenis_kelamin: genderSchema,
  alamat: z.string(),
  no_telepon: z.string().nullable(),
  pekerjaan: z.string(),
  penghasilan_bulanan: z.number(),
  status_pernikahan: z.string(),
  nama_pasangan: z.string().nullable(),
  jumlah_tanggungan: z.number().int(),
  foto_ktp: z.string().nullable(),
  foto_kk: z.string().nullable(),
  is_ketua: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable()
});

export type Member = z.infer<typeof memberSchema>;

// Loan schema
export const loanSchema = z.object({
  id: z.number(),
  kelompok_id: z.number(),
  anggota_id: z.number(),
  nomor_pinjaman: z.string(),
  jumlah_pinjaman: z.number(),
  suku_bunga: z.number(),
  jangka_waktu: z.number().int(),
  tujuan_pinjaman: z.string(),
  agunan: z.string().nullable(),
  status: loanStatusSchema,
  tanggal_pengajuan: z.coerce.date(),
  tanggal_verifikasi: z.coerce.date().nullable(),
  tanggal_persetujuan: z.coerce.date().nullable(),
  tanggal_pencairan: z.coerce.date().nullable(),
  verified_by: z.number().nullable(),
  approved_by: z.number().nullable(),
  catatan_verifikasi: z.string().nullable(),
  catatan_persetujuan: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable()
});

export type Loan = z.infer<typeof loanSchema>;

// Payment schedule schema
export const paymentScheduleSchema = z.object({
  id: z.number(),
  pinjaman_id: z.number(),
  angsuran_ke: z.number().int(),
  tanggal_jatuh_tempo: z.coerce.date(),
  jumlah_pokok: z.number(),
  jumlah_bunga: z.number(),
  jumlah_total: z.number(),
  status: paymentStatusSchema,
  tanggal_bayar: z.coerce.date().nullable(),
  jumlah_dibayar: z.number().nullable(),
  denda: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable()
});

export type PaymentSchedule = z.infer<typeof paymentScheduleSchema>;

// Joint liability payment schema (tanggung renteng)
export const jointLiabilityPaymentSchema = z.object({
  id: z.number(),
  jadwal_bayar_id: z.number(),
  anggota_kontributor_id: z.number(),
  jumlah_kontribusi: z.number(),
  tanggal_kontribusi: z.coerce.date(),
  keterangan: z.string().nullable(),
  created_at: z.coerce.date()
});

export type JointLiabilityPayment = z.infer<typeof jointLiabilityPaymentSchema>;

// Document schema
export const documentSchema = z.object({
  id: z.number(),
  pinjaman_id: z.number(),
  jenis_dokumen: z.string(),
  nama_file: z.string(),
  path_file: z.string(),
  created_at: z.coerce.date()
});

export type Document = z.infer<typeof documentSchema>;

// Input schemas for creating
export const createUserInputSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  nama_lengkap: z.string().min(1),
  email: z.string().email(),
  role: userRoleSchema
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createGroupInputSchema = z.object({
  nama_kelompok: z.string().min(1),
  ketua_kelompok: z.string().min(1),
  alamat: z.string().min(1),
  desa: z.string().min(1),
  kecamatan: z.string().min(1),
  kabupaten: z.string().min(1),
  provinsi: z.string().min(1),
  kode_pos: z.string().nullable(),
  no_telepon: z.string().nullable(),
  tanggal_pembentukan: z.coerce.date()
});

export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;

export const createMemberInputSchema = z.object({
  kelompok_id: z.number(),
  nama_lengkap: z.string().min(1),
  nik: z.string().min(16).max(16),
  tempat_lahir: z.string().min(1),
  tanggal_lahir: z.coerce.date(),
  jenis_kelamin: genderSchema,
  alamat: z.string().min(1),
  no_telepon: z.string().nullable(),
  pekerjaan: z.string().min(1),
  penghasilan_bulanan: z.number().positive(),
  status_pernikahan: z.string().min(1),
  nama_pasangan: z.string().nullable(),
  jumlah_tanggungan: z.number().int().nonnegative(),
  foto_ktp: z.string().nullable(),
  foto_kk: z.string().nullable(),
  is_ketua: z.boolean()
});

export type CreateMemberInput = z.infer<typeof createMemberInputSchema>;

export const createLoanInputSchema = z.object({
  kelompok_id: z.number(),
  anggota_id: z.number(),
  jumlah_pinjaman: z.number().positive(),
  suku_bunga: z.number().positive(),
  jangka_waktu: z.number().int().positive(),
  tujuan_pinjaman: z.string().min(1),
  agunan: z.string().nullable()
});

export type CreateLoanInput = z.infer<typeof createLoanInputSchema>;

export const verifyLoanInputSchema = z.object({
  id: z.number(),
  verified_by: z.number(),
  catatan_verifikasi: z.string().nullable()
});

export type VerifyLoanInput = z.infer<typeof verifyLoanInputSchema>;

export const approveLoanInputSchema = z.object({
  id: z.number(),
  approved_by: z.number(),
  catatan_persetujuan: z.string().nullable()
});

export type ApproveLoanInput = z.infer<typeof approveLoanInputSchema>;

export const disburseLoanInputSchema = z.object({
  id: z.number()
});

export type DisburseLoanInput = z.infer<typeof disburseLoanInputSchema>;

export const recordPaymentInputSchema = z.object({
  jadwal_bayar_id: z.number(),
  jumlah_dibayar: z.number().positive(),
  denda: z.number().nonnegative().optional()
});

export type RecordPaymentInput = z.infer<typeof recordPaymentInputSchema>;

export const recordJointLiabilityPaymentInputSchema = z.object({
  jadwal_bayar_id: z.number(),
  anggota_kontributor_id: z.number(),
  jumlah_kontribusi: z.number().positive(),
  keterangan: z.string().nullable()
});

export type RecordJointLiabilityPaymentInput = z.infer<typeof recordJointLiabilityPaymentInputSchema>;

// Update schemas
export const updateGroupInputSchema = z.object({
  id: z.number(),
  nama_kelompok: z.string().min(1).optional(),
  ketua_kelompok: z.string().min(1).optional(),
  alamat: z.string().min(1).optional(),
  desa: z.string().min(1).optional(),
  kecamatan: z.string().min(1).optional(),
  kabupaten: z.string().min(1).optional(),
  provinsi: z.string().min(1).optional(),
  kode_pos: z.string().nullable().optional(),
  no_telepon: z.string().nullable().optional(),
  status_aktif: z.boolean().optional()
});

export type UpdateGroupInput = z.infer<typeof updateGroupInputSchema>;

export const updateMemberInputSchema = z.object({
  id: z.number(),
  nama_lengkap: z.string().min(1).optional(),
  alamat: z.string().min(1).optional(),
  no_telepon: z.string().nullable().optional(),
  pekerjaan: z.string().min(1).optional(),
  penghasilan_bulanan: z.number().positive().optional(),
  status_pernikahan: z.string().min(1).optional(),
  nama_pasangan: z.string().nullable().optional(),
  jumlah_tanggungan: z.number().int().nonnegative().optional(),
  foto_ktp: z.string().nullable().optional(),
  foto_kk: z.string().nullable().optional()
});

export type UpdateMemberInput = z.infer<typeof updateMemberInputSchema>;
