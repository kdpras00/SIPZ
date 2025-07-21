export interface ZakatCalculationResult {
  netAmount: number;
  nisabAmount: number;
  isWajib: boolean;
  zakatAmount: number;
  zakatRate: number;
}

export interface PenghasilanInput {
  monthlyIncome: number;
  debt: number;
}

export interface EmasInput {
  goldWeight: number;
  goldPrice: number;
}

export interface PerakInput {
  silverWeight: number;
  silverPrice: number;
}

export interface PerdaganganInput {
  businessAssets: number;
  debt: number;
}

export interface PertanianInput {
  farmOutput: number;
  irrigationType: 'natural' | 'artificial';
}

// Standard nisab values
export const NISAB_VALUES = {
  goldGrams: 85,
  silverGrams: 595,
  goldPricePerGram: 1000000, // Default, should be updated from API
  silverPricePerGram: 15000, // Default, should be updated from API
};

export function calculateZakatPenghasilan(
  input: PenghasilanInput,
  nisabGold: number
): ZakatCalculationResult {
  const yearlyIncome = input.monthlyIncome * 12;
  const yearlyDebt = input.debt * 12;
  const netAmount = yearlyIncome - yearlyDebt;
  
  const isWajib = netAmount >= nisabGold;
  const zakatRate = 0.025; // 2.5%
  const zakatAmount = isWajib ? netAmount * zakatRate : 0;
  
  return {
    netAmount,
    nisabAmount: nisabGold,
    isWajib,
    zakatAmount,
    zakatRate
  };
}

export function calculateZakatEmas(input: EmasInput): ZakatCalculationResult {
  const totalValue = input.goldWeight * input.goldPrice;
  const nisabValue = NISAB_VALUES.goldGrams * input.goldPrice;
  
  const isWajib = input.goldWeight >= NISAB_VALUES.goldGrams;
  const zakatRate = 0.025; // 2.5%
  const zakatAmount = isWajib ? totalValue * zakatRate : 0;
  
  return {
    netAmount: totalValue,
    nisabAmount: nisabValue,
    isWajib,
    zakatAmount,
    zakatRate
  };
}

export function calculateZakatPerak(input: PerakInput): ZakatCalculationResult {
  const totalValue = input.silverWeight * input.silverPrice;
  const nisabValue = NISAB_VALUES.silverGrams * input.silverPrice;
  
  const isWajib = input.silverWeight >= NISAB_VALUES.silverGrams;
  const zakatRate = 0.025; // 2.5%
  const zakatAmount = isWajib ? totalValue * zakatRate : 0;
  
  return {
    netAmount: totalValue,
    nisabAmount: nisabValue,
    isWajib,
    zakatAmount,
    zakatRate
  };
}

export function calculateZakatPerdagangan(
  input: PerdaganganInput,
  nisabGold: number
): ZakatCalculationResult {
  const netAmount = input.businessAssets - input.debt;
  
  const isWajib = netAmount >= nisabGold;
  const zakatRate = 0.025; // 2.5%
  const zakatAmount = isWajib ? netAmount * zakatRate : 0;
  
  return {
    netAmount,
    nisabAmount: nisabGold,
    isWajib,
    zakatAmount,
    zakatRate
  };
}

export function calculateZakatPertanian(input: PertanianInput): ZakatCalculationResult {
  // Nisab for agriculture is 5 wasaq = approximately 653 kg of rice
  // We'll use monetary equivalent
  const nisabPertanian = 20000000; // Rp 20 million equivalent
  
  const isWajib = input.farmOutput >= nisabPertanian;
  
  // Zakat rate depends on irrigation type
  // 10% for natural irrigation (rain), 5% for artificial irrigation
  const zakatRate = input.irrigationType === 'natural' ? 0.1 : 0.05;
  const zakatAmount = isWajib ? input.farmOutput * zakatRate : 0;
  
  return {
    netAmount: input.farmOutput,
    nisabAmount: nisabPertanian,
    isWajib,
    zakatAmount,
    zakatRate
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}
