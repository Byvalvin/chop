// utils/countryUtils.js

const countryNameToCode = {
  // African Countries
  uganda: 'ug',
  nigeria: 'ng',
  'south africa': 'za',
  ghana: 'gh',
  kenya: 'ke',
  egypt: 'eg',
  ethiopia: 'et',  // Removed duplicate
  morocco: 'ma',
  tanzania: 'tz',
  mali: 'ml',
  algeria: 'dz',
  senegal: 'sn',
  zimbabwe: 'zw',
  sudan: 'sd',
  rwanda: 'rw',
  cameroon: 'cm',
  'ivory coast': 'ci',
  libya: 'ly',
  congo: 'cg',
  mozambique: 'mz',
  gambia: 'gm',
  burundi: 'bi',
  'burkina faso': 'bf',
  malawi: 'mw',
  angola: 'ao',
  botswana: 'bw',
  benin: 'bj',
  lesotho: 'ls',
  'sierra leone': 'sl',
  // Add more African countries here

  // Caribbean Countries
  jamaica: 'jm',
  'trinidad and tobago': 'tt',
  cuba: 'cu',
  haiti: 'ht',
  barbados: 'bb',
  dominica: 'dm',
  'saint lucia': 'lc',
  grenada: 'gd',
  'saint kitts and nevis': 'kn',
  bahamas: 'bs',
  'dominican republic': 'do',
  'saint vincent and the grenadines': 'vc',
  aruba: 'aw',
  suriname: 'sr',
  // Add more Caribbean countries here
};

export const getCountryCode = (name) => {
  if (!name) return null;
  // Return the country code based on name (or null if not found)
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
