// News API (save, generate HTML, commit to GitHub)

import { Hono } from 'hono';
import type { Bindings } from '../../lib/types';
import { requireAuth } from '../../lib/session';

const api = new Hono<{ Bindings: Bindings }>();

// Helper: Generate news HTML file
function generateNewsHTML(item: any): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${item.title} | 出雲大社東京分祠</title>
    <meta name="description" content="${item.title} - 出雲大社東京分祠">
    
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MNG2TBMF');</script>
    <!-- End Google Tag Manager -->
    
    <link href="../css/style.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MNG2TBMF"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <header>
        <div class="header-content">
            <a href="../index.html" class="logo-link">
                <h1 class="site-title">出雲大社東京分祠</h1>
            </a>
            <nav>
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
        <div class="content">
            <a href="../news.html" class="back-link">← 新着情報一覧に戻る</a>
            
            <article>
                <header class="news-header">
                    <time class="news-date">${item.date}</time>
                    <h1 class="news-title">${item.title}</h1>
                </header>
                
                <div class="news-content">
                    ${item.content}
                </div>
            </article>
        </div>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>出雲大社東京分祠</h3>
                <p>〒106-0032<br>東京都港区六本木7-18-5</p>
            </div>
            
            <div class="footer-section">
                <h3>サイトマップ</h3>
                <ul class="footer-links">
                    <li><a href="../index.html">ホーム</a></li>
                    <li><a href="../news.html">新着情報</a></li>
                    <li><a href="../about.html">出雲大社</a></li>
                    <li><a href="../sitemap.html">サイトマップ</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>ご案内</h3>
                <ul class="footer-links">
                    <li><a href="../history.html">由緒</a></li>
                    <li><a href="../omamori.html">御札・御守</a></li>
                    <li><a href="../prayer.html">御祈願</a></li>
                    <li><a href="../events.html">年間行事</a></li>
                </ul>
            </div>
            
            <div class="footer-section social-section">
                <h3>フォローする</h3>
                <div class="social-links">
                    <a href="https://www.instagram.com/izumotaisha_tokyo" target="_blank" rel="noopener noreferrer" class="social-link instagram" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://www.tiktok.com/@izumotaishi_tokyo" target="_blank" rel="noopener noreferrer" class="social-link tiktok" aria-label="TikTok">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    </a>
                    <a href="https://www.facebook.com/izumotaisyatokyo/" target="_blank" rel="noopener noreferrer" class="social-link facebook" aria-label="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2025 出雲大社東京分祠 All Rights Reserved.</p>
        </div>
    </footer>
</body>
</html>`;
}

// Helper: Update index.html with latest 5 news
async function updateIndexHTML(db: any, token: string): Promise<void> {
  // Get latest 5 published news
  const { results } = await db.prepare(`
    SELECT date, title, slug FROM news_items 
    WHERE published = 1 
    ORDER BY date DESC, created_at DESC 
    LIMIT 5
  `).all();
  
  const newsItems = results || [];
  
  // Read current index.html from GitHub
  const getUrl = 'https://api.github.com/repos/kadaikaiketsu/izumo-taisha-tokyo-bunshi/contents/index.html';
  const getResponse = await fetch(getUrl, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  
  if (!getResponse.ok) {
    throw new Error('Failed to fetch index.html from GitHub');
  }
  
  const fileData = await getResponse.json() as { content: string; sha: string };
  const currentContent = decodeURIComponent(escape(atob(fileData.content)));
  
  // Generate news list HTML
  const newsListHTML = newsItems.map((item: any) => `
                    <li class="news-item">
                        <a href="news/${item.slug}.html">
                            <span class="news-date">${item.date}</span>
                            <span class="news-title">${item.title}</span>
                        </a>
                    </li>`).join('');
  
  // Replace news list in index.html
  const updatedContent = currentContent.replace(
    /<ul class="news-list">[\s\S]*?<\/ul>/,
    `<ul class="news-list">${newsListHTML}
                </ul>`
  );
  
  // Commit updated index.html
  await commitToGitHub(
    token,
    'kadaikaiketsu',
    'izumo-taisha-tokyo-bunshi',
    'index.html',
    updatedContent,
    'Auto-update: Latest 5 news in index.html'
  );
}

// Helper: Update news.html with all news
async function updateNewsHTML(db: any, token: string): Promise<void> {
  // Get all published news
  const { results } = await db.prepare(`
    SELECT date, title, slug FROM news_items 
    WHERE published = 1 
    ORDER BY date DESC, created_at DESC
  `).all();
  
  const newsItems = results || [];
  
  // Read current news.html from GitHub
  const getUrl = 'https://api.github.com/repos/kadaikaiketsu/izumo-taisha-tokyo-bunshi/contents/news.html';
  const getResponse = await fetch(getUrl, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  
  if (!getResponse.ok) {
    throw new Error('Failed to fetch news.html from GitHub');
  }
  
  const fileData = await getResponse.json() as { content: string; sha: string };
  const currentContent = decodeURIComponent(escape(atob(fileData.content)));
  
  // Generate news list HTML
  const newsListHTML = newsItems.map((item: any) => `
            <article class="news-card">
                <time class="news-date">${item.date}</time>
                <h3 class="news-title">
                    <a href="news/${item.slug}.html">${item.title}</a>
                </h3>
            </article>`).join('');
  
  // Replace news list in news.html
  const updatedContent = currentContent.replace(
    /<div class="news-grid">[\s\S]*?<\/div>/,
    `<div class="news-grid">${newsListHTML}
        </div>`
  );
  
  // Commit updated news.html
  await commitToGitHub(
    token,
    'kadaikaiketsu',
    'izumo-taisha-tokyo-bunshi',
    'news.html',
    updatedContent,
    'Auto-update: All news in news.html'
  );
}

// Helper: Commit file to GitHub
async function commitToGitHub(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string
): Promise<void> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  // Get current file SHA if exists
  let sha: string | undefined;
  try {
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (getResponse.ok) {
      const data = await getResponse.json() as { sha: string };
      sha = data.sha;
    }
  } catch {
    // File doesn't exist, that's ok
  }
  
  // Commit file
  const body: any = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: 'main',
  };
  
  if (sha) {
    body.sha = sha;
  }
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${error}`);
  }
}

