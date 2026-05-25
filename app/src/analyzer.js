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
    ruleBasis: {
      id: 'illegal-parking-resident-report',
      source: '안전신문고 및 지자체 불법주정차 주민신고제 안내',
      summary: '안전신문고 앱 촬영 사진, 동일 위치·각도, 일정 촬영 간격, 차량번호·위반지역·촬영시간 식별이 핵심 요건입니다.'
    },
    ruleRequirements: [
      {
        label: '앱 촬영 사진',
        status: 'required',
        detail: '안전신문고 앱 카메라로 촬영한 사진을 기준으로 하며, 지자체에 따라 갤러리 사진이나 동영상은 인정되지 않을 수 있습니다.'
      },
      {
        label: '동일 위치·각도',
        status: 'required',
        detail: '동일 위치와 동일한 촬영 방향에서 전면 2장 또는 후면 2장처럼 차량 이동 여부를 비교할 수 있어야 합니다.'
      },
      {
        label: '촬영 간격',
        status: 'required',
        detail: '6대 불법 주정차 구역은 보통 1분 이상 간격 사진 2장 이상이 필요하며, 일부 구역은 5분 기준을 둘 수 있습니다.'
      },
      {
        label: '식별 정보',
        status: 'required',
        detail: '차량번호, 위반지역, 촬영시간, 차량의 정지 상태가 사진에서 명확히 확인되어야 합니다.'
      },
      {
        label: '위반 구역 근거',
        status: 'recommended',
        detail: '횡단보도, 버스정류소, 소화전, 교차로 모퉁이, 보도, 어린이보호구역 등 금지 구역임을 보여주는 표지나 주변 배경이 필요합니다.'
      },
      {
        label: '신고 기한',
        status: 'info',
        detail: '신고 기한은 지자체별로 다르므로 촬영 당일 또는 지역 안내 기준 내에 접수해야 합니다.'
      }
    ],
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
  const rawLocation = String(input.location ?? '').trim();
  const hasLocation = Boolean(rawLocation);
  const location = hasLocation ? rawLocation : '현장 위치 미입력';
  const hasPhoto = input.hasPhoto !== false;
  const photoName = String(input.photoName ?? '').trim();
  const isEmergency = emergencyPattern.test(description);

  if (isEmergency) {
    return buildEmergencyResult(input, scenario, location, description, hasLocation, hasPhoto, photoName);
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
    evidenceChecks: buildEvidenceChecks({ rule, hasPhoto }),
    ruleBasis: rule.ruleBasis ?? null,
    ruleRequirements: rule.ruleRequirements ?? [],
    draft: buildDraft({ location, rule, hasLocation, isEmergency: false }),
    privacyFlags: [
      '사람 얼굴, 차량번호, 정확한 거주지 정보가 보이면 제출 전 확인하세요.',
      'AI 분석 결과는 참고용이며 최종 신고 내용은 사용자가 확인해야 합니다.'
    ],
    locationAssessment: buildLocationAssessment({ location, rule, hasLocation, isEmergency: false }),
    photoEvidenceAssessment: buildPhotoEvidenceAssessment({ rule, hasPhoto, photoName, isEmergency: false }),
    privacyAssessment: buildPrivacyAssessment({ description, location, rule, isEmergency: false }),
    duplicateAssessment: buildDuplicateAssessment({ description, location, rule, isEmergency: false }),
    officialHandoff: buildOfficialHandoff({ location, rule, hasLocation, hasPhoto, isEmergency: false }),
    accessibilityGuide: buildAccessibilityGuide({ location, rule, isEmergency: false }),
    regionalChannelGuide: buildRegionalChannelGuide({ location, rule, isEmergency: false }),
    explanationTrace: buildExplanationTrace({ location, rule, hasLocation, hasPhoto, isEmergency: false }),
    feedbackLoop: buildFeedbackLoop({ rule, isEmergency: false }),
    dataLifecyclePolicy: buildDataLifecyclePolicy({ isEmergency: false }),
    draftControl: buildDraftControl({ isEmergency: false }),
    safetyNotice: '긴급한 화재, 구조, 구급, 범죄 상황은 공식 긴급 신고 채널을 먼저 이용하세요.',
    ...buildReviewArtifacts(rule, location, false)
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

function buildEmergencyResult(input, scenario, location, description, hasLocation, hasPhoto, photoName) {
  const fallbackLabel = scenario?.label ?? '긴급 위험 가능성';
  const emergencyRule = {
    label: fallbackLabel,
    category: '긴급 위험 가능성',
    channel: '119 또는 112',
    summary: description || '긴급 위험 가능성이 있는 현장입니다.'
  };

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
    draft: buildDraft({ location, rule: emergencyRule, hasLocation, isEmergency: true }),
    privacyFlags: ['긴급 상황에서는 개인정보 마스킹보다 안전 확보와 공식 신고가 우선입니다.'],
    locationAssessment: buildLocationAssessment({ location, rule: emergencyRule, hasLocation, isEmergency: true }),
    photoEvidenceAssessment: buildPhotoEvidenceAssessment({ rule: emergencyRule, hasPhoto, photoName, isEmergency: true }),
    privacyAssessment: buildPrivacyAssessment({ description, location, rule: emergencyRule, isEmergency: true }),
    duplicateAssessment: buildDuplicateAssessment({ description, location, rule: emergencyRule, isEmergency: true }),
    officialHandoff: buildOfficialHandoff({ location, rule: emergencyRule, hasLocation, hasPhoto, isEmergency: true }),
    accessibilityGuide: buildAccessibilityGuide({ location, rule: emergencyRule, isEmergency: true }),
    regionalChannelGuide: buildRegionalChannelGuide({ location, rule: emergencyRule, isEmergency: true }),
    explanationTrace: buildExplanationTrace({ location, rule: emergencyRule, hasLocation, hasPhoto, isEmergency: true }),
    feedbackLoop: buildFeedbackLoop({ rule: emergencyRule, isEmergency: true }),
    dataLifecyclePolicy: buildDataLifecyclePolicy({ isEmergency: true }),
    draftControl: buildDraftControl({ isEmergency: true }),
    safetyNotice: '긴급 상황 가능성이 있으므로 앱 안내에 머무르지 말고 119 또는 112에 즉시 신고하세요.',
    ...buildReviewArtifacts(emergencyRule, location, true)
  };
}

