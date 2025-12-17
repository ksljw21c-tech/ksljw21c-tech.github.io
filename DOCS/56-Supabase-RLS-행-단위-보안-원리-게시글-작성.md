# Supabase RLS: 행 단위 보안 원리

현대 웹 애플리케이션에서 데이터 보안은 가장 중요한 요소 중 하나입니다. 특히 다중 사용자 환경에서 각 사용자가 자신의 데이터만 접근할 수 있도록 하는 것은 필수적인 요구사항입니다. 전통적인 애플리케이션에서는 백엔드 서버에서 사용자 인증과 권한 검사를 수행했지만, 이는 복잡한 로직과 추가적인 서버 리소스를 필요로 했습니다. Supabase는 PostgreSQL의 강력한 Row Level Security(RLS) 기능을 기반으로 한 보안 메커니즘을 제공하여 이러한 문제를 혁신적으로 해결합니다.

RLS는 말 그대로 행 단위의 보안을 의미하며, 데이터베이스 수준에서 각 행에 대한 접근 권한을 세밀하게 제어할 수 있게 해줍니다. 이는 애플리케이션 레벨의 보안과 달리 데이터베이스 엔진 자체에서 보안 규칙을 적용하므로 더욱 견고하고 효율적입니다. Supabase에서는 RLS를 기본적으로 활성화하여 모든 테이블에 대한 접근을 안전하게 보호합니다.

이 글에서는 Supabase RLS의 기본 원리부터 실제 구현 방법과 활용 사례까지 자세히 살펴보겠습니다. RLS의 작동 방식, 정책 생성 방법, 실제 사용 예시, 그리고 성능과 보안 고려사항까지 포괄적으로 다룰 것입니다. RLS를 제대로 이해하고 활용한다면 애플리케이션의 보안을 한 단계 업그레이드할 수 있으며, 개발 생산성도 크게 향상될 수 있습니다.

## RLS의 기본 개념과 작동 방식

Row Level Security는 PostgreSQL의 내장 기능으로, 테이블의 각 행에 대한 접근을 제어하는 정책 기반 보안 메커니즘입니다. RLS는 단순한 접근 제한을 넘어, 데이터베이스 쿼리 자체에 보안 규칙을 적용합니다. 기본적으로 RLS가 활성화된 테이블에서는 모든 쿼리에 암묵적인 WHERE 절이 추가되어 사용자가 접근할 수 있는 행만 반환됩니다. 이로 인해 애플리케이션 레벨에서 별도의 권한 검사를 수행할 필요가 없습니다.

RLS의 핵심은 정책(Policy)입니다. 정책은 SQL로 작성된 규칙으로, 특정 조건을 만족하는 행에만 접근을 허용합니다. 예를 들어, "사용자는 자신의 프로필 정보만 수정할 수 있다"는 정책은 다음과 같이 표현될 수 있습니다:

```sql
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);
```

이 정책은 profiles 테이블의 UPDATE 작업에 적용되며, 현재 인증된 사용자의 ID(auth.uid())가 해당 행의 user_id와 일치하는 경우에만 수정을 허용합니다.

RLS의 작동 방식은 매우 직관적입니다. 사용자가 쿼리를 실행하면 PostgreSQL은 먼저 RLS 정책을 확인하고, 해당 사용자가 접근할 수 있는 행만 필터링합니다. 이 과정은 데이터베이스 엔진 수준에서 자동으로 수행되므로 애플리케이션 코드에서 별도의 보안 로직을 구현할 필요가 없습니다. 예를 들어, 다음과 같은 간단한 SELECT 쿼리가 있다고 가정해봅시다:

```sql
SELECT * FROM todos;
```

RLS가 적용된 상태라면 이 쿼리는 자동으로 다음과 같이 변환됩니다:

```sql
SELECT * FROM todos WHERE auth.uid() = user_id;
```

