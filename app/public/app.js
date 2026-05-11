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
  return {
    scenario: scenarioInput.value,
    location: locationInput.value,
    description: descriptionInput.value
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

      <div class="result-section bg-soft">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-ink">복사 가능한 신고문</h3>
          <button id="copy-button" type="button" class="pill-button-secondary px-4 py-2">복사</button>
        </div>
        <p id="draft-text" class="mt-4 rounded-lg border border-hairline bg-white p-4 text-[15px] leading-7 text-charcoal">${escapeHtml(result.draft)}</p>
        <button id="download-button" type="button" class="pill-button-accent mt-3 w-full">텍스트 파일 다운로드</button>
      </div>

      <div class="rounded-xl border border-hairline bg-ink p-4 text-white">
        <p class="text-sm font-semibold">안전장치</p>
        <p class="mt-2 text-sm leading-6 text-white/78">${escapeHtml(result.safetyNotice)}</p>
        <div class="mt-3 grid gap-2">
          ${result.privacyFlags.map((flag) => `<p class="rounded-lg bg-white/8 px-3 py-2 text-sm leading-6 text-white/78">${escapeHtml(flag)}</p>`).join('')}
        </div>
      </div>
    </div>
  `;

  document.querySelector('#copy-button').addEventListener('click', async () => {
    await navigator.clipboard.writeText(result.draft);
    document.querySelector('#copy-button').textContent = '복사됨';
  });

  document.querySelector('#download-button').addEventListener('click', () => {
    downloadText(result);
  });

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

function saveHistory(result) {
  const history = readHistory();
  history.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    scenario: result.input.scenario,
    location: result.input.location,
    type: result.primaryType.label,
    channel: result.recommendedChannel.name,
    urgency: result.urgency.level
  });
  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 5)));
}

function renderHistory() {
  const history = readHistory();
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
      <p class="mt-1 truncate text-sm text-steel">${escapeHtml(item.location)}</p>
      <p class="mt-2 font-mono text-[11px] text-stone">${new Date(item.at).toLocaleString('ko-KR')}</p>
    </article>
  `).join('');
}

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(historyKey) ?? '[]');
  } catch {
    return [];
  }
}

function downloadText(result) {
  const content = [
    '[Civic Copilot 신고 전 검토 리포트]',
    `유형: ${result.primaryType.label}`,
    `채널: ${result.recommendedChannel.name}`,
    `긴급도: ${result.urgency.level}`,
    '',
    '[신고문]',
    result.draft,
    '',
    '[안전 안내]',
    result.safetyNotice
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
