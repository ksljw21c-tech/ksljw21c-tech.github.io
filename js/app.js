/**
 * 메인 애플리케이션 로직
 * - 게시글 목록 로드 및 렌더링
 * - 태그 필터링
 * - 검색 연동
 */
(function() {
    'use strict';

    let allPosts = [];

    // 게시글 목록 로드
    async function loadPosts() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error('게시글 목록을 불러올 수 없습니다.');
            }
            allPosts = await response.json();
            return allPosts;
        } catch (error) {
            console.error('게시글 로드 오류:', error);
            return [];
        }
    }

    // 게시글 카드 HTML 생성
    function createPostCard(post) {
        const tagsHtml = post.tags.map(tag => 
            `<span class="post-card-tag">${escapeHtml(tag)}</span>`
        ).join('');

        return `
            <article class="post-card" onclick="location.href='post.html?file=${encodeURIComponent(post.file)}'">
                <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
                <div class="post-card-meta">
                    <span class="post-card-date">📅 ${formatDate(post.date)}</span>
                    ${post.category ? `<span class="post-card-category">📁 ${escapeHtml(post.category)}</span>` : ''}
                </div>
                <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
                ${tagsHtml ? `<div class="post-card-tags">${tagsHtml}</div>` : ''}
            </article>
        `;
    }

    // 게시글 목록 렌더링
    function renderPosts(posts) {
        const container = document.getElementById('posts-container');
        const noResults = document.getElementById('no-results');

        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '';
            if (noResults) noResults.classList.remove('hidden');
            return;
        }

        if (noResults) noResults.classList.add('hidden');
        container.innerHTML = posts.map(createPostCard).join('');
    }

    // 태그 렌더링
    function renderTags(tags) {
        const container = document.getElementById('tags-container');
        if (!container) return;

        const activeTag = window.SearchManager?.getActiveTag();
        
        container.innerHTML = tags.map(({ tag, count }) => `
            <button class="tag ${activeTag === tag ? 'active' : ''}" data-tag="${escapeHtml(tag)}">
                ${escapeHtml(tag)} (${count})
            </button>
        `).join('');

        // 태그 클릭 이벤트
        container.querySelectorAll('.tag').forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.dataset.tag;
                const newActiveTag = window.SearchManager.setActiveTag(tag);
                
                // 태그 버튼 상태 업데이트
                container.querySelectorAll('.tag').forEach(t => {
                    t.classList.toggle('active', t.dataset.tag === newActiveTag);
                });

                // 검색 결과 업데이트
                const searchInput = document.getElementById('search-input');
                const query = searchInput ? searchInput.value : '';
                const results = window.SearchManager.search(query);
                renderPosts(results);
            });
        });
    }

    // HTML 이스케이프
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 날짜 포맷팅
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}. ${month}. ${day}`;
    }

    // 초기화
    async function init() {
        const posts = await loadPosts();
        
        if (posts.length === 0) {
            const container = document.getElementById('posts-container');
            if (container) {
                container.innerHTML = `
                    <div class="no-results">
                        <p>아직 게시글이 없습니다. 📝</p>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem;">pages/ 폴더에 마크다운 파일을 추가해보세요!</p>
                    </div>
                `;
            }
            return;
        }

        // 검색 매니저 초기화
        window.SearchManager.init(posts, renderPosts);

        // 태그 렌더링
        const tags = window.SearchManager.getAllTags();
        renderTags(tags);

        // 게시글 목록 렌더링
        renderPosts(posts);
    }

    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

