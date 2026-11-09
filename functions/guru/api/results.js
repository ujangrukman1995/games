// GET /guru/api/results : daftar ringkasan semua siswa (dilindungi middleware).
export async function onRequestGet({ env }) {
  const out = []; let c;
  do {
    const l = await env.RESULTS.list({ prefix: 'r:', cursor: c, limit: 1000 });
    l.keys.forEach(k => out.push({ id: k.name.slice(2), ...(k.metadata || {}) }));
    c = l.list_complete ? null : l.cursor;
  } while (c);
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
