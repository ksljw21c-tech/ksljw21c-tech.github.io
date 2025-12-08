---
title: '온라인 강의 플랫폼 데이터베이스 구축: Udemy/Coursera 같은 서비스 설계부터 구현까지'
date: 2025-12-08
tags: ['데이터베이스', '온라인강의', 'DB설계', 'ERD', 'SQL', '플랫폼개발']
category: '백엔드'
description: 'Udemy, Coursera 같은 온라인 강의 플랫폼의 데이터베이스를 구축해봅니다. 요구사항 분석부터 ERD 설계, SQL 구현까지 실제 서비스에 적용할 수 있는 완전한 DB 구축 가이드를 제공합니다.'
---

# 온라인 강의 플랫폼 데이터베이스 구축: Udemy/Coursera 같은 서비스 설계부터 구현까지

코로나19 이후 온라인 교육 시장이 폭발적으로 성장하면서 Udemy, Coursera, 인프런 같은 플랫폼들이 큰 성공을 거두고 있습니다. 이러한 플랫폼들의 핵심은 수십만 개의 강의를 효율적으로 관리하고, 수백만 명의 학습자를 연결하는 견고한 데이터베이스입니다. 온라인 강의 플랫폼의 데이터베이스는 단순한 데이터 저장소를 넘어 학습 경험을 좌우하는 중요한 역할을 합니다.

온라인 강의 플랫폼의 데이터베이스는 복잡한 요구사항을 처리해야 합니다. 회원 관리, 강의 콘텐츠 관리, 학습 진척도 추적, 결제 시스템, 리뷰 및 평점, 커뮤니티 기능까지 다양한 측면을 고려해야 합니다. 또한 동시 접속자가 많고, 실시간 데이터 업데이트가 빈번하다는 특징이 있습니다.

이 글에서는 Udemy나 Coursera 같은 실제 온라인 강의 플랫폼의 데이터베이스를 구축하는 과정을 단계별로 안내합니다. 요구사항 분석부터 엔티티 식별, ERD 설계, 정규화 적용, SQL 구현까지 실제 프로젝트에 바로 적용할 수 있는 완전한 가이드를 제공합니다. 데이터베이스 설계의 기초부터 실전 적용까지 마스터할 수 있는 기회가 될 것입니다.

## 요구사항 분석과 엔티티 식별: 온라인 강의 플랫폼의 핵심 요소

온라인 강의 플랫폼의 데이터베이스를 구축하기 전에 시스템의 요구사항을 명확히 파악해야 합니다. 주요 기능들을 분석해보면 다음과 같습니다:

1. **회원 관리**: 회원가입, 로그인, 프로필 관리, 강사/학습자 역할 구분
2. **강의 관리**: 강의 생성, 콘텐츠 업로드, 카테고리 분류, 가격 설정
3. **학습 관리**: 수강 신청, 진척도 추적, 인증서 발급, 퀴즈 및 과제
4. **결제 시스템**: 강의 구매, 환불, 쿠폰 적용, 정산
5. **커뮤니티**: 리뷰/평점, Q&A, 토론방
6. **관리 기능**: 통계, 분석, 콘텐츠 승인

이러한 요구사항을 바탕으로 필요한 엔티티를 식별해보겠습니다:

- **회원(Users)**: 회원번호, 이메일, 비밀번호, 이름, 역할(강사/학습자), 가입일
- **강의(Courses)**: 강의번호, 제목, 설명, 강사번호, 카테고리번호, 가격, 난이도, 생성일
- **강의 콘텐츠(Contents)**: 콘텐츠번호, 강의번호, 제목, 내용, 비디오URL, 순서, 재생시간
- **카테고리(Categories)**: 카테고리번호, 이름, 상위카테고리번호
- **수강(Enrollments)**: 수강번호, 회원번호, 강의번호, 수강일, 진척도, 완료여부
- **결제(Payments)**: 결제번호, 회원번호, 강의번호, 금액, 결제수단, 결제일
- **리뷰(Reviews)**: 리뷰번호, 회원번호, 강의번호, 평점, 내용, 작성일
- **질문(Questions)**: 질문번호, 회원번호, 강의번호, 제목, 내용, 답변수

각 엔티티의 속성을 정의할 때는 데이터 타입과 제약조건을 고려합니다. 예를 들어, 가격은 DECIMAL(10,2)로 소수점 둘째 자리까지 저장하고, 평점은 1-5 사이의 값만 허용하는 CHECK 제약조건을 추가합니다.

## ERD 설계와 관계 설정: 데이터 구조 시각화

요구사항 분석이 완료되면 ERD(Entity Relationship Diagram)를 작성합니다. ERD는 데이터베이스의 구조를 시각적으로 표현하는 도구로, 엔티티 간의 관계를 명확히 보여줍니다. 온라인 강의 플랫폼의 ERD를 설계해보겠습니다.

