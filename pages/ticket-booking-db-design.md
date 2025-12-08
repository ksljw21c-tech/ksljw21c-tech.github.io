---
title: '티켓 예약 시스템 DB 설계 실습: 실전 데이터베이스 모델링'
date: 2025-12-08
tags: ['데이터베이스', 'DB설계', '티켓예약', 'ERD', '정규화', 'SQL', '시스템설계']
category: '백엔드'
description: '실전 티켓 예약 시스템의 데이터베이스를 처음부터 끝까지 설계하는 과정을 단계별로 알아봅니다. 요구사항 분석부터 ERD, 정규화, SQL 구현까지 완벽 가이드입니다.'
---

# 티켓 예약 시스템 DB 설계 실습: 실전 데이터베이스 모델링

현실 세계의 비즈니스 로직을 데이터베이스 구조로 변환하는 것은 데이터베이스 설계자의 핵심 역량입니다. 특히 티켓 예약 시스템은 동시성 제어, 데이터 무결성, 성능 최적화 등 다양한 기술적 도전 과제를 안고 있습니다. 하나의 티켓을 두 명이 동시에 예약하려는 Race Condition, 수백만 건의 좌석 데이터를 효율적으로 조회하는 문제, 예약 취소 시 복잡한 비즈니스 규칙 처리 등 실제 운영 환경에서 발생하는 문제들을 데이터베이스 설계 단계에서 해결해야 합니다.

이 글에서는 티켓 예약 시스템의 데이터베이스를 처음부터 끝까지 설계하는 실전 과정을 다루겠습니다. 단순한 이론 설명이 아니라, 실제 프로젝트에서 적용할 수 있는 구체적인 설계 방법론을 제공합니다. 요구사항 분석부터 개념적 설계, 논리적 설계, 물리적 설계까지의 전 과정을 단계별로 진행하면서 각 단계에서 고려해야 할 사항들과 트레이드오프를 깊이 있게 다룹니다.

티켓 예약 시스템은 전자상거래, 이벤트 관리, 좌석 배정 등 다양한 도메인의 복잡한 요구사항을 모두 만족시켜야 합니다. 따라서 데이터베이스 설계 시에는 비즈니스 요구사항을 정확히 이해하고, 확장성과 성능을 모두 고려한 균형 잡힌 설계를 추구해야 합니다. 이 글을 통해 독자들은 실전 데이터베이스 설계의 전 과정을 마스터하게 될 것입니다.

## 요구사항 분석과 개념적 설계

티켓 예약 시스템의 데이터베이스 설계를 시작하기 전에 철저한 요구사항 분석이 필요합니다. 요구사항 분석은 비즈니스 로직을 이해하고, 이를 데이터 모델로 변환하는 핵심 단계입니다. 티켓 예약 시스템의 주요 요구사항을 정리해보면 다음과 같습니다.

첫째, 사용자 관리를 위한 기본 정보가 필요합니다. 회원과 비회원 모두 티켓을 예약할 수 있어야 하므로 사용자 테이블은 필수적입니다. 이메일, 전화번호 등 연락처 정보와 함께 회원 등급이나 포인트 정보도 관리해야 합니다.

둘째, 이벤트 정보를 구조화해야 합니다. 공연, 스포츠 경기, 콘서트 등 다양한 이벤트 유형을 지원해야 하므로 이벤트 테이블에는 제목, 날짜, 시간, 장소, 가격 정보 등이 포함됩니다. 하나의 이벤트는 여러 회차를 가질 수 있으므로 이벤트와 회차를 분리해서 설계해야 합니다.

셋째, 좌석 관리는 시스템의 핵심입니다. 각 공연장은 섹터, 열, 번호로 구성된 좌석 정보를 가져야 합니다. 좌석 등급(일반석, VIP석 등)에 따른 가격 차별화와 예약 가능 상태 관리가 필요합니다.

넷째, 예약 프로세스를 지원해야 합니다. 예약 생성, 결제 처리, 예약 확인, 취소 및 환불 기능이 모두 데이터베이스에서 처리되어야 합니다. 특히 동시성 제어와 트랜잭션 무결성이 중요합니다.

요구사항 분석을 완료했다면 개념적 설계 단계로 넘어갑니다. 개념적 설계에서는 ERD(Entity Relationship Diagram)를 통해 엔티티와 관계를 정의합니다. 티켓 예약 시스템의 주요 엔티티는 다음과 같습니다:

- 사용자(User): 시스템을 이용하는 고객 정보
- 이벤트(Event): 공연이나 경기 등의 행사 정보
- 회차(Session): 이벤트의 특정 날짜/시간 정보
- 좌석(Seat): 공연장의 물리적 좌석 정보
- 예약(Reservation): 사용자의 티켓 예약 정보
- 결제(Payment): 예약에 대한 결제 정보

각 엔티티 간의 관계도 정의해야 합니다. 사용자와 예약은 1:N 관계, 이벤트와 회차는 1:N 관계, 회차와 좌석은 N:M 관계(하나의 회차에 여러 좌석이 있고, 하나의 좌석은 여러 회차에서 사용될 수 있지만, 실제로는 회차별로 예약되므로 조정 필요), 예약과 좌석은 N:M 관계(하나의 예약에 여러 좌석, 하나의 좌석은 하나의 예약에만 속함)입니다.

개념적 설계 단계에서는 비즈니스 규칙을 정확히 반영하는 것이 중요합니다. 예를 들어, 같은 사용자가 같은 회차의 여러 좌석을 예약할 수 있는지, 예약 취소 시 환불 정책은 어떻게 되는지 등의 규칙을 ERD에 반영해야 합니다.

## 논리적 설계와 정규화 적용

