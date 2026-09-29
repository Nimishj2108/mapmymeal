import { LossParams } from '../types';

export const DEFAULT_LOSS_WEIGHTS = {
  alpha: 0.30,  // Weight for W (Waste quantity factor)
  beta: 0.25,   // Weight for E (Expiration urgency factor)
  gamma: 0.20,  // Weight for M (Distance / Mileage factor)
  delta: 0.15,  // Weight for T (Transit time factor)
  eta: 0.10,    // Weight for Q (Quality / Freshness benefit)
  lambda: 0.05  // Weight for R (Recipient reliability / capacity benefit)
};

export const PAPER_PRESET: LossParams = {
  W: 0.20,
  E: 0.15,
  M: 0.25,
  T: 0.10,
  Q: 0.80,
  R: 0.70,
  ...DEFAULT_LOSS_WEIGHTS
};

export interface LossCalculationBreakdown {
  lossScore: number;
  termW: number;
  termE: number;
  termM: number;
  termT: number;
  termQ: number;
  termR: number;
  penaltyTotal: number;
  benefitTotal: number;
  explanation: string;
}

export function computeLossScore(params: LossParams): LossCalculationBreakdown {
  const termW = params.alpha * params.W;
  const termE = params.beta * params.E;
  const termM = params.gamma * params.M;
  const termT = params.delta * params.T;

  const penaltyTotal = termW + termE + termM + termT;

  const termQ = params.eta * params.Q;
  const termR = params.lambda * params.R;

  const benefitTotal = termQ + termR;

  // L = alpha*W + beta*E + gamma*M + delta*T - eta*Q - lambda*R
  const lossScore = Number((penaltyTotal - benefitTotal).toFixed(4));

  let explanation = '';
  if (lossScore <= 0.10) {
    explanation = 'Optimal redistribution scenario: Negligible wastage penalty, high food freshness, and rapid transit to a reliable recipient.';
  } else if (lossScore <= 0.25) {
    explanation = 'Viable route: Moderate mileage and transit latency, balanced by satisfactory food quality and recipient capacity.';
  } else {
    explanation = 'Sub-optimal allocation: High expiration urgency or transit distance diminishes societal recovery efficiency.';
  }

  return {
    lossScore,
    termW,
    termE,
    termM,
    termT,
    termQ,
    termR,
    penaltyTotal,
    benefitTotal,
    explanation
  };
}
