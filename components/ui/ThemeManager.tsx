'use client';

import { useEffect } from 'react';
import { usePreferences } from '@/hooks/usePreferences';

export function ThemeManager() {
  const { preferences } = usePreferences();

  useEffect(() => {
    // Apply the theme data attribute to the document element or body
    if (preferences.theme) {
      document.documentElement.setAttribute('data-theme', preferences.theme);
    }
  }, [preferences.theme]);

  return null;
}
