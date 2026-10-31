import { CLOUD_ENDPOINTS, LOCAL_STORAGE_KEYS } from "@/constants";
import { INITIAL_PROFILES } from "@/components/workspace/constants";
import type {
  BillingCycle,
  CloudSyncConfig,
  CloudSyncMetadata,
  CloudSyncPreferences,
  CloudSyncSnapshot,
  ErBackendPullResponse,
  ErBackendPushPayload,
  QueryHistoryEntry,
  SavedSnippet,
  SubscriptionTier,
  UserActionEntry,
} from "@/types/cloud-sync";
import { cloudSyncSnapshotSchema } from "@/types/cloud-sync";
import type { Profile } from "@/types/connection";

// -------------------------------------------------------------
// SEED DATA PER SUBSCRIPTION TIER (Multi-User Data Isolation)
// -------------------------------------------------------------
export const SEED_PROFILES_BY_TIER: Record<"business" | "pro" | "team", Profile[]> = {
  business: [
    {
      connection_revision: 3,
      created_at: "2026-10-20T08:00:00.000Z",
      database: "enterprise_prod_db",
      db_type: "mysql",
      environment: "Production",
      favorite: true,
      has_saved_password: true,
      host: "db-prod.enterprise.internal",
      id: "b1c2d3e4-business-prod-cluster-0001",
      last_used_at: "2026-10-31T08:30:00.000Z",
      method: "direct",
      name: "Enterprise Production Cluster",
      port: 3306,
      ssh: null,
      tls: { ca: "/etc/ssl/certs/enterprise-ca.pem", cert: null, enabled: true, key: null, verify: true },
      updated_at: "2026-10-31T08:30:00.000Z",
      username: "enterprise_admin",
    },
    {
      connection_revision: 2,
      created_at: "2026-10-22T10:15:00.000Z",
      database: "warehouse_bi",
      db_type: "mariadb",
      environment: "Production",
      favorite: true,
      has_saved_password: false,
      host: "dw.analytics.corp",
      id: "b2c3d4e5-business-dw-analytics-0002",
      last_used_at: "2026-10-30T17:45:00.000Z",
      method: "direct",
      name: "Analytics Data Warehouse",
      port: 3306,
      ssh: null,
      tls: { ca: null, cert: null, enabled: true, key: null, verify: true },
      updated_at: "2026-10-30T17:45:00.000Z",
      username: "dw_analyst",
    },
    {
      connection_revision: 1,
      created_at: "2026-10-25T11:00:00.000Z",
      database: "erp_finance",
      db_type: "auto",
      environment: "Staging",
      favorite: false,
      has_saved_password: false,
      host: "10.0.12.8",
      id: "b3c4d5e6-business-erp-staging-0003",
      last_used_at: "2026-10-29T14:10:00.000Z",
      method: "ssh",
      name: "ERP Staging Gateway (SSH)",
      port: 3306,
      ssh: {
        auth_type: "key",
        host: "bastion.corp.net",
        key: "~/.ssh/id_rsa_enterprise",
        passphrase: "",
        password: "",
        port: 22,
        username: "sysadmin",
      },
      tls: { ca: null, cert: null, enabled: false, key: null, verify: true },
      updated_at: "2026-10-29T14:10:00.000Z",
      username: "erp_dev",
    },
  ],
  team: [
    {
      connection_revision: 2,
      created_at: "2026-10-23T09:00:00.000Z",
      database: "team_shared_db",
      db_type: "mysql",
      environment: "Staging",
      favorite: true,
      has_saved_password: false,
      host: "10.0.8.20",
      id: "t1c2d3e4-team-shared-microservices-0001",
      last_used_at: "2026-10-30T11:20:00.000Z",
      method: "direct",
      name: "Team Shared Microservices DB",
      port: 3306,
      ssh: null,
      tls: { ca: null, cert: null, enabled: false, key: null, verify: true },
      updated_at: "2026-10-30T11:20:00.000Z",
      username: "team_lead",
    },
    {
      connection_revision: 1,
      created_at: "2026-10-24T14:00:00.000Z",
      database: "qa_test_db",
      db_type: "mariadb",
      environment: "Staging",
      favorite: false,
      has_saved_password: false,
      host: "10.0.8.50",
      id: "t2c3d4e5-team-qa-testing-0002",
      last_used_at: "2026-10-28T16:00:00.000Z",
      method: "direct",
      name: "QA Testing Cluster",
      port: 3306,
      ssh: null,
      tls: { ca: null, cert: null, enabled: false, key: null, verify: true },
      updated_at: "2026-10-28T16:00:00.000Z",
      username: "qa_tester",
    },
  ],
  pro: [
    {
      connection_revision: 2,
      created_at: "2026-10-20T09:00:00.000Z",
      database: "dev_store",
      db_type: "mariadb",
      environment: "Local",
      favorite: true,
      has_saved_password: false,
      host: "127.0.0.1",
      id: "p1c2d3e4-pro-dev-mariadb-0001",
      last_used_at: "2026-10-31T09:15:00.000Z",
      method: "direct",
      name: "Pro Dev MariaDB (Port 3306)",
      port: 3306,
      ssh: null,
      tls: { ca: null, cert: null, enabled: false, key: null, verify: true },
      updated_at: "2026-10-31T09:15:00.000Z",
      username: "root",
    },
    {
      connection_revision: 1,
      created_at: "2026-10-21T08:00:00.000Z",
      database: "cloud_staging_db",
      db_type: "mysql",
      environment: "Staging",
      favorite: true,
      has_saved_password: false,
      host: "10.0.4.15",
      id: "p2c3d4e5-pro-staging-api-0002",
      last_used_at: "2026-10-30T20:45:00.000Z",
      method: "ssh",
      name: "Staging Cloud Replica",
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
      updated_at: "2026-10-30T20:45:00.000Z",
      username: "staging_user",
    },
  ],
};

