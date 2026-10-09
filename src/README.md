@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #07111f;
  --panel: rgba(15, 23, 37, 0.96);
  --panel-strong: #101a2a;
  --panel-soft: #122033;
  --border: rgba(148, 163, 184, 0.18);
  --text: #edf4ff;
  --muted: #a4b6d3;
  --accent: #58d5ff;
  --accent-strong: #3ebeff;
  --success: #2ad9a0;
  --danger: #ff5a88;
  --warning: #ffca6d;
  --shadow: 0 18px 45px rgba(4, 8, 20, 0.45);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
  height: 100%;
  font-family: 'Inter', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(77, 151, 255, 0.12), transparent 28%),
    radial-gradient(circle at bottom right, rgba(63, 229, 181, 0.08), transparent 25%),
    var(--bg);
  color: var(--text);
}

body {
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

button {
  border: none;
  cursor: pointer;
}

.app-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: rgba(8, 15, 25, 0.88);
  border-right: 1px solid var(--border);
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), #8b7cff);
  color: #021220;
  font-weight: 800;
  box-shadow: var(--shadow);
}

.brand-wrap h1 {
  margin: 0;
  font-size: 1.4rem;
}

.eyebrow,
.tiny-label {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  background: transparent;
  color: var(--muted);
  text-align: left;
  padding: 12px 14px;
  border-radius: 12px;
  transition: 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(88, 213, 255, 0.08);
  color: var(--text);
  border: 1px solid rgba(88, 213, 255, 0.18);
}

.sidebar-card {
  margin-top: auto;
  background: linear-gradient(180deg, rgba(16, 26, 42, 0.96), rgba(12, 20, 31, 0.96));
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-card strong {
  font-size: 1rem;
}

.sidebar-card span {
  color: var(--muted);
  font-size: 0.8rem;
}

.main-panel {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.topbar h2 {
  margin: 6px 0 0 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ghost-btn,
.text-btn,
.primary,
.secondary {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
}

.ghost-btn,
.text-btn {
  background: rgba(148, 163, 184, 0.08);
  color: var(--text);
  border: 1px solid var(--border);
}

.primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #021220;
}

.secondary {
  background: rgba(88, 213, 255, 0.08);
  color: var(--text);
  border: 1px solid rgba(88, 213, 255, 0.15);
}

.avatar-pill {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d3060, #233d69);
  border: 1px solid var(--border);
  font-weight: 700;
}

.ticker-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ticker-pill,
.chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  border: 1px solid var(--border);
  background: rgba(15, 23, 37, 0.72);
  color: var(--text);
}

.chip.success,
.ticker-pill.up,
.positive {
  color: var(--success);
}

.chip.danger,
.ticker-pill.danger,
.negative {
  color: var(--danger);
}

.chip.subtle {
  color: var(--muted);
}

.panel {
  background: linear-gradient(180deg, rgba(15, 23, 37, 0.96), rgba(11, 17, 25, 0.96));
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.balance-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 22px;
}

.balance-content {
  display: flex;
  align-items: center;
  gap: 28px;
}

.balance-content h3 {
  margin: 8px 0 0 0;
  font-size: clamp(2rem, 3vw, 3rem);
}

.balance-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  color: var(--muted);
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dashboard-grid,
.content-grid,
.bottom-grid,
.admin-grid {
  display: grid;
  gap: 20px;
}

.dashboard-grid {
  grid-template-columns: 1.1fr 1.2fr;
}

.content-grid {
  grid-template-columns: 1.5fr 0.9fr;
}

.bottom-grid {
  grid-template-columns: 1.1fr 0.9fr;
}

.admin-grid {
  grid-template-columns: 1.1fr 1fr;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.panel-head h3 {
  margin: 0;
  font-size: 1.15rem;
}

.donut-wrap {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.donut-chart {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    var(--accent) 0 27%,
    #6bd1ff 27% 46%,
    #7b8cff 46% 58%,
    #5ee6a3 58% 100%
  );
  display: grid;
  place-items: center;
}

.donut-chart::after {
  content: '';
  position: absolute;
  width: 94px;
  height: 94px;
  background: rgba(11, 17, 25, 0.96);
  border-radius: 50%;
  inset: 38px;
}

.donut-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.donut-center strong {
  font-size: 1.6rem;
}

.legend-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--muted);
}

.legend-list li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.dot.btc { background: var(--accent); }
.dot.eth { background: #8db9ff; }
.dot.sol { background: #b7ff7e; }
.dot.usdt { background: #5ee6a3; }

.performance-chart {
  height: 150px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(20, 31, 46, 0.88), rgba(10, 16, 24, 0.9));
  border: 1px solid var(--border);
  overflow: hidden;
  position: relative;
}

.chart-line {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(88, 213, 255, 0.12), transparent),
              linear-gradient(135deg, transparent 0%, transparent 48%, rgba(88, 213, 255, 0.7) 50%, transparent 52%, transparent 100%);
  clip-path: polygon(0% 65%, 10% 58%, 20% 62%, 35% 43%, 50% 48%, 62% 33%, 78% 36%, 100% 10%, 100% 100%, 0% 100%);
}

.stats-stack {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.stats-stack small,
.market-price,
strong,
span,
small {
  display: block;
}

.stats-stack small {
  color: var(--muted);
  margin-bottom: 7px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
}

th {
  color: var(--text);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

td {
  color: var(--text);
}

.list-stack,
.card-list,
.staking-list,
.settings-list,
.support-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.market-row,
.staking-row,
.support-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.market-row strong,
.staking-row strong,
.support-item strong {
  color: var(--text);
  font-size: 0.96rem;
}

.market-row small,
.staking-row small,
.support-item small {
  color: var(--muted);
}

.card-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.card-preview {
  background: linear-gradient(135deg, rgba(88, 213, 255, 0.1), rgba(139, 124, 255, 0.12));
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-topline,
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}

.card-preview h4 {
  margin: 10px 0 8px 0;
}

.card-preview p {
  margin: 0;
  color: var(--muted);
  letter-spacing: 0.08em;
}

.card-preview strong {
  font-size: 1.2rem;
}

.staking-row {
  grid-template-columns: 1fr 80px 100px;
}

.admin-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric-box {
  background: rgba(12, 20, 32, 0.8);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px 14px;
}

.metric-box span {
  color: var(--muted);
  font-size: 0.78rem;
}

.metric-box strong {
  margin-top: 10px;
  font-size: 1.5rem;
}

.admin-revenue {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.admin-revenue small {
  color: var(--muted);
}

.admin-revenue strong {
  font-size: 1.6rem;
  margin-top: 6px;
}

.small {
  padding: 8px 12px;
}

.settings-list {
  margin-top: 8px;
}

.settings-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.settings-block strong {
  color: var(--text);
}

.settings-block span {
  color: var(--muted);
}

.support-item {
  grid-template-columns: 1fr auto;
}

.support-item small {
  display: block;
  margin-top: 4px;
}

@media (max-width: 1100px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding-bottom: 18px;
  }

  .dashboard-grid,
  .content-grid,
  .bottom-grid,
  .admin-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .main-panel {
    padding: 18px 14px 26px;
  }

  .balance-panel,
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-list {
    grid-template-columns: 1fr;
  }

  .donut-wrap {
    flex-direction: column;
  }

  .quick-actions {
    width: 100%;
  }

  .quick-actions button {
    flex: 1 1 45%;
  }
}
