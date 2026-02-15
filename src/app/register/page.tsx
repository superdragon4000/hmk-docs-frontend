'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api } from '../../lib/api';
import { setAuth } from '../../store/auth-slice';
import { useAppDispatch } from '../../store/hooks';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tokens = await api.register(email, password);
      dispatch(setAuth({ ...tokens, email }));
      router.push('/catalogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10 md:py-16">
      <h1 className="text-2xl font-bold text-slate-900">Регистрация</h1>
      <p className="mt-2 text-sm text-slate-600">Создайте аккаунт для доступа к каталогам.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900 disabled:opacity-60"
        >
          {loading ? 'Создание...' : 'Создать аккаунт'}
        </button>

        <p className="text-sm text-slate-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="font-semibold text-amber-700 underline">
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
}
