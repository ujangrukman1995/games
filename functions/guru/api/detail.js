// GET /guru/api/detail?id=... : detail jawaban satu siswa (dilindungi middleware).
export async function onRequestGet({ env, request }) {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^[a-z0-9]{6,24}$/.test(id)) return new Response('bad id', { status: 400 });
  const v = await env.RESULTS.get('r:' + id);
  return new Response(v || 'null', { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