function buildEvidenceChecks({ rule, hasPhoto }) {
  const checks = rule.checks.map(([label, status, detail]) => ({ label, status, detail }));

  if (hasPhoto) {
    return checks;
  }

  return [
    {
      label: '현장 사진 첨부',
      status: 'required',
      detail: '안전신문고는 사진/동영상, 신고내용, 지도상 위치를 함께 제출하도록 안내합니다. 공식 제출 전 현장 사진을 추가해야 합니다.'
    },
    ...checks.map((check) => {
      if (check.status !== 'passed' || !/(사진|파손|현장|범위|야간|번호판|위치)/.test(check.label)) {
        return check;
      }

      return {
        ...check,
        status: 'recommended',
        detail: `${check.detail} 실제 사진이 선택되지 않아 제출 전 확인이 필요합니다.`
      };
    })
  ];
}

function buildDraft({ location, rule, hasLocation, isEmergency }) {
  if (isEmergency) {
    return hasLocation
      ? `${location} 인근에서 긴급 위험 가능성이 확인됩니다. 안전 확보 후 119 또는 112 신고가 우선입니다.`
      : '위치가 아직 입력되지 않았습니다. 안전을 확보한 뒤 112 또는 119에 현재 위치와 위험 상황을 직접 알려야 합니다.';
  }

  return hasLocation
    ? `${location} 인근에서 ${rule.draftSubject}`
    : `위치가 아직 입력되지 않았습니다. ${rule.draftSubject} 공식 제출 전 정확한 주소나 지도상 위치를 추가해 주세요.`;
}

function buildLocationAssessment({ location, rule, hasLocation, isEmergency }) {
  if (hasLocation) {
    return {
      iteration: 'cycle-07',
      basis: 'location-evidence-completeness-review',
      status: 'ready',
      requiredBeforeSubmit: false,
      summary: `${location} 기준으로 ${rule.label} 신고 위치를 확인할 수 있습니다. 공식 제출 전 지도 핀과 주변 기준점이 맞는지 한 번 더 확인합니다.`,
      actions: [
        { label: '지도 위치 확인', detail: '공식 채널에서 지도 핀이 실제 현장과 맞는지 확인합니다.' },
        { label: '주변 기준점 유지', detail: '건물명, 도로명 표지, 가로등 번호처럼 담당자가 찾을 수 있는 단서를 남깁니다.' },
        { label: '사진 배경 유지', detail: '현장 사진에 파손 부위와 주변 배경이 함께 보이면 위치 확인이 쉬워집니다.' }
      ],
      officialBasis: [
        '안전신문고는 신고내용과 지도상 위치를 함께 제출하도록 안내합니다.',
        '국민신문고 민원 절차도 신청서에 주소와 민원 내용을 작성하도록 안내합니다.'
      ]
    };
  }

  return {
    iteration: 'cycle-07',
    basis: 'location-evidence-completeness-review',
    status: 'missing',
    requiredBeforeSubmit: !isEmergency,
    summary: isEmergency
      ? '긴급 상황에서는 앱 입력보다 112/119에 현재 위치를 직접 알리는 것이 우선입니다.'
      : '공식 신고는 사진과 설명만으로 끝나지 않고 지도상 위치나 주소가 필요합니다. 제출 전 위치를 보완해야 담당 기관이 현장을 찾을 수 있습니다.',
    actions: [
      { label: '지도 위치 지정', detail: '공식 채널에서 지도 핀 또는 GPS 위치를 실제 현장에 맞게 지정합니다.' },
      { label: '주변 기준점 추가', detail: '건물명, 도로명 주소, 정류장, 가로등 번호처럼 찾기 쉬운 기준점을 적습니다.' },
      { label: '사진 배경 보완', detail: '파손 부위만 확대하지 말고 주변 간판, 도로 표지, 출입구가 함께 보이는 사진을 추가합니다.' }
    ],
    officialBasis: [
      '안전신문고는 사진/동영상, 간단한 신고내용, 지도상 위치를 제출하도록 안내합니다.',
      '국민신문고 민원 절차는 신청서에 주소와 민원 내용을 작성하도록 안내합니다.'
    ]
  };
}

