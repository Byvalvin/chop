// utils/countryUtils.js

const countryNameToCode = {
    uganda: 'ug',
    jamaica: 'jm',
    mexico: 'mx',
    'united states of america': 'us',
    nigeria: 'ng',
    india: 'in',
    italy: 'it',
    // Add more...
  };
  
  export const getCountryCode = (name) => {
    if (!name) return null;
    return countryNameToCode[name.toLowerCase()] || null;
  };
  
  export const getRegionEmoji = (region) => {
    if (!region) return '🌐';
  
    const lower = region.toLowerCase();
  
    // Caribbean-specific handling
    if (lower.includes('caribbean') || lower.includes('jamaica') || lower.includes('haiti') || lower.includes('trinidad')) {
      return '🌎'; // Tied to Americas
    }
  
    if (lower.includes('africa')) return '🌍';
    if (lower.includes('europe')) return '🌍';
    if (lower.includes('asia') || lower.includes('oceania') || lower.includes('australia')) return '🌏';
    if (lower.includes('america')) return '🌎';
  
    return '🗺️'; // fallback
  };
  