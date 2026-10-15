# raashilathiya.com — self website

Portfolio site for Raashi Lathiya, Product Designer.

## Layout

| Path | What it is |
|---|---|
| `/` (root) | The main site: white and blue editorial theme |
| `/option-b/` | Option B, "The Index": serif on warm paper, numbered work index |
| `/option-c/` | Option C, "The Terminal": dark, mono labels, mint accent |
| `/tools/` | Build tooling for the password-protected case study |

All three share the same content. Every link is relative, so the site works at any base path (GitHub Pages included).

## Local preview

```bash
python3 -m http.server 4200
```

Then open http://localhost:4200.

## GenAI Studio is password protected

`case-studies/genai-studio.html` (in every variant) is an encrypted gate page: the
case study is AES-256-GCM encrypted at rest and decrypts in the browser with a
password. View-source shows only ciphertext. The plaintext sources live outside
this repo (local `protected-src/`, gitignored).

To change the content or the password, edit the local source and re-run:

```bash
node tools/protect.mjs <plaintext-src.html> tools/gate-a.html case-studies/genai-studio.html "<password>"
```

(Use `gate-b.html` / `gate-c.html` for the option variants.)
