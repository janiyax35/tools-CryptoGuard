
# CryptoGuard AI 🛡️✨

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:0b1220&height=140&section=header&text=CryptoGuard%20AI&fontSize=56&fontColor=00eeff&animation=fadeIn&fontAlignY=40" alt="CryptoGuard AI" />
</p>

<p align="center">
  <a href="https://github.com/janiyax35/cyber-project-Encryption-Decryption-Tool-react"><img src="https://img.shields.io/badge/Project-CryptoGuard--AI-00bcd4?style=for-the-badge&logo=shield" alt="Project" /></a>
  <a href="https://github.com/janiyax35/cyber-project-Encryption-Decryption-Tool-react/actions"><img src="https://img.shields.io/badge/Status-Client--Side--Tool-2962FF?style=for-the-badge&logo=github" alt="Status" /></a>
  <img src="https://img.shields.io/badge/Technology-Vanilla%20JS%20%2F%20WebCrypto-0f172a?style=for-the-badge&logo=javascript" alt="Tech" />
  <img src="https://img.shields.io/badge/AI-Gemini-7c4dff?style=for-the-badge&logo=google" alt="AI" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212748842-9fcbad5b-6173-4175-8a61-521f3dbb7514.gif" width="720" alt="Live Preview" />
  <br />
  <em>Visit index.html directly or run locally to try encryption, hashing and the integrated AI tutor.</em>
</p>

---

## What is CryptoGuard AI?

CryptoGuard AI is a polished, client-side encryption and integrity toolkit with an educational spin:
- AES-256-GCM file encryption (PBKDF2 password derivation)
- Hashing & integrity checks (SHA-256 / SHA-512)
- Caesar cipher playground (educational)
- Built-in AI tutor (Gemini) to explain what each operation does and why
- Single-page static UI (no server required) — ideal for demos and local use

> Note: This tool runs in the browser using the Web Crypto API. It is intended for learning, secure convenience tasks, and demo use. For production-level secret management and multi-user workflows, prefer server-side solutions and proper key management.

---

## Quick Links (Files of interest)
- index.html — UI (Tailwind CDN, layout, modals)  
- js/main.js — UI & event handling  
- js/cryptoService.js — AES / Hash / Caesar implementations (Web Crypto API)  
- js/geminiService.js — Gemini AI integration (localStorage API key)  
- package.json — project metadata & scripts

---

## Features at a glance

- AES-256-GCM encryption with PBKDF2-derived keys (salt + IV embedded).
- Downloadable encrypted files (.enc) and decryption back to original bytes.
- SHA-256 / SHA-512 hashing of strings and files with visual match verification.
- Educational Caesar cipher with live shift control.
- AI Tutor (Gemini) explains cryptography concepts in-context (requires API Key).
- Clean dark / cyber-styled UI that matches the project's visual identity.

---

## Demo / Try it locally

Option A — Open static build:
1. Clone or download this repo.
2. Open `index.html` in your browser (double click or serve as static files).

Option B — Run with Vite (if you want dev server):
```bash
# install deps (if you plan to use dev tooling)
npm install

# start dev server (vite)
npm run dev
```

The UI is optimized for modern browsers that support the Web Crypto API (Chrome, Firefox, Edge). Safari support is generally fine but check for Web Crypto subtle API behavior on older versions.

---

## How-to: Encrypt & Decrypt (AES)

- Select a file in the AES panel.
- Enter a strong passphrase (PBKDF2 with 100k iterations is used to derive the key).
- Click "Encrypt & Download" to save a .enc file
- To decrypt: select the .enc file and provide the same passphrase, then "Decrypt & Download"

Implementation notes:
- File format saved: [salt (16 bytes)] + [iv (12 bytes)] + [ciphertext]
- Keep your passphrase safe. If lost, the file can't be recovered.

Source: js/cryptoService.js

---

## How-to: Verify Integrity (Hashing)

- Choose SHA-256 or SHA-512
- Enter text or upload a file — the hash is calculated client-side
- Paste the original hash into the "Compare" box to confirm match/no-match

Source: js/cryptoService.js

---

## Gemini AI Tutor (Optional)

CryptoGuard includes an AI assistant that offers short explanations about the cryptographic primitives in use. To enable:
1. Click Settings → "Gemini API Key".
2. Paste your Gemini (Google Gen AI) API key and save.
3. The assistant will show contextual explanations for AES, Hashing, and Caesar sections.

Security note: API key is stored locally (localStorage) and used from the browser session only.

Source: js/geminiService.js

---

## Security & Privacy Notes

- CryptoGuard performs cryptographic operations entirely in the browser; data and keys never leave your machine unless you explicitly upload/save them.
- This is a client-side tool — use caution with sensitive keys/passphrases. For highly sensitive data, use hardened, audited solutions and hardware-backed key storage.
- The AES parameters in this app are modern (AES-GCM, PBKDF2 with SHA-256). However, user-chosen passphrases need sufficient entropy to resist brute-force attacks.

---

## Contributing

Contributions, improvements and bug reports are welcome. Example ideas:
- Add PBKDF2 parameter controls (iterations)
- Add Argon2 support (via WASM) for better password-hardening
- Add WebAuthn / hardware key support for better key management
- Improve accessibility and i18n support

If you'd like, I can prepare a tidy CONTRIBUTING.md and open a PR with suggested changes.

---

## Roadmap (eyes on next steps)
- Add Argon2 (WASM) option for stronger key derivation
- Add optional client-side file signing with ECDSA for non-repudiation
- Offer an exportable JSON metadata format (deterministic header + cipher blob)
- Improve the AI assistant dialog & add example-guided explanations

---

## Example CLI-style snippets

Download encrypted file example (this is what the UI does under the hood):
```js
// (conceptual)
const blob = await encryptFileAES(file, password);
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${file.name}.enc`;
a.click();
```

Check SHA-256:
```js
const hashHex = await generateHash("hello world", "SHA-256");
console.log(hashHex);
```

---

## Credits & Author

Developer: Janith Deshan Mihijaya Samaratunga  
Email: janithmihijaya123@gmail.com  
GitHub: https://github.com/janiyax35

Built with: Tailwind CDN (UI), Web Crypto API, Google Gemini integration (optional)

---

## License

This repository is currently set to private. Add a license that suits you (MIT, Apache-2.0, etc.). If you want, I can add an MIT license as a commit.

---

## Contact / Support

- Report issues: https://github.com/janiyax35/cyber-project-Encryption-Decryption-Tool-react/issues  
- Business / collaboration: janithmihijaya123@gmail.com  
- Portfolio: https://janiyax35.github.io

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:001018&height=80&section=footer&text=STAY%20SECURE%20%F0%9F%9A%92&fontSize=20&fontColor=00eeff" alt="footer" />
</p>