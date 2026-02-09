const test = require('node:test');
const assert = require('node:assert/strict');

const {
  acceptanceProbability,
  logAcceptanceRatio,
} = require('./.tmp/metropolis.cjs');
const { createInitialState, algorithmReducer } = require('./.tmp/algorithm-state.cjs');
const { sanitizeAlgorithmConfig } = require('./.tmp/sanitize.cjs');

function makeConfig(overrides = {}) {
  return {
    totalSamples: 10,
    burnInSamples: 0,
    dataPoints: 5,
    trueParams: { slope: 2.5, intercept: 5, sigma: 3 },
    priorParams: { slope: 0, intercept: 0, sigma: 5 },
    initialParams: { slope: 0, intercept: 0, sigma: 5 },
    proposalWidths: { slope: 0.3, intercept: 1, sigma: 0.5 },
    ...overrides,
  };
}

test('acceptanceProbability handles degenerate infinite inputs', () => {
  assert.equal(acceptanceProbability(-Infinity, -Infinity), 0);
  assert.equal(acceptanceProbability(-Infinity, 0), 1);
  assert.equal(acceptanceProbability(0, -Infinity), 0);
});

test('logAcceptanceRatio does not return NaN for impossible/impossible state', () => {
  const ratio = logAcceptanceRatio(-Infinity, -Infinity);
  assert.equal(ratio, -Infinity);
  assert.equal(Number.isNaN(ratio), false);
});

test('sanitizeAlgorithmConfig clamps and rounds invalid numeric values', () => {
  const dirty = makeConfig({
    totalSamples: 0.2,
    burnInSamples: -7.8,
    dataPoints: Number.NaN,
    trueParams: { slope: Number.POSITIVE_INFINITY, intercept: Number.NaN, sigma: -3 },
    priorParams: { slope: 1, intercept: 2, sigma: 0 },
    initialParams: { slope: 1, intercept: 2, sigma: 0 },
    proposalWidths: { slope: 0, intercept: Number.NaN, sigma: -1 },
  });

  const clean = sanitizeAlgorithmConfig(dirty);

  assert.equal(clean.totalSamples, 1);
  assert.equal(clean.burnInSamples, 0);
  assert.equal(clean.dataPoints, 50);
  assert.equal(clean.trueParams.slope, 2.5);
  assert.equal(clean.trueParams.intercept, 5);
  assert.equal(clean.trueParams.sigma, 0.01);
  assert.equal(clean.priorParams.sigma, 0.01);
  assert.equal(clean.initialParams.sigma, 0.01);
  assert.equal(clean.proposalWidths.slope, 0.01);
  assert.equal(clean.proposalWidths.intercept, 1);
  assert.equal(clean.proposalWidths.sigma, 0.01);
});

test('createInitialState applies sanitization before generating data', () => {
  const state = createInitialState(
    makeConfig({
      dataPoints: -10,
      trueParams: { slope: 2, intercept: 3, sigma: 0 },
      priorParams: { slope: 1, intercept: 2, sigma: -9 },
      initialParams: { slope: 1, intercept: 2, sigma: -9 },
    }),
  );

  assert.equal(state.config.dataPoints, 1);
  assert.equal(state.config.trueParams.sigma, 0.01);
  assert.equal(state.config.initialParams.sigma, 0.01);
  assert.equal(state.currentParams.sigma, 0.01);
  assert.equal(state.data.length, 1);
});

test('NEXT_STEP keeps diagnostics numeric when both posteriors are impossible', () => {
  const state = createInitialState(makeConfig());
  const poisoned = {
    ...state,
    currentParams: { ...state.currentParams, sigma: 0 },
    config: {
      ...state.config,
      proposalWidths: { slope: 0, intercept: 0, sigma: 0 },
    },
  };

  const next = algorithmReducer(poisoned, { type: 'NEXT_STEP' });
  assert.ok(next.stepResult);
  assert.equal(next.stepResult.acceptanceProbability, 0);
  assert.equal(next.stepResult.logRatio, -Infinity);
  assert.equal(Number.isNaN(next.stepResult.logRatio), false);
  assert.equal(next.statusMessage.includes('NaN'), false);
});
