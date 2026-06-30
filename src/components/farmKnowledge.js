// ============================================
// FARM KNOWLEDGE BASE
// Yahan naye terms, units, ya jaankari add karo
// Format: simple text mein likho, AI khud samajh lega
// ============================================

export const LAND_UNITS = `
ZAMEEN KE NAAP (Land Units) — Haryana/North India:
- 1 Bigha (Kachha) = 0.25 acre (approx)
- 1 Bigha (Pakka) = 0.625 acre
- 1 Killa (Acre) = 1 acre = 4 Bigha (kachha)
- 1 Kanal = 0.125 acre = 605 gaj
- 1 Marla = 0.00625 acre = 30.25 gaj
- 1 Gaj = 1 square yard
- 1 Hectare = 2.47 acre = 10000 sq meter
- 8th part (1/8 acre) = 0.125 acre
- 1 Guntha = 0.025 acre (South India mein common)
`;

export const CROP_LOCAL_NAMES = `
FASAL KE LOCAL/ALTERNATE NAAM:
- Sarson = Mustard = Raya
- Gehun = Wheat = Kanak
- Chawal = Rice = Dhan = Paddy
- Jau = Barley
- Bajra = Pearl Millet
- Jowar = Sorghum
- Makka = Corn = Maize
- Channa = Gram = Chickpea
- Moong = Green Gram
- Arhar = Tur = Pigeon Pea
- Til = Sesame
- Ganna = Sugarcane = Ikh
- Kapas = Cotton = Rui
- Aloo = Potato
- Pyaaz = Onion
- Tamatar = Tomato
`;

export const FERTILIZER_TERMS = `
KHAD/DAWAI KE TERMS:
- DAP = Di-Ammonium Phosphate (18% N, 46% P)
- Urea = 46% Nitrogen
- MOP = Muriate of Potash (60% K)
- NPK = Nitrogen, Phosphorus, Potassium
- Zinc Sulphate = Zinc ki kami ke liye
- Gypsum = Calcium aur Sulphur ke liye
- Vermicompost = Keechuon se bani organic khad
- Bigha mein dawai ki matra hamesha "per acre" se calculate karo agar bigha diya ho
`;

export const REGIONAL_PHRASES = `
HARYANVI/LOCAL BOLCHAAL KE TERMS:
- "Khet mein paani chadhana" = irrigation karna
- "Fasal pakna" = crop ripen hona
- "Beej dalna/boana" = sowing
- "Katai karna" = harvesting
- "Godi karna" = weeding/hoeing
- "Spray karna" = pesticide/fungicide chidakna
- "Jud jaana" = crop ka sukh jaana (disease se)
- "Pat peela hona" = leaves yellow hona (nutrient deficiency)
`;

// Yeh function sab knowledge ko jodke ek string banata hai
export function getFullKnowledgeBase() {
  return `${LAND_UNITS}\n${CROP_LOCAL_NAMES}\n${FERTILIZER_TERMS}\n${REGIONAL_PHRASES}`;
}