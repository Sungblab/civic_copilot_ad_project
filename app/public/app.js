const form = document.querySelector('#incident-form');
const scenarioInput = document.querySelector('#scenario');
const locationInput = document.querySelector('#location');
const descriptionInput = document.querySelector('#description');
const sampleButton = document.querySelector('#sample-button');
const mobileSampleButton = document.querySelector('#mobile-sample-button');
const resetButton = document.querySelector('#reset-button');
const clearHistoryButton = document.querySelector('#clear-history-button');
const geoButton = document.querySelector('#geo-button');
const photoInput = document.querySelector('#photo');
const photoButton = document.querySelector('#photo-button');
const photoName = document.querySelector('#photo-name');
const photoPreview = document.querySelector('#photo-preview');
const progress = document.querySelector('#analysis-progress');
const emptyState = document.querySelector('#empty-state');
const resultContainer = document.querySelector('#result');
const historyList = document.querySelector('#history-list');

const historyKey = 'civic-copilot-demo-history';
const feedbackKey = 'civic-copilot-feedback';

const samples = {
  drain: {
    location: '서울시 OO구 OO로 빗물받이 앞',
    description: '비 오면 물 고일듯',
    preview: 'linear-gradient(135deg, #dff7ef, #f5e9d8)'
  },
  sidewalk: {
    location: '학교 정문 앞 보도',
    description: '보도블록이 깨져서 넘어질 것 같아요',
    preview: 'linear-gradient(135deg, #eef2f3, #d9e7e0)'
  },
  parking: {
    location: 'OO역 2번 출구 앞',
    description: '차가 보도를 막고 있어요',
    preview: 'linear-gradient(135deg, #e8eef8, #f6f6f6)'
  },
  trash: {
    location: '원룸촌 골목 입구',
    description: '쓰레기가 계속 쌓여요',
    preview: 'linear-gradient(135deg, #f9f1df, #eaf7ee)'
  },
  streetlight: {
    location: '기숙사 뒤 골목길',
    description: '가로등이 며칠째 안 켜져요',
    preview: 'linear-gradient(135deg, #1c1c1e, #2d5a4f)'
  }
};

sampleButton?.addEventListener('click', fillSample);
mobileSampleButton?.addEventListener('click', fillSample);
resetButton?.addEventListener('click', resetForm);
clearHistoryButton?.addEventListener('click', () => {
  localStorage.removeItem(historyKey);
  renderHistory();
});

scenarioInput.addEventListener('change', fillSample);

geoButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    locationInput.value = '현재 브라우저에서 위치 기능을 지원하지 않습니다.';
    return;
  }

  geoButton.disabled = true;
  geoButton.textContent = '확인';
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      locationInput.value = `현재 위치 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      geoButton.disabled = false;
      geoButton.textContent = '현재';
    },
    () => {
      locationInput.value = '위치 권한이 없어 직접 입력이 필요합니다.';
      geoButton.disabled = false;
      geoButton.textContent = '현재';
    },
    { enableHighAccuracy: true, timeout: 6000 }
  );
});

photoButton.addEventListener('click', () => {
  photoInput.click();
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0];
  if (!file) {
    photoName.textContent = '선택된 사진 없음';
    setScenarioPreview();
    return;
  }

  photoName.textContent = file.name;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    photoPreview.textContent = '';
    photoPreview.style.backgroundImage = `url("${reader.result}")`;
  });
  reader.readAsDataURL(file);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setLoading(true);

  await animateProgress();

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(getInput())
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();
    renderResult(result);
    saveHistory(result);
    renderHistory();
  } catch (error) {
    renderError(error);
  } finally {
    setLoading(false);
  }
});

fillSample();
renderHistory();

function getInput() {
  const file = photoInput.files?.[0];

  return {
    scenario: scenarioInput.value,
    location: locationInput.value,
    description: descriptionInput.value,
    hasPhoto: Boolean(file)
  };
}

function fillSample() {
  const sample = samples[scenarioInput.value] ?? samples.drain;
  locationInput.value = sample.location;
  descriptionInput.value = sample.description;
  if (!photoInput.files?.length) {
    setScenarioPreview();
  }
}

function setScenarioPreview() {
  const sample = samples[scenarioInput.value] ?? samples.drain;
  photoPreview.textContent = '샘플 현장 이미지';
  photoPreview.style.backgroundImage = sample.preview;
}

function resetForm() {
  scenarioInput.value = 'drain';
  photoInput.value = '';
  photoName.textContent = '선택된 사진 없음';
  fillSample();
  emptyState.classList.remove('hidden');
  resultContainer.classList.add('hidden');
  resultContainer.innerHTML = '';
}

function setLoading(isLoading) {
  progress.classList.toggle('hidden', !isLoading);
  emptyState.classList.add('hidden');
  resultContainer.classList.toggle('hidden', isLoading);
}

async function animateProgress() {
  const steps = [...document.querySelectorAll('.progress-step')];
  steps.forEach((step, index) => {
    step.className = index === 0
      ? activeStepClass()
      : idleStepClass();
  });

  for (let index = 0; index < steps.length; index += 1) {
    steps.forEach((step, stepIndex) => {
      step.className = stepIndex <= index ? activeStepClass() : idleStepClass();
    });
    await wait(260);
  }
}

function renderResult(result) {
  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `
    <div class="grid gap-4">
      <div class="grid gap-3 sm:grid-cols-3">
        ${summaryCard('추천 유형', result.primaryType.label, `${result.primaryType.category} · ${Math.round(result.primaryType.confidence * 100)}%`, false)}
        ${summaryCard('신고 채널', result.recommendedChannel.name, result.recommendedChannel.reason, false)}
        ${summaryCard('긴급도', result.urgency.level, result.urgency.reason, result.urgency.level === '긴급')}
      </div>

      <div class="result-section">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-ink">유형 후보 Top 3</h3>
          <span class="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-semibold text-ink">AI mock</span>
        </div>
        <div class="mt-4 grid gap-3">
          ${result.typeCandidates.map((item) => candidateRow(item)).join('')}
        </div>
      </div>

      <div class="result-section">
        <h3 class="text-base font-semibold text-ink">증거 체크리스트</h3>
        <ul class="mt-4 grid gap-2">
          ${result.evidenceChecks.map((check) => evidenceItem(check)).join('')}
        </ul>
      </div>

      ${ruleRequirementsSection(result)}

      ${locationAssessmentSection(result)}

      ${photoEvidenceSection(result)}

      ${privacyAssessmentSection(result)}

      ${dataLifecycleSection(result)}

      ${duplicateAssessmentSection(result)}

      <div class="result-section">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-ink">다중 관점 리뷰</h3>
          <span class="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">${escapeHtml(result.reviewLoop?.iteration ?? 'cycle')}</span>
        </div>
        <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(result.reviewLoop?.method ?? '기획 관점별 검토 결과입니다.')}</p>
        <div class="mt-4 grid gap-3">
          ${(result.personaReviews ?? []).map((review) => personaReviewCard(review)).join('')}
        </div>
      </div>

      ${draftControlSection(result)}

      <div class="result-section bg-soft">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-ink">복사 가능한 신고문</h3>
          <button id="copy-button" type="button" class="pill-button-secondary px-4 py-2">복사</button>
        </div>
        <p id="draft-text" class="mt-4 rounded-lg border border-hairline bg-white p-4 text-[15px] leading-7 text-charcoal">${escapeHtml(result.draft)}</p>
        <button id="download-button" type="button" class="pill-button-accent mt-3 w-full">텍스트 파일 다운로드</button>
      </div>

      ${officialHandoffSection(result)}

      ${regionalChannelSection(result)}

      ${explanationTraceSection(result)}

      ${accessibilityGuideSection(result)}

      ${feedbackLoopSection(result)}

      <div class="rounded-xl border border-hairline bg-ink p-4 text-white">
        <p class="text-sm font-semibold">안전장치</p>
        <p class="mt-2 text-sm leading-6 text-white/78">${escapeHtml(result.safetyNotice)}</p>
        <div class="mt-3 grid gap-2">
          ${result.privacyFlags.map((flag) => `<p class="rounded-lg bg-white/8 px-3 py-2 text-sm leading-6 text-white/78">${escapeHtml(flag)}</p>`).join('')}
        </div>
      </div>
    </div>
  `;

  const draftEditor = document.querySelector('#draft-editor');
  const draftText = document.querySelector('#draft-text');
  const resetDraftButton = document.querySelector('#draft-reset-button');
  const copyEditedDraftButton = document.querySelector('#copy-edited-draft-button');
  const syncDraftPreview = () => {
    if (draftText) {
      draftText.textContent = getCurrentDraft(result);
    }
  };

  draftEditor?.addEventListener('input', syncDraftPreview);
  resetDraftButton?.addEventListener('click', () => {
    draftEditor.value = result.draft;
    syncDraftPreview();
  });
  copyEditedDraftButton?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(getCurrentDraft(result));
    copyEditedDraftButton.textContent = '수정본 복사됨';
  });

  document.querySelector('#copy-button').addEventListener('click', async () => {
    await navigator.clipboard.writeText(getCurrentDraft(result));
    document.querySelector('#copy-button').textContent = '복사됨';
  });

  document.querySelector('#download-button').addEventListener('click', () => {
    downloadText(result);
  });

  document.querySelectorAll('[data-feedback-option]').forEach((button) => {
    button.addEventListener('click', () => {
      saveFeedback(result, button.dataset.feedbackOption);
      renderFeedbackStatus();
    });
  });
  renderFeedbackStatus();

  resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderError(error) {
  resultContainer.classList.remove('hidden');
  resultContainer.innerHTML = `
    <div class="rounded-xl border border-error/30 bg-red-50 p-4">
      <h3 class="font-semibold text-error">분석에 실패했습니다</h3>
      <p class="mt-2 text-sm text-steel">${escapeHtml(error.message)}</p>
    </div>
  `;
}

function summaryCard(label, value, detail, danger) {
  const tone = danger ? 'border-error/30 bg-red-50' : 'border-hairline bg-white';
  return `
    <article class="rounded-xl border ${tone} p-4">
      <span class="text-xs font-semibold uppercase tracking-[0.12em] text-steel">${escapeHtml(label)}</span>
      <strong class="mt-2 block text-xl font-semibold tracking-[-0.02em] text-ink">${escapeHtml(value)}</strong>
      <small class="mt-2 block text-sm leading-6 text-steel">${escapeHtml(detail)}</small>
    </article>
  `;
}

function candidateRow(item) {
  return `
    <div class="grid grid-cols-[108px_1fr_42px] items-center gap-3 text-sm">
      <span class="font-medium text-charcoal">${escapeHtml(item.label)}</span>
      <div class="h-2 overflow-hidden rounded-full bg-surface">
        <div class="h-full rounded-full bg-mint" style="width: ${Number(item.confidence)}%"></div>
      </div>
      <b class="text-right font-mono text-xs text-steel">${Number(item.confidence)}%</b>
    </div>
  `;
}

function evidenceItem(check) {
  const tone = {
    passed: 'bg-mint-soft text-ink',
    recommended: 'bg-amber-50 text-warn',
    required: 'bg-red-50 text-error',
    info: 'bg-surface text-steel'
  }[check.status] ?? 'bg-surface text-steel';

  const label = {
    passed: '충족',
    recommended: '권장',
    required: '필수',
    info: '참고'
  }[check.status] ?? '참고';

  return `
    <li class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${tone}">${label}</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(check.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(check.detail)}</span>
      </div>
    </li>
  `;
}

function ruleRequirementsSection(result) {
  const requirements = result.ruleRequirements ?? [];
  if (!requirements.length) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">규칙 기반 요건</h3>
        <span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-warn">Rule DB</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(result.ruleBasis?.summary ?? '공식 신고 요건을 기반으로 정리한 항목입니다.')}</p>
      <ul class="mt-4 grid gap-2">
        ${requirements.map((item) => ruleRequirementItem(item)).join('')}
      </ul>
    </div>
  `;
}

