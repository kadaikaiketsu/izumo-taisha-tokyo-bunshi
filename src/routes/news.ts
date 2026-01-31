// Dynamic news page route
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';

const dynamicNews = new Hono<{ Bindings: Bindings }>();

// Serve individual news page
dynamicNews.get('/:slug.html', async (c) => {
  const slug = c.req.param('slug');
  
  // Get news item from database
  const { results } = await c.env.DB.prepare(`
    SELECT date, title, slug, content, published
    FROM news_items
    WHERE slug = ? AND published = 1
  `).bind(slug).all();
  
  if (!results || results.length === 0) {
    return c.notFound();
  }
  
  const item = results[0] as any;
  
  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${item.title} | 出雲大社東京分祠</title>
    <meta name="description" content="${item.title}">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header class="site-header">
        <div class="header-content">
            <div class="logo">
                <a href="../index.html">
                    <img src="../images/logo.png" alt="出雲大社東京分祠" class="logo-img">
                </a>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="../index.html">ホーム</a></li>
                    <li><a href="../news.html">新着情報</a></li>
                    <li><a href="../about.html">出雲大社</a></li>
                    <li><a href="../history.html">由緒</a></li>
                    <li><a href="../omamori.html">御札・御守</a></li>
                    <li><a href="../prayer.html">御祈願</a></li>
                    <li><a href="../wedding.html">神前結婚式</a></li>
                    <li><a href="../events.html">年間行事</a></li>
                    <li><a href="../funeral.html">神葬祭</a></li>
                    <li><a href="../access.html">交通機関</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="news-detail">
        <article>
            <header>
                <time>${item.date}</time>
                <h1>${item.title}</h1>
            </header>
            <div class="news-content">
                ${item.content}
            </div>
        </article>
        <div class="back-link">
            <a href="../news.html">← 新着情報一覧に戻る</a>
        </div>
    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>出雲大社東京分祠</h4>
                <p>〒106-0032<br>
                東京都港区六本木7-18-5<br>
                TEL: 03-3401-9301</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>Copyright (C) 2002-2025 Izumo Oyashiro Tokyo. All Rights Reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  
  return c.html(html);
});

export default dynamicNews;
