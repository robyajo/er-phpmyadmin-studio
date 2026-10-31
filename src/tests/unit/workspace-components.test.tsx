import { InsertTab } from "@/components/workspace/tabs/insert-tab";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConnectionGrid } from "@/components/workspace/connection/connection-grid";
import { ConnectionInspector } from "@/components/workspace/connection/connection-inspector";
import { ConnectionSidebar } from "@/components/workspace/connection/connection-sidebar";
import { INITIAL_PROFILES } from "@/components/workspace/constants";
import { ExplorerSidebar } from "@/components/workspace/explorer/explorer-sidebar";
import { ExportTab } from "@/components/workspace/tabs/export-tab";
import { ImportTab } from "@/components/workspace/tabs/import-tab";
import { OperationsTab } from "@/components/workspace/tabs/operations-tab";
import { RoutinesTab } from "@/components/workspace/tabs/routines-tab";
import { SearchTab } from "@/components/workspace/tabs/search-tab";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceNav } from "@/components/workspace/workspace-nav";
import { StructureTab } from "@/components/workspace/tabs/structure-tab";
import { BrowseTab } from "@/components/workspace/tabs/browse-tab";
import { EditRowModal } from "@/components/workspace/modals/edit-row-modal";
import { ExplainSqlModal } from "@/components/workspace/modals/explain-sql-modal";
import { CreatePhpCodeModal } from "@/components/workspace/modals/create-php-code-modal";
import { CreateViewModal } from "@/components/workspace/modals/create-view-modal";

const DELETE_HOST_REGEX = /Hapus koneksi/i;

describe("Workspace Components", () => {
  it("renders WorkspaceHeader correctly", () => {
    const { getByText, getByPlaceholderText } = render(
      <WorkspaceHeader
        activeTabId="tab-home"
        activeTabs={[
          { env: "Local", id: "tab-home", name: "Pengelola Koneksi" },
        ]}
        isSidebarCollapsed={false}
        onCloseTab={vi.fn()}
        onSearchChange={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleSidebar={vi.fn()}
        searchQuery=""
      />
    );

    expect(getByText("Pengelola Koneksi")).toBeInTheDocument();
    expect(
      getByPlaceholderText(/Cari host atau database\.\.\.|Search hosts or databases\.\.\./)
    ).toBeInTheDocument();
    expect(getByText("v1.4.2")).toBeInTheDocument();
  });

  it("handles pending sync badges correctly based on subscription tier", () => {
    // 1. Free tier shows amber pending badge
    const { getByText, queryByText, rerender } = render(
      <WorkspaceHeader
        activeTabId="tab-home"
        activeTabs={[
          { env: "Local", id: "tab-home", name: "Pengelola Koneksi" },
        ]}
        isSidebarCollapsed={false}
        onCloseTab={vi.fn()}
        onOpenCloudSync={vi.fn()}
        onSearchChange={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleSidebar={vi.fn()}
        pendingSyncCount={3}
        searchQuery=""
        userConfig={{
          apiEndpoint: "https://er-service.duckdns.org/api/sync",
          authEndpoint: "https://er-service.duckdns.org/api/auth",
          autoSync: false,
          billingCycle: "annual",
          maxVaults: 1,
          status: "idle",
          subscriptionTier: "free",
        }}
      />
    );

    expect(getByText("3")).toBeInTheDocument();

    // 2. Subscribed user (Pro/Team/Business) suppresses amber warning badge because auto-sync handles it
    rerender(
      <WorkspaceHeader
        activeTabId="tab-home"
        activeTabs={[
          { env: "Local", id: "tab-home", name: "Pengelola Koneksi" },
        ]}
        isSidebarCollapsed={false}
        onCloseTab={vi.fn()}
        onOpenCloudSync={vi.fn()}
        onSearchChange={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleSidebar={vi.fn()}
        pendingSyncCount={3}
        searchQuery=""
        userConfig={{
          apiEndpoint: "https://er-service.duckdns.org/api/sync",
          authEndpoint: "https://er-service.duckdns.org/api/auth",
          autoSync: true,
          billingCycle: "annual",
          maxVaults: 10,
          status: "idle",
          subscriptionTier: "pro",
          userEmail: "pro@example.com",
        }}
      />
    );

    expect(queryByText("3")).toBeNull();
  });

  it("renders ConnectionSidebar correctly and triggers onSelectSection for settings", () => {
    const onSelectMock = vi.fn();
    const { getByText, getByTitle } = render(
      <ConnectionSidebar isSidebarCollapsed={false} onSelectSection={onSelectMock} />
    );
    expect(getByText("Koneksi (Hosts)")).toBeInTheDocument();
    expect(getByText("SSH Tunnels")).toBeInTheDocument();
    const settingsBtn = getByTitle("Pengaturan");
    expect(settingsBtn).toBeInTheDocument();
    fireEvent.click(settingsBtn);
    expect(onSelectMock).toHaveBeenCalledWith("settings");
  });

  it("renders ConnectionGrid with hosts list and triggers onDeleteHost", () => {
    const onDeleteHostMock = vi.fn();
    const { getByText, getAllByLabelText } = render(
      <ConnectionGrid
        favoritesOnly={false}
        filteredProfiles={INITIAL_PROFILES}
        isInspectorOpen={true}
        onAddNewHost={vi.fn()}
        onDeleteHost={onDeleteHostMock}
        onSelectHost={vi.fn()}
        onSortByChange={vi.fn()}
        onToggleFavorite={vi.fn()}
        onToggleFavoriteFilter={vi.fn()}
        onToggleInspector={vi.fn()}
        selectedId={INITIAL_PROFILES[0].id}
        sortBy="recent"
      />
    );

    expect(getByText("Tambah Koneksi")).toBeInTheDocument();
    expect(getByText(INITIAL_PROFILES[0].name)).toBeInTheDocument();

    const deleteButtons = getAllByLabelText(DELETE_HOST_REGEX);
    expect(deleteButtons.length).toBeGreaterThan(0);
    deleteButtons[0].click();
    expect(onDeleteHostMock).toHaveBeenCalledWith(INITIAL_PROFILES[0]);
  });

  it("renders ConnectionInspector correctly", () => {
    const { getByText } = render(
      <ConnectionInspector
        diagnostics={null}
        editForm={INITIAL_PROFILES[0]}
        isOpen={true}
        isTesting={false}
        onClose={vi.fn()}
        onConnect={vi.fn()}
        onInspectSshKey={vi.fn()}
        onSaveProfile={vi.fn()}
        onTestConnection={vi.fn()}
        passwordAction="keep"
        passwordInput=""
        setEditForm={vi.fn()}
        setPasswordAction={vi.fn()}
        setPasswordInput={vi.fn()}
        setShowPassword={vi.fn()}
        setShowSshPassword={vi.fn()}
        showPassword={false}
        showSshPassword={false}
      />
    );

    expect(getByText("Host Details")).toBeInTheDocument();
    expect(getByText("Server Database MySQL / MariaDB")).toBeInTheDocument();
    expect(getByText("Hubungkan ke Database")).toBeInTheDocument();
  });

  it("renders ConnectionInspector correctly with SSH Tunnel method", () => {
    const sshProfile = INITIAL_PROFILES.find((p) => p.method === "ssh")!;
    const { getByText } = render(
      <ConnectionInspector
        diagnostics={null}
        editForm={sshProfile}
        isOpen={true}
        isTesting={false}
        onClose={vi.fn()}
        onConnect={vi.fn()}
        onInspectSshKey={vi.fn()}
        onSaveProfile={vi.fn()}
        onTestConnection={vi.fn()}
        passwordAction="keep"
        passwordInput=""
        setEditForm={vi.fn()}
        setPasswordAction={vi.fn()}
        setPasswordInput={vi.fn()}
        setShowPassword={vi.fn()}
        setShowSshPassword={vi.fn()}
        showPassword={false}
        showSshPassword={false}
      />
    );

    expect(getByText("SSH Tunnel Details")).toBeInTheDocument();
    expect(getByText("Konfigurasi SSH Server (VPS / Bastion)")).toBeInTheDocument();
    expect(getByText("Standar Tunneling VPS Aktif:")).toBeInTheDocument();
    expect(getByText("Passphrase Kunci Privat (Opsional)")).toBeInTheDocument();
  });

  it("renders ConnectionInspector correctly in isCreatingNew draft mode", () => {
    const { getByText } = render(
      <ConnectionInspector
        diagnostics={null}
        editForm={INITIAL_PROFILES[0]}
        isCreatingNew={true}
        isOpen={true}
        isTesting={false}
        onClose={vi.fn()}
        onConnect={vi.fn()}
        onInspectSshKey={vi.fn()}
        onSaveProfile={vi.fn()}
        onTestConnection={vi.fn()}
        passwordAction="replace"
        passwordInput=""
        setEditForm={vi.fn()}
        setPasswordAction={vi.fn()}
        setPasswordInput={vi.fn()}
        setShowPassword={vi.fn()}
        setShowSshPassword={vi.fn()}
        showPassword={false}
        showSshPassword={false}
      />
    );

    expect(getByText("Buat Koneksi Baru")).toBeInTheDocument();
    expect(getByText("Draft Baru")).toBeInTheDocument();
    expect(getByText("Simpan ke Daftar")).toBeInTheDocument();
  });

  it("renders ExplorerSidebar correctly", () => {
    const { getByText, getAllByText } = render(
      <ExplorerSidebar
        activeConnectedProfile={INITIAL_PROFILES[0]}
        availableDatabases={["test_db", "production_db"]}
        currentSelectedDatabase="test_db"
        databaseSearch=""
        filteredDatabases={["test_db", "production_db"]}
        filteredDisplayTables={[{ name: "users", rows: 10, size: "1 KB" }]}
        isLoadingTables={false}
        isOpen={true}
        onClose={vi.fn()}
        onOpenCreateDbModal={vi.fn()}
        onOpenDatabase={vi.fn()}
        onRefreshDatabases={vi.fn()}
        onSelectTable={vi.fn()}
        onSwitchToHub={vi.fn()}
        selectedTable="users"
        setDatabaseSearch={vi.fn()}
        setTableSearch={vi.fn()}
        tableSearch=""
      />
    );

    expect(getByText("Databases (2)")).toBeInTheDocument();
    expect(getAllByText("test_db")[0]).toBeInTheDocument();
    expect(getByText("users")).toBeInTheDocument();
    expect(getByText("Ganti Host")).toBeInTheDocument();
  });

  it("renders WorkspaceNav tabs correctly including Search and Routines", () => {
    const { getByText } = render(
      <WorkspaceNav
        activeConnectedProfile={INITIAL_PROFILES[0]}
        availableDatabasesCount={2}
        currentSelectedDatabase="test_db"
        currentWorkspaceTab="databases"
        isWorkspaceSidebarOpen={true}
        onOpenWorkspaceSidebar={vi.fn()}
        onSwitchWorkspaceTab={vi.fn()}
        selectedTable="users"
      />
    );

    expect(getByText("Databases")).toBeInTheDocument();
    expect(getByText("Structure (test_db)")).toBeInTheDocument();
    expect(getByText("SQL")).toBeInTheDocument();
    expect(getByText("Search")).toBeInTheDocument();
    expect(getByText("Operations")).toBeInTheDocument();
    expect(getByText("Export")).toBeInTheDocument();
    expect(getByText("Import")).toBeInTheDocument();
    expect(getByText("Routines")).toBeInTheDocument();
    expect(getByText("Status")).toBeInTheDocument();
    expect(getByText("User accounts")).toBeInTheDocument();
  });

  it("renders ExportTab with multi-format and custom table selection", () => {
    const { getByText } = render(
      <ExportTab
        availableTables={[{ name: "users", rows: 5, size: "16 KB" }]}
        currentSelectedDatabase="test_db"
        exportAddDropTable={true}
        exportDisableFk={true}
        exportFormat="sql"
        exportMethod="custom"
        exportMode="full"
        exportPreviewSql=""
        exportSelectedTables={["users"]}
        isExporting={false}
        onExecuteExport={vi.fn()}
        setExportAddDropTable={vi.fn()}
        setExportDisableFk={vi.fn()}
        setExportFormat={vi.fn()}
        setExportMethod={vi.fn()}
        setExportMode={vi.fn()}
        setExportSelectedTables={vi.fn()}
      />
    );

    expect(getByText(/Ekspor Basis Data/i)).toBeInTheDocument();
    expect(getByText("SQL Dump")).toBeInTheDocument();
    expect(getByText("CSV")).toBeInTheDocument();
    expect(getByText("JSON")).toBeInTheDocument();
    expect(getByText("XML")).toBeInTheDocument();
    expect(getByText("Pilih Tabel yang Diekspor")).toBeInTheDocument();
  });

  it("renders ImportTab correctly", () => {
    const { getByText } = render(
      <ImportTab
        availableDatabases={["test_db"]}
        availableTables={[{ name: "users", rows: 5, size: "16 KB" }]}
        currentSelectedDatabase="test_db"
        importSqlContent=""
        importTab="file"
        isImporting={false}
        onExecuteImport={vi.fn()}
        onPickImportFile={vi.fn()}
        onProcessChosenFile={vi.fn()}
        onSelectDatabase={vi.fn()}
        selectedImportFile={null}
        setCurrentSelectedDatabase={vi.fn()}
        setImportSqlContent={vi.fn()}
        setImportTab={vi.fn()}
        setSelectedImportFile={vi.fn()}
      />
    );

    expect(getByText("Pilih Berkas (.sql, .csv, .json)")).toBeInTheDocument();
    expect(getByText("Tempel Script SQL Mentah")).toBeInTheDocument();
    expect(getByText("Basis Data Target:")).toBeInTheDocument();
  });

  it("renders OperationsTab and SearchTab correctly", () => {
    const { getByText: getOpText } = render(
      <OperationsTab
        availableTables={[{ name: "customers", rows: 12, size: "32 KB" }]}
        currentSelectedDatabase="crm_db"
        newDbCollation="utf8mb4_general_ci"
        onChangeCollation={vi.fn()}
        onDropDatabase={vi.fn()}
        setNewDbCollation={vi.fn()}
      />
    );

    expect(
      getOpText("Penyortiran Karakter (Collation)")
    ).toBeInTheDocument();
    expect(getOpText("Ganti Nama Basis Data ke:")).toBeInTheDocument();
    expect(
      getOpText("Salin Basis Data (Copy Database)")
    ).toBeInTheDocument();

    const { getByText: getSearchText } = render(
      <SearchTab
        availableTables={[{ name: "customers", rows: 12, size: "32 KB" }]}
        currentSelectedDatabase="crm_db"
        isSearching={false}
        onBrowseTableMatches={vi.fn()}
        onExecuteSearch={vi.fn()}
        searchResults={[]}
      />
    );

    expect(
      getSearchText("Kata Kunci / Nilai yang Dicari:")
    ).toBeInTheDocument();
    expect(getSearchText("Mengandung Kata (LIKE)")).toBeInTheDocument();
  });

  it("renders RoutinesTab correctly", () => {
    const { getByText } = render(
      <RoutinesTab
        currentSelectedDatabase="store_db"
        isLoadingRoutines={false}
        onLoadRoutines={vi.fn()}
        routinesData={[
          {
            definer: "root@localhost",
            name: "CalculateTotal",
            type: "PROCEDURE",
          },
        ]}
        triggersData={[
          {
            event: "INSERT",
            name: "before_user_insert",
            table: "users",
            timing: "BEFORE",
          },
        ]}
      />
    );

    expect(getByText("Prosedur & Fungsi (1)")).toBeInTheDocument();
    expect(
      getByText("Pemicu Database / Triggers (1)")
    ).toBeInTheDocument();
    expect(getByText("CalculateTotal")).toBeInTheDocument();
  });

  it("renders StructureTab with phpMyAdmin style filters, action buttons, and overhead", () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(
      <StructureTab
        bulkAction="empty"
        currentSelectedDatabase="db_camp"
        filteredDisplayTables={[
          {
            collation: "utf8mb4_unicode_ci",
            dataFree: 16384,
            dataLength: 16384,
            engine: "InnoDB",
            name: "cache",
            rows: 10,
            size: "16.0 KiB",
          },
        ]}
        isCreatingTable={false}
        newTableColumnsInput={4}
        newTableNameInput=""
        onBrowseTable={vi.fn()}
        onCreateTable={vi.fn()}
        onDropTable={vi.fn()}
        onEmptyTable={vi.fn()}
        onExecuteBulkAction={vi.fn()}
        onOpenInsertModal={vi.fn()}
        onRefreshTables={vi.fn()}
        onSwitchTab={vi.fn()}
        onViewTableStructure={vi.fn()}
        selectedTableCheckboxes={[]}
        setBulkAction={vi.fn()}
        setNewTableColumnsInput={vi.fn()}
        setNewTableNameInput={vi.fn()}
        setSelectedTableCheckboxes={vi.fn()}
        setTableSearch={vi.fn()}
        tableSearch=""
        totalDatabaseRows={10}
      />
    );

    expect(getByText("Filters")).toBeInTheDocument();
    expect(getByText("Containing the word:")).toBeInTheDocument();
    expect(getByText("cache")).toBeInTheDocument();
    expect(getByText("Browse")).toBeInTheDocument();
    expect(getByText("Structure")).toBeInTheDocument();
    expect(getByText("Search")).toBeInTheDocument();
    expect(getByText("Insert")).toBeInTheDocument();
    expect(getByText("Empty")).toBeInTheDocument();
    expect(getByText("Drop")).toBeInTheDocument();
    expect(getAllByText("16.0 KiB").length).toBeGreaterThan(0);
    expect(getByText("1 tables")).toBeInTheDocument();
  });

  it("renders BrowseTab with query banner, inline actions, row actions, and results operations", () => {
    const { getByText } = render(
      <BrowseTab
        currentSelectedDatabase="db_hono_api"
        isExecutingQuery={false}
        onCopyRow={vi.fn()}
        onCreatePhpCode={vi.fn()}
        onCreateView={vi.fn()}
        onDeleteRow={vi.fn()}
        onDeleteSelectedRows={vi.fn()}
        onDisplayChart={vi.fn()}
        onEditRow={vi.fn()}
        onExecuteQuery={vi.fn()}
        onExplainSql={vi.fn()}
        onExportCurrentResults={vi.fn()}
        onOpenInsertModal={vi.fn()}
        onPrintResults={vi.fn()}
        onSwitchToSqlTab={vi.fn()}
        queryResults={{
          columns: ["id", "name", "email", "role"],
          executionTimeMs: 0.1,
          ok: true,
          rowCount: 2,
          rows: [
            { id: "1", name: "Admin", email: "admin@gmail.com", role: "ADMIN" },
            { id: "2", name: "User", email: "user@gmail.com", role: "USER" },
          ],
        }}
        selectedTable="user"
        setSqlQuery={vi.fn()}
        sqlQuery="SELECT * FROM `user`"
      />
    );

    expect(getByText(/Showing rows 0 - 1/i)).toBeInTheDocument();
    expect(getByText("Edit inline")).toBeInTheDocument();
    expect(getByText("Explain SQL")).toBeInTheDocument();
    expect(getByText("Create PHP code")).toBeInTheDocument();
    expect(getByText("Show all")).toBeInTheDocument();
    expect(getByText("Number of rows:")).toBeInTheDocument();
    expect(getByText("Filter rows:")).toBeInTheDocument();
    expect(getByText("Sort by key:")).toBeInTheDocument();
    expect(getByText("Extra options")).toBeInTheDocument();
    expect(getByText("Admin")).toBeInTheDocument();
    expect(getByText("admin@gmail.com")).toBeInTheDocument();
    expect(getByText("Query results operations")).toBeInTheDocument();
    expect(getByText("Print")).toBeInTheDocument();
    expect(getByText("Copy to clipboard")).toBeInTheDocument();
    expect(getByText("Display chart")).toBeInTheDocument();
    expect(getByText("Create view")).toBeInTheDocument();
  });

  it("renders EditRowModal, ExplainSqlModal, CreatePhpCodeModal, and CreateViewModal", () => {
    const { getByText } = render(
      <>
        <EditRowModal
          currentSelectedDatabase="db_hono_api"
          isSaving={false}
          isOpen={true}
          onClose={vi.fn()}
          onSaveRow={vi.fn()}
          rowToEdit={{ id: 1, name: "Test" }}
          selectedTable="user"
          tableStructureColumns={[{ Field: "id", Type: "int", Null: "NO" }]}
        />
        <ExplainSqlModal
          explainData={{
            columns: ["id", "select_type", "table"],
            rows: [{ id: 1, select_type: "SIMPLE", table: "user" }],
          }}
          isLoading={false}
          isOpen={true}
          onClose={vi.fn()}
          query="SELECT * FROM user"
        />
        <CreatePhpCodeModal
          currentSelectedDatabase="db_hono_api"
          isOpen={true}
          onClose={vi.fn()}
          query="SELECT * FROM user"
        />
        <CreateViewModal
          currentSelectedDatabase="db_hono_api"
          isCreating={false}
          isOpen={true}
          onClose={vi.fn()}
          onCreateView={vi.fn()}
          sqlQuery="SELECT * FROM user"
        />
      </>
    );

    expect(getByText(/Edit Baris Data/i)).toBeInTheDocument();
    expect(getByText(/Rencana Eksekusi Query/i)).toBeInTheDocument();
    expect(getByText(/Buat Kode PHP/i)).toBeInTheDocument();
    expect(getByText(/Buat View Baru/i)).toBeInTheDocument();
  });

  it("renders InsertTab in edit, copy, and insert modes matching phpMyAdmin dedicated view", () => {
    const handleSave = vi.fn();
    const handleCancel = vi.fn();
    const mockColumns = [
      { Field: "id", Type: "varchar(36)", Null: "NO", Key: "PRI", Default: null, Extra: "" },
      { Field: "name", Type: "varchar(255)", Null: "NO", Key: "", Default: null, Extra: "" },
      { Field: "email", Type: "varchar(255)", Null: "NO", Key: "UNI", Default: null, Extra: "" },
    ];

    const { getByText, getByDisplayValue, rerender } = render(
      <InsertTab
        currentSelectedDatabase="db_hono_api"
        initialValues={{ id: "123", name: "Admin Test", email: "admin@test.com" }}
        isSaving={false}
        mode="edit"
        onCancel={handleCancel}
        onSave={handleSave}
        originalRow={{ id: "123", name: "Admin Test", email: "admin@test.com" }}
        selectedTable="user"
        tableStructureColumns={mockColumns}
      />
    );

    // Edit mode assertions
    expect(getByText(/Ubah baris di tabel `user`/i)).toBeInTheDocument();
    expect(getByText(/Mode Edit \(UPDATE\)/i)).toBeInTheDocument();
    expect(getByDisplayValue("Admin Test")).toBeInTheDocument();
    expect(getByDisplayValue("admin@test.com")).toBeInTheDocument();
    expect(getByText("Kirim (Go)")).toBeInTheDocument();
    expect(getByText("Kembali ke Jelajahi (Browse)")).toBeInTheDocument();

    // Trigger cancel
    fireEvent.click(getByText("Kembali ke Jelajahi (Browse)"));
    expect(handleCancel).toHaveBeenCalled();

    // Trigger submit
    fireEvent.click(getByText("Kirim (Go)"));
    expect(handleSave).toHaveBeenCalled();

    // Rerender in copy mode
    rerender(
      <InsertTab
        currentSelectedDatabase="db_hono_api"
        initialValues={{ id: "123", name: "Admin Test", email: "admin@test.com" }}
        isSaving={false}
        mode="copy"
        onCancel={handleCancel}
        onSave={handleSave}
        originalRow={{ id: "123", name: "Admin Test", email: "admin@test.com" }}
        selectedTable="user"
        tableStructureColumns={mockColumns}
      />
    );
    expect(getByText(/Salin & Sisipkan baris ke tabel `user`/i)).toBeInTheDocument();
    expect(getByText(/Mode Duplikasi \(INSERT COPY\)/i)).toBeInTheDocument();

    // Rerender in insert mode
    rerender(
      <InsertTab
        currentSelectedDatabase="db_hono_api"
        initialValues={{}}
        isSaving={false}
        mode="insert"
        onCancel={handleCancel}
        onSave={handleSave}
        selectedTable="user"
        tableStructureColumns={mockColumns}
      />
    );
    expect(getByText(/Sisipkan baris baru ke tabel `user`/i)).toBeInTheDocument();
    expect(getByText(/Mode Baru \(INSERT\)/i)).toBeInTheDocument();
  });
});
