# Aether – Trust Wallet Workspace

Ein deutschsprachiger, nicht-verwahrender Wallet-Workspace mit React und Vite. Aether ist kein Bankkonto und bietet keine eigenen Bank-, Karten-, Handels- oder Staking-Dienste an.

## Lokal starten

```sh
npm install
npm run dev
```

Für eine lokale Netlify-Umgebung: `netlify dev --port 8889`.

## Trust Wallet

Am Desktop wird die offizielle Trust-Wallet-Erweiterung benötigt. Die Erkennung nutzt EIP-6963 (`com.trustwallet.app`) und für ältere bzw. mobile Provider die Trust-Wallet-Kennzeichnung. Andere Browser-Wallets werden nicht automatisch verbunden. Auf unterstützten Mobilgeräten lässt sich die Seite über den angezeigten Deep Link im Trust-Wallet-DApp-Browser öffnen. Ein WalletConnect-QR-Code ist nicht implementiert.

Nach expliziter Freigabe werden die öffentliche Adresse, das Netzwerk und das native ETH-Guthaben direkt über den Wallet-Provider gelesen. Unterstützt werden Ethereum Mainnet und Sepolia (Test-ETH). Andere Netzwerke werden nicht fälschlich als ETH angezeigt. Der Kontostand wird regelmäßig aktualisiert; Konto- und Netzwerkwechsel werden berücksichtigt.

Empfangen zeigt die tatsächliche öffentliche Wallet-Adresse. ETH senden prüft die Empfängeradresse, den Betrag, das Netzwerk und die geschätzten Gebühren, zeigt eine separate Zahlungsprüfung und benötigt anschließend die Bestätigung in Trust Wallet. Ein Transaktions-Hash ist noch keine Erfolgsbestätigung: Der Blockchain-Beleg wird abgefragt und bestätigt oder fehlgeschlagen angezeigt. Bei unklarer Antwort auf eine Zahlungsanfrage wird die erneute Bestätigung in diesem Dialog gesperrt und auf die externe Aktivitätsprüfung verwiesen. Die endgültige Gebühr legt die Wallet fest. Vor echtem Einsatz zuerst auf Sepolia testen.

Trading öffnet die externe Swap-Funktion der Trust-Wallet-App. Aether erhält weder Kursangebote noch Swap-Ausführungsbestätigungen und führt selbst keine Swaps aus. Staking und Karten werden ausdrücklich als nicht angebunden angezeigt. Es gibt keine fiktiven Guthaben, Kursdaten oder Sicherheitsversprechen.

Es werden keine privaten Schlüssel, Seed-Phrasen, Nutzerprofile oder Transaktionslisten gespeichert. Die Anzeige der zuletzt hier gesendeten Zahlung und die Darstellungseinstellungen gelten nur für die laufende Sitzung; die Blockchain bzw. Trust Wallet bleibt die Quelle für Guthaben und Historie. Das Trennen der Seite widerruft keine dauerhaft vergebenen Wallet-Berechtigungen; diese müssen in Trust Wallet entfernt werden.

## Grenzen

Noch nicht integriert: ERC-20-Tokenbestände, BTC/SOL, Fiatkurse, WalletConnect, Bank-/Eurokonten, Kartenanbieter, serverseitige Benutzerkonten und Staking-Protokolle. Eine Wallet-Verbindung stellt keine serverseitige Authentifizierung dar. Für einen Betrieb als echte Crypto-Bank wären zusätzliche Anbieteranbindungen, Sicherheitsprüfungen und die erforderlichen rechtlichen Voraussetzungen notwendig.

Die Integration orientiert sich an der offiziellen Trust-Wallet-Dokumentation zu EVM-Providern und Deep Links sowie der ethers-v6-Dokumentation. Die Site benötigt für diese Funktionen keine API-Schlüssel und keine Datenbank.