export const SEED_JOURNAL_BY_TIER: Record<"business" | "pro" | "team", UserActionEntry[]> = {
  business: [
    {
      action: "export",
      category: "export_import",
      database: "enterprise_prod_db",
      details: { compression: "gzip", format: "sql" },
      id: "act-biz-01",
      profileId: "b1c2d3e4-business-prod-cluster-0001",
      profileName: "Enterprise Production Cluster",
      syncStatus: "synced",
      timestamp: "2026-10-31T08:35:00.000Z",
    },
    {
      action: "table_maintenance",
      category: "table",
      database: "enterprise_prod_db",
      details: { subAction: "OPTIMIZE" },
      id: "act-biz-02",
      profileId: "b1c2d3e4-business-prod-cluster-0001",
      profileName: "Enterprise Production Cluster",
      syncStatus: "synced",
      table: "orders",
      timestamp: "2026-10-31T08:40:00.000Z",
    },
  ],
  team: [
    {
      action: "table_maintenance",
      category: "table",
      database: "team_shared_db",
      details: { changes: "ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'active'" },
      id: "act-team-01",
      profileId: "t1c2d3e4-team-shared-microservices-0001",
      profileName: "Team Shared Microservices DB",
      syncStatus: "synced",
      table: "releases",
      timestamp: "2026-10-30T11:25:00.000Z",
    },
  ],
  pro: [
    {
      action: "database_create",
      category: "database",
      database: "dev_store",
      details: { collation: "utf8mb4_unicode_ci" },
      id: "act-pro-01",
      profileId: "p1c2d3e4-pro-dev-mariadb-0001",
      profileName: "Pro Dev MariaDB (Port 3306)",
      syncStatus: "synced",
      timestamp: "2026-10-31T09:20:00.000Z",
    },
  ],
};

export const SEED_QUERIES_BY_TIER: Record<"business" | "pro" | "team", QueryHistoryEntry[]> = {
  business: [
    {
      database: "enterprise_prod_db",
      durationMs: 42,
      id: "qry-biz-01",
      profileId: "b1c2d3e4-business-prod-cluster-0001",
      query: "SELECT COUNT(*) AS total_orders, SUM(amount) AS gross_revenue FROM enterprise_prod_db.transactions WHERE status = 'completed';",
      rowsAffected: 1,
      success: true,
      timestamp: "2026-10-31T08:32:00.000Z",
    },
    {
      database: "warehouse_bi",
      durationMs: 85,
      id: "qry-biz-02",
      profileId: "b2c3d4e5-business-dw-analytics-0002",
      query: "EXPLAIN SELECT * FROM warehouse_bi.monthly_financial_aggregates WHERE fiscal_year = 2026;",
      rowsAffected: 12,
      success: true,
      timestamp: "2026-10-30T17:48:00.000Z",
    },
  ],
  team: [
    {
      database: "team_shared_db",
      durationMs: 18,
      id: "qry-team-01",
      profileId: "t1c2d3e4-team-shared-microservices-0001",
      query: "SELECT * FROM team_shared_db.releases ORDER BY id DESC LIMIT 20;",
      rowsAffected: 20,
      success: true,
      timestamp: "2026-10-30T11:22:00.000Z",
    },
  ],
  pro: [
    {
      database: "dev_store",
      durationMs: 4,
      id: "qry-pro-01",
      profileId: "p1c2d3e4-pro-dev-mariadb-0001",
      query: "SHOW FULL TABLES WHERE Table_type = 'BASE TABLE';",
      rowsAffected: 8,
      success: true,
      timestamp: "2026-10-31T09:18:00.000Z",
    },
  ],
};

