
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['PETUGAS', 'MANAJER']);
export const loanStatusEnum = pgEnum('loan_status', ['PENDING', 'VERIFIED', 'APPROVED', 'DISBURSED', 'ACTIVE', 'COMPLETED', 'DEFAULTED']);
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING', 'PAID', 'OVERDUE', 'PARTIAL']);
export const genderEnum = pgEnum('gender', ['LAKI_LAKI', 'PEREMPUAN']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  nama_lengkap: text('nama_lengkap').notNull(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
});

// Groups table
export const groupsTable = pgTable('groups', {
  id: serial('id').primaryKey(),
  nama_kelompok: text('nama_kelompok').notNull(),
  ketua_kelompok: text('ketua_kelompok').notNull(),
  alamat: text('alamat').notNull(),
  desa: text('desa').notNull(),
  kecamatan: text('kecamatan').notNull(),
  kabupaten: text('kabupaten').notNull(),
  provinsi: text('provinsi').notNull(),
  kode_pos: text('kode_pos'),
  no_telepon: text('no_telepon'),
  tanggal_pembentukan: timestamp('tanggal_pembentukan').notNull(),
  status_aktif: boolean('status_aktif').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
});

// Members table
export const membersTable = pgTable('members', {
  id: serial('id').primaryKey(),
  kelompok_id: integer('kelompok_id').notNull(),
  nama_lengkap: text('nama_lengkap').notNull(),
  nik: text('nik').notNull().unique(),
  tempat_lahir: text('tempat_lahir').notNull(),
  tanggal_lahir: timestamp('tanggal_lahir').notNull(),
  jenis_kelamin: genderEnum('jenis_kelamin').notNull(),
  alamat: text('alamat').notNull(),
  no_telepon: text('no_telepon'),
  pekerjaan: text('pekerjaan').notNull(),
  penghasilan_bulanan: numeric('penghasilan_bulanan', { precision: 15, scale: 2 }).notNull(),
  status_pernikahan: text('status_pernikahan').notNull(),
  nama_pasangan: text('nama_pasangan'),
  jumlah_tanggungan: integer('jumlah_tanggungan').notNull(),
  foto_ktp: text('foto_ktp'),
  foto_kk: text('foto_kk'),
  is_ketua: boolean('is_ketua').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
});

