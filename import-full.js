// Import existing news HTML files into database with FULL content

const fs = require('fs');
const path = require('path');

const newsDir = './news';
const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.html'));

console.log(`Found ${files.length} HTML files`);

const sqlFile = 'import-full.sql';
fs.writeFileSync(sqlFile, '-- Import existing news articles\n\n');

files.forEach(file => {
  const filepath = path.join(newsDir, file);
  const html = fs.readFileSync(filepath, 'utf8');
  
  // Extract title
  const titleMatch = html.match(/<title>([^<]+)\s*\|/);
  const title = titleMatch ? titleMatch[1].trim() : file.replace('.html', '');
  
  // Extract date
  const dateMatch = title.match(/令和(\d+)年(\d+)月/);
  let date = '2025-01-01';
  
  if (dateMatch) {
    const reiwa = parseInt(dateMatch[1]);
    const month = dateMatch[2].padStart(2, '0');
    const year = 2018 + reiwa;
    date = `${year}-${month}-01`;
  }
  
  // Extract FULL content
  const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/);
  let content = '';
  
  if (mainMatch) {
    content = mainMatch[1].trim();
  }
  
  const slug = file.replace('.html', '');
  
  // Escape single quotes for SQL
  const titleEsc = title.replace(/'/g, "''");
  const contentEsc = content.replace(/'/g, "''");
  
  const sql = `INSERT INTO news_items (date, title, slug, content, published) VALUES ('${date}', '${titleEsc}', '${slug}', '${contentEsc}', 1);\n`;
  
  fs.appendFileSync(sqlFile, sql);
});

console.log(`✅ Generated ${sqlFile} with ${files.length} articles`);
console.log(`\nRun: npx wrangler d1 execute izumo-cms --local --file=./import-full.sql`);