이렇게 암묵적인 WHERE 절이 추가되어 사용자가 자신의 데이터만 조회할 수 있게 됩니다. 또한 RLS는 성능에 미치는 영향이 최소화되도록 설계되어 있어, 대규모 애플리케이션에서도 효율적으로 동작합니다. 정책에 인덱스를 적절히 활용하면 성능 저하를 거의 느끼지 못할 정도입니다.

## Supabase에서의 RLS 구현

Supabase는 PostgreSQL의 RLS 기능을 완전히 지원하면서도 더 사용하기 쉽게 만들어졌습니다. Supabase 대시보드에서 간단한 클릭으로 RLS를 활성화할 수 있으며, 직관적인 인터페이스로 정책을 생성하고 관리할 수 있습니다. Supabase의 RLS 구현은 특히 인증 시스템과 밀접하게 통합되어 있어 더욱 강력합니다. Supabase Auth와의 통합으로 사용자 인증 정보를 쉽게 활용할 수 있습니다.

Supabase에서 RLS를 구현하는 첫 번째 단계는 테이블에 RLS를 활성화하는 것입니다. SQL에서는 다음과 같은 명령을 사용합니다:

```sql
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
```

Supabase 대시보드에서는 Table Editor에서 해당 테이블을 선택한 후 RLS 토글을 켜는 것만으로 간단히 활성화할 수 있습니다. RLS가 활성화되면 해당 테이블에 대한 모든 접근이 정책에 의해 제어됩니다. 이 시점부터는 어떠한 쿼리도 정책이 허용하지 않는 한 실행될 수 없습니다.

정책 생성은 Supabase의 핵심 기능 중 하나입니다. 정책은 USING 절과 WITH CHECK 절을 통해 정의됩니다. USING 절은 기존 행에 대한 접근 조건을 정의하며, SELECT, UPDATE, DELETE 작업에 적용됩니다. WITH CHECK 절은 새로운 행의 삽입이나 수정 시 적용되는 조건을 정의하며, INSERT와 UPDATE 작업에 적용됩니다.

예를 들어, 할 일 관리 애플리케이션에서 사용자가 자신의 할 일만 조회할 수 있도록 하는 정책은 다음과 같이 생성할 수 있습니다:

```sql
CREATE POLICY "Users can view own todos"
ON todos FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

이 정책은 인증된 사용자(authenticated)에게만 적용되며, 현재 로그인한 사용자의 ID(auth.uid())가 할 일의 user_id와 일치하는 경우에만 조회를 허용합니다.

새로운 할 일을 생성할 때는 다음과 같은 정책을 추가할 수 있습니다:

```sql
CREATE POLICY "Users can create own todos"
ON todos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

WITH CHECK 절은 삽입되는 데이터가 정책 조건을 만족하는지 검증합니다.

Supabase는 auth.uid()와 auth.jwt() 같은 헬퍼 함수를 제공하여 인증된 사용자의 정보를 쉽게 활용할 수 있습니다. auth.uid()는 현재 인증된 사용자의 고유 ID를 반환하며, auth.jwt()는 JWT 토큰 전체에 접근할 수 있게 해줍니다.

Supabase의 RLS는 역할 기반 접근 제어도 지원합니다. authenticated와 anon이라는 두 가지 기본 역할을 통해 로그인한 사용자와 익명의 사용자를 구분할 수 있습니다. 이를 통해 공개 데이터와 개인 데이터를 효과적으로 분리할 수 있습니다. 예를 들어, 사용자 프로필은 인증된 사용자만 접근할 수 있지만, 공개 게시글은 익명 사용자도 조회할 수 있도록 설정할 수 있습니다.

또한 커스텀 역할을 생성하여 더 복잡한 권한 구조를 구현할 수도 있습니다. PostgreSQL의 역할 시스템과 Supabase의 RLS가 결합되면 매우 유연한 보안 모델을 구축할 수 있습니다.

## RLS의 실제 활용과 보안 고려사항

