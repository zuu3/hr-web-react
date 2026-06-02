---
omd: 0.1
brand: STK-HR
bootstrapped_from: flex
bootstrapped_at: 2026-06-02T00:00:00Z
---

# STK-HR — Design Reference

> **모든 근태·지출 데이터, STK-HR 하나로.**
>
> STK Engineering 사내 HR 관리 시스템: 엑셀 수기 작성을 단일 플랫폼으로 대체. Pretendard 기반 모노크롬 대시보드, 데이터 밀도 중심, 운영자 시선 카피.

---

## 1. Visual Theme & Atmosphere

**STK-HR**은 STK Engineering 임직원의 근태 기록과 지출 내역을 통합 관리하는 사내 웹 기반 업무 지원 시스템. 수기 엑셀의 입력 오류·집계 불일치를 단일 시스템으로 해결한다.

design-noteworthy:

- **One ink color**: 모든 텍스트는 `#1D1D1F` 또는 alpha 변형(`0.96`, `0.72`, `0.04`). 색이 아니라 weight·alpha가 위계를 만든다.
- **데이터 테이블 중심**: 근태 요약·지출 내역은 dense table 레이아웃. 카드보다 행·열 우선.
- **수치 정확성**: 마일리지(km × 유가 × 0.1), 근로시간(OT·야간·휴일), 비용 — 반올림·약식 금지. 표시 단위까지 명시.
- **직군 분기**: 엔지니어(작업/이동/대기 시간) vs 자재관리(자재 반출입 기록) 입력 폼이 분리되지만 동일 ink 시스템으로 통일.
- **Ring, not border**: 1px inset shadow ring으로 상태 전환. layout shift 0.

---

## 2. Layout & Grid

- **Container width**: `1280px` max; 사이드바 + 콘텐츠 2-column 레이아웃.
- **Sidebar**: `240px` 고정 (대시보드 네비게이션).
- **Content area**: `1040px` — 8px grid 기준.
- **Outer gutter**: `24px` 내부 padding (사이드바 내부, 카드 내부).
- **Vertical rhythm**: 섹션 간격 `32px`; 카드 내부 padding `20px 24px`; 테이블 row height `48px`.
- **Card grid**: 요약 카드 4-up (총 근로시간 / OT / 야간 / 휴일). 동일 너비 균등 배분.
- **Header**: `64px` tall, light theme. 사이드바 위에 고정.

---

## 3. Color & Typography

### Color tokens

**Ink scale (단일 hue, alpha-stepped):**
- `#1D1D1F` — 기본 텍스트 (light surface)
- `rgba(29,29,31,0.96)` — 헤더·제목
- `rgba(29,29,31,0.72)` — 보조 텍스트·레이블
- `rgba(29,29,31,0.40)` — placeholder·비활성 텍스트
- `rgba(29,29,31,0.10)` — 구분선·비활성 테두리
- `rgba(29,29,31,0.04)` — hover 배경·활성 pill 배경
- `rgba(29,29,31,0.24)` — 활성 ring

**Surfaces:**
- `#FFFFFF` — 메인 캔버스
- `#F7F7F7` — 사이드바·테이블 헤더 배경
- `#2D3338` — 요약 카드 (dark graphite)
- `#FDFDFD` — 카드 내 텍스트 베이스

**On-dark:**
- `#FFFFFF` — dark card 위 기본 텍스트
- `rgba(255,255,255,0.60)` — dark card 위 보조 텍스트

**Semantic status (데이터 전용 — 본문 chrome에 쓰지 말 것):**
- `#34C759` — 정상 출근 / 승인됨 (iOS green)
- `#FF3B30` — 오류·거절 (iOS red)
- `#FF9500` — 대기 중·주의 (iOS orange)
- `#007AFF` — 정보·링크 (iOS blue) — CTA primary 금지, 상태 표시만

**No accent color for CTA.** 버튼 primary는 `#1D1D1F` fill + `#FFFFFF` text. 색깔 accent CTA는 쓰지 않는다.

### Typography

- **Family**: `Pretendard Variable` — 한글·라틴 동일 폰트. 시스템 fallback: `-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif`.
- **Weights**: 400(본문), 500(레이블), 600(강조·테이블 헤더), 700(제목·수치).
- **Display h1 (페이지 제목)**: `28px / 36px / 700 / -0.5px tracking`.
- **Section h2**: `20px / 28px / 700 / -0.3px tracking`.
- **Body**: `14px / 22px / 400`.
- **Table cell**: `14px / 20px / 500` (일반), `14px / 20px / 700` (수치 강조).
- **Label/meta**: `12px / 16px / 500 / 0px tracking`.
- **수치 표기**: tabular-nums 활성화 (`font-variant-numeric: tabular-nums`). 모든 시간·금액은 오른쪽 정렬.

