// Import existing news HTML files into database

const fs = require('fs');
const path = require('path');

const newsDir = './news';
const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.html'));

console.log(`Found ${files.length} HTML files in news/`);

const articles = [];

files.forEach(file => {
  const filepath = path.join(newsDir, file);
  const html = fs.readFileSync(filepath, 'utf8');
  
  // Extract title from <title> tag
  const titleMatch = html.match(/<title>([^<]+)\s*\|/);
  const title = titleMatch ? titleMatch[1].trim() : file.replace('.html', '');
  
  // Extract date from meta description or title
  const dateMatch = title.match(/令和(\d+)年(\d+)月/);
  let date = '2025-01-01'; // default
  
  if (dateMatch) {
    const reiwa = parseInt(dateMatch[1]);
    const month = dateMatch[2].padStart(2, '0');
    const year = 2018 + reiwa; // 令和元年 = 2019
    date = `${year}-${month}-01`;
  }
  
  // Extract main content (between <main> and </main>)
  const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/);
  let content = '';
  
  if (mainMatch) {
    content = mainMatch[1].trim();
    // Remove header/footer sections if any
    content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  }
  
  // Slug is filename without .html
  const slug = file.replace('.html', '');
  
  articles.push({
    date,
    title,
    slug,
    content: content.substring(0, 500) + '...', // Preview only
    published: true
  });
});

// Sort by date desc
articles.sort((a, b) => b.date.localeCompare(a.date));

// Output SQL
console.log('\n-- SQL to import existing articles:');
console.log('-- Copy this and run: npx wrangler d1 execute izumo-cms --local --command="..."\n');

articles.forEach(article => {
  const title = article.title.replace(/'/g, "''");
  const content = article.content.replace(/'/g, "''");
  const sql = `INSERT INTO news_items (date, title, slug, content, published) VALUES ('${article.date}', '${title}', '${article.slug}', '${content}', ${article.published ? 1 : 0});`;
  console.log(sql);
});

console.log(`\n✅ Generated SQL for ${articles.length} articles`);
