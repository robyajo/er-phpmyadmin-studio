import type { Profile } from "@/types/connection";
import type { TableItem } from "./types";

export const INITIAL_PROFILES: Profile[] = [
  {
    connection_revision: 2,
    created_at: "2026-10-20T09:00:00.000000Z",
    database: "",
    db_type: "mariadb",
    environment: "Local",
    favorite: true,
    has_saved_password: false,
    host: "127.0.0.1",
    id: "a1c3d4e5-3333-4444-8888-3456789abcde",
    last_used_at: "2026-10-24T02:00:00.000000Z",
    method: "direct",
    name: "Localhost MariaDB (Port 3306)",
    port: 3306,
    ssh: null,
    tls: { ca: null, cert: null, enabled: false, key: null, verify: true },
    updated_at: "2026-10-24T02:00:00.000000Z",
    username: "root",
  },
  {
    connection_revision: 2,
    created_at: "2026-10-22T10:00:00.000000Z",
    database: "",
    db_type: "mysql",
    environment: "Production",
    favorite: true,
    has_saved_password: true,
    host: "db-primary.production.internal",
    id: "e4a1b2c3-1111-4444-8888-123456789abc",
    last_used_at: "2026-10-23T23:15:00.000000Z",
    method: "direct",
    name: "Production Ecommerce Cluster",
    port: 3306,
    ssh: null,
    tls: {
      ca: "/etc/ssl/certs/prod-ca.pem",
      cert: null,
      enabled: true,
      key: null,
      verify: true,
    },
    updated_at: "2026-10-23T14:30:00.000000Z",
    username: "app_admin",
  },
  {
    connection_revision: 1,
    created_at: "2026-10-21T08:00:00.000000Z",
    database: "",
    db_type: "auto",
    environment: "Staging",
    favorite: false,
    has_saved_password: false,
    host: "10.0.4.15",
    id: "f5b2c3d4-2222-4444-8888-23456789abcd",
    last_used_at: "2026-10-23T20:45:00.000000Z",
    method: "ssh",
    name: "Staging API & Auth Database",
    port: 3306,
    ssh: {
      auth_type: "key",
      host: "bastion.staging.dev",
      key: "~/.ssh/id_ed25519",
      passphrase: "",
      password: "",
      port: 22,
      username: "ubuntu",
    },
    tls: { ca: null, cert: null, enabled: false, key: null, verify: true },
    updated_at: "2026-10-22T11:20:00.000000Z",
    username: "staging_user",
  },
];

export const FALLBACK_TABLES: TableItem[] = [
  {
    collation: "utf8mb4_unicode_ci",
    engine: "InnoDB",
    name: "users",
    rows: 12_450,
    size: "3.1 MB",
  },
  {
    collation: "utf8mb4_unicode_ci",
    engine: "InnoDB",
    name: "orders",
    rows: 84_200,
    size: "14.2 MB",
  },
  {
    collation: "utf8mb4_unicode_ci",
    engine: "InnoDB",
    name: "order_items",
    rows: 215_800,
    size: "28.5 MB",
  },
  {
    collation: "utf8mb4_unicode_ci",
    engine: "InnoDB",
    name: "products",
    rows: 1420,
    size: "1.8 MB",
  },
  {
    collation: "utf8mb4_unicode_ci",
    engine: "InnoDB",
    name: "payments",
    rows: 63_100,
    size: "11.4 MB",
  },
  {
    collation: "utf8mb4_unicode_ci",
    engine: "InnoDB",
    name: "migrations",
    rows: 42,
    size: "16 KB",
  },
];

export const FALLBACK_DATABASES: string[] = [
  "db_camp",
  "db_hono_api",
  "production_db",
  "test_db",
  "information_schema",
  "mysql",
  "performance_schema",
  "sys",
];