---

## 4. Components

### Button — primary

**Default**
- Background: `#1D1D1F`
- Text: `#FFFFFF`
- Border: none
- Shadow: none
- Radius: `10px`
- Padding: `10px 16px`
- Height: `40px`
- Font: `14px / 20px / 600 / Pretendard Variable`
- Use: 저장, 제출, 로그인 등 주요 action

**Hover**
- Background: `rgba(29,29,31,0.85)`
- Transition: `background 150ms ease`

**Disabled**
- Background: `rgba(29,29,31,0.12)`
- Text: `rgba(29,29,31,0.40)`
- Cursor: `not-allowed`

### Button — secondary

**Default**
- Background: `#FFFFFF`
- Text: `#1D1D1F`
- Shadow: `rgba(29,29,31,0.10) 0px 0px 0px 1px inset`
- Radius: `10px`
- Padding: `10px 16px`
- Height: `40px`
- Font: `14px / 20px / 600 / Pretendard Variable`
- Use: 취소, 초기화, 보조 action

**Hover**
- Shadow: `rgba(29,29,31,0.24) 0px 0px 0px 1px inset`
- Background: `rgba(29,29,31,0.02)`

### Button — ghost/tab (활성 필터)

**Active**
- Background: `rgba(29,29,31,0.04)`
- Shadow: `rgba(29,29,31,0.24) 0px 0px 0px 1px inset`
- Radius: `10px`
- Font: weight `700`

**Inactive**
- Background: `#FFFFFF`
- Shadow: `rgba(29,29,31,0.10) 0px 0px 0px 1px inset`
- Font: weight `600`

### Card — summary (dark graphite)

**Default**
- Background: `#2D3338`
- Text: `#FDFDFD`
- Border: none
- Radius: `16px`
- Padding: `20px 24px`
- Shadow: `rgba(0,0,0,0.12) 0px 0px 0px 0.5px, rgba(0,0,0,0.06) 0px 8px 20px -4px`
- Use: 총 근로시간 / OT / 야간 / 휴일 요약 4-up

**수치 표기 (card 내부)**
- 수치: `32px / 38px / 700 / tabular-nums / #FFFFFF`
- 레이블: `12px / 16px / 500 / rgba(255,255,255,0.60)`
- 단위: `14px / 20px / 500 / rgba(255,255,255,0.60)` (수치 오른쪽 inline)

### Card — standard (light)

**Default**
- Background: `#FFFFFF`
- Shadow: `rgba(0,0,0,0.06) 0px 1px 4px, rgba(0,0,0,0.04) 0px 0px 0px 0.5px`
- Radius: `12px`
- Padding: `20px 24px`
- Use: 폼 컨테이너, 섹션 그룹

### Table

**Header row**
- Background: `#F7F7F7`
- Text: `rgba(29,29,31,0.72)` / `12px / 16px / 600`
- Border-bottom: `rgba(29,29,31,0.10) 1px solid`
- Row height: `40px`

**Body row**
- Background: `#FFFFFF`
- Text: `#1D1D1F` / `14px / 20px / 500`
- Border-bottom: `rgba(29,29,31,0.06) 1px solid`
- Row height: `48px`

**Hover row**
- Background: `rgba(29,29,31,0.02)`

**수치 셀**: 오른쪽 정렬, `font-variant-numeric: tabular-nums`, weight `700`.

**상태 셀 (출근 상태 등)**: 인라인 dot `6px` circle + text. dot 색만 semantic color 사용.

### Input

**Default**
- Background: `#FFFFFF`
- Shadow: `rgba(29,29,31,0.10) 0px 0px 0px 1px inset`
- Radius: `10px`
- Padding: `10px 14px`
- Height: `40px`
- Font: `14px / 20px / 400`

**Focus**
- Shadow: `rgba(29,29,31,0.40) 0px 0px 0px 1.5px inset`

**Error**
- Shadow: `rgba(255,59,48,0.40) 0px 0px 0px 1.5px inset`
- 아래 error message: `12px / 16px / 500 / #FF3B30`

### Sidebar navigation

