import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import initialBd from '../data/bd.json';

interface DataContextType {
  data: typeof initialBd | any;
  loading: boolean;
  /** Reemplaza los datos en memoria (p. ej. tras publicar desde el panel admin). */
  setPublishedData: (newData: any) => void;
}

const DataContext = createContext<DataContextType>({
  data: initialBd,
  loading: false,
  setPublishedData: () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(initialBd);
  const [loading, setLoading] = useState<boolean>(true);
  const setPublishedData = useCallback(
    (newData: any) => setData({ ...initialBd, ...newData }),
    []
  );

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    // Lectura única (sin WebSocket persistente): los datos casi nunca cambian.
    let cancelled = false;
    get(ref(db, 'portfolio/bdData'))
      .then((snapshot) => {
        if (cancelled) return;
        const remoteData = snapshot.exists() ? snapshot.val() : null;
        if (remoteData && typeof remoteData === 'object') {
          // Merge with initialBd structure to prevent undefined property errors
          setData({ ...initialBd, ...remoteData });
        }
      })
      .catch((error) => {
        console.warn("No se pudo cargar desde Firebase Realtime Database. Usando bd.json local:", error);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, setPublishedData }}>
      {children}
    </DataContext.Provider>
  );
};

export const usePortfolioData = () => useContext(DataContext);
