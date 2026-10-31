import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";

interface ChartModalProps {
  columns: string[];
  isOpen: boolean;
  onClose: () => void;
  rows: any[];
  tableName: string;
}

export function ChartModal({
  columns,
  isOpen,
  onClose,
  rows,
  tableName,
}: ChartModalProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar");

  // Determine candidate columns
  const numericColumns = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    return columns.filter((col) => {
      return rows.some(
        (r) => r[col] !== null && r[col] !== undefined && !Number.isNaN(Number(r[col]))
      );
    });
  }, [columns, rows]);

  const [xAxisCol, setXAxisCol] = useState<string>(columns[0] || "");
  const [yAxisCol, setYAxisCol] = useState<string>(
    numericColumns[0] || columns[1] || columns[0] || ""
  );

  const chartData = useMemo(() => {
    return rows.slice(0, 50).map((r, i) => {
      const xVal = r[xAxisCol] !== null && r[xAxisCol] !== undefined ? String(r[xAxisCol]) : `Row ${i + 1}`;
      const yVal = Number(r[yAxisCol]) || 0;
      return {
        name: xVal.length > 20 ? `${xVal.substring(0, 17)}...` : xVal,
        [yAxisCol]: yVal,
      };
    });
  }, [rows, xAxisCol, yAxisCol]);

  if (!isOpen) return null;

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-150">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Header Modal */}
        <div className="flex shrink-0 items-center justify-between border-border border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
              <BarChart3 size={15} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                Visualisasi Grafik Hasil Query:{" "}
                <span className="font-mono text-emerald-500">`{tableName}`</span>
              </h3>
              <p className="text-[11px] text-muted-foreground/70">
                Pilih sumbu data untuk menganalisis data secara visual
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

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-border border-b bg-card px-4 py-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Sumbu X (Label):</span>
              <select
                className="h-7 rounded border border-border bg-muted/30 px-2 font-mono text-[11px] text-foreground focus:outline-none"
                onChange={(e) => setXAxisCol(e.target.value)}
                value={xAxisCol}
              >
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Sumbu Y (Nilai):</span>
              <select
                className="h-7 rounded border border-border bg-muted/30 px-2 font-mono text-[11px] text-foreground focus:outline-none"
                onChange={(e) => setYAxisCol(e.target.value)}
                value={yAxisCol}
              >
                {numericColumns.length > 0 ? (
                  numericColumns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                ) : (
                  columns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              className="h-7 text-xs cursor-pointer"
              onClick={() => setChartType("bar")}
              size="sm"
              variant={chartType === "bar" ? "default" : "outline"}
            >
              <BarChart3 className="mr-1" size={12} />
              Bar
            </Button>
            <Button
              className="h-7 text-xs cursor-pointer"
              onClick={() => setChartType("line")}
              size="sm"
              variant={chartType === "line" ? "default" : "outline"}
            >
              <LineChartIcon className="mr-1" size={12} />
              Line
            </Button>
            <Button
              className="h-7 text-xs cursor-pointer"
              onClick={() => setChartType("area")}
              size="sm"
              variant={chartType === "area" ? "default" : "outline"}
            >
              <PieChartIcon className="mr-1" size={12} />
              Area
            </Button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="flex-1 p-4 min-h-[360px] bg-background">
          {rows.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
              Tidak ada baris data untuk divisualisasikan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              {chartType === "bar" ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
                  <Bar dataKey={yAxisCol} fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
                  <Line type="monotone" dataKey={yAxisCol} stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
                  <Area type="monotone" dataKey={yAxisCol} stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-border border-t bg-muted/40 px-4 py-3">
          <span className="text-[11px] text-muted-foreground/70">
            Menampilkan hingga 50 baris pertama untuk visualisasi optimal
          </span>
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
