import { useCallback } from 'react';
import { clearCache } from './useDataCache';

// Hook para prefetch de dados - carrega dados antes que sejam necessários
export function usePrefetch() {
  const prefetchData = useCallback(async (key: string, fetchFunction: () => Promise<any>) => {
    try {
      // Usar requestAnimationFrame para não bloquear a UI
      requestAnimationFrame(async () => {
        await fetchFunction();
      });
    } catch (error) {
      console.warn(`Prefetch failed for ${key}:`, error);
    }
  }, []);

  return {
    prefetchData,
    clearCache
  };
}