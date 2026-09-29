import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  MealItem,
  NGOEntity,
  Block,
  DeliveryPackage,
  InventoryItem,
  GossipNode,
  UserProfile
} from '../types';
import { INITIAL_MEALS, SEED_NGOS, INITIAL_INVENTORY, GOSSIP_NODES } from '../lib/seedData';
import { generateInitialLedger, addBlockToChain, verifyChainIntegrity, computeSha256 } from '../lib/blockchain';
import { translations, Language } from '../lib/i18n';

interface AppContextType {
  role: UserRole;
  language: Language;
  t: typeof translations['en'];
  activeTab: 'home' | 'share' | 'track' | 'impact' | 'profile';
  meals: MealItem[];
  ngos: NGOEntity[];
  chain: Block[];
  deliveries: DeliveryPackage[];
  inventory: InventoryItem[];
  gossipNodes: GossipNode[];
  userProfile: UserProfile;
  showSplash: boolean;
  showRolePicker: boolean;
  selectedMealForDetail: MealItem | null;
  routePolylineActive: boolean;
  tamperedState: boolean;
  toastMessage: string | null;
  demoTourStep: number | null; // 1 to 5, or null
  
  // Actions
  setRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: 'home' | 'share' | 'track' | 'impact' | 'profile') => void;
  setSelectedMealForDetail: (meal: MealItem | null) => void;
  setRoutePolylineActive: (active: boolean) => void;
  dismissSplash: () => void;
  closeRolePicker: () => void;
  openRolePicker: () => void;
  claimMeal: (mealId: string) => Promise<void>;
  publishNewMeal: (newMeal: Omit<MealItem, 'id' | 'aiVerified' | 'claimed'>) => Promise<MealItem>;
  advanceDeliveryStatus: (deliveryId: string) => Promise<void>;
  submitDeliveryRating: (deliveryId: string, rating: number, feedbackChips: string[]) => void;
  verifyChain: () => Promise<{ isValid: boolean; failedIndex: number | null; errorReason: string | null }>;
  simulateTampering: () => void;
  restoreChain: () => Promise<void>;
  updateInventoryQuantity: (itemId: string, newQty: number) => Promise<void>;
  verifyKycMock: (lastFour: string) => void;
  resetDemoData: () => Promise<void>;
  triggerTricolorConfetti: () => void;
  setDemoTourStep: (step: number | null) => void;
  toggleDemoSpeed: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEALS: 'mmm_meals_v1',
  CHAIN: 'mmm_chain_v1',
  DELIVERIES: 'mmm_deliveries_v1',
  PROFILE: 'mmm_profile_v1',
  INVENTORY: 'mmm_inventory_v1',
  ONBOARDED: 'mmm_onboarded_v1',
  LANGUAGE: 'mmm_lang_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'share' | 'track' | 'impact' | 'profile'>('home');
  const [language, setLanguageState] = useState<Language>('hi');
  const [role, setRoleState] = useState<UserRole>('donor');
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [ngos] = useState<NGOEntity[]>(SEED_NGOS);
  const [chain, setChain] = useState<Block[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryPackage[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [gossipNodes, setGossipNodes] = useState<GossipNode[]>(GOSSIP_NODES);
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<MealItem | null>(null);
  const [routePolylineActive, setRoutePolylineActive] = useState(false);
  const [tamperedState, setTamperedState] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [demoTourStep, setDemoTourStep] = useState<number | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    role: 'donor',
    name: 'Atal Canteen Manager',
    organization: 'Delhi Technological University (DTU)',
    kycVerified: true,
    aadhaarLastFour: '4092',
    points: 420,
    language: 'hi',
    demoMode: true,
    completedDeliveries: 18,
    badges: ['Anna Daata Gold', 'Zero Waste DTU Hero', 'Circular Champion']
  });

  const t = translations[language];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const triggerTricolorConfetti = () => {
    // Saffron #FF9933, White #FFFFFF, India Green #138808, Navy #000080
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF9933', '#FFFFFF', '#138808', '#000080']
    });
  };

  // Initialize data on mount
  useEffect(() => {
    const initApp = async () => {
      // 1. Language
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
      if (savedLang) setLanguageState(savedLang);

      // 2. Profile & Role
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setUserProfile(parsed);
          setRoleState(parsed.role);
        } catch (e) {
          console.error(e);
        }
      }

      // 3. Meals
      const savedMeals = localStorage.getItem(STORAGE_KEYS.MEALS);
      if (savedMeals) {
        try {
          setMeals(JSON.parse(savedMeals));
        } catch {
          setMeals(INITIAL_MEALS);
        }
      } else {
        setMeals(INITIAL_MEALS);
        localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(INITIAL_MEALS));
      }

      // 4. Chain
      const savedChain = localStorage.getItem(STORAGE_KEYS.CHAIN);
      if (savedChain) {
        try {
          setChain(JSON.parse(savedChain));
        } catch {
          const initialChain = await generateInitialLedger();
          setChain(initialChain);
        }
      } else {
        const initialChain = await generateInitialLedger();
        setChain(initialChain);
        localStorage.setItem(STORAGE_KEYS.CHAIN, JSON.stringify(initialChain));
      }

      // 5. Deliveries
      const savedDeliveries = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      if (savedDeliveries) {
        try {
          setDeliveries(JSON.parse(savedDeliveries));
        } catch {
          seedInitialDelivery();
        }
      } else {
        seedInitialDelivery();
      }

      // 6. Inventory
      const savedInv = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (savedInv) {
        try {
          setInventory(JSON.parse(savedInv));
        } catch {
          setInventory(INITIAL_INVENTORY);
        }
      }

      // Auto-advance splash after 2.6s
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
        const hasOnboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
        if (!hasOnboarded) {
          setShowRolePicker(true);
        }
      }, 2600);

      return () => clearTimeout(splashTimer);
    };

    initApp();
  }, []);

  const seedInitialDelivery = () => {
    const defaultDelivery: DeliveryPackage = {
      id: 'DEL-2026-001',
      mealId: 'meal-001',
      dishName: 'Rajma Chawal + Tawa Roti',
      dishNameHi: 'राजमा चावल + तवा रोटी',
      quantityPlates: 40,
      donorName: 'Atal Canteen (DTU)',
      donorCoords: { x: 200, y: 160 },
      recipientName: 'Sewa Foundation Kamla Nagar',
      recipientCoords: { x: 420, y: 320 },
      status: 'IN_TRANSIT',
      nftTokenId: 'MMM-NFT-0x7F2A9B',
      mintTimestamp: Date.now() - 600000,
      volunteerName: 'Vikram Sharma (Robin Hood Army Delhi)',
      vehicleInfo: 'Hero Electric EV Cargo (DL-1S-AE-4421)',
      distanceKm: 1.8,
      etaMinutes: 4,
      progressPercent: 65,
      currentCoords: { x: 340, y: 260 },
      scannedAtDelivery: false
    };
    setDeliveries([defaultDelivery]);
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify([defaultDelivery]));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    const updated = { ...userProfile, role: newRole };
    setUserProfile(updated);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  };

  const dismissSplash = () => {
    setShowSplash(false);
    const hasOnboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
    if (!hasOnboarded) {
      setShowRolePicker(true);
    }
  };

  const closeRolePicker = () => {
    setShowRolePicker(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  };

  const openRolePicker = () => {
    setShowRolePicker(true);
  };

  const toggleDemoSpeed = () => {
    const updated = { ...userProfile, demoMode: !userProfile.demoMode };
    setUserProfile(updated);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    triggerToast(updated.demoMode ? 'Demo Mode Active: Fast simulated timings' : 'Normal mode enabled');
  };

  // Claiming a meal
  const claimMeal = async (mealId: string) => {
    const targetMeal = meals.find(m => m.id === mealId);
    if (!targetMeal) return;

    // Update meal
    const updatedMeals = meals.map(m =>
      m.id === mealId ? { ...m, claimed: true, claimedBy: userProfile.name, claimedAt: Date.now() } : m
    );
    setMeals(updatedMeals);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(updatedMeals));

    // Create unique NFT Token ID
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const nftTokenId = `MMM-NFT-0x${randomHex}`;

    // Add block to chain
    const claimBlockPayload = {
      action: 'MEAL_CLAIM_CONFIRMED',
      mealId: targetMeal.id,
      dish: targetMeal.dishName,
      quantityPlates: targetMeal.quantityPlates,
      donor: targetMeal.sourceName,
      claimedBy: userProfile.name,
      targetRecipient: targetMeal.bestMatch?.ngoName || 'Sewa Foundation Kamla Nagar',
      nftTokenId
    };

    const newChain = await addBlockToChain(chain, 'CLAIM', claimBlockPayload, 'DTU-NODE-CLAIM');
    setChain(newChain);
    localStorage.setItem(STORAGE_KEYS.CHAIN, JSON.stringify(newChain));

    // Create delivery package
    const recipientNgo = ngos.find(n => n.id === targetMeal.bestMatch?.ngoId) || ngos[0];
    const newDelivery: DeliveryPackage = {
      id: `DEL-2026-${Math.floor(100 + Math.random() * 900)}`,
      mealId: targetMeal.id,
      dishName: targetMeal.dishName,
      dishNameHi: targetMeal.dishNameHi,
      quantityPlates: targetMeal.quantityPlates,
      donorName: targetMeal.sourceName,
      donorCoords: targetMeal.coords,
      recipientName: recipientNgo.name,
      recipientCoords: recipientNgo.coords,
      status: 'MATCHED',
      nftTokenId,
      mintTimestamp: Date.now(),
      volunteerName: 'Vikram Sharma (Robin Hood Army Delhi)',
      vehicleInfo: 'Hero Electric EV Cargo (DL-1S-AE-4421)',
      distanceKm: targetMeal.bestMatch?.distanceKm || 1.8,
      etaMinutes: targetMeal.bestMatch?.etaMin || 6,
      progressPercent: 15,
      currentCoords: targetMeal.coords,
      scannedAtDelivery: false
    };

    const updatedDeliveries = [newDelivery, ...deliveries];
    setDeliveries(updatedDeliveries);
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(updatedDeliveries));

    // Award loyalty points
    const updatedProfile = {
      ...userProfile,
      points: userProfile.points + 25,
      completedDeliveries: userProfile.completedDeliveries + 1
    };
    setUserProfile(updatedProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));

    setSelectedMealForDetail(null);
    triggerTricolorConfetti();
    triggerToast(`${language === 'hi' ? 'भोजन आरक्षित! NFT टोकन जारी: ' : 'Meal Claimed! NFT Minted: '} ${nftTokenId}`);
    
    // Switch to Track tab to follow delivery
    setTimeout(() => {
      setActiveTab('track');
    }, 600);
  };

  // Publish new surplus meal
  const publishNewMeal = async (newMealData: Omit<MealItem, 'id' | 'aiVerified' | 'claimed'>): Promise<MealItem> => {
    const mealId = `meal-${Date.now().toString().slice(-4)}`;
    const fullMeal: MealItem = {
      ...newMealData,
      id: mealId,
      aiVerified: true,
      claimed: false
    };

    const updatedMeals = [fullMeal, ...meals];
    setMeals(updatedMeals);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(updatedMeals));

    // Add block to chain
    const classificationPayload = {
      action: 'SURPLUS_PUBLISHED_AND_CLASSIFIED',
      mealId: fullMeal.id,
      dish: fullMeal.dishName,
      quantityPlates: fullMeal.quantityPlates,
      quantityKg: fullMeal.quantityKg,
      classification: fullMeal.classification,
      freshnessScore: fullMeal.freshnessScore,
      lossScore: fullMeal.bestMatch?.lossScore || 0.0875,
      allocatedRecipient: fullMeal.bestMatch?.ngoName || 'Sewa Foundation Kamla Nagar',
      source: fullMeal.sourceName
    };

    const newChain = await addBlockToChain(chain, 'CLASSIFICATION', classificationPayload, 'NODE-DTU-DONOR');
    setChain(newChain);
    localStorage.setItem(STORAGE_KEYS.CHAIN, JSON.stringify(newChain));

    // Award +50 points
    const updatedProfile = {
      ...userProfile,
      points: userProfile.points + 50
    };
    setUserProfile(updatedProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));

    // Animate gossip node pulse
    setGossipNodes(prev =>
      prev.map(n => ({
        ...n,
        isPulsing: true,
        lastSynced: 'Just now'
      }))
    );

    triggerTricolorConfetti();
    triggerToast(language === 'hi' ? 'भोजन नक्शे पर प्रकाशित! +50 अंक प्राप्त हुए 🎉' : 'Meal published to map & ledger! +50 pts awarded 🎉');

    return fullMeal;
  };

  // Advance delivery status
  const advanceDeliveryStatus = async (deliveryId: string) => {
    const target = deliveries.find(d => d.id === deliveryId);
    if (!target) return;

    let nextStatus: DeliveryPackage['status'] = target.status;
    let nextProgress = target.progressPercent;
    let nextCoords = target.currentCoords;

    if (target.status === 'PUBLISHED') {
      nextStatus = 'MATCHED';
      nextProgress = 25;
    } else if (target.status === 'MATCHED') {
      nextStatus = 'PICKED_UP';
      nextProgress = 45;
    } else if (target.status === 'PICKED_UP') {
      nextStatus = 'IN_TRANSIT';
      nextProgress = 75;
      nextCoords = {
        x: Math.round((target.donorCoords.x + target.recipientCoords.x) / 2),
        y: Math.round((target.donorCoords.y + target.recipientCoords.y) / 2)
      };
    } else if (target.status === 'IN_TRANSIT') {
      nextStatus = 'DELIVERED';
      nextProgress = 100;
      nextCoords = target.recipientCoords;
    }

    const updatedDeliveries = deliveries.map(d =>
      d.id === deliveryId
        ? {
            ...d,
            status: nextStatus,
            progressPercent: nextProgress,
            currentCoords: nextCoords,
            scannedAtDelivery: nextStatus === 'DELIVERED'
          }
        : d
    );

    setDeliveries(updatedDeliveries);
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(updatedDeliveries));

    if (nextStatus === 'DELIVERED') {
      // Create delivered block on blockchain
      const deliveredBlockPayload = {
        action: 'DELIVERY_FULFILLED_PROOF',
        deliveryId: target.id,
        nftTokenId: target.nftTokenId,
        recipient: target.recipientName,
        completedAt: Date.now(),
        verifiedStatus: 'DELIVERED_VERIFIED_OTP'
      };
      const newChain = await addBlockToChain(chain, 'NFT_MINT', deliveredBlockPayload, 'DELHI-ROUTING-NODE');
      setChain(newChain);
      localStorage.setItem(STORAGE_KEYS.CHAIN, JSON.stringify(newChain));

      triggerTricolorConfetti();
      triggerToast(language === 'hi' ? 'भोजन सुरक्षित रूप से वितरित! NFT सत्यापित ✓' : 'Meal safely delivered! NFT Proof Verified ✓');
    }
  };

  const submitDeliveryRating = (deliveryId: string, rating: number, feedbackChips: string[]) => {
    const updated = deliveries.map(d =>
      d.id === deliveryId ? { ...d, rating, feedbackChips } : d
    );
    setDeliveries(updated);
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(updated));

    const updatedProfile = {
      ...userProfile,
      points: userProfile.points + 25
    };
    setUserProfile(updatedProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));

    triggerToast(language === 'hi' ? 'फीडबैक सबमिट हुआ! +25 अंक प्राप्त' : 'Feedback submitted! +25 pts added');
  };

  // Blockchain integrity verification
  const verifyChain = async () => {
    return verifyChainIntegrity(chain);
  };

  // Simulate tampering
  const simulateTampering = () => {
    if (chain.length < 3) return;
    const tampered = chain.map((block, idx) => {
      if (idx === 2) {
        return {
          ...block,
          payload: {
            ...block.payload,
            dish: 'TAMPERED: Injected Unverified Food Scraps',
            classification: 'DONATE_MALICIOUS_OVERRIDE'
          }
        };
      }
      return block;
    });

    setChain(tampered);
    setTamperedState(true);
    triggerToast(language === 'hi' ? 'ब्लॉक #2 में अनधिकृत बदलाव किया गया! सत्यापन चलाएं।' : 'Block #2 artificially modified! Click Verify Chain.');
  };

  const restoreChain = async () => {
    const pristineChain = await generateInitialLedger();
    setChain(pristineChain);
    localStorage.setItem(STORAGE_KEYS.CHAIN, JSON.stringify(pristineChain));
    setTamperedState(false);
    triggerToast(language === 'hi' ? 'बहीखाता पुनर्स्थापित! ब्लॉकचेन वैध है ✓' : 'Ledger restored! Blockchain is valid ✓');
  };

  // Inventory update
  const updateInventoryQuantity = async (itemId: string, newQty: number) => {
    const updated = await Promise.all(
      inventory.map(async item => {
        if (item.id === itemId) {
          const newHash = await computeSha256(`${item.kitchenName}-${item.name}-${newQty}-${Date.now()}`);
          return {
            ...item,
            quantity: newQty,
            lastUpdated: 'Just now',
            sha256Hash: newHash.substring(0, 32)
          };
        }
        return item;
      })
    );

    setInventory(updated);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));

    // Record audit block on blockchain
    const targetItem = updated.find(i => i.id === itemId);
    if (targetItem) {
      const newChain = await addBlockToChain(chain, 'INVENTORY_AUDIT', {
        action: 'INVENTORY_STOCK_UPDATE',
        kitchen: targetItem.kitchenName,
        item: targetItem.name,
        newQty,
        hash: targetItem.sha256Hash
      }, 'ATAL-CANTEEN-01');
      setChain(newChain);
      localStorage.setItem(STORAGE_KEYS.CHAIN, JSON.stringify(newChain));
    }

    triggerToast(language === 'hi' ? 'इन्वेंटरी अपडेट एवं नया SHA-256 हैश दर्ज' : 'Inventory updated & cryptographic hash sealed');
  };

  const verifyKycMock = (lastFour: string) => {
    const updated = {
      ...userProfile,
      kycVerified: true,
      aadhaarLastFour: lastFour || '8832',
      points: userProfile.points + 50
    };
    setUserProfile(updated);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    triggerToast(language === 'hi' ? 'आधार KYC सफलतापूर्वक सत्यापित! +50 अंक' : 'Aadhaar KYC successfully verified! +50 pts');
  };

  const resetDemoData = async () => {
    localStorage.clear();
    setMeals(INITIAL_MEALS);
    const initialChain = await generateInitialLedger();
    setChain(initialChain);
    seedInitialDelivery();
    setInventory(INITIAL_INVENTORY);
    setTamperedState(false);
    setRoleState('donor');
    setUserProfile({
      role: 'donor',
      name: 'Atal Canteen Manager',
      organization: 'Delhi Technological University (DTU)',
      kycVerified: true,
      aadhaarLastFour: '4092',
      points: 420,
      language: 'hi',
      demoMode: true,
      completedDeliveries: 18,
      badges: ['Anna Daata Gold', 'Zero Waste DTU Hero', 'Circular Champion']
    });
    triggerToast(language === 'hi' ? 'डेमो डेटा मूल स्थिति में रीसेट हो गया!' : 'Demo data reset to pristine state!');
  };

  // Simulated auto-movement for demo mode in deliveries
  useEffect(() => {
    if (!userProfile.demoMode) return;
    const interval = setInterval(() => {
      setDeliveries(prev =>
        prev.map(delivery => {
          if (delivery.status === 'IN_TRANSIT') {
            const nextProgress = Math.min(100, delivery.progressPercent + 8);
            if (nextProgress >= 100) {
              return {
                ...delivery,
                status: 'DELIVERED',
                progressPercent: 100,
                currentCoords: delivery.recipientCoords,
                scannedAtDelivery: true
              };
            }
            // Interpolate position
            const ratio = nextProgress / 100;
            const curX = Math.round(delivery.donorCoords.x + (delivery.recipientCoords.x - delivery.donorCoords.x) * ratio);
            const curY = Math.round(delivery.donorCoords.y + (delivery.recipientCoords.y - delivery.donorCoords.y) * ratio);
            return {
              ...delivery,
              progressPercent: nextProgress,
              currentCoords: { x: curX, y: curY }
            };
          }
          return delivery;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [userProfile.demoMode]);

  return (
    <AppContext.Provider
      value={{
        role,
        language,
        t,
        activeTab,
        meals,
        ngos,
        chain,
        deliveries,
        inventory,
        gossipNodes,
        userProfile,
        showSplash,
        showRolePicker,
        selectedMealForDetail,
        routePolylineActive,
        tamperedState,
        toastMessage,
        demoTourStep,
        setRole,
        setLanguage,
        setActiveTab,
        setSelectedMealForDetail,
        setRoutePolylineActive,
        dismissSplash,
        closeRolePicker,
        openRolePicker,
        claimMeal,
        publishNewMeal,
        advanceDeliveryStatus,
        submitDeliveryRating,
        verifyChain,
        simulateTampering,
        restoreChain,
        updateInventoryQuantity,
        verifyKycMock,
        resetDemoData,
        triggerTricolorConfetti,
        setDemoTourStep,
        toggleDemoSpeed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