function ruleRequirementItem(item) {
  const tone = {
    required: 'bg-red-50 text-error',
    recommended: 'bg-amber-50 text-warn',
    info: 'bg-surface text-steel'
  }[item.status] ?? 'bg-surface text-steel';

  const label = {
    required: '필수',
    recommended: '권장',
    info: '참고'
  }[item.status] ?? '참고';

  return `
    <li data-rule-requirement class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${tone}">${label}</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(item.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(item.detail)}</span>
      </div>
    </li>
  `;
}

function privacyAssessmentSection(result) {
  const assessment = result.privacyAssessment;
  if (!assessment) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">개인정보/마스킹 점검</h3>
        <span class="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-error">${escapeHtml(assessment.riskLevel)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(assessment.summary)}</p>
      <ul class="mt-4 grid gap-2">
        ${assessment.risks.map((risk) => privacyRiskItem(risk)).join('')}
      </ul>
      <div class="mt-4 grid gap-2">
        ${assessment.maskingActions.map((action) => `
          <p class="rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal"><b>${escapeHtml(action.label)}</b> · ${escapeHtml(action.detail)}</p>
        `).join('')}
      </div>
    </div>
  `;
}

function locationAssessmentSection(result) {
  const assessment = result.locationAssessment;
  if (!assessment) {
    return '';
  }

  const tone = assessment.status === 'missing'
    ? 'bg-red-50 text-error'
    : 'bg-mint-soft text-ink';
  const label = assessment.status === 'missing' ? '보완 필요' : '확인 완료';

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">위치/증거 완성도</h3>
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${tone}">${label}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(assessment.summary)}</p>
      <ul class="mt-4 grid gap-2">
        ${(assessment.actions ?? []).map((action) => locationActionItem(action)).join('')}
      </ul>
      <div class="mt-4 grid gap-2">
        ${(assessment.officialBasis ?? []).map((basis) => `
          <p class="rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal">${escapeHtml(basis)}</p>
        `).join('')}
      </div>
    </div>
  `;
}

