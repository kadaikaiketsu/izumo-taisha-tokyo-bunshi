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
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
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
                        <div style="margin-bottom: 10px;">
                            <button type="button" id="pdfUploadBtn" class="button button-secondary" style="padding: 8px 16px; font-size: 14px;">
                                📎 PDFをアップロード
                            </button>
                            <input type="file" id="pdfInput" accept=".pdf" style="display: none;">
                        </div>
                        <div id="editor" style="height: 400px; background: white;"></div>
                        <textarea id="content" name="content" style="display: none;" required></textarea>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="published" name="published" value="true" checked>
                        <label for="published" style="margin-bottom: 0;">✅ 公開する</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="previewBtn" class="button button-secondary">👁️ プレビュー</button>
                        <button type="submit" class="button">💾 保存してGitHubにプッシュ</button>
                        <a href="/admin/dashboard" class="button button-secondary">キャンセル</a>
                    </div>
                </form>
            </div>
        </div>
        
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <script>
          // Auto-generate slug from title
          document.getElementById('title').addEventListener('input', function(e) {
            const title = e.target.value;
            const slugInput = document.getElementById('slug');
            
            // Only auto-generate if slug is empty
            if (!slugInput.value) {
              const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
              slugInput.value = slug;
            }
          });
          
          // Initialize Quill editor
          var quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: '本文を入力してください...',
            modules: {
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'font': ['sans-serif', 'serif', 'noto-sans', 'noto-serif', 'yu-gothic', 'yu-mincho', 'meiryo', 'hiragino'] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
              ]
            }
          });
          
          // Add custom fonts CSS
          var fontStyles = document.createElement('style');
          fontStyles.innerHTML = \`
            .ql-font-sans-serif { font-family: sans-serif; }
            .ql-font-serif { font-family: serif; }
            .ql-font-noto-sans { font-family: 'Noto Sans JP', sans-serif; }
            .ql-font-noto-serif { font-family: 'Noto Serif JP', serif; }
            .ql-font-yu-gothic { font-family: 'Yu Gothic', '游ゴシック', YuGothic, sans-serif; }
            .ql-font-yu-mincho { font-family: 'Yu Mincho', '游明朝', YuMincho, serif; }
            .ql-font-meiryo { font-family: Meiryo, 'メイリオ', sans-serif; }
            .ql-font-hiragino { font-family: 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', sans-serif; }
          \`;
          document.head.appendChild(fontStyles);
          
          // Sync Quill content to hidden textarea on form submit
          document.querySelector('form').addEventListener('submit', function(e) {
            document.getElementById('content').value = quill.root.innerHTML;
          });
          
          // PDF Upload
          document.getElementById('pdfUploadBtn').addEventListener('click', function() {
            document.getElementById('pdfInput').click();
          });
          
          document.getElementById('pdfInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
              const reader = new FileReader();
              reader.onload = function(event) {
                const base64 = event.target.result;
                const range = quill.getSelection(true);
                quill.insertText(range.index, file.name, 'link', base64);
                quill.insertText(range.index + file.name.length, ' (PDF) ');
                alert('PDFがアップロードされました！');
              };
              reader.readAsDataURL(file);
            }
          });
          
          // Preview
          document.getElementById('previewBtn').addEventListener('click', function() {
            const title = document.getElementById('title').value || '無題';
            const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
            const content = quill.root.innerHTML;
            
            const previewHTML = \`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>プレビュー: \${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .preview-header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .preview-date { color: #666; font-size: 14px; margin-bottom: 10px; }
        .preview-title { font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0; }
        .preview-content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .preview-content img { max-width: 100%; height: auto; }
        .preview-content a { color: #8B4513; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="preview-header">
        <div class="preview-date">\${date}</div>
        <h1 class="preview-title">\${title}</h1>
    </div>
    <div class="preview-content">\${content}</div>
</body>
</html>\`;
            
            const previewWindow = window.open('', 'preview', 'width=900,height=700');
            previewWindow.document.write(previewHTML);
            previewWindow.document.close();
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
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
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
                        <div style="margin-bottom: 10px;">
                            <button type="button" id="pdfUploadBtn" class="button button-secondary" style="padding: 8px 16px; font-size: 14px;">
                                📎 PDFをアップロード
                            </button>
                            <input type="file" id="pdfInput" accept=".pdf" style="display: none;">
                        </div>
                        <div id="editor" style="height: 400px; background: white;"></div>
                        <textarea id="content" name="content" style="display: none;" required>${item.content || ''}</textarea>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="published" name="published" value="true" ${item.published ? 'checked' : ''}>
                        <label for="published" style="margin-bottom: 0;">✅ 公開する</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" id="previewBtn" class="button button-secondary">👁️ プレビュー</button>
                        <button type="submit" class="button">💾 更新してGitHubにプッシュ</button>
                        <a href="/admin/dashboard" class="button button-secondary">キャンセル</a>
                    </div>
                </form>
            </div>
        </div>
        
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <script>
          // Initialize Quill editor
          var quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: '本文を入力してください...',
            modules: {
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'font': ['sans-serif', 'serif', 'noto-sans', 'noto-serif', 'yu-gothic', 'yu-mincho', 'meiryo', 'hiragino'] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
              ]
            }
          });
          
          // Add custom fonts CSS
          var fontStyles = document.createElement('style');
          fontStyles.innerHTML = \`
            .ql-font-sans-serif { font-family: sans-serif; }
            .ql-font-serif { font-family: serif; }
            .ql-font-noto-sans { font-family: 'Noto Sans JP', sans-serif; }
            .ql-font-noto-serif { font-family: 'Noto Serif JP', serif; }
            .ql-font-yu-gothic { font-family: 'Yu Gothic', '游ゴシック', YuGothic, sans-serif; }
            .ql-font-yu-mincho { font-family: 'Yu Mincho', '游明朝', YuMincho, serif; }
            .ql-font-meiryo { font-family: Meiryo, 'メイリオ', sans-serif; }
            .ql-font-hiragino { font-family: 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', sans-serif; }
          \`;
          document.head.appendChild(fontStyles);
          
          // Load existing content
          const existingContent = document.getElementById('content').value;
          if (existingContent) {
            quill.root.innerHTML = existingContent;
          }
          
          // Sync Quill content to hidden textarea on form submit
          document.querySelector('form').addEventListener('submit', function(e) {
            document.getElementById('content').value = quill.root.innerHTML;
          });
          
          // PDF Upload
          document.getElementById('pdfUploadBtn').addEventListener('click', function() {
            document.getElementById('pdfInput').click();
          });
          
          document.getElementById('pdfInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
              const reader = new FileReader();
              reader.onload = function(event) {
                const base64 = event.target.result;
                const range = quill.getSelection(true);
                quill.insertText(range.index, file.name, 'link', base64);
                quill.insertText(range.index + file.name.length, ' (PDF) ');
                alert('PDFがアップロードされました！');
              };
              reader.readAsDataURL(file);
            }
          });
          
          // Preview
          document.getElementById('previewBtn').addEventListener('click', function() {
            const title = document.getElementById('title').value || '無題';
            const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
            const content = quill.root.innerHTML;
            
            const previewHTML = \`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>プレビュー: \${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .preview-header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .preview-date { color: #666; font-size: 14px; margin-bottom: 10px; }
        .preview-title { font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0; }
        .preview-content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .preview-content img { max-width: 100%; height: auto; }
        .preview-content a { color: #8B4513; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="preview-header">
        <div class="preview-date">\${date}</div>
        <h1 class="preview-title">\${title}</h1>
    </div>
    <div class="preview-content">\${content}</div>
</body>
</html>\`;
            
            const previewWindow = window.open('', 'preview', 'width=900,height=700');
            previewWindow.document.write(previewHTML);
            previewWindow.document.close();
          });
        </script>
    </body>
    </html>
  `);
});

export default news;
