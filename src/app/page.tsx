import Image from 'next/image';
import Link from 'next/link';
import PartsBanner from '../components/parts-banner';

const features = [
  'Каталоги HIDROMEK разных поколений и моделей',
  'Онлайн-доступ после оплаты подписки',
  'Периоды доступа: 1 день и 7 дней',
  'Удобный просмотр PDF из личного кабинета',
];

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-amber-50/40">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800">
            Каталоги спецтехники HIDROMEK
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
            Быстрый доступ к PDF-каталогам для ремонта и подбора запчастей
          </h1>
          <p className="mt-4 text-base text-slate-700 md:text-lg">
            Платформа HMK Docs дает доступ к каталогам для разных моделей экскаваторов и
            экскаваторов-погрузчиков HIDROMEK.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalogs"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Смотреть каталоги
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Создать аккаунт
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
          <Image
            src="/catalog-preview.svg"
            alt="Пример каталога HIDROMEK"
            width={960}
            height={720}
            className="h-auto w-full rounded-2xl"
            priority
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 md:pb-14">
        <PartsBanner />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold text-slate-900">Что внутри</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {features.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