// Loans table
export const loansTable = pgTable('loans', {
  id: serial('id').primaryKey(),
  kelompok_id: integer('kelompok_id').notNull(),
  anggota_id: integer('anggota_id').notNull(),
  nomor_pinjaman: text('nomor_pinjaman').notNull().unique(),
  jumlah_pinjaman: numeric('jumlah_pinjaman', { precision: 15, scale: 2 }).notNull(),
  suku_bunga: numeric('suku_bunga', { precision: 5, scale: 2 }).notNull(),
  jangka_waktu: integer('jangka_waktu').notNull(),
  tujuan_pinjaman: text('tujuan_pinjaman').notNull(),
  agunan: text('agunan'),
  status: loanStatusEnum('status').default('PENDING').notNull(),
  tanggal_pengajuan: timestamp('tanggal_pengajuan').defaultNow().notNull(),
  tanggal_verifikasi: timestamp('tanggal_verifikasi'),
  tanggal_persetujuan: timestamp('tanggal_persetujuan'),
  tanggal_pencairan: timestamp('tanggal_pencairan'),
  verified_by: integer('verified_by'),
  approved_by: integer('approved_by'),
  catatan_verifikasi: text('catatan_verifikasi'),
  catatan_persetujuan: text('catatan_persetujuan'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
});

// Payment schedules table
export const paymentSchedulesTable = pgTable('payment_schedules', {
  id: serial('id').primaryKey(),
  pinjaman_id: integer('pinjaman_id').notNull(),
  angsuran_ke: integer('angsuran_ke').notNull(),
  tanggal_jatuh_tempo: timestamp('tanggal_jatuh_tempo').notNull(),
  jumlah_pokok: numeric('jumlah_pokok', { precision: 15, scale: 2 }).notNull(),
  jumlah_bunga: numeric('jumlah_bunga', { precision: 15, scale: 2 }).notNull(),
  jumlah_total: numeric('jumlah_total', { precision: 15, scale: 2 }).notNull(),
  status: paymentStatusEnum('status').default('PENDING').notNull(),
  tanggal_bayar: timestamp('tanggal_bayar'),
  jumlah_dibayar: numeric('jumlah_dibayar', { precision: 15, scale: 2 }),
  denda: numeric('denda', { precision: 15, scale: 2 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
});

// Joint liability payments table (tanggung renteng)
export const jointLiabilityPaymentsTable = pgTable('joint_liability_payments', {
  id: serial('id').primaryKey(),
  jadwal_bayar_id: integer('jadwal_bayar_id').notNull(),
  anggota_kontributor_id: integer('anggota_kontributor_id').notNull(),
  jumlah_kontribusi: numeric('jumlah_kontribusi', { precision: 15, scale: 2 }).notNull(),
  tanggal_kontribusi: timestamp('tanggal_kontribusi').defaultNow().notNull(),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Documents table
export const documentsTable = pgTable('documents', {
  id: serial('id').primaryKey(),
  pinjaman_id: integer('pinjaman_id').notNull(),
  jenis_dokumen: text('jenis_dokumen').notNull(),
  nama_file: text('nama_file').notNull(),
  path_file: text('path_file').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  verifiedLoans: many(loansTable, { relationName: 'verifier' }),
  approvedLoans: many(loansTable, { relationName: 'approver' })
}));

export const groupsRelations = relations(groupsTable, ({ many }) => ({
  members: many(membersTable),
  loans: many(loansTable)
}));

export const membersRelations = relations(membersTable, ({ one, many }) => ({
  group: one(groupsTable, {
    fields: [membersTable.kelompok_id],
    references: [groupsTable.id]
  }),
  loans: many(loansTable),
  jointLiabilityPayments: many(jointLiabilityPaymentsTable)
}));

export const loansRelations = relations(loansTable, ({ one, many }) => ({
  group: one(groupsTable, {
    fields: [loansTable.kelompok_id],
    references: [groupsTable.id]
  }),
  member: one(membersTable, {
    fields: [loansTable.anggota_id],
    references: [membersTable.id]
  }),
  verifier: one(usersTable, {
    fields: [loansTable.verified_by],
    references: [usersTable.id],
    relationName: 'verifier'
  }),
  approver: one(usersTable, {
    fields: [loansTable.approved_by],
    references: [usersTable.id],
    relationName: 'approver'
  }),
  paymentSchedules: many(paymentSchedulesTable),
  documents: many(documentsTable)
}));

export const paymentSchedulesRelations = relations(paymentSchedulesTable, ({ one, many }) => ({
  loan: one(loansTable, {
    fields: [paymentSchedulesTable.pinjaman_id],
    references: [loansTable.id]
  }),
  jointLiabilityPayments: many(jointLiabilityPaymentsTable)
}));

export const jointLiabilityPaymentsRelations = relations(jointLiabilityPaymentsTable, ({ one }) => ({
  paymentSchedule: one(paymentSchedulesTable, {
    fields: [jointLiabilityPaymentsTable.jadwal_bayar_id],
    references: [paymentSchedulesTable.id]
  }),
  contributor: one(membersTable, {
    fields: [jointLiabilityPaymentsTable.anggota_kontributor_id],
    references: [membersTable.id]
  })
}));

export const documentsRelations = relations(documentsTable, ({ one }) => ({
  loan: one(loansTable, {
    fields: [documentsTable.pinjaman_id],
    references: [loansTable.id]
  })
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  groups: groupsTable,
  members: membersTable,
  loans: loansTable,
  paymentSchedules: paymentSchedulesTable,
  jointLiabilityPayments: jointLiabilityPaymentsTable,
  documents: documentsTable
};
