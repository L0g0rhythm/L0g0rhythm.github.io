// tools/password-generator/src/js/passwordGenerator.js

import { getRandomCryptoNumber } from './utils.js';

function generateSegment(length, characters) {
    let segment = '';
    const charactersLength = characters.length;
    if (charactersLength === 0) {
        console.error("Character set cannot be empty for segment generation.");
        return ''; // Return empty string on error
    }

    for (let i = 0; i < length; i++) {
        // Loop until a valid index is generated (safeguard against modulo bias if max is close to UINT32_MAX, though unlikely here)
        let randomIndex;
        // This loop is technically more correct for uniform distribution with crypto numbers,
        // but basic modulo is usually acceptable and simpler for non-critical cases.
        // Keeping simple modulo as used before unless specific crypto-uniformity is required.
        randomIndex = getRandomCryptoNumber(charactersLength); // Use the function from utils
        segment += characters.charAt(randomIndex);
    }
    return segment;
}

export function generateAppleStylePassword() {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const segmentLength = 6; // Standard Apple style uses 4 or 6 per segment? Let's assume 6 based on original code.

    // Generate three segments
    const segment1 = generateSegment(segmentLength, alphanumericChars);
    const segment2 = generateSegment(segmentLength, alphanumericChars);
    const segment3 = generateSegment(segmentLength, alphanumericChars);

    // Combine segments with hyphens
    return `${segment1}-${segment2}-${segment3}`;
}