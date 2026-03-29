export function calculateImpactFromRate(amountCents: number, dollarsPerPet: number) {
  if (!dollarsPerPet || dollarsPerPet <= 0) {
    return 0;
  }

  return Math.floor(amountCents / 100 / dollarsPerPet);
}