// Create news
api.post('/', async (c) => {
  const authResult = await requireAuth(c);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  try {
    const formData = await c.req.formData();
    const date = formData.get('date') as string;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'true';
    
    // Insert to database
    const result = await c.env.DB.prepare(`
      INSERT INTO news_items (date, title, slug, content, published)
      VALUES (?, ?, ?, ?, ?)
    `).bind(date, title, slug, content, published ? 1 : 0).run();
    
    if (!result.success) {
      throw new Error('Failed to insert news item');
    }
    
    // Generate HTML
    const htmlContent = generateNewsHTML({ date, title, slug, content, published });
    
    // Commit to GitHub
    await commitToGitHub(
      c.env.GITHUB_TOKEN,
      'kadaikaiketsu',
      'izumo-taisha-tokyo-bunshi',
      `news/${slug}.html`,
      htmlContent,
      `Add news: ${title} (${date})`
    );
    
    // Update index.html and news.html
    await updateIndexHTML(c.env.DB, c.env.GITHUB_TOKEN);
    await updateNewsHTML(c.env.DB, c.env.GITHUB_TOKEN);
    
    return c.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error creating news:', error);
    return c.text('Error creating news: ' + (error as Error).message, 500);
  }
});

// Update news
api.post('/:id', async (c) => {
  const authResult = await requireAuth(c);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  try {
    const id = c.req.param('id');
    const formData = await c.req.formData();
    const date = formData.get('date') as string;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'true';
    
    // Update database
    const result = await c.env.DB.prepare(`
      UPDATE news_items
      SET date = ?, title = ?, slug = ?, content = ?, published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(date, title, slug, content, published ? 1 : 0, id).run();
    
    if (!result.success) {
      throw new Error('Failed to update news item');
    }
    
    // Generate HTML
    const htmlContent = generateNewsHTML({ date, title, slug, content, published });
    
    // Commit to GitHub
    await commitToGitHub(
      c.env.GITHUB_TOKEN,
      'kadaikaiketsu',
      'izumo-taisha-tokyo-bunshi',
      `news/${slug}.html`,
      htmlContent,
      `Update news: ${title} (${date})`
    );
    
    // Update index.html and news.html
    await updateIndexHTML(c.env.DB, c.env.GITHUB_TOKEN);
    await updateNewsHTML(c.env.DB, c.env.GITHUB_TOKEN);
    
    return c.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error updating news:', error);
    return c.text('Error updating news: ' + (error as Error).message, 500);
  }
});

// Delete news
api.post('/:id/delete', async (c) => {
  const authResult = await requireAuth(c);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  try {
    const id = c.req.param('id');
    
    // Get slug before deleting
    const { results } = await c.env.DB.prepare(`
      SELECT slug, title FROM news_items WHERE id = ?
    `).bind(id).all();
    
    if (!results || results.length === 0) {
      throw new Error('News item not found');
    }
    
    const item = results[0] as any;
    
    // Delete from database
    await c.env.DB.prepare(`
      DELETE FROM news_items WHERE id = ?
    `).bind(id).run();
    
    // Delete from GitHub
    const deleteUrl = `https://api.github.com/repos/kadaikaiketsu/izumo-taisha-tokyo-bunshi/contents/news/${item.slug}.html`;
    
    // Get file SHA
    const getResponse = await fetch(deleteUrl, {
      headers: {
        'Authorization': `token ${c.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (getResponse.ok) {
      const data = await getResponse.json() as { sha: string };
      
      // Delete file
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${c.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete news: ${item.title}`,
          sha: data.sha,
          branch: 'main',
        }),
      });
    }
    
    // Update index.html and news.html
    await updateIndexHTML(c.env.DB, c.env.GITHUB_TOKEN);
    await updateNewsHTML(c.env.DB, c.env.GITHUB_TOKEN);
    
    return c.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error deleting news:', error);
    return c.text('Error deleting news: ' + (error as Error).message, 500);
  }
});

export default api;
