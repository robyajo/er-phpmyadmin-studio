import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildCloudSyncSnapshot,
  clearJournal,
  deleteSnippet,
  exportCloudBackupJson,
  getCloudSyncConfig,
  getStoredJournal,
  getStoredProfiles,
  getStoredQueryHistory,
  getStoredSnippets,
  importCloudBackupJson,
  loginToCloudBackend,
  logoutCloudBackend,
  mergeWithCloudBackend,
  pullFromCloudBackend,
  recordQueryHistory,
  recordUserAction,
  resetMemoryStores,
  saveSnippet,
  syncWithCloudBackend,
  triggerAutoSyncToCloud,
  updateCloudSyncConfig,
  upgradeSubscriptionPlan,
} from "@/services/cloud-sync";
import {
  cloudSyncSnapshotSchema,
  SUBSCRIPTION_PLANS,
  userActionEntrySchema,
} from "@/types/cloud-sync";
import type { Profile } from "@/types/connection";

const MOCK_PROFILES: Profile[] = [
  {
    connection_revision: 1,
    created_at: "2026-10-24T00:00:00.000Z",
    database: "test_db",
    db_type: "mysql",
    environment: "Local",
    favorite: true,
    has_saved_password: true,
    host: "127.0.0.1",
    id: "a1c3d4e5-3333-4444-8888-3456789abcde",
    last_used_at: null,
    method: "direct",
    name: "Localhost MySQL",
    port: 3306,
    ssh: null,
    tls: { ca: null, cert: null, enabled: true, key: null, verify: true },
    updated_at: "2026-10-29T00:00:00.000Z",
    username: "root",
  },
];

