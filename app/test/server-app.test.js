import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createApp } from '../src/server-app.js';

describe('server app', () => {
  it('returns analysis JSON from POST /api/analyze', async () => {
    const server = createApp().listen(0);
    try {
      const { port } = server.address();
      const response = await fetch(`http://127.0.0.1:${port}/api/analyze`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          scenario: 'trash',
          location: '학교 정문 앞',
          description: '쓰레기가 계속 쌓여요'
        })
      });

      assert.equal(response.status, 200);
      const body = await response.json();
      assert.equal(body.primaryType.label, '쓰레기 무단투기');
      assert.equal(body.input.scenario, 'trash');
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('returns a 400 response for invalid JSON bodies', async () => {
    const server = createApp().listen(0);
    try {
      const { port } = server.address();
      const response = await fetch(`http://127.0.0.1:${port}/api/analyze`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{bad json'
      });

      assert.equal(response.status, 400);
      const body = await response.json();
      assert.equal(body.error, 'invalid_json');
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
