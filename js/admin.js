// 出雲大社東京分祠 - 管理ツール JavaScript

// LocalStorageのキー
const NEWS_STORAGE_KEY = 'izumo_news_data';

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 今日の日付をデフォルトで設定
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newsDate').value = today;
    
    // フォーム送信イベント
    document.getElementById('newsForm').addEventListener('submit', handleSubmit);
    
    // 記事一覧を読み込み
    loadNewsList();
    
    // 統計情報を更新
    updateStats();
});

// ========================================
// データ管理
// ========================================

// ニュースデータを取得
function getNewsData() {
    const data = localStorage.getItem(NEWS_STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    
    // 初期データ（既存の新着情報）
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
        }
    ];
}

// ニュースデータを保存
function saveNewsData(data) {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(data));
    updateStats();
}

// ========================================
// フォーム処理
// ========================================

// フォーム送信処理
function handleSubmit(e) {
    e.preventDefault();
    
    const date = document.getElementById('newsDate').value;
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    
    if (!date || !title || !content) {
        showAlert('すべての項目を入力してください', 'error');
        return;
    }
    
    // 編集モードかチェック
    const editId = document.getElementById('newsForm').dataset.editId;
    
    if (editId) {
        // 編集モード
        updateNews(parseInt(editId), date, title, content);
    } else {
        // 新規追加モード
        addNews(date, title, content);
    }
}

// 記事を追加
function addNews(date, title, content) {
    const newsData = getNewsData();
    
    const newNews = {
        id: Date.now(),
        date: date,
        title: title,
        content: content,
        createdAt: new Date().toISOString()
    };
    
    newsData.unshift(newNews); // 先頭に追加
    saveNewsData(newsData);
    
    showAlert('記事を追加しました！', 'success');
    clearForm();
    loadNewsList();
}

// 記事を更新
function updateNews(id, date, title, content) {
    const newsData = getNewsData();
    const index = newsData.findIndex(item => item.id === id);
    
    if (index !== -1) {
        newsData[index] = {
            ...newsData[index],
            date: date,
            title: title,
            content: content,
            updatedAt: new Date().toISOString()
        };
        
        saveNewsData(newsData);
        showAlert('記事を更新しました！', 'success');
        clearForm();
        loadNewsList();
    }
}

// 記事を削除
function deleteNews(id) {
    if (!confirm('この記事を削除してもよろしいですか？')) {
        return;
    }
    
    const newsData = getNewsData();
    const filtered = newsData.filter(item => item.id !== id);
    
    saveNewsData(filtered);
    showAlert('記事を削除しました', 'success');
    loadNewsList();
}

// 記事を編集フォームに読み込み
function editNews(id) {
    const newsData = getNewsData();
    const news = newsData.find(item => item.id === id);
    
    if (news) {
        document.getElementById('newsDate').value = news.date;
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsContent').value = news.content;
        
        // 編集モードを設定
        document.getElementById('newsForm').dataset.editId = id;
        document.querySelector('.btn-add').textContent = '記事を更新';
        
        // フォームまでスクロール
        document.querySelector('.admin-section').scrollIntoView({ behavior: 'smooth' });
        
        showAlert('編集モード：記事を編集してください', 'info');
    }
}

// フォームをクリア
function clearForm() {
    document.getElementById('newsForm').reset();
    delete document.getElementById('newsForm').dataset.editId;
    document.querySelector('.btn-add').textContent = '記事を追加';
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newsDate').value = today;
}

// ========================================
// 表示処理
// ========================================

// 記事一覧を読み込み
function loadNewsList() {
    const newsData = getNewsData();
    const newsList = document.getElementById('newsList');
    
    if (newsData.length === 0) {
        newsList.innerHTML = '<p style="text-align: center; color: var(--text-gray);">記事がありません</p>';
        return;
    }
    
    // 日付順にソート（新しい順）
    newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    newsData.forEach(news => {
        const formattedDate = formatDate(news.date);
        html += `
            <div class="news-item">
                <div class="news-item-header">
                    <span class="news-item-date">${formattedDate}</span>
                </div>
                <h3 class="news-item-title">${escapeHtml(news.title)}</h3>
                <div class="news-item-content">${escapeHtml(news.content)}</div>
                <div class="news-item-actions">
                    <button class="btn-small btn-edit" onclick="editNews(${news.id})">編集</button>
                    <button class="btn-small btn-delete" onclick="deleteNews(${news.id})">削除</button>
                </div>
            </div>
        `;
    });
    
    newsList.innerHTML = html;
}

// 統計情報を更新
function updateStats() {
    const newsData = getNewsData();
    
    document.getElementById('totalNews').textContent = newsData.length;
    
    if (newsData.length > 0) {
        const sorted = [...newsData].sort((a, b) => 
            new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        const latest = sorted[0];
        const date = new Date(latest.createdAt || latest.date);
        document.getElementById('lastUpdate').textContent = 
            `${date.getMonth() + 1}/${date.getDate()}`;
    }
}

// プレビュー表示
function previewNews() {
    const date = document.getElementById('newsDate').value;
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    
    if (!date || !title || !content) {
        showAlert('プレビューするには全ての項目を入力してください', 'error');
        return;
    }
    
    const formattedDate = formatDate(date);
    const previewHtml = `
        <article class="card" style="margin-top: 2rem;">
            <div class="card-content">
                <p style="color: var(--text-gray); margin-bottom: 0.5rem;">${formattedDate}</p>
                <h3>${escapeHtml(title)}</h3>
                <p style="white-space: pre-wrap;">${escapeHtml(content)}</p>
            </div>
        </article>
    `;
    
    document.getElementById('previewArea').innerHTML = previewHtml;
    document.getElementById('previewModal').classList.add('active');
}

// プレビューを閉じる
function closePreview() {
    document.getElementById('previewModal').classList.remove('active');
}

// アラート表示
function showAlert(message, type = 'info') {
    const alertArea = document.getElementById('alertArea');
    const alertClass = `alert-${type}`;
    
    const alertHtml = `
        <div class="alert ${alertClass}">
            ${message}
        </div>
    `;
    
    alertArea.innerHTML = alertHtml;
    
    // 3秒後に自動で消す
    setTimeout(() => {
        alertArea.innerHTML = '';
    }, 3000);
}

// ========================================
// ユーティリティ関数
// ========================================

// 日付をフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month}.${day}`;
}

// HTMLエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// データエクスポート/インポート
// ========================================

// データをエクスポート（将来の拡張用）
function exportNewsData() {
    const newsData = getNewsData();
    const dataStr = JSON.stringify(newsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `izumo_news_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showAlert('データをエクスポートしました', 'success');
}

// キーボードショートカット
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S で保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('newsForm').dispatchEvent(new Event('submit'));
    }
    
    // ESC でプレビューを閉じる
    if (e.key === 'Escape') {
        closePreview();
    }
});

console.log('出雲大社東京分祠 管理ツール - 準備完了');
