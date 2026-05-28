"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DEFAULT_NAMES = ["Phat", "Player 2", "Player 3", "Player 4"];
const CHART_COLORS = [
  "#3b82f6",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#a855f7",
  "#ec4899",
];
const SEED_ROWS = 10;
const STORAGE_KEY = "tienlen-v1";

type Cell = number | "";

function makeRow(n: number): Cell[] {
  return Array<Cell>(n).fill("");
}

// Balanced scores for n players: [half, ..., 1, (0 if odd), -1, ..., -half]
// n=4 → [2,1,-1,-2]  n=3 → [1,0,-1]  n=5 → [2,1,0,-1,-2]
function rankScores(n: number): number[] {
  const half = Math.floor(n / 2);
  const s: number[] = [];
  for (let i = half; i >= 1; i--) s.push(i);
  if (n % 2 === 1) s.push(0);
  for (let i = 1; i <= half; i++) s.push(-i);
  return s;
}

export default function TienLenPage() {
  const [players, setPlayers] = useState<string[]>(DEFAULT_NAMES);
  const [rows, setRows] = useState<Cell[][]>(() =>
    Array(SEED_ROWS)
      .fill(null)
      .map(() => makeRow(DEFAULT_NAMES.length)),
  );
  // rankingRow: which row is in rank-assignment mode (null = none)
  // rankOrder: player index → assigned finish position (1-based), null = not yet picked
  const [rankingRow, setRankingRow] = useState<number | null>(null);
  const [rankOrder, setRankOrder] = useState<(number | null)[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [focusedPlayer, setFocusedPlayer] = useState<number | null>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);

  // ── localStorage ──────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { players: p, rows: r } = JSON.parse(saved);
        if (Array.isArray(p) && Array.isArray(r)) {
          setPlayers(p);
          setRows(r);
        }
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, rows }));
  }, [players, rows]);

  // ── computed ──────────────────────────────────────────────────────────────

  const rowSum = (row: Cell[]) =>
    row.reduce<number>((s, c) => s + (c === "" ? 0 : (c as number)), 0);

  const colSum = (ci: number) =>
    rows.reduce<number>(
      (s, row) => s + (row[ci] === "" ? 0 : (row[ci] as number)),
      0,
    );

  const colTotals = players.map((_, ci) => colSum(ci));
  const maxTotal = colTotals.length ? Math.max(...colTotals) : 0;
  const grandTotal = colTotals.reduce((s, t) => s + t, 0);

  // Leader = player(s) with the highest positive total
  const isLeader = (ci: number) => maxTotal > 0 && colTotals[ci] === maxTotal;

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
    // Append an empty cell to every existing row
    setRows((prev) => prev.map((r) => [...r, ""]));
  };

  const removePlayer = (ci: number) => {
    if (players.length <= 1) return;
    setPlayers((prev) => prev.filter((_, i) => i !== ci));
    setRows((prev) => prev.map((r) => r.filter((_, i) => i !== ci)));
    setRankingRow(null);
  };

  const addRow = () => setRows((prev) => [...prev, makeRow(players.length)]);

  const removeRow = (ri: number) => {
    if (rows.length <= 1) return;
    if (rankingRow === ri) setRankingRow(null);
    setRows((prev) => prev.filter((_, i) => i !== ri));
  };

  const clearAll = () => {
    setRankingRow(null);
    setRows(
      Array(SEED_ROWS)
        .fill(null)
        .map(() => makeRow(players.length)),
    );
  };

  // ── quick rank ────────────────────────────────────────────────────────────

  const startRanking = (ri: number) => {
    setRankingRow(ri);
    setRankOrder(Array(players.length).fill(null));
  };

  const cancelRanking = () => setRankingRow(null);

  const pickRank = (ci: number, rank: number) => {
    const next = rankOrder.map((r, i) => {
      if (i === ci) return rank; // assign rank to this player
      if (r === rank) return null; // un-assign same rank from whoever had it
      return r;
    });

    // When all players have a rank, auto-fill scores and exit ranking mode
    if (next.every((r) => r !== null)) {
      const scores = rankScores(players.length);
      setRows((prev) =>
        prev.map((row, i) =>
          i === rankingRow
            ? row.map((_, j) => scores[(next[j] as number) - 1])
            : row,
        ),
      );
      setRankingRow(null);
    } else {
      setRankOrder(next);
    }
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

    const fmt = (v: Cell | string, w: number, right = true) => {
      const s = String(v);
      return right ? s.padStart(w) : s.padEnd(w);
    };

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
        c === ""
          ? " ".repeat(colW)
          : fmt((c as number) > 0 ? `+${c}` : String(c), colW),
      );
      const sumStr = anyFilled
        ? fmt(sum > 0 ? `+${sum}` : String(sum), 3)
        : "   ";
      return [fmt(ri + 1, numW), ...cells, sumStr].join(" │ ");
    });

    const totalCells = colTotals.map((t) =>
      fmt(t > 0 ? `+${t}` : String(t), colW),
    );
    const gtStr = fmt(
      grandTotal === 0
        ? "✓"
        : grandTotal > 0
          ? `+${grandTotal}`
          : String(grandTotal),
      3,
    );
    const totalLine = [fmt("Σ", numW), ...totalCells, gtStr].join(" │ ");

    const table = [header, sep, ...dataLines, sep, totalLine].join("\n");
    const text = "```\nTiến Lên — " + now + "\n" + table + "\n```";

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
    a.download = `tienlen-${Date.now()}.png`;
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

      {/* screenshotRef wraps title + table so the PNG looks self-contained */}
      <div ref={screenshotRef}>
        <h1 className="text-2xl font-bold mb-6">Tiến Lên 🃏</h1>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm border-collapse">
            {/* ── header: editable player names ── */}
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

            {/* ── body: score rows ── */}
            <tbody>
              {rows.map((row, ri) => {
                const sum = rowSum(row);
                const anyFilled = row.some((c) => c !== "");
                const isInvalid = anyFilled && sum !== 0;
                const isRanking = rankingRow === ri;

                return (
                  <tr key={ri} className="group hover:bg-muted/20">
                    {/* row number — click to enter quick-rank mode */}
                    <td className="text-center text-xs text-muted-foreground border-r border-border py-0 select-none">
                      {isRanking ? (
                        <button
                          onClick={cancelRanking}
                          title="Huỷ xếp hạng"
                          className="text-red-400 hover:text-red-600 px-1.5 py-1 text-xs"
                        >
                          ✕
                        </button>
                      ) : (
                        <button
                          onClick={() => startRanking(ri)}
                          title="Xếp hạng nhanh"
                          className="text-muted-foreground/50 hover:text-foreground px-1.5 py-1 text-xs transition-colors"
                        >
                          {ri + 1}
                        </button>
                      )}
                    </td>

                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={[
                          "border-r border-border p-0",
                          isLeader(ci)
                            ? "bg-yellow-50/50 dark:bg-yellow-900/10"
                            : "",
                        ].join(" ")}
                      >
                        {isRanking ? (
                          /* rank picker: buttons 1..n, one per finish position */
                          <div className="flex justify-center gap-0.5 py-1 px-0.5">
                            {Array.from(
                              { length: players.length },
                              (_, k) => k + 1,
                            ).map((rank) => {
                              const takenByOther = rankOrder.some(
                                (r, idx) => r === rank && idx !== ci,
                              );
                              const selected = rankOrder[ci] === rank;
                              return (
                                <button
                                  key={rank}
                                  onClick={() =>
                                    !takenByOther && pickRank(ci, rank)
                                  }
                                  className={[
                                    "w-6 h-6 rounded text-xs font-medium transition-colors",
                                    selected
                                      ? "bg-primary text-primary-foreground"
                                      : takenByOther
                                        ? "opacity-25 cursor-not-allowed text-muted-foreground"
                                        : "bg-muted hover:bg-muted/80 text-foreground",
                                  ].join(" ")}
                                >
                                  {rank}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <input
                            type="number"
                            value={cell === "" ? "" : cell}
                            onChange={(e) => updateCell(ri, ci, e.target.value)}
                            className={[
                              "w-full text-center py-2 px-1 bg-transparent outline-none focus:bg-muted/50",
                              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                              cell === ""
                                ? ""
                                : (cell as number) > 0
                                  ? "text-green-600 dark:text-green-400 font-semibold"
                                  : (cell as number) < 0
                                    ? "text-red-500 font-semibold"
                                    : "text-muted-foreground",
                            ].join(" ")}
                          />
                        )}
                      </td>
                    ))}

                    {/* row sum — red when entries don't balance to 0 */}
                    <td
                      className={[
                        "text-center text-xs font-medium px-1 border-r border-border",
                        !anyFilled
                          ? "text-transparent select-none"
                          : isInvalid
                            ? "text-red-500 font-bold"
                            : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {anyFilled ? sum : "—"}
                    </td>

                    {/* delete row — only visible on hover */}
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

            {/* ── footer: column totals ── */}
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="text-center text-xs text-muted-foreground font-semibold py-2 border-r border-border select-none">
                  Σ
                </td>
                {players.map((_, ci) => {
                  const total = colTotals[ci];
                  return (
                    <td
                      key={ci}
                      className={[
                        "text-center py-2 font-bold border-r border-border",
                        isLeader(ci)
                          ? "bg-yellow-50/50 dark:bg-yellow-900/10"
                          : "",
                        total > 0
                          ? "text-green-600 dark:text-green-400"
                          : total < 0
                            ? "text-red-500"
                            : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {total > 0 ? `+${total}` : total}
                    </td>
                  );
                })}
                <td
                  title={
                    grandTotal === 0 ? "Tổng hợp lệ" : "Tổng ≠ 0 — kiểm tra lại"
                  }
                  className={[
                    "text-center text-xs font-bold py-2 border-r border-border",
                    grandTotal === 0 ? "text-muted-foreground" : "text-red-500",
                  ].join(" ")}
                >
                  {grandTotal === 0 ? "✓" : grandTotal}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ── cumulative score chart ── */}
        {(() => {
          const chartRows = rows.filter((row) => row.some((c) => c !== ""));
          if (chartRows.length < 2) return null;

          const W = 560,
            H = 260;
          const pad = { top: 24, right: 90, bottom: 32, left: 44 };
          const plotW = W - pad.left - pad.right;
          const plotH = H - pad.top - pad.bottom;

          // Cumulative score per player at each filled round
          const series = players.map((_, ci) => {
            let sum = 0;
            return chartRows.map((row) => {
              sum += row[ci] === "" ? 0 : (row[ci] as number);
              return sum;
            });
          });

          const allVals = [0, ...series.flat()];
          const yMin = Math.min(...allVals);
          const yMax = Math.max(...allVals);
          const yRange = yMax - yMin || 1;

          const xScale = (i: number) =>
            pad.left + (i / (chartRows.length - 1)) * plotW;
          const yScale = (v: number) =>
            pad.top + plotH - ((v - yMin) / yRange) * plotH;

          // Y axis ticks: min, 0, max (skip duplicates)
          const yTicks = [...new Set([yMin, 0, yMax])];

          // De-collide right-side labels: sort by natural y, then push apart
          const MIN_GAP = 22;
          const labelPositions = series
            .map((data, ci) => ({
              ci,
              naturalY: yScale(data[data.length - 1]),
              adjustedY: yScale(data[data.length - 1]),
            }))
            .sort((a, b) => a.naturalY - b.naturalY);

          for (let i = 1; i < labelPositions.length; i++) {
            const prev = labelPositions[i - 1];
            const curr = labelPositions[i];
            if (curr.adjustedY - prev.adjustedY < MIN_GAP) {
              curr.adjustedY = prev.adjustedY + MIN_GAP;
            }
          }
          // If pushed beyond bottom, pull everything up
          const lastLabel = labelPositions[labelPositions.length - 1];
          const overflow = lastLabel.adjustedY - (pad.top + plotH + 4);
          if (overflow > 0) {
            labelPositions.forEach((lp) => (lp.adjustedY -= overflow));
          }
          const labelY: Record<number, number> = {};
          labelPositions.forEach(({ ci, adjustedY }) => {
            labelY[ci] = adjustedY;
          });

          return (
            <div className="mt-4 rounded-xl border border-border overflow-hidden">
              <div className="px-3 py-2 text-sm text-muted-foreground font-medium border-b border-border bg-muted/30">
                Điểm
              </div>
              <div className="px-3 py-2 flex gap-2 flex-wrap border-b border-border">
                {players.map((name, ci) => {
                  const color = CHART_COLORS[ci % CHART_COLORS.length];
                  const active = focusedPlayer === ci;
                  return (
                    <button
                      key={ci}
                      onClick={() => setFocusedPlayer(active ? null : ci)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all"
                      style={{
                        backgroundColor: active ? color : "transparent",
                        color: active ? "#fff" : color,
                        border: `2px solid ${color}`,
                        opacity: focusedPlayer !== null && !active ? 0.35 : 1,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: active ? "#fff" : color }}
                      />
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="px-2 pt-2 pb-2">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full"
                  style={{ height: 260 }}
                >
                  {/* y-axis ticks */}
                  {yTicks.map((v) => (
                    <g key={v}>
                      <line
                        x1={pad.left}
                        y1={yScale(v)}
                        x2={pad.left + plotW}
                        y2={yScale(v)}
                        stroke="currentColor"
                        strokeOpacity={v === 0 ? 0.25 : 0.1}
                        strokeWidth={1}
                        strokeDasharray={v === 0 ? "4 3" : "2 4"}
                      />
                      <text
                        x={pad.left - 6}
                        y={yScale(v) + 4}
                        textAnchor="end"
                        fontSize={11}
                        fill="currentColor"
                        fillOpacity={0.45}
                      >
                        {v > 0 ? `+${v}` : v}
                      </text>
                    </g>
                  ))}

                  {/* player lines — dimmed first, focused on top */}
                  {[...series.keys()]
                    .sort((a, b) =>
                      focusedPlayer === null
                        ? 0
                        : a === focusedPlayer
                          ? 1
                          : b === focusedPlayer
                            ? -1
                            : 0,
                    )
                    .map((ci) => {
                      const data = series[ci];
                      const color = CHART_COLORS[ci % CHART_COLORS.length];
                      const isFocused =
                        focusedPlayer === null || focusedPlayer === ci;
                      const opacity = isFocused ? 1 : 0.12;
                      const pts = data
                        .map((v, i) => `${xScale(i)},${yScale(v)}`)
                        .join(" ");
                      const last = data[data.length - 1];
                      const lx = xScale(data.length - 1);
                      const ly = yScale(last);
                      const labelYPos = labelY[ci];
                      const label =
                        players[ci].length > 10
                          ? players[ci].slice(0, 9) + "…"
                          : players[ci];
                      return (
                        <g
                          key={ci}
                          style={{ opacity, transition: "opacity 0.2s" }}
                        >
                          <polyline
                            points={pts}
                            fill="none"
                            stroke={color}
                            strokeWidth={
                              isFocused && focusedPlayer !== null ? 3 : 2.5
                            }
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          {data.map((v, i) => (
                            <circle
                              key={i}
                              cx={xScale(i)}
                              cy={yScale(v)}
                              r={isFocused && focusedPlayer !== null ? 5 : 4}
                              fill={color}
                            />
                          ))}
                          {Math.abs(labelYPos - ly) > 4 && (
                            <line
                              x1={lx + 4}
                              y1={ly}
                              x2={lx + 8}
                              y2={labelYPos}
                              stroke={color}
                              strokeOpacity={0.35}
                              strokeWidth={1}
                            />
                          )}
                          <text
                            x={lx + 10}
                            y={labelYPos - 5}
                            fontSize={11}
                            fill={color}
                            fontWeight="500"
                          >
                            {label}
                          </text>
                          <text
                            x={lx + 10}
                            y={labelYPos + 9}
                            fontSize={12}
                            fill={color}
                            fontWeight="700"
                          >
                            {last > 0 ? `+${last}` : last}
                          </text>
                        </g>
                      );
                    })}

                  {/* x-axis round labels */}
                  {chartRows.map((_, i) => (
                    <text
                      key={i}
                      x={xScale(i)}
                      y={H - 8}
                      textAnchor="middle"
                      fontSize={11}
                      fill="currentColor"
                      fillOpacity={0.4}
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