export const DB_CAMP_TABLES: TableItem[] = [
  { name: "cache", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
  { name: "cache_locks", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
  { name: "failed_jobs", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "image_transactions", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "invest_products", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
  { name: "jobs", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "job_batches", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
  { name: "kabids", rows: 1, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "migrations", rows: 16, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
  { name: "narasumbers", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "notifications", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "48.0 KiB", dataFree: 0 },
  { name: "opds", rows: 45, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "password_reset_tokens", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
  { name: "personal_access_tokens", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "48.0 KiB", dataFree: 0 },
  { name: "proses_transaksis", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "services", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "sessions", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "48.0 KiB", dataFree: 0 },
  { name: "transactions", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "users", rows: 1, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "48.0 KiB", dataFree: 0 },
  { name: "verifieds", rows: 0, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
];

export const DB_HONO_API_TABLES: TableItem[] = [
  { name: "user", rows: 3, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "32.0 KiB", dataFree: 0 },
  { name: "posts", rows: 12, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "48.0 KiB", dataFree: 0 },
  { name: "comments", rows: 34, engine: "InnoDB", collation: "utf8mb4_unicode_ci", size: "16.0 KiB", dataFree: 0 },
];

export const FALLBACK_USER_ROWS = [
  {
    id: "28a6cfc9-622e-4e9b-b752-cd4cbf0b8117",
    name: "Admin",
    email: "admin@gmail.com",
    email_verified: 1,
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin",
    role: "ADMIN",
    password_hash: "6a383ce269d3712b79b111badee6828b:8c443ce902e83b117",
  },
  {
    id: "93ebdbe6-3b4b-4a05-9b77-2249a3f66af6",
    name: "Register Test",
    email: "register_test@gmail.com",
    email_verified: 0,
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Register",
    role: "USER",
    password_hash: "ba71c5e691161c82a003a2b52a823420:1258d6831a3fd6af6",
  },
  {
    id: "e03d34f2-2b0e-4753-892e-64e0be3e3b19",
    name: "User",
    email: "user@gmail.com",
    email_verified: 1,
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=User",
    role: "USER",
    password_hash: "6a383ce269d3712b79b111badee6828b:8c443ce902e833b19",
  },
];

export function getFallbackTablesForDb(dbName: string): TableItem[] {
  if (dbName === "db_camp") return DB_CAMP_TABLES;
  if (dbName === "db_hono_api") return DB_HONO_API_TABLES;
  return FALLBACK_TABLES;
}

export function getFallbackQueryResults(tableName: string) {
  if (tableName === "user" || tableName === "users") {
    return {
      columns: ["id", "name", "email", "email_verified", "image", "role", "password_hash"],
      executionTimeMs: 0.1,
      ok: true,
      rowCount: FALLBACK_USER_ROWS.length,
      rows: [...FALLBACK_USER_ROWS],
    };
  }

  if (tableName === "opds") {
    return {
      columns: ["id", "nama_opd", "kode_opd", "alamat", "telepon", "created_at"],
      executionTimeMs: 0.2,
      ok: true,
      rowCount: 3,
      rows: [
        { id: 1, nama_opd: "Dinas Komunikasi dan Informatika", kode_opd: "DISKOMINFO", alamat: "Jl. Veteran No. 1", telepon: "0751-12345", created_at: "2026-01-10" },
        { id: 2, nama_opd: "Badan Kepegawaian Daerah", kode_opd: "BKD", alamat: "Jl. Sudirman No. 45", telepon: "0751-23456", created_at: "2026-01-12" },
        { id: 3, nama_opd: "Dinas Pendidikan dan Kebudayaan", kode_opd: "DISDIKBUD", alamat: "Jl. Gajah Mada No. 12", telepon: "0751-34567", created_at: "2026-01-15" },
      ],
    };
  }

  return {
    columns: ["id", "name", "created_at", "updated_at"],
    executionTimeMs: 0.1,
    ok: true,
    rowCount: 2,
    rows: [
      { id: 1, name: `Sample ${tableName} 1`, created_at: "2026-10-24 10:00:00", updated_at: "2026-10-24 10:00:00" },
      { id: 2, name: `Sample ${tableName} 2`, created_at: "2026-10-24 11:30:00", updated_at: "2026-10-24 11:30:00" },
    ],
  };
}

export const FALLBACK_USER_COLUMNS = [
  { Field: 'id', Type: 'varchar(36)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: 'PRI', Default: null, Extra: '', Comment: '' },
  { Field: 'name', Type: 'varchar(255)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: '', Default: null, Extra: '', Comment: '' },
  { Field: 'email', Type: 'varchar(255)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: 'UNI', Default: null, Extra: '', Comment: '' },
  { Field: 'email_verified', Type: 'tinyint(1)', Collation: null, Null: 'NO', Key: '', Default: '0', Extra: '', Comment: '' },
  { Field: 'image', Type: 'text', Collation: 'utf8mb4_unicode_ci', Null: 'YES', Key: '', Default: null, Extra: '', Comment: '' },
  { Field: 'role', Type: 'varchar(50)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: '', Default: 'USER', Extra: '', Comment: '' },
  { Field: 'password_hash', Type: 'varchar(255)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: '', Default: null, Extra: '', Comment: '' },
];

export function getFallbackColumnsForTable(tableName: string): any[] {
  if (tableName === 'user' || tableName === 'users') {
    return FALLBACK_USER_COLUMNS;
  }
  if (tableName === 'opds') {
    return [
      { Field: 'id', Type: 'int(11)', Collation: null, Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment', Comment: '' },
      { Field: 'nama_opd', Type: 'varchar(255)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: '', Default: null, Extra: '', Comment: '' },
      { Field: 'kode_opd', Type: 'varchar(50)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: 'UNI', Default: null, Extra: '', Comment: '' },
      { Field: 'alamat', Type: 'text', Collation: 'utf8mb4_unicode_ci', Null: 'YES', Key: '', Default: null, Extra: '', Comment: '' },
      { Field: 'telepon', Type: 'varchar(50)', Collation: 'utf8mb4_unicode_ci', Null: 'YES', Key: '', Default: null, Extra: '', Comment: '' },
      { Field: 'created_at', Type: 'datetime', Collation: null, Null: 'YES', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '', Comment: '' },
    ];
  }
  return [
    { Field: 'id', Type: 'int(11)', Collation: null, Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment', Comment: '' },
    { Field: 'name', Type: 'varchar(255)', Collation: 'utf8mb4_unicode_ci', Null: 'NO', Key: '', Default: null, Extra: '', Comment: '' },
    { Field: 'created_at', Type: 'datetime', Collation: null, Null: 'YES', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '', Comment: '' },
    { Field: 'updated_at', Type: 'datetime', Collation: null, Null: 'YES', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '', Comment: '' },
  ];
}