**Container**
- Background: `#F7F7F7`
- Width: `240px`
- Border-right: `rgba(29,29,31,0.08) 1px solid`

**Nav item (active)**
- Background: `rgba(29,29,31,0.06)`
- Shadow: `rgba(29,29,31,0.12) 0px 0px 0px 1px inset`
- Radius: `8px`
- Text: `#1D1D1F` / weight `700`
- Padding: `8px 12px`

**Nav item (inactive)**
- Background: transparent
- Text: `rgba(29,29,31,0.72)` / weight `500`
- Hover: Background `rgba(29,29,31,0.04)`

---

## 5. Iconography

- Lucide React (hairline, `strokeWidth: 1.5`) — 전체 통일.
- 색상: `rgba(29,29,31,0.72)` (보조), `#1D1D1F` (강조).
- 크기: `16px` (inline), `20px` (nav), `24px` (large action).
- Two-tone / color-fill 금지. 상태는 ink alpha로만 구분.

---

## 6. Imagery & Illustration

- **데이터 시각화 (Recharts)**: 선 차트 (근로시간 트렌드), 막대 차트 (일별 지출). 색상은 `#1D1D1F` 단색 fill + `rgba(29,29,31,0.10)` 배경 grid. 색깔 강조 대신 두께·opacity 변화.
- **Empty state**: 텍스트만. "이번 달 데이터가 없습니다." — 마침표. 일러스트 없음.
- **스톡 사진 없음**: UI 구성 요소와 실제 수치 데이터만.

---

## 7. Motion

**Duration**
- `instant`: 0ms — 토글·pill active 즉시 반영
- `short`: 150ms — hover ring/bg 전환
- `default`: 240ms — 페이지 진입, 카드 fade-in
- `long`: 400ms — 테이블 row stagger (40ms 간격)

**Easing**
- `out-quart` (`cubic-bezier(0.25, 1, 0.5, 1)`) — 페이지 entry, 카드 fade
- `in-out-cubic` (`cubic-bezier(0.65, 0, 0.35, 1)`) — 필터 pill 전환

**Motion rules**
1. Translate ≤ 8px. 과한 슬라이드 없음.
2. Opacity primary. fade-in + tiny translateY가 모든 entry 모션.
3. No spring bounce. overshoot 0.
4. Stagger ≤ 60ms per row (테이블).

---

## 8. Accessibility

- `#1D1D1F` on `#FFFFFF` = 18.27:1 (AAA).
- `#FDFDFD` on `#2D3338` = 13.21:1 (AAA).
- `rgba(255,255,255,0.60)` on `#2D3338` ≈ 5.8:1 (AA body 통과).
- Semantic status colors는 색+텍스트+도형 3개 중 2개 이상 동시 사용 (색약 대응).
- Focus ring: 2px `rgba(29,29,31,0.60)` outline offset 2px.
- 모든 입력 필드 `<label>` 명시적 연결.
- 수치 셀 `aria-label`에 단위 포함: `aria-label="총 근로시간 176시간"`.

---

## 9. Content & Voice

STK-HR의 카피 위계:

1. **페이지 제목**: "이번 달 근태 현황" — 동사 없음. 마침표 없어도 됨. 조회 맥락 명시.
2. **요약 카드 레이블**: "총 근로시간" / "OT 시간" / "야간 근무" / "휴일 근무" — 명사형.
3. **빈 상태**: "이번 달 지출 내역이 없습니다." — 평서형 마침표.
4. **오류 메시지**: "날짜를 선택해 주세요." — 구체적 안내, 사과 없음.
5. **성공 피드백**: "저장되었습니다." — 단정형. "완료!" 없음.

---

## 10. Voice & Tone

**Voice adjectives:** 운영자 시선 · 수치 우선 · 마침표형 단정

**Do / Don't**

| ✅ Do | ❌ Don't |
|---|---|
| 마침표로 끝낸다. ("저장되었습니다.") | 느낌표 ("저장 완료!") |
| 구체 수치 표기 ("176시간 30분") | 약식 ("약 176시간") |
| 운영자 화자 시점 ("데이터가 없습니다.") | 사용자 명령형 ("지금 입력하세요!") |
| 오류는 구체적으로 ("시작 시간이 종료 시간보다 늦습니다.") | 모호한 오류 ("오류가 발생했습니다.") |
| 짧은 평서형 한 문장 | 마케팅 슬로건 ("스마트한 근태 관리") |
| 단위 명시 ("35km", "1,750원/L", "6,125원") | 단위 생략 또는 약식 |

