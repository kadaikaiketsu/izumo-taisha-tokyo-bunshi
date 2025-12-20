// 出雲大社東京分祠 - メインJavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // モバイルメニュー
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    
    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', function() {
            siteNav.classList.toggle('active');
            
            // アイコン切り替え
            const icon = this.querySelector('i') || this;
            if (siteNav.classList.contains('active')) {
                icon.textContent = '✕';
            } else {
                icon.textContent = '☰';
            }
        });
        
        // メニューリンクをクリックしたら閉じる
        const navLinks = siteNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                siteNav.classList.remove('active');
                const icon = menuToggle.querySelector('i') || menuToggle;
                icon.textContent = '☰';
            });
        });
    }
    
    // ========================================
    // スムーズスクロール
    // ========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // スクロールアニメーション
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.card, .info-list, .data-table');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ========================================
    // 現在のページをハイライト
    // ========================================
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.site-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.style.color = 'var(--primary-red)';
            link.style.borderBottom = '2px solid var(--primary-red)';
        }
    });
    
    // ========================================
    // フォームバリデーション（お問い合わせ用）
    // ========================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('[name="name"]').value.trim();
            const email = this.querySelector('[name="email"]').value.trim();
            const message = this.querySelector('[name="message"]').value.trim();
            
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage += 'お名前を入力してください。\n';
            }
            
            if (!email) {
                isValid = false;
                errorMessage += 'メールアドレスを入力してください。\n';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isValid = false;
                errorMessage += '正しいメールアドレスを入力してください。\n';
            }
            
            if (!message) {
                isValid = false;
                errorMessage += 'メッセージを入力してください。\n';
            }
            
            if (!isValid) {
                alert(errorMessage);
            } else {
                alert('お問い合わせありがとうございます。\n内容を確認の上、ご連絡いたします。');
                this.reset();
            }
        });
    }
    
    // ========================================
    // ページトップへ戻るボタン
    // ========================================
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-main);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ========================================
    // 画像の遅延読み込み
    // ========================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // 古いブラウザ用のフォールバック
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    console.log('出雲大社東京分祠 - ウェブサイトが正常に読み込まれました');
});