function buildPhotoEvidenceAssessment({ rule, hasPhoto, photoName, isEmergency }) {
  const commonBasis = [
    '안전신문고는 안전위험요인을 보면 사진이나 동영상을 촬영한 뒤 신고내용과 지도상 위치를 제출하도록 안내합니다.',
    '사진 증거는 파손 부위, 주변 배경, 담당자가 현장을 찾을 수 있는 단서를 함께 보여야 처리 가능성이 높아집니다.'
  ];

  if (hasPhoto) {
    return {
      iteration: 'cycle-08',
      basis: 'photo-evidence-completeness-review',
      status: 'ready',
      requiredBeforeSubmit: false,
      summary: `${photoName || '선택된 사진'} 기준으로 ${rule.label} 신고의 사진 증거를 확인합니다. 공식 제출 전 파손 부위와 주변 배경이 모두 보이는지 점검합니다.`,
      actions: [
        { label: '현장 사진 확인', detail: '선택한 사진에서 신고 대상과 위험 요소가 분명히 보이는지 확인합니다.' },
        { label: '전체 배경 사진', detail: '담당자가 위치를 찾을 수 있도록 간판, 도로명 표지, 건물 외관 같은 주변 단서를 포함합니다.' },
        { label: '근접 사진', detail: '파손, 막힘, 고장처럼 판단에 필요한 부분을 가까이서 한 번 더 촬영합니다.' }
      ],
      officialBasis: commonBasis
    };
  }

  return {
    iteration: 'cycle-08',
    basis: 'photo-evidence-completeness-review',
    status: 'missing',
    requiredBeforeSubmit: !isEmergency,
    summary: isEmergency
      ? '긴급 상황에서는 사진이나 동영상 촬영보다 안전 확보와 112/119 직접 신고가 우선입니다. 후속 생활민원 단계에서만 사진을 보완합니다.'
      : '안전신문고는 사진이나 동영상, 신고내용, 지도상 위치를 함께 제출하도록 안내합니다. 공식 제출 전 현장 사진을 추가해야 증거 부족으로 되돌아올 가능성을 줄일 수 있습니다.',
    actions: [
      { label: '현장 사진 추가', detail: '공식 제출 전 실제 현장 사진이나 동영상을 추가합니다.' },
      { label: '전체 배경 사진', detail: '현장 주변 건물, 간판, 도로명 표지처럼 위치를 확인할 수 있는 넓은 사진을 준비합니다.' },
      { label: '근접 사진', detail: '보도블록 파손, 배수구 막힘, 쓰레기 적치처럼 문제 부위가 선명한 근접 사진을 준비합니다.' }
    ],
    officialBasis: commonBasis
  };
}

function buildPrivacyAssessment({ description, location, rule, isEmergency }) {
  const risks = [];
  const text = `${description} ${location}`;

  if (/(얼굴|사람|행인|주민|아이|학생|보행자)/i.test(text)) {
    risks.push({
      label: '사람 얼굴',
      status: 'mask',
      detail: '신고 대상과 직접 관련 없는 사람 얼굴은 제출 전 흐림 처리하거나 촬영 각도를 조정합니다.'
    });
  }

  if (rule.ruleBasis?.id === 'illegal-parking-resident-report' || /(차량번호|번호판|차 번호)/i.test(text)) {
    risks.push({
      label: '차량번호',
      status: 'keep-for-report',
      detail: '불법주정차 신고에서는 차량번호가 신고 증거가 될 수 있으므로 공식 제출본에서는 식별 가능해야 합니다.'
    });
  }

  if (/(집 주소|거주지|현관|호수|상세 주소|주소 간판|전화번호|연락처)/i.test(text)) {
    risks.push({
      label: '상세 주소/거주지',
      status: 'minimize',
      detail: '신고 위치 확인에 필요한 범위를 넘는 거주지 세부 정보나 연락처는 가리거나 문장에서 제거합니다.'
    });
  }

  if (!risks.length) {
    risks.push({
      label: '일반 위치정보',
      status: 'review',
      detail: '정확한 위치는 처리에 필요하지만, 개인 거주지나 연락처가 함께 드러나는지 제출 전 확인합니다.'
    });
  }

  return {
    iteration: 'cycle-03',
    basis: 'privacy-minimization-review',
    riskLevel: risks.some((risk) => risk.status === 'mask' || risk.status === 'minimize') ? '높음' : '주의',
    summary: isEmergency
      ? '긴급 상황에서는 안전 확보가 우선이지만, 후속 민원 제출 시 불필요한 개인정보 노출을 줄여야 합니다.'
      : '신고에 필요한 증거는 유지하되, 목적에 필요한 최소한의 개인정보만 남기도록 점검합니다.',
    risks,
    maskingActions: [
      { label: '흐림 처리', detail: '사람 얼굴, 거주지 세부 정보, 연락처처럼 신고 판단에 직접 필요 없는 정보는 마스킹합니다.' },
      { label: '필요 정보 유지', detail: '차량번호처럼 신고 증거에 필요한 정보는 공식 제출본에서 유지하되, 발표·공유용 화면에서는 가립니다.' },
      { label: '문장 정제', detail: '신고문에는 이름, 연락처, 집 주소 같은 불필요한 개인정보를 넣지 않습니다.' }
    ],
    retentionPolicy: [
      '원본 사진은 분석과 사용자 확인에 필요한 기간만 보관합니다.',
      'AI 개선용 로그는 얼굴, 차량번호, 상세 주소를 제거하거나 비식별화한 뒤 사용합니다.',
      '사용자가 제출하지 않기로 한 신고 데이터는 즉시 삭제할 수 있어야 합니다.'
    ]
  };
}

