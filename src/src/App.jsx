const navItems = [
  'Dashboard',
  'Portfolio',
  'Trading',
  'Deposits',
  'Staking',
  'Cards',
  'Security',
  'Settings',
  'Support'
];

const portfolioRows = [
  { asset: 'BTC', amount: '0.50', price: '$24,690', value: '$12,345', change: '+5.2%' },
  { asset: 'ETH', amount: '5.00', price: '$1,780', value: '$8,901', change: '-1.2%' },
  { asset: 'SOL', amount: '50.00', price: '$113.56', value: '$5,678', change: '+8.9%' },
  { asset: 'USDT', amount: '18,754', price: '$1.00', value: '$18,754', change: '+0.0%' },
  { asset: 'EUR', amount: '1,234', price: '€1.00', value: '€1,234', change: '—' }
];

const marketRows = [
  { pair: 'BTC/USD', price: '$24,690', change: '+5.2%' },
  { pair: 'ETH/USD', price: '$1,780', change: '+2.3%' },
  { pair: 'SOL/USD', price: '$113.56', change: '+8.9%' },
  { pair: 'USDT/USD', price: '$1.00', change: '+0.0%' },
  { pair: 'XRP/USD', price: '$0.52', change: '-1.6%' }
];

const cards = [
  {
    name: 'Aether Black',
    number: '4532 1000 2345 9988',
    holder: 'MAX MUSTERMANN',
    status: 'Active',
    balance: '$45,678.90',
    limit: '€1,000/day',
    icon: '💳'
  },
  {
    name: 'Virtual Card',
    number: '4532 1000 2345 9989',
    holder: 'MAX MUSTERMANN',
    status: 'Active',
    balance: '$3,250.00',
    limit: '€500/month',
    icon: '💳'
  }
];

const stakingPools = [
  { asset: 'BTC', apy: '3.5%', type: 'Locked', min: '0.01 BTC', status: 'Available' },
  { asset: 'ETH', apy: '4.2%', type: 'Flexible', min: '0.10 ETH', status: 'Available' },
  { asset: 'SOL', apy: '8.1%', type: 'Locked', min: '10 SOL', status: 'Available' },
  { asset: 'USDT', apy: '2.5%', type: 'Flexible', min: '$100', status: 'Available' }
];

const adminMetrics = [
  { label: 'Total Users', value: '1,234,567' },
  { label: 'Active Today', value: '234,567' },
  { label: '24h Volume', value: '$456M' },
  { label: 'Revenue Vault', value: '€234K' }
];

const supportTickets = [
  { name: 'Max Mustermann', type: 'KYC approval', status: 'Open' },
  { name: 'Alex Fischer', type: 'Withdrawal issue', status: 'In review' },
  { name: 'Sarah H.', type: 'Card lock', status: 'Resolved' }
];

