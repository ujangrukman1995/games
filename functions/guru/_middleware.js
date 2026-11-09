// Semua yang ada di /guru/* (halaman + API guru) wajib login Basic Auth.
// Atur di Cloudflare: secret TEACHER_KEY (kata sandi), opsional TEACHER_USER (default "guru").
export async function onRequest({ request, env, next }) {
  const h = request.headers.get('Authorization') || '';
  let ok = false;
  if (env.TEACHER_KEY && h.startsWith('Basic ')) {
    try {
      const [u, ...p] = atob(h.slice(6)).split(':');
      ok = eq(u, env.TEACHER_USER || 'guru') & eq(p.join(':'), env.TEACHER_KEY);
    } catch { ok = false }
  }
  if (!ok) return new Response('Khusus guru', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Halaman Guru", charset="UTF-8"', 'Cache-Control': 'no-store' } });
  const r = await next(); const n = new Response(r.body, r);
  n.headers.set('Cache-Control', 'no-store'); n.headers.set('X-Robots-Tag', 'noindex'); return n;
}
function eq(a, b) { if (a.length !== b.length) return 0; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0 ? 1 : 0 }
