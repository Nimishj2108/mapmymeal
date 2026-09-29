export type UserRole = 'donor' | 'recipient' | 'ngo';

export type BinClassification = 'DONATE' | 'SHELF_LIFE' | 'RECYCLE' | 'THROW_AWAY';

export type FoodCondition = 'fresh' | 'stale' | 'spoiled';

export interface Coordinates {
  x: number; // SVG map coordinates 0 - 1000
  y: number; // SVG map coordinates 0 - 700
}

export interface BestMatchInfo {
  ngoId: string;
  ngoName: string;
  ngoNameHi: string;
  distanceKm: number;
  etaMin: number;
  lossScore: number;
  matchScore: number; // 0 - 100%
  reasons: string[];
}

export interface MealItem {
  id: string;
  dishName: string;
  dishNameHi: string;
  category: 'meal' | 'curry' | 'staple' | 'snack' | 'sweets';
  quantityPlates: number;
  quantityKg: number;
  sourceName: string;
  sourceNameHi: string;
  locationArea: string;
  locationAreaHi: string;
  coords: Coordinates;
  readySinceMinutes: number;
  safeForHours: number;
  preparedAt: string;
  condition: FoodCondition;
  freshnessScore: number; // 0 - 100
  classification: BinClassification;
  classificationConfidence: number;
  classificationReason: string;
  classificationReasonHi: string;
  allergens: string[];
  allergensHi: string[];
  isVeg: boolean;
  aiVerified: boolean;
  claimed: boolean;
  claimedBy?: string;
  claimedAt?: number;
  bestMatch?: BestMatchInfo;
  imageUrl?: string;
  blockHash?: string;
}

export interface NGOEntity {
  id: string;
  name: string;
  nameHi: string;
  type: 'ngo' | 'kitchen' | 'shelter';
  coords: Coordinates;
  capacityDaily: number;
  openHours: string;
  openHoursHi: string;
  distanceFromDtuKm: number;
  etaMin: number;
  contactPerson: string;
  phone: string;
  address: string;
  addressHi: string;
  verified: boolean;
}

export interface Block {
  index: number;
  timestamp: number;
  type: 'GENESIS' | 'CLASSIFICATION' | 'ROUTING' | 'CLAIM' | 'INVENTORY_AUDIT' | 'NFT_MINT';
  payload: Record<string, any>;
  prevHash: string;
  hash: string;
  nonce: number;
  nodeId: string;
}

export type DeliveryStatus = 'PUBLISHED' | 'MATCHED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

export interface DeliveryPackage {
  id: string;
  mealId: string;
  dishName: string;
  dishNameHi: string;
  quantityPlates: number;
  donorName: string;
  donorCoords: Coordinates;
  recipientName: string;
  recipientCoords: Coordinates;
  status: DeliveryStatus;
  nftTokenId: string;
  mintTimestamp: number;
  volunteerName: string;
  vehicleInfo: string;
  distanceKm: number;
  etaMinutes: number;
  progressPercent: number; // 0 - 100
  currentCoords: Coordinates;
  rating?: number;
  feedbackChips?: string[];
  scannedAtDelivery?: boolean;
}

export interface InventoryItem {
  id: string;
  kitchenName: string;
  name: string;
  nameHi: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
  sha256Hash: string;
}

export interface GossipNode {
  id: string;
  name: string;
  type: 'canteen' | 'ngo' | 'community' | 'hub';
  coords: Coordinates;
  lastSynced: string;
  isPulsing: boolean;
}

export interface LossParams {
  W: number; // Waste quantity factor [0 - 1]
  E: number; // Expiration urgency factor [0 - 1]
  M: number; // Distance/Mileage factor [0 - 1]
  T: number; // Transit time factor [0 - 1]
  Q: number; // Quality/Freshness factor [0 - 1]
  R: number; // Recipient reliability/capacity [0 - 1]
  alpha: number; // 0.30
  beta: number;  // 0.25
  gamma: number; // 0.20
  delta: number; // 0.15
  eta: number;   // 0.10
  lambda: number;// 0.05
}

export interface UserProfile {
  role: UserRole;
  name: string;
  organization: string;
  kycVerified: boolean;
  aadhaarLastFour: string;
  points: number;
  language: 'hi' | 'en';
  demoMode: boolean;
  completedDeliveries: number;
  badges: string[];
}