function locationActionItem(action) {
  return `
    <li data-location-action class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">위치</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(action.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(action.detail)}</span>
      </div>
    </li>
  `;
}

function photoEvidenceSection(result) {
  const assessment = result.photoEvidenceAssessment;
  if (!assessment) {
    return '';
  }

  const tone = assessment.status === 'missing'
    ? 'bg-red-50 text-error'
    : 'bg-mint-soft text-ink';
  const label = assessment.status === 'missing' ? '보완 필요' : '확인 완료';

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">사진 증거 완성도</h3>
        <span class="rounded-full px-2.5 py-1 text-xs font-semibold ${tone}">${label}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(assessment.summary)}</p>
      <ul class="mt-4 grid gap-2">
        ${(assessment.actions ?? []).map((action) => photoActionItem(action)).join('')}
      </ul>
      <div class="mt-4 grid gap-2">
        ${(assessment.officialBasis ?? []).map((basis) => `
          <p class="rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal">${escapeHtml(basis)}</p>
        `).join('')}
      </div>
    </div>
  `;
}

function photoActionItem(action) {
  return `
    <li data-photo-action class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">사진</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(action.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(action.detail)}</span>
      </div>
    </li>
  `;
}

function privacyRiskItem(risk) {
  const tone = {
    mask: 'bg-red-50 text-error',
    'keep-for-report': 'bg-amber-50 text-warn',
    minimize: 'bg-red-50 text-error',
    review: 'bg-surface text-steel'
  }[risk.status] ?? 'bg-surface text-steel';

  const label = {
    mask: '마스킹',
    'keep-for-report': '증거 유지',
    minimize: '최소화',
    review: '확인'
  }[risk.status] ?? '확인';

  return `
    <li data-privacy-risk class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${tone}">${label}</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(risk.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(risk.detail)}</span>
      </div>
    </li>
  `;
}

function dataLifecycleSection(result) {
  const policy = result.dataLifecyclePolicy;
  if (!policy) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">서버/AI 데이터 보관 설계</h3>
        <span class="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">${escapeHtml(policy.iteration)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(policy.summary)}</p>
      <div class="mt-4 grid gap-2">
        ${(policy.storage ?? []).map((item) => dataLifecycleItem(item)).join('')}
      </div>
      <div class="mt-4 grid gap-2">
        ${(policy.futureControls ?? []).map((item) => `<p data-lifecycle-control class="rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal">${escapeHtml(item)}</p>`).join('')}
      </div>
    </div>
  `;
}

function dataLifecycleItem(item) {
  return `
    <article data-lifecycle-item class="grid gap-2 rounded-lg border border-hairline bg-white p-3 sm:grid-cols-[104px_1fr] sm:items-start">
      <span class="w-fit rounded-full bg-mint-soft px-2.5 py-1 text-xs font-semibold text-ink">${escapeHtml(item.status)}</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(item.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(item.detail)}</span>
      </div>
    </article>
  `;
}

