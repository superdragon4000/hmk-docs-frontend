'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PartsBanner from '../../components/parts-banner';
import { api } from '../../lib/api';
import { CatalogItem, SubscriptionStatus } from '../../lib/types';
import { setCatalogs } from '../../store/catalogs-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function CatalogsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const catalogs = useAppSelector((state) => state.catalogs.items);

  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [activeCatalogTitle, setActiveCatalogTitle] = useState<string | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfjsRef = useRef<any>(null);

  const canOpenCatalogs = subscription?.active === true;

  useEffect(() => {
    const load = async () => {
      if (!auth.hydrated) {
        return;
      }

      if (!auth.accessToken) {
        router.push('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [catalogData, subscriptionData] = await Promise.all([
          api.catalogs(auth.accessToken),
          api.subscription(auth.accessToken),
        ]);

        dispatch(setCatalogs(catalogData));
        setSubscription(subscriptionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [auth.accessToken, auth.hydrated, dispatch, router]);

  useEffect(() => {
    const render = async () => {
      if (!pdfDoc || !canvasRef.current) {
        return;
      }

      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: zoom * 1.3 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    };

    void render();
  }, [pdfDoc, currentPage, zoom]);

  const buyPlan = async (plan: 'DAY' | 'WEEK') => {
    if (!auth.accessToken) {
      return;
    }

    try {
      const payment = await api.createPayment(auth.accessToken, plan);
      if (payment.confirmationUrl) {
        window.location.href = payment.confirmationUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания платежа');
    }
  };

  const openCatalog = async (catalog: CatalogItem) => {
    if (!auth.accessToken) {
      return;
    }

    if (!canOpenCatalogs) {
      setError('Подписка не активна');
      return;
    }

    setViewerLoading(true);
    setError(null);

    try {
      const link = await api.catalogAccessLink(auth.accessToken, catalog.id);
      const response = await fetch(link.url, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить PDF');
      }

      const buffer = await response.arrayBuffer();
      if (!pdfjsRef.current) {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        pdfjsRef.current = pdfjs;
      }

      const loadingTask = pdfjsRef.current.getDocument({ data: new Uint8Array(buffer) });
      const doc = await loadingTask.promise;

      setPdfDoc(doc);
      setCurrentPage(1);
      setTotalPages(doc.numPages);
      setZoom(1);
      setActiveCatalogTitle(catalog.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Нет доступа к каталогу');
    } finally {
      setViewerLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:py-12">
      <h1 className="text-3xl font-black text-slate-900">Каталоги HIDROMEK</h1>

      <PartsBanner />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold text-slate-900">Подписка</h2>
        <p className="mt-2 text-sm text-slate-700">
          {subscription?.active
            ? `Активна до: ${new Date(subscription.endsAt ?? '').toLocaleString('ru-RU')}`
            : 'Подписка не активна'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => buyPlan('DAY')}
            className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900"
          >
            Купить на 1 день
          </button>
          <button
            type="button"
            onClick={() => buyPlan('WEEK')}
            className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
          >
            Купить на 7 дней
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold text-slate-900">Список каталогов</h2>

        {!auth.hydrated ? <p className="mt-3 text-sm text-slate-600">Проверка сессии...</p> : null}
        {loading && auth.hydrated ? <p className="mt-3 text-sm text-slate-600">Загрузка...</p> : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {catalogs.map((catalog: CatalogItem) => (
            <article key={catalog.id} className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-lg font-semibold text-slate-900">{catalog.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{catalog.description}</p>
              <button
                type="button"
                onClick={() => openCatalog(catalog)}
                disabled={!canOpenCatalogs || loading}
                className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Открыть во встроенном просмотре
              </button>
            </article>
          ))}
        </div>
      </section>

      {(viewerLoading || pdfDoc) && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              {activeCatalogTitle ? `Просмотр: ${activeCatalogTitle}` : 'Просмотр PDF'}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                type="button"
                disabled={!pdfDoc || currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
              >
                Назад
              </button>
              <span className="min-w-20 text-center text-slate-700">
                {totalPages ? `${currentPage} / ${totalPages}` : '-'}
              </span>
              <button
                type="button"
                disabled={!pdfDoc || currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
              >
                Вперед
              </button>
              <button
                type="button"
                disabled={!pdfDoc}
                onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
                className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
              >
                A-
              </button>
              <button
                type="button"
                disabled={!pdfDoc}
                onClick={() => setZoom((z) => Math.min(2, Number((z + 0.1).toFixed(2))))}
                className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
              >
                A+
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-3">
            {viewerLoading ? <p className="text-sm text-slate-600">Загрузка PDF...</p> : null}
            <canvas ref={canvasRef} className="mx-auto max-w-full rounded bg-white shadow" />
          </div>
        </section>
      )}
    </main>
  );
}