describe("Cloud Sync & State Journaling (er-backend)", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    resetMemoryStores();
    clearJournal();
    logoutCloudBackend();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should record user actions in audit journal with pending sync status", () => {
    const entry = recordUserAction({
      action: "database_create",
      category: "database",
      database: "store_db",
      details: { collation: "utf8mb4_general_ci" },
      profileId: MOCK_PROFILES[0].id,
      profileName: MOCK_PROFILES[0].name,
    });

    expect(entry.id).toBeDefined();
    expect(entry.action).toBe("database_create");
    expect(entry.category).toBe("database");
    expect(entry.syncStatus).toBe("pending");
    expect(entry.timestamp).toBeDefined();

    const validation = userActionEntrySchema.safeParse(entry);
    expect(validation.success).toBe(true);

    const journal = getStoredJournal();
    expect(journal.length).toBeGreaterThanOrEqual(1);
    expect(journal[0].id).toBe(entry.id);
  });

  it("should record query execution history", () => {
    const query = recordQueryHistory({
      database: "store_db",
      durationMs: 42,
      profileId: MOCK_PROFILES[0].id,
      profileName: MOCK_PROFILES[0].name,
      query: "SELECT * FROM users WHERE active = 1;",
      rowsAffected: 120,
      success: true,
    });

    expect(query.id).toBeDefined();
    expect(query.durationMs).toBe(42);
    expect(query.success).toBe(true);

    const history = getStoredQueryHistory();
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].id).toBe(query.id);
  });

  it("should save and retrieve snippets", () => {
    const snippet = saveSnippet({
      database: "store_db",
      query: "SELECT id, name FROM categories ORDER BY name ASC;",
      tags: ["lookup", "categories"],
      title: "Get Active Categories",
    });

    expect(snippet.id).toBeDefined();
    expect(snippet.title).toBe("Get Active Categories");

    const snippets = getStoredSnippets();
    expect(snippets.some((s) => s.id === snippet.id)).toBe(true);
  });

  it("should generate a complete, valid CloudSyncSnapshot JSON with business tier & billing cycle", () => {
    updateCloudSyncConfig({
      billingCycle: "annual",
      maxVaults: 50,
      subscriptionTier: "business",
      userEmail: "business@xphpmyadmin.dev",
      userId: "usr_tester_business",
    });

    recordUserAction({
      action: "table_maintenance",
      category: "table",
      database: "store_db",
      details: { subAction: "OPTIMIZE" },
      table: "users",
    });

    const snapshot = buildCloudSyncSnapshot(MOCK_PROFILES, {
      theme: "dark",
    });

    expect(snapshot.metadata.version).toBe("1.0.0");
    expect(snapshot.metadata.totalProfiles).toBe(1);
    expect(snapshot.metadata.subscriptionTier).toBe("business");
    expect(snapshot.metadata.billingCycle).toBe("annual");
    expect(snapshot.metadata.maxVaults).toBe(50);
    expect(snapshot.profiles).toHaveLength(1);
    expect(snapshot.journal.length).toBeGreaterThanOrEqual(1);

    const validation = cloudSyncSnapshotSchema.safeParse(snapshot);
    expect(validation.success).toBe(true);

    const exportedString = exportCloudBackupJson(MOCK_PROFILES);
    expect(typeof exportedString).toBe("string");
    expect(exportedString).toContain('"subscriptionTier": "business"');
    expect(exportedString).toContain('"billingCycle": "annual"');
  });

  it("should validate subscription plans rates and features according to design", () => {
    // Pro Plan
    expect(SUBSCRIPTION_PLANS.pro.annualMonthlyRate).toBe(10);
    expect(SUBSCRIPTION_PLANS.pro.monthlyRate).toBe(15);
    expect(SUBSCRIPTION_PLANS.pro.maxVaults).toBe(10);
    expect(SUBSCRIPTION_PLANS.pro.features.length).toBeGreaterThanOrEqual(4);

    // Team Plan
    expect(SUBSCRIPTION_PLANS.team.annualMonthlyRate).toBe(20);
    expect(SUBSCRIPTION_PLANS.team.monthlyRate).toBe(30);
    expect(SUBSCRIPTION_PLANS.team.maxVaults).toBe(20);

    // Business Plan
    expect(SUBSCRIPTION_PLANS.business.annualMonthlyRate).toBe(30);
    expect(SUBSCRIPTION_PLANS.business.monthlyRate).toBe(45);
    expect(SUBSCRIPTION_PLANS.business.maxVaults).toBe(50);
  });

  it("should validate and restore data from a valid cloud backup JSON string", () => {
    const validJson = exportCloudBackupJson(MOCK_PROFILES);
    const result = importCloudBackupJson(validJson);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.profiles.length).toBeGreaterThanOrEqual(1);
  });

  it("should reject invalid JSON strings with descriptive errors", () => {
    const invalidJson = '{"not": "a valid snapshot"}';
    const result = importCloudBackupJson(invalidJson);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain("Format JSON tidak valid");
  });

  it("should upgrade subscription tier and billing cycle", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        message: "Plan updated to business (annual)",
        user: {
          id: "usr_tester_business",
          email: "business@xphpmyadmin.dev",
          plan: "business",
          billingCycle: "annual",
          maxVaults: 50,
        },
      }),
      ok: true,
      status: 200,
    });
    vi.stubGlobal("fetch", mockFetch);

    // Set initial config with apiToken
    updateCloudSyncConfig({
      apiToken: "valid_jwt_token",
      subscriptionTier: "pro",
    });

    const upgradeRes = await upgradeSubscriptionPlan("business", "annual");
    expect(upgradeRes.success).toBe(true);

    const cfg = getCloudSyncConfig();
    expect(cfg.subscriptionTier).toBe("business");
    expect(cfg.billingCycle).toBe("annual");
    expect(cfg.maxVaults).toBe(50);
  });

  it("should push, pull, and merge with er-backend API contract", async () => {
    const sampleSnapshot = buildCloudSyncSnapshot(MOCK_PROFILES);

    const mockFetch = vi
      .fn()
      // 1. POST /api/sync/push
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: "Data successfully synced and saved to Neon cloud database!",
          updatedAt: Date.now(),
        }),
        ok: true,
        status: 200,
      })
      // 2. POST /api/sync/pull
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: sampleSnapshot,
          updatedAt: Date.now(),
          lastDevice: "MacBook Pro",
        }),
        ok: true,
        status: 200,
      })
      // 3. POST /api/sync/merge
      .mockResolvedValueOnce({
        json: async () => ({
          success: true,
          message: "Smart merge cloud Neon selesai!",
          data: sampleSnapshot,
        }),
        ok: true,
        status: 200,
      });

    vi.stubGlobal("fetch", mockFetch);

    updateCloudSyncConfig({
      apiToken: "valid_token",
      subscriptionTier: "business",
      userEmail: "business@xphpmyadmin.dev",
    });

    // 1. Push
    const pushResult = await syncWithCloudBackend(
      MOCK_PROFILES,
      "valid_token",
      "https://www.er-service.duckdns.org/api/sync"
    );
    expect(pushResult.success).toBe(true);
    expect(pushResult.message).toContain("successfully synced");

    // 2. Pull
    const pullResult = await pullFromCloudBackend(
      "valid_token",
      "https://www.er-service.duckdns.org/api/sync"
    );
    expect(pullResult.success).toBe(true);
    expect(pullResult.data?.metadata.version).toBe("1.0.0");

    // 3. Merge
    const mergeResult = await mergeWithCloudBackend(
      MOCK_PROFILES,
      "valid_token",
      "https://www.er-service.duckdns.org/api/sync"
    );
    expect(mergeResult.success).toBe(true);
  });

  it("should restrict cloud sync for free tier users (local vault only) and require subscription", async () => {
    updateCloudSyncConfig({
      apiToken: undefined,
      subscriptionTier: "free",
      userEmail: undefined,
    });

    const pushRes = await syncWithCloudBackend(MOCK_PROFILES);
    expect(pushRes.success).toBe(false);
    expect(pushRes.error).toContain("Paket gratis hanya memiliki brankas lokal");

    const pullRes = await pullFromCloudBackend();
    expect(pullRes.success).toBe(false);
    expect(pullRes.error).toContain("Paket gratis hanya memiliki brankas lokal");

    const mergeRes = await mergeWithCloudBackend(MOCK_PROFILES);
    expect(mergeRes.success).toBe(false);
    expect(mergeRes.error).toContain("Paket gratis hanya memiliki brankas lokal");
  });

  it("should auto-sync user actions by default when tier is not free, and allow manual sync", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        message: "Data successfully synced and saved to Neon cloud database!",
        updatedAt: Date.now(),
      }),
      ok: true,
      status: 200,
    });
    vi.stubGlobal("fetch", mockFetch);

    // 1. Pro tier user triggers an action -> should auto sync to backend
    updateCloudSyncConfig({
      apiToken: "pro_token",
      subscriptionTier: "pro",
      userEmail: "pro@xphpmyadmin.dev",
    });

    // Record an action
    recordUserAction({
      action: "table_create",
      category: "table",
      database: "test_db",
      details: {},
      table: "products",
    });

    // Auto-sync triggers push to backend
    const autoSyncRes = await triggerAutoSyncToCloud(MOCK_PROFILES, 0);
    expect(autoSyncRes.success).toBe(true);
    expect(mockFetch).toHaveBeenCalled();

    // Journal should be marked as synced
    const journal = getStoredJournal();
    expect(journal[0].syncStatus).toBe("synced");

    // 2. Free tier skips auto-sync (local vault only)
    updateCloudSyncConfig({ subscriptionTier: "free" });
    mockFetch.mockClear();

    const freeAutoSyncRes = await triggerAutoSyncToCloud(MOCK_PROFILES, 0);
    expect(freeAutoSyncRes.skipped).toBe(true);
    expect(freeAutoSyncRes.success).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();

    // 3. Non-free user can still perform manual sync anytime
    updateCloudSyncConfig({
      apiToken: "business_token",
      subscriptionTier: "business",
    });
    const manualSyncRes = await syncWithCloudBackend(
      MOCK_PROFILES,
      "business_token"
    );
    expect(manualSyncRes.success).toBe(true);
    expect(mockFetch).toHaveBeenCalled();
  });

  it("should isolate snapshots, profiles, and audit journals between different user accounts (Pro vs Business vs Guest)", async () => {
    // Mock network failure so it fast-tests local mock/seed fallback
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network offline test")));

    // 1. Log in as Pro
    const proLogin = await loginToCloudBackend("pro@xphpmyadmin.dev", "Password@123");
    expect(proLogin.success).toBe(true);

    const proSnapshot = buildCloudSyncSnapshot();
    expect(proSnapshot.metadata.subscriptionTier).toBe("pro");
    expect(proSnapshot.metadata.maxVaults).toBe(10);
    expect(proSnapshot.metadata.userEmail).toBe("pro@xphpmyadmin.dev");
    expect(proSnapshot.profiles.some((p) => p.name.includes("Pro Dev") || p.name.includes("Localhost"))).toBe(true);

    // Record action in Pro
    recordUserAction({
      action: "database_create",
      category: "database",
      database: "pro_unique_db",
    });
    const proJournal = getStoredJournal();
    expect(proJournal.some((j) => j.database === "pro_unique_db")).toBe(true);

    // 2. Switch account: Log in as Business
    const bizLogin = await loginToCloudBackend("business@xphpmyadmin.dev", "Password@123");
    expect(bizLogin.success).toBe(true);

    const bizSnapshot = buildCloudSyncSnapshot();
    expect(bizSnapshot.metadata.subscriptionTier).toBe("business");
    expect(bizSnapshot.metadata.maxVaults).toBe(50);
    expect(bizSnapshot.metadata.userEmail).toBe("business@xphpmyadmin.dev");
    expect(bizSnapshot.profiles.some((p) => p.name.includes("Enterprise Production"))).toBe(true);

    // Business journal must NOT contain Pro's unique database action
    const bizJournal = getStoredJournal();
    expect(bizJournal.some((j) => j.database === "pro_unique_db")).toBe(false);

    // Pro and Business snapshots must NOT be identical
    expect(proSnapshot.metadata.subscriptionTier).not.toBe(bizSnapshot.metadata.subscriptionTier);
    expect(proSnapshot.metadata.maxVaults).not.toBe(bizSnapshot.metadata.maxVaults);
    expect(proSnapshot.profiles).not.toEqual(bizSnapshot.profiles);

    // 3. Logout to Guest / Free
    logoutCloudBackend();
    const guestSnapshot = buildCloudSyncSnapshot();
    expect(guestSnapshot.metadata.subscriptionTier).toBe("free");
    expect(guestSnapshot.metadata.userEmail).toBeUndefined();
    expect(getStoredJournal().some((j) => j.database === "pro_unique_db")).toBe(false);
  });
});
