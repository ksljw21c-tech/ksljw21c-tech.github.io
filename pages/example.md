---
title: '블로그에 오신 것을 환영합니다!'
date: 2025-11-28
tags: ['환영', '블로그', '시작하기']
category: '공지사항'
description: '첫 번째 게시글입니다. 블로그 사용법을 알아봅니다.'
---

# 👋 안녕하세요!

**ksljw21c-tech**의 기술 블로그에 오신 것을 환영합니다.

이 블로그는 GitHub Pages를 이용한 정적 블로그입니다. 마크다운으로 글을 작성하면 자동으로 웹페이지로 변환됩니다.

## ✨ 블로그 기능

이 블로그는 다음과 같은 기능을 지원합니다:

- 📝 **마크다운 지원** - 마크다운 문법으로 쉽게 글 작성
- 🌙 **다크/라이트 모드** - 눈이 편한 테마 선택
- 🔍 **검색 기능** - 게시글 제목과 내용 검색
- 🏷️ **태그 필터** - 태그별로 게시글 분류
- 💬 **댓글 기능** - Giscus를 통한 GitHub 기반 댓글

## 📖 마크다운 작성 예시

### 코드 블록

JavaScript 코드 예시:

```javascript
function greet(name) {
    console.log(`Hello, ${name}!`);
}

greet('World');
```

Python 코드 예시:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

### 인용문

> "The only way to do great work is to love what you do."
> 
> — Steve Jobs

### 목록

**순서 없는 목록:**

- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

**순서 있는 목록:**

1. HTML 구조 작성
2. CSS 스타일링
3. JavaScript 기능 추가
4. 배포

### 표

| 기능 | 설명 | 상태 |
|------|------|------|
| 마크다운 렌더링 | marked.js 사용 | ✅ |
| 코드 하이라이팅 | Prism.js 사용 | ✅ |
| 댓글 | Giscus 사용 | ✅ |
| 검색 | 클라이언트 사이드 | ✅ |

### 링크

- [GitHub 저장소](https://github.com/ksljw21c-tech)
- [marked.js 공식 문서](https://marked.js.org/)

---

## 🚀 새 글 작성하기

새 글을 작성하려면:

1. `pages/` 폴더에 새 `.md` 파일 생성
2. 파일 상단에 Front Matter 추가:

```yaml
---
title: '글 제목'
date: 2025-11-28
tags: ['태그1', '태그2']
category: '카테고리'
description: '글 설명'
---
```

3. 마크다운으로 본문 작성
4. Git commit & push
5. GitHub Actions가 자동으로 배포!

즐거운 블로깅 되세요! 🎉

