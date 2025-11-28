/**
 * 다크/라이트 모드 테마 토글 기능
 */
(function() {
    'use strict';

    // 저장된 테마 또는 시스템 설정 가져오기
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // 시스템 다크 모드 설정 확인
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 테마 적용
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        localStorage.setItem('theme', theme);
    }

    // 테마 아이콘 업데이트
    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // 테마 토글
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // 초기화
    function init() {
        // 페이지 로드 시 테마 적용 (깜빡임 방지)
        const theme = getPreferredTheme();
        applyTheme(theme);

        // 토글 버튼 이벤트 리스너
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // 시스템 테마 변경 감지
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // 사용자가 직접 설정하지 않은 경우에만 자동 변경
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 전역 함수로 내보내기 (필요 시)
    window.ThemeManager = {
        toggle: toggleTheme,
        apply: applyTheme,
        get: getPreferredTheme
    };
})();