**Voice samples:**
1. **로그인**: "STK-HR에 로그인하세요." — 간결, 마침표.
2. **빈 상태**: "이번 달 지출 내역이 없습니다." — 사실 서술.
3. **마일리지 결과**: "35km × 1,750원 × 0.1 = 6,125원" — 계산식 그대로 노출.
4. **저장 성공**: "저장되었습니다." — 단정형.
5. **입력 오류**: "이동 거리를 입력해 주세요." — 구체적, 친절하되 간결.

---

## 11. Brand Narrative

**시스템 이름:** STK-HR

**배경.** STK Engineering의 근태·지출 관리는 엑셀 수기 작성 방식으로 운영되어 왔다. 입력 오류, 집계 불일치, 양식 혼재 등의 문제가 반복되었다. 엔지니어와 자재 관리 직원의 데이터가 분절된 파일로 흩어져 있었다.

**미션.** 흩어진 근태·지출 데이터를 단일 시스템으로 통합한다. GPS 연동 출퇴근, 작업·이동·대기 시간 자동 집계, 마일리지 자동 계산(km × 유가 × 0.1), 엑셀 다운로드. 수기 작성이 없어도 데이터를 신뢰할 수 있는 상태.

**프로젝트 기간.** 2026-04-28 ~ 2026-06-12. STK Engineering (부산광역시 해운대구), 담당자 이지우.

*이 섹션은 STK-HR 프로젝트 제안서 기반으로 작성됨.*

---

## 12. Principles

1. **One ink, many alphas.** 색이 의미를 만들지 않는다. `#1D1D1F`를 0.04 / 0.10 / 0.24 / 0.40 / 0.72 / 0.96으로 단계화해 위계를 만든다. *UI implication:* semantic color(파랑·초록·빨강)는 상태 표시에만. 본문 chrome에 accent color 없음.
2. **수치는 원본 그대로.** 마일리지 6,125원을 "약 6,000원"으로 표시하지 않는다. 소수점, 단위, 계산식을 그대로 노출한다. *UI implication:* `tabular-nums`, 고정 소수점, 단위 inline 표기.
3. **Display tight, body loose.** 28px 페이지 제목은 -0.5px 트래킹, 14px 본문은 22px line-height. *UI implication:* 큰 글자일수록 음수 트래킹, 작을수록 line-height 여유.
4. **Ring, not border.** 1px `0 0 0 1px inset` shadow ring. hover/active 전환 시 box-shadow만 바꿔 layout shift 0. *UI implication:* CSS border 대신 inset shadow 일관 사용.
5. **직군 분기, 크롬 통일.** 엔지니어·자재관리 입력 폼은 필드가 다르지만 ink 시스템·버튼·카드는 동일. *UI implication:* 직군별 UI는 폼 필드 조합 차이만, 컴포넌트 시스템 분기 없음.
6. **Friction → data → action.** 모든 대시보드 화면은 "현황(friction) → 데이터 → 다음 액션" 3-beat 구조. *UI implication:* 요약 카드 4-up → 테이블 → primary CTA 순서 고정.

---

## 13. Personas

- **현장 엔지니어 (Engineer).** GPS 출퇴근 기록, 작업·이동·대기 시간 입력, OT 자동 집계, 마일리지 계산. 모바일에서 빠르게 입력. "내가 입력한 게 맞나?" 확인이 중요. 단순하고 빠른 입력 UX 필요.
- **자재관리 담당자 (Material Manager).** 자재 반출입 데이터 입력, 이동 km 기록. 입력 항목이 다르지만 동일 시스템 사용. 수치 정확성과 엑셀 다운로드가 핵심 니즈.
- **관리자 (Admin / 담당자).** 전체 팀 근태 요약 조회, 지출 집계, OT·야간·휴일 근무 통계, 엑셀 다운로드로 외부 보고. 데이터 신뢰도와 집계 정확성이 최우선. 이지우 담당자가 대표 페르소나.

---

## 14. States

