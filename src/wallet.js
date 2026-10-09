import { formatEther, getAddress, isAddress, parseEther } from 'ethers';

export const networks = {
  '0x1': { name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io', testnet: false },
  '0xaa36a7': { name: 'Sepolia', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io', testnet: true }
};

export function normalizeChain(chainId) {
  return `0x${BigInt(chainId).toString(16)}`;
}

export function shortAddress(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Nicht verbunden';
}

export function displayBalance(balance) {
  if (balance === null) return '—';
  if (balance > 0n && balance < 100000000000000n) return '<0,0001';
  const [whole, fraction = ''] = formatEther(balance).split('.');
  return `${Number(whole).toLocaleString('de-DE')},${fraction.padEnd(4, '0').slice(0, 4)}`;
}

export function walletError(error) {
  const code = error?.code ?? error?.info?.error?.code;
  if (Number(code) === 4001 || code === 'ACTION_REJECTED') return 'In Trust Wallet abgebrochen. Es wurde nichts bestätigt.';
  if (Number(code) === -32002) return 'In Trust Wallet wartet bereits eine Anfrage. Öffne deine Wallet und bestätige oder schließe sie.';
  if (Number(code) === 4900 || Number(code) === 4901) return 'Die Wallet ist nicht mit dem Netzwerk verbunden. Prüfe Trust Wallet und versuche es erneut.';
  if (code === 'INSUFFICIENT_FUNDS') return 'Das Guthaben reicht für Betrag und Netzwerkgebühren nicht aus.';
  return 'Die Wallet-Anfrage konnte nicht abgeschlossen werden. Prüfe deine Verbindung und Trust Wallet und versuche es erneut.';
}

export function validateTransfer(recipient, amount, account) {
  if (!isAddress(recipient) || /^0x0{40}$/i.test(recipient)) throw new Error('Bitte gib eine gültige Ethereum-Empfängeradresse ein.');
  const address = getAddress(recipient);
  if (address.toLowerCase() === account?.toLowerCase()) throw new Error('Die Empfängeradresse ist deine eigene Wallet. Wähle einen anderen Empfänger.');
  const normalized = amount.trim().replace(',', '.');
  if (!/^\d+(\.\d{1,18})?$/.test(normalized)) throw new Error('Bitte gib einen positiven ETH-Betrag mit höchstens 18 Nachkommastellen ein.');
  const value = parseEther(normalized);
  if (value <= 0n) throw new Error('Der Betrag muss größer als null sein.');
  return { address, value };
}

export function trustLink(path, params = {}) {
  const url = new URL(path, 'https://link.trustwallet.com');
  url.search = new URLSearchParams(params).toString();
  return url.href;
}
