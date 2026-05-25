# Civic Copilot AD Project

소프트웨어프로젝트 I / AD 프로젝트를 위한 Civic Copilot 설계 및 MVP 프로토타입 저장소입니다.

## Project Info

- 프로젝트명: Civic Copilot
- 주제: AI를 활용한 지역사회 문제 해결
- 팀원: 김성빈, 정재훈
- 핵심 문장: 기존 신고 플랫폼을 대체하지 않고, 시민이 신고를 더 잘 준비하도록 돕는 신고 전 AI 보조 레이어

## Purpose

Civic Copilot은 시민이 생활민원을 발견했을 때 "어디에, 어떻게, 어떤 증거로 신고해야 하는지" 몰라 신고를 포기하거나 부정확하게 접수하는 문제를 해결하기 위한 AI/SW 개념 설계입니다.

과제의 중심은 구현이 아니라 설계입니다. 이 저장소의 MVP 데모는 전체 설계가 실제 사용자 흐름으로 어떻게 보일 수 있는지 검증하는 보조 프로토타입입니다.

## Folder Structure

- `report/`
  - `civic-copilot-ad-report.md`: 상세 설계 보고서 원본
- `slides/`
  - `index.html`: 7분 발표용 HTML 슬라이드 원본
  - `styles.css`: 슬라이드 스타일
- `app/`
  - 발표용 MVP 웹앱 데모
  - Express API + 바닐라 HTML/CSS/JS
  - rule/mock 기반 신고 전 AI 분석 엔진
- `support/`
  - `speaker-script.md`: 7분 발표 대본
  - `submission-checklist.md`: 제출 전 확인 목록
  - `expected-questions.md`: 발표 후 예상 질문과 20초 답변
- `research/`
  - `civic-copilot-source-matrix.md`: 조사 근거와 차별점 정리
  - `confirmed-plan-reresearch-2026-05-25.md`: 확정 기획 기준 공식 자료 재검증 메모
  - `server-ai-data-retention-2026-05-25.md`: 서버/API/AI 로그 보관 최소화 재조사 메모
  - `draft-user-control-2026-05-25.md`: AI 신고문 초안의 사용자 검토/수정 통제 재조사 메모
  - `presentation-evaluation-alignment-2026-05-25.md`: AD 평가 기준과 발표 흐름 정렬 메모
  - `evaluator-qna-risk-defense-2026-05-25.md`: 평가자 예상 질문과 리스크 방어 리서치 메모
- `reviews/`
  - `cycle-01-multi-perspective-review.md`: 페르소나 기반 반복 검토 기록
  - `cycle-02-parking-rule-review.md`: 불법주정차 규칙 DB 반복 검토 기록
  - `cycle-03-privacy-accessibility-review.md`: 개인정보/접근성 리서치 기반 검토 기록
  - `cycle-04-duplicate-admin-burden-review.md`: 중복 신고/행정 부담 리서치 기반 검토 기록
  - `cycle-05-official-channel-handoff-review.md`: 공식 채널 이동/제출 경계 검토 기록
  - `cycle-06-feedback-loop-review.md`: 피드백 루프/비식별 개선 신호 검토 기록
  - `cycle-07-location-evidence-review.md`: 위치/증거 완성도 검토 기록
  - `cycle-08-photo-evidence-review.md`: 사진 증거 완성도 검토 기록
  - `cycle-09-accessibility-support-review.md`: 쉬운 다음 단계/외국어 상담 검토 기록
  - `cycle-10-regional-channel-routing-review.md`: 지역별 채널 라우팅 검토 기록
  - `cycle-11-explainability-review.md`: 추천 근거/불확실성 검토 기록
  - `cycle-12-confirmed-plan-reresearch-review.md`: 확정 기획 재조사와 다음 개인정보 보강 지점 검토 기록
  - `cycle-13-local-data-retention-review.md`: 최근 분석 이력의 로컬 저장/삭제와 개인정보 최소화 검토 기록
  - `cycle-14-server-ai-data-retention-review.md`: 서버/API/AI 로그의 데이터 보관 최소화 검토 기록
  - `cycle-15-draft-user-control-review.md`: AI 신고문 초안의 사용자 검토/수정 통제 검토 기록
  - `cycle-16-presentation-evaluation-review.md`: 발표/평가 기준 정렬 검토 기록
  - `cycle-17-evaluator-qna-risk-review.md`: 평가자 예상 질문/리스크 방어 검토 기록
- `output/`
  - 최종 제출용 PDF export 파일을 생성하는 위치
- `planning/`
  - 초기 개발 확장 기획 문서

## Slides

브라우저에서 다음 파일을 열어 발표 슬라이드를 확인합니다.

```text
slides/index.html
```

PDF 제출물이 필요하면 브라우저 인쇄 기능으로 PDF로 저장합니다.

## Report

보고서 원본은 Markdown입니다.

```text
report/civic-copilot-ad-report.md
```

제출 직전 필요 형식에 맞춰 PDF, DOCX 등으로 변환합니다.

## MVP Demo

```powershell
cd app
npm install
npm run build:css
npm start
```

브라우저에서 `http://localhost:5177`을 열면 모바일 우선 MVP 데모를 확인할 수 있습니다.

MVP 결과 화면에는 신고 유형, 채널, 증거 체크, 신고문뿐 아니라 대학생 시민, 디지털 취약 사용자, 외국인 주민, 행정 담당자, 안전/윤리 검토자 관점의 다중 리뷰가 포함됩니다. 이는 데모가 단순 구현물이 아니라 설계 검증 루프의 일부임을 보여주기 위한 장치입니다.

