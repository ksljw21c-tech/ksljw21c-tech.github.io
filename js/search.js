/**
 * 게시글 검색 기능
 */
(function() {
    'use strict';

    let posts = [];
    let activeTag = null;

    // 게시글 데이터 설정
    function setPosts(postData) {
        posts = postData;
    }

    // 검색 수행
    function search(query) {
        query = query.toLowerCase().trim();
        
        if (!query && !activeTag) {
            return posts;
        }

        return posts.filter(post => {
            // 태그 필터
            if (activeTag && !post.tags.includes(activeTag)) {
                return false;
            }

            // 검색어 필터
            if (query) {
                const searchableText = [
                    post.title,
                    post.excerpt,
                    post.category,
                    post.description,
                    ...post.tags
                ].join(' ').toLowerCase();

                return searchableText.includes(query);
            }

            return true;
        });
    }

    // 태그 필터 설정
    function setActiveTag(tag) {
        activeTag = activeTag === tag ? null : tag;
        return activeTag;
    }

    // 현재 활성 태그 가져오기
    function getActiveTag() {
        return activeTag;
    }

    // 모든 태그 추출
    function getAllTags() {
        const tagCount = {};
        posts.forEach(post => {
            post.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });
        
        // 사용 빈도순 정렬
        return Object.entries(tagCount)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => ({ tag, count }));
    }

    // 초기화
    function init(postData, onSearch) {
        setPosts(postData);

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            // 디바운스된 검색
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const results = search(e.target.value);
                    if (onSearch) onSearch(results);
                }, 200);
            });
        }
    }

    // 전역 함수로 내보내기
    window.SearchManager = {
        init,
        search,
        setPosts,
        setActiveTag,
        getActiveTag,
        getAllTags
    };
})();