function buildDuplicateAssessment({ description, location, rule, isEmergency }) {
  const text = `${description} ${location}`;
  const strongDuplicatePattern = /(이미|여러 명|여러명|다른 사람|신고한|신고된|접수된|처리번호|민원 많|같은 민원|동일 민원|중복)/i;
  const weakDuplicatePattern = /(같은|동일|또|다시|반복|계속|매번|자주)/i;
  const hasStrongSignal = strongDuplicatePattern.test(text);
  const hasWeakSignal = weakDuplicatePattern.test(text);
  const riskLevel = hasStrongSignal ? '중복 가능성 높음' : hasWeakSignal ? '확인 필요' : '중복 가능성 낮음';

  const signals = [
    {
      label: '유사 위치',
      detail: `${location} 주변에서 같은 유형의 신고가 이미 접수되었는지 확인할 필요가 있습니다.`
    },
    {
      label: '동일 유형',
      detail: `${rule.label} 유형은 위치와 시간대가 겹치면 행정 담당자에게 중복 후보로 보일 수 있습니다.`
    }
  ];

  if (hasStrongSignal) {
    signals.push({
      label: '반복 표현',
      detail: '입력 문장에 이미 접수되었거나 여러 사람이 신고했을 가능성을 나타내는 표현이 있습니다.'
    });
  }

  if (/(오늘|방금|더|악화|새로|추가|위험|다침|넘어)/i.test(text)) {
    signals.push({
      label: '새로운 위험 정보',
      detail: '상태 변화나 위험 증가가 있으면 기존 신고의 단순 반복이 아니라 보완 정보가 될 수 있습니다.'
    });
  }

  return {
    iteration: 'cycle-04',
    basis: 'duplicate-admin-burden-review',
    riskLevel,
    blocksSubmission: false,
    summary: isEmergency
      ? '긴급 상황은 중복 여부보다 안전 신고가 우선입니다. 중복 점검은 후속 생활민원 단계에서만 참고합니다.'
      : '중복 가능성을 이유로 신고를 막지 않고, 기존 신고 확인과 보완 정보 추가를 안내해 처리 품질을 높입니다.',
    signals,
    actions: [
      {
        label: '유사 신고 확인',
        detail: '이미 접수된 민원이 있더라도 신고를 막지 않고, 공식 채널의 유사 사례나 처리번호를 먼저 확인하도록 안내합니다.'
      },
      {
        label: '보완 정보 추가',
        detail: '오늘 더 파손된 새 사진, 발생 시각, 위험 변화, 보행 불편 범위를 추가하면 중복 신고도 처리 가치가 생깁니다.'
      },
      {
        label: '반복 제출 주의',
        detail: '같은 내용을 여러 번 제출하기보다 기존 처리번호나 이전 답변에 새 근거를 붙이는 편이 행정 부담을 줄입니다.'
      }
    ],
    adminImpact: '행정 담당자 입장에서는 동일 내용을 다시 분류하는 시간을 줄이고, 새 증거가 있는 신고를 우선 검토할 수 있습니다.'
  };
}

function buildOfficialHandoff({ location, rule, hasLocation, hasPhoto, isEmergency }) {
  if (isEmergency) {
    return {
      iteration: 'cycle-05',
      basis: 'official-channel-handoff-review',
      canAutoSubmit: false,
      primaryAction: {
        label: '112/119 우선',
        url: ''
      },
      notice: 'Civic Copilot은 긴급 신고를 자동 제출하지 않습니다. 안전을 확보한 뒤 112 또는 119 같은 공식 긴급 신고 채널을 직접 이용해야 합니다.',
      checklist: [
        { label: '안전거리 확보', detail: '현장에서 무리하게 촬영하거나 접근하지 않습니다.' },
        { label: hasLocation ? '112/119 직접 신고' : '현재 위치 직접 전달', detail: '위치와 위험 상황을 공식 긴급 신고 채널에 직접 알립니다.' },
        { label: '후속 민원 분리', detail: '긴급 조치 후 필요할 때만 생활민원 신고문을 보완합니다.' }
      ],
      channelOptions: [
        { label: '119', detail: '화재, 구조, 구급 상황' },
        { label: '112', detail: '범죄, 치안, 즉시 위험 상황' }
      ]
    };
  }

  const channelOptions = [
    {
      label: '안전신문고',
      url: 'https://www.safetyreport.go.kr/',
      detail: `${rule.label} 같은 안전/생활불편 신고를 공식 접수하고 신고확인·처리현황을 제공합니다.`
    }
  ];

  if (/서울|Seoul/i.test(location)) {
    channelOptions.push({
      label: '서울 스마트 불편신고',
      url: 'https://smartreport.seoul.go.kr/',
      detail: '서울 생활불편 신고, 신고조회, 시민말씀지도와 연결할 수 있습니다.'
    });
    channelOptions.push({
      label: '120 다산콜',
      url: 'https://www.120dasan.or.kr/dsnc/main/contents.do?menuNo=200020',
      detail: '서울시와 25개 자치구 행정상담, 민원 신고, 외국어 상담을 받을 수 있습니다.'
    });
  }

  const checklist = [
    { label: '신고문 복사', detail: '생성된 신고문을 복사하고 과장되거나 확인되지 않은 표현을 제거합니다.' },
    { label: '사진/위치 확인', detail: '공식 채널에서 요구하는 사진, 위치, 시간, 식별 정보를 다시 확인합니다.' },
    { label: '공식 채널에서 직접 제출', detail: '추천 채널을 열고 사용자가 최종 내용과 제출 여부를 직접 결정합니다.' }
  ];

  if (!hasLocation) {
    checklist.splice(1, 0, {
      label: '위치 보완',
      detail: '공식 제출 전 지도상 위치, 주소, 주변 기준점을 추가해 담당자가 현장을 찾을 수 있게 합니다.'
    });
  }

  if (!hasPhoto) {
    const photoInsertIndex = hasLocation ? 1 : 2;
    checklist.splice(photoInsertIndex, 0, {
      label: '사진 첨부',
      detail: '공식 제출 전 현장 사진이나 동영상을 추가하고, 전체 배경과 근접 사진이 모두 충분한지 확인합니다.'
    });
  }

  return {
    iteration: 'cycle-05',
    basis: 'official-channel-handoff-review',
    canAutoSubmit: false,
    primaryAction: {
      label: '공식 채널 열기',
      url: channelOptions[0].url
    },
    notice: 'Civic Copilot은 신고를 자동 제출하지 않습니다. 신고문을 복사한 뒤 사진, 위치, 내용을 사용자가 공식 채널에서 직접 확인하고 제출해야 합니다.',
    checklist,
    channelOptions
  };
}

