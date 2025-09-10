const GAME_MODE_PREF_KEY = 'wicgate_auto_gamemode';

export function useGameModePreference() {
  // Simple check for auto game mode preference
  function hasAutoGameMode(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(GAME_MODE_PREF_KEY) === 'true';
  }

  return {
    hasAutoGameMode
  };
}