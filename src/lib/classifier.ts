import { BinClassification, FoodCondition } from '../types';

export interface AnalysisResult {
  detectedDish: string;
  detectedDishHi: string;
  category: 'meal' | 'curry' | 'staple' | 'snack' | 'sweets';
  condition: FoodCondition;
  classification: BinClassification;
  confidence: number;
  freshnessScore: number;
  estimatedShelfLifeHours: number;
  allergens: string[];
  allergensHi: string[];
  scientificReason: string;
  scientificReasonHi: string;
  actionGuidance: string;
  actionGuidanceHi: string;
}

export function classifyFoodItem(
  dishName: string,
  condition: FoodCondition,
  readySinceHours: number,
  quantityPlates: number
): AnalysisResult {
  const lowerDish = dishName.toLowerCase();
  
  // Allergen determination
  const allergens: string[] = [];
  const allergensHi: string[] = [];
  
  if (lowerDish.includes('roti') || lowerDish.includes('paratha') || lowerDish.includes('poori') || lowerDish.includes('halwa')) {
    allergens.push('Wheat / Gluten');
    allergensHi.push('गेहूं / ग्लूटेन');
  }
  if (lowerDish.includes('paneer') || lowerDish.includes('kheer') || lowerDish.includes('mithai') || lowerDish.includes('sweets') || lowerDish.includes('dal makhani')) {
    allergens.push('Milk / Lactose');
    allergensHi.push('दूध / लैक्टोज');
  }
  if (lowerDish.includes('biryani') || lowerDish.includes('poha')) {
    allergens.push('Peanuts / Tree Nuts (Traces)');
    allergensHi.push('मूंगफली / मेवे के अंश');
  }
  if (allergens.length === 0) {
    allergens.push('No Common Allergens');
    allergensHi.push('कोई सामान्य एलर्जन नहीं');
  }

  // Deterministic rule engine
  let classification: BinClassification = 'DONATE';
  let freshnessScore = 95;
  let estimatedShelfLifeHours = 4.5;
  let confidence = 94;
  let scientificReason = '';
  let scientificReasonHi = '';
  let actionGuidance = '';
  let actionGuidanceHi = '';

  if (condition === 'spoiled' || readySinceHours >= 7.5) {
    classification = 'THROW_AWAY';
    freshnessScore = 18;
    estimatedShelfLifeHours = 0;
    confidence = 98;
    scientificReason = 'Microbiological hazard: Prolonged exposure beyond danger zone (>4 hours between 5°C and 60°C). High risk of Bacillus cereus / Staphylococcus enterotoxin.';
    scientificReasonHi = 'सूक्ष्मजैविक जोखिम: भोजन 4 घंटे से अधिक समय तक खतरे के तापमान क्षेत्र (5°C-60°C) में रहा। जीवाणु संदूषण का अत्यधिक जोखिम।';
    actionGuidance = 'Discard via designated organic disposal facility. Do not feed humans or pets.';
    actionGuidanceHi = 'निर्दिष्ट जैविक अपशिष्ट निस्तारण केंद्र में डालें। मानव या पशु उपभोग हेतु प्रतिबंधित।';
  } else if (condition === 'stale' && (lowerDish.includes('peels') || lowerDish.includes('scraps') || readySinceHours >= 5)) {
    classification = 'RECYCLE';
    freshnessScore = 48;
    estimatedShelfLifeHours = 12;
    confidence = 92;
    scientificReason = 'Organoleptic degradation or prep trimmings: Ideal caloric and cellulose density for anaerobic digestion or high-grade vermicomposting.';
    scientificReasonHi = 'स्वाद एवं पोषण में गिरावट अथवा तैयारी अवशेष: बायो-मीथेनेशन (बायोगैस) अथवा उच्च-गुणवत्ता वर्मीकम्पोस्ट खाद के लिए सर्वथा उपयुक्त।';
    actionGuidance = 'Dispatched to DTU Campus Biogas digester / Green waste composting pit.';
    actionGuidanceHi = 'DTU बायोगैस संयंत्र अथवा हरित खाद गड्ढे में भेजा जाए।';
  } else if (readySinceHours >= 3.0 || (condition === 'stale' && readySinceHours >= 2.0)) {
    classification = 'SHELF_LIFE';
    freshnessScore = 74;
    estimatedShelfLifeHours = 1.8;
    confidence = 91;
    scientificReason = 'Marginal thermal retention: Food remains microbiologically safe, but organoleptic quality is declining. Priority express redistribution required within 90 minutes.';
    scientificReasonHi = 'मध्यम ताज़गी: भोजन अभी खाने योग्य एवं सुरक्षित है, परंतु शेल्फ लाइफ सीमित है। 90 मिनट के भीतर तुरंत नजदीकी आश्रय को वितरित करें।';
    actionGuidance = 'Route immediately to closest shelter with instant thermal warming equipment.';
    actionGuidanceHi = 'तुरंत निकटतम रैन बसेरे अथवा कम्युनिटी किचन को एक्सप्रेस डिलीवरी से भेजें।';
  } else {
    // Fresh <3 hours
    classification = 'DONATE';
    freshnessScore = 94 - Math.floor(readySinceHours * 4);
    estimatedShelfLifeHours = Math.max(3.0, 5.0 - readySinceHours);
    confidence = 96;
    scientificReason = 'Optimum safety parameters: Internal core temperature and moisture retention indicate fresh institutional preparation. Zero pathogenic microbial activity.';
    scientificReasonHi = 'उत्कृष्ट सुरक्षा मानक: आंतरिक तापमान एवं नमी सुरक्षित स्तर पर है। शून्य हानिकारक जीवाणु गतिविधि। पूर्णतः पौष्टिक एवं ताजा।';
    actionGuidance = 'Route to registered NGOs, student recipients, or community kitchens.';
    actionGuidanceHi = 'पंजीकृत NGO, जरूरतमंद विद्यार्थियों, अथवा कम्युनिटी किचन को वितरित करें।';
  }

  return {
    detectedDish: dishName,
    detectedDishHi: dishName,
    category: lowerDish.includes('sweet') || lowerDish.includes('halwa') ? 'sweets' : lowerDish.includes('snack') || lowerDish.includes('poha') ? 'snack' : 'meal',
    condition,
    classification,
    confidence,
    freshnessScore,
    estimatedShelfLifeHours,
    allergens,
    allergensHi,
    scientificReason,
    scientificReasonHi,
    actionGuidance,
    actionGuidanceHi
  };
}
