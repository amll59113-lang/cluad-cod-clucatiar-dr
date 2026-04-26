import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Dashboard.css'

/* ═══════════════════════ TYPES ═══════════════════════ */
interface LeadsData {
  total: number
  approved: number
  trash: number
  hold: number
}
interface DrCashAccount {
  name: string
  revenue: number
  leads: number
  approved: number
  trash: number
  hold: number
}
interface Offer {
  name: string
  network: string
  leads: number
  approved: number
  hold: number
  earnings: number
}
interface DayData {
  spend: number
  income: number
  leads: LeadsData
  drCash: DrCashAccount[]
  topOffers: Offer[]
}
type StorageData = Record<string, DayData>
interface ToastItem { id: number; message: string; type: 'success' | 'error' }

/* ═══════════════════════ DEFAULT SEED DATA ═══════════════════════ */
const DEFAULT_DATA: DayData = {
  spend: 445.66,
  income: 1080.10,
  leads: { total: 238, approved: 37, trash: 35, hold: 51 },
  drCash: [
    { name: 'Dr.Cash Account #1', revenue: 1080.10, leads: 232, approved: 37, trash: 34, hold: 50 },
    { name: 'Dr.Cash Account #2', revenue: 0,       leads: 6,   approved: 0,  trash: 1,  hold: 1  },
  ],
  topOffers: [
    { name: 'Prostalis low price - CPA - [GR]', network: 'DR.CASH',  leads: 89, approved: 15, hold: 22, earnings: 412.50 },
    { name: 'Artroser Premium - CPA - [ES]',    network: 'DR.CASH',  leads: 67, approved: 12, hold: 18, earnings: 318.00 },
    { name: 'Flexorol Ultra - CPA - [PL]',      network: 'DR.CASH',  leads: 42, approved: 7,  hold: 9,  earnings: 189.00 },
    { name: 'Cardioton Max - CPA - [HU]',       network: 'ADCOMBO',  leads: 28, approved: 2,  hold: 2,  earnings: 98.60  },
    { name: 'Hemoren Stop - CPA - [RO]',        network: 'DR.CASH',  leads: 12, approved: 1,  hold: 0,  earnings: 62.00  },
  ],
}

/* ═══════════════════════ UTILS ═══════════════════════ */
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function fmtDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
function fmtMoney(n: number | null | undefined): string {
  if (n == null || !isFinite(n) || isNaN(n)) return '--'
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function safeDiv(num: number, den: number) {
  return den > 0 ? fmtMoney(num / den) : '--'
}

/* ═══════════════════════ ANIMATED NUMBER ═══════════════════════ */
function AnimNum({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(value)
  const raf  = useRef(0)
  const prev = useRef(value)

  useEffect(() => {
    const from = prev.current
    const to   = value
    if (from === to) return
    const dur = 740
    const t0  = performance.now()

    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisplay(from + (to - from) * e)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else { prev.current = to; setDisplay(to) }
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value])

  if (decimals > 0) return <>{display.toFixed(decimals)}</>
  return <>{Math.round(display).toLocaleString()}</>
}

/* ═══════════════════════ SMALL COMPONENTS ═══════════════════════ */
function LeadCard({ icon, color, label, value }: { icon: string; color: string; label: string; value: number }) {
  return (
    <div className="lead-card fade-up">
      <div className={`lead-icon-wrap wrap-${color}`}>{icon}</div>
      <div className={`lead-value lv-${color}`}><AnimNum value={value} decimals={0} /></div>
      <div className="lead-label">{label}</div>
    </div>
  )
}

function CostCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="cost-card fade-up">
      <div>
        <div className="cost-label">{label}</div>
        <div className={`cost-value cv-${color}`}>{value}</div>
      </div>
      <div className="cost-icon">{icon}</div>
    </div>
  )
}

function BreakStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="break-stat">
      <div className="break-stat-label">{label}</div>
      <div className={`break-stat-value bsv-${color}`}>{value}</div>
    </div>
  )
}