불법주정차 샘플은 별도 `cycle-02`로 다루며, 안전신문고/지자체 주민신고제 기준을 바탕으로 앱 촬영 사진, 동일 위치·각도, 촬영 간격, 차량번호·위반지역·촬영시간 식별 같은 규칙 기반 요건을 보여줍니다.

`cycle-03`에서는 사진 기반 신고의 개인정보 위험을 별도 설계 요소로 다룹니다. 얼굴, 차량번호, 상세 주소를 구분하고, 신고 증거에 필요한 정보는 유지하되 불필요한 개인정보는 마스킹하거나 문장에서 제거하도록 안내합니다.

`cycle-04`에서는 중복 신고와 행정 부담을 별도 설계 요소로 다룹니다. 유사 신고 가능성을 이유로 제출을 막지 않고, 기존 신고 확인, 새 사진/위험 변화 보완, 반복 제출 주의를 안내합니다.

`cycle-05`에서는 공식 신고 채널로 넘기는 경계를 다룹니다. 데모는 신고를 자동 제출하지 않고, 신고문 복사, 사진/위치 확인, 안전신문고 같은 공식 채널에서 사용자 직접 제출을 안내합니다.

`cycle-06`에서는 피드백 루프를 다룹니다. 데모는 신고문 도움됨, 보완 필요, 공식 제출 완료 같은 선택형 피드백만 저장하고, 위치나 신고문 원문은 저장하지 않습니다.

`cycle-07`에서는 위치/증거 완성도를 다룹니다. 데모는 위치가 비어 있으면 지도 위치 지정, 주변 기준점 추가, 사진 배경 보완을 안내하고 신고문에 위치 미입력 상태를 명시합니다.

`cycle-08`에서는 사진 증거 완성도를 다룹니다. 데모는 실제 사진 파일이 선택되지 않으면 현장 사진 추가, 전체 배경 사진, 근접 사진을 안내하고 공식 제출 전 확인 목록에 사진 첨부를 추가합니다.

`cycle-09`에서는 접근성과 상담 연결을 다룹니다. 데모는 분석 결과를 쉬운 3단계 행동으로 다시 요약하고, 서울 위치에서는 120 외국어 상담을 보조 경로로 안내합니다.

`cycle-10`에서는 지역별 채널 라우팅을 다룹니다. 데모는 서울 생활불편 신고에서 서울 스마트 불편신고를 1순위로, 안전신문고와 120 다산콜을 대안으로 보여줍니다.

`cycle-11`에서는 AI 추천의 투명성과 설명가능성을 다룹니다. 데모는 유형, 채널, 증거 보완, 자동 제출 금지 근거를 한 곳에 묶고 AI 결과가 참고용임을 명시합니다.

`cycle-12`에서는 확정 기획을 공식 자료 기준으로 재조사했습니다. 국민신문고 AI와 AI 안전신문고가 접수 후 처리 자동화에 가깝다는 점을 다시 확인하고, Civic Copilot의 접수 전 시민 코칭 포지션을 유지했습니다.

`cycle-13`에서는 로컬 이력과 데이터 보관 통제를 다룹니다. 데모의 최근 분석은 상세 위치나 신고문 원문을 저장하지 않고, 지역 수준 라벨과 유형/채널/긴급도만 이 브라우저에 저장합니다.

`cycle-14`에서는 서버와 AI 연동 단계의 데이터 보관 통제를 다룹니다. 브라우저는 사진 파일명을 API로 보내지 않고, 서버는 클라이언트가 파일명을 보내도 버립니다. 결과 화면에는 MVP 서버 무저장, 사진 원본 브라우저 한정, 향후 AI 로그 비식별화와 짧은 TTL 설계를 표시합니다.

`cycle-15`에서는 AI 신고문 초안의 사용자 검토와 수정 통제를 다룹니다. 데모는 `신고문 검토/수정` 섹션에서 사실 확인, 과장 제거, 개인정보 제거, 공식 채널 직접 제출을 안내하고, 사용자가 편집한 수정본은 복사/다운로드에만 쓰며 서버나 최근 이력에 저장하지 않습니다.

`cycle-16`에서는 확정 기획을 AD 평가 기준에 맞춰 다시 정렬했습니다. 발표에서는 구현량을 앞세우지 않고 문제 정의, 공식 자료 조사, AI/SW 설계, 구현 가능성을 7분 안에 설명하며, MVP는 설계가 실제 사용자 흐름으로 성립한다는 검증 근거로만 사용합니다.

`cycle-17`에서는 평가자와 동료가 물을 가능성이 높은 질문을 기준으로 설계를 다시 점검했습니다. 안전신문고와의 차이, 자동 제출 제외 이유, AI 오류 책임, 중복 신고, 개인정보, MVP의 의미를 20초 답변으로 정리해 발표 후 Q&A에 대비합니다.

검증:

```powershell
cd app
npm test
```

## Positioning

기존 신고 플랫폼은 신고를 접수하고 처리합니다. AI 안전신문고는 접수 후 분류와 이송 자동화에 가깝습니다.

Civic Copilot은 그보다 앞선 단계에서 시민이 접수 버튼을 누르기 전에 사진, 위치, 증거 요건, 긴급도, 신고문, 지역별 신고 채널, 추천 근거를 검토하도록 돕습니다.
