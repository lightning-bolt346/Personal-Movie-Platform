'use client';
import { useEffect } from 'react';
import { usePreferences } from '@/hooks/usePreferences';

const COUNTRY_TO_LANG: Record<string, string[]> = {
  IN: ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'mr', 'gu', 'pa'], // India -> Major languages
  FR: ['fr'], // France -> French
  ES: ['es'], // Spain -> Spanish
  DE: ['de'], // Germany -> German
  JP: ['ja'], // Japan -> Japanese
  KR: ['ko'], // Korea -> Korean
  CN: ['zh'], // China -> Chinese
  AE: ['ar'], // UAE -> Arabic
  IT: ['it'], // Italy -> Italian
  RU: ['ru'], // Russia -> Russian
  BR: ['pt'], // Brazil -> Portuguese
  PT: ['pt'], // Portugal -> Portuguese
  MX: ['es'], // Mexico -> Spanish
  AR: ['es'], // Argentina -> Spanish
  CO: ['es'], // Colombia -> Spanish
  SA: ['ar'], // Saudi Arabia -> Arabic
  EG: ['ar'], // Egypt -> Arabic
  ID: ['id'], // Indonesia -> Indonesian
  TH: ['th'], // Thailand -> Thai
  VN: ['vi'], // Vietnam -> Vietnamese
  TR: ['tr'], // Turkey -> Turkish
  NL: ['nl'], // Netherlands -> Dutch
  PL: ['pl'], // Poland -> Polish
};

import { storage } from '@/lib/storage';

export function useAutoLocation() {
  const { updatePreferences } = usePreferences();

  useEffect(() => {
    // Check actual local storage to avoid race conditions with hydration
    const savedPrefs = storage.get()?.preferences;
    if (typeof window === 'undefined' || savedPrefs?.locationAutoDetected) {
      return;
    }

    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Failed to fetch location');
        const data = await res.json();
        
        // Double check in case it was updated while fetching
        if (storage.get()?.preferences?.locationAutoDetected) return;

        const country = data.country_code || 'US';
        const nativeLangs = COUNTRY_TO_LANG[country] || [];
        
        const originalLanguage = ['en'];
        nativeLangs.forEach(lang => {
          if (lang !== 'en' && !originalLanguage.includes(lang)) {
            originalLanguage.push(lang);
          }
        });

        updatePreferences({
          country: country,
          originalLanguage: originalLanguage,
          preferredGenres: [], // Clear any default genres
          locationAutoDetected: true,
        });

      } catch (error) {
        console.error('Auto-location failed:', error);
        if (storage.get()?.preferences?.locationAutoDetected) return;
        // On failure, default to US and English
        updatePreferences({
          country: 'US',
          originalLanguage: ['en'],
          preferredGenres: [],
          locationAutoDetected: true,
        });
      }
    };

    detectLocation();
  }, [updatePreferences]);
}
