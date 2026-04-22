// src/utils.js
export function createPageUrl(page) {
  const map = {
    Home: '/',
    StartTrip: '/start-trip',
    Wellness: '/wellness',
    Settings: '/settings',
    Guardians: '/guardians',
    Features: '/features',
  };
  return map[page] || '/';
}