// -------------------------------------------------------------
// USER IDENTITY & SCOPED STORAGE HELPER
// -------------------------------------------------------------
export function getUserScopeKey(emailOrId?: string): string {
  if (!emailOrId) {
    const config = getCloudSyncConfig();
    emailOrId = config.userEmail || config.userId;
  }
  if (!emailOrId) return "guest";
  return emailOrId.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

export function getScopedKey(baseKey: string, scope?: string): string {
  const resolvedScope = scope || getUserScopeKey();
  if (resolvedScope === "guest") {
    return baseKey; // Backward compatibility: free/guest users use standard base keys
  }
  return `${baseKey}_${resolvedScope}`;
}

export function getInitialSeedProfilesForScope(scope = getUserScopeKey()): Profile[] {
  if (scope.includes("business")) {
    return SEED_PROFILES_BY_TIER.business;
  }
  if (scope.includes("team")) {
    return SEED_PROFILES_BY_TIER.team;
  }
  if (scope.includes("pro")) {
    return SEED_PROFILES_BY_TIER.pro;
  }
  return INITIAL_PROFILES;
}

export function getInitialSeedJournalForScope(scope = getUserScopeKey()): UserActionEntry[] {
  if (scope.includes("business")) {
    return SEED_JOURNAL_BY_TIER.business;
  }
  if (scope.includes("team")) {
    return SEED_JOURNAL_BY_TIER.team;
  }
  if (scope.includes("pro")) {
    return SEED_JOURNAL_BY_TIER.pro;
  }
  return [];
}

export function getInitialSeedQueriesForScope(scope = getUserScopeKey()): QueryHistoryEntry[] {
  if (scope.includes("business")) {
    return SEED_QUERIES_BY_TIER.business;
  }
  if (scope.includes("team")) {
    return SEED_QUERIES_BY_TIER.team;
  }
  if (scope.includes("pro")) {
    return SEED_QUERIES_BY_TIER.pro;
  }
  return [];
}

interface ScopedMemoryStore {
  cachedProfiles: Profile[];
  journal: UserActionEntry[];
  queryHistory: QueryHistoryEntry[];
  snippets: SavedSnippet[];
}

const MEMORY_SCOPES: Record<string, ScopedMemoryStore> = {};

export function resetMemoryStores(): void {
  for (const key of Object.keys(MEMORY_SCOPES)) {
    delete MEMORY_SCOPES[key];
  }
}

function getScopedMemoryStore(scope = getUserScopeKey()): ScopedMemoryStore {
  if (!MEMORY_SCOPES[scope]) {
    MEMORY_SCOPES[scope] = {
      cachedProfiles: [],
      journal: [],
      queryHistory: [],
      snippets: [],
    };
  }
  return MEMORY_SCOPES[scope];
}

const GLOBAL_CONFIG_STORE: { config: CloudSyncConfig } = {
  config: {
    apiEndpoint: CLOUD_ENDPOINTS.SYNC_URL,
    authEndpoint: CLOUD_ENDPOINTS.AUTH_URL,
    autoSync: false,
    billingCycle: "annual",
    maxVaults: 10,
    status: "idle",
    subscriptionTier: "free",
  },
};

/**
 * Smart merge local profiles with remote profiles.
 * - Non-overlapping profiles from remote are added.
 * - Matching profiles (by id) are resolved using connection_revision or updated_at.
 * - Local-only profiles are preserved.
 */
export function mergeProfilesLists(
  localProfiles: Profile[] = [],
  remoteProfiles: Profile[] = []
): Profile[] {
  if (!remoteProfiles || remoteProfiles.length === 0) {
    return localProfiles;
  }
  if (!localProfiles || localProfiles.length === 0) {
    return remoteProfiles;
  }

  const profileMap = new Map<string, Profile>();

  for (const local of localProfiles) {
    if (local && local.id) {
      profileMap.set(local.id, local);
    }
  }

  for (const remote of remoteProfiles) {
    if (!remote || !remote.id) continue;
    const existing = profileMap.get(remote.id);
    if (!existing) {
      profileMap.set(remote.id, remote);
    } else {
      const remoteRev = remote.connection_revision ?? 1;
      const localRev = existing.connection_revision ?? 1;

      if (remoteRev > localRev) {
        profileMap.set(remote.id, remote);
      } else if (remoteRev === localRev) {
        const remoteTime = remote.updated_at ? new Date(remote.updated_at).getTime() : 0;
        const localTime = existing.updated_at ? new Date(existing.updated_at).getTime() : 0;
        if (remoteTime >= localTime) {
          profileMap.set(remote.id, remote);
        }
      }
    }
  }

  return Array.from(profileMap.values());
}

export function getStoredProfiles(scope?: string): Profile[] {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.PROFILES, resolvedScope);

  if (isStorageAvailable()) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  const mem = getScopedMemoryStore(resolvedScope);
  if (mem.cachedProfiles && mem.cachedProfiles.length > 0) {
    return mem.cachedProfiles;
  }

  // Provide initial seed profiles tailored to account tier if not stored yet
  const seeded = getInitialSeedProfilesForScope(resolvedScope);
  if (isStorageAvailable()) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(seeded));
    } catch {
      // ignore
    }
  }
  mem.cachedProfiles = seeded;
  return seeded;
}

export function setStoredProfiles(profiles: Profile[], scope?: string): void {
  if (!Array.isArray(profiles)) return;
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.PROFILES, resolvedScope);

  if (isStorageAvailable()) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }
  const mem = getScopedMemoryStore(resolvedScope);
  mem.cachedProfiles = profiles;
}

export function setCachedProfiles(profiles: Profile[]): void {
  setStoredProfiles(profiles);
}

export function getCachedProfiles(): Profile[] {
  return getStoredProfiles();
}

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getStoredJournal(scope?: string): UserActionEntry[] {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_JOURNAL, resolvedScope);

  if (isStorageAvailable()) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }

  const mem = getScopedMemoryStore(resolvedScope);
  if (mem.journal && mem.journal.length > 0) {
    return mem.journal;
  }

  const seeded = getInitialSeedJournalForScope(resolvedScope);
  if (seeded.length > 0) {
    if (isStorageAvailable()) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(seeded));
      } catch {
        // ignore
      }
    }
    mem.journal = seeded;
    return seeded;
  }

  return [];
}

export function recordUserAction(
  entry: Omit<UserActionEntry, "id" | "timestamp" | "syncStatus">,
  scope?: string
): UserActionEntry {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_JOURNAL, resolvedScope);

  const newAction: UserActionEntry = {
    ...entry,
    id: generateId(),
    syncStatus: "pending",
    timestamp: new Date().toISOString(),
  };

  const current = getStoredJournal(resolvedScope);
  const updated = [newAction, ...current].slice(0, 1000);

  if (isStorageAvailable()) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  getScopedMemoryStore(resolvedScope).journal = updated;

  return newAction;
}

export function getStoredQueryHistory(scope?: string): QueryHistoryEntry[] {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_QUERY_HISTORY, resolvedScope);

  if (isStorageAvailable()) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }

  const mem = getScopedMemoryStore(resolvedScope);
  if (mem.queryHistory && mem.queryHistory.length > 0) {
    return mem.queryHistory;
  }

  const seeded = getInitialSeedQueriesForScope(resolvedScope);
  if (seeded.length > 0) {
    if (isStorageAvailable()) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(seeded));
      } catch {
        // ignore
      }
    }
    mem.queryHistory = seeded;
    return seeded;
  }

  return [];
}

export function recordQueryHistory(
  entry: Omit<QueryHistoryEntry, "id" | "timestamp">,
  scope?: string
): QueryHistoryEntry {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_QUERY_HISTORY, resolvedScope);

  const newQuery: QueryHistoryEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  const current = getStoredQueryHistory(resolvedScope);
  const updated = [newQuery, ...current].slice(0, 500);

  if (isStorageAvailable()) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  getScopedMemoryStore(resolvedScope).queryHistory = updated;

  return newQuery;
}

export function getStoredSnippets(scope?: string): SavedSnippet[] {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_SNIPPETS, resolvedScope);

  if (isStorageAvailable()) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  const mem = getScopedMemoryStore(resolvedScope);
  return mem.snippets || [];
}

