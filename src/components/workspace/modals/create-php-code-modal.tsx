import { Check, Copy, FileCode2, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface CreatePhpCodeModalProps {
  currentSelectedDatabase: string;
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

export function CreatePhpCodeModal({
  currentSelectedDatabase,
  isOpen,
  onClose,
  query,
}: CreatePhpCodeModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const escapedQuery = query.replace(/"/g, '\\"');

  const pdoCode = `<?php
// Koneksi PDO ke basis data: ${currentSelectedDatabase}
$host = '127.0.0.1';
$db   = '${currentSelectedDatabase}';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     $sql = "${escapedQuery}";
     $stmt = $pdo->query($sql);
     $results = $stmt->fetchAll();
     print_r($results);
} catch (PDOException $e) {
     throw new PDOException($e->getMessage(), (int)$e->getCode());
}
?>`;

  const mysqliCode = `<?php
// Koneksi MySQLi ke basis data: ${currentSelectedDatabase}
$mysqli = new mysqli("127.0.0.1", "root", "", "${currentSelectedDatabase}");

if ($mysqli->connect_errno) {
    echo "Gagal terhubung ke MySQL: " . $mysqli->connect_error;
    exit();
}

$sql = "${escapedQuery}";
$result = $mysqli->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        print_r($row);
    }
    $result->free_result();
}

$mysqli->close();
?>`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    toast.success(`Kode PHP (${type}) berhasil disalin ke papan klip!`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-150">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex shrink-0 items-center justify-between border-border border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-500">
              <FileCode2 size={15} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                Buat Kode PHP (Create PHP code)
              </h3>
              <p className="text-[11px] text-muted-foreground/70">
                Gunakan template kode ini untuk integrasi backend PHP
              </p>
            </div>
          </div>
          <button
            className="rounded p-1 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
          {/* PDO Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                PDO (PHP Data Objects - Direkomendasikan)
              </span>
              <Button
                className="h-6 text-[10px] cursor-pointer"
                onClick={() => handleCopy(pdoCode, "PDO")}
                size="sm"
                variant="outline"
              >
                {copiedType === "PDO" ? (
                  <Check className="mr-1 text-emerald-500" size={11} />
                ) : (
                  <Copy className="mr-1" size={11} />
                )}
                Salin PDO
              </Button>
            </div>
            <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground">
              {pdoCode}
            </pre>
          </div>

          {/* MySQLi Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                MySQLi (Object-Oriented)
              </span>
              <Button
                className="h-6 text-[10px] cursor-pointer"
                onClick={() => handleCopy(mysqliCode, "MySQLi")}
                size="sm"
                variant="outline"
              >
                {copiedType === "MySQLi" ? (
                  <Check className="mr-1 text-emerald-500" size={11} />
                ) : (
                  <Copy className="mr-1" size={11} />
                )}
                Salin MySQLi
              </Button>
            </div>
            <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground">
              {mysqliCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-border border-t bg-muted/40 px-4 py-3">
          <Button
            className="h-7 border-border text-foreground text-xs hover:bg-muted cursor-pointer"
            onClick={onClose}
            size="sm"
            type="button"
            variant="outline"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
