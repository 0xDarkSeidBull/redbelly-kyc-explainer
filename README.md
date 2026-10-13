# Redbelly KYC and Wallet Activation Explainer

A plain-language guide for the Redbelly community. It answers whether you need KYC, the five questions people ask most, how to get verified through Redbelly Access and Averer, and what to do when verification goes wrong. Every fact links to an official source.

Last verified: 13 October 2026.

## Deliverables

| # | Deliverable | File |
|---|---|---|
| 1 | The guide, Parts A to D | Live at https://kyc.test-hub.xyz. Web page: `docs/index.html` (published with GitHub Pages). PDF: `docs/KYC-and-Wallet-Activation-Explainer.pdf` |
| 2 | Part A decision guide as an image | `docs/img/decision-guide.png` (1080 x 1080 PNG) |
| 3 | Short version for pinning in Discord or Telegram | `docs/pin.txt`, posted together with the image above |
| 4 | Source list with a link for every fact | The "Sources" section of the guide (S1 to S18, E1 to E5), plus `evidence/` |

## What is in the guide

- **Part A, Do I need KYC:** one table covering an exchange, bridged RBNT on other chains, bridging onto and off Redbelly mainnet, using mainnet, and staking.
- **Part B, five questions:** when KYC is needed, the 10 wallet limit, approval time, the DAO's regional position next to Redbelly Network's restricted jurisdictions, and staking.
- **Part C, get verified:** what you need, each step in the Redbelly Access portal with its exact button names, and how to add more wallets.
- **Part D, when something goes wrong:** slow approval, rejection, the wallet limit, connection errors, and how to open an Averer support ticket.

## How the facts were checked

- Official pages on vine.redbelly.network, docs.redbelly.network, redbelly.network, averer.co and Averer's support portal.
- The Redbelly Access portal's own on-screen text, including the wallet limit, the approval time message and the FAQ. Exact quotes and file hashes are in `evidence/access-portal-text.md`.
- The DAO vote on geographic restrictions, read from the Snapshot API. Result saved in `evidence/snapshot-dao-geographic-proposal.json`.
- Clause 15 of Redbelly's terms, saved in `evidence/terms-clause-15.txt`.

## Building

Everything is built from one source, `docs/index.html`, so the web page, PDF and image always match.

```
node scripts/build.mjs     # PDF and decision-guide.png
python3 scripts/check.py   # dashes, emoji, personal credit, and source ids
```

`build.mjs` needs Node with the `playwright` package and a Chromium build. `check.py` needs `pdftotext`.

## Deploying

See `deploy/README.md` for Vercel and for a server running nginx.

## Brand

Follows the Task Board brand kit at https://taskboard.redbellydao.network/brand: Be Vietnam Pro and JetBrains Mono (in `docs/fonts`, under the SIL Open Font License), the official colour tokens, the official logo without a plate, no em or en dashes, no emoji, and a dated "last verified" line on every graphic.