const settingBlocks = [
  { title: 'Appearance', keys: ['Dark mode', 'Accent: Cyan', 'Animations: on'] },
  { title: 'Notifications', keys: ['Push enabled', 'Email enabled', 'SMS disabled'] },
  { title: 'Security', keys: ['2FA enabled', 'Session tracking', 'Geo-lock active'] },
  { title: 'Privacy', keys: ['Private profile', 'Data export ready', 'Ad tracking off'] }
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-icon">A</div>
          <div>
            <p className="eyebrow">AETHER</p>
            <h1>Bank</h1>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <button className={index === 0 ? 'nav-item active' : 'nav-item'} key={item}>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="tiny-label">Security</p>
          <strong>2FA Active</strong>
          <span>Protected by Google Authenticator</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Portfolio overview</p>
            <h2>Welcome back, Max</h2>
          </div>

          <div className="topbar-actions">
            <button className="ghost-btn">Alerts</button>
            <button className="ghost-btn">Dark</button>
            <div className="avatar-pill">MM</div>
          </div>
        </header>

        <section className="ticker-row">
          <div className="ticker-pill up">BTC $24,690</div>
          <div className="ticker-pill up">ETH $1,780</div>
          <div className="ticker-pill up">SOL $113.56</div>
          <div className="ticker-pill danger">XRP $0.52</div>
        </section>

        <section className="balance-panel panel">
          <div className="balance-content">
            <div>
              <p className="tiny-label">Total balance</p>
              <h3>$45,678.90</h3>
            </div>
            <div className="balance-metrics">
              <span className="positive">+12.5% 24h</span>
              <span>€42,156.78</span>
            </div>
          </div>

          <div className="quick-actions">
            <button className="primary">Deposit</button>
            <button className="secondary">Withdraw</button>
            <button className="secondary">Trade</button>
            <button className="secondary">Stake</button>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <h3>Portfolio</h3>
              <span className="chip success">+12.5%</span>
            </div>

            <div className="donut-wrap">
              <div className="donut-chart" aria-label="Portfolio allocation chart">
                <div className="donut-center">
                  <strong>27%</strong>
                  <small>BTC</small>
                </div>
              </div>

              <ul className="legend-list">
                <li><span className="dot btc"></span> BTC · 27%</li>
                <li><span className="dot eth"></span> ETH · 19%</li>
                <li><span className="dot sol"></span> SOL · 12%</li>
                <li><span className="dot usdt"></span> USDT · 41%</li>
              </ul>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Performance</h3>
              <span className="chip subtle">1D 1W 1M 1Y</span>
            </div>

            <div className="performance-chart" aria-label="Performance chart">
              <div className="chart-line"></div>
            </div>

            <div className="stats-stack">
              <div><small>1D</small><strong>+$234.56</strong></div>
              <div><small>1W</small><strong>+$1,234.56</strong></div>
              <div><small>1M</small><strong>+$5,678.90</strong></div>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel wide-panel">
            <div className="panel-head">
              <h3>Holdings</h3>
              <button className="text-btn">View all</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Value</th>
                  <th>24h</th>
                </tr>
              </thead>
              <tbody>
                {portfolioRows.map((row) => (
                  <tr key={row.asset}>
                    <td>{row.asset}</td>
                    <td>{row.amount}</td>
                    <td>{row.price}</td>
                    <td>{row.value}</td>
                    <td className={row.change.startsWith('-') ? 'negative' : 'positive'}>{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Market</h3>
              <button className="text-btn">Explore</button>
            </div>

            <div className="list-stack">
              {marketRows.map((pair) => (
                <div className="market-row" key={pair.pair}>
                  <div>
                    <strong>{pair.pair}</strong>
                  </div>
                  <div>
                    <span className="market-price">{pair.price}</span>
                  </div>
                  <div className={pair.change.startsWith('-') ? 'negative' : 'positive'}>{pair.change}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-head">
              <h3>Cards</h3>
              <button className="text-btn">Manage</button>
            </div>

            <div className="card-list">
              {cards.map((card) => (
                <div className="card-preview" key={card.number}>
                  <div className="card-topline">
                    <span>{card.icon}</span>
                    <span>{card.status}</span>
                  </div>
                  <h4>{card.name}</h4>
                  <p>{card.number}</p>
                  <div className="card-meta">
                    <span>{card.holder}</span>
                    <span>{card.limit}</span>
                  </div>
                  <strong>{card.balance}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Staking</h3>
              <button className="text-btn">Earn</button>
            </div>

            <div className="staking-list">
              {stakingPools.map((pool) => (
                <div className="staking-row" key={pool.asset}>
                  <div>
                    <strong>{pool.asset}</strong>
                    <small>{pool.type}</small>
                  </div>
                  <div>
                    <span>{pool.apy}</span>
                  </div>
                  <div>
                    <small>{pool.min}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-grid">
          <div className="panel admin-panel">
            <div className="panel-head">
              <h3>Admin overview</h3>
              <button className="text-btn">Open admin</button>
            </div>

            <div className="admin-metrics">
              {adminMetrics.map((metric) => (
                <div key={metric.label} className="metric-box">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>

            <div className="admin-revenue">
              <div>
                <small>Revenue vault</small>
                <strong>€234,567.89</strong>
              </div>
              <button className="primary small">Withdraw</button>
            </div>
          </div>

          <div className="panel admin-panel">
            <div className="panel-head">
              <h3>Settings</h3>
              <button className="text-btn">Edit</button>
            </div>

            <div className="settings-list">
              {settingBlocks.map((block) => (
                <div className="settings-block" key={block.title}>
                  <strong>{block.title}</strong>
                  {block.keys.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel support-panel">
          <div className="panel-head">
            <h3>Support queue</h3>
            <button className="text-btn">Open tickets</button>
          </div>

          <div className="support-list">
            {supportTickets.map((ticket) => (
              <div className="support-item" key={ticket.name}>
                <div>
                  <strong>{ticket.name}</strong>
                  <small>{ticket.type}</small>
                </div>
                <span className={ticket.status === 'Resolved' ? 'chip success' : 'chip subtle'}>{ticket.status}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
