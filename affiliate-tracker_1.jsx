import { useState, useEffect, useRef } from "react";

// ── Utility helpers ────────────────────────────────────────────────────────
const fmt = (n, dec = 2) =>
  isFinite(n) && !isNaN(n) ? Number(n).toFixed(dec) : "--";
const fmtCurrency = (n) =>
  isFinite(n) && !isNaN(n)
    ? "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "--";

// ── Animated number ────────────────────────────────────────────────────────
const AnimNum = ({ value, prefix = "", suffix = "", decimals = 2 }) => {
  const [display, setDisplay] = useState(parseFloat(value) || 0);
  const rafRef = useRef();
  
  useEffect(() => {
    const start = display;
    const end = parseFloat(value) || 0;
    const dur = 700;
    const startTime = performance.now();
    
    const tick = (now) => {
      const t = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(start + (end - start) * ease);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);
  
  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: "#1a1a2e",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Sora', sans-serif",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  bgGradient: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg, #16213e 0%, #0f3460 50%, #1a1a2e 100%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    marginBottom: 40,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 8,
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #16f4d0 0%, #a8edea 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: 14,
    color: "#8892b0",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 24,
  },
  incomeCard: {
    background: "linear-gradient(135deg, #7b68ee 0%, #6a5acd 100%)",
    borderRadius: 24,
    padding: 40,
    boxShadow: "0 20px 60px rgba(123, 104, 238, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    gridColumn: "1 / -1",
  },
  incomeLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  incomeValue: {
    fontSize: 56,
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-2px",
    marginBottom: 12,
  },
  incomeDesc: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  counterGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  counterCard: (color, bgColor) => ({
    background: bgColor,
    borderRadius: 20,
    padding: 28,
    border: `1px solid ${color}20`,
    boxShadow: `0 10px 30px ${color}15`,
    backdropFilter: "blur(10px)",
  }),
  counterLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#8892b0",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  counterValue: (color) => ({
    fontSize: 42,
    fontWeight: 800,
    color,
    marginBottom: 8,
    letterSpacing: "-1px",
  }),
  counterMeta: {
    fontSize: 11,
    color: "#5a6b7a",
  },
  costCard: {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: 20,
    padding: 28,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
  platformsSection: {
    marginTop: 32,
  },
  platformLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#8892b0",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  platformGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 12,
  },
  platformBtn: (active) => ({
    background: active
      ? "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      : "rgba(255, 255, 255, 0.06)",
    border: active
      ? "1px solid rgba(255, 255, 255, 0.3)"
      : "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    padding: 16,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 700,
    color: active ? "#1a1a2e" : "#8892b0",
    transition: "all 0.3s ease",
    boxShadow: active ? "0 8px 24px rgba(168, 237, 234, 0.3)" : "none",
  }),
  platformIcon: {
    fontSize: 24,
  },
};

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
  const [income, setIncome] = useState(1080.10);
  const [approved, setApproved] = useState(37);
  const [rejected, setRejected] = useState(35);
  const [cost, setCost] = useState(12.04);

  const platforms = [
    { id: "youtube", label: "YouTube", icon: "📺" },
    { id: "facebook", label: "Facebook", icon: "f" },
    { id: "twitter", label: "Twitter", icon: "𝕏" },
    { id: "instagram", label: "Instagram", icon: "📷" },
    { id: "tiktok", label: "TikTok", icon: "🎵" },
  ];

  return (
    <div style={S.app}>
      <div style={S.bgGradient} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1a1a2e; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: rgba(168,237,234,0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(168,237,234,0.5); }
      `}</style>

      <div style={S.container}>
        {/* HEADER */}
        <div style={S.header}>
          <div style={S.title}>💰 Affiliate Pulse</div>
          <div style={S.subtitle}>Real-time performance tracking for your campaigns</div>
        </div>

        {/* MAIN METRICS */}
        <div style={S.mainGrid}>
          {/* INCOME CARD */}
          <div style={S.incomeCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 30px 80px rgba(123, 104, 238, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(123, 104, 238, 0.3)";
            }}>
            <div style={S.incomeLabel}>💸 Total Income</div>
            <div style={S.incomeValue}>
              $<AnimNum value={income} decimals={2} />
            </div>
            <div style={S.incomeDesc}>
              Earnings from approved leads and conversions
            </div>
          </div>

          {/* COUNTERS */}
          <div style={S.counterGrid}>
            {/* APPROVED COUNTER */}
            <div style={S.counterCard("#2ecc71", "rgba(46, 204, 113, 0.08)")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}>
              <div style={S.counterLabel}>✅ Approved Leads</div>
              <div style={S.counterValue("#2ecc71")}>
                <AnimNum value={approved} decimals={0} />
              </div>
              <div style={S.counterMeta}>
                {approved > 0 ? `${((approved / (approved + rejected)) * 100).toFixed(0)}% approval rate` : "No approvals yet"}
              </div>
            </div>

            {/* REJECTED COUNTER */}
            <div style={S.counterCard("#e74c3c", "rgba(231, 76, 60, 0.08)")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}>
              <div style={S.counterLabel}>❌ Rejected Leads</div>
              <div style={S.counterValue("#e74c3c")}>
                <AnimNum value={rejected} decimals={0} />
              </div>
              <div style={S.counterMeta}>
                {rejected > 0 ? `${((rejected / (approved + rejected)) * 100).toFixed(0)}% rejection rate` : "No rejections"}
              </div>
            </div>
          </div>

          {/* COST CARD */}
          <div style={S.costCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 16px 48px rgba(168, 237, 234, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
            }}>
            <div style={S.counterLabel}>💳 Campaign Cost</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#a8edea", marginBottom: 8 }}>
              $<AnimNum value={cost} decimals={2} />
            </div>
            <div style={S.counterMeta}>
              {income > 0 ? `ROI: ${((income / cost) * 100 - 100).toFixed(0)}%` : "Calculate ROI"}
            </div>
          </div>
        </div>

        {/* PLATFORM SELECTOR */}
        <div style={S.platformsSection}>
          <div style={S.platformLabel}>🌐 Select Platform</div>
          <div style={S.platformGrid}>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                style={S.platformBtn(selectedPlatform === platform.id)}
                onClick={() => setSelectedPlatform(platform.id)}
                onMouseEnter={(e) => {
                  if (selectedPlatform !== platform.id) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPlatform !== platform.id) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                  }
                }}>
                <div style={S.platformIcon}>{platform.icon}</div>
                <div>{platform.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ACCOUNT STATUS */}
        <div style={{
          marginTop: 32,
          padding: 24,
          background: "rgba(168, 237, 234, 0.08)",
          border: "1px solid rgba(168, 237, 234, 0.2)",
          borderRadius: 16,
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8892b0", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                📊 Account Status
              </div>
              <div style={{ fontSize: 14, color: "#e2e8f0" }}>
                Active · Platform: <strong style={{ color: "#a8edea" }}>{platforms.find(p => p.id === selectedPlatform)?.label}</strong>
              </div>
            </div>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#2ecc71",
              boxShadow: "0 0 8px #2ecc71",
              animation: "pulse 2s infinite",
            }} />
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
              <div style={S.cardGlow("251,146,60")} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={S.cardLabel}>💸 Spend</div>
                  <div style={{ ...S.cardValue("#fb923c") }}>
                    $<AnimNum value={current.spend} prefix="" decimals={2} />
                  </div>
                  <CompBadge cur={current.spend} prv={prev.spend} />
                </div>
                <div style={{ background: "rgba(251,146,60,0.12)", borderRadius: 12, padding: "10px 12px", fontSize: 20 }}>💸</div>
              </div>
            </div>

            {/* INCOME */}
            <div style={S.card("59,130,246")}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(59,130,246,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={S.cardGlow("59,130,246")} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={S.cardLabel}>💰 Income</div>
                  <div style={S.cardValue("#3b82f6")}>
                    $<AnimNum value={current.income} decimals={2} />
                  </div>
                  <CompBadge cur={current.income} prv={prev.income} />
                </div>
                <div style={{ background: "rgba(59,130,246,0.12)", borderRadius: 12, padding: "10px 12px", fontSize: 20 }}>💰</div>
              </div>
            </div>

            {/* PROFIT */}
            <div style={S.card("16,185,129")}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(16,185,129,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={S.cardGlow("16,185,129")} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={S.cardLabel}>📈 Profit</div>
                  <div style={S.cardValue(profitColor)}>
                    {metrics.profit < 0 ? "-$" : "$"}<AnimNum value={Math.abs(metrics.profit)} decimals={2} />
                  </div>
                  <CompBadge cur={metrics.profit} prv={prevMetrics.profit} />
                </div>
                <div style={{ background: "rgba(16,185,129,0.12)", borderRadius: 12, padding: "10px 12px", fontSize: 20 }}>📈</div>
              </div>
            </div>

            {/* ROI */}
            <div style={S.card("168,85,247")}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(168,85,247,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={S.cardGlow("168,85,247")} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={S.cardLabel}>🚀 ROI</div>
                  <div style={S.cardValue(roiColor)}>
                    {metrics.roi !== null ? <><AnimNum value={metrics.roi} decimals={2} />%</> : "--"}
                  </div>
                  <CompBadge cur={metrics.roi} prv={prevMetrics.roi} />
                </div>
                <div style={{ background: "rgba(168,85,247,0.12)", borderRadius: 12, padding: "10px 12px", fontSize: 20 }}>🚀</div>
              </div>
            </div>
          </div>

          {/* LEADS SECTION */}
          <div style={S.grid4}>
            {[
              { label: "Total Leads", val: current.totalLeads, icon: "👥", color: "148,163,184" },
              { label: "Approved", val: current.approved, icon: "✅", color: "16,185,129" },
              { label: "Hold", val: current.hold, icon: "⏳", color: "251,191,36" },
              { label: "Trash", val: current.trash, icon: "🗑️", color: "239,68,68" },
            ].map((item) => (
              <div key={item.label} style={S.card(item.color)}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
                <div style={S.cardGlow(item.color)} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={S.cardLabel}>{item.icon} {item.label}</div>
                    <div style={{ ...S.cardValue(`rgb(${item.color})`), fontSize: 32 }}>
                      <AnimNum value={item.val} decimals={0} />
                    </div>
                    {current.totalLeads > 0 && item.label !== "Total Leads" && (
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                        {((item.val / current.totalLeads) * 100).toFixed(1)}% of total
                      </div>
                    )}
                  </div>
                  <div style={{
                    width: 50, height: 50, borderRadius: "50%",
                    background: `rgba(${item.color},0.12)`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                  }}>{item.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* PERFORMANCE METRICS */}
          <div style={{ ...S.sectionTitle, marginBottom: 14 }}>
            <span>⚡ Performance Metrics</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "EPC", key: "epc", display: metrics.epc !== null ? "$" + fmt(metrics.epc) : "--", color: "59,130,246", icon: "🖱️", formula: "Income ÷ Clicks", prev: prevMetrics.epc },
              { label: "CR", key: "cr", display: metrics.cr !== null ? fmt(metrics.cr) + "%" : "--", color: "16,185,129", icon: "📊", formula: "Approved ÷ Leads × 100", prev: prevMetrics.cr },
              { label: "CPL", key: "cpl", display: metrics.cpl !== null ? "$" + fmt(metrics.cpl) : "--", color: "251,191,36", icon: "💡", formula: "Spend ÷ Total Leads", prev: prevMetrics.cpl },
              { label: "CPA", key: "cpa", display: metrics.cpa !== null ? "$" + fmt(metrics.cpa) : "--", color: "16,185,129", icon: "🎯", formula: "Spend ÷ Approved", prev: prevMetrics.cpa },
              { label: "CPH", key: "cph", display: metrics.cph !== null ? "$" + fmt(metrics.cph) : "--", color: "251,191,36", icon: "⏳", formula: "Spend ÷ Hold Leads", prev: prevMetrics.cph },
              { label: "CPT", key: "cpt", display: metrics.cpt !== null ? "$" + fmt(metrics.cpt) : "--", color: "239,68,68", icon: "🗑️", formula: "Spend ÷ Trash Leads", prev: prevMetrics.cpt },
            ].map((m) => (
              <MetricCard key={m.key} {...m} value={metrics[m.key]} />
            ))}
          </div>

          {/* INPUT SECTION */}
          <div style={S.inputCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={S.sectionTitle}>📝 Enter Daily Data</div>
                <div style={{ fontSize: 12, color: "#475569" }}>Editing: {editDate}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="date" value={editDate}
                  onChange={e => {
                    setEditDate(e.target.value);
                    const saved = allData[e.target.value] || EMPTY_DAY;
                    setForm({ ...EMPTY_DAY, ...saved });
                  }}
                  style={{ ...S.input, width: "auto", fontSize: 13 }} />
                <button className="save-btn" style={S.saveBtn} onClick={saveData}>
                  💾 Save Data
                </button>
              </div>
            </div>
            <div style={S.inputGrid}>
              {[
                { key: "spend", label: "💸 Spend ($)", placeholder: "0.00" },
                { key: "income", label: "💰 Income ($)", placeholder: "0.00" },
                { key: "clicks", label: "🖱️ Clicks", placeholder: "0" },
                { key: "totalLeads", label: "👥 Total Leads", placeholder: "0" },
                { key: "approved", label: "✅ Approved", placeholder: "0" },
                { key: "hold", label: "⏳ Hold", placeholder: "0" },
                { key: "trash", label: "🗑️ Trash", placeholder: "0" },
              ].map(f => (
                <div key={f.key} style={S.inputGroup}>
                  <label style={S.inputLabel}>{f.label}</label>
                  <input
                    type="number" min="0" step="any"
                    value={form[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={handleInput(f.key)}
                    style={S.input}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CHART */}
          <div style={S.chartCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={S.sectionTitle}>📈 Spend vs Income vs Profit</div>
                <div style={{ fontSize: 12, color: "#475569" }}>{filterLabel}</div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { color: "#fb923c", label: "Spend" },
                  { color: "#3b82f6", label: "Income" },
                  { color: "#10b981", label: "Profit" },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  {[
                    { id: "gSpend", color: "#fb923c" },
                    { id: "gIncome", color: "#3b82f6" },
                    { id: "gProfit", color: "#10b981" },
                  ].map(g => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={g.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Spend" stroke="#fb923c" strokeWidth={2} fill="url(#gSpend)" dot={false} activeDot={{ r: 5, fill: "#fb923c" }} />
                <Area type="monotone" dataKey="Income" stroke="#3b82f6" strokeWidth={2} fill="url(#gIncome)" dot={false} activeDot={{ r: 5, fill: "#3b82f6" }} />
                <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} fill="url(#gProfit)" dot={false} activeDot={{ r: 5, fill: "#10b981" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* SUMMARY ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={S.inputCard}>
              <div style={{ ...S.sectionTitle, marginBottom: 16 }}>📋 Quick Summary</div>
              {[
                { label: "Profit Margin", value: current.income > 0 ? fmt((metrics.profit / current.income) * 100) + "%" : "--", icon: "📊" },
                { label: "Approval Rate", value: current.totalLeads > 0 ? fmt((current.approved / current.totalLeads) * 100) + "%" : "--", icon: "✅" },
                { label: "Rejection Rate", value: current.totalLeads > 0 ? fmt((current.trash / current.totalLeads) * 100) + "%" : "--", icon: "🗑️" },
                { label: "Hold Rate", value: current.totalLeads > 0 ? fmt((current.hold / current.totalLeads) * 100) + "%" : "--", icon: "⏳" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{row.icon} {row.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{row.value}</div>
                </div>
              ))}
            </div>

            <div style={S.inputCard}>
              <div style={{ ...S.sectionTitle, marginBottom: 16 }}>📅 Recent Days</div>
              {rangeKeys(5).reverse().map(k => {
                const d = { ...EMPTY_DAY, ...(dataWithForm[k] || {}) };
                const p = d.income - d.spend;
                const hasData = d.spend > 0 || d.income > 0;
                return (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}
                    onClick={() => {
                      setEditDate(k);
                      setForm({ ...EMPTY_DAY, ...d });
                    }}>
                    <div style={{ fontSize: 12, color: k === todayKey() ? "#fb923c" : "#64748b", fontWeight: k === todayKey() ? 700 : 400 }}>
                      {k === todayKey() ? "Today" : k === dateKey(-1) ? "Yesterday" : k}
                    </div>
                    {hasData ? (
                      <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ fontSize: 12, color: "#fb923c" }}>${d.spend.toFixed(0)}</span>
                        <span style={{ fontSize: 12, color: "#3b82f6" }}>${d.income.toFixed(0)}</span>
                        <span style={{ fontSize: 12, color: p >= 0 ? "#10b981" : "#ef4444" }}>{p >= 0 ? "+" : ""}${p.toFixed(0)}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: "#334155" }}>No data</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ height: 40 }} />
        </div>
      </div>

      <Toast {...toast} />
    </div>
  );
}
