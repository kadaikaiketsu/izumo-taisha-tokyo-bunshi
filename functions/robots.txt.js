// Cloudflare Pages Function to serve custom robots.txt
export async function onRequest(context) {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://izumotaisya-tokyobunshi.com/sitemap.xml

Disallow: /admin.html`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
