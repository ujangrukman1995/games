# Deploy ke Cloudflare Pages

Struktur: index.html (game siswa) · guru/index.html (halaman guru) · functions/ (API).

1. Buat KV namespace:   npx wrangler kv namespace create RESULTS
2. Buat project Pages dan deploy folder ini:   npx wrangler pages deploy . --project-name=coreldraw-arena
3. Di dashboard Cloudflare: Workers & Pages > project > Settings:
   - Bindings > KV namespace: nama variabel RESULTS, pilih namespace dari langkah 1
   - Variables and Secrets: tambah secret TEACHER_KEY (kata sandi guru). Opsional TEACHER_USER (bawaan: guru)
4. Deploy ulang (langkah 2) supaya binding dan secret aktif.

Siswa: https://NAMA-PROJECT.pages.dev/
Guru:  https://NAMA-PROJECT.pages.dev/guru/   (browser meminta nama pengguna dan kata sandi)

Catatan: /guru/* dan /guru/api/* dikunci Basic Auth di sisi server (functions/guru/_middleware.js).
Untuk keamanan lebih kuat, gunakan Cloudflare Access (Zero Trust) pada path /guru/*.

## Uji setelah deploy
1. Buka https://NAMA-PROJECT.pages.dev/api/submit  -> harus tampil {"ok":true,"kv":true}
   - 404 atau halaman game: folder functions tidak ikut ter-deploy (jangan pakai drag-and-drop; pakai wrangler atau Git)
   - "kv":false: binding KV bernama RESULTS belum dibuat/terhubung, lalu deploy ulang
2. Mainkan 1 soal dengan nama uji, lalu buka /guru/ dan masuk dengan kata sandi: namanya harus muncul.