export function saveSnippet(
  snippet: Omit<SavedSnippet, "id" | "createdAt" | "updatedAt">,
  scope?: string
): SavedSnippet {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_SNIPPETS, resolvedScope);
  const now = new Date().toISOString();
  const newSnippet: SavedSnippet = {
    ...snippet,
    createdAt: now,
    id: generateId(),
    updatedAt: now,
  };

  const current = getStoredSnippets(resolvedScope);
  const updated = [newSnippet, ...current];

  if (isStorageAvailable()) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  getScopedMemoryStore(resolvedScope).snippets = updated;

  return newSnippet;
}

export function deleteSnippet(id: string, scope?: string): void {
  const resolvedScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_SNIPPETS, resolvedScope);
  const current = getStoredSnippets(resolvedScope);
  const updated = current.filter((s) => s.id !== id);

  if (isStorageAvailable()) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  getScopedMemoryStore(resolvedScope).snippets = updated;
}

export function normalizeCloudEndpoint(url?: string): string {
  let cleaned = (url || '').trim().replace(/\/+$/, '');
  if (!cleaned) return cleaned;
  if (cleaned.startsWith('https://er-service.duckdns.org')) {
    cleaned = cleaned.replace('https://er-service.duckdns.org', 'https://www.er-service.duckdns.org');
  } else if (cleaned.startsWith('http://er-service.duckdns.org')) {
    cleaned = cleaned.replace('http://er-service.duckdns.org', 'https://www.er-service.duckdns.org');
  }
  return cleaned;
}

export function getCloudSyncConfig(): CloudSyncConfig {
  let baseConfig = GLOBAL_CONFIG_STORE.config;
  if (isStorageAvailable()) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.CLOUD_SYNC_CONFIG);
      if (raw) {
        baseConfig = { ...GLOBAL_CONFIG_STORE.config, ...JSON.parse(raw) };
      }
    } catch {
      baseConfig = GLOBAL_CONFIG_STORE.config;
    }
  }
  if (baseConfig.apiEndpoint) {
    baseConfig.apiEndpoint = normalizeCloudEndpoint(baseConfig.apiEndpoint);
  }
  if (baseConfig.authEndpoint) {
    baseConfig.authEndpoint = normalizeCloudEndpoint(baseConfig.authEndpoint);
  }
  const isNonFree = baseConfig.subscriptionTier !== "free";
  // Non-free tiers (Pro, Team, Business) aktif sinkronisasi otomatis secara default
  const autoSync = baseConfig.autoSync !== undefined ? baseConfig.autoSync : isNonFree;
  return {
    ...baseConfig,
    autoSync,
  };
}

export function updateCloudSyncConfig(
  updates: Partial<CloudSyncConfig>
): CloudSyncConfig {
  const current = getCloudSyncConfig();
  const nextTier = updates.subscriptionTier ?? current.subscriptionTier;
  const isNonFree = nextTier !== "free";

  let resolvedAutoSync = current.autoSync;
  if (updates.autoSync !== undefined) {
    resolvedAutoSync = updates.autoSync;
  } else if (
    updates.subscriptionTier !== undefined &&
    updates.subscriptionTier !== current.subscriptionTier
  ) {
    resolvedAutoSync = isNonFree;
  }

  const sanitizedUpdates = { ...updates };
  if (sanitizedUpdates.apiEndpoint) {
    sanitizedUpdates.apiEndpoint = normalizeCloudEndpoint(sanitizedUpdates.apiEndpoint);
  }
  if (sanitizedUpdates.authEndpoint) {
    sanitizedUpdates.authEndpoint = normalizeCloudEndpoint(sanitizedUpdates.authEndpoint);
  }

  const updated: CloudSyncConfig = {
    ...current,
    ...sanitizedUpdates,
    autoSync: resolvedAutoSync,
  };

  if (isStorageAvailable()) {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CLOUD_SYNC_CONFIG,
        JSON.stringify(updated)
      );
    } catch {
      GLOBAL_CONFIG_STORE.config = updated;
    }
  } else {
    GLOBAL_CONFIG_STORE.config = updated;
  }

  return updated;
}

export function buildCloudSyncSnapshot(
  profiles?: Profile[],
  preferencesOverride?: Partial<CloudSyncPreferences>,
  userScope?: string
): CloudSyncSnapshot {
  const currentScope = userScope || getUserScopeKey();
  const resolvedProfiles =
    profiles && profiles.length > 0 ? profiles : getStoredProfiles(currentScope);
  const journal = getStoredJournal(currentScope);
  const queryHistory = getStoredQueryHistory(currentScope);
  const snippets = getStoredSnippets(currentScope);
  const config = getCloudSyncConfig();

  let appSettings: any = null;
  if (isStorageAvailable()) {
    try {
      const rawSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.APP_SETTINGS);
      if (rawSettings) {
        appSettings = JSON.parse(rawSettings);
      }
    } catch {
      // ignore
    }
  }

  const preferences: CloudSyncPreferences = {
    autoSyncEnabled: config.autoSync,
    defaultCollation: appSettings?.defaultCollation || "utf8mb4_general_ci",
    language: appSettings?.language || (isStorageAvailable() && localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE)) || "en",
    recordQueries: true,
    syncIntervalMinutes: 5,
    theme: (appSettings?.theme || (isStorageAvailable() && localStorage.getItem(LOCAL_STORAGE_KEYS.THEME)) || "dark") as any,
    ...preferencesOverride,
  };

  const metadata: CloudSyncMetadata = {
    billingCycle: config.billingCycle || "annual",
    clientId: "xphpmyadmin-client-" + generateId().slice(0, 8),
    deviceName:
      typeof navigator !== "undefined"
        ? `${navigator.userAgent.slice(0, 30)}`
        : "Linux Desktop Client",
    generatedAt: new Date().toISOString(),
    maxVaults: config.maxVaults || (config.subscriptionTier === "business" ? 50 : (config.subscriptionTier === "team" ? 20 : 10)),
    platform: typeof process !== "undefined" ? process.platform : "linux",
    revision: Date.now(),
    subscriptionTier: config.subscriptionTier,
    totalActions: journal.length,
    totalProfiles: resolvedProfiles.length,
    totalQueries: queryHistory.length,
    userEmail: config.userEmail,
    userId: config.userId,
    version: "1.0.0",
  };

  return {
    journal,
    metadata,
    preferences,
    profiles: resolvedProfiles,
    queryHistory,
    snippets,
  };
}

