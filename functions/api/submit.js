// POST /api/submit  : dipanggil game siswa. Menyimpan 1 catatan per percobaan (kunci = id) di KV "RESULTS".
// GET /api/submit : cek kesehatan. Buka di browser, harus tampil {"ok":true,"kv":true}
export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({ ok: true, kv: !!env.RESULTS }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
export async function onRequestPost({ request, env }) {
  if (!env.RESULTS) return new Response('KV RESULTS belum terhubung', { status: 500 });
  const t = await request.text();
  if (t.length > 30000) return new Response('terlalu besar', { status: 413 });
  let d; try { d = JSON.parse(t) } catch { return new Response('bad json', { status: 400 }) }
  if (!/^[a-z0-9]{6,24}$/.test(d.id || '') || !d.nama || String(d.nama).length > 40) return new Response('bad data', { status: 400 });
  const n2 = a => [(+a?.[0]) || 0, (+a?.[1]) || 0];
  const rec = {
    id: d.id, nama: String(d.nama).slice(0, 40), kelas: String(d.kelas || '').slice(0, 20),
    skor: +d.skor || 0, stasiun: +d.stasiun || 0, bintang: (Array.isArray(d.bintang) ? d.bintang : []).slice(0, 8).map(Number),
    A: n2(d.A), B: n2(d.B), selesai: !!d.selesai, nyawa: +d.nyawa || 0, waktu: Date.now(),
    log: (Array.isArray(d.log) ? d.log : []).slice(0, 80).map(x => ({ s: +x.s, q: String(x.q).slice(0, 140), ok: x.ok ? 1 : 0, tr: +x.tr || 0 }))
  };
  // ringkasan disimpan sebagai metadata supaya halaman guru cukup 1x list (hemat subrequest)
  const meta = { n: rec.nama, k: rec.kelas, sk: rec.skor, st: rec.stasiun, fi: rec.selesai, A: rec.A, B: rec.B, w: rec.waktu };
  await env.RESULTS.put('r:' + rec.id, JSON.stringify(rec), { metadata: meta, expirationTtl: 60 * 60 * 24 * 180 });
  return new Response('{"ok":true}', { headers: { 'Content-Type': 'application/json' } });
}