function draftControlSection(result) {
  const control = result.draftControl;
  if (!control) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">신고문 검토/수정</h3>
        <span class="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-semibold text-ink">${escapeHtml(control.iteration)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(control.notice)}</p>
      <ul class="mt-4 grid gap-2">
        ${(control.checklist ?? []).map((item) => draftControlItem(item)).join('')}
      </ul>
      <label for="draft-editor" class="mt-4 block text-sm font-semibold text-ink">수정 가능한 신고문</label>
      <textarea id="draft-editor" data-draft-editor class="mt-2 min-h-36 w-full resize-y rounded-lg border border-hairline bg-white p-3 text-[15px] leading-7 text-charcoal outline-none transition focus:border-ink focus:ring-2 focus:ring-mint/30">${escapeHtml(result.draft)}</textarea>
      <div class="mt-3 grid gap-2 sm:grid-cols-2">
        <button id="draft-reset-button" type="button" class="pill-button-secondary">초안으로 되돌리기</button>
        <button id="copy-edited-draft-button" type="button" class="pill-button-accent">수정본 복사</button>
      </div>
      <p class="mt-3 rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal">${escapeHtml(control.storagePolicy)}</p>
    </div>
  `;
}

function draftControlItem(item) {
  return `
    <li data-draft-control-item class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[104px_1fr] sm:items-start">
      <b class="text-sm font-semibold text-ink">${escapeHtml(item.label)}</b>
      <span class="text-sm leading-6 text-steel">${escapeHtml(item.detail)}</span>
    </li>
  `;
}

function officialHandoffSection(result) {
  const handoff = result.officialHandoff;
  if (!handoff) {
    return '';
  }

  const officialLink = handoff.primaryAction?.url
    ? `<a data-official-link class="pill-button-primary mt-4 w-full" href="${escapeHtml(handoff.primaryAction.url)}" target="_blank" rel="noreferrer">${escapeHtml(handoff.primaryAction.label)}</a>`
    : `<p data-official-link class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm leading-6 text-error">${escapeHtml(handoff.primaryAction?.label ?? '공식 긴급 신고 우선')}</p>`;

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">공식 제출 전 확인</h3>
        <span class="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-semibold text-ink">Handoff</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(handoff.notice)}</p>
      <ul class="mt-4 grid gap-2">
        ${(handoff.checklist ?? []).map((item) => handoffStepItem(item)).join('')}
      </ul>
      <div class="mt-4 grid gap-2">
        ${(handoff.channelOptions ?? []).map((option) => `
          <p class="rounded-lg border border-hairline px-3 py-2 text-sm leading-6 text-steel"><b class="text-ink">${escapeHtml(option.label)}</b> · ${escapeHtml(option.detail)}</p>
        `).join('')}
      </div>
      ${officialLink}
    </div>
  `;
}

function feedbackLoopSection(result) {
  const loop = result.feedbackLoop;
  if (!loop) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">피드백 루프</h3>
        <span class="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">${escapeHtml(loop.iteration)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(loop.notice)}</p>
      <div class="mt-4 grid gap-2">
        ${(loop.options ?? []).map((option) => `
          <button data-feedback-option="${escapeHtml(option.value)}" type="button" class="rounded-lg border border-hairline bg-white px-3 py-2 text-left text-sm leading-6 text-steel transition hover:border-mint hover:bg-mint-soft">
            <b class="block text-sm font-semibold text-ink">${escapeHtml(option.label)}</b>
            <span>${escapeHtml(option.detail)}</span>
          </button>
        `).join('')}
      </div>
      <div class="mt-4 grid gap-2">
        ${(loop.metrics ?? []).map((metric) => `
          <p class="rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal"><b>${escapeHtml(metric.label)}</b> · ${escapeHtml(metric.detail)}</p>
        `).join('')}
      </div>
      <p id="feedback-status" class="mt-4 rounded-lg bg-mint-soft px-3 py-2 text-sm font-semibold text-ink">아직 저장된 피드백이 없습니다.</p>
    </div>
  `;
}

