# Redbelly Access portal: text quoted in the guide

Checked on 13 October 2026 at https://access.redbelly.network/

The portal is a web app, so its on-screen text ships inside its public JavaScript files. Anyone can open these files in a browser and search for the quotes below. The file names change when Redbelly releases a new version of the portal. If a link stops working, use the steps below. They search whatever version is live.

## How to check a quote yourself

1. Open https://access.redbelly.network/ in Chrome or Edge on a computer.
2. Press F12 to open developer tools, then open the **Sources** tab.
3. Press **Ctrl+Shift+F** (Cmd+Option+F on Mac). This searches every file the portal loaded.
4. Type the text in a **Search for** line below, exactly as written, and press Enter.
5. Click a result to see the line in the portal's code. Press the `{}` button at the bottom of the code panel to make it readable.

Search for the portal's own words, not this page's descriptions. The text in quotation marks is what the portal shows on screen.

| File | SHA-256 on 13 October 2026 |
|---|---|
| https://access.redbelly.network/_next/static/chunks/pages/index-25986869981a8ae9.js | 4a128d38b556eeae044f703b1aba895f9ec7fa3d7872020c2d6038718d7db357 |
| https://access.redbelly.network/_next/static/chunks/pages/_app-cee7356aa3975380.js | 6699d0cdb7c326000388f1454596c95cd900a0fab7677fc0a04a283c97548e6a |

## E1: Wallet limit

Found in the index file.

**Search for:** `Account allocation exhausted`

The Accounts screen hides the "Add another account" button and shows a notice once 10 accounts are linked to one identity. The code reads like this (the letter before `.length` can differ between versions):

```
L.length>=Number("10") ? ... children:"Account allocation exhausted."
```

With `{}` formatting on, it appears as `L.length >= Number("10") ? (0, i.jsx)(d.A, {severity: "info", children: "Account allocation exhausted."})`.

The same screen shows the heading "Accounts", the line "Manage your Redbelly Network Accounts", and the buttons "Add another account" and "Link another wallet".

## E2: Approval time and outcomes

Found in the _app file.

**Search for:** `could take a few days`

```
PENDING = "Your identity is being verified by the accredited issuer. This could take a few minutes but in some (rare) cases it could take a few days. Please check again soon."
FAIL    = "The issuer, Averer, was not able to verify your identity. You may need to reach out to Averer directly."
RETRY   = "The issuer, Averer, is not yet able to verify your identity. You may need to resubmit some information. If you continue having trouble however, you may need to reach out to Averer directly."
```

Screen headings for these states (index file): "Identity verification pending", "Identity verification incomplete", "Identity verification failed". Buttons: "Check verification status", "Retry identity verification", "CONTACT AVERER".

## E3: Step by step screens

Found in the index file.

**Search for:** `Begin identity verification`, `Continue with Averer`, `Enable account`, `provide accounts with the funds`

1. "Get started", "Connect your wallet to the Redbelly Network.", button "Connect wallet", link "ADD NETWORK MANUALLY". Note under it: "Note: the account(s) you use to connect will become your public address(es) on Redbelly Network."
2. "Get access credential", button "Begin identity verification". Small print under it: "Identity verification is provided by accredited issuer(s) on the network, who will issue Redbelly Network Access Credentials and provide accounts with the funds required to enable them with network access."
3. "Important information regarding identity verification": "The identity verification process will be managed by Averer, an accredited issuer on Redbelly Network." "To prove your identity, you must provide Averer with some documentation, such as a passport. This data is not shared with, nor stored on, Redbelly Network." Checkbox "I understand", button "Continue with Averer".
4. "We need you to allow the accredited issuer to access your public address." "Please check your wallet to sign the transaction allowing the accredited issuer to access your public address."
5. Window titled "Interacting with averer.co".
6. Account panel: "Account status: Not enabled" or "Enabled", button "Enable account", "Check your wallet to sign the transaction that will enable your account."
7. If funds have not arrived: "It seems you haven't received the RBNT yet, which you will need to enable you account. Please wait a few minutes and try again." Button "RETRY".
8. If the account has no funds and none are on the way: "To pay the transaction fee required to enable this account, this account must first be funded with at least [amount] USD worth RBNT coins. You can transfer from another account or, review information on getting RBNT coins."
9. After access: "Next steps", "Now that you have access to Redbelly Network, you can start to interact:".

## E4: Adding wallets

Found in the index file.

**Search for:** `Link another wallet`, `attached to another account`

- "Add another account": "To add another account, use your wallet to switch the connection to this site with the account which you want to access Redbelly with." Wallet prompt: "Check your wallet to sign the transaction to link this account to your verified identity."
- "Link another wallet": "To link another wallet to your verified identity, you must use the Dynamic widget in the top right corner of the dApp to connect the additional wallet." "By linking another wallet, you will be accountable for all the actions taken by that wallet on the network."
- Error: "The address you're trying to add is attached to another account."

## E5: Portal FAQ

The "Having trouble?" section, found in the _app file. It is also visible on the portal's home page without connecting a wallet.

**Search for:** `Do I need to pay for access`, `MetaMask and Coinbase Wallet`

- "Do I need to pay for access?" "No, the accredited issuer that verifies your identity will cover any associated fees required to grant your network access."
- "Which wallets can I use to gain access to Redbelly Network?" "MetaMask and Coinbase Wallet can be used to get access."
- "Can I get access to Redbelly Network for multiple accounts?" "Yes, once you have completed the process of identity verification and enabling your first account, you will be offered the option to add more accounts which will be connected to your identity."
- "Who will verify my identity?" "Your identity will be verified by an accredited issuer, Averer."
- "Need some extra support?" Identity verification problems: "contact Averer" (links to https://www.averer.co/). Connection or account errors: "Redbelly Support" (links to https://vine.redbelly.network/support).
