---
title: '티켓 예약 시스템 DB 설계 실습: 요구사항부터 SQL 구현까지'
date: 2025-12-08
tags: ['DB설계', '티켓예약', 'ERD', '데이터베이스', '실습', 'SQL']
category: '백엔드'
description: '티켓 예약 시스템의 DB 설계를 처음부터 끝까지 실습해봅니다. 요구사항 분석부터 ERD 작성, 정규화, SQL 구현까지 단계별로 따라하며 실제 프로젝트에 적용할 수 있는 설계 노하우를 습득하세요.'
---

# 티켓 예약 시스템 DB 설계 실습: 요구사항부터 SQL 구현까지

현대 디지털 서비스에서 티켓 예약 시스템은 필수적인 기능입니다. 콘서트, 스포츠 경기, 영화, 연극 등 다양한 이벤트의 티켓을 온라인으로 예매할 수 있는 시스템입니다. 이 시스템의 핵심은 데이터베이스 설계입니다. 잘 설계된 DB는 수천 명의 동시 접속을 처리하면서도 데이터 일관성을 유지하고, 빠른 검색 성능을 제공합니다.

티켓 예약 시스템의 DB 설계는 복잡합니다. 회원 관리, 이벤트 정보, 좌석 배치, 예약 상태, 결제 정보 등 다양한 데이터를 효율적으로 저장하고 연결해야 합니다. 또한 동시성 문제(여러 사람이 같은 좌석을 예매하려는 상황), 데이터 무결성, 성능 최적화까지 고려해야 합니다.

이 글에서는 티켓 예약 시스템의 DB 설계를 처음부터 끝까지 실습해보겠습니다. 요구사항 분석부터 엔티티 식별, ERD 작성, 정규화 적용, SQL 구현까지 단계별로 진행합니다. 실제 프로젝트에서 바로 적용할 수 있도록 구체적인 예시와 SQL 코드를 함께 제공합니다. 이 실습을 통해 복잡한 비즈니스 로직을 데이터베이스 설계로 변환하는 방법을 배우게 될 것입니다.

## 요구사항 분석과 엔티티 식별: 티켓 예약 시스템의 핵심 요소

DB 설계를 시작하기 전에 시스템의 요구사항을 명확히 파악해야 합니다. 티켓 예약 시스템의 주요 기능은 다음과 같습니다:

1. 회원가입 및 로그인
2. 이벤트(공연, 경기 등) 정보 조회
3. 좌석 선택 및 예약
4. 결제 처리
5. 예약 확인 및 취소
6. 관리자용 이벤트 및 좌석 관리

이러한 요구사항을 바탕으로 필요한 엔티티를 식별해보겠습니다:

- **회원(Users)**: 회원번호, 이름, 이메일, 비밀번호, 전화번호, 가입일
- **이벤트(Events)**: 이벤트번호, 제목, 설명, 시작일시, 종료일시, 장소, 카테고리, 가격
- **좌석(Seats)**: 좌석번호, 이벤트번호, 좌석명(예: A구역 1열 5번), 등급, 가격, 상태
- **예약(Reservations)**: 예약번호, 회원번호, 이벤트번호, 좌석번호, 예약일시, 상태, 총금액
- **결제(Payments)**: 결제번호, 예약번호, 결제금액, 결제수단, 결제일시, 상태
- **장소(Venues)**: 장소번호, 이름, 주소, 수용인원, 좌석배치도

각 엔티티의 속성을 정의할 때는 데이터 타입과 제약조건을 고려합니다. 예를 들어, 회원번호는 AUTO_INCREMENT PRIMARY KEY로 설정하고, 이메일은 UNIQUE 제약조건을 추가합니다.

엔티티 간의 관계를 파악하는 것도 중요합니다:
- 회원과 예약: 1:N (한 회원이 여러 예약 가능)
- 이벤트와 좌석: 1:N (한 이벤트에 여러 좌석)
- 이벤트와 장소: N:1 (여러 이벤트가 한 장소에서 진행될 수 있음)
- 예약과 좌석: 1:1 (한 예약에 하나의 좌석)
- 예약과 결제: 1:1 (한 예약에 하나의 결제)

## ERD 설계와 테이블 관계 설정: 시각적 데이터 구조화

요구사항 분석이 완료되면 ERD(Entity Relationship Diagram)를 작성합니다. ERD는 데이터베이스의 구조를 시각적으로 표현하는 다이어그램입니다. 사각형으로 엔티티를, 마름모로 관계를, 선으로 연결을 표현합니다.

티켓 예약 시스템의 ERD를 단계별로 설계해보겠습니다:

