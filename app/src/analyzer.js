const scenarioRules = {
  drain: {
    label: '배수시설 불편',
    category: '도시시설물 / 안전 위험',
    channel: '안전신문고',
    summary: '빗물받이 주변 배수 불량 가능성이 있습니다.',
    draftSubject: '빗물받이가 낙엽과 쓰레기로 막혀 우천 시 침수 위험이 있어 정비가 필요합니다.',
    checks: [
      ['사진 선명도', 'passed', '현장 상태가 식별 가능한 사진이면 접수 가능성이 높습니다.'],
      ['위치 정보', 'passed', '정확한 주소나 GPS 위치가 있으면 담당 부서 확인이 쉬워집니다.'],
      ['추가 사진', 'recommended', '가까운 사진 1장과 주변 배경 사진 1장을 함께 준비하면 좋습니다.']
    ]
  },
  sidewalk: {
    label: '보도블록 파손',
    category: '도로 / 보행 안전',
    channel: '안전신문고',
    summary: '보행자가 걸려 넘어질 수 있는 시설물 파손입니다.',
    draftSubject: '보도블록이 파손되어 보행자가 걸려 넘어질 위험이 있으므로 현장 확인 및 보수를 요청드립니다.',
    checks: [
      ['파손 부위 식별', 'passed', '파손 범위가 보이도록 촬영합니다.'],
      ['주변 위치 식별', 'recommended', '가게 간판, 도로명 표지 등 주변 배경이 함께 보이면 좋습니다.'],
      ['야간 위험 여부', 'info', '야간 식별이 어렵다면 위험도를 함께 적습니다.']
    ]
  },
  parking: {
    label: '불법주정차',
    category: '교통 위반',
    channel: '안전신문고',
    summary: '보행 또는 교통 흐름을 방해하는 주정차 신고 후보입니다.',
    draftSubject: '해당 차량이 보행 공간 또는 교통 흐름을 방해하고 있어 불법주정차 여부 확인을 요청드립니다.',
    checks: [
      ['번호판 식별', 'recommended', '차량번호가 식별되는 사진이 필요합니다.'],
      ['동일 위치 사진', 'recommended', '신고 유형에 따라 일정 간격의 사진이 필요할 수 있습니다.'],
      ['금지 구역 근거', 'info', '횡단보도, 소화전, 버스정류장 등 주변 표지를 함께 촬영합니다.']
    ]
  },
  trash: {
    label: '쓰레기 무단투기',
    category: '환경 / 생활불편',
    channel: '구청 생활민원 또는 안전신문고',
    summary: '쓰레기 적치 또는 무단투기 신고 후보입니다.',
    draftSubject: '해당 위치에 쓰레기가 장기간 방치되어 악취와 보행 불편이 우려되므로 수거 및 현장 확인을 요청드립니다.',
    checks: [
      ['현장 범위', 'passed', '쓰레기 양과 위치가 보이는 사진이면 충분합니다.'],
      ['정확한 위치', 'passed', '주소나 주변 건물 정보를 함께 입력합니다.'],
      ['반복 발생 여부', 'info', '반복적으로 발생한다면 그 사실을 문장에 포함합니다.']
    ]
  },
  streetlight: {
    label: '가로등 고장',
    category: '시설물 / 야간 안전',
    channel: '구청 생활민원 또는 120',
    summary: '야간 보행 안전과 관련된 시설물 고장입니다.',
    draftSubject: '가로등이 점등되지 않아 야간 보행 시 시야 확보가 어렵고 안전사고가 우려되므로 점검을 요청드립니다.',
    checks: [
      ['시설물 위치', 'passed', '가로등 번호나 주변 위치를 함께 적으면 처리에 도움이 됩니다.'],
      ['야간 사진', 'recommended', '고장 상태가 보이는 야간 사진이 있으면 좋습니다.'],
      ['감전 위험', 'info', '전선 노출 등 즉시 위험은 119 또는 112 안내가 우선입니다.']
    ]
  }
};

const emergencyPattern = /(화재|불|연기|감전|전선|범죄|폭행|사고|인명|피|쓰러|구조|구급|위험)/i;

