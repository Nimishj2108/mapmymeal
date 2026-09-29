import { BestMatchInfo, NGOEntity, MealItem } from '../types';
import { computeLossScore, DEFAULT_LOSS_WEIGHTS } from './lossFunction';
import { SEED_NGOS } from './seedData';

export function findBestMatchesForMeal(
  meal: Pick<MealItem, 'quantityPlates' | 'safeForHours' | 'freshnessScore' | 'coords'>,
  availableNgos: NGOEntity[] = SEED_NGOS
): { bestMatch: BestMatchInfo; rankedCandidates: Array<{ ngo: NGOEntity; lossScore: number; matchScore: number }> } {
  const ranked = availableNgos.map(ngo => {
    // Euclidean distance on SVG map converted to approximate Delhi km (scale approx 100 SVG units = 1.2km)
    const dx = ngo.coords.x - meal.coords.x;
    const dy = ngo.coords.y - meal.coords.y;
    const rawDist = Math.sqrt(dx * dx + dy * dy);
    const distanceKm = Number(Math.max(0.4, (rawDist / 85) * 1.1).toFixed(1));
    const etaMin = Math.max(3, Math.round(distanceKm * 3.2));

    // Calculate parameters for Loss Function:
    // W: Waste quantity factor (ratio of meal quantity to NGO daily capacity)
    const W = Math.min(1.0, Math.max(0.1, (meal.quantityPlates || 20) / ngo.capacityDaily));
    // E: Expiration urgency factor (less safe hours => higher urgency)
    const E = Math.min(1.0, Math.max(0.05, 1.0 - (meal.safeForHours / 6.0)));
    // M: Mileage factor
    const M = Math.min(1.0, distanceKm / 8.0);
    // T: Transit time factor
    const T = Math.min(1.0, etaMin / 25.0);
    // Q: Quality factor
    const Q = Math.min(1.0, Math.max(0.2, meal.freshnessScore / 100.0));
    // R: Recipient capacity & reliability
    const R = Math.min(1.0, ngo.capacityDaily / 350.0);

    const breakdown = computeLossScore({
      W,
      E,
      M,
      T,
      Q,
      R,
      ...DEFAULT_LOSS_WEIGHTS
    });

    const matchScore = Math.round(Math.max(60, Math.min(99, 100 - (breakdown.lossScore * 100))));

    return {
      ngo,
      distanceKm,
      etaMin,
      lossScore: breakdown.lossScore,
      matchScore
    };
  });

  ranked.sort((a, b) => a.lossScore - b.lossScore);
  const winner = ranked[0];

  const reasons = [
    `Lowest mathematical loss score (L = ${winner.lossScore})`,
    `Optimal transit ETA (${winner.etaMin} mins / ${winner.distanceKm} km)`,
    `Verified capacity: ${winner.ngo.capacityDaily} daily beneficiaries`
  ];

  return {
    bestMatch: {
      ngoId: winner.ngo.id,
      ngoName: winner.ngo.name,
      ngoNameHi: winner.ngo.nameHi,
      distanceKm: winner.distanceKm,
      etaMin: winner.etaMin,
      lossScore: winner.lossScore,
      matchScore: winner.matchScore,
      reasons
    },
    rankedCandidates: ranked.map(r => ({
      ngo: r.ngo,
      lossScore: r.lossScore,
      matchScore: r.matchScore
    }))
  };
}