1. **엔티티 배치**: 중앙에 핵심 엔티티인 예약(Reservations)을 배치하고, 주변에 관련 엔티티들을 배치합니다.

2. **관계 설정**:
   - Users ↔ Reservations: 1:N 관계 (까마귀 발 표기법으로 N쪽에 까마귀 발 표시)
   - Events ↔ Seats: 1:N 관계
   - Events ↔ Venues: N:1 관계
   - Reservations ↔ Seats: 1:1 관계
   - Reservations ↔ Payments: 1:1 관계

3. **속성 정의**: 각 엔티티에 속성을 추가합니다. PK는 밑줄로 표시하고, FK는 별도 표시합니다.

ERD 작성 시 주의할 점:
- 관계명은 명확하게 작성 (예: "예약하다", "소유하다")
- 기수성(Cardinality)은 정확히 표시 (1:1, 1:N, N:M)
- 약한 엔티티(Weak Entity)는 이중 사각형으로 표시
- 상속 관계(Inheritance)는 삼각형으로 표현

실전에서는 MySQL Workbench, ERDCloud, draw.io 등의 도구를 사용합니다. 이러한 도구들은 ERD를 그린 후 SQL DDL로 자동 변환해주는 기능도 제공합니다.

## 정규화와 제약조건 적용: 데이터 무결성 확보

ERD가 완성되면 정규화를 적용하여 데이터 중복을 제거합니다. 티켓 예약 시스템에 3NF(제3정규형)까지 적용해보겠습니다.

현재 설계에서 잠재적인 문제점:
- 이벤트 정보에 장소 정보가 중복될 수 있음
- 좌석 정보에 이벤트 가격이 중복될 수 있음

정규화 적용:
1. **1NF**: 모든 속성이 원자값인지 확인. 좌석명은 "A구역 1열 5번"처럼 하나의 값으로 표현되므로 OK.

2. **2NF**: 복합 키의 부분 종속 제거. Seats 테이블에 (event_id, seat_name)이 복합 키라면, seat_name만으로 결정되는 속성은 분리.

3. **3NF**: 이행 종속 제거. Events 테이블에서 venue_id → venue_name이면 venue_name을 Venues 테이블로 분리.

제약조건 적용:
- PRIMARY KEY: 각 테이블의 기본 키 설정
- FOREIGN KEY: 관계 설정 및 참조 무결성 보장
- UNIQUE: 이메일, 좌석명 등 중복 방지
- NOT NULL: 필수 입력 필드
- CHECK: 유효한 값 범위 설정 (예: 가격 > 0)

실전에서는 ON DELETE CASCADE 옵션을 신중하게 사용합니다. 예약 취소 시 관련 데이터 처리 방식을 결정해야 합니다.

## SQL 구현과 최적화 고려: 실제 데이터베이스 구축

이론적 설계가 완료되면 SQL로 실제 데이터베이스를 구현합니다. 각 테이블을 CREATE TABLE 문으로 생성합니다.

```sql
-- 회원 테이블
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 장소 테이블
CREATE TABLE venues (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    capacity INT,
    layout_image VARCHAR(500)
);

-- 이벤트 테이블
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME,
    venue_id INT,
    category VARCHAR(50),
    base_price DECIMAL(10,2),
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
);

-- 좌석 테이블
CREATE TABLE seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    seat_name VARCHAR(50) NOT NULL,
    grade VARCHAR(20),
    price DECIMAL(10,2),
    status ENUM('available', 'reserved', 'sold') DEFAULT 'available',
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    UNIQUE KEY unique_seat_per_event (event_id, seat_name)
);

-- 예약 테이블
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    seat_id INT NOT NULL,
    reservation_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id),
    UNIQUE KEY unique_active_reservation (seat_id, status)
);

-- 결제 테이블
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);
```

성능 최적화를 위해 인덱스를 추가합니다:
- 자주 조회되는 컬럼에 인덱스 (events.start_datetime, seats.status)
- FK 컬럼에 자동 생성되는 인덱스 확인
- 복합 인덱스 고려 (user_id + status)

동시성 문제를 해결하기 위해 트랜잭션을 사용합니다. 좌석 예약 시 SELECT FOR UPDATE로 락을 걸어 중복 예약을 방지합니다.

이 실습을 통해 티켓 예약 시스템의 DB 설계를 마스터했습니다. 실제 프로젝트에서는 이 설계를 바탕으로 애플리케이션 로직을 구현하고, 성능 테스트를 통해 최적화를 진행합니다. 데이터베이스 설계는 한 번에 완성되지 않습니다. 서비스 운영 중에도 지속적으로 모니터링하고 개선해야 합니다.
