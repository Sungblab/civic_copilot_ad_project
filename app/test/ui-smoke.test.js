import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { describe, it } from 'node:test';
import { chromium } from 'playwright';
import { createApp } from '../src/server-app.js';

const chromiumUnsafePorts = new Set([
  1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79,
  87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135,
  137, 139, 143, 161, 179, 389, 427, 465, 512, 513, 514, 515, 526, 530, 531,
  532, 540, 548, 554, 556, 563, 587, 601, 636, 989, 990, 993, 995, 1719, 1720,
  1723, 2049, 3659, 4045, 4190, 5060, 5061, 6000, 6566, 6665, 6666, 6667,
  6668, 6669, 6697, 10080
]);

function waitForListening(server) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      server.off('error', onError);
      server.off('listening', onListening);
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const onListening = () => {
      cleanup();
      resolve();
    };

    server.once('error', onError);
    server.once('listening', onListening);
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function listenOnSafePort() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const server = createServer(createApp());
    const listening = waitForListening(server);
    server.listen(0, '127.0.0.1');
    await listening;

    const { port } = server.address();
    if (!chromiumUnsafePorts.has(port)) {
      return server;
    }

    await closeServer(server);
  }

  throw new Error('Could not find an available browser-safe test port.');
}

describe('mobile UI smoke', () => {
  it('runs the primary analysis flow without horizontal overflow', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByText('복사 가능한 신고문').waitFor({ timeout: 5000 });
      await page.getByText('다중 관점 리뷰').waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        resultVisible: !document.querySelector('#result')?.classList.contains('hidden'),
        bottomBarVisible: getComputedStyle(document.querySelector('.bottom-bar')).display !== 'none',
        personaReviewCount: document.querySelectorAll('[data-persona-review]').length
      }));

      assert.equal(metrics.resultVisible, true);
      assert.equal(metrics.bottomBarVisible, true);
      assert.equal(metrics.personaReviewCount, 5);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows rule-backed evidence requirements for the illegal parking scenario', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('parking');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '규칙 기반 요건' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        requirementCount: document.querySelectorAll('[data-rule-requirement]').length,
        hasInterval: document.body.textContent.includes('1분'),
        hasPlate: document.body.textContent.includes('차량번호'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.requirementCount, 6);
      assert.equal(metrics.hasInterval, true);
      assert.equal(metrics.hasPlate, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows privacy masking guidance when the report may include identifiable people', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('parking');
      await page.locator('#description').fill('차량번호가 보이고 사람 얼굴과 집 주소 간판이 같이 나와요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '개인정보/마스킹 점검' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        privacyRiskCount: document.querySelectorAll('[data-privacy-risk]').length,
        hasFace: document.body.textContent.includes('사람 얼굴'),
        hasMasking: document.body.textContent.includes('마스킹'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.privacyRiskCount, 3);
      assert.equal(metrics.hasFace, true);
      assert.equal(metrics.hasMasking, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows duplicate and admin burden guidance without blocking the report', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('국민대학교 정문 앞 보도');
      await page.locator('#description').fill('이미 여러 명이 신고한 것 같은데 오늘 더 깨져서 위험해요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '중복/행정 부담 점검' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        duplicateActionCount: document.querySelectorAll('[data-duplicate-action]').length,
        hasSimilarReport: document.body.textContent.includes('유사 신고'),
        hasSupplement: document.body.textContent.includes('보완 정보'),
        hasDraft: document.body.textContent.includes('복사 가능한 신고문'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.duplicateActionCount, 3);
      assert.equal(metrics.hasSimilarReport, true);
      assert.equal(metrics.hasSupplement, true);
      assert.equal(metrics.hasDraft, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows official handoff guidance and a real channel link', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '공식 제출 전 확인' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        handoffStepCount: document.querySelectorAll('[data-handoff-step]').length,
        officialHref: document.querySelector('[data-official-link]')?.getAttribute('href'),
        hasManualSubmitNotice: document.body.textContent.includes('자동 제출하지 않습니다'),
        hasCopyStep: document.body.textContent.includes('신고문 복사'),
        hasPhotoAttachStep: document.body.textContent.includes('사진 첨부'),
        hasDraft: document.body.textContent.includes('복사 가능한 신고문'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.handoffStepCount, 4);
      assert.equal(metrics.officialHref, 'https://www.safetyreport.go.kr/');
      assert.equal(metrics.hasManualSubmitNotice, true);
      assert.equal(metrics.hasCopyStep, true);
      assert.equal(metrics.hasPhotoAttachStep, true);
      assert.equal(metrics.hasDraft, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('stores anonymous feedback choices without location or draft text', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('trash');
      await page.locator('#location').fill('원룸촌 골목 입구');
      await page.locator('#description').fill('쓰레기가 계속 쌓여요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '피드백 루프' }).waitFor({ timeout: 5000 });
      await page.getByRole('button', { name: '신고문 도움됨' }).click();

      const metrics = await page.evaluate(() => {
        const records = JSON.parse(localStorage.getItem('civic-copilot-feedback') ?? '[]');
        const first = records[0] ?? {};

        return {
          feedbackOptionCount: document.querySelectorAll('[data-feedback-option]').length,
          hasPrivacyNotice: document.body.textContent.includes('위치나 신고문 원문'),
          hasStoredStatus: document.body.textContent.includes('피드백 1건 저장'),
          recordCount: records.length,
          feedbackType: first.feedbackType,
          scenario: first.scenario,
          hasLocation: Object.hasOwn(first, 'location'),
          hasDraft: Object.hasOwn(first, 'draft'),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      });

      assert.equal(metrics.feedbackOptionCount, 3);
      assert.equal(metrics.hasPrivacyNotice, true);
      assert.equal(metrics.hasStoredStatus, true);
      assert.equal(metrics.recordCount, 1);
      assert.equal(metrics.feedbackType, 'draft_useful');
      assert.equal(metrics.scenario, 'trash');
      assert.equal(metrics.hasLocation, false);
      assert.equal(metrics.hasDraft, false);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('stores recent analysis history with coarse location only and visible local retention control', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('서울시 성북구 국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByText('복사 가능한 신고문').waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => {
        const records = JSON.parse(localStorage.getItem('civic-copilot-demo-history') ?? '[]');
        const first = records[0] ?? {};
        const serialized = JSON.stringify(records);
        const historyText = document.querySelector('#history-list')?.textContent ?? '';

        return {
          recordCount: records.length,
          hasRawLocationProperty: Object.hasOwn(first, 'location'),
          locationLabel: first.locationLabel,
          leaksRawLocation: serialized.includes('국민대학교') || historyText.includes('국민대학교'),
          hasLocalOnlyNotice: document.body.textContent.includes('최근 이력은 이 브라우저에만 저장'),
          hasDeletionNotice: document.body.textContent.includes('삭제하면 이 브라우저의 최근 분석만 지워집니다'),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      });

      assert.equal(metrics.recordCount, 1);
      assert.equal(metrics.hasRawLocationProperty, false);
      assert.equal(metrics.locationLabel, '서울 지역');
      assert.equal(metrics.leaksRawLocation, false);
      assert.equal(metrics.hasLocalOnlyNotice, true);
      assert.equal(metrics.hasDeletionNotice, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('does not send photo filenames to the API and shows server data lifecycle guidance', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      let requestBody = null;
      await page.route('**/api/analyze', async (route) => {
        requestBody = route.request().postDataJSON();
        await route.continue();
      });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('서울시 성북구 국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.setInputFiles('#photo', {
        name: 'family-home-address.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9])
      });
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '서버/AI 데이터 보관 설계' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        lifecycleItemCount: document.querySelectorAll('[data-lifecycle-item]').length,
        hasStatelessMvp: document.body.textContent.includes('서버 DB에 저장하지 않습니다'),
        hasPhotoBrowserOnly: document.body.textContent.includes('사진 원본은 브라우저 미리보기'),
        hasTtl: document.body.textContent.includes('짧은 TTL'),
        bodyText: document.body.textContent,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(requestBody?.hasPhoto, true);
      assert.equal(Object.hasOwn(requestBody ?? {}, 'photoName'), false);
      assert.equal(JSON.stringify(requestBody).includes('family-home-address'), false);
      assert.equal(metrics.lifecycleItemCount, 4);
      assert.equal(metrics.hasStatelessMvp, true);
      assert.equal(metrics.hasPhotoBrowserOnly, true);
      assert.equal(metrics.hasTtl, true);
      assert.equal(metrics.bodyText.includes('family-home-address'), true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('lets the user edit the AI draft without storing the edited text locally', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('서울시 성북구 국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '신고문 검토/수정' }).waitFor({ timeout: 5000 });

      const editedDraft = '서울시 성북구 국민대학교 정문 앞 보도블록 일부가 파손되어 보행자가 걸려 넘어질 위험이 있습니다. 현장 확인과 보수를 요청드립니다.';
      await page.locator('#draft-editor').fill(editedDraft);

      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: '텍스트 파일 다운로드' }).click();
      const download = await downloadPromise;
      const content = await readFile(await download.path(), 'utf-8');

      const metrics = await page.evaluate((draft) => {
        const storageText = JSON.stringify({
          history: localStorage.getItem('civic-copilot-demo-history'),
          feedback: localStorage.getItem('civic-copilot-feedback')
        });

        return {
          checklistCount: document.querySelectorAll('[data-draft-control-item]').length,
          hasAiDraftNotice: document.body.textContent.includes('AI 초안'),
          hasNoStorageNotice: document.body.textContent.includes('수정본 원문은 서버나 로컬 이력에 저장하지 않습니다'),
          editorValue: document.querySelector('#draft-editor')?.value,
          localStorageLeaksEditedDraft: storageText.includes(draft),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      }, editedDraft);

      assert.equal(metrics.checklistCount, 4);
      assert.equal(metrics.hasAiDraftNotice, true);
      assert.equal(metrics.hasNoStorageNotice, true);
      assert.equal(metrics.editorValue, editedDraft);
      assert.equal(metrics.localStorageLeaksEditedDraft, false);
      assert.ok(content.includes(editedDraft));
      assert.ok(content.includes('[신고문 검토/수정]'));
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows location completion guidance when location is missing', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '위치/증거 완성도' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        locationActionCount: document.querySelectorAll('[data-location-action]').length,
        hasMapLocation: document.body.textContent.includes('지도 위치 지정'),
        hasLandmark: document.body.textContent.includes('주변 기준점'),
        hasMissingDraft: document.body.textContent.includes('위치가 아직 입력되지 않았습니다'),
        hasHandoffLocationStep: document.body.textContent.includes('위치 보완'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.locationActionCount, 3);
      assert.equal(metrics.hasMapLocation, true);
      assert.equal(metrics.hasLandmark, true);
      assert.equal(metrics.hasMissingDraft, true);
      assert.equal(metrics.hasHandoffLocationStep, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows plain-language next steps and foreign language support for Seoul reports', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('서울시 성북구 국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '쉬운 다음 단계' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        stepCount: document.querySelectorAll('[data-accessibility-step]').length,
        supportCount: document.querySelectorAll('[data-accessibility-support]').length,
        hasForeignSupport: document.body.textContent.includes('120 외국어 상담'),
        hasHours: document.body.textContent.includes('평일 9:00-18:00'),
        hasPlainOrder: document.body.textContent.includes('쉬운 순서'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.stepCount, 3);
      assert.equal(metrics.supportCount >= 1, true);
      assert.equal(metrics.hasForeignSupport, true);
      assert.equal(metrics.hasHours, true);
      assert.equal(metrics.hasPlainOrder, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows regional channel routing for Seoul daily-life reports', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('서울시 성북구 국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '지역 채널 라우팅' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        optionCount: document.querySelectorAll('[data-regional-channel]').length,
        hasSeoulSmart: document.body.textContent.includes('서울 스마트 불편신고'),
        hasSafetyReport: document.body.textContent.includes('안전신문고'),
        hasDasan: document.body.textContent.includes('120 다산콜'),
        hasSidewalkBasis: document.body.textContent.includes('보도블록파손'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.optionCount, 3);
      assert.equal(metrics.hasSeoulSmart, true);
      assert.equal(metrics.hasSafetyReport, true);
      assert.equal(metrics.hasDasan, true);
      assert.equal(metrics.hasSidewalkBasis, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows recommendation basis and uncertainty boundaries', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('서울시 성북구 국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '추천 근거/불확실성' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        explanationCount: document.querySelectorAll('[data-explanation-item]').length,
        sourceCount: document.querySelectorAll('[data-explanation-source]').length,
        hasReferenceNotice: document.body.textContent.includes('AI 결과는 참고용'),
        hasOfficialBasis: document.body.textContent.includes('공식 근거'),
        hasSeoulSmart: document.body.textContent.includes('서울 스마트 불편신고'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.explanationCount, 4);
      assert.equal(metrics.sourceCount >= 2, true);
      assert.equal(metrics.hasReferenceNotice, true);
      assert.equal(metrics.hasOfficialBasis, true);
      assert.equal(metrics.hasSeoulSmart, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('shows photo evidence guidance when no photo is selected', async () => {
    const server = await listenOnSafePort();
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.locator('#scenario').selectOption('sidewalk');
      await page.locator('#location').fill('국민대학교 정문 앞 보도');
      await page.locator('#description').fill('보도블록이 깨져서 넘어질 것 같아요');
      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByRole('heading', { name: '사진 증거 완성도' }).waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        photoActionCount: document.querySelectorAll('[data-photo-action]').length,
        hasPhotoAttach: document.body.textContent.includes('현장 사진 추가'),
        hasWideShot: document.body.textContent.includes('전체 배경 사진'),
        hasCloseShot: document.body.textContent.includes('근접 사진'),
        hasHandoffPhotoStep: document.body.textContent.includes('사진 첨부'),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      assert.equal(metrics.photoActionCount, 3);
      assert.equal(metrics.hasPhotoAttach, true);
      assert.equal(metrics.hasWideShot, true);
      assert.equal(metrics.hasCloseShot, true);
      assert.equal(metrics.hasHandoffPhotoStep, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
