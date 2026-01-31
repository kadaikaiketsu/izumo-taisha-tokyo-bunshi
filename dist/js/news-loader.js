// 出雲大社東京分祠 - ニュース動的読み込み

const NEWS_STORAGE_KEY = 'izumo_news_data';

// ========================================
// ニュース一覧を読み込み
// ========================================
function loadNewsContent() {
    const newsContainer = document.getElementById('newsContainer');
    
    if (!newsContainer) {
        console.error('newsContainer が見つかりません');
        return;
    }
    
    // LocalStorageからデータを取得
    const newsData = getStoredNews();
    
    if (newsData.length === 0) {
        newsContainer.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <p style="text-align: center; color: var(--text-gray);">
                        現在、新着情報はありません。
                    </p>
                </div>
            </div>
        `;
        return;
    }
    
    // 日付順にソート（新しい順）
    newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // HTMLを生成
    let html = '';
    newsData.forEach(news => {
        const formattedDate = formatNewsDate(news.date);
        html += `
            <article class="card mb-lg">
                <div class="card-content">
                    <p style="color: var(--text-gray); margin-bottom: 0.5rem;">${formattedDate}</p>
                    <h3>${escapeHtmlContent(news.title)}</h3>
                    <div style="white-space: pre-wrap; line-height: 1.8;">${escapeHtmlContent(news.content)}</div>
                </div>
            </article>
        `;
    });
    
    newsContainer.innerHTML = html;
}

// ========================================
// データ取得
// ========================================
function getStoredNews() {
    const data = localStorage.getItem(NEWS_STORAGE_KEY);
    
    if (data) {
        return JSON.parse(data);
    }
    
    // デフォルトデータ
    return [
        {
            id: 1,
            date: '2025-12-25',
            title: '令和7年 年越の大祓のご案内',
            content: '年末の大祓を執り行います。詳細はお電話にてお問い合わせください。',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            date: '2025-04-15',
            title: '◆御祈祷初穂料改定のお知らせ',
            content: '令和7年4月15日より、御祈祷初穂料を改定いたしました。\n\n【改定内容】\n・個人：一願意につき 8,000円・15,000円・30,000円以上\n・初宮・七五三：10,000円以上\n・出雲屋敷祈願：30,000円以上\n・団体・法人：一願意につき 20,000円以上\n\n何卒ご理解いただきますよう、お願い申し上げます。',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            date: '2023-01-01',
            title: '◆挙式初穂料改定のお知らせ',
            content: '令和5年1月1日より、挙式初穂料を従来の 50,000円 から 80,000円 に改定いたしました。何卒ご理解いただきますよう、お願い申し上げます。',
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            date: '2023-01-01',
            title: '◆御祈祷初穂料一部改定のお知らせ',
            content: '令和5年1月1日より、以下の通り改定いたしました。\n\n【改定内容】\n・初宮・七五三：5,000円以上 → 10,000円以上\n・出雲屋敷祈願：10,000円以上 → 30,000円以上\n\n※出雲屋敷フルセットは御守授与所でのお取り扱いはございません。',
            createdAt: new Date().toISOString()
        }
    ];
}

// ========================================
// ユーティリティ
// ========================================

// 日付フォーマット
function formatNewsDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month}.${day}`;
}

// HTMLエスケープ
function escapeHtmlContent(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', loadNewsContent);
