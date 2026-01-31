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
            
            if (!slugInput.value) {
              const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
              slugInput.value = slug;
            }
          });
          
          // Register custom fonts BEFORE initializing Quill
          var Font = Quill.import('formats/font');
          Font.whitelist = ['sans-serif', 'noto-sans', 'yu-gothic', 'meiryo', 'hiragino', 'serif', 'noto-serif', 'yu-mincho'];
          Quill.register(Font, true);
          
          // Custom image handler (supports both images and PDFs)
          function imageHandler() {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*,application/pdf');
            input.click();
            
            input.onchange = async () => {
              const file = input.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const base64 = e.target.result;
                  const range = quill.getSelection(true);
                  
                  if (file.type === 'application/pdf') {
                    // Use PDF.js for reliable PDF display across all browsers
                    const encodedPdf = encodeURIComponent(base64);
                    const pdfEmbed = '<div style="margin: 20px 0; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; background: #f9f9f9;">' +
                      '<iframe src="https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodedPdf + '" ' +
                      'width="100%" height="600px" style="border: none;"></iframe>' +
                      '<p style="text-align: center; padding: 10px; background: #f5f5f5; margin: 0; font-size: 14px; color: #666;">📄 ' + file.name + '</p>' +
                      '</div>';
                    quill.clipboard.dangerouslyPasteHTML(range.index, pdfEmbed);
                  } else {
                    quill.insertEmbed(range.index, 'image', base64);
                    quill.setSelection(range.index + 1);
                  }
                };
                reader.readAsDataURL(file);
              }
            };
          }
          
          // Initialize Quill editor
          var quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: '本文を入力してください...',
            modules: {
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  [{ 'font': Font.whitelist }],
                  [{ 'size': ['small', false, 'large', 'huge'] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ],
                handlers: {
                  image: imageHandler
                }
              }
            }
          });
          
          // Add custom fonts CSS with Japanese names
          var fontStyles = document.createElement('style');
          var cssText = '';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=sans-serif]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=sans-serif]::before { content: "ゴシック体(標準)" !important; }';
          cssText += '.ql-font-sans-serif { font-family: sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=noto-sans]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=noto-sans]::before { content: "Noto Sans(ゴシック)" !important; }';
          cssText += '.ql-font-noto-sans { font-family: "Noto Sans JP", sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=yu-gothic]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=yu-gothic]::before { content: "游ゴシック" !important; }';
          cssText += '.ql-font-yu-gothic { font-family: "Yu Gothic", "游ゴシック", YuGothic, sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=meiryo]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=meiryo]::before { content: "メイリオ" !important; }';
          cssText += '.ql-font-meiryo { font-family: Meiryo, "メイリオ", sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=hiragino]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=hiragino]::before { content: "ヒラギノ角ゴ" !important; }';
          cssText += '.ql-font-hiragino { font-family: "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before { content: "明朝体(標準)" !important; }';
          cssText += '.ql-font-serif { font-family: serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=noto-serif]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=noto-serif]::before { content: "Noto Serif(明朝)" !important; }';
          cssText += '.ql-font-noto-serif { font-family: "Noto Serif JP", serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=yu-mincho]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=yu-mincho]::before { content: "游明朝" !important; }';
          cssText += '.ql-font-yu-mincho { font-family: "Yu Mincho", "游明朝", YuMincho, serif; }';
          fontStyles.textContent = cssText;
          document.head.appendChild(fontStyles);
          
          // Image resize functionality
          document.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG' && e.target.closest('.ql-editor')) {
              const img = e.target;
              const width = prompt('画像の幅を選択してください:\\n1: 25%\\n2: 50%\\n3: 75%\\n4: 100%（デフォルト）', '4');
              if (width) {
                const widthOptions = ['25%', '50%', '75%', '100%'];
                const selectedWidth = widthOptions[parseInt(width) - 1] || '100%';
                img.style.width = selectedWidth;
                img.style.height = 'auto';
              }
              
              const align = prompt('画像の配置を選択してください:\\n1: 左寄せ\\n2: 中央\\n3: 右寄せ', '2');
              if (align) {
                const alignOptions = ['left', 'center', 'right'];
                const selectedAlign = alignOptions[parseInt(align) - 1] || 'center';
                img.style.display = 'block';
                img.style.marginLeft = selectedAlign === 'center' ? 'auto' : (selectedAlign === 'right' ? 'auto' : '0');
                img.style.marginRight = selectedAlign === 'center' ? 'auto' : (selectedAlign === 'right' ? '0' : 'auto');
              }
            }
          });
          
          // Sync Quill content to hidden textarea on form submit
          document.querySelector('form').addEventListener('submit', function(e) {
            document.getElementById('content').value = quill.root.innerHTML;
          });
          
          // Preview
          document.getElementById('previewBtn').addEventListener('click', function() {
            const title = document.getElementById('title').value || '無題';
            const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
            const content = quill.root.innerHTML;
            
            const previewHTML = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>プレビュー: ' + title + '</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;500;700&display=swap" rel="stylesheet"><style>body { font-family: "Noto Sans JP", sans-serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f5f5; } .preview-header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } .preview-date { color: #666; font-size: 14px; margin-bottom: 10px; } .preview-title { font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0; } .preview-content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } .preview-content img { max-width: 100%; height: auto; } .preview-content iframe { max-width: 100%; border: none; } .preview-content a { color: #8B4513; text-decoration: underline; }</style></head><body><div class="preview-header"><div class="preview-date">' + date + '</div><h1 class="preview-title">' + title + '</h1></div><div class="preview-content">' + content + '</div></body></html>';
            
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
          // Register custom fonts BEFORE initializing Quill
          var Font = Quill.import('formats/font');
          Font.whitelist = ['sans-serif', 'noto-sans', 'yu-gothic', 'meiryo', 'hiragino', 'serif', 'noto-serif', 'yu-mincho'];
          Quill.register(Font, true);
          
          // Custom image handler
          function imageHandler() {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*,application/pdf');
            input.click();
            
            input.onchange = async () => {
              const file = input.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const base64 = e.target.result;
                  const range = quill.getSelection(true);
                  
                  if (file.type === 'application/pdf') {
                    // Use PDF.js for reliable PDF display across all browsers
                    const encodedPdf = encodeURIComponent(base64);
                    const pdfEmbed = '<div style="margin: 20px 0; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; background: #f9f9f9;">' +
                      '<iframe src="https://mozilla.github.io/pdf.js/web/viewer.html?file=' + encodedPdf + '" ' +
                      'width="100%" height="600px" style="border: none;"></iframe>' +
                      '<p style="text-align: center; padding: 10px; background: #f5f5f5; margin: 0; font-size: 14px; color: #666;">📄 ' + file.name + '</p>' +
                      '</div>';
                    quill.clipboard.dangerouslyPasteHTML(range.index, pdfEmbed);
                  } else {
                    quill.insertEmbed(range.index, 'image', base64);
                    quill.setSelection(range.index + 1);
                  }
                };
                reader.readAsDataURL(file);
              }
            };
          }
          
          // Initialize Quill editor
          var quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: '本文を入力してください...',
            modules: {
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  [{ 'font': Font.whitelist }],
                  [{ 'size': ['small', false, 'large', 'huge'] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ],
                handlers: {
                  image: imageHandler
                }
              }
            }
          });
          
          // Add custom fonts CSS with Japanese names
          var fontStyles = document.createElement('style');
          var cssText = '';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=sans-serif]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=sans-serif]::before { content: "ゴシック体(標準)" !important; }';
          cssText += '.ql-font-sans-serif { font-family: sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=noto-sans]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=noto-sans]::before { content: "Noto Sans(ゴシック)" !important; }';
          cssText += '.ql-font-noto-sans { font-family: "Noto Sans JP", sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=yu-gothic]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=yu-gothic]::before { content: "游ゴシック" !important; }';
          cssText += '.ql-font-yu-gothic { font-family: "Yu Gothic", "游ゴシック", YuGothic, sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=meiryo]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=meiryo]::before { content: "メイリオ" !important; }';
          cssText += '.ql-font-meiryo { font-family: Meiryo, "メイリオ", sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=hiragino]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=hiragino]::before { content: "ヒラギノ角ゴ" !important; }';
          cssText += '.ql-font-hiragino { font-family: "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", sans-serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before { content: "明朝体(標準)" !important; }';
          cssText += '.ql-font-serif { font-family: serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=noto-serif]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=noto-serif]::before { content: "Noto Serif(明朝)" !important; }';
          cssText += '.ql-font-noto-serif { font-family: "Noto Serif JP", serif; }';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=yu-mincho]::before,';
          cssText += '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=yu-mincho]::before { content: "游明朝" !important; }';
          cssText += '.ql-font-yu-mincho { font-family: "Yu Mincho", "游明朝", YuMincho, serif; }';
          fontStyles.textContent = cssText;
          document.head.appendChild(fontStyles);
          
          // Load existing content
          const existingContent = document.getElementById('content').value;
          if (existingContent) {
            quill.root.innerHTML = existingContent;
          }
          
          // Image resize functionality
          document.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG' && e.target.closest('.ql-editor')) {
              const img = e.target;
              const width = prompt('画像の幅を選択してください:\\n1: 25%\\n2: 50%\\n3: 75%\\n4: 100%（デフォルト）', '4');
              if (width) {
                const widthOptions = ['25%', '50%', '75%', '100%'];
                const selectedWidth = widthOptions[parseInt(width) - 1] || '100%';
                img.style.width = selectedWidth;
                img.style.height = 'auto';
              }
              
              const align = prompt('画像の配置を選択してください:\\n1: 左寄せ\\n2: 中央\\n3: 右寄せ', '2');
              if (align) {
                const alignOptions = ['left', 'center', 'right'];
                const selectedAlign = alignOptions[parseInt(align) - 1] || 'center';
                img.style.display = 'block';
                img.style.marginLeft = selectedAlign === 'center' ? 'auto' : (selectedAlign === 'right' ? 'auto' : '0');
                img.style.marginRight = selectedAlign === 'center' ? 'auto' : (selectedAlign === 'right' ? '0' : 'auto');
              }
            }
          });
          
          // Sync Quill content to hidden textarea on form submit
          document.querySelector('form').addEventListener('submit', function(e) {
            document.getElementById('content').value = quill.root.innerHTML;
          });
          
          // Preview
          document.getElementById('previewBtn').addEventListener('click', function() {
            const title = document.getElementById('title').value || '無題';
            const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
            const content = quill.root.innerHTML;
            
            const previewHTML = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>プレビュー: ' + title + '</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;500;700&display=swap" rel="stylesheet"><style>body { font-family: "Noto Sans JP", sans-serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f5f5; } .preview-header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } .preview-date { color: #666; font-size: 14px; margin-bottom: 10px; } .preview-title { font-size: 28px; font-weight: 700; color: #2c3e50; margin: 0; } .preview-content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } .preview-content img { max-width: 100%; height: auto; } .preview-content iframe { max-width: 100%; border: none; } .preview-content a { color: #8B4513; text-decoration: underline; }</style></head><body><div class="preview-header"><div class="preview-date">' + date + '</div><h1 class="preview-title">' + title + '</h1></div><div class="preview-content">' + content + '</div></body></html>';
            
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