const RANK_CLS  = ['rank-1','rank-2','rank-3','rank-4','rank-5']
const RANK_ICON = ['🥇','🥈','🥉','4','5']

function OfferRow({ offer, rank }: { offer: Offer; rank: number }) {
  const i        = rank - 1
  const tagClass = offer.network === 'ADCOMBO' ? 'tag-adcombo' : 'tag-drcash'
  return (
    <div className="offer-item">
      <div className={`offer-rank ${RANK_CLS[i]}`}>{i < 3 ? RANK_ICON[i] : rank}</div>
      <div className="offer-info">
        <div className="offer-name">{offer.name}</div>
        <div className="offer-tags">
          <span className={`offer-tag ${tagClass}`}>{offer.network}</span>
        </div>
      </div>
      <div className="offer-stats">
        <div className="offer-stat">
          <div className="offer-stat-label">Leads</div>
          <div className="offer-stat-value">{offer.leads}</div>
        </div>
        <div className="offer-stat">
          <div className="offer-stat-label">Approved</div>
          <div className="offer-stat-value ostat-green">{offer.approved}</div>
        </div>
        <div className="offer-stat">
          <div className="offer-stat-label">Hold</div>
          <div className="offer-stat-value ostat-yellow">{offer.hold}</div>
        </div>
      </div>
      <div className="offer-earnings">{fmtMoney(offer.earnings)}</div>
    </div>
  )
}

/* ═══════════════════════ SIDEBAR ═══════════════════════ */
interface SidebarProps {
  activeNav: string
  setActiveNav: (v: string) => void
  activePlatform: string
  setActivePlatform: (v: string) => void
  activeNetwork: string
  setActiveNetwork: (v: string) => void
  onExportCSV: () => void
  onShowToast: (m: string, t?: 'success' | 'error') => void
}

