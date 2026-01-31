// Dynamic index.html route
import { Hono } from 'hono';
import type { Bindings } from '../lib/types';
import { serveStatic } from 'hono/cloudflare-workers';

const home = new Hono<{ Bindings: Bindings }>();

// Serve dynamic index.html
home.get('/', async (c) => {
  // Get latest 5 published news
  const { results } = await c.env.DB.prepare(`
    SELECT date, title, slug FROM news_items 
    WHERE published = 1 
    ORDER BY date DESC, id DESC 
    LIMIT 5
  `).all();
  
  const newsItems = results || [];
  
  // Generate news list HTML
  const newsListHTML = newsItems.map((item: any) => `
                                <li style="margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid #f0f0f0;">
                                    <span style="color: #999; font-size: 0.85rem;">${item.date}</span><br>
                                    <a href="news/${item.slug}.html" style="color: var(--text-dark); text-decoration: none;">${item.title}</a>
                                </li>`).join('');
  
  // Read static index.html
  const staticIndexPath = './index.html';
  const indexResponse = await serveStatic({ path: staticIndexPath })(c, async () => {
    return new Response('Not Found', { status: 404 });
  });
  
  if (!indexResponse || indexResponse.status === 404) {
    return c.notFound();
  }
  
  let indexHtml = await indexResponse.text();
  
  // Replace news list
  indexHtml = indexHtml.replace(
    /(<h3[^>]*>《新着情報》<\/h3>\s*<ul[^>]*>)([\s\S]*?)(<li[^>]*>\s*<a href="news\.html")/,
    `$1${newsListHTML}
                                $3`
  );
  
  return c.html(indexHtml);
});

export default home;