export function exportCloudBackupJson(
  profiles: Profile[],
  preferencesOverride?: Partial<CloudSyncPreferences>
): string {
  const snapshot = buildCloudSyncSnapshot(profiles, preferencesOverride);
  return JSON.stringify(snapshot, null, 2);
}

export function importCloudBackupJson(
  jsonString: string,
  userScope?: string
): {
  data?: CloudSyncSnapshot;
  error?: string;
  success: boolean;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const validated = cloudSyncSnapshotSchema.safeParse(parsed);

    if (!validated.success) {
      const issues = validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return {
        error: `Format JSON tidak valid: ${issues}`,
        success: false,
      };
    }

    const snapshot = validated.data;
    const resolvedScope = userScope || getUserScopeKey();

    if (isStorageAvailable()) {
      try {
        if (snapshot.profiles?.length) {
          let mergedProfiles = snapshot.profiles;
          try {
            const rawStored = localStorage.getItem(
              getScopedKey(LOCAL_STORAGE_KEYS.PROFILES, resolvedScope)
            );
            if (rawStored) {
              const currentLocal = JSON.parse(rawStored);
              if (Array.isArray(currentLocal) && currentLocal.length > 0) {
                mergedProfiles = mergeProfilesLists(currentLocal, snapshot.profiles);
              }
            }
          } catch {
            // fallback
          }
          setStoredProfiles(mergedProfiles, resolvedScope);
        }
        if (snapshot.journal?.length) {
          localStorage.setItem(
            getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_JOURNAL, resolvedScope),
            JSON.stringify(snapshot.journal)
          );
          getScopedMemoryStore(resolvedScope).journal = snapshot.journal;
        }
        if (snapshot.queryHistory?.length) {
          localStorage.setItem(
            getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_QUERY_HISTORY, resolvedScope),
            JSON.stringify(snapshot.queryHistory)
          );
          getScopedMemoryStore(resolvedScope).queryHistory = snapshot.queryHistory;
        }
        if (snapshot.snippets?.length) {
          localStorage.setItem(
            getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_SNIPPETS, resolvedScope),
            JSON.stringify(snapshot.snippets)
          );
          getScopedMemoryStore(resolvedScope).snippets = snapshot.snippets;
        }
      } catch (err: any) {
        return {
          error: `Gagal menyimpan ke penyimpanan lokal: ${err?.message || err}`,
          success: false,
        };
      }
    } else {
      if (snapshot.profiles?.length) {
        setStoredProfiles(snapshot.profiles, resolvedScope);
      }
      if (snapshot.journal?.length) {
        getScopedMemoryStore(resolvedScope).journal = snapshot.journal;
      }
      if (snapshot.queryHistory?.length) {
        getScopedMemoryStore(resolvedScope).queryHistory = snapshot.queryHistory;
      }
      if (snapshot.snippets?.length) {
        getScopedMemoryStore(resolvedScope).snippets = snapshot.snippets;
      }
    }

    return {
      data: snapshot,
      success: true,
    };
  } catch (err: any) {
    return {
      error: `Gagal mem-parsing JSON: ${err?.message || err}`,
      success: false,
    };
  }
}

// -------------------------------------------------------------
// er-backend Integration: PUSH (/api/sync/push)
// -------------------------------------------------------------
export async function syncWithCloudBackend(
  profiles?: Profile[],
  tokenOverride?: string,
  endpointOverride?: string
): Promise<{
  error?: string;
  message?: string;
  success: boolean;
  syncedItems: number;
}> {
  const config = getCloudSyncConfig();
  if (config.subscriptionTier === "free") {
    return {
      error: "Paket gratis hanya memiliki brankas lokal. Silakan berlangganan (Pro, Team, atau Business) untuk mengaktifkan sinkronisasi cloud.",
      success: false,
      syncedItems: 0,
    };
  }
  const resolvedProfiles =
    profiles && profiles.length > 0 ? profiles : getStoredProfiles();
  const token = (tokenOverride || config.apiToken || config.userEmail || "user_pro_sync").trim();
  const baseEndpoint = normalizeCloudEndpoint(endpointOverride || config.apiEndpoint);
  const pushUrl = baseEndpoint.endsWith("/push") ? baseEndpoint : `${baseEndpoint}/push`;
  const snapshot = buildCloudSyncSnapshot(resolvedProfiles);

  updateCloudSyncConfig({ lastErrorMessage: undefined, status: "syncing" });

  try {
    const payload: ErBackendPushPayload = {
      data: snapshot,
      device: snapshot.metadata.deviceName,
      syncKey: token,
      timestamp: Date.now(),
    };

    const response = await fetch(pushUrl, {
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Sync-Key": token,
      },
      method: "POST",
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok || resJson.success === false) {
      throw new Error(
        resJson.error || `Server cloud mengembalikan status ${response.status}`
      );
    }

    // Tandai seluruh jurnal sebagai synced untuk akun aktif
    const currentScope = getUserScopeKey();
    const journal = getStoredJournal(currentScope).map((j) => ({
      ...j,
      syncStatus: "synced" as const,
    }));

    if (isStorageAvailable()) {
      localStorage.setItem(
        getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_JOURNAL, currentScope),
        JSON.stringify(journal)
      );
    }
    getScopedMemoryStore(currentScope).journal = journal;

    const now = new Date().toISOString();
    updateCloudSyncConfig({
      lastErrorMessage: undefined,
      lastSyncAt: now,
      status: "success",
    });

    return {
      message: resJson.message || "Data berhasil disinkronkan ke Neon cloud database!",
      success: true,
      syncedItems: snapshot.metadata.totalActions + snapshot.metadata.totalQueries,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    updateCloudSyncConfig({
      lastErrorMessage: msg,
      status: "error",
    });
    return {
      error: msg,
      success: false,
      syncedItems: 0,
    };
  }
}