function Sidebar({
  activeNav, setActiveNav,
  activePlatform, setActivePlatform,
  activeNetwork, setActiveNetwork,
  onExportCSV, onShowToast,
}: SidebarProps) {
  const platforms = [
    { id: 'tiktok', icon: '🎵', cls: 'p-icon-tt', label: 'TikTok Ads', dot: true  },
    { id: 'meta1',  icon: '🔵', cls: 'p-icon-fb', label: 'Meta Ads 1'             },
    { id: 'meta2',  icon: '🔵', cls: 'p-icon-fb', label: 'Meta Ads 2'             },
    { id: 'meta3',  icon: '🔵', cls: 'p-icon-fb', label: 'Meta Ads 3'             },
  ]
  const networks = [
    { id: 'drcash1', icon: '💊', cls: 'p-icon-dc', label: 'Dr.Cash 1' },
    { id: 'drcash2', icon: '💊', cls: 'p-icon-dc', label: 'Dr.Cash 2' },
    { id: 'drcash3', icon: '💊', cls: 'p-icon-dc', label: 'Dr.Cash 3' },
    { id: 'adcombo', icon: '🎯', cls: 'p-icon-ac', label: 'AdCombo'   },
  ]

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sb-logo">
        <div className="sb-logo-icon">📊</div>
        <div>
          <div className="sb-logo-text">Affiliate Tracker</div>
          <div className="sb-logo-sub">Pro Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {['daily','monthly'].map(view => (
          <div
            key={view}
            className={`nav-item ${activeNav === view ? 'active' : ''}`}
            onClick={() => setActiveNav(view)}
          >
            <span className="nav-icon">{view === 'daily' ? '📅' : '📆'}</span>
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </div>
        ))}
      </nav>

      {/* Ad Platforms */}
      <div className="sb-section">
        <div className="sb-section-label">Ad Platforms</div>
        {platforms.map(p => (
          <div
            key={p.id}
            className={`platform-item ${activePlatform === p.id ? 'active' : ''}`}
            onClick={() => setActivePlatform(p.id)}
          >
            <div className={`p-icon ${p.cls}`}>{p.icon}</div>
            <span>{p.label}</span>
            {p.dot && <div className="p-dot" />}
          </div>
        ))}
      </div>

      {/* CPA Networks */}
      <div className="sb-section">
        <div className="sb-section-label">CPA Networks</div>
        {networks.map(n => (
          <div
            key={n.id}
            className={`platform-item ${activeNetwork === n.id ? 'active' : ''}`}
            onClick={() => setActiveNetwork(activeNetwork === n.id ? '' : n.id)}
          >
            <div className={`p-icon ${n.cls}`}>{n.icon}</div>
            <span>{n.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sb-footer">
        <div className="user-row">
          <div className="user-avatar">A</div>
          <div className="user-email">amll59113@gmail.com</div>
        </div>
        <button className="footer-btn" onClick={() => onShowToast('⚙️ API Settings opened')}>
          ⚙️ API Settings
        </button>
        <button className="footer-btn" onClick={() => onShowToast('🎯 Goals panel opened')}>
          🎯 Set Goals
        </button>
        <button
          className="footer-btn hi"
          onClick={() => {
            onShowToast('☁️ Syncing to cloud...')
            setTimeout(() => onShowToast('✅ Cloud sync complete!'), 1500)
          }}
        >
          ☁️ Sync All to Cloud
        </button>
        <button className="footer-btn" onClick={() => onShowToast('🌙 Dark mode is always on')}>
          🌙 Dark Mode
        </button>
        <button className="footer-btn" onClick={onExportCSV}>
          📥 Export CSV
        </button>
        <button className="footer-btn danger" onClick={() => onShowToast('👋 Logged out successfully')}>
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}

/* ═══════════════════════ TOAST ID ═══════════════════════ */
let _tid = 0

/* ═══════════════════════ MAIN DASHBOARD ═══════════════════════ */
const Dashboard: React.FC = () => {
  const TODAY     = new Date(2026, 3, 24)
  const TODAY_KEY = dateKey(TODAY)

  const [currentDate,    setCurrentDate]    = useState(new Date(TODAY))
  const [allData,        setAllData]        = useState<StorageData>({})
  const [toasts,         setToasts]         = useState<ToastItem[]>([])
  const [activeNav,      setActiveNav]      = useState('daily')
  const [activePlatform, setActivePlatform] = useState('tiktok')
  const [activeNetwork,  setActiveNetwork]  = useState('drcash1')
  const [inputSpend,     setInputSpend]     = useState('')
  const [inputIncome,    setInputIncome]    = useState('')

  /* load from localStorage */
  useEffect(() => {
    let stored: StorageData = {}
    try {
      const raw = localStorage.getItem('affiliateTrackerPro_v2')
      if (raw) stored = JSON.parse(raw)
    } catch {}
    if (!stored[TODAY_KEY]) stored[TODAY_KEY] = JSON.parse(JSON.stringify(DEFAULT_DATA))
    setAllData(stored)
  }, [])

  /* persist */
  useEffect(() => {
    if (Object.keys(allData).length > 0)
      localStorage.setItem('affiliateTrackerPro_v2', JSON.stringify(allData))
  }, [allData])

  const curKey  = dateKey(currentDate)
  const dayData = allData[curKey] ?? null

  const spend  = dayData?.spend  ?? 0
  const income = dayData?.income ?? 0
  const profit = income - spend
  const roi    = spend > 0 ? (profit / spend) * 100 : 0
  const leads  = dayData?.leads ?? { total: 0, approved: 0, trash: 0, hold: 0 }

  function relLabel() {
    if (curKey === TODAY_KEY) return 'Today'
    const diff = Math.round((currentDate.getTime() - TODAY.getTime()) / 86400000)
    if (diff === -1) return 'Yesterday'
    if (diff === 1)  return 'Tomorrow'
    return diff < 0 ? 'Past' : 'Future'
  }

  /* toast */
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++_tid
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  /* date navigation */
  function changeDate(delta: number) {
    setCurrentDate(d => {
      const next = new Date(d)
      next.setDate(next.getDate() + delta)
      return next
    })
  }

  /* save day */
  function saveDay() {
    const s = parseFloat(inputSpend)
    const i = parseFloat(inputIncome)
    if (isNaN(s) || isNaN(i) || s < 0 || i < 0) {
      showToast('Please enter valid spend and income values', 'error')
      return
    }
    setAllData(d => {
      const existing: DayData = d[curKey]
        ? { ...d[curKey] }
        : JSON.parse(JSON.stringify(DEFAULT_DATA))
      return { ...d, [curKey]: { ...existing, spend: s, income: i } }
    })
    setInputSpend('')
    setInputIncome('')
    showToast('✅ Day data saved successfully!')
  }

  /* export csv */
  function exportCSV() {
    if (!dayData) { showToast('No data to export', 'error'); return }
    const rows = [
      ['Date','Spend','Income','Profit','ROI%','Leads','Approved','Trash','Hold','CPL','CPA','CPH','CPT'],
      [
        fmtDate(currentDate),
        spend.toFixed(2), income.toFixed(2), profit.toFixed(2), roi.toFixed(1),
        leads.total, leads.approved, leads.trash, leads.hold,
        leads.total    ? (spend/leads.total).toFixed(2)    : '--',
        leads.approved ? (spend/leads.approved).toFixed(2) : '--',
        leads.hold     ? (spend/leads.hold).toFixed(2)     : '--',
        leads.trash    ? (spend/leads.trash).toFixed(2)    : '--',
      ],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a   = document.createElement('a')
    a.href    = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `aff-tracker-${curKey}.csv`
    a.click()
    showToast('📥 CSV exported successfully!')
  }

  /* ── RENDER ── */
  return (
    <div className="app">
      <Sidebar
        activeNav={activeNav}         setActiveNav={setActiveNav}
        activePlatform={activePlatform} setActivePlatform={setActivePlatform}
        activeNetwork={activeNetwork}   setActiveNetwork={setActiveNetwork}
        onExportCSV={exportCSV}
        onShowToast={showToast}
      />

      <main className="main">
        {/* ── Top Header ── */}
        <div className="top-header">
          <h1 className="page-title">
            {activeNav === 'daily' ? 'Daily' : 'Monthly'} Overview
          </h1>
          <div className="header-actions">
            <button className="btn btn-ghost" onClick={() => showToast('🔄 Data refreshed')}>
              ⟳ Refresh
            </button>
            <button
              className={`btn btn-pill ${activePlatform === 'tiktok' ? 'active' : ''}`}
              onClick={() => setActivePlatform('tiktok')}
            >🎵 TikTok</button>
            <button
              className={`btn btn-pill ${activePlatform.startsWith('meta') ? 'active' : ''}`}
              onClick={() => setActivePlatform('meta1')}
            >🔵 Meta</button>
            <button
              className={`btn-pill-green ${activeNetwork.startsWith('drcash') ? 'on' : ''}`}
              onClick={() => setActiveNetwork(activeNetwork.startsWith('drcash') ? '' : 'drcash1')}
            >💊 Dr.Cash</button>
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="content">

          {/* Date Navigation */}
          <div className="date-card fade-up">
            <button className="date-nav-btn" onClick={() => changeDate(-1)}>‹</button>
            <div className="date-info">
              <div className="date-label">{relLabel()}</div>
              <div className="date-value">{fmtDate(currentDate)}</div>
            </div>
            <button className="date-nav-btn" onClick={() => changeDate(1)}>›</button>
          </div>

          {/* No data state */}
          {!dayData ? (
            <div className="no-data-card fade-up">
              <div className="no-data-icon">📭</div>
              <div className="no-data-text">No data for {fmtDate(currentDate)}</div>
              <div className="no-data-sub">Use the form below to add data for this day</div>
            </div>
          ) : (
            <>
              {/* ── 3 Big Metric Cards ── */}
              <div className="metrics-grid">
                <div className="metric-card card-spend fade-up-1">
                  <div className="metric-header">
                    <span className="metric-label">Total Spend</span>
                    <div className="metric-icon icon-orange">💸</div>
                  </div>
                  <div className="metric-value val-orange">
                    $<AnimNum value={spend} decimals={2} />
                  </div>
                  <div className="metric-sub">TikTok ${spend.toFixed(0)}</div>
                </div>

                <div className="metric-card card-income fade-up-2">
                  <div className="metric-header">
                    <span className="metric-label">Total Income</span>
                    <div className="metric-icon icon-purple">💰</div>
                  </div>
                  <div className="metric-value val-purple">
                    $<AnimNum value={income} decimals={2} />
                  </div>
                  <div className="metric-sub">Dr.Cash + AdCombo</div>
                </div>

                <div className="metric-card card-profit fade-up-3">
                  <div className="metric-header">
                    <span className="metric-label">Net Profit</span>
                    <div className="metric-icon icon-green">📈</div>
                  </div>
                  <div className={`metric-value ${profit >= 0 ? 'val-green' : 'val-red'}`}>
                    {profit < 0 ? '-' : ''}$<AnimNum value={Math.abs(profit)} decimals={2} />
                  </div>
                  <div className="metric-sub">
                    ROI:{' '}
                    <span className={roi >= 0 ? 'text-green' : 'text-red'}>
                      {roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* ── 4 Lead Cards ── */}
              <div className="leads-grid">
                <LeadCard icon="👥" color="blue"   label="Total Leads" value={leads.total}    />
                <LeadCard icon="✅" color="green"  label="Approved"    value={leads.approved} />
                <LeadCard icon="🗑️" color="red"    label="Trash"       value={leads.trash}    />
                <LeadCard icon="⏳" color="yellow" label="Hold"        value={leads.hold}     />
              </div>

              {/* ── 4 Cost Metric Cards ── */}
              <div className="cost-grid">
                <CostCard label="Cost / Lead (CPL)"     value={safeDiv(spend, leads.total)}    icon="🎯" color="blue"   />
                <CostCard label="Cost / Approved (CPA)" value={safeDiv(spend, leads.approved)} icon="✅" color="green"  />
                <CostCard label="Cost / Hold (CPH)"     value={safeDiv(spend, leads.hold)}     icon="⏳" color="yellow" />
                <CostCard label="Cost / Trash (CPT)"    value={safeDiv(spend, leads.trash)}    icon="🗑️" color="red"    />
              </div>

              <div className="glow-divider" />

              {/* ── Dr.Cash Breakdown ── */}
              <div className="section-block">
                <h2 className="section-title">💊 Dr.Cash Breakdown</h2>
                {dayData.drCash.map((acc, i) => (
                  <div key={i} className="breakdown-card fade-up">
                    <div className="breakdown-header">
                      <span className="account-tag">Account #{i + 1}</span>
                      <span className="account-name">{acc.name}</span>
                    </div>
                    <div className="breakdown-stats">
                      <BreakStat label="Revenue"  value={fmtMoney(acc.revenue)} color="green"  />
                      <BreakStat label="Leads"    value={String(acc.leads)}     color="blue"   />
                      <BreakStat label="Approved" value={String(acc.approved)}  color="green"  />
                      <BreakStat label="Trash"    value={String(acc.trash)}     color="red"    />
                      <BreakStat label="Hold"     value={String(acc.hold)}      color="yellow" />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Top 5 Offers ── */}
              <div className="section-block">
                <h2 className="section-title">🏆 Top 5 Offers</h2>
                {dayData.topOffers.slice(0, 5).map((offer, i) => (
                  <OfferRow key={i} offer={offer} rank={i + 1} />
                ))}
              </div>

              <div className="glow-divider" />
            </>
          )}

          {/* ── Input Section ── */}
          <div className="input-section fade-up">
            <h2 className="section-title">✏️ Update Day Data</h2>
            <div className="input-grid">
              <div className="form-group">
                <label className="form-label">Spend ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={inputSpend}
                  onChange={e => setInputSpend(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveDay()}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Income ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={inputIncome}
                  onChange={e => setInputIncome(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveDay()}
                />
              </div>
              <button className="btn-save" onClick={saveDay}>
                💾 Save Day
              </button>
            </div>
          </div>

          <div style={{ height: 40 }} />
        </div>
      </main>

      {/* ── Toast Notifications ── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