function accessibilityGuideSection(result) {
  const guide = result.accessibilityGuide;
  if (!guide) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">쉬운 다음 단계</h3>
        <span class="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-semibold text-ink">${escapeHtml(guide.iteration)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(guide.summary)}</p>
      <ol class="mt-4 grid gap-2">
        ${(guide.steps ?? []).map((step, index) => accessibilityStepItem(step, index)).join('')}
      </ol>
      ${(guide.supportChannels ?? []).length
        ? `
          <div class="mt-4 grid gap-2">
            ${(guide.supportChannels ?? []).map((channel) => `
              <p data-accessibility-support class="rounded-lg border border-mint/40 bg-mint-soft px-3 py-2 text-sm leading-6 text-charcoal"><b class="text-ink">${escapeHtml(channel.label)}</b> · ${escapeHtml(channel.detail)}</p>
            `).join('')}
          </div>
        `
        : ''}
    </div>
  `;
}

function regionalChannelSection(result) {
  const guide = result.regionalChannelGuide;
  if (!guide) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">지역 채널 라우팅</h3>
        <span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-warn">${escapeHtml(guide.region)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(guide.summary)}</p>
      <div class="mt-4 grid gap-2">
        ${(guide.options ?? []).map((option) => regionalChannelItem(option, guide.primary?.label)).join('')}
      </div>
    </div>
  `;
}

function regionalChannelItem(option, primaryLabel) {
  const isPrimary = option.label === primaryLabel;
  const tone = isPrimary ? 'bg-mint-soft text-ink' : 'bg-surface text-steel';
  const label = isPrimary ? '1순위' : '대안';
  const title = option.url
    ? `<a class="font-semibold text-ink underline decoration-mint/50 underline-offset-4" href="${escapeHtml(option.url)}" target="_blank" rel="noreferrer">${escapeHtml(option.label)}</a>`
    : `<b class="block text-sm font-semibold text-ink">${escapeHtml(option.label)}</b>`;

  return `
    <article data-regional-channel class="grid gap-2 rounded-lg border border-hairline bg-white p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${tone}">${label}</span>
      <div>
        ${title}
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(option.detail)}</span>
      </div>
    </article>
  `;
}

