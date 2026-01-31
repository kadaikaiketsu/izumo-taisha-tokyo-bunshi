#!/usr/bin/env node

/**
 * Sync script: Generate HTML files from database and commit to GitHub
 * Usage: node sync-news.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read from local D1 database
function execWrangler(command) {
  return execSync(`npx wrangler ${command}`, { encoding: 'utf-8' });
}

// Get all published news from database
console.log('📖 Reading news from database...');
const result = execWrangler(`d1 execute izumo-cms --remote --command="SELECT id, date, title, slug, content, published FROM news_items WHERE published = 1 ORDER BY date DESC, created_at DESC" --json`);
const data = JSON.parse(result);
const newsItems = data[0].results;

console.log(`✅ Found ${newsItems.length} published news items`);

// Generate news HTML function
function generateNewsHTML(item) {
  // Format date for display
  const displayDate = item.date.replace(/-/g, '.');
  
  // Check if content already includes full HTML structure
  const hasFullStructure = item.content.includes('<section class="section">');
  
  // Common header
  const header = `<!DOCTYPE html>
<html lang="ja">
<head>
<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MNG2TBMF');</script>
    <!-- End Google Tag Manager -->
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${item.title}">
    <title>${item.title} | 出雲大社東京分祠</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MNG2TBMF"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    
    <!-- ヘッダー -->
    <header class="site-header">
        <div class="header-container">
            <a href="../index.html" class="site-logo">出雲大社東京分祠</a>
            <button class="menu-toggle" aria-label="メニュー">☰</button>
            <nav class="site-nav">
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

    <!-- メインコンテンツ -->
    <main>`;
  
  // Common footer
  const footer = `    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>出雲大社東京分祠</h4>
                <p>〒106-0032<br>
                東京都港区六本木7-18-5<br>
                TEL: 03-3401-9301<br>
                受付時間: 午前9時～午後5時</p>
                
                <div class="social-links">
                    <a href="https://www.instagram.com/izumotaisha_tokyo" target="_blank" rel="noopener noreferrer" class="social-link instagram" aria-label="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a href="https://www.tiktok.com/@izumotaishi_tokyo" target="_blank" rel="noopener noreferrer" class="social-link tiktok" aria-label="TikTok">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                    </a>
                    <a href="https://www.facebook.com/izumotaisyatokyo/" target="_blank" rel="noopener noreferrer" class="social-link facebook" aria-label="Facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                </div>
            </div>
            
            <div class="footer-section">
                <h4>サイトマップ</h4>
                <ul class="footer-nav">
                    <li><a href="../index.html">ホーム</a></li>
                    <li><a href="../news.html">新着情報</a></li>
                    <li><a href="../about.html">出雲大社について</a></li>
                    <li><a href="../history.html">由緒</a></li>
                    <li><a href="../omamori.html">御札・御守</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>ご案内</h4>
                <ul class="footer-nav">
                    <li><a href="../prayer.html">御祈願</a></li>
                    <li><a href="../wedding.html">神前結婚式</a></li>
                    <li><a href="../events.html">年間行事</a></li>
                    <li><a href="../funeral.html">神葬祭</a></li>
                    <li><a href="../access.html">交通アクセス</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>Copyright (C) 2002-2025 Izumo Oyashiro Tokyo. All Rights Reserved.</p>
        </div>
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>`;
  
  if (hasFullStructure) {
    // Use simple template for content that already has full structure
    return header + item.content + footer;
  } else {
    // Use wrapped template for simple content
    const wrappedContent = `        <section class="section">
            <div class="container-narrow">
                <div style="margin-bottom: 2rem;">
                    <a href="../news.html" style="color: #8B4513; text-decoration: none; display: inline-flex; align-items: center;">
                        ← 新着情報一覧に戻る
                    </a>
                </div>
                
                <h1 style="font-size: 2rem; color: #2c3e50; margin-bottom: 0.5rem;">${item.title}</h1>
                <p style="color: #666; margin-bottom: 2rem;">投稿日: ${displayDate}</p>
                
                <div class="card" style="margin-bottom: 2rem;">
                    <div class="card-content">
                        ${item.content}
                    </div>
                </div>
                
                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ddd;">
                    <a href="../news.html" style="color: #8B4513; text-decoration: none; display: inline-flex; align-items: center;">
                        ← 新着情報一覧に戻る
                    </a>
                </div>
            </div>
        </section>`;
    
    return header + wrappedContent + footer;
  }
}

// Create news directory if not exists
const newsDir = path.join(__dirname, 'news');
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir, { recursive: true });
}

// Generate individual news HTML files
console.log('📝 Generating news HTML files...');
newsItems.forEach(item => {
  const htmlContent = generateNewsHTML(item);
  const filePath = path.join(newsDir, `${item.slug}.html`);
  fs.writeFileSync(filePath, htmlContent, 'utf-8');
  console.log(`  ✓ ${item.slug}.html`);
});

// Update index.html
console.log('📝 Updating index.html...');
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

const latest5 = newsItems.slice(0, 5);
const newsListHTML = latest5.map(item => `
                                <li style="margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid #f0f0f0;">
                                    <span style="color: #999; font-size: 0.85rem;">${item.date}</span><br>
                                    <a href="news/${item.slug}.html" style="color: var(--text-dark); text-decoration: none;">${item.title}</a>
                                </li>`).join('');

indexHtml = indexHtml.replace(
  /(<h3[^>]*>《新着情報》<\/h3>\s*<ul[^>]*>)([\s\S]*?)(<li[^>]*>\s*<a href="news\.html")/,
  `$1${newsListHTML}
                                $3`
);

fs.writeFileSync(indexPath, indexHtml, 'utf-8');
console.log('  ✓ index.html updated');

// Update news.html
console.log('📝 Updating news.html...');
const newsHtmlPath = path.join(__dirname, 'news.html');
let newsHtml = fs.readFileSync(newsHtmlPath, 'utf-8');

const allNewsHTML = newsItems.map(item => `
            <article class="news-card">
                <time class="news-date">${item.date}</time>
                <h3 class="news-title">
                    <a href="news/${item.slug}.html">${item.title}</a>
                </h3>
            </article>`).join('');

newsHtml = newsHtml.replace(
  /<div class="news-grid">[\s\S]*?<\/div>/,
  `<div class="news-grid">${allNewsHTML}
        </div>`
);

fs.writeFileSync(newsHtmlPath, newsHtml, 'utf-8');
console.log('  ✓ news.html updated');

// Copy to dist directory
console.log('📦 Copying to dist directory...');
execSync('cp -r news dist/', { stdio: 'inherit' });
execSync('cp index.html dist/', { stdio: 'inherit' });
execSync('cp news.html dist/', { stdio: 'inherit' });
console.log('  ✓ Files copied to dist/');

// Git commit and push
console.log('🚀 Committing to GitHub...');
try {
  execSync('git add news/ index.html news.html dist/', { stdio: 'inherit' });
  execSync(`git commit -m "Sync: Update news HTML files (${newsItems.length} items)"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('  ✓ Pushed to GitHub');
} catch (error) {
  console.error('  ✗ Git操作でエラーが発生しました');
  console.error(error.message);
}

console.log('');
console.log('✨ Sync completed successfully!');
console.log(`📊 Total news items: ${newsItems.length}`);
console.log(`🔝 Latest 5 items updated in index.html`);
console.log(`📰 All items updated in news.html`);
