"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DEFAULT_NAMES = ["Phat", "Player 2", "Player 3", "Player 4"];
const SEED_ROWS = 8;
const STORAGE_KEY = "skyjo-v1";
const DANGER = 100;
const CHART_COLORS = [
  "#3b82f6",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#a855f7",
  "#ec4899",
];
const BEST_OF_OPTIONS = [3, 5, 7] as const;

type Cell = number | "";

function makeRow(n: number): Cell[] {
  return Array<Cell>(n).fill("");
}

// Color a Skyjo card value: negative = great, high positive = bad
function cellClass(v: number): string {
  if (v <= 0) return "text-green-600 dark:text-green-400 font-semibold";
  if (v <= 5) return "text-foreground";
  if (v <= 9) return "text-orange-500 font-semibold";
  return "text-red-500 font-semibold";
}

const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export default function SkyjoPage() {
  const [players, setPlayers] = useState<string[]>(DEFAULT_NAMES);
  const [rows, setRows] = useState<Cell[][]>(() =>
    Array(SEED_ROWS)
      .fill(null)
      .map(() => makeRow(DEFAULT_NAMES.length)),
  );
  const [bestOf, setBestOf] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const screenshotRef = useRef<HTMLDivElement>(null);

  // ── localStorage ──────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { players: p, rows: r, bestOf: b } = JSON.parse(saved);
        if (Array.isArray(p) && Array.isArray(r)) {
          setPlayers(p);
          setRows(r);
          if (typeof b === "number" || b === null) setBestOf(b);
        }
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ players, rows, bestOf }),
    );
  }, [players, rows, bestOf]);

  // ── computed ──────────────────────────────────────────────────────────────

  const rowSum = (row: Cell[]) =>
    row.reduce<number>((s, c) => s + (c === "" ? 0 : (c as number)), 0);

  const colSum = (ci: number) =>
    rows.reduce<number>(
      (s, row) => s + (row[ci] === "" ? 0 : (row[ci] as number)),
      0,
    );

  const colTotals = players.map((_, ci) => colSum(ci));

  const activeCols = players
    .map((_, ci) => ci)
    .filter((ci) => rows.some((r) => r[ci] !== ""));

  // Ranking: sorted ascending (lower total = better rank)
  const rankings = (() => {
    if (activeCols.length === 0) return [];
    const entries = activeCols
      .map((ci) => ({ ci, total: colTotals[ci] }))
      .sort((a, b) => a.total - b.total);
    let rank = 1;
    return entries.map((entry, i) => {
      if (i > 0 && entry.total !== entries[i - 1].total) rank = i + 1;
      return { ...entry, rank };
    });
  })();

  const getRank = (ci: number) =>
    rankings.find((r) => r.ci === ci)?.rank ?? null;
  const worstRank = rankings.length
    ? Math.max(...rankings.map((r) => r.rank))
    : 0;

  const isLeader = (ci: number) => getRank(ci) === 1;
  const filledRounds = rows.filter((r) => r.some((c) => c !== "")).length;
  const gameOver = colTotals.some((t) => t >= DANGER);
  const seriesComplete = bestOf !== null && filledRounds >= bestOf;

  // ── mutations ─────────────────────────────────────────────────────────────

  const updateCell = (ri: number, ci: number, raw: string) => {
    const val: Cell = raw === "" ? "" : isNaN(Number(raw)) ? "" : Number(raw);
    setRows((prev) =>
      prev.map((r, i) =>
        i === ri ? r.map((c, j) => (j === ci ? val : c)) : r,
      ),
    );
  };

  const updatePlayer = (i: number, name: string) =>
    setPlayers((prev) => prev.map((p, j) => (j === i ? name : p)));

  const addPlayer = () => {
    const n = players.length + 1;
    setPlayers((prev) => [...prev, `Player ${n}`]);
    setRows((prev) => prev.map((r) => [...r, ""]));
  };

  const removePlayer = (ci: number) => {
    if (players.length <= 1) return;
    setPlayers((prev) => prev.filter((_, i) => i !== ci));
    setRows((prev) => prev.map((r) => r.filter((_, i) => i !== ci)));
  };

  const addRow = () => setRows((prev) => [...prev, makeRow(players.length)]);

  const removeRow = (ri: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== ri));
  };

  const clearAll = () => {
    setRows(
      Array(SEED_ROWS)
        .fill(null)
        .map(() => makeRow(players.length)),
    );
  };

  // ── export ────────────────────────────────────────────────────────────────

  const copySlack = async () => {
    const now = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const colW = Math.max(6, ...players.map((p) => p.length));
    const numW = Math.max(3, String(rows.length).length + 1);
    const fmt = (v: Cell | string, w: number, right = true) =>
      right ? String(v).padStart(w) : String(v).padEnd(w);

    const sep = [
      "─".repeat(numW),
      ...players.map(() => "─".repeat(colW)),
      "───",
    ].join("─┼─");

    const header = [
      fmt("#", numW),
      ...players.map((p) => fmt(p, colW, false)),
      fmt("Σ", 3),
    ].join(" │ ");

    const dataLines = rows.map((row, ri) => {
      const anyFilled = row.some((c) => c !== "");
      const sum = rowSum(row);
      const cells = row.map((c) =>
        c === "" ? " ".repeat(colW) : fmt(String(c), colW),
      );
      const sumStr = anyFilled ? fmt(String(sum), 3) : "   ";
      return [fmt(ri + 1, numW), ...cells, sumStr].join(" │ ");
    });

    const totalCells = colTotals.map((t) => fmt(String(t), colW));
    const totalLine = [fmt("Σ", numW), ...totalCells, "   "].join(" │ ");

    // Ranking lines
    const rankLines = rankings
      .map(({ ci, total, rank }) => {
        const isLast = rank === worstRank;
        const tag = rank === 1 ? " ← trả sau" : isLast ? " ← trả trước" : "";
        return `${rank}. ${players[ci].padEnd(colW)} ${String(total).padStart(4)}${tag}`;
      })
      .join("\n");

    const label = bestOf ? `Skyjo (best of ${bestOf})` : "Skyjo";
    const table = [header, sep, ...dataLines, sep, totalLine].join("\n");
    const text =
      "```\n" +
      label +
      " — " +
      now +
      "\n" +
      table +
      "\n\nXếp hạng:\n" +
      rankLines +
      "\n```";

    await navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const takeScreenshot = async () => {
    if (!screenshotRef.current) return;
    const { toPng } = await import("html-to-image");
    const url = await toPng(screenshotRef.current, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      style: { padding: "16px" },
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = `skyjo-${Date.now()}.png`;
    a.click();
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen p-4">
      <Link
        href="/"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground inline-block mb-4"
      >
        ← Home
      </Link>

      <div ref={screenshotRef}>
        {/* ── title + best-of selector ── */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h1 className="text-2xl font-bold">Skyjo 🎴</h1>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-muted-foreground mr-1">Best of</span>
            {BEST_OF_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setBestOf(bestOf === n ? null : n)}
                className={[
                  "w-7 h-7 rounded text-xs font-semibold transition-colors",
                  bestOf === n
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground",
                ].join(" ")}
              >
                {n}
              </button>
            ))}
          </div>
          {bestOf && (
            <span className="text-sm text-muted-foreground">
              Ván{" "}
              <span
                className={
                  seriesComplete ? "text-green-600 font-bold" : "font-semibold"
                }
              >
                {Math.min(filledRounds, bestOf)}
              </span>
              /{bestOf}
            </span>
          )}
        </div>

        {/* banners */}
        {seriesComplete && (
          <div className="mb-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-3 py-2 text-sm text-green-700 dark:text-green-400">
            🏁 Đủ {bestOf} ván — xem bảng xếp hạng bên dưới.
          </div>
        )}
        {!seriesComplete && gameOver && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400">
            💀 Ai đó đã vượt {DANGER} — kết thúc vòng này rồi tính điểm cuối.
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm border-collapse">
            {/* ── header ── */}
            <thead>
              <tr className="bg-muted/50">
                <th className="w-9 text-center text-xs text-muted-foreground font-normal border-b border-r border-border py-2">
                  #
                </th>
                {players.map((name, i) => (
                  <th
                    key={i}
                    className={[
                      "border-b border-r border-border px-1 py-1 min-w-[80px] group/col",
                      isLeader(i) ? "bg-yellow-50 dark:bg-yellow-900/20" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isLeader(i) && (
                        <span className="text-xs leading-none">👑</span>
                      )}
                      <input
                        value={name}
                        onChange={(e) => updatePlayer(i, e.target.value)}
                        className="w-full text-center font-semibold text-sm bg-transparent outline-none focus:bg-background rounded px-1 py-0.5"
                      />
                      <button
                        onClick={() => removePlayer(i)}
                        title="Xoá người chơi"
                        className="text-transparent group-hover/col:text-muted-foreground/40 hover:!text-red-500 text-xs leading-none transition-colors shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
                <th className="w-10 text-center text-xs text-muted-foreground font-normal border-b border-border py-2">
                  Σ
                </th>
                <th className="w-7 border-b border-border" />
              </tr>
            </thead>

            {/* ── body ── */}
            <tbody>
              {rows.map((row, ri) => {
                const anyFilled = row.some((c) => c !== "");
                const sum = rowSum(row);
                const dimmed = bestOf !== null && ri >= bestOf;

                return (
                  <tr
                    key={ri}
                    className={[
                      "group hover:bg-muted/20",
                      dimmed ? "opacity-40" : "",
                    ].join(" ")}
                  >
                    <td className="text-center text-xs text-muted-foreground border-r border-border py-0 select-none">
                      {ri + 1}
                    </td>

                    {row.map((cell, ci) => (
                      <td key={ci} className="border-r border-border p-0">
                        <input
                          type="number"
                          value={cell === "" ? "" : cell}
                          onChange={(e) => updateCell(ri, ci, e.target.value)}
                          className={[
                            "w-full text-center py-2 px-1 bg-transparent outline-none focus:bg-muted/50",
                            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                            cell === "" ? "" : cellClass(cell as number),
                          ].join(" ")}
                        />
                      </td>
                    ))}

                    <td className="text-center text-xs font-medium px-1 border-r border-border text-muted-foreground">
                      {anyFilled ? sum : ""}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => removeRow(ri)}
                        className="text-transparent group-hover:text-muted-foreground/40 hover:!text-red-500 px-1.5 py-1 text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* ── footer: rank + totals ── */}
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="text-center text-xs text-muted-foreground font-semibold py-2 border-r border-border select-none">
                  Σ
                </td>
                {players.map((_, ci) => {
                  const total = colTotals[ci];
                  const rank = getRank(ci);
                  const danger = total >= DANGER;
                  const last = rank === worstRank && worstRank > 0;
                  return (
                    <td
                      key={ci}
                      className={[
                        "text-center border-r border-border py-1.5",
                        danger
                          ? "bg-red-50 dark:bg-red-900/20"
                          : isLeader(ci)
                            ? "bg-yellow-50/50 dark:bg-yellow-900/10"
                            : "",
                      ].join(" ")}
                    >
                      {rank !== null && (
                        <div
                          className={[
                            "text-[10px] font-bold leading-none mb-0.5",
                            rank === 1
                              ? "text-green-600 dark:text-green-400"
                              : last
                                ? "text-red-500"
                                : "text-muted-foreground",
                          ].join(" ")}
                        >
                          {ORDINAL[rank] ?? `#${rank}`}
                        </div>
                      )}
                      <div
                        className={[
                          "text-sm font-bold",
                          danger
                            ? "text-red-500"
                            : rank === 1
                              ? "text-green-600 dark:text-green-400"
                              : last
                                ? "text-red-500"
                                : "text-foreground",
                        ].join(" ")}
                      >
                        {activeCols.includes(ci)
                          ? danger
                            ? `💀 ${total}`
                            : total
                          : ""}
                      </div>
                    </td>
                  );
                })}
                <td className="border-r border-border" />
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ── live ranking panel ── */}
        {rankings.length > 0 && (
          <div className="mt-4 rounded-xl border border-border overflow-hidden">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border bg-muted/30">
              Xếp hạng
            </div>
            <div className="divide-y divide-border">
              {rankings.map(({ ci, total, rank }) => {
                const isFirst = rank === 1;
                const isLast = rank === worstRank;
                return (
                  <div
                    key={ci}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5",
                      isFirst ? "bg-yellow-50/60 dark:bg-yellow-900/10" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-sm font-bold w-8 shrink-0",
                        isFirst
                          ? "text-green-600 dark:text-green-400"
                          : isLast
                            ? "text-red-500"
                            : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {ORDINAL[rank] ?? `#${rank}`}
                    </span>
                    <span className="flex-1 text-sm font-medium">
                      {players[ci]}
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── cumulative score chart ── */}
        {(() => {
          const chartRows = rows.filter((row) => row.some((c) => c !== ""));
          if (chartRows.length < 2) return null;

          const W = 500,
            H = 130;
          const pad = { top: 16, right: 72, bottom: 24, left: 36 };
          const plotW = W - pad.left - pad.right;
          const plotH = H - pad.top - pad.bottom;

          const series = players.map((_, ci) => {
            let sum = 0;
            return chartRows.map((row) => {
              sum += row[ci] === "" ? 0 : (row[ci] as number);
              return sum;
            });
          });

          const allVals = [0, DANGER, ...series.flat()];
          const yMin = Math.min(...allVals);
          const yMax = Math.max(...allVals);
          const yRange = yMax - yMin || 1;

          const xScale = (i: number) =>
            pad.left + (i / (chartRows.length - 1)) * plotW;
          const yScale = (v: number) =>
            pad.top + plotH - ((v - yMin) / yRange) * plotH;
          const y100 = yScale(DANGER);

          const yTicks = [...new Set([0, DANGER])].filter(
            (v) => v >= yMin && v <= yMax,
          );

          return (
            <div className="mt-4 rounded-xl border border-border overflow-hidden">
              <div className="px-3 py-2 text-xs text-muted-foreground font-medium border-b border-border bg-muted/30">
                Điểm tích luỹ
              </div>
              <div className="px-2 pt-1 pb-2">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full"
                  style={{ height: 130 }}
                >
                  {yTicks.map((v) => (
                    <g key={v}>
                      <line
                        x1={pad.left}
                        y1={yScale(v)}
                        x2={pad.left + plotW}
                        y2={yScale(v)}
                        stroke={v === DANGER ? "#ef4444" : "currentColor"}
                        strokeOpacity={v === DANGER ? 0.4 : 0.15}
                        strokeWidth={1}
                        strokeDasharray="4 3"
                      />
                      <text
                        x={pad.left - 4}
                        y={yScale(v) + 4}
                        textAnchor="end"
                        fontSize={9}
                        fill={v === DANGER ? "#ef4444" : "currentColor"}
                        fillOpacity={v === DANGER ? 0.7 : 0.4}
                      >
                        {v}
                      </text>
                    </g>
                  ))}

                  {y100 > pad.top && (
                    <rect
                      x={pad.left}
                      y={pad.top}
                      width={plotW}
                      height={y100 - pad.top}
                      fill="#ef4444"
                      fillOpacity={0.04}
                    />
                  )}

                  {series.map((data, ci) => {
                    const color = CHART_COLORS[ci % CHART_COLORS.length];
                    const pts = data
                      .map((v, i) => `${xScale(i)},${yScale(v)}`)
                      .join(" ");
                    const last = data[data.length - 1];
                    const lx = xScale(data.length - 1);
                    const ly = yScale(last);
                    const label =
                      players[ci].length > 8
                        ? players[ci].slice(0, 7) + "…"
                        : players[ci];
                    return (
                      <g key={ci}>
                        <polyline
                          points={pts}
                          fill="none"
                          stroke={color}
                          strokeWidth={2}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                        {data.map((v, i) => (
                          <circle
                            key={i}
                            cx={xScale(i)}
                            cy={yScale(v)}
                            r={3}
                            fill={color}
                          />
                        ))}
                        <text
                          x={lx + 7}
                          y={ly - 3}
                          fontSize={8}
                          fill={color}
                          fontWeight="500"
                        >
                          {label}
                        </text>
                        <text
                          x={lx + 7}
                          y={ly + 8}
                          fontSize={9}
                          fill={color}
                          fontWeight="700"
                        >
                          {last}
                        </text>
                      </g>
                    );
                  })}

                  {chartRows.map((_, i) => (
                    <text
                      key={i}
                      x={xScale(i)}
                      y={H - 5}
                      textAnchor="middle"
                      fontSize={8}
                      fill="currentColor"
                      fillOpacity={0.35}
                    >
                      {i + 1}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── action bar ── */}
      <div className="mt-3 flex gap-2 flex-wrap">
        <Button variant="outline" onClick={addRow}>
          🀄️ Thêm Ván
        </Button>
        <Button variant="outline" onClick={addPlayer}>
          👤 Thêm Người
        </Button>
        <Button
          variant="outline"
          onClick={copySlack}
          className={copyFeedback ? "text-green-600" : "text-muted-foreground"}
        >
          {copyFeedback ? "Đã copy!" : "📋 Slack"}
        </Button>
        <Button
          variant="outline"
          onClick={takeScreenshot}
          className="text-muted-foreground"
        >
          📷 Hình
        </Button>
        <Button
          variant="outline"
          onClick={clearAll}
          className="text-muted-foreground"
        >
          🗑️ Xoá hết
        </Button>
      </div>
    </main>
  );
}
