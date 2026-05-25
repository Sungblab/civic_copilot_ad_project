import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { analyzeIncident } from '../src/analyzer.js';

describe('analyzeIncident', () => {
  it('returns a drain scenario result with channel, evidence checks, and draft text', () => {
    const result = analyzeIncident({
      scenario: 'drain',
      location: '서울시 OO구 OO로',
      description: '비 오면 물 고일듯'
    });

    assert.equal(result.primaryType.label, '배수시설 불편');
    assert.equal(result.recommendedChannel.name, '안전신문고');
    assert.equal(result.urgency.level, '주의');
    assert.ok(result.draft.includes('빗물받이'));
    assert.ok(result.evidenceChecks.some((check) => check.status === 'recommended'));
  });

  it('returns multi-perspective review notes for the MVP design loop', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요'
    });

    assert.equal(result.reviewLoop.iteration, 'cycle-01');
    assert.equal(result.reviewLoop.basis, 'research-backed mock review');
    assert.deepEqual(
      result.personaReviews.map((review) => review.role),
      ['대학생 시민', '디지털 취약 사용자', '외국인 주민', '행정 담당자', '안전/윤리 검토자']
    );
    assert.ok(result.personaReviews.every((review) => review.finding && review.designAction));
    assert.ok(result.personaReviews.some((review) => review.designAction.includes('주변 위치')));
  });

  it('returns rule-backed evidence requirements for illegal parking reports', () => {
    const result = analyzeIncident({
      scenario: 'parking',
      location: '국민대학교 정문 앞 횡단보도',
      description: '차가 횡단보도 위에 멈춰 있어요'
    });

    assert.equal(result.reviewLoop.iteration, 'cycle-02');
    assert.equal(result.ruleBasis.id, 'illegal-parking-resident-report');
    assert.match(result.ruleBasis.summary, /안전신문고 앱/);
    assert.deepEqual(
      result.ruleRequirements.map((item) => item.label),
      [
        '앱 촬영 사진',
        '동일 위치·각도',
        '촬영 간격',
        '식별 정보',
        '위반 구역 근거',
        '신고 기한'
      ]
    );
    assert.ok(result.ruleRequirements.some((item) => item.detail.includes('1분')));
    assert.ok(result.ruleRequirements.some((item) => item.detail.includes('차량번호')));
    assert.ok(result.personaReviews.some((review) => review.role === '주차단속 담당자'));
  });

  it('returns privacy masking guidance for identifiable bystanders and home details', () => {
    const result = analyzeIncident({
      scenario: 'parking',
      location: '국민대학교 정문 앞 횡단보도',
      description: '차량번호가 보이고 사람 얼굴과 집 주소 간판이 같이 나와요'
    });

    assert.equal(result.privacyAssessment.iteration, 'cycle-03');
    assert.equal(result.privacyAssessment.basis, 'privacy-minimization-review');
    assert.equal(result.privacyAssessment.riskLevel, '높음');
    assert.deepEqual(
      result.privacyAssessment.risks.map((risk) => risk.label),
      ['사람 얼굴', '차량번호', '상세 주소/거주지']
    );
    assert.ok(result.privacyAssessment.maskingActions.some((action) => action.detail.includes('얼굴')));
    assert.ok(result.privacyAssessment.maskingActions.some((action) => action.detail.includes('신고 증거')));
    assert.ok(result.privacyAssessment.retentionPolicy.some((item) => item.includes('원본')));
  });

  it('returns duplicate and admin burden guidance without blocking the report', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '국민대학교 정문 앞 보도',
      description: '이미 여러 명이 신고한 것 같은데 오늘 더 깨져서 위험해요'
    });

    assert.equal(result.duplicateAssessment.iteration, 'cycle-04');
    assert.equal(result.duplicateAssessment.basis, 'duplicate-admin-burden-review');
    assert.equal(result.duplicateAssessment.riskLevel, '중복 가능성 높음');
    assert.deepEqual(
      result.duplicateAssessment.actions.map((action) => action.label),
      ['유사 신고 확인', '보완 정보 추가', '반복 제출 주의']
    );
    assert.equal(result.duplicateAssessment.blocksSubmission, false);
    assert.ok(result.duplicateAssessment.actions.some((action) => action.detail.includes('막지')));
    assert.ok(result.duplicateAssessment.actions.some((action) => action.detail.includes('새 사진')));
    assert.ok(result.duplicateAssessment.adminImpact.includes('행정'));
  });

  it('returns official channel handoff guidance for user-confirmed submission', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요'
    });

    assert.equal(result.officialHandoff.iteration, 'cycle-05');
    assert.equal(result.officialHandoff.basis, 'official-channel-handoff-review');
    assert.equal(result.officialHandoff.canAutoSubmit, false);
    assert.equal(result.officialHandoff.primaryAction.label, '공식 채널 열기');
    assert.equal(result.officialHandoff.primaryAction.url, 'https://www.safetyreport.go.kr/');
    assert.deepEqual(
      result.officialHandoff.checklist.map((item) => item.label),
      ['신고문 복사', '사진/위치 확인', '공식 채널에서 직접 제출']
    );
    assert.ok(result.officialHandoff.notice.includes('자동 제출하지 않습니다'));
  });

  it('returns an anonymous feedback loop plan for iterative improvement', () => {
    const result = analyzeIncident({
      scenario: 'trash',
      location: '원룸촌 골목 입구',
      description: '쓰레기가 계속 쌓여요'
    });

    assert.equal(result.feedbackLoop.iteration, 'cycle-06');
    assert.equal(result.feedbackLoop.basis, 'post-submission-feedback-loop-review');
    assert.equal(result.feedbackLoop.privacyMode, 'anonymous-choice-only');
    assert.deepEqual(
      result.feedbackLoop.options.map((option) => option.label),
      ['신고문 도움됨', '보완 필요', '공식 제출 완료']
    );
    assert.deepEqual(
      result.feedbackLoop.metrics.map((metric) => metric.label),
      ['추천 정확도', '신고문 유용성', '공식 제출 전환']
    );
    assert.ok(result.feedbackLoop.notice.includes('위치나 신고문 원문'));
  });

  it('returns plain-language next steps and foreign language support for Seoul reports', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '서울시 성북구 국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요'
    });

    assert.equal(result.accessibilityGuide.iteration, 'cycle-09');
    assert.equal(result.accessibilityGuide.basis, 'plain-language-accessibility-review');
    assert.deepEqual(result.accessibilityGuide.audiences, ['디지털 취약 사용자', '외국인 주민']);
    assert.deepEqual(
      result.accessibilityGuide.steps.map((step) => step.label),
      ['사진과 위치 확인', '신고문 복사', '공식 채널에서 직접 제출']
    );
    assert.ok(result.accessibilityGuide.summary.includes('쉬운 순서'));
    assert.ok(result.accessibilityGuide.supportChannels.some((channel) => channel.label === '120 외국어 상담'));
    assert.ok(result.accessibilityGuide.supportChannels.some((channel) => channel.detail.includes('평일 9:00-18:00')));
  });

  it('routes Seoul daily-life reports to local and national official channels', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '서울시 성북구 국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요'
    });

    assert.equal(result.regionalChannelGuide.iteration, 'cycle-10');
    assert.equal(result.regionalChannelGuide.basis, 'regional-channel-routing-review');
    assert.equal(result.regionalChannelGuide.region, '서울');
    assert.equal(result.regionalChannelGuide.primary.label, '서울 스마트 불편신고');
    assert.equal(result.regionalChannelGuide.primary.url, 'https://smartreport.seoul.go.kr/');
    assert.deepEqual(
      result.regionalChannelGuide.options.map((option) => option.label),
      ['서울 스마트 불편신고', '안전신문고', '120 다산콜']
    );
    assert.ok(result.regionalChannelGuide.summary.includes('보도블록파손'));
    assert.ok(result.officialHandoff.channelOptions.some((option) => option.label === '서울 스마트 불편신고'));
  });

  it('returns explanation trace with basis, uncertainty, and user confirmation boundaries', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '서울시 성북구 국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요',
      hasPhoto: false
    });

    assert.equal(result.explanationTrace.iteration, 'cycle-11');
    assert.equal(result.explanationTrace.basis, 'ai-transparency-explainability-review');
    assert.deepEqual(
      result.explanationTrace.principles,
      ['공식 근거 표시', '불확실성 고지', '사용자 최종 확인']
    );
    assert.deepEqual(
      result.explanationTrace.items.map((item) => item.label),
      ['유형 추천 근거', '채널 추천 근거', '증거 보완 근거', '자동 제출 금지 근거']
    );
    assert.ok(result.explanationTrace.items.some((item) => item.detail.includes('서울 스마트 불편신고')));
    assert.ok(result.explanationTrace.items.some((item) => item.detail.includes('사진')));
    assert.ok(result.explanationTrace.riskNotice.includes('AI 결과는 참고용'));
    assert.ok(result.explanationTrace.sources.some((source) => source.label === 'NIA 인공지능 사업추진 윤리원칙'));
  });

  it('returns a server and AI data lifecycle policy without raw incident details', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '서울시 성북구 국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요',
      hasPhoto: true,
      photoName: 'family-home-address.jpg'
    });

    assert.equal(result.dataLifecyclePolicy.iteration, 'cycle-14');
    assert.equal(result.dataLifecyclePolicy.basis, 'server-ai-data-retention-review');
    assert.equal(result.dataLifecyclePolicy.mode, 'stateless-mvp');
    assert.deepEqual(
      result.dataLifecyclePolicy.storage.map((item) => item.label),
      ['MVP API 요청', '사진 원본', 'AI 연동 로그', '삭제/권리 대응']
    );
    assert.ok(result.dataLifecyclePolicy.storage.some((item) => item.detail.includes('서버 DB에 저장하지 않습니다')));
    assert.ok(result.dataLifecyclePolicy.storage.some((item) => item.detail.includes('사진 원본은 브라우저 미리보기')));
    assert.ok(result.dataLifecyclePolicy.futureControls.some((item) => item.includes('짧은 TTL')));
    assert.ok(result.dataLifecyclePolicy.sources.some((source) => source.label === 'PIPC AI 개인정보보호 자율점검표'));
    assert.equal(JSON.stringify(result.dataLifecyclePolicy).includes('국민대학교'), false);
    assert.equal(JSON.stringify(result.dataLifecyclePolicy).includes('family-home-address'), false);
  });

  it('returns draft review and edit controls before official submission', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '서울시 성북구 국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요'
    });

    assert.equal(result.draftControl.iteration, 'cycle-15');
    assert.equal(result.draftControl.basis, 'draft-user-control-review');
    assert.equal(result.draftControl.mode, 'user-reviewed-draft');
    assert.deepEqual(
      result.draftControl.checklist.map((item) => item.label),
      ['사실 확인', '과장 제거', '개인정보 제거', '공식 채널 직접 제출']
    );
    assert.ok(result.draftControl.notice.includes('AI 초안'));
    assert.ok(result.draftControl.storagePolicy.includes('수정본 원문은 서버나 로컬 이력에 저장하지 않습니다'));
    assert.ok(result.draftControl.sources.some((source) => source.label === '국민신문고 민원 이용 안내'));
    assert.ok(result.draftControl.sources.some((source) => source.label === 'PIPC 생성형 AI 이용자 개인정보 보호 가이드'));
  });

  it('requires location completion before official submission when location is missing', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '',
      description: '보도블록이 깨져서 넘어질 것 같아요'
    });

    assert.equal(result.locationAssessment.iteration, 'cycle-07');
    assert.equal(result.locationAssessment.basis, 'location-evidence-completeness-review');
    assert.equal(result.locationAssessment.status, 'missing');
    assert.equal(result.locationAssessment.requiredBeforeSubmit, true);
    assert.deepEqual(
      result.locationAssessment.actions.map((action) => action.label),
      ['지도 위치 지정', '주변 기준점 추가', '사진 배경 보완']
    );
    assert.ok(result.locationAssessment.summary.includes('지도상 위치'));
    assert.ok(result.officialHandoff.checklist.some((item) => item.label === '위치 보완'));
    assert.ok(result.draft.includes('위치가 아직 입력되지 않았습니다'));
  });

  it('requires photo evidence guidance when no photo is selected', () => {
    const result = analyzeIncident({
      scenario: 'sidewalk',
      location: '국민대학교 정문 앞 보도',
      description: '보도블록이 깨져서 넘어질 것 같아요',
      hasPhoto: false
    });

    assert.equal(result.photoEvidenceAssessment.iteration, 'cycle-08');
    assert.equal(result.photoEvidenceAssessment.basis, 'photo-evidence-completeness-review');
    assert.equal(result.photoEvidenceAssessment.status, 'missing');
    assert.equal(result.photoEvidenceAssessment.requiredBeforeSubmit, true);
    assert.deepEqual(
      result.photoEvidenceAssessment.actions.map((action) => action.label),
      ['현장 사진 추가', '전체 배경 사진', '근접 사진']
    );
    assert.ok(result.photoEvidenceAssessment.summary.includes('사진이나 동영상'));
    assert.ok(result.evidenceChecks.some((check) => check.label === '현장 사진 첨부' && check.status === 'required'));
    assert.ok(result.officialHandoff.checklist.some((item) => item.label === '사진 첨부'));
  });

  it('escalates emergency-like descriptions to 112 or 119 guidance', () => {
    const result = analyzeIncident({
      scenario: 'streetlight',
      location: '서울시 OO구 골목길',
      description: '전선이 끊어져 있고 감전 위험이 있어요'
    });

    assert.equal(result.urgency.level, '긴급');
    assert.equal(result.recommendedChannel.name, '119 또는 112');
    assert.match(result.safetyNotice, /긴급/);
    assert.ok(result.personaReviews.some((review) => review.role === '안전/윤리 검토자'));
  });

  it('falls back to general civic guidance for unknown scenarios', () => {
    const result = analyzeIncident({
      scenario: 'unknown',
      location: '',
      description: ''
    });

    assert.equal(result.primaryType.label, '생활불편 신고');
    assert.equal(result.recommendedChannel.name, '안전신문고');
    assert.match(result.draft, /현장 확인/);
  });
});
