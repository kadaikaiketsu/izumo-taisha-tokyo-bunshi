// Admin Dashboard

import { Hono } from 'hono';
import type { Bindings } from '../../lib/types';
import { requireAuth } from '../../lib/session';

const dashboard = new Hono<{ Bindings: Bindings }>();

// Dashboard page
dashboard.get('/', async (c) => {
  const authResult = await requireAuth(c);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const session = authResult;
  
  // Check for success message
  const successParam = c.req.query('success');
  let successMessage = '';
  if (successParam === 'saved') {
    successMessage = '<div class="success-message">✅ 記事を保存してGitHubにプッシュしました！</div>';
  }
  
  // Get all news items from database
  const { results } = await c.env.DB.prepare(`
    SELECT id, date, title, slug, published, created_at
    FROM news_items
    ORDER BY date DESC, created_at DESC
  `).all();
  
  const newsItems = results || [];
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>管理画面 | 出雲大社東京分祠</title>
        <link href="/admin/css/admin.css" rel="stylesheet">
    </head>
    <body class="dashboard">
        <header class="dashboard-header">
            <h1>📰 新着情報管理</h1>
            <div class="user-info">
                <img src="${session.picture}" alt="${session.name}" class="user-avatar">
                <div>
                    <div class="user-name">${session.name}</div>
                    <div class="user-email" style="font-size: 12px; color: #a0aec0;">${session.email}</div>
                </div>
                <a href="/admin/logout" class="logout-button">ログアウト</a>
            </div>
        </header>
        
        <div class="dashboard-content">
            ${successMessage}
            <div class="actions">
                <a href="/admin/news/new" class="button">➕ 新規記事を作成</a>
                <a href="/" class="button button-secondary">🏠 サイトを表示</a>
            </div>
            
            <div class="news-list">
                <h2>📋 記事一覧（${newsItems.length}件）</h2>
                ${newsItems.length === 0 ? `
                    <p style="color: #a0aec0; text-align: center; padding: 40px 0;">
                        まだ記事がありません。<br>
                        「新規記事を作成」ボタンから最初の記事を作成しましょう。
                    </p>
                ` : newsItems.map((item: any) => `
                    <div class="news-item">
                        <div class="news-item-info">
                            <h3>
                                ${item.title}
                                ${item.published ? '<span style="color: #48bb78; font-size: 12px; margin-left: 10px;">✅ 公開中</span>' : '<span style="color: #a0aec0; font-size: 12px; margin-left: 10px;">📝 下書き</span>'}
                            </h3>
                            <div class="news-item-meta">
                                ${item.date} | スラッグ: ${item.slug}
                            </div>
                        </div>
                        <div class="news-item-actions">
                            <a href="/admin/news/edit/${item.id}" class="button">✏️ 編集</a>
                            <form action="/api/news/${item.id}/delete" method="POST" style="display: inline;" onsubmit="return confirm('本当に削除しますか？');">
                                <button type="submit" class="button button-danger">🗑️ 削除</button>
                            </form>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
  `);
});

export default dashboard;
