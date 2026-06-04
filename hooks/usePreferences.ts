import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

export type Preferences = {
  preferredGenres: number[];
  adultContent: boolean;
  contentLanguage: string;
  originalLanguage: string[];
  showRatings: boolean;
};

const defaultPreferences: Preferences = {
  preferredGenres: [],
  adultContent: false,
  contentLanguage: 'en-US',
  originalLanguage: [],
  showRatings: true,
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const loadPrefs = () => {
      const data = storage.get();
      if (data.preferences) {
        setPreferences({ ...defaultPreferences, ...data.preferences });
      }
    };
    
    loadPrefs();
    
    // Listen for cross-component preference updates
    window.addEventListener('preferences-changed', loadPrefs);
    return () => window.removeEventListener('preferences-changed', loadPrefs);
  }, []);

  const updatePreferences = (newPrefs: Partial<Preferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      const data = storage.get();
      data.preferences = updated;
      storage.set(data);
      // Dispatch global event so other components using this hook update immediately
      window.dispatchEvent(new Event('preferences-changed'));
      return updated;
    });
  };

  return { preferences, updatePreferences };
}
