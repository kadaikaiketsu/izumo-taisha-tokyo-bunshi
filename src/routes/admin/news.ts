// News creation and editing

import { Hono } from 'hono';
import type { Bindings } from '../../lib/types';
import { requireAuth } from '../../lib/session';

const news = new Hono<{ Bindings: Bindings }>();

// New news page
news.get('/new', async (c) => {
  const authResult = await requireAuth(c);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const session = authResult;
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>新規記事作成 | 出雲大社東京分祠</title>
        <link href="/admin/css/admin.css" rel="stylesheet">
    </head>
    <body class="dashboard">
        <header class="dashboard-header">
            <h1>➕ 新規記事作成</h1>
            <div class="user-info">
                <img src="${session.picture}" alt="${session.name}" class="user-avatar">
                <a href="/admin/logout" class="logout-button">ログアウト</a>
            </div>
        </header>
        
        <div class="dashboard-content">
            <div class="form-container">
                <form action="/api/news" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="date">📅 日付 *</label>
                        <input type="date" id="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group">
                        <label for="title">📝 タイトル *</label>
                        <input type="text" id="title" name="title" required placeholder="例: 令和8年3月のご案内">
                    </div>
                    
                    <div class="form-group">
                        <label for="slug">🔗 スラッグ（URL） *</label>
                        <input type="text" id="slug" name="slug" required placeholder="例: gyoji-202603">
                        <small style="color: #718096; font-size: 13px;">
                            ※ 英数字とハイフンのみ使用可能。URLは news/[スラッグ].html になります
                        </small>
                    </div>
                    
                    <div class="form-group">
                        <label for="content">📄 本文 *</label>
                        <textarea id="content" name="content" rows="20" style="width: 100%; padding: 12px; font-size: 14px; border: 1px solid #cbd5e0; border-radius: 4px; font-family: inherit;" required></textarea>
                        <small style="color: #718096; font-size: 13px;">
                            ※ HTMLタグを使用できます（例: &lt;p&gt;段落&lt;/p&gt;、&lt;br&gt;改行、&lt;a href="..."&gt;リンク&lt;/a&gt;）
                        </small>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="published" name="published" value="true" checked>
                        <label for="published" style="margin-bottom: 0;">✅ 公開する</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="button">💾 保存してGitHubにプッシュ</button>
                        <a href="/admin/dashboard" class="button button-secondary">キャンセル</a>
                    </div>
                </form>
            </div>
        </div>
        
        <script>
          // Auto-generate slug from title
          document.getElementById('title').addEventListener('input', function(e) {
            const title = e.target.value;
            const slugInput = document.getElementById('slug');
            
            // Only auto-generate if slug is empty
            if (!slugInput.value) {
              // Simple slug generation (you can customize this)
              const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
              slugInput.value = slug;
            }
          });
        </script>
    </body>
    </html>
  `);
});

// Edit news page
news.get('/edit/:id', async (c) => {
  const authResult = await requireAuth(c);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const session = authResult;
  const id = c.req.param('id');
  
  // Get news item from database
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM news_items WHERE id = ?
  `).bind(id).all();
  
  if (!results || results.length === 0) {
    return c.notFound();
  }
  
  const item = results[0] as any;
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>記事編集: ${item.title} | 出雲大社東京分祠</title>
        <link href="/admin/css/admin.css" rel="stylesheet">
    </head>
    <body class="dashboard">
        <header class="dashboard-header">
            <h1>✏️ 記事編集</h1>
            <div class="user-info">
                <img src="${session.picture}" alt="${session.name}" class="user-avatar">
                <a href="/admin/logout" class="logout-button">ログアウト</a>
            </div>
        </header>
        
        <div class="dashboard-content">
            <div class="form-container">
                <form action="/api/news/${id}" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="_method" value="PUT">
                    
                    <div class="form-group">
                        <label for="date">📅 日付 *</label>
                        <input type="date" id="date" name="date" required value="${item.date}">
                    </div>
                    
                    <div class="form-group">
                        <label for="title">📝 タイトル *</label>
                        <input type="text" id="title" name="title" required value="${item.title}">
                    </div>
                    
                    <div class="form-group">
                        <label for="slug">🔗 スラッグ（URL） *</label>
                        <input type="text" id="slug" name="slug" required value="${item.slug}">
                        <small style="color: #718096; font-size: 13px;">
                            ※ 英数字とハイフンのみ使用可能。URLは news/[スラッグ].html になります
                        </small>
                    </div>
                    
                    <div class="form-group">
                        <label for="content">📄 本文 *</label>
                        <textarea id="content" name="content" rows="20" style="width: 100%; padding: 12px; font-size: 14px; border: 1px solid #cbd5e0; border-radius: 4px; font-family: inherit;" required>${item.content || ''}</textarea>
                        <small style="color: #718096; font-size: 13px;">
                            ※ HTMLタグを使用できます（例: &lt;p&gt;段落&lt;/p&gt;、&lt;br&gt;改行、&lt;a href="..."&gt;リンク&lt;/a&gt;）
                        </small>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="published" name="published" value="true" ${item.published ? 'checked' : ''}>
                        <label for="published" style="margin-bottom: 0;">✅ 公開する</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="button">💾 更新してGitHubにプッシュ</button>
                        <a href="/admin/dashboard" class="button button-secondary">キャンセル</a>
                    </div>
                </form>
            </div>
        </div>
        
    </body>
    </html>
  `);
});

export default news;
