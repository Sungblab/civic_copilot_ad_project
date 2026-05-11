import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chromium } from 'playwright';
import { createApp } from '../src/server-app.js';

describe('mobile UI smoke', () => {
  it('runs the primary analysis flow without horizontal overflow', async () => {
    const server = createApp().listen(0);
    const browser = await chromium.launch();
    try {
      const { port } = server.address();
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
      await page.goto(`http://127.0.0.1:${port}/`);

      await page.getByRole('button', { name: '분석 시작' }).click();
      await page.getByText('복사 가능한 신고문').waitFor({ timeout: 5000 });

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        resultVisible: !document.querySelector('#result')?.classList.contains('hidden'),
        bottomBarVisible: getComputedStyle(document.querySelector('.bottom-bar')).display !== 'none'
      }));

      assert.equal(metrics.resultVisible, true);
      assert.equal(metrics.bottomBarVisible, true);
      assert.ok(metrics.scrollWidth <= metrics.clientWidth + 1, `horizontal overflow: ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    } finally {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