**주요 관계 설정:**
- Users ↔ Courses: 강사 관계 (1:N) - 한 강사가 여러 강의를 만들 수 있음
- Courses ↔ Categories: 분류 관계 (N:1) - 한 강의는 한 카테고리에 속함
- Courses ↔ Contents: 구성 관계 (1:N) - 한 강의에 여러 콘텐츠가 있음
- Users ↔ Enrollments: 수강 관계 (1:N) - 한 학습자가 여러 강의를 수강할 수 있음
- Courses ↔ Enrollments: 연결 관계 (1:N) - 한 강의에 여러 수강자가 있을 수 있음
- Enrollments ↔ Payments: 결제 관계 (1:1) - 한 수강에 하나의 결제
- Users ↔ Reviews: 평가 관계 (1:N) - 한 학습자가 여러 리뷰를 작성할 수 있음
- Courses ↔ Reviews: 대상 관계 (1:N) - 한 강의에 여러 리뷰가 달릴 수 있음
- Users ↔ Questions: 질문 관계 (1:N) - 한 학습자가 여러 질문을 할 수 있음
- Courses ↔ Questions: 대상 관계 (1:N) - 한 강의에 여러 질문이 달릴 수 있음

ERD 작성 시 까마귀 발 표기법을 사용합니다. 1쪽은 직선, N쪽은 세 갈래의 선(까마귀 발)으로 표시합니다. 선택적 참여는 원(O)으로, 필수 참여는 직선(|)으로 표시합니다.

실전에서는 MySQL Workbench, ERDCloud, draw.io 같은 도구를 사용합니다. 이러한 도구들은 ERD를 그리고 나서 SQL DDL로 자동 변환해주는 기능을 제공합니다. 팀 프로젝트에서는 ERDCloud처럼 실시간 협업이 가능한 도구가 유용합니다.

## 정규화와 최적화: 데이터 무결성과 성능 확보

ERD가 완성되면 정규화를 적용하여 데이터 중복을 제거합니다. 온라인 강의 플랫폼의 경우 3NF까지 적용하는 것이 일반적입니다.

**정규화 적용 예시:**
1. **1NF**: 모든 속성이 원자값인지 확인 - 카테고리 경로는 별도 테이블로 분리
2. **2NF**: 복합 키의 부분 종속 제거 - 수강 테이블에서 강의 정보 중복 제거
3. **3NF**: 이행 종속 제거 - 카테고리 테이블에서 상위 카테고리 정보 분리

제약조건을 설정하여 데이터 무결성을 보장합니다:
- PRIMARY KEY: 각 테이블의 고유 식별자
- FOREIGN KEY: 참조 관계 및 참조 무결성
- UNIQUE: 이메일, 강의 URL 등 중복 방지
- NOT NULL: 필수 입력 필드
- CHECK: 평점 범위, 가격 양수 등 유효성 검사

성능 최적화를 위해 인덱스를 전략적으로 추가합니다:
- 자주 조회되는 컬럼: courses.created_at, enrollments.progress
- JOIN에서 사용되는 FK: contents.course_id, enrollments.user_id
- 복합 인덱스: (user_id, course_id) for enrollments

동시성 문제를 고려하여 트랜잭션을 설계합니다. 수강 신청 시 SELECT FOR UPDATE로 좌석 제한을 처리하고, 결제 과정에서는 트랜잭션으로 데이터 일관성을 보장합니다.

## SQL 구현과 실전 적용: 완전한 데이터베이스 구축

이론적 설계를 SQL로 구현해보겠습니다. 각 테이블의 CREATE TABLE 스크립트를 작성합니다.

```sql
-- 회원 테이블
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('instructor', 'student') DEFAULT 'student',
    bio TEXT,
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 카테고리 테이블 (계층 구조 지원)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(category_id)
);

-- 강의 테이블
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    instructor_id INT NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    thumbnail VARCHAR(500),
    duration INT, -- 분 단위
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 강의 콘텐츠 테이블
CREATE TABLE contents (
    content_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    content_type ENUM('video', 'text', 'quiz', 'assignment') DEFAULT 'video',
    content TEXT, -- 비디오 URL 또는 텍스트 내용
    duration INT, -- 비디오 재생 시간 (초)
    sort_order INT NOT NULL,
    is_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 수강 테이블
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress DECIMAL(5,2) DEFAULT 0, -- 0-100
    completed_at TIMESTAMP NULL,
    last_accessed_at TIMESTAMP NULL,
    certificate_issued BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- 결제 테이블
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 리뷰 테이블
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE KEY unique_review (user_id, course_id)
);

-- 질문 테이블
CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
```

이 데이터베이스 설계는 확장성과 유지보수성을 고려했습니다. 새로운 기능(예: 토론방, 인증서 템플릿)을 추가할 때 기존 구조를 크게 변경하지 않고 확장할 수 있습니다. 실제 서비스 운영에서는 이 설계를 바탕으로 애플리케이션 로직을 구현하고, 성능 모니터링을 통해 지속적으로 최적화해야 합니다.