RLS의 실제 활용 사례를 살펴보면 그 유용성을 더 잘 이해할 수 있습니다. 사용자 프로필 관리 애플리케이션에서는 각 사용자가 자신의 프로필만 수정할 수 있도록 정책을 설정할 수 있습니다. 할 일 관리 앱에서는 사용자가 자신의 할 일만 조회하고 수정할 수 있게 됩니다. 팀 협업 도구에서는 팀 멤버만 프로젝트 데이터에 접근할 수 있도록 제어할 수 있습니다.

첫 번째 사례인 사용자 프로필 관리 애플리케이션을 살펴보겠습니다. profiles 테이블에 다음과 같은 정책들을 적용할 수 있습니다:

```sql
-- 모든 사용자가 프로필을 조회할 수 있지만 공개 정보만
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 사용자는 자신의 프로필만 수정할 수 있음
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 사용자는 자신의 프로필만 삭제할 수 있음
CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);
```

이렇게 설정하면 공개 프로필 정보는 누구나 볼 수 있지만, 수정과 삭제는 본인만 가능합니다.

두 번째 사례로 할 일 관리 애플리케이션을 들 수 있습니다:

```sql
-- 사용자는 자신의 할 일만 조회할 수 있음
CREATE POLICY "Users can view own todos"
ON todos FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 사용자는 자신의 할 일만 생성할 수 있음
CREATE POLICY "Users can create own todos"
ON todos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 할 일만 수정할 수 있음
CREATE POLICY "Users can update own todos"
ON todos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

세 번째 사례로 팀 협업 도구를 들 수 있습니다. 여기서는 다대다 관계를 활용한 복잡한 정책이 필요합니다:

```sql
-- 팀 멤버만 프로젝트를 조회할 수 있음
CREATE POLICY "Team members can view projects"
ON projects FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM team_members
    WHERE team_members.team_id = projects.team_id
  )
);

-- 팀 멤버만 프로젝트를 수정할 수 있음
CREATE POLICY "Team members can update projects"
ON projects FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM team_members
    WHERE team_members.team_id = projects.team_id
  )
);
```

RLS를 효과적으로 활용하기 위한 몇 가지 보안 고려사항이 있습니다. 첫째, 정책은 최소 권한 원칙을 따라야 합니다. 필요한 최소한의 접근만 허용하고 불필요한 권한은 제거해야 합니다. 둘째, 정책의 복잡성을 적절히 관리해야 합니다. 지나치게 복잡한 정책은 성능 저하를 일으킬 수 있습니다. 셋째, RLS는 데이터베이스 수준의 보안이므로 애플리케이션 레벨의 추가 보안 조치와 함께 사용해야 합니다.

Supabase RLS의 성능 최적화도 중요한 고려사항입니다. 정책에서 사용하는 컬럼에 인덱스를 생성하는 것이 필수적입니다. 예를 들어, user_id 컬럼에 인덱스를 추가하면 정책 평가 속도가 크게 향상됩니다:

```sql
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_todos_user_id ON todos(user_id);
```

또한 정책에서 함수 호출을 최소화하는 기법을 사용할 수 있습니다. auth.uid() 함수는 쿼리당 한 번만 호출되도록 SELECT 절로 감싸는 것이 좋습니다:

```sql
USING ((SELECT auth.uid()) = user_id)
```

디버깅을 위해 정책이 제대로 적용되는지 확인하는 것도 중요합니다. Supabase에서는 SQL 에디터에서 다음과 같은 쿼리로 현재 적용된 정책을 확인할 수 있습니다:

```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

RLS를 테스트하기 위해 임시로 정책을 비활성화할 수도 있습니다:

```sql
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

결론적으로 Supabase RLS는 현대 웹 애플리케이션의 보안을 위한 강력한 도구입니다. 행 단위의 세밀한 접근 제어를 통해 데이터 보안을 강화하고, 개발자가 보다 안전한 애플리케이션을 구축할 수 있게 해줍니다. RLS의 올바른 이해와 활용은 애플리케이션의 신뢰성과 사용자 경험을 동시에 향상시키는 데 기여합니다. 특히 Supabase의 인증 시스템과 결합하면 더욱 강력한 보안 아키텍처를 구축할 수 있습니다.
