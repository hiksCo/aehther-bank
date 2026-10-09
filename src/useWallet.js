import { useCallback, useEffect, useRef, useState } from 'react';
import { getAddress } from 'ethers';
import { networks, normalizeChain, walletError } from './wallet';

const disconnected = { account: '', chainId: '', balance: null };

export default function useWallet() {
  const discovered = useRef(null);
  const syncRef = useRef(null);
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(disconnected);
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const announce = (event) => {
      if (event.detail?.info?.rdns === 'com.trustwallet.app' && typeof event.detail.provider?.request === 'function') {
        discovered.current = event.detail.provider;
        setMissing(false);
      }
    };
    window.addEventListener('eip6963:announceProvider', announce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    return () => window.removeEventListener('eip6963:announceProvider', announce);
  }, []);

  useEffect(() => {
    if (!provider) return;
    let disposed = false;
    let version = 0;
    const sync = async (accounts, foreground = true) => {
      const currentVersion = ++version;
      if (foreground) {
        setLoading(true);
        setWallet(disconnected);
      }
      try {
        const addresses = accounts ?? await provider.request({ method: 'eth_accounts' });
        const account = addresses?.[0] ? getAddress(addresses[0]) : '';
        const chainId = normalizeChain(await provider.request({ method: 'eth_chainId' }));
        const balance = account && networks[chainId]
          ? BigInt(await provider.request({ method: 'eth_getBalance', params: [account, 'latest'] }))
          : null;
        if (!disposed && currentVersion === version) {
          setWallet({ account, chainId, balance });
          setError('');
        }
      } catch (failure) {
        if (!disposed && currentVersion === version) {
          setWallet(disconnected);
          setError(walletError(failure));
        }
      } finally {
        if (!disposed && currentVersion === version) setLoading(false);
      }
    };
    const onAccounts = (accounts) => sync(accounts);
    const onChain = () => sync();
    const onDisconnect = () => {
      setProvider(null);
      setWallet(disconnected);
      setLoading(false);
      setError('Trust Wallet wurde getrennt. Verbinde die Wallet erneut.');
    };
    syncRef.current = sync;
    provider.on?.('accountsChanged', onAccounts);
    provider.on?.('chainChanged', onChain);
    provider.on?.('disconnect', onDisconnect);
    sync();
    const timer = window.setInterval(() => sync(undefined, false), 20000);
    return () => {
      disposed = true;
      syncRef.current = null;
      window.clearInterval(timer);
      provider.removeListener?.('accountsChanged', onAccounts);
      provider.removeListener?.('chainChanged', onChain);
      provider.removeListener?.('disconnect', onDisconnect);
    };
  }, [provider]);

  const connect = async () => {
    setError('');
    setMissing(false);
    const candidates = [window.trustwallet, ...(window.ethereum?.providers ?? []), window.ethereum];
    const selected = discovered.current ?? candidates.find((candidate) =>
      typeof candidate?.request === 'function' && (candidate.isTrust || candidate.isTrustWallet)
    );
    if (!selected) { setMissing(true); return; }
    setConnecting(true);
    try {
      const accounts = await selected.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) throw new Error('No account');
      getAddress(accounts[0]);
      setProvider(selected);
      if (provider === selected) await syncRef.current?.(accounts);
    } catch (failure) { setError(walletError(failure)); }
    finally { setConnecting(false); }
  };

  const disconnect = () => {
    setProvider(null);
    setWallet(disconnected);
    setLoading(false);
    setError('');
  };

  const refresh = useCallback(() => syncRef.current?.(), []);
  const switchNetwork = async (chainId) => {
    if (!provider) return connect();
    setError('');
    try {
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
      await syncRef.current?.();
    } catch (failure) {
      setError(Number(failure?.code) === 4902
        ? 'Aktiviere dieses Netzwerk zuerst in Trust Wallet und versuche es erneut.'
        : walletError(failure));
    }
  };

  return { ...wallet, provider, connecting, loading, error, missing, connect, disconnect, refresh, switchNetwork, setError };
}
