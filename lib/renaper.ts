export const verifyVIN = async (vin: string): Promise<{ valid: boolean; data?: any }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const isValid = vin.length === 17 && vin.startsWith('L');
  
  return {
    valid: isValid,
    data: isValid ? {
      brand: 'BYD',
      model: 'Seagull',
      year: 2023,
      color: 'Black',
      hasLiens: false,
    } : undefined,
  };
};

export const verifyOwnership = async (vin: string, dni: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const calculateVAT = (price: number, isFirstSale: boolean): number => {
  return isFirstSale ? 0 : Math.round(price * 0.21);
};
