import {
  Activity,
  Code2,
  Columns,
  Database,
  FileDown,
  FileUp,
  Layers,
  PanelLeft,
  Play,
  Plus,
  Search,
  Server,
  Sliders,
  SlidersHorizontal,
  Table as TableIcon,
  Users,
  Workflow,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/connection";
import { cn } from "@/utils/tailwind";
import type { WorkspaceTabId } from "./types";

interface WorkspaceNavProps {
  activeConnectedProfile: Profile | null;
  availableDatabasesCount: number;
  currentSelectedDatabase: string;
  currentWorkspaceTab: WorkspaceTabId;
  isWorkspaceSidebarOpen: boolean;
  onOpenWorkspaceSidebar: () => void;
  onSelectDatabaseBreadcrumb?: () => void;
  onSelectServerBreadcrumb?: () => void;
  onSelectTableBreadcrumb?: () => void;
  onSwitchWorkspaceTab: (tabId: WorkspaceTabId) => void;
  selectedTable: string;
}

export function WorkspaceNav({
  activeConnectedProfile,
  availableDatabasesCount,
  currentSelectedDatabase,
  currentWorkspaceTab,
  isWorkspaceSidebarOpen,
  onOpenWorkspaceSidebar,
  onSelectDatabaseBreadcrumb,
  onSelectServerBreadcrumb,
  onSelectTableBreadcrumb,
  onSwitchWorkspaceTab,
  selectedTable,
}: WorkspaceNavProps) {
  // phpMyAdmin tabs
  const tabs = [
    ...(selectedTable
      ? [
          {
            icon: Play,
            id: "browse" as WorkspaceTabId,
            label: "Browse",
          },
        ]
      : []),
    { icon: Database, id: "databases" as WorkspaceTabId, label: "Databases" },
    {
      icon: TableIcon,
      id: "structure" as WorkspaceTabId,
      label: currentSelectedDatabase
        ? `Structure (${currentSelectedDatabase})`
        : "Structure",
    },
    { icon: Code2, id: "sql" as WorkspaceTabId, label: "SQL" },
    { icon: Search, id: "search" as WorkspaceTabId, label: "Search" },
    ...(selectedTable
      ? [
          {
            icon: Plus,
            id: "insert" as WorkspaceTabId,
            label: "Insert",
          },
        ]
      : []),
    { icon: Sliders, id: "operations" as WorkspaceTabId, label: "Operations" },
    { icon: FileDown, id: "export" as WorkspaceTabId, label: "Export" },
    { icon: FileUp, id: "import" as WorkspaceTabId, label: "Import" },
    { icon: Workflow, id: "routines" as WorkspaceTabId, label: "Routines" },
    { icon: Activity, id: "status" as WorkspaceTabId, label: "Status" },
    { icon: Users, id: "users" as WorkspaceTabId, label: "User accounts" },
    {
      icon: SlidersHorizontal,
      id: "variables" as WorkspaceTabId,
      label: "Variables",
    },
    { icon: Columns, id: "charsets" as WorkspaceTabId, label: "Charsets" },
    { icon: Server, id: "engines" as WorkspaceTabId, label: "Engines" },
    { icon: Layers, id: "plugins" as WorkspaceTabId, label: "Plugins" },
  ];

  return (
    <>
      {/* Top Breadcrumb Bar (phpMyAdmin style: Server: ... » Database: ... » Table: ...) */}
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs sm:gap-2">
          {!isWorkspaceSidebarOpen && (
            <Button
              className="flex h-7 shrink-0 items-center gap-1.5 border-border bg-muted/40 px-2 text-primary hover:bg-muted hover:text-foreground cursor-pointer"
              onClick={onOpenWorkspaceSidebar}
              size="sm"
              title="Tampilkan Explorer Basis Data"
              variant="outline"
            >
              <PanelLeft size={13} />
              <span className="hidden sm:inline">Explorer</span>
              {availableDatabasesCount > 0 && (
                <span className="font-mono text-[10px] text-emerald-500">
                  ({availableDatabasesCount})
                </span>
              )}
            </Button>
          )}

          {/* Server breadcrumb */}
          <button
            className="flex items-center gap-1 max-w-[140px] sm:max-w-[180px] md:max-w-[220px] truncate font-medium text-foreground hover:text-primary hover:underline cursor-pointer"
            onClick={onSelectServerBreadcrumb}
            title="Kembali ke level Server"
            type="button"
          >
            <Server className="size-3 text-muted-foreground shrink-0" />
            <span className="truncate">
              Server: {activeConnectedProfile?.name || activeConnectedProfile?.host || "localhost"}
            </span>
          </button>

          {currentSelectedDatabase && (
            <>
              <span className="shrink-0 text-muted-foreground/60 select-none">»</span>
              <button
                className="flex items-center gap-1 max-w-[120px] sm:max-w-[160px] truncate font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                onClick={onSelectDatabaseBreadcrumb}
                title={`Basis Data: ${currentSelectedDatabase}`}
                type="button"
              >
                <Database className="size-3 shrink-0" />
                <span className="truncate">Database: {currentSelectedDatabase}</span>
              </button>
            </>
          )}

          {selectedTable && (
            <>
              <span className="shrink-0 text-muted-foreground/60 select-none">»</span>
              <button
                className="flex items-center gap-1 max-w-[120px] sm:max-w-[160px] truncate font-mono text-primary font-semibold hover:underline cursor-pointer"
                onClick={onSelectTableBreadcrumb}
                title={`Tabel: ${selectedTable}`}
                type="button"
              >
                <TableIcon className="size-3 shrink-0" />
                <span className="truncate">Table: {selectedTable}</span>
              </button>
            </>
          )}

          <Badge
            className="ml-1 hidden shrink-0 border-emerald-500/30 bg-emerald-500/10 text-[9px] text-emerald-500 lg:inline-flex font-mono"
            variant="outline"
          >
            Socket TCP 3306
          </Badge>
        </div>
      </div>

      {/* phpMyAdmin Tab Navigation */}
      <div className="no-scrollbar flex shrink-0 select-none items-center gap-0.5 overflow-x-auto border-b border-border bg-card px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentWorkspaceTab === tab.id;
          return (
            <button
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 border-b-2 px-3 font-medium text-xs transition-colors cursor-pointer",
                isActive
                  ? "border-primary bg-accent/40 font-semibold text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
              )}
              key={tab.id}
              onClick={() => onSwitchWorkspaceTab(tab.id)}
              type="button"
            >
              <Icon
                className={cn(
                  "shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                size={13}
              />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