export function analyzeIncident(input = {}) {
  const scenario = scenarioRules[input.scenario] ?? null;
  const description = String(input.description ?? '').trim();
  const location = String(input.location ?? '').trim() || '현장 위치';
  const isEmergency = emergencyPattern.test(description);

  if (isEmergency) {
    return buildEmergencyResult(input, scenario, location, description);
  }

  const rule = scenario ?? {
    label: '생활불편 신고',
    category: '일반 생활민원',
    channel: '안전신문고',
    summary: '생활불편 또는 안전 위험 가능성이 있는 신고 후보입니다.',
    draftSubject: '생활불편 사항이 확인되어 현장 확인 및 필요한 조치를 요청드립니다.',
    checks: [
      ['사진 자료', 'recommended', '현장 상태가 보이는 사진을 첨부하면 좋습니다.'],
      ['위치 정보', 'recommended', '정확한 주소나 주변 지점을 입력합니다.'],
      ['상황 설명', 'info', '언제부터 발생했는지 간단히 적으면 처리에 도움이 됩니다.']
    ]
  };

  return {
    primaryType: {
      label: rule.label,
      category: rule.category,
      confidence: scenario ? 0.86 : 0.58
    },
    typeCandidates: buildCandidates(rule, scenario),
    recommendedChannel: {
      name: rule.channel,
      reason: '입력된 상황과 생활민원 유형을 기준으로 가장 적합한 접수 경로입니다.'
    },
    urgency: {
      level: '주의',
      reason: '즉시 긴급 신고보다는 생활민원 접수 전 확인이 적합합니다.'
    },
    summary: rule.summary,
    evidenceChecks: rule.checks.map(([label, status, detail]) => ({ label, status, detail })),
    draft: `${location} 인근에서 ${rule.draftSubject}`,
    privacyFlags: [
      '사람 얼굴, 차량번호, 정확한 거주지 정보가 보이면 제출 전 확인하세요.',
      'AI 분석 결과는 참고용이며 최종 신고 내용은 사용자가 확인해야 합니다.'
    ],
    safetyNotice: '긴급한 화재, 구조, 구급, 범죄 상황은 공식 긴급 신고 채널을 먼저 이용하세요.'
  };
}

function buildCandidates(rule, hasScenario) {
  const baseConfidence = hasScenario ? 86 : 58;
  return [
    { label: rule.label, confidence: baseConfidence },
    { label: '생활불편 신고', confidence: Math.max(42, baseConfidence - 18) },
    { label: '안전 위험 신고', confidence: Math.max(35, baseConfidence - 27) }
  ];
}

function buildEmergencyResult(input, scenario, location, description) {
  const fallbackLabel = scenario?.label ?? '긴급 위험 가능성';
  return {
    primaryType: {
      label: fallbackLabel,
      category: '긴급 위험 가능성',
      confidence: 0.91
    },
    typeCandidates: [
      { label: '긴급 위험 가능성', confidence: 91 },
      { label: fallbackLabel, confidence: 74 },
      { label: '생활민원 후속 신고', confidence: 44 }
    ],
    recommendedChannel: {
      name: '119 또는 112',
      reason: '감전, 화재, 범죄, 인명 피해 가능성이 있는 표현이 포함되어 긴급 신고 안내가 우선입니다.'
    },
    urgency: {
      level: '긴급',
      reason: '일반 민원 접수보다 즉시 신고가 필요한 상황일 수 있습니다.'
    },
    summary: description || '긴급 위험 가능성이 있는 현장입니다.',
    evidenceChecks: [
      { label: '즉시 신고', status: 'required', detail: '안전이 우선이므로 현장에서 무리하게 촬영하지 않습니다.' },
      { label: '거리 확보', status: 'required', detail: '위험 요소와 거리를 두고 공식 신고 채널을 이용합니다.' },
      { label: '후속 민원', status: 'info', detail: '긴급 조치 이후 필요하면 생활민원 신고를 보완합니다.' }
    ],
    draft: `${location} 인근에서 긴급 위험 가능성이 확인됩니다. 안전 확보 후 119 또는 112 신고가 우선입니다.`,
    privacyFlags: ['긴급 상황에서는 개인정보 마스킹보다 안전 확보와 공식 신고가 우선입니다.'],
    safetyNotice: '긴급 상황 가능성이 있으므로 앱 안내에 머무르지 말고 119 또는 112에 즉시 신고하세요.'
  };
}