| Surface | Empty | Loading | Error | Success | Skeleton | Disabled |
|---|---|---|---|---|---|---|
| 근태 테이블 | "이번 달 근태 데이터가 없습니다." — 행 없음, 텍스트만 | 테이블 skeleton rows (동일 높이 `#F7F7F7` bar) | 인라인 toast "데이터를 불러오지 못했습니다. 다시 시도해 주세요." | 정상 render | 동일 dims, `rgba(29,29,31,0.06)` fill animated | n/a |
| 지출 폼 입력 | placeholder `rgba(29,29,31,0.40)` 텍스트 | submit 중 → button disabled + spinner | 필드 아래 `12px #FF3B30` error message | "저장되었습니다." toast | n/a | Background `rgba(29,29,31,0.04)` + cursor not-allowed |
| 요약 카드 (4-up) | 모든 수치 `0` 표시 (대시 아님) | skeleton card 동일 dims + animated fill | n/a (부분 오류는 카드 내 `—` 처리) | 정상 render | `#2D3338` 동일 dims + opacity 0.6 animated | n/a |
| 마일리지 계산기 | km / 유가 입력 전 결과 `—` | n/a (로컬 계산) | "숫자를 입력해 주세요." inline error | 계산식 inline 표시 "35km × 1,750원 × 0.1 = 6,125원" | n/a | 미입력 필드 존재 시 계산 결과 비표시 |
| 로그인 폼 | email/password placeholder | submit 중 → button disabled | "이메일 또는 비밀번호가 올바르지 않습니다." — 구체적 | 대시보드로 redirect | n/a | 입력 없음 → primary button disabled |
| 사이드바 nav | n/a | n/a | n/a | active item: ink fill + 0.24 ring + weight 700 | n/a | inactive: `rgba(29,29,31,0.72)` weight 500 |

오류 메시지 패턴: 모호한 "오류가 발생했습니다" 없음. 항상 무엇이 문제인지 + 다음 행동을 명시.

---

## 15. Motion & Easing

**Duration**
- `instant`: 0ms — pill active 전환, 토글 즉시 반영
- `short`: 150ms — hover ring/bg 전환, 버튼 hover
- `default`: 240ms — 페이지 진입, 카드·섹션 fade-in
- `long`: 400ms — 테이블 row stagger, 모달 진입

**Easing**
- `out-quart` (`cubic-bezier(0.25, 1, 0.5, 1)`) — scroll entry, 카드 fade
- `in-out-cubic` (`cubic-bezier(0.65, 0, 0.35, 1)`) — 필터 pill, 탭 전환
- `ease` (`cubic-bezier(0.25, 0.1, 0.25, 1)`) — 모달 overlay

**Motion rules**
1. Translate ≤ 8px. 슬라이드 과용 없음.
2. Opacity is the primary verb. 모든 entry 모션은 opacity + translateY 조합.
3. No spring bounce. overshoot 0.
4. 테이블 row stagger ≤ 40ms (너무 많은 행이면 stagger 없이 fade).
5. 데이터 업데이트(수치 변경): cross-fade 없음. 즉시 교체 + 0.3s `#2D3338` bg flash (dark card) 또는 `rgba(29,29,31,0.04)` flash (light surface).

---

## 16. Do's and Don'ts

### Do
- ink `#1D1D1F`를 alpha 단계(0.04/0.10/0.24/0.72/0.96)로 위계 표현. semantic accent color는 상태 표시만.
- 모든 수치에 `tabular-nums` + 단위 inline 표기 + 오른쪽 정렬.
- 1px inset ring으로 버튼·입력·pill 상태 전환. CSS border 사용하지 말 것.
- 오류 메시지에 "오류가 발생했습니다" 쓰지 말 것. 원인 + 행동 명시.
- 마일리지 계산식(km × 유가 × 0.1) 결과를 계산식 그대로 노출.
- 빈 상태는 텍스트 + 마침표만. 일러스트·이모지 없음.
- 직군별 폼은 필드 조합만 다르고 컴포넌트 시스템은 동일하게 유지.

### Don't
- 파랑·초록·노랑 accent color를 CTA 또는 chrome에 사용하지 말 것.
- "약 ~원", "약 ~시간" 약식 표기 금지. 정확한 수치만.
- 느낌표·물음표 남발 ("저장 완료!" → "저장되었습니다.").
- spring-bounce, parallax, translate > 8px 모션 금지.
- 요약 카드에 아이콘·일러스트 넣지 말 것. graphite card는 수치+레이블만.
- 로딩 시 스피너 단독 사용 금지. skeleton UI 우선.
- 한 화면에 primary CTA 2개 이상 금지.

---

**Verified baseline:** flex.team (2026-05-14) + STK-HR 프로젝트 제안서 (2026-06-02)
**Delta applied:** density.shift +1 (데이터 대시보드 밀도), radius.delta_px 0 (flex 그대로)
