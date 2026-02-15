'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { clearAuth } from '../store/auth-slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function SiteHeader() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onLogout = async () => {
    try {
      if (auth.accessToken) {
        await api.logout(auth.accessToken);
      }
    } catch {
      // ignore network errors on logout
    } finally {
      dispatch(clearAuth());
      router.push('/');
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold text-slate-900">
          HMK Docs
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <Link href="/catalogs" className="rounded px-3 py-2 text-slate-700 hover:bg-slate-100">
            Каталоги
          </Link>
          {!auth.accessToken ? (
            <>
              <Link href="/login" className="rounded px-3 py-2 text-slate-700 hover:bg-slate-100">
                Вход
              </Link>
              <Link
                href="/register"
                className="rounded bg-amber-500 px-3 py-2 text-slate-950 hover:bg-amber-400"
              >
                Регистрация
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="rounded bg-slate-900 px-3 py-2 text-white hover:bg-slate-700"
            >
              Выйти
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