function buildAccessibilityGuide({ location, rule, isEmergency }) {
  const supportChannels = [];

  if (/서울|Seoul/i.test(location)) {
    supportChannels.push({
      label: '120 외국어 상담',
      detail: '서울시와 25개 자치구 행정 상담, 민원 신고, 정책 문의를 영어·중국어·일본어·베트남어·몽골어로 받을 수 있습니다. 평일 9:00-18:00에 (02)120 + 9번으로 연결합니다.'
    });
  }

  if (isEmergency) {
    return {
      iteration: 'cycle-09',
      basis: 'plain-language-accessibility-review',
      audiences: ['디지털 취약 사용자', '외국인 주민'],
      summary: '긴급 상황은 앱에서 복잡하게 판단하지 않고 안전 확보와 공식 긴급 신고를 쉬운 순서로 안내합니다.',
      steps: [
        { label: '안전한 곳으로 이동', detail: '위험 요소에서 떨어지고 주변 사람에게 도움을 요청합니다.' },
        { label: '112 또는 119에 전화', detail: '현재 위치와 보이는 위험 상황을 먼저 말합니다.' },
        { label: '후속 민원은 나중에', detail: '긴급 조치가 끝난 뒤 필요한 경우에만 생활민원 신고문을 보완합니다.' }
      ],
      supportChannels
    };
  }

  return {
    iteration: 'cycle-09',
    basis: 'plain-language-accessibility-review',
    audiences: ['디지털 취약 사용자', '외국인 주민'],
    summary: `${rule.label} 신고 준비를 쉬운 순서로 정리합니다. 어려운 행정 용어보다 지금 해야 할 행동을 먼저 보여줍니다.`,
    steps: [
      { label: '사진과 위치 확인', detail: '현장 사진, 지도 위치, 주변 기준점이 빠졌는지 확인합니다.' },
      { label: '신고문 복사', detail: '생성된 문장을 읽고 사실과 다른 표현이 있으면 지운 뒤 복사합니다.' },
      { label: '공식 채널에서 직접 제출', detail: '안전신문고나 지자체 신고 화면에서 사용자가 최종 내용을 확인하고 제출합니다.' }
    ],
    supportChannels
  };
}

function buildRegionalChannelGuide({ location, rule, isEmergency }) {
  if (isEmergency) {
    return {
      iteration: 'cycle-10',
      basis: 'regional-channel-routing-review',
      region: '긴급',
      primary: {
        label: '112/119',
        url: '',
        detail: '긴급 상황은 지역 생활민원 채널보다 112 또는 119 직접 신고가 우선입니다.'
      },
      summary: '긴급 위험 가능성이 있으면 지역 생활민원 라우팅보다 공식 긴급 신고 채널을 먼저 이용합니다.',
      options: [
        { label: '119', url: '', detail: '화재, 구조, 구급 상황' },
        { label: '112', url: '', detail: '범죄, 치안, 즉시 위험 상황' }
      ]
    };
  }

  if (/서울|Seoul/i.test(location)) {
    return {
      iteration: 'cycle-10',
      basis: 'regional-channel-routing-review',
      region: '서울',
      primary: {
        label: '서울 스마트 불편신고',
        url: 'https://smartreport.seoul.go.kr/',
        detail: '서울 생활불편 신고, 신고조회, 시민말씀지도와 연결합니다.'
      },
      summary: `서울 스마트 불편신고는 도로파손, 보도블록파손, 쓰레기 무단투기 같은 생활불편 신고 대상을 안내합니다. ${rule.label}은 지역 생활불편 채널을 1순위로 검토하고, 전국 안전신고는 안전신문고를 대안으로 둡니다.`,
      options: [
        {
          label: '서울 스마트 불편신고',
          url: 'https://smartreport.seoul.go.kr/',
          detail: '서울 지역 생활불편 신고와 처리 조회에 적합합니다.'
        },
        {
          label: '안전신문고',
          url: 'https://www.safetyreport.go.kr/',
          detail: '전국 단위 안전 위험 신고와 처리현황 확인에 적합합니다.'
        },
        {
          label: '120 다산콜',
          url: 'https://www.120dasan.or.kr/dsnc/main/contents.do?menuNo=200020',
          detail: '채널이 헷갈리거나 외국어 상담이 필요할 때 서울 행정 상담을 받을 수 있습니다.'
        }
      ]
    };
  }

  return {
    iteration: 'cycle-10',
    basis: 'regional-channel-routing-review',
    region: '전국/지역 확인 필요',
    primary: {
      label: '안전신문고',
      url: 'https://www.safetyreport.go.kr/',
      detail: '전국 단위 안전·생활불편 신고와 처리현황 확인에 적합합니다.'
    },
    summary: `${rule.label} 신고는 지역별 생활민원 앱이 다를 수 있으므로, 안전신문고를 기본 경로로 두고 현장 주소의 지자체 생활민원 채널을 함께 확인합니다.`,
    options: [
      {
        label: '안전신문고',
        url: 'https://www.safetyreport.go.kr/',
        detail: '전국 단위 안전·생활불편 신고 기본 경로입니다.'
      },
      {
        label: '관할 지자체 생활민원',
        url: '',
        detail: '주소가 확인되면 해당 시·군·구의 생활불편 신고 앱이나 민원 창구를 확인합니다.'
      }
    ]
  };
}

