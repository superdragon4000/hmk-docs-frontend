'use client';

import Image from 'next/image';

const partsStoreUrl =
  process.env.NEXT_PUBLIC_PARTS_STORE_URL ?? 'https://example.com/hidromek-parts';

export default function PartsBanner() {
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
      <div className="grid gap-4 p-4 md:grid-cols-[1.5fr_1fr] md:items-center md:p-5">
        <div>
          <p className="font-semibold text-slate-900 md:text-lg">Нужны запчасти для HIDROMEK?</p>
          <p className="mt-1 text-sm text-slate-800 md:text-base">
            Перейдите в магазин оригинальных и аналоговых запчастей для разных поколений и моделей
            техники.
          </p>
          <a
            href={partsStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Перейти в магазин запчастей
          </a>
        </div>

        <div className="rounded-xl border border-amber-200 bg-white p-2">
          <Image
            src="/parts-banner-visual.svg"
            alt="Запчасти HIDROMEK"
            width={960}
            height={260}
            className="h-auto w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
