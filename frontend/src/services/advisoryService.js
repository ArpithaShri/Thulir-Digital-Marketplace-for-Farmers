import { SCHEMES, ADVISORY_MESSAGES } from '../data/advisoryData';

export const getEligibleSchemes = (farmerLocation, farmerCrops) => {
    return SCHEMES.filter(scheme => {
        const matchesState = scheme.eligibleStates.includes('Any') ||
            scheme.eligibleStates.some(state => farmerLocation.includes(state));

        const matchesCrop = scheme.eligibleCrops.includes('Any') ||
            scheme.eligibleCrops.some(crop => farmerCrops.includes(crop.toLowerCase()));

        return matchesState && (scheme.eligibleCrops.includes('Any') || farmerCrops.length > 0 ? matchesCrop : false);
    });
};

export const getRelevantAdvisories = (farmerCrops) => {
    return ADVISORY_MESSAGES.filter(adv => {
        return adv.crop === 'Any' || farmerCrops.includes(adv.crop.toLowerCase());
    });
};