function explanationTraceSection(result) {
  const trace = result.explanationTrace;
  if (!trace) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">추천 근거/불확실성</h3>
        <span class="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">${escapeHtml(trace.iteration)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(trace.summary)}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        ${(trace.principles ?? []).map((principle) => `
          <span class="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-semibold text-ink">${escapeHtml(principle)}</span>
        `).join('')}
      </div>
      <div class="mt-4 grid gap-2">
        ${(trace.items ?? []).map((item) => explanationItem(item)).join('')}
      </div>
      <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold leading-6 text-warn">${escapeHtml(trace.riskNotice)}</p>
      <div class="mt-4 grid gap-2">
        ${(trace.sources ?? []).map((source) => `
          <p data-explanation-source class="rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal"><b>${escapeHtml(source.label)}</b> · ${escapeHtml(source.detail)}</p>
        `).join('')}
      </div>
    </div>
  `;
}

function explanationItem(item) {
  return `
    <article data-explanation-item class="grid gap-2 rounded-lg border border-hairline bg-white p-3 sm:grid-cols-[108px_1fr] sm:items-start">
      <span class="w-fit rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">공식 근거</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(item.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(item.detail)}</span>
      </div>
    </article>
  `;
}

function accessibilityStepItem(step, index) {
  return `
    <li data-accessibility-step class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">${index + 1}단계</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(step.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(step.detail)}</span>
      </div>
    </li>
  `;
}

function handoffStepItem(item) {
  return `
    <li data-handoff-step class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-steel">확인</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(item.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(item.detail)}</span>
      </div>
    </li>
  `;
}

function duplicateAssessmentSection(result) {
  const assessment = result.duplicateAssessment;
  if (!assessment) {
    return '';
  }

  return `
    <div class="result-section">
      <div class="flex items-center justify-between gap-3">
        <h3 class="text-base font-semibold text-ink">중복/행정 부담 점검</h3>
        <span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-warn">${escapeHtml(assessment.riskLevel)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(assessment.summary)}</p>
      <div class="mt-4 grid gap-2">
        ${(assessment.signals ?? []).map((signal) => `
          <p class="rounded-lg border border-hairline px-3 py-2 text-sm leading-6 text-steel"><b class="text-ink">${escapeHtml(signal.label)}</b> · ${escapeHtml(signal.detail)}</p>
        `).join('')}
      </div>
      <ul class="mt-4 grid gap-2">
        ${(assessment.actions ?? []).map((action) => duplicateActionItem(action)).join('')}
      </ul>
      <p class="mt-4 rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal">${escapeHtml(assessment.adminImpact)}</p>
    </div>
  `;
}

function duplicateActionItem(action) {
  return `
    <li data-duplicate-action class="grid gap-2 rounded-lg border border-hairline p-3 sm:grid-cols-[84px_1fr] sm:items-start">
      <span class="w-fit rounded-full bg-mint-soft px-2.5 py-1 text-xs font-semibold text-ink">안내</span>
      <div>
        <b class="block text-sm font-semibold text-ink">${escapeHtml(action.label)}</b>
        <span class="mt-1 block text-sm leading-6 text-steel">${escapeHtml(action.detail)}</span>
      </div>
    </li>
  `;
}

function personaReviewCard(review) {
  return `
    <article data-persona-review class="rounded-lg border border-hairline bg-white p-3">
      <div class="flex flex-wrap items-center gap-2">
        <b class="text-sm font-semibold text-ink">${escapeHtml(review.role)}</b>
        <span class="rounded-full bg-mint-soft px-2 py-1 text-[11px] font-semibold text-ink">${escapeHtml(review.lens)}</span>
      </div>
      <p class="mt-2 text-sm leading-6 text-steel">${escapeHtml(review.finding)}</p>
      <p class="mt-2 rounded-lg bg-soft px-3 py-2 text-sm leading-6 text-charcoal">${escapeHtml(review.designAction)}</p>
    </article>
  `;
}

function saveHistory(result) {
  const history = readHistory();
  history.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    scenario: result.input.scenario,
    locationLabel: summarizeLocation(result.input.location),
    type: result.primaryType.label,
    channel: result.recommendedChannel.name,
    urgency: result.urgency.level
  });
  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 5)));
}

function renderHistory() {
  const history = readHistory();
  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 5)));

  if (!history.length) {
    historyList.textContent = '아직 저장된 분석이 없습니다.';
    return;
  }

  historyList.innerHTML = history.map((item) => `
    <article class="rounded-lg border border-hairline bg-soft p-3">
      <div class="flex items-center justify-between gap-3">
        <b class="text-sm text-ink">${escapeHtml(item.type)}</b>
        <span class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-steel">${escapeHtml(item.urgency)}</span>
      </div>
      <p class="mt-1 truncate text-sm text-steel">${escapeHtml(item.locationLabel)}</p>
      <p class="mt-2 font-mono text-[11px] text-stone">${new Date(item.at).toLocaleString('ko-KR')}</p>
    </article>
  `).join('');
}

function readHistory() {
  try {
    const records = JSON.parse(localStorage.getItem(historyKey) ?? '[]');
    if (!Array.isArray(records)) {
      return [];
    }

    return records.map(sanitizeHistoryItem);
  } catch {
    return [];
  }
}

function sanitizeHistoryItem(item) {
  const {
    location,
    draft,
    ...rest
  } = item ?? {};

  return {
    ...rest,
    locationLabel: rest.locationLabel ?? summarizeLocation(location)
  };
}

function summarizeLocation(location) {
  const text = String(location ?? '').trim();

  if (!text) return '위치 미입력';
  if (/서울|seoul/i.test(text)) return '서울 지역';
  if (/부산|busan/i.test(text)) return '부산 지역';
  if (/대전|daejeon/i.test(text)) return '대전 지역';
  if (/대구|daegu/i.test(text)) return '대구 지역';
  if (/인천|incheon/i.test(text)) return '인천 지역';
  if (/광주|gwangju/i.test(text)) return '광주 지역';
  if (/울산|ulsan/i.test(text)) return '울산 지역';
  if (/세종|sejong/i.test(text)) return '세종 지역';

  return '지역 확인 필요';
}

function saveFeedback(result, feedbackType) {
  const option = (result.feedbackLoop?.options ?? []).find((item) => item.value === feedbackType);
  const records = readFeedback();

  records.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    feedbackType: option?.value ?? feedbackType,
    label: option?.label ?? feedbackType,
    scenario: result.input?.scenario ?? 'unknown',
    primaryType: result.primaryType?.label ?? '',
    iteration: result.feedbackLoop?.iteration ?? 'cycle-06',
    privacyMode: result.feedbackLoop?.privacyMode ?? 'anonymous-choice-only'
  });

  localStorage.setItem(feedbackKey, JSON.stringify(records.slice(0, 10)));
}

function readFeedback() {
  try {
    return JSON.parse(localStorage.getItem(feedbackKey) ?? '[]');
  } catch {
    return [];
  }
}

function renderFeedbackStatus() {
  const status = document.querySelector('#feedback-status');
  if (!status) {
    return;
  }

  const count = readFeedback().length;
  status.textContent = count ? `피드백 ${count}건 저장` : '아직 저장된 피드백이 없습니다.';
}

function getCurrentDraft(result) {
  const editor = document.querySelector('#draft-editor');
  if (!editor) {
    return result.draft;
  }

  return editor.value;
}

function downloadText(result) {
  const currentDraft = getCurrentDraft(result);
  const content = [
    '[Civic Copilot 신고 전 검토 리포트]',
    `유형: ${result.primaryType.label}`,
    `채널: ${result.recommendedChannel.name}`,
    `긴급도: ${result.urgency.level}`,
    '',
    '[신고문]',
    currentDraft,
    '',
    '[신고문 검토/수정]',
    result.draftControl?.notice ?? '',
    ...(result.draftControl?.checklist ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    result.draftControl?.storagePolicy ?? '',
    '',
    '[안전 안내]',
    result.safetyNotice,
    '',
    ...(result.ruleRequirements?.length
      ? [
          '[규칙 기반 요건]',
          ...(result.ruleRequirements ?? []).map((item) => `- ${item.label}: ${item.detail}`),
          ''
        ]
      : []),
    '[위치/증거 완성도]',
    result.locationAssessment?.summary ?? '',
    ...(result.locationAssessment?.actions ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    '',
    '[사진 증거 완성도]',
    result.photoEvidenceAssessment?.summary ?? '',
    ...(result.photoEvidenceAssessment?.actions ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    '',
    '[개인정보/마스킹 점검]',
    ...(result.privacyAssessment?.risks ?? []).map((risk) => `- ${risk.label}: ${risk.detail}`),
    '',
    '[서버/AI 데이터 보관 설계]',
    result.dataLifecyclePolicy?.summary ?? '',
    ...(result.dataLifecyclePolicy?.storage ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    ...(result.dataLifecyclePolicy?.futureControls ?? []).map((item) => `- ${item}`),
    '',
    '[중복/행정 부담 점검]',
    ...(result.duplicateAssessment?.actions ?? []).map((action) => `- ${action.label}: ${action.detail}`),
    '',
    '[공식 제출 전 확인]',
    result.officialHandoff?.notice ?? '',
    ...(result.officialHandoff?.checklist ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    result.officialHandoff?.primaryAction?.url ? `공식 채널: ${result.officialHandoff.primaryAction.url}` : '',
    '',
    '[지역 채널 라우팅]',
    result.regionalChannelGuide?.summary ?? '',
    ...(result.regionalChannelGuide?.options ?? []).map((item) => `- ${item.label}: ${item.detail}${item.url ? ` (${item.url})` : ''}`),
    '',
    '[추천 근거/불확실성]',
    result.explanationTrace?.riskNotice ?? '',
    ...(result.explanationTrace?.items ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    ...(result.explanationTrace?.sources ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    '',
    '[쉬운 다음 단계]',
    result.accessibilityGuide?.summary ?? '',
    ...(result.accessibilityGuide?.steps ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    ...(result.accessibilityGuide?.supportChannels ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    '',
    '[피드백 루프]',
    result.feedbackLoop?.notice ?? '',
    ...(result.feedbackLoop?.options ?? []).map((item) => `- ${item.label}: ${item.detail}`),
    '',
    '',
    '[다중 관점 리뷰]',
    ...(result.personaReviews ?? []).map((review) => `- ${review.role}: ${review.designAction}`)
  ].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'civic-copilot-report.txt';
  link.click();
  URL.revokeObjectURL(url);
}

function activeStepClass() {
  return 'progress-step rounded-full bg-ink px-2 py-2 text-white';
}

function idleStepClass() {
  return 'progress-step rounded-full bg-white px-2 py-2 text-steel ring-1 ring-hairline';
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
