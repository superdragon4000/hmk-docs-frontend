'use client';

import { PropsWithChildren, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { clearAuth, setAuth, setHydrated } from '../store/auth-slice';

const STORAGE_KEY = 'hmk_auth';

function AuthBootstrap() {
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      store.dispatch(setHydrated());
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        accessToken: string;
        refreshToken: string;
        email: string | null;
      };
      store.dispatch(setAuth(parsed));
    } catch {
      store.dispatch(clearAuth());
      localStorage.removeItem(STORAGE_KEY);
    }

    store.dispatch(setHydrated());
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (!state.auth.accessToken || !state.auth.refreshToken) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken: state.auth.accessToken,
          refreshToken: state.auth.refreshToken,
          email: state.auth.email,
        }),
      );
    });

    return unsubscribe;
  }, []);

  return null;
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
