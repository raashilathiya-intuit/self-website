// Encrypts a case-study HTML file and writes a password-gate page.
// Usage: node tools/protect.mjs <source.html> <gate-template.html> <output.html> <password>
// AES-256-GCM, key derived with PBKDF2 (SHA-256, 310k iterations).
// Without the password, the output contains only ciphertext.

import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const [, , srcPath, tplPath, outPath, password] = process.argv;
if (!srcPath || !tplPath || !outPath || !password) {
  console.error('Usage: node tools/protect.mjs <source.html> <gate-template.html> <output.html> <password>');
  process.exit(1);
}

const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const iterations = 310000;

const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);

const plaintext = readFileSync(srcPath);
const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));

const b64 = (u8) => Buffer.from(u8).toString('base64');

let out = readFileSync(tplPath, 'utf8');
out = out
  .replace('__SALT__', b64(salt))
  .replace('__IV__', b64(iv))
  .replace('__DATA__', b64(ciphertext))
  .replace('__ITER__', String(iterations));
writeFileSync(outPath, out);
console.log(`protected: ${srcPath} -> ${outPath} (${ciphertext.length} bytes ciphertext)`);
