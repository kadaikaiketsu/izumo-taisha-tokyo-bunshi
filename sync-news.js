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
  
  if (hasFullStructure) {
    // Use simple template for content that already has full structure
    return `<!DOCTYPE html>
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
            <p>&copy; 2025 出雲大社東京分祠 All Rights Reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  } else {
    // Use wrapped template for simple content
    return `<!DOCTYPE html>
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
                <section class="section">
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
        </section>

        <!-- 連絡先情報 -->
        <section class="section section-alt">
            <div class="container-narrow">
                <h3>お問い合わせ</h3>
                <p><strong>出雲大社東京分祠</strong><br>
                〒106-0032 東京都港区六本木7-18-5<br>
                TEL: <a href="tel:03-3401-9301">03-3401-9301</a><br>
                受付時間: 午前9時～午後5時</p>
            </div>
        </section>
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
            <p>&copy; 2025 出雲大社東京分祠 All Rights Reserved.</p>
        </div>
    </footer>
</body>
</html>`;
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