// -------------------------------------------------------------
// Auto-Sync to Cloud: Debounced Background Trigger
// -------------------------------------------------------------
let autoSyncTimeout: any = null;
let isAutoSyncInProgress = false;
let hasPendingSyncRequest = false;

export function triggerAutoSyncToCloud(
  profiles?: Profile[],
  delayMs = 600
): Promise<{
  error?: string;
  message?: string;
  skipped?: boolean;
  success: boolean;
  syncedItems?: number;
}> {
  if (profiles && profiles.length > 0) {
    setStoredProfiles(profiles);
  }

  const config = getCloudSyncConfig();
  // Status free dibatasi hanya ke brankas lokal, jangan sinkronkan ke backend
  if (config.subscriptionTier === "free" || config.autoSync === false) {
    return Promise.resolve({ skipped: true, success: false });
  }

  if (autoSyncTimeout) {
    clearTimeout(autoSyncTimeout);
  }

  if (delayMs <= 0) {
    if (isAutoSyncInProgress) {
      hasPendingSyncRequest = true;
      return Promise.resolve({ skipped: true, success: false });
    }
    isAutoSyncInProgress = true;
    return syncWithCloudBackend(profiles || getStoredProfiles()).finally(() => {
      isAutoSyncInProgress = false;
      if (hasPendingSyncRequest) {
        hasPendingSyncRequest = false;
        triggerAutoSyncToCloud(getStoredProfiles(), 300);
      }
    });
  }

  return new Promise((resolve) => {
    autoSyncTimeout = setTimeout(async () => {
      autoSyncTimeout = null;
      if (isAutoSyncInProgress) {
        hasPendingSyncRequest = true;
        return resolve({ skipped: true, success: false });
      }
      isAutoSyncInProgress = true;
      try {
        const res = await syncWithCloudBackend(profiles || getStoredProfiles());
        resolve(res);
      } catch (err: any) {
        resolve({ error: err?.message || String(err), success: false });
      } finally {
        isAutoSyncInProgress = false;
        if (hasPendingSyncRequest) {
          hasPendingSyncRequest = false;
          triggerAutoSyncToCloud(getStoredProfiles(), 300);
        }
      }
    }, delayMs);
  });
}

// -------------------------------------------------------------
// er-backend Integration: PULL (/api/sync/pull)
// -------------------------------------------------------------
export async function pullFromCloudBackend(
  tokenOverride?: string,
  endpointOverride?: string
): Promise<{
  data?: CloudSyncSnapshot;
  error?: string;
  lastDevice?: string;
  success: boolean;
  updatedAt?: number;
}> {
  const config = getCloudSyncConfig();
  if (config.subscriptionTier === "free") {
    return {
      error: "Paket gratis hanya memiliki brankas lokal. Silakan berlangganan (Pro, Team, atau Business) untuk mengaktifkan sinkronisasi cloud.",
      success: false,
    };
  }
  const token = (tokenOverride || config.apiToken || config.userEmail || "user_pro_sync").trim();
  const baseEndpoint = normalizeCloudEndpoint(endpointOverride || config.apiEndpoint);
  const pullUrl = baseEndpoint.endsWith("/pull") ? baseEndpoint : `${baseEndpoint}/pull`;

  try {
    const response = await fetch(pullUrl, {
      body: JSON.stringify({ syncKey: token }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Sync-Key": token,
      },
      method: "POST",
    });

    const resJson = (await response.json().catch(() => ({}))) as ErBackendPullResponse & {
      error?: string;
    };

    if (!response.ok || resJson.success === false) {
      throw new Error(
        resJson.error || `Server cloud pull mengembalikan kode status ${response.status}`
      );
    }

    if (resJson.data) {
      const validated = cloudSyncSnapshotSchema.safeParse(resJson.data);
      if (validated.success) {
        importCloudBackupJson(JSON.stringify(validated.data));
        return {
          data: validated.data,
          lastDevice: resJson.lastDevice,
          success: true,
          updatedAt: resJson.updatedAt,
        };
      }
    }

    return {
      data: resJson.data,
      lastDevice: resJson.lastDevice,
      success: true,
      updatedAt: resJson.updatedAt,
    };
  } catch (err: any) {
    return {
      error: err?.message || String(err),
      success: false,
    };
  }
}

