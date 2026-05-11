# Civic Copilot AD Project

소프트웨어프로젝트 I / AD 프로젝트 제출물 정리 폴더입니다.

## Project Info

- 프로젝트명: Civic Copilot
- 과제: 소프트웨어프로젝트 I / AD 프로젝트
- 팀 구성: 2인 팀
- 핵심 문장: 안전신문고를 대체하지 않고, 안전신문고를 더 잘 쓰게 만드는 신고 전 AI 보조자

## Folder Structure

- `submit/`: 실제 제출 권장 파일
  - `civic_copilot_ad_presentation.pptx`
  - `civic_copilot_ad_presentation.pdf`
  - `civic_copilot_ad_report.docx`
  - `civic_copilot_ad_report.pdf`
- `support/`: 발표 녹화 및 제출 전 확인용 보조 문서
  - `civic_copilot_ad_speaker_script.md`
  - `civic_copilot_ad_submission_checklist.md`
  - `civic_copilot_ad_submission_readme.md`
- `planning/`: 실제 개발 확장 참고 문서
  - `civic_copilot_development_plan.md`
- `app/`: 발표용 MVP 웹앱 데모
  - 바닐라 HTML/CSS/JS 프론트엔드
  - Express 기반 Node API 서버
  - Tailwind CSS 빌드
  - rule/mock 기반 신고 전 AI 분석 엔진

## Submit First

1. `submit/civic_copilot_ad_presentation.pptx`
2. `submit/civic_copilot_ad_report.docx`
3. 발표 영상

PDF 파일은 제출 형식이 PDF를 요구하거나, 업로드 전 최종 확인용으로 사용합니다.

## MVP Demo

```powershell
cd app
npm install
npm run build:css
npm start
```

브라우저에서 `http://localhost:5177`을 열면 Civic Copilot 모바일 우선 데모를 확인할 수 있습니다.

검증:

```powershell
cd app
npm test
```
