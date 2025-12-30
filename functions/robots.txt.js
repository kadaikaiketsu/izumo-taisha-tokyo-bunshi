// Cloudflare Pages Function to serve custom robots.txt
// This overrides Cloudflare's automatic Managed Content
export async function onRequest(context) {
  const robotsTxt = `# robots.txt for 出雲大社東京分祠
# Last updated: 2025-12-30

User-agent: *
Allow: /

Sitemap: https://izumotaisya-tokyobunshi.com/sitemap.xml

Disallow: /admin.html

# AIクローラーの制御（生成AI学習には使わせない、検索はOK）
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: meta-externalagent
Disallow: /`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'none'
    }
  });
}
