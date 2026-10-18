import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import osh from "@/assets/dish-osh.jpg";
import somsa from "@/assets/dish-somsa.jpg";
import shashlik from "@/assets/dish-shashlik.jpg";
import manti from "@/assets/dish-manti.jpg";
import norin from "@/assets/dish-norin.jpg";
import kabob from "@/assets/dish-kabob.jpg";
import mastava from "@/assets/dish-mastava.jpg";
import dimlama from "@/assets/dish-dimlama.jpg";

const DISHES = [
  { name: "Osh", img: osh, tag: "Eng mashhur taom", text: "Guruch, sabzi, mol go'shti va zirvak bilan qozonda damlangan o'zbek oshi. Dasturxonimiz shohi." },
  { name: "Somsa", img: somsa, tag: "Tandirdan issiq", text: "Qatlama xamir ichida mayda to'g'ralgan go'sht va piyoz. Tandirda qizarguncha pishiriladi." },
  { name: "Shashlik", img: shashlik, tag: "Ko'mirda pishgan", text: "Ziravorlarda marinadlangan qo'y go'shti, cho'g'da pishirilib, piyoz bilan tortiladi." },
  { name: "Manti", img: manti, tag: "Bug'da pishgan", text: "Yupqa xamirga o'ralgan go'sht va dumba. Qaymoq yoki suzma bilan tortiladi." },
  { name: "Norin", img: norin, tag: "Toshkent ta'mi", text: "Ingichka to'g'ralgan qo'lbola ugra va qazi go'shti — sovuq holda tortiladigan nozik taom." },
  { name: "Qozon kabob", img: kabob, tag: "Qozonda qovurilgan", text: "Qozonda qovurilgan yumshoq go'sht va oltin rang kartoshka, ustidan piyoz halqalari." },
  { name: "Mastava", img: mastava, tag: "Issiq sho'rva", text: "Guruch, go'sht va sabzavotli quyuq sho'rva. Qatiq va ko'katlar bilan tortiladi." },
  { name: "Dimlama", img: dimlama, tag: "Sekin damlangan", text: "Go'sht, karam, kartoshka va sabzavotlar o'z sharbatida soatlab damlanadi." },
];

export function DishCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = DISHES.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4000);
    return () => clearInterval(t);
  }, [paused, n]);

  const d = DISHES[i]!;
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <h2 className="mb-6 text-3xl font-semibold">Bizning taomlar</h2>
      <div
        className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div key={i} className="grid items-center gap-8 md:grid-cols-2 animate-rise">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <UtensilsCrossed className="h-7 w-7" />
            </span>
            <h3 className="mt-6 text-3xl font-bold md:text-4xl">{d.name}</h3>
            <p className="mt-4 max-w-md text-muted-foreground">{d.text}</p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 text-sm text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" /> {d.tag}
            </span>
          </div>
          <img src={d.img} alt={d.name} width={960} height={720} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {DISHES.map((x, j) => (
              <button key={x.name} type="button" aria-label={x.name} onClick={() => setI(j)}
                className={`h-2 rounded-full transition-all ${j === i ? "w-8 bg-primary" : "w-3 bg-muted"}`} />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Oldingi" onClick={() => go(-1)} className="rounded-xl bg-secondary p-2.5 transition hover:bg-accent"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" aria-label="Keyingi" onClick={() => go(1)} className="rounded-xl bg-secondary p-2.5 transition hover:bg-accent"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
