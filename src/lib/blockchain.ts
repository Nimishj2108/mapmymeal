import { Block } from '../types';

export async function computeSha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createBlockHash(
  index: number,
  timestamp: number,
  type: string,
  payload: Record<string, any>,
  prevHash: string,
  nonce: number,
  nodeId: string
): Promise<string> {
  const rawString = `${index}|${timestamp}|${type}|${JSON.stringify(payload)}|${prevHash}|${nonce}|${nodeId}`;
  return computeSha256(rawString);
}

export async function generateInitialLedger(): Promise<Block[]> {
  const genesisTimestamp = 1774880000000;
  const genesisHash = await createBlockHash(0, genesisTimestamp, 'GENESIS', { message: 'SIH26234 Genesis: Map My Meal DTU Hub Online' }, '0000000000000000000000000000000000000000000000000000000000000000', 108, 'DTU-CENTRAL-HUB');

  const block1Timestamp = genesisTimestamp + 3600000;
  const block1Payload = {
    action: 'INVENTORY_RECONCILIATION',
    kitchen: 'Atal Canteen DTU',
    items: ['Basmati Rice: 120kg', 'Toor Dal: 45kg', 'Atta: 90kg'],
    verifiedBy: 'Chef R. K. Sharma'
  };
  const block1Hash = await createBlockHash(1, block1Timestamp, 'INVENTORY_AUDIT', block1Payload, genesisHash, 241, 'ATAL-CANTEEN-01');

  const block2Timestamp = block1Timestamp + 7200000;
  const block2Payload = {
    mealId: 'seed-meal-1',
    dish: 'Rajma Chawal + Tawa Roti',
    quantity: '40 plates / 14 kg',
    classification: 'DONATE',
    freshnessScore: 94,
    source: 'Atal Canteen (DTU)',
    targetNgo: 'Sewa Foundation Kamla Nagar',
    lossScore: 0.0875
  };
  const block2Hash = await createBlockHash(2, block2Timestamp, 'CLASSIFICATION', block2Payload, block1Hash, 512, 'AI-CLASSIFIER-ENGINE');

  const block3Timestamp = block2Timestamp + 1800000;
  const block3Payload = {
    deliveryId: 'DEL-2026-001',
    nftTokenId: 'MMM-NFT-0x7F2A9B',
    status: 'DELIVERED',
    courier: 'Vikram Sharma (Robin Hood Army)',
    recipient: 'Sewa Foundation Kamla Nagar',
    beneficiariesFed: 42
  };
  const block3Hash = await createBlockHash(3, block3Timestamp, 'NFT_MINT', block3Payload, block2Hash, 889, 'DELHI-ROUTING-NODE');

  return [
    {
      index: 0,
      timestamp: genesisTimestamp,
      type: 'GENESIS',
      payload: { message: 'SIH26234 Genesis: Map My Meal DTU Hub Online' },
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: genesisHash,
      nonce: 108,
      nodeId: 'DTU-CENTRAL-HUB'
    },
    {
      index: 1,
      timestamp: block1Timestamp,
      type: 'INVENTORY_AUDIT',
      payload: block1Payload,
      prevHash: genesisHash,
      hash: block1Hash,
      nonce: 241,
      nodeId: 'ATAL-CANTEEN-01'
    },
    {
      index: 2,
      timestamp: block2Timestamp,
      type: 'CLASSIFICATION',
      payload: block2Payload,
      prevHash: block1Hash,
      hash: block2Hash,
      nonce: 512,
      nodeId: 'AI-CLASSIFIER-ENGINE'
    },
    {
      index: 3,
      timestamp: block3Timestamp,
      type: 'NFT_MINT',
      payload: block3Payload,
      prevHash: block2Hash,
      hash: block3Hash,
      nonce: 889,
      nodeId: 'DELHI-ROUTING-NODE'
    }
  ];
}

export async function addBlockToChain(
  chain: Block[],
  type: Block['type'],
  payload: Record<string, any>,
  nodeId: string = 'NODE-DTU-ACTIVE'
): Promise<Block[]> {
  const lastBlock = chain[chain.length - 1];
  const newIndex = lastBlock.index + 1;
  const timestamp = Date.now();
  const nonce = Math.floor(Math.random() * 900) + 100;
  const hash = await createBlockHash(
    newIndex,
    timestamp,
    type,
    payload,
    lastBlock.hash,
    nonce,
    nodeId
  );

  const newBlock: Block = {
    index: newIndex,
    timestamp,
    type,
    payload,
    prevHash: lastBlock.hash,
    hash,
    nonce,
    nodeId
  };

  return [...chain, newBlock];
}

export async function verifyChainIntegrity(chain: Block[]): Promise<{
  isValid: boolean;
  failedIndex: number | null;
  errorReason: string | null;
}> {
  for (let i = 0; i < chain.length; i++) {
    const current = chain[i];
    
    // Check genesis prevHash
    if (i === 0) {
      if (current.prevHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          isValid: false,
          failedIndex: 0,
          errorReason: 'Genesis block prevHash corrupt'
        };
      }
    } else {
      // Check link with previous block
      const prev = chain[i - 1];
      if (current.prevHash !== prev.hash) {
        return {
          isValid: false,
          failedIndex: i,
          errorReason: `Block #${current.index} prevHash does not match Block #${prev.index} hash!`
        };
      }
    }

    // Recompute hash
    const recomputed = await createBlockHash(
      current.index,
      current.timestamp,
      current.type,
      current.payload,
      current.prevHash,
      current.nonce,
      current.nodeId
    );

    if (recomputed !== current.hash) {
      return {
        isValid: false,
        failedIndex: i,
        errorReason: `Cryptographic SHA-256 signature invalid at Block #${current.index}! Data altered.`
      };
    }
  }

  return { isValid: true, failedIndex: null, errorReason: null };
}
