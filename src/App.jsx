import { useEffect, useRef, useState } from 'react';
import { formatEther } from 'ethers';
import useWallet from './useWallet';
import { displayBalance, networks, normalizeChain, shortAddress, trustLink, validateTransfer, walletError } from './wallet';

const navigation = [
  ['overview', 'Übersicht', 'grid'], ['portfolio', 'Portfolio', 'pie'],
  ['activity', 'Aktivität', 'activity'], ['trading', 'Trading', 'arrows'],
  ['staking', 'Staking', 'layers'], ['cards', 'Karten', 'card'],
  ['security', 'Sicherheit', 'shield'], ['settings', 'Einstellungen', 'settings']
];

function Icon({ name, size = 20 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    pie: <><path d="M12 3v9h9A9 9 0 1 1 12 3Z" /><path d="M16 3.8a9 9 0 0 1 4.2 4.2H16Z" /></>,
    activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
    arrows: <><path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" /></>,
    layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />,
    card: <><rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20M6 15h3" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    settings: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" /><circle cx="15" cy="17" r="3" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    down: <path d="M12 4v16m-6-6 6 6 6-6" />,
    up: <path d="M12 20V4m-6 6 6-6 6 6" />,
    wallet: <><path d="M19 7V4H6a3 3 0 0 0 0 6h15v10H6a3 3 0 0 1-3-3V7" /><path d="M21 12h-6v5h6M17 14.5h.01" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5 8a8 8 0 0 1 14-2l1 6M4 12l1 6a8 8 0 0 0 14-2" /></>,
    external: <><path d="M14 3h7v7m0-7L10 14" /><path d="M10 3H3v18h18v-7" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.wallet}</svg>;
}

function Ethereum({ small = false }) {
  return <span className={`coin-icon ${small ? 'small' : ''}`}><svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><path fill="currentColor" opacity=".85" d="m16 2-8 14 8 5 8-5Z" /><path fill="currentColor" opacity=".5" d="m16 23-8-5 8 12 8-12Z" /><path fill="#a0afc0" d="M16 2v19l8-5Z" /></svg></span>;
}

function Modal({ title, onClose, busy, children }) {
  const dialog = useRef(null);
  const handlers = useRef({ onClose, busy });
  handlers.current = { onClose, busy };
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    const closeOnEscape = (event) => {
      event.preventDefault();
      if (!handlers.current.busy) handlers.current.onClose();
    };
    element.addEventListener('cancel', closeOnEscape);
    return () => {
      element.removeEventListener('cancel', closeOnEscape);
      element.close();
      previous?.focus();
    };
  }, []);
  return <dialog ref={dialog} className="modal" aria-labelledby="dialog-title"><div className="modal-head"><div><p className="eyebrow">AETHER / TRUST WALLET</p><h2 id="dialog-title">{title}</h2></div><button className="icon-button" aria-label="Dialog schließen" onClick={onClose} disabled={busy}><Icon name="close" /></button></div>{children}</dialog>;
}

function App() {
  const wallet = useWallet();
  const currentWallet = useRef(wallet);
  currentWallet.current = wallet;
  const [page, setPage] = useState('overview');
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');
  const [textured, setTextured] = useState(true);
  const [privateBalance, setPrivateBalance] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [review, setReview] = useState(null);
  const [transferError, setTransferError] = useState('');
  const [sending, setSending] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [receiptError, setReceiptError] = useState(false);
  const network = networks[wallet.chainId];
  const connected = Boolean(wallet.account);
  const ready = connected && Boolean(network) && wallet.balance !== null && !wallet.loading;
  const title = navigation.find(([key]) => key === page)?.[1] ?? 'Hilfe & Support';

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => { setReview(null); setTransferError(''); }, [wallet.account, wallet.chainId]);
  useEffect(() => {
    if (!transaction || transaction.status !== 'pending' || !wallet.provider || wallet.chainId !== transaction.chainId) return;
    let disposed = false;
    let checking = false;
    const checkReceipt = async () => {
      if (checking) return;
      checking = true;
      try {
        const receipt = await wallet.provider.request({ method: 'eth_getTransactionReceipt', params: [transaction.hash] });
        if (disposed) return;
        setReceiptError(false);
        if (receipt) {
          const status = BigInt(receipt.status) === 1n ? 'confirmed' : 'failed';
          setTransaction((current) => current?.hash === transaction.hash ? { ...current, status } : current);
          wallet.refresh();
        }
      } catch { if (!disposed) setReceiptError(true); }
      finally { checking = false; }
    };
    checkReceipt();
    const timer = window.setInterval(checkReceipt, 7000);
    return () => { disposed = true; window.clearInterval(timer); };
  }, [transaction, wallet.provider, wallet.chainId, wallet.refresh]);

  const copy = async (value) => {
    try { await navigator.clipboard.writeText(value); setNotice('Wallet-Adresse kopiert.'); }
    catch { setNotice('Kopieren nicht möglich. Markiere die Adresse und kopiere sie manuell.'); }
  };
  const openAction = (action) => {
    setReview(null);
    setTransferError('');
    if (action === 'send' && transaction?.status === 'pending') {
      setPage('activity');
      setNotice('Eine Zahlung ist noch ausstehend. Prüfe zuerst ihren Status.');
    } else if (!connected) setModal('connect');
    else if (!network || wallet.balance === null) setModal('network');
    else setModal(action);
  };

  const prepareTransfer = async (event) => {
    event.preventDefault();
    setTransferError('');
    if (!ready) { setTransferError('Verbinde Trust Wallet mit Ethereum oder Sepolia.'); return; }
    let transfer;
    try { transfer = validateTransfer(recipient.trim(), amount, wallet.account); }
    catch (failure) { setTransferError(failure.message); return; }
    setSending(true);
    const account = wallet.account;
    const chainId = wallet.chainId;
    try {
      const request = { from: account, to: transfer.address, value: `0x${transfer.value.toString(16)}` };
      const [accounts, currentChain, rawBalance, rawGas, rawGasPrice] = await Promise.all([
        wallet.provider.request({ method: 'eth_accounts' }),
        wallet.provider.request({ method: 'eth_chainId' }),
        wallet.provider.request({ method: 'eth_getBalance', params: [account, 'latest'] }),
        wallet.provider.request({ method: 'eth_estimateGas', params: [request] }),
        wallet.provider.request({ method: 'eth_gasPrice' })
      ]);
      if (accounts[0]?.toLowerCase() !== account.toLowerCase() || normalizeChain(currentChain) !== chainId || currentWallet.current.account !== account || currentWallet.current.chainId !== chainId) {
        setTransferError('Konto oder Netzwerk hat sich geändert. Prüfe deine Wallet und den Betrag erneut.');
        return;
      }
      const fee = BigInt(rawGas) * BigInt(rawGasPrice);
      if (transfer.value + fee > BigInt(rawBalance)) { setTransferError('Das Guthaben reicht für Betrag und geschätzte Netzwerkgebühr nicht aus.'); return; }
      setReview({ request, chainId, fee, amount: formatEther(transfer.value) });
    } catch (failure) { setTransferError(walletError(failure)); }
    finally { setSending(false); }
  };

  const sendTransfer = async () => {
    if (!review || review.uncertain || sending) return;
    setSending(true);
    setTransferError('');
    let submitted = false;
    try {
      const [accounts, chainId] = await Promise.all([
        wallet.provider.request({ method: 'eth_accounts' }),
        wallet.provider.request({ method: 'eth_chainId' })
      ]);
      if (accounts[0]?.toLowerCase() !== review.request.from.toLowerCase() || normalizeChain(chainId) !== review.chainId || currentWallet.current.account !== review.request.from || currentWallet.current.chainId !== review.chainId) {
        setReview(null);
        setTransferError('Konto oder Netzwerk hat sich geändert. Bitte prüfe die Zahlung erneut.');
        return;
      }
      submitted = true;
      const hash = await wallet.provider.request({ method: 'eth_sendTransaction', params: [{ ...review.request, chainId: review.chainId }] });
      if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
        setReview((current) => current ? { ...current, uncertain: true } : current);
        setTransferError('Kein gültiger Transaktions-Hash erhalten. Die Zahlung könnte trotzdem gesendet worden sein. Prüfe deine Aktivität in Trust Wallet oder im Explorer, bevor du erneut sendest.');
        return;
      }
      setTransaction({ hash, chainId: review.chainId, amount: review.amount, to: review.request.to, status: 'pending' });
      setReceiptError(false);
      setModal('');
      setPage('activity');
      setRecipient('');
      setAmount('');
      setReview(null);
      setNotice('An das Netzwerk gesendet. Die Bestätigung steht noch aus.');
    } catch (failure) {
      const rejected = Number(failure?.code) === 4001 || failure?.code === 'ACTION_REJECTED';
      if (submitted && !rejected) {
        setReview((current) => current ? { ...current, uncertain: true } : current);
        setTransferError('Der Zahlungsstatus ist unklar. Die Zahlung könnte bereits gesendet worden sein. Prüfe deine Aktivität in Trust Wallet oder im Explorer, bevor du eine neue Zahlung beginnst.');
      } else setTransferError(walletError(failure));
    }
    finally { setSending(false); }
  };

  const closeModal = () => { if (!sending) setModal(''); };
  const balance = privateBalance ? '••••' : displayBalance(wallet.balance);
  const walletButton = <button className="primary" disabled={wallet.connecting || wallet.loading} onClick={() => connected ? setModal('wallet') : wallet.connect()}><Icon name="wallet" size={18} />{wallet.connecting ? 'In Wallet bestätigen…' : wallet.loading ? 'Wallet wird geladen…' : connected ? shortAddress(wallet.account) : 'Trust Wallet verbinden'}</button>;

  const holdings = <section className="panel holdings-panel"><div className="panel-head"><div><p className="eyebrow">DEINE ASSETS</p><h3>Wallet-Portfolio</h3></div><button className="text-button" disabled={!connected || wallet.loading} onClick={wallet.refresh}><Icon name="refresh" size={16} />Aktualisieren</button></div><div className="table-scroll"><table><thead><tr><th>Asset</th><th>Netzwerk</th><th>Guthaben</th><th>Verfügbarkeit</th><th><span className="sr-only">Aktion</span></th></tr></thead><tbody><tr><td><div className="asset-name"><Ethereum small /><div><strong>Ethereum</strong><span>ETH</span></div></div></td><td>{network?.name ?? 'Ethereum / Sepolia'}</td><td className="numeric">{wallet.loading ? <span className="skeleton" /> : `${balance} ETH`}</td><td><span className={`badge ${ready ? 'green' : ''}`}><span className="status-dot" />{ready ? 'On-chain' : connected ? 'Netzwerk prüfen' : 'Wallet verbinden'}</span></td><td><button className="icon-button" aria-label="Ethereum empfangen" onClick={() => openAction('receive')}><Icon name="down" size={18} /></button></td></tr></tbody></table></div><p className="panel-note">{connected ? 'Nur der native ETH-Bestand wird aus deiner Wallet gelesen. Tokens und andere Netzwerke sind hier noch nicht integriert.' : 'Verbinde deine Wallet, um dein echtes Guthaben zu sehen. Es werden keine Beispielbeträge angezeigt.'}</p></section>;

  const activity = <section className="panel"><div className="panel-head"><div><p className="eyebrow">ON-CHAIN</p><h3>Deine Aktivität</h3></div>{connected && network && <a className="text-button" href={`${network.explorer}/address/${wallet.account}`} target="_blank" rel="noopener noreferrer">Alle Transaktionen<Icon name="external" size={16} /></a>}</div>{transaction ? <div className="transaction-row"><span className="action-symbol"><Icon name="up" /></span><div className="transaction-info"><strong>{privateBalance ? '••••' : transaction.amount} ETH gesendet</strong><span>An {shortAddress(transaction.to)} · {networks[transaction.chainId].name}</span><a href={`${networks[transaction.chainId].explorer}/tx/${transaction.hash}`} target="_blank" rel="noopener noreferrer">Im Explorer prüfen<Icon name="external" size={13} /></a></div><span className={`badge ${transaction.status === 'confirmed' ? 'green' : transaction.status === 'failed' ? 'red' : ''}`}>{transaction.status === 'confirmed' ? 'Bestätigt' : transaction.status === 'failed' ? 'Fehlgeschlagen' : 'Ausstehend'}</span></div> : <div className="empty-state"><span className="empty-icon"><Icon name="activity" size={28} /></span><strong>Noch keine Zahlung in dieser Sitzung</strong><p>Deine Blockchain-Historie bleibt in Trust Wallet und im Explorer verfügbar.</p><button className="secondary" onClick={() => openAction('send')}>ETH senden<Icon name="arrow" size={16} /></button></div>}{transaction?.status === 'pending' && (wallet.chainId !== transaction.chainId || !wallet.provider) && <p className="inline-message">Verbinde deine Wallet mit {networks[transaction.chainId].name}, um die Bestätigung hier zu prüfen. Der Explorer bleibt verfügbar.</p>}{receiptError && <p className="inline-message">Der Status ist gerade nicht abrufbar. Die Prüfung wird wiederholt. Prüfe vor einer weiteren Zahlung den Explorer.</p>}</section>;

  return <div className={`app-shell ${textured ? 'textured' : ''}`}>
    <aside className="sidebar"><button className="brand" onClick={() => setPage('overview')} aria-label="Aether Übersicht"><span className="brand-mark">A<span /></span><span>AETHER<small>YOUR CRYPTO. YOUR CONTROL.</small></span></button><p className="nav-label">WORKSPACE</p><nav aria-label="Hauptnavigation">{navigation.map(([key, label, icon]) => <button key={key} className={`nav-item ${page === key ? 'active' : ''}`} aria-current={page === key ? 'page' : undefined} onClick={() => setPage(key)}><Icon name={icon} size={19} />{label}{key === 'overview' && <span className="nav-indicator" />}</button>)}</nav><div className="sidebar-bottom"><div className="self-custody"><Icon name="shield" size={23} /><strong>Deine Keys.<br />Deine Kontrolle.</strong><p>Aether verwahrt keine Coins. Du bestätigst jede Zahlung in Trust Wallet.</p></div><button className={`nav-item ${page === 'support' ? 'active' : ''}`} aria-current={page === 'support' ? 'page' : undefined} onClick={() => setPage('support')}><Icon name="help" size={19} />Hilfe & Support<Icon name="external" size={14} /></button><span className="sidebar-foot">AETHER · WALLET WORKSPACE</span></div></aside>

    <main className="main-panel"><header className="topbar"><div className="breadcrumb">Workspace<span>/</span><strong>{title}</strong></div><div className="topbar-actions"><button className="network-button" onClick={() => setModal('network')}><span className={`status-dot ${ready ? 'live' : ''}`} />{network?.name ?? (connected ? 'Netzwerk prüfen' : 'Ethereum')}<span className="chevron">⌄</span></button>{walletButton}</div></header><div className="page-heading"><div><p className="eyebrow">DEIN PERSÖNLICHER CRYPTO WORKSPACE</p><h1>{page === 'overview' ? <>Alles im Blick<span className="accent">.</span></> : title}</h1><p>{page === 'overview' ? 'Weniger Komplexität. Mehr Kontrolle über deine Coins.' : 'Direkt mit deiner Wallet. Transparent und unter deiner Kontrolle.'}</p></div><span className="workspace-tag"><Icon name="shield" size={15} />Self-custody</span></div>

      {wallet.error && <div className="alert error" role="alert"><Icon name="help" />{wallet.error}<button className="text-button" disabled={wallet.connecting || wallet.loading} onClick={() => wallet.provider ? wallet.refresh() : wallet.connect()}>Erneut versuchen</button></div>}
      {wallet.missing && <div className="alert"><Icon name="wallet" /><div><strong>Trust Wallet ist in diesem Browser nicht verfügbar.</strong><p>Am Desktop brauchst du die Trust-Wallet-Erweiterung. Auf dem Handy kannst du diese Seite im DApp-Browser öffnen; falls dein Gerät das nicht unterstützt, nutze die Desktop-Erweiterung.</p><div className="inline-actions"><a className="text-button" href={trustLink('/open_url', { coin_id: '60', url: window.location.href })} target="_blank" rel="noopener noreferrer">In Trust Wallet öffnen<Icon name="external" size={14} /></a><a className="text-button" href="https://trustwallet.com/download" target="_blank" rel="noopener noreferrer">Trust Wallet installieren<Icon name="external" size={14} /></a></div></div><button className="icon-button" aria-label="Trust Wallet erneut erkennen" onClick={wallet.connect} disabled={wallet.connecting}><Icon name="refresh" /></button></div>}
      {network?.testnet && <div className="alert"><Icon name="globe" />Sepolia-Testnetz: Die angezeigten ETH sind Test-Coins und kein echtes Guthaben auf Ethereum.</div>}
      {connected && !network && <div className="alert error" role="alert">Dieses Netzwerk wird noch nicht unterstützt. Wechsle zu Ethereum oder Sepolia.<button className="text-button" onClick={() => setModal('network')}>Netzwerk wählen</button></div>}

      {page === 'overview' && <><div className="overview-grid"><section className="balance-panel panel"><div className="balance-orbit" aria-hidden="true"><span /><span /><span /></div><div className="balance-top"><span className="eyebrow">WALLET-GUTHABEN</span><button className="privacy-button" onClick={() => setPrivateBalance(!privateBalance)} aria-pressed={privateBalance}>{privateBalance ? 'Anzeigen' : 'Verbergen'}</button></div><div className="balance-value">{wallet.loading ? <span className="skeleton balance-skeleton" /> : balance}<span>ETH</span></div><div className="balance-caption"><span className={`status-dot ${ready ? 'live' : ''}`} />{ready ? `${network.name} · direkt aus deiner Wallet` : connected ? 'Guthaben nicht verfügbar' : 'Verbinde Trust Wallet für dein echtes Guthaben'}</div><div className="quick-actions"><button className="primary" onClick={() => openAction('receive')}><Icon name="down" size={17} />Empfangen</button><button className="secondary" onClick={() => openAction('send')}><Icon name="up" size={17} />Senden</button><button className="secondary" onClick={() => setPage('trading')}><Icon name="arrows" size={17} />Tauschen</button></div></section><section className="wallet-panel panel"><div className="panel-head"><p className="eyebrow">DEINE VERBINDUNG</p><span className={`badge ${connected ? 'green' : ''}`}><span className="status-dot" />{connected ? 'Verbunden' : 'Nicht verbunden'}</span></div><div className="wallet-emblem"><Icon name="shield" size={31} /></div><h3>Trust Wallet</h3><p>Deine Wallet bleibt bei dir.<br />Aether ist dein übersichtlicher Zugang.</p><button className="wallet-connect-link" disabled={wallet.connecting || wallet.loading} onClick={() => connected ? setModal('wallet') : wallet.connect()}>{connected ? 'Verbindung verwalten' : wallet.connecting ? 'In Trust Wallet bestätigen…' : 'Wallet verbinden'}<Icon name="arrow" size={19} /></button></section></div><div className="section-caption"><span>DEIN VERMÖGEN, KLAR STRUKTURIERT</span><span>01 / ÜBERSICHT</span></div>{holdings}<div className="detail-grid">{activity}<section className="panel guide-panel"><span className="eyebrow">GUT ZU WISSEN</span><h3>Ein Workspace.<br /><span>Keine fremden Hände.</span></h3><p>Du behältst die Kontrolle über deine Assets. Aether fragt niemals nach deiner Seed-Phrase oder privaten Schlüsseln.</p><button className="text-button" onClick={() => setPage('security')}>So bleibt deine Wallet sicher<Icon name="arrow" size={16} /></button><span className="guide-watermark" aria-hidden="true"><Icon name="shield" size={135} /></span></section></div></>}
      {page === 'portfolio' && <>{holdings}<section className="panel compact-panel"><Icon name="pie" size={35} /><div><h3>Keine erfundenen Kurse. Keine fiktiven Gewinne.</h3><p>Dieser Workspace zeigt native ETH auf Ethereum und Sepolia. Fiatbewertungen, BTC, SOL und ERC-20-Bestände sind noch nicht angebunden.</p></div><button className="secondary" onClick={() => openAction('receive')}>Empfangen<Icon name="down" size={16} /></button></section></>}
      {page === 'activity' && activity}
      {page === 'trading' && <section className="panel feature-panel"><span className="feature-icon"><Icon name="arrows" size={34} /></span><p className="eyebrow">WEITER IN DEINER WALLET</p><h2>Coins tauschen.<br /><span>Mit Trust Wallet.</span></h2><p>Öffne die Swap-Funktion von Trust Wallet. Verfügbare Assets, Kurse, Gebühren und Freigaben werden dort angezeigt. Aether führt selbst keine Swaps aus.</p><a className="primary" href={trustLink('/swap', { from: 'c60', to: 'c60_t0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' })} target="_blank" rel="noopener noreferrer">Swap in Trust Wallet öffnen<Icon name="external" size={17} /></a><div className="feature-note"><Icon name="help" size={16} />Öffnet die externe Trust-Wallet-App. Kein automatischer Kauf oder Tausch.</div></section>}
      {page === 'staking' && <section className="panel feature-panel"><span className="feature-icon"><Icon name="layers" size={34} /></span><p className="eyebrow">TRANSPARENTER STATUS</p><h2>Staking ohne<br /><span>leere Versprechen.</span></h2><p>Es ist noch kein Staking-Protokoll angebunden. Deshalb zeigen wir keine erfundenen Renditen und nehmen keine Staking-Einzahlungen entgegen. Prüfe unterstützte Assets und Risiken direkt in Trust Wallet.</p><a className="secondary" href="https://trustwallet.com/staking" target="_blank" rel="noopener noreferrer">Staking bei Trust Wallet ansehen<Icon name="external" size={17} /></a></section>}
      {page === 'cards' && <section className="panel feature-panel"><div className="concept-card" aria-label="Designvorschau einer Karte, nicht verfügbar"><div>AETHER<Icon name="card" size={23} /></div><strong>Dein nächstes Kapitel.</strong><span>KONZEPT · NICHT VERFÜGBAR</span></div><p className="eyebrow">KARTEN / KONZEPT</p><h2>Eine klare Grenze.<br /><span>Keine fiktive Bankkarte.</span></h2><p>Eine echte Zahlungskarte benötigt einen angebundenen Kartenanbieter. Aktuell sind weder Kartenbestellung noch Kartenzahlungen verfügbar. Die Abbildung ist nur eine Designvorschau.</p><button className="secondary" onClick={() => setPage('support')}>Mehr zum aktuellen Funktionsumfang<Icon name="arrow" size={16} /></button></section>}
      {page === 'security' && <section className="panel"><div className="panel-head"><div><p className="eyebrow">SELF-CUSTODY</p><h3>Sicherheit beginnt bei deiner Wallet.</h3></div><Icon name="shield" size={28} /></div><div className="security-list">{[['Keine Schlüssel auf der Seite', 'Seed-Phrase und private Schlüssel gehören nur in deine Wallet. Aether fragt sie nicht ab.'], ['Du gibst jede Zahlung frei', 'Empfänger, Betrag, Netzwerk und Gebühren prüfen. Die endgültige Bestätigung erfolgt in Trust Wallet.'], ['Verbinden ist keine Kontoregistrierung', 'Die Wallet-Verbindung teilt deine öffentliche Adresse. Sie erstellt kein Bankkonto und ist keine serverseitige Anmeldung.'], ['Berechtigungen bewusst verwalten', 'Das Trennen hier beendet die Verbindung zur Seite. Bestehende Website-Berechtigungen kannst du zusätzlich in Trust Wallet widerrufen.']].map(([heading, text]) => <div key={heading}><span className="security-check"><Icon name="check" size={18} /></span><div><h4>{heading}</h4><p>{text}</p></div></div>)}</div><div className="security-footer"><span>{connected ? `Verbunden: ${shortAddress(wallet.account)}` : 'Aktuell ist keine Wallet verbunden.'}</span>{connected ? <button className="secondary" onClick={() => { wallet.disconnect(); setNotice('Verbindung zur Seite getrennt.'); }}>Verbindung trennen</button> : walletButton}</div></section>}
      {page === 'settings' && <section className="panel"><div className="panel-head"><div><p className="eyebrow">DEIN WORKSPACE</p><h3>So, wie du es magst.</h3></div><Icon name="settings" size={26} /></div><div className="setting-row"><div><h4>Feine Oberflächentexturen</h4><p>Graphitstruktur und dezentes Raster im Hintergrund.</p></div><button className={`toggle ${textured ? 'on' : ''}`} role="switch" aria-checked={textured} aria-label="Oberflächentexturen" onClick={() => setTextured(!textured)}><span /></button></div><div className="setting-row"><div><h4>Guthaben verbergen</h4><p>Schützt deinen Kontostand vor neugierigen Blicken.</p></div><button className={`toggle ${privateBalance ? 'on' : ''}`} role="switch" aria-checked={privateBalance} aria-label="Guthaben verbergen" onClick={() => setPrivateBalance(!privateBalance)}><span /></button></div><div className="setting-row"><div><h4>Blockchain-Netzwerk</h4><p>{network?.name ?? 'Ethereum und Sepolia werden unterstützt.'}</p></div><button className="secondary" onClick={() => setModal('network')}>Netzwerk wählen<Icon name="globe" size={16} /></button></div><p className="panel-note">Anzeige-Einstellungen gelten nur für diese Sitzung. Es werden keine Nutzerprofile gespeichert.</p></section>}
      {page === 'support' && <section className="panel"><div className="panel-head"><div><p className="eyebrow">HILFE & ORIENTIERUNG</p><h3>Dein Start mit Aether.</h3></div><Icon name="help" size={28} /></div><div className="faq-list">{[['Wie verbinde ich Trust Wallet?', 'Installiere die offizielle Trust-Wallet-Erweiterung am Desktop und klicke auf „Trust Wallet verbinden“. Auf unterstützten Mobilgeräten öffnest du diese Seite im DApp-Browser von Trust Wallet. WalletConnect per QR-Code ist hier noch nicht integriert.'], ['Was kann ich tatsächlich tun?', 'Du kannst deine Wallet verbinden, natives ETH-Guthaben auf Ethereum oder Sepolia abrufen, deine Empfangsadresse kopieren und ETH mit Wallet-Bestätigung senden. Swaps öffnen die externe Trust-Wallet-App.'], ['Warum fehlen Kurse oder andere Coins?', 'Es sind keine Kursdaten und keine weiteren Assets angebunden. Deshalb werden keine ausgedachten Kontostände, Renditen oder Transaktionen angezeigt.'], ['Ist Aether bereits eine Bank?', 'Nein. Diese Seite ist ein nicht-verwahrender Wallet-Workspace, kein Bankkonto. Bankdienste, Euro-Einzahlungen, Karten und eigene Handels- oder Staking-Angebote sind nicht angebunden.'], ['Was passiert nach einer Zahlung?', 'Der Transaktions-Hash wird nach dem Senden angezeigt. Erst ein erfolgreicher Blockchain-Beleg gilt hier als bestätigt. Du kannst den Status unabhängig im Explorer oder in Trust Wallet prüfen.']].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div><a className="secondary" href="https://support.trustwallet.com" target="_blank" rel="noopener noreferrer">Offizieller Trust-Wallet-Support<Icon name="external" size={16} /></a></section>}
      <footer className="main-footer"><span><span className="status-dot" />Nicht-verwahrender Wallet-Workspace · keine Bankdienste</span><span>BUILT FOR YOUR INDEPENDENCE.</span></footer>
    </main>

    {notice && <div className="toast" role="status"><Icon name="check" size={19} />{notice}<button className="icon-button" aria-label="Meldung schließen" onClick={() => setNotice('')}><Icon name="close" size={16} /></button></div>}
    {modal && <Modal title={{ connect: 'Deine Wallet verbinden', wallet: 'Deine Trust Wallet', network: 'Netzwerk wählen', receive: 'ETH empfangen', send: 'ETH senden' }[modal]} busy={sending} onClose={closeModal}>
      {(modal === 'connect' || modal === 'wallet') && <><div className="dialog-wallet-icon"><Icon name="shield" size={38} /></div><p className="modal-description">{connected ? 'Deine öffentliche Adresse. Deine Schlüssel bleiben in Trust Wallet.' : 'Verbinde Trust Wallet, um dein echtes ETH-Guthaben zu lesen und Transaktionen selbst zu bestätigen.'}</p>{connected ? <><div className="address-box">{wallet.account}</div><div className="modal-actions"><button className="secondary" onClick={() => copy(wallet.account)}><Icon name="copy" size={16} />Adresse kopieren</button><button className="secondary" onClick={() => { wallet.disconnect(); closeModal(); setNotice('Verbindung zur Seite getrennt.'); }}>Trennen</button></div></> : <button className="primary full-width" disabled={wallet.connecting || wallet.loading} onClick={wallet.connect}>{wallet.connecting ? 'In Trust Wallet bestätigen…' : 'Trust Wallet verbinden'}<Icon name="wallet" size={18} /></button>}<p className="panel-note">Kein Bankkonto. Keine Seed-Phrase nötig. Die Verbindung autorisiert keine Zahlung.{connected ? ' Website-Berechtigungen bleiben bis zum Widerruf in Trust Wallet bestehen.' : ''}</p></>}
      {modal === 'network' && <><p className="modal-description">ETH wird auf diesen Netzwerken unterstützt. Ein Wechsel benötigt deine Zustimmung in Trust Wallet.</p><div className="network-options">{Object.entries(networks).map(([chainId, info]) => <button key={chainId} className={`network-option ${wallet.chainId === chainId ? 'selected' : ''}`} disabled={wallet.connecting || wallet.loading} onClick={() => wallet.switchNetwork(chainId)}><Ethereum small /><div><strong>{info.name}</strong><span>{info.testnet ? 'Testnetz · nur Test-ETH' : 'Mainnet · echtes ETH'}</span></div>{wallet.chainId === chainId ? <Icon name="check" /> : <Icon name="arrow" />}</button>)}</div>{!connected && <p className="panel-note">Verbinde zuerst Trust Wallet. Anschließend kannst du das Netzwerk auswählen.</p>}</>}
      {modal === 'receive' && <><div className="receive-heading"><Ethereum /><span className="badge green">{network?.name}</span></div><p className="modal-description">Sende ausschließlich ETH über <strong>{network?.name}</strong> an diese Adresse. Prüfe die Adresse auch in Trust Wallet. Ein anderes Netzwerk kann zum Verlust deiner Coins führen.</p><p className="field-label">Deine Empfangsadresse</p><div className="address-box">{wallet.account || 'Keine Wallet verbunden'}</div><button className="primary full-width" disabled={!ready} onClick={() => copy(wallet.account)}><Icon name="copy" size={17} />Adresse kopieren</button>{connected && network && <a className="text-button centered" href={`${network.explorer}/address/${wallet.account}`} target="_blank" rel="noopener noreferrer">Adresse im Explorer prüfen<Icon name="external" size={15} /></a>}<p className="panel-note">Aether nimmt keine Euro-Einzahlungen entgegen und verwahrt kein Guthaben.</p></>}
      {modal === 'send' && <><p className="modal-description">{network?.name} · Verfügbar: {privateBalance ? '••••' : wallet.balance === null ? 'nicht abrufbar' : formatEther(wallet.balance)} ETH</p>{review ? <div className="transfer-review"><span className="badge">ZAHLUNG PRÜFEN</span><h3>{review.amount} ETH</h3><p className="field-label">Empfänger</p><div className="address-box">{review.request.to}</div><div className="review-row"><span>Netzwerk</span><strong>{networks[review.chainId]?.name}</strong></div><div className="review-row"><span>Geschätzte Netzwerkgebühr</span><strong>{formatEther(review.fee)} ETH</strong></div><p className="warning-note">Die endgültige Gebühr zeigt Trust Wallet. Blockchain-Zahlungen sind nicht rückgängig zu machen. Prüfe Betrag, Adresse und Netzwerk dort erneut.</p><button className="primary full-width" disabled={sending || !ready || review.uncertain} onClick={sendTransfer}>{review.uncertain ? 'Zahlungsstatus zuerst prüfen' : sending ? 'In Trust Wallet bestätigen…' : 'In Trust Wallet bestätigen'}<Icon name="external" size={17} /></button>{review.uncertain ? <a className="text-button centered" href={`${networks[review.chainId].explorer}/address/${review.request.from}`} target="_blank" rel="noopener noreferrer">Wallet-Aktivität im Explorer prüfen<Icon name="external" size={15} /></a> : <button className="text-button centered" disabled={sending} onClick={() => setReview(null)}>Zurück zum Formular</button>}</div> : <form onSubmit={prepareTransfer}><label className="field-label" htmlFor="recipient">Empfängeradresse</label><input id="recipient" autoComplete="off" spellCheck="false" placeholder="0x…" value={recipient} onChange={(event) => setRecipient(event.target.value)} disabled={sending} required /><label className="field-label" htmlFor="amount">Betrag in ETH</label><div className="amount-input"><input id="amount" inputMode="decimal" placeholder="0,00" value={amount} onChange={(event) => setAmount(event.target.value)} disabled={sending} required /><span>ETH</span></div><p className="panel-note">Lass ausreichend ETH für die Netzwerkgebühr in deiner Wallet.</p><button className="primary full-width" type="submit" disabled={sending || !ready}>{sending ? 'Zahlung wird geprüft…' : 'Zahlung prüfen'}<Icon name="arrow" size={17} /></button></form>}{transferError && <p className="inline-message error" role="alert">{transferError}</p>}</>}
      {wallet.error && <p className="inline-message error" role="alert">{wallet.error}</p>}{wallet.missing && <p className="inline-message">Trust Wallet nicht erkannt. <a href={trustLink('/open_url', { coin_id: '60', url: window.location.href })} target="_blank" rel="noopener noreferrer">Seite in Trust Wallet öffnen</a> oder die <a href="https://trustwallet.com/download" target="_blank" rel="noopener noreferrer">Erweiterung installieren</a>.</p>}
    </Modal>}
  </div>;
}

export default App;
