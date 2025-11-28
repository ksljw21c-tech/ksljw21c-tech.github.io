/**
 * 게시글 상세 페이지 로더
 * - 마크다운 파일 로드 및 파싱
 * - Front Matter 추출
 * - Giscus 댓글 로드
 */
(function() {
    'use strict';

    // URL에서 파일명 가져오기
    function getFileFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('file');
    }

    // Front Matter 파싱
    function parseFrontMatter(content) {
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (!frontMatterMatch) {
            return { metadata: {}, content };
        }

        const frontMatter = frontMatterMatch[1];
        const postContent = frontMatterMatch[2];
        const metadata = {};

        // Front Matter 라인 파싱
        const lines = frontMatter.split('\n');
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();

                // 따옴표 제거
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                // 배열 파싱 (tags)
                if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                    try {
                        value = JSON.parse(value);
                    } catch {
                        value = value.slice(1, -1)
                            .split(',')
                            .map(tag => tag.trim().replace(/^['"]|['"]$/g, ''));
                    }
                }

                metadata[key] = value;
            }
        });

        return { metadata, content: postContent };
    }

    // 마크다운을 HTML로 변환
    function renderMarkdown(content) {
        // marked.js 설정
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false
            });
            return marked.parse(content);
        }
        // fallback: 기본 변환
        return content
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
    }

    // 코드 하이라이팅 적용
    function highlightCode() {
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }

    // 날짜 포맷팅
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    }

    // 페이지 메타데이터 업데이트
    function updatePageMeta(metadata) {
        // 페이지 제목
        document.title = metadata.title 
            ? `${metadata.title} - ksljw21c-tech 블로그`
            : 'ksljw21c-tech 블로그';

        // 제목
        const titleEl = document.getElementById('post-title');
        if (titleEl) {
            titleEl.textContent = metadata.title || '제목 없음';
        }

        // 날짜
        const dateEl = document.getElementById('post-date');
        if (dateEl && metadata.date) {
            dateEl.textContent = `📅 ${formatDate(metadata.date)}`;
        }

        // 카테고리
        const categoryEl = document.getElementById('post-category');
        if (categoryEl && metadata.category) {
            categoryEl.textContent = `📁 ${metadata.category}`;
        } else if (categoryEl) {
            categoryEl.style.display = 'none';
        }

        // 태그
        const tagsEl = document.getElementById('post-tags');
        if (tagsEl && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
            tagsEl.innerHTML = metadata.tags.map(tag => 
                `<span class="tag">${escapeHtml(tag)}</span>`
            ).join('');
        }
    }

    // HTML 이스케이프
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Giscus 댓글 로드
    function loadGiscus() {
        const container = document.getElementById('giscus-container');
        if (!container) return;

        // 현재 테마 가져오기
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'dark' 
            : 'light';

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'ksljw21c-tech/ksljw21c-tech.github.io');
        script.setAttribute('data-repo-id', 'R_kgDOQec2AQ'); // TODO: Giscus 설정 후 변경
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOQec2Ac4CzIzK'); // TODO: Giscus 설정 후 변경
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '1');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', theme);
        script.setAttribute('data-lang', 'ko');
        script.setAttribute('data-loading', 'lazy');
        script.crossOrigin = 'anonymous';
        script.async = true;

        container.appendChild(script);
    }

    // 에러 표시
    function showError(message) {
        const contentEl = document.getElementById('post-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 3rem;">
                    <p style="font-size: 3rem; margin-bottom: 1rem;">😢</p>
                    <p style="color: var(--text-secondary);">${escapeHtml(message)}</p>
                    <a href="index.html" style="display: inline-block; margin-top: 1rem;">← 목록으로 돌아가기</a>
                </div>
            `;
        }
        const titleEl = document.getElementById('post-title');
        if (titleEl) {
            titleEl.textContent = '오류';
        }
    }

    // 게시글 로드
    async function loadPost() {
        const filename = getFileFromUrl();

        if (!filename) {
            showError('게시글을 찾을 수 없습니다.');
            return;
        }

        try {
            const response = await fetch(`pages/${filename}`);
            
            if (!response.ok) {
                throw new Error('게시글을 불러올 수 없습니다.');
            }

            const rawContent = await response.text();
            const { metadata, content } = parseFrontMatter(rawContent);

            // 메타데이터 업데이트
            updatePageMeta(metadata);

            // 마크다운 렌더링
            const contentEl = document.getElementById('post-content');
            if (contentEl) {
                contentEl.innerHTML = renderMarkdown(content);
            }

            // 코드 하이라이팅 적용
            setTimeout(highlightCode, 100);

            // Giscus 댓글 로드
            loadGiscus();

        } catch (error) {
            console.error('게시글 로드 오류:', error);
            showError('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 초기화
    function init() {
        loadPost();
    }

    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

