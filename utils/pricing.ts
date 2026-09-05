// Shared pricing math for anywhere a renter picks a quantity + date range
// for an asset — the asset details page and the booking/checkout page both
// need to agree on the same total.

// Raw day count between two date strings, floored at 1.
export const computeDays = (start: string, end: string): number => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 1;

    return Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000));
};

// Number of `pricingUnit`s covered by [start, end] — e.g. 3 days, 2 weeks.
// Only used for week/month/semester pricing; day-priced assets use the
// degressive `dailyRateMultiplier` below instead of a flat day count.
export const computeUnits = (start: string, end: string, unit: string): number => {
    const days = computeDays(start, end);

    switch (unit) {
        case "week":
            return Math.max(1, Math.ceil(days / 7));
        case "month":
            return Math.max(1, Math.ceil(days / 30));
        case "semester":
            return 1;
        default:
            return days;
    }
};

// Degressive daily-rate pricing, expressed as % of one day's rate per day of
// the booking: day 1 at 100%, day 2 at 70%, day 3 at 50%, days 4-7 at ~35%
// each, days 8+ at ~20% each. The last two tiers were given as ranges
// (30-40%, 15-25%) — using the midpoint of each. Anything past day 30
// continues at the day-30 rate rather than dropping off a cliff.
const DAILY_RATE_TIERS: { throughDay: number; percentOfDailyRate: number }[] = [
    { throughDay: 1, percentOfDailyRate: 1.0 },
    { throughDay: 2, percentOfDailyRate: 0.7 },
    { throughDay: 3, percentOfDailyRate: 0.5 },
    { throughDay: 7, percentOfDailyRate: 0.35 },
    { throughDay: Infinity, percentOfDailyRate: 0.2 },
];

export const dailyRateMultiplier = (days: number): number => {
    if (days <= 0) return 0;

    let multiplier = 0;
    let remainingDays = days;
    let coveredThroughDay = 0;

    for (const tier of DAILY_RATE_TIERS) {
        if (remainingDays <= 0) break;
        const daysInTier = Math.min(remainingDays, tier.throughDay - coveredThroughDay);
        multiplier += daysInTier * tier.percentOfDailyRate;
        remainingDays -= daysInTier;
        coveredThroughDay = tier.throughDay;
    }

    return multiplier;
};

// Bulk-quantity discount: unlike the daily tiers above, this isn't
// cumulative — the whole order gets whichever bracket its quantity falls
// into, applied as a % of the per-unit rate.
const QUANTITY_RATE_TIERS: { minQty: number; maxQty: number; percentOfRate: number }[] = [
    { minQty: 1, maxQty: 1, percentOfRate: 1.0 },
    { minQty: 2, maxQty: 2, percentOfRate: 0.95 },
    { minQty: 3, maxQty: 5, percentOfRate: 0.9 },
    { minQty: 6, maxQty: 10, percentOfRate: 0.8 },
    { minQty: 11, maxQty: 20, percentOfRate: 0.7 },
    { minQty: 21, maxQty: Infinity, percentOfRate: 0.6 },
];

export const quantityRateMultiplier = (quantity: number): number => {
    const tier = QUANTITY_RATE_TIERS.find((t) => quantity >= t.minQty && quantity <= t.maxQty);
    return tier ? tier.percentOfRate : 1.0;
};

// Full line total for a booking: rate × quantity, with the bulk-quantity
// discount applied, and — for day-priced assets — the degressive daily
// tiering applied on top; week/month/semester pricing uses a flat unit
// count instead, since no tiering was specified for those.
export const computeLineTotal = (
    rate: number,
    quantity: number,
    pricingUnit: string,
    startDate: string,
    endDate: string
): number => {
    const effectiveRate = rate * quantityRateMultiplier(quantity);

    if (pricingUnit === "day") {
        const days = computeDays(startDate, endDate);
        return effectiveRate * quantity * dailyRateMultiplier(days);
    }

    const units = computeUnits(startDate, endDate, pricingUnit);
    return effectiveRate * quantity * units;
};

// Security deposit for the order: the same bulk-quantity tapering as the
// rental rate above, so it doesn't just multiply linearly with quantity —
// e.g. renting 6 of something at the 80%-per-unit bracket holds a deposit
// of 6 × 0.8 × the per-unit deposit, not 6× it outright.
export const computeSecurityDeposit = (baseDeposit: number, quantity: number): number =>
    baseDeposit * quantity * quantityRateMultiplier(quantity);