개념적 설계를 완료했다면 논리적 설계 단계로 진행합니다. 논리적 설계에서는 개념적 모델을 관계형 데이터베이스 스키마로 변환하고, 정규화를 적용하여 데이터 무결성과 효율성을 확보합니다.

먼저 엔티티를 테이블로 변환합니다. 각 엔티티의 속성을 컬럼으로 정의하고, 적절한 데이터 타입을 지정합니다. 예를 들어:

```sql
-- 사용자 테이블
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    membership_level ENUM('BRONZE', 'SILVER', 'GOLD') DEFAULT 'BRONZE',
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 이벤트 테이블
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('CONCERT', 'SPORTS', 'THEATER', 'EXHIBITION'),
    organizer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(user_id)
);
```

관계를 외래 키로 구현합니다. 1:N 관계는 N측 테이블에 FK를 추가하고, N:M 관계는 연결 테이블을 생성합니다. 티켓 예약 시스템에서는 다음과 같은 관계가 형성됩니다:

- events - sessions: 1:N (한 이벤트에 여러 회차)
- venues - seats: 1:N (한 공연장에 여러 좌석)
- sessions - seats: M:N (실제로는 reservations을 통해 연결)

정규화는 데이터 중복을 제거하고 무결성을 보장하기 위해 필수적입니다. 티켓 예약 시스템에 정규화를 적용해보겠습니다.

1NF 적용: 모든 속성이 원자값을 가지도록 합니다. 예를 들어, 사용자의 취미를 콤마로 구분해서 저장하지 않고 별도 테이블로 분리합니다.

2NF 적용: 복합 키의 부분적 종속성을 제거합니다. 만약 예약 상세 테이블이 (reservation_id, seat_id)를 복합 키로 가진다면, 예약 날짜나 사용자 정보가 reservation_id에만 종속되도록 분리합니다.

3NF 적용: 이행적 종속성을 제거합니다. 예를 들어, 좌석 테이블에서 구역 정보가 구역 ID를 통해 결정된다면 구역 정보를 별도 테이블로 분리합니다.

정규화 과정에서 성능과 무결성 사이의 균형을 고려해야 합니다. 때로는 의도적인 역정규화(중복 저장)를 통해 조회 성능을 향상시키기도 합니다. 예를 들어, 예약 목록 조회 시 자주 사용하는 이벤트 제목을 예약 테이블에 중복 저장할 수 있습니다.

## 물리적 설계와 SQL 구현

논리적 설계를 완료했다면 물리적 설계 단계로 진행합니다. 물리적 설계에서는 실제 데이터베이스에 적용할 수 있는 구체적인 SQL 스크립트를 작성하고, 인덱스, 제약조건 등을 정의합니다.

먼저 전체 테이블 구조를 정의합니다. 티켓 예약 시스템의 완전한 스키마는 다음과 같습니다:

```sql
-- 공연장 정보
CREATE TABLE venues (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    capacity INT
);

-- 좌석 정보
CREATE TABLE seats (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_id INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    row_num VARCHAR(5) NOT NULL,
    seat_num VARCHAR(5) NOT NULL,
    seat_type ENUM('GENERAL', 'VIP', 'PREMIUM') DEFAULT 'GENERAL',
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id),
    UNIQUE KEY unique_seat (venue_id, section, row_num, seat_num)
);

-- 이벤트 회차
CREATE TABLE event_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    venue_id INT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
);

-- 예약 정보
CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_id INT NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (session_id) REFERENCES event_sessions(session_id)
);

-- 예약 상세 (어떤 좌석을 예약했는지)
CREATE TABLE reservation_details (
    reservation_id INT NOT NULL,
    seat_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (reservation_id, seat_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

-- 결제 정보
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    payment_method ENUM('CARD', 'BANK_TRANSFER', 'PAYPAL'),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
    transaction_id VARCHAR(100),
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);
```

인덱스 설계가 중요합니다. 자주 조회되는 컬럼에 인덱스를 생성하여 성능을 최적화합니다:

```sql
-- 조회 성능을 위한 인덱스
CREATE INDEX idx_event_sessions_date ON event_sessions(session_date);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_session ON reservations(session_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_payments_reservation ON payments(reservation_id);
```

동시성 제어를 위한 트랜잭션 처리도 고려해야 합니다. 특히 좌석 예약 시 Race Condition을 방지하기 위해 다음과 같은 처리가 필요합니다:

```sql
-- 좌석 예약 트랜잭션 예시
START TRANSACTION;

-- 좌석 예약 가능 여부 확인 및 잠금
SELECT seat_id FROM seats 
WHERE seat_id = ? AND seat_id NOT IN (
    SELECT seat_id FROM reservation_details rd
    JOIN reservations r ON rd.reservation_id = r.reservation_id
    WHERE r.session_id = ? AND r.status IN ('PENDING', 'CONFIRMED')
) FOR UPDATE;

-- 예약 처리
INSERT INTO reservations (user_id, session_id, total_amount) 
VALUES (?, ?, ?);

INSERT INTO reservation_details (reservation_id, seat_id, price) 
VALUES (LAST_INSERT_ID(), ?, ?);

COMMIT;
```

데이터베이스 설계의 마지막 단계는 테스트와 최적화입니다. 실제 데이터를 입력하고 쿼리 성능을 측정하면서 개선점을 찾아나갑니다. 티켓 예약 시스템처럼 실시간성이 중요한 시스템에서는 특히 성능 최적화가 중요합니다.

이렇게 완성된 데이터베이스 설계는 티켓 예약 시스템의 모든 요구사항을 만족시키며, 확장성과 유지보수성도 고려한 실전적인 모델입니다. 데이터베이스 설계의 전 과정을 통해 체계적인 시스템 개발 방법을 익힐 수 있었습니다.