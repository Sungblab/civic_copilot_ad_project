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

  it('escalates emergency-like descriptions to 112 or 119 guidance', () => {
    const result = analyzeIncident({
      scenario: 'streetlight',
      location: '서울시 OO구 골목길',
      description: '전선이 끊어져 있고 감전 위험이 있어요'
    });

    assert.equal(result.urgency.level, '긴급');
    assert.equal(result.recommendedChannel.name, '119 또는 112');
    assert.match(result.safetyNotice, /긴급/);
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