function buildExplanationTrace({ location, rule, hasLocation, hasPhoto, isEmergency }) {
  const regionalChannel = buildRegionalChannelGuide({ location, rule, isEmergency });
  const evidenceGaps = [];

  if (!hasLocation) {
    evidenceGaps.push('지도상 위치');
  }

  if (!hasPhoto && !isEmergency) {
    evidenceGaps.push('현장 사진');
  }

  return {
    iteration: 'cycle-11',
    basis: 'ai-transparency-explainability-review',
    principles: ['공식 근거 표시', '불확실성 고지', '사용자 최종 확인'],
    summary: 'AI 추천을 그대로 믿게 하지 않고, 어떤 입력과 공식 근거를 바탕으로 판단했는지와 어디까지 사용자가 확인해야 하는지를 함께 표시합니다.',
    items: [
      {
        label: '유형 추천 근거',
        detail: isEmergency
          ? '입력 설명에 긴급 위험 표현이 있어 일반 생활민원보다 112/119 안내를 우선했습니다.'
          : `선택한 시나리오와 설명을 ${rule.label} 유형 규칙에 맞춰 분류했습니다. 실제 서비스에서는 사진 분석과 규칙 DB 근거를 함께 확인해야 합니다.`
      },
      {
        label: '채널 추천 근거',
        detail: `${regionalChannel.region} 기준 1순위는 ${regionalChannel.primary.label}입니다. 대안 채널도 함께 보여 잘못된 단일 추천으로 오인하지 않게 합니다.`
      },
      {
        label: '증거 보완 근거',
        detail: evidenceGaps.length
          ? `${evidenceGaps.join(', ')}이 부족하므로 공식 제출 전 보완 필요로 표시했습니다.`
          : '사진과 위치가 입력되어도 공식 채널에서 요구하는 식별 정보와 제출 요건을 최종 확인해야 합니다.'
      },
      {
        label: '자동 제출 금지 근거',
        detail: 'Civic Copilot은 신고 준비를 돕는 보조 레이어이며, 공식 접수와 처리 결과 확인은 안전신문고나 지자체 공식 채널에서 사용자가 직접 수행해야 합니다.'
      }
    ],
    riskNotice: 'AI 결과는 참고용입니다. 추천 유형, 채널, 신고문, 증거 요건은 사용자가 공식 채널에서 최종 확인해야 합니다.',
    sources: [
      {
        label: 'NIA 인공지능 사업추진 윤리원칙',
        detail: 'AI 사업의 위험요인 파악, 도덕적 책임, 사회적 영향 고려 원칙을 참고했습니다.'
      },
      {
        label: '행정안전부 안전신문고 업무안내',
        detail: '사진/동영상, 신고내용, 지도상 위치, 공식 처리현황 확인의 책임 경계를 참고했습니다.'
      },
      {
        label: '서울 스마트 불편신고 안내',
        detail: '서울 생활불편 신고 대상과 지역 채널 라우팅 근거로 사용했습니다.'
      }
    ]
  };
}

function buildFeedbackLoop({ rule, isEmergency }) {
  const scenarioLabel = rule?.label ?? '생활불편 신고';

  return {
    iteration: 'cycle-06',
    basis: 'post-submission-feedback-loop-review',
    privacyMode: 'anonymous-choice-only',
    notice: '선택형 피드백만 저장하고 위치나 신고문 원문은 저장하지 않습니다.',
    options: [
      {
        label: '신고문 도움됨',
        value: 'draft_useful',
        detail: `${scenarioLabel} 신고문 초안이 공식 제출 준비에 도움이 되었는지 표시합니다.`
      },
      {
        label: '보완 필요',
        value: 'needs_revision',
        detail: '유형, 채널, 증거 안내 중 실제 제출 전에 고쳐야 할 부분이 있는지 표시합니다.'
      },
      {
        label: '공식 제출 완료',
        value: 'submitted_officially',
        detail: isEmergency
          ? '긴급 채널 직접 신고 또는 후속 민원 제출까지 이어졌는지 익명 집계합니다.'
          : '공식 채널 이동 후 실제 제출까지 이어졌는지 익명 집계합니다.'
      }
    ],
    metrics: [
      { label: '추천 정확도', detail: '유형과 공식 채널 추천이 사용자의 실제 상황과 맞았는지 확인합니다.' },
      { label: '신고문 유용성', detail: '생성 문장이 공식 제출 준비 시간을 줄였는지 평가합니다.' },
      { label: '공식 제출 전환', detail: '신고 전 검토가 공식 채널 제출 또는 긴급 신고로 이어졌는지 봅니다.' }
    ],
    retention: [
      '피드백은 선택값과 시나리오 수준의 비식별 정보만 남깁니다.',
      '위치, 신고문 원문, 사진 원본은 피드백 로그에 저장하지 않습니다.'
    ]
  };
}

function buildDataLifecyclePolicy({ isEmergency }) {
  return {
    iteration: 'cycle-14',
    basis: 'server-ai-data-retention-review',
    mode: 'stateless-mvp',
    summary: isEmergency
      ? '긴급 상황은 데이터 분석보다 공식 긴급 신고가 우선입니다. MVP 서버는 입력을 저장하지 않고, 향후 AI 연동에서도 긴급 원본 데이터는 최소 보관 후 즉시 삭제 대상으로 둡니다.'
      : 'MVP 서버는 신고 전 검토 응답을 만들기 위해 입력을 메모리에서만 처리하고 서버 DB에 저장하지 않습니다. 향후 AI 연동 시에도 원본 사진과 상세 위치는 짧은 보관 기간과 삭제 통제를 전제로 둡니다.',
    storage: [
      {
        label: 'MVP API 요청',
        status: 'no-server-storage',
        detail: '현재 데모는 요청을 메모리에서 분석한 뒤 응답만 반환하며, 서버 DB에 저장하지 않습니다.'
      },
      {
        label: '사진 원본',
        status: 'browser-only-preview',
        detail: '사진 원본은 브라우저 미리보기에서만 사용하고, API에는 사진 첨부 여부만 보냅니다.'
      },
      {
        label: 'AI 연동 로그',
        status: 'redacted-future-log',
        detail: '향후 VLM/LLM/RAG 연동 로그는 상세 위치, 신고문 원문, 얼굴·번호판 원본을 제외한 비식별 메타데이터 중심으로 남깁니다.'
      },
      {
        label: '삭제/권리 대응',
        status: 'user-control',
        detail: '사용자는 로컬 이력을 삭제할 수 있고, 실제 서비스에서는 서버 보관 데이터에 대한 열람·삭제·처리정지 요구 경로를 둡니다.'
      }
    ],
    futureControls: [
      '원본 사진은 분석 직후 삭제하거나 사용자가 확인할 수 있는 짧은 TTL을 둡니다.',
      '장기 품질 개선에는 원본 신고문 대신 유형, 채널, 증거 상태, 선택형 피드백 같은 비식별 신호를 사용합니다.',
      '공식 제출과 처리 결과는 안전신문고나 지자체 공식 채널에 남기고 Civic Copilot 저장소와 분리합니다.'
    ],
    sources: [
      {
        label: 'PIPC AI 개인정보보호 자율점검표',
        detail: '기획·설계 단계부터 Privacy by Design, 보관·관리, 파기, 권리행사 절차를 점검하는 근거입니다.'
      },
      {
        label: 'PIPC 개인정보 처리방침 파기 절차',
        detail: '보유기간 경과나 처리목적 달성으로 불필요해진 개인정보는 지체 없이 파기해야 한다는 원칙을 참고했습니다.'
      },
      {
        label: 'PIPC 생성형 AI 개인정보 처리 안내',
        detail: '생성형 AI 개발·활용에서도 안전한 개인정보 처리 기준이 필요하다는 최신 안내를 참고했습니다.'
      }
    ]
  };
}

function buildDraftControl({ isEmergency }) {
  return {
    iteration: 'cycle-15',
    basis: 'draft-user-control-review',
    mode: 'user-reviewed-draft',
    notice: isEmergency
      ? 'AI 초안은 긴급 신고를 대신하지 않습니다. 안전을 확보한 뒤 112/119에 현재 위치와 위험 상황을 직접 말해야 합니다.'
      : 'AI 초안은 공식 민원 신청서에 붙여 넣기 전 검토용입니다. 사용자가 사실과 개인정보를 확인하고 필요한 표현을 직접 수정해야 합니다.',
    checklist: [
      {
        label: '사실 확인',
        detail: '내가 직접 본 위치, 문제, 위험 정도만 남기고 확실하지 않은 내용은 지웁니다.'
      },
      {
        label: '과장 제거',
        detail: '감정적 표현이나 단정 대신 현장 상태와 요청 조치를 중심으로 씁니다.'
      },
      {
        label: '개인정보 제거',
        detail: '신고에 필요 없는 이름, 전화번호, 얼굴, 상세 거주지 정보가 문장에 들어가지 않았는지 확인합니다.'
      },
      {
        label: '공식 채널 직접 제출',
        detail: '수정한 문장은 사용자가 안전신문고나 지자체 공식 채널에서 직접 제출합니다.'
      }
    ],
    storagePolicy: '수정본 원문은 서버나 로컬 이력에 저장하지 않습니다. 현재 화면에서만 편집하고, 복사 또는 다운로드할 때 사용합니다.',
    futureControls: [
      '제품화 단계에서는 AI 초안과 사용자 수정본이 저장되는지 별도로 고지합니다.',
      '부적절한 AI 초안은 신고·이의 제기할 수 있게 하되, 원문 저장 없이 선택형 피드백부터 우선합니다.',
      '모델 개선에는 수정본 원문보다 어떤 항목을 고쳤는지에 대한 비식별 선택 신호를 사용합니다.'
    ],
    sources: [
      {
        label: '국민신문고 민원 이용 안내',
        detail: '민원은 신청서 작성, 유사사례 검토, 처리기관 선택 및 제출을 거쳐 공식 접수됩니다.'
      },
      {
        label: 'PIPC 생성형 AI 이용자 개인정보 보호 가이드',
        detail: '이용자가 입력 정보 처리와 기록 저장·삭제, 학습 활용 거부 같은 통제 기능을 확인해야 한다는 근거입니다.'
      },
      {
        label: 'PIPC 개인정보 처리방침 작성지침',
        detail: '생성형 AI 입력 정보와 생성 결과물이 저장되는 경우 처리항목과 권리행사 경로를 안내해야 한다는 근거입니다.'
      },
      {
        label: 'NIA 인공지능 사업추진 윤리원칙',
        detail: '오남용 방지와 사회보편적 제도·윤리규범 안의 AI 활용 원칙을 참고했습니다.'
      }
    ]
  };
}

function buildReviewArtifacts(rule, location, isEmergency) {
  if (rule.ruleBasis?.id === 'illegal-parking-resident-report') {
    return buildParkingReviewArtifacts(rule, location);
  }

  return {
    reviewLoop: {
      iteration: 'cycle-01',
      basis: 'research-backed mock review',
      method: '기획안과 최신 조사 근거를 바탕으로 5개 관점에서 MVP 흐름을 점검했습니다.'
    },
    personaReviews: [
      {
        role: '대학생 시민',
        lens: '현장에서 빠르게 신고 준비를 끝낼 수 있는가',
        finding: `${location} 기준으로 ${rule.label} 상황을 바로 이해할 수 있습니다.`,
        designAction: '입력 화면은 사진, 위치, 한 줄 설명만 요구해 현장 사용 부담을 줄입니다.'
      },
      {
        role: '디지털 취약 사용자',
        lens: '복잡한 행정 용어 없이 다음 행동을 알 수 있는가',
        finding: '신고 채널과 증거 상태를 짧은 카드로 나누면 읽기 부담이 낮습니다.',
        designAction: '추천, 권장, 필수 같은 상태 라벨을 유지하고 문장은 짧게 제공합니다.'
      },
      {
        role: '외국인 주민',
        lens: '한국어 민원 작성 부담을 줄일 수 있는가',
        finding: '짧은 설명을 행정 처리 가능한 문장으로 바꾸는 기능이 가장 큰 도움입니다.',
        designAction: 'MVP 이후 영어 입력과 한국어 신고문 생성을 확장 요구사항으로 둡니다.'
      },
      {
        role: '행정 담당자',
        lens: '오분류와 증거 부족 민원을 줄이는가',
        finding: `${rule.category} 분류와 증거 체크가 함께 제공되어 처리 부서 판단에 필요한 정보가 늘어납니다.`,
        designAction: '파손 부위뿐 아니라 주변 위치가 드러나는 사진을 권장해 현장 확인 가능성을 높입니다.'
      },
      {
        role: '안전/윤리 검토자',
        lens: '긴급상황과 개인정보 위험을 보수적으로 다루는가',
        finding: isEmergency
          ? '긴급 위험 표현이 있으면 일반 민원보다 112/119 안내가 우선입니다.'
          : '일반 민원에서도 긴급 키워드와 개인정보 노출 가능성을 계속 경고해야 합니다.',
        designAction: isEmergency
          ? '분석 결과보다 안전 확보와 공식 긴급 신고 안내를 화면 상단에 둡니다.'
          : 'AI 결과는 참고용이며 얼굴, 차량번호, 상세 주소는 제출 전 확인하도록 안내합니다.'
      }
    ]
  };
}

function buildParkingReviewArtifacts(rule, location) {
  return {
    reviewLoop: {
      iteration: 'cycle-02',
      basis: 'official-rule-backed parking review',
      method: '불법주정차 주민신고제 공식 안내를 바탕으로 증거 요건과 규칙 DB 설계를 재검토했습니다.'
    },
    personaReviews: [
      {
        role: '현장 보행자',
        lens: '위험한 주정차를 발견했을 때 촬영 부담이 현실적인가',
        finding: `${location} 기준으로 ${rule.label} 신고는 사진 2장과 시간 간격 때문에 즉시 완료하기 어렵습니다.`,
        designAction: '분석 결과에서 1분 간격 사진 2장 요건을 먼저 보여주고, 사용자가 기다려야 하는 이유를 설명합니다.'
      },
      {
        role: '주차단속 담당자',
        lens: '사진만으로 위반 사실을 판단할 수 있는가',
        finding: '동일 위치·각도, 차량번호, 위반지역, 촬영시간이 없으면 과태료 부과 판단이 어렵습니다.',
        designAction: '규칙 기반 요건 섹션에 차량번호, 위반지역, 촬영시간, 주변 배경 식별 항목을 필수로 표시합니다.'
      },
      {
        role: '디지털 취약 사용자',
        lens: '사진 요건을 순서대로 이해할 수 있는가',
        finding: '한 번에 많은 규칙을 보여주면 어렵기 때문에 체크리스트형 안내가 필요합니다.',
        designAction: '필수/권장/참고 라벨과 짧은 설명으로 신고 전 확인 순서를 정리합니다.'
      },
      {
        role: '개인정보 검토자',
        lens: '번호판과 주변 배경 촬영이 과도한 개인정보 노출로 이어지지 않는가',
        finding: '차량번호는 신고 증거에 필요하지만 사람 얼굴이나 불필요한 사생활 정보는 최소화해야 합니다.',
        designAction: '번호판은 식별하되 사람 얼굴과 거주지 세부 정보는 제출 전 확인하도록 경고합니다.'
      },
      {
        role: '지역 규칙 관리자',
        lens: '지역별 촬영 간격과 운영시간 차이를 반영할 수 있는가',
        finding: '서울, 부평, 대전 등 지자체별 신고 기한과 일부 촬영 간격 기준이 다를 수 있습니다.',
        designAction: 'MVP는 공통 요건을 보여주고, 실제 제품에서는 지역별 규칙 DB로 운영시간과 신고기한을 분리합니다.'
      }
    ]
  };
}