// -------------------------------------------------------------
// er-backend Integration: MERGE (/api/sync/merge)
// -------------------------------------------------------------
export async function mergeWithCloudBackend(
  profiles: Profile[],
  tokenOverride?: string,
  endpointOverride?: string
): Promise<{
  data?: any;
  error?: string;
  message?: string;
  success: boolean;
}> {
  const config = getCloudSyncConfig();
  if (config.subscriptionTier === "free") {
    return {
      error: "Paket gratis hanya memiliki brankas lokal. Silakan berlangganan (Pro, Team, atau Business) untuk mengaktifkan sinkronisasi cloud.",
      success: false,
    };
  }
  const token = (tokenOverride || config.apiToken || config.userEmail || "user_pro_sync").trim();
  const baseEndpoint = normalizeCloudEndpoint(endpointOverride || config.apiEndpoint);
  const mergeUrl = baseEndpoint.endsWith("/merge") ? baseEndpoint : `${baseEndpoint}/merge`;
  const snapshot = buildCloudSyncSnapshot(profiles);

  try {
    const response = await fetch(mergeUrl, {
      body: JSON.stringify({
        data: snapshot,
        device: snapshot.metadata.deviceName,
        syncKey: token,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Sync-Key": token,
      },
      method: "POST",
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok || resJson.success === false) {
      throw new Error(
        resJson.error || `Server cloud merge status ${response.status}`
      );
    }

    if (resJson.data) {
      const validated = cloudSyncSnapshotSchema.safeParse(resJson.data);
      if (validated.success) {
        importCloudBackupJson(JSON.stringify(validated.data));
      }
    }

    return {
      data: resJson.data,
      message: resJson.message || "Smart merge cloud Neon selesai!",
      success: true,
    };
  } catch (err: any) {
    return {
      error: err?.message || String(err),
      success: false,
    };
  }
}

// -------------------------------------------------------------
// er-backend Integration: AUTH LOGIN (/api/auth/login)
// -------------------------------------------------------------
export async function loginToCloudBackend(
  email: string,
  pass: string,
  authEndpointOverride?: string
): Promise<{ error?: string; success: boolean; user?: any }> {
  const config = getCloudSyncConfig();
  const baseAuth = normalizeCloudEndpoint(authEndpointOverride || config.authEndpoint);
  const loginUrl = baseAuth.endsWith("/login") ? baseAuth : `${baseAuth}/login`;

  try {
    const response = await fetch(loginUrl, {
      body: JSON.stringify({ email: email.trim(), password: pass }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok || resJson.success === false) {
      throw new Error(resJson.error || "Email atau password tidak valid");
    }

    const userTier: SubscriptionTier =
      resJson.user?.plan === "business"
        ? "business"
        : resJson.user?.plan === "team"
        ? "team"
        : (resJson.user?.plan === "pro" ? "pro" : "free");
    const userBilling: BillingCycle =
      resJson.user?.billingCycle === "monthly" ? "monthly" : "annual";
    const maxVaults =
      resJson.user?.maxVaults ||
      (userTier === "business" ? 50 : userTier === "team" ? 20 : (userTier === "pro" ? 10 : 1));

    updateCloudSyncConfig({
      apiToken: resJson.token,
      billingCycle: userBilling,
      maxVaults,
      planExpiresAt: resJson.user?.planExpiresAt,
      subscriptionTier: userTier,
      userEmail: resJson.user?.email || email,
      userId: resJson.user?.id ? String(resJson.user.id) : undefined,
      userName: resJson.user?.name,
      userProvider: "credentials",
    });

    return {
      success: true,
      user: resJson.user,
    };
  } catch (err: any) {
    // Fallback offline / local mock for seeded demo accounts
    const emailLower = email.trim().toLowerCase();
    if (
      emailLower === "business@xphpmyadmin.dev" ||
      emailLower === "pro@xphpmyadmin.dev" ||
      emailLower === "team@xphpmyadmin.dev"
    ) {
      const plan: SubscriptionTier =
        emailLower === "business@xphpmyadmin.dev"
          ? "business"
          : emailLower === "team@xphpmyadmin.dev"
          ? "team"
          : "pro";
      const billingCycle: BillingCycle =
        plan === "team" ? "monthly" : "annual";
      const maxVaults = plan === "business" ? 50 : plan === "team" ? 20 : 10;
      const name =
        plan === "business"
          ? "Business Cloud Enterprise User"
          : plan === "team"
          ? "Team Cloud Workspace"
          : "Pro Developer User";
      const mockToken = `mock_${plan}_${Date.now()}`;
      const mockUser = {
        billingCycle,
        email: email.trim(),
        id: `mock_${plan}_01`,
        maxVaults,
        name,
        plan,
        role: "user",
      };

      updateCloudSyncConfig({
        apiToken: mockToken,
        billingCycle,
        maxVaults,
        subscriptionTier: plan,
        userEmail: email.trim(),
        userId: mockUser.id,
        userName: name,
        userProvider: "credentials",
      });

      return {
        success: true,
        user: mockUser,
      };
    }

    return {
      error: err?.message || String(err),
      success: false,
    };
  }
}

// -------------------------------------------------------------
// er-backend Integration: AUTH REGISTER (/api/auth/register)
// -------------------------------------------------------------
export async function registerToCloudBackend(
  name: string,
  email: string,
  pass: string,
  plan: SubscriptionTier = "free",
  billingCycle: BillingCycle = "annual",
  authEndpointOverride?: string
): Promise<{ error?: string; success: boolean; user?: any }> {
  const config = getCloudSyncConfig();
  const baseAuth = normalizeCloudEndpoint(authEndpointOverride || config.authEndpoint);
  const regUrl = baseAuth.endsWith("/register") ? baseAuth : `${baseAuth}/register`;

  try {
    const response = await fetch(regUrl, {
      body: JSON.stringify({
        billingCycle,
        email: email.trim(),
        name: name.trim(),
        password: pass,
        plan,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok || resJson.success === false) {
      throw new Error(resJson.error || "Gagal mendaftar ke server cloud");
    }

    const userTier: SubscriptionTier =
      resJson.user?.plan === "business"
        ? "business"
        : resJson.user?.plan === "team"
        ? "team"
        : (resJson.user?.plan === "pro" ? "pro" : "free");
    const userBilling: BillingCycle =
      resJson.user?.billingCycle === "monthly" ? "monthly" : "annual";
    const maxVaults =
      resJson.user?.maxVaults ||
      (userTier === "business" ? 50 : userTier === "team" ? 20 : (userTier === "pro" ? 10 : 1));

    updateCloudSyncConfig({
      apiToken: resJson.token,
      billingCycle: userBilling,
      maxVaults,
      planExpiresAt: resJson.user?.planExpiresAt,
      subscriptionTier: userTier,
      userEmail: resJson.user?.email || email,
      userId: resJson.user?.id ? String(resJson.user.id) : undefined,
      userName: resJson.user?.name || name,
      userProvider: "credentials",
    });

    return {
      success: true,
      user: resJson.user,
    };
  } catch (err: any) {
    return {
      error: err?.message || String(err),
      success: false,
    };
  }
}

// -------------------------------------------------------------
// er-backend Integration: UPGRADE / CHANGE PLAN (/api/auth/plan)
// -------------------------------------------------------------
export async function upgradeSubscriptionPlan(
  plan: SubscriptionTier,
  billingCycle: BillingCycle
): Promise<{ error?: string; success: boolean; user?: any }> {
  const config = getCloudSyncConfig();
  const maxVaults =
    plan === "business" ? 50 : plan === "team" ? 20 : 10;

  if (!config.apiToken) {
    updateCloudSyncConfig({
      billingCycle,
      maxVaults,
      subscriptionTier: plan,
    });
    return { success: true };
  }

  const baseAuth = normalizeCloudEndpoint(config.authEndpoint);
  const planUrl = `${baseAuth}/plan`;

  try {
    const response = await fetch(planUrl, {
      body: JSON.stringify({ billingCycle, plan }),
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok || resJson.success === false) {
      throw new Error(resJson.error || "Gagal memperbarui paket langganan di cloud");
    }

    if (resJson.token) {
      updateCloudSyncConfig({ apiToken: resJson.token });
    }

    updateCloudSyncConfig({
      billingCycle,
      maxVaults: resJson.user?.maxVaults || maxVaults,
      planExpiresAt: resJson.user?.planExpiresAt,
      subscriptionTier: plan,
    });

    return {
      success: true,
      user: resJson.user,
    };
  } catch (err: any) {
    // Fallback locally jika offline
    updateCloudSyncConfig({
      billingCycle,
      maxVaults,
      subscriptionTier: plan,
    });
    return {
      error: err?.message || String(err),
      success: false,
    };
  }
}

// -------------------------------------------------------------
// er-backend Integration: OAUTH SOCIAL LOGIN (/api/auth/oauth)
// -------------------------------------------------------------
export async function oauthLoginCloudBackend(
  provider: "google" | "github",
  email: string,
  name?: string,
  image?: string,
  authEndpointOverride?: string
): Promise<{ error?: string; success: boolean; user?: any }> {
  const config = getCloudSyncConfig();
  const baseAuth = normalizeCloudEndpoint(authEndpointOverride || config.authEndpoint);
  const oauthUrl = baseAuth.endsWith("/oauth") ? baseAuth : `${baseAuth}/oauth`;

  try {
    const response = await fetch(oauthUrl, {
      body: JSON.stringify({
        email: email.trim(),
        image: image || "",
        name: name?.trim(),
        provider,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok || resJson.success === false) {
      throw new Error(resJson.error || `Gagal login dengan ${provider.toUpperCase()}`);
    }

    const userTier: SubscriptionTier =
      resJson.user?.plan === "business"
        ? "business"
        : resJson.user?.plan === "team"
        ? "team"
        : (resJson.user?.plan === "pro" ? "pro" : "free");
    const userBilling: BillingCycle =
      resJson.user?.billingCycle === "monthly" ? "monthly" : "annual";
    const maxVaults =
      resJson.user?.maxVaults ||
      (userTier === "business" ? 50 : userTier === "team" ? 20 : (userTier === "pro" ? 10 : 1));

    updateCloudSyncConfig({
      apiToken: resJson.token,
      billingCycle: userBilling,
      maxVaults,
      planExpiresAt: resJson.user?.planExpiresAt,
      subscriptionTier: userTier,
      userAvatar: resJson.user?.image || image,
      userEmail: resJson.user?.email || email,
      userId: resJson.user?.id ? String(resJson.user.id) : undefined,
      userName: resJson.user?.name || name,
      userProvider: provider,
    });

    return {
      success: true,
      user: resJson.user,
    };
  } catch (err: any) {
    // Fallback offline / local mock
    const fallbackTier: SubscriptionTier = "business";
    const fallbackToken = `mock_${provider}_${Date.now()}`;
    updateCloudSyncConfig({
      apiToken: fallbackToken,
      billingCycle: "annual",
      maxVaults: 50,
      subscriptionTier: fallbackTier,
      userAvatar: image,
      userEmail: email,
      userId: `local_${Date.now()}`,
      userName: name || `${provider === "google" ? "Google User" : "GitHub User"}`,
      userProvider: provider,
    });

    return {
      success: true,
      user: {
        billingCycle: "annual",
        email,
        maxVaults: 50,
        name: name || `${provider === "google" ? "Google User" : "GitHub User"}`,
        plan: fallbackTier,
        role: "user",
      },
    };
  }
}

export function saveAuthSession(
  token: string,
  user: any,
  provider?: string
): void {
  const userTier: SubscriptionTier =
    user?.plan === "business"
      ? "business"
      : user?.plan === "team"
      ? "team"
      : user?.plan === "pro"
      ? "pro"
      : "free";

  const userBilling: BillingCycle =
    user?.billingCycle === "monthly" ? "monthly" : "annual";

  const maxVaults =
    user?.maxVaults ||
    (userTier === "business" ? 50 : userTier === "team" ? 20 : userTier === "pro" ? 10 : 1);

  updateCloudSyncConfig({
    apiToken: token,
    billingCycle: userBilling,
    maxVaults,
    planExpiresAt: user?.planExpiresAt,
    subscriptionTier: userTier,
    userAvatar: user?.image,
    userEmail: user?.email,
    userId: user?.id ? String(user.id) : undefined,
    userName: user?.name,
    userProvider: provider || user?.provider || "oauth",
  });
}

export function logoutCloudBackend(): void {
  updateCloudSyncConfig({
    apiToken: undefined,
    billingCycle: "annual",
    maxVaults: 10,
    planExpiresAt: undefined,
    subscriptionTier: "free",
    userAvatar: undefined,
    userEmail: undefined,
    userId: undefined,
    userName: undefined,
    userProvider: undefined,
  });
}

export function clearJournal(scope?: string): void {
  const currentScope = scope || getUserScopeKey();
  const storageKey = getScopedKey(LOCAL_STORAGE_KEYS.CLOUD_SYNC_JOURNAL, currentScope);
  if (isStorageAvailable()) {
    localStorage.removeItem(storageKey);
  }
  getScopedMemoryStore(currentScope).journal = [];
}
