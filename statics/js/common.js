/**
 * 공통 헤더/푸터 로드 스크립트
 * 페이지에 <div id="header-placeholder"></div>와 <div id="footer-placeholder"></div>가 있으면
 * 자동으로 헤더와 푸터를 로드합니다.
 */

 (function() {
    'use strict';
    
    const isTemplatePath = window.location.pathname.includes('/template/');
    const base = isTemplatePath ? '' : 'template/';

    function fetchInto(targetEl, path, fallbackHtml) {
        if (!targetEl) return;
        fetch(base + path)
            .then(res => {
                if (!res.ok) throw new Error(path + ' not found');
                return res.text();
            })
            .then(html => { targetEl.innerHTML = html; })
            .catch(err => {
                console.error('Include load failed:', err);
                if (fallbackHtml) targetEl.innerHTML = fallbackHtml;
            });
    }

    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        fetchInto(
            headerPlaceholder,
            'header.html',
            '<header><div class="brand">김승원 · 웹디자인 & 퍼블리싱</div></header>'
        );
    }

    function loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        fetchInto(
            footerPlaceholder,
            'footer.html',
            '<footer>© 2026 김승원 · github pages 포트폴리오</footer>'
        );
    }

    function loadComponents() {
        document.querySelectorAll('[data-include]').forEach(el => {
            const path = el.getAttribute('data-include');
            fetchInto(el, path);
        });
    }

    // 스크롤 시 페이드 인/아웃
    function initReveal() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targets = document.querySelectorAll('.reveal');
        if (!targets.length) return;

        if (prefersReduced) {
            targets.forEach(el => el.classList.add('visible'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        targets.forEach(el => io.observe(el));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadHeader();
            loadFooter();
            loadComponents();
            initReveal();
        });
    } else {
        loadHeader();
        loadFooter();
        loadComponents();
        initReveal();
    }
})();

