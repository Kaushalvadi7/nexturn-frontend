/**
 * Country mapping utilities for converting between country names and ISO codes
 * Used to map backend canonical country names to ISO codes for flag rendering
 */

import { countryOptions } from "../constants/countryOptions";

// Build a case-insensitive lookup map from country name to ISO code
const countryNameToCodeMap = countryOptions.reduce((acc, country) => {
  const nameLower = country.name.toLowerCase();
  acc[nameLower] = country.code;
  return acc;
}, {});

/**
 * Convert a country name to its ISO alpha-2 code (uppercase)
 * Returns null if the country name is not found
 *
 * @param {string} countryName - The country name (e.g., "United States", "India")
 * @returns {string|null} - ISO alpha-2 code (e.g., "US", "IN") or null
 */
export const getCountryCodeFromName = (countryName) => {
  if (!countryName || typeof countryName !== "string") {
    return null;
  }

  const trimmed = countryName.trim();
  if (!trimmed) {
    return null;
  }

  const lower = trimmed.toLowerCase();
  const code = countryNameToCodeMap[lower];

  return code ? code.toUpperCase() : null;
};

/**
 * Get the flag CDN URL for a given country name
 * Uses flagcdn.com for reliable flag images
 *
 * @param {string} countryName - The country name (e.g., "India", "Germany")
 * @param {string} size - Size variant: 'w20' (20px), 'w40' (40px), 'w80' (80px), 'w160' (160px), 'w320' (320px)
 * @returns {string|null} - Flag image URL or null if country not found
 */
export const getFlagUrlFromName = (countryName, size = "w40") => {
  const code = getCountryCodeFromName(countryName);
  if (!code) {
    return null;
  }

  // flagcdn.com provides reliable, free flag images
  // Format: https://flagcdn.com/{size}/{code}.png
  return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
};

/**
 * Check if a country name is valid and can be mapped to a flag
 *
 * @param {string} countryName - The country name to validate
 * @returns {boolean} - True if the country name maps to a known ISO code
 */
export const isValidCountryName = (countryName) => {
  return getCountryCodeFromName(countryName) !== null;
};
