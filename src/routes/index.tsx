import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, Receipt, Clock, GraduationCap, Truck, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { calculateOrder, type OrderResult } from "@/lib/order-calc";
import { placeOrder, listOrders } from "@/lib/orders.functions";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saffron — Restoran buyurtma kalkulyatori" },
      { name: "description", content: "3 ta taom, talaba va baxtli soat chegirmalari, xizmat haqi va yetkazib berish — bir zumda hisoblang." },
      { property: "og:title", content: "Saffron — Restoran buyurtma kalkulyatori" },
      { property: "og:description", content: "Buyurtmani kiriting va yakuniy summani chegirmalar bilan darhol ko'ring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const som = (n: number) => `${Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ")} so'm`;

const MENU = [
  { name: "Osh", price: 45000 },
  { name: "Somsa", price: 12000 },
  { name: "Lag'mon", price: 38000 },
  { name: "Shashlik", price: 25000 },
  { name: "Ko'k choy", price: 8000 },
];

function Index() {
  const [name, setName] = useState("");
  const [student, setStudent] = useState(false);
  const [hour, setHour] = useState(15);
  const [items, setItems] = useState([
    { name: "Osh", price: 45000, qty: 2 },
    { name: "Somsa", price: 12000, qty: 3 },
    { name: "Ko'k choy", price: 8000, qty: 2 },
  ]);
  const [result, setResult] = useState<OrderResult | null>(null);

  const preview = calculateOrder({ customerName: name, hasStudentId: student, orderHour: hour, items });
  const qc = useQueryClient();
  const place = useServerFn(placeOrder);
  const list = useServerFn(listOrders);
  const history = useQuery({ queryKey: ["orders"], queryFn: () => list() });

  const mutation = useMutation({
    mutationFn: () => place({ data: { customerName: name, hasStudentId: student, orderHour: hour, items } }),
    onSuccess: (r) => {
      setResult(r);
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Buyurtma saqlandi!");
      setTimeout(() => document.getElementById("chek")?.scrollIntoView({ behavior: "smooth" }), 50);
    },
    onError: () => toast.error("Ma'lumotlarni tekshiring: ism, nom, narx va miqdor to'ldirilishi kerak."),
  });

  const upd = (i: number, k: "name" | "price" | "qty", v: string) =>
    setItems((arr) => arr.map((it, j) => (j === i ? { ...it, [k]: k === "name" ? v : Math.max(0, Number(v) || 0) } : it)));

  return (
    <main className="min-h-screen">
      <Toaster />
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <img src={hero} alt="O'zbek taomlari: osh, somsa va choy" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-fade" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs uppercase tracking-widest text-primary backdrop-blur">
            <Sparkles className="h-3 w-3" /> Saffron restorani
          </p>
          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] md:text-7xl animate-rise">
            Buyurtmangiz, <span className="text-gradient-saffron">aniq hisobda.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground animate-rise">
            Talaba va baxtli soat chegirmalari, katta buyurtma bonusi va yetkazib berish — barchasi avtomatik.
          </p>
          <a href="#forma" className="mt-8 inline-flex rounded-full bg-gradient-saffron px-7 py-3 font-semibold text-primary-foreground shadow-glow transition hover:scale-105">
            Buyurtma berish
          </a>
        </div>
      </section>

      <section id="forma" className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <div className="space-y-8">
          <div className="rounded-3xl border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold">Mijoz haqida</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Ism</Label>
                <Input id="name" placeholder="Masalan, Umrbek" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className="h-12 text-base" />
              </div>
              <div className="flex items-center justify-between rounded-2xl border bg-secondary p-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Talabalik guvohnomasi</p>
                    <p className="text-xs text-muted-foreground">−15% chegirma</p>
                  </div>
                </div>
                <Switch checked={student} onCheckedChange={setStudent} aria-label="Talabalik guvohnomasi" />
              </div>
              <div className="rounded-2xl border bg-secondary p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium"><Clock className="h-5 w-5 text-primary" /> Buyurtma vaqti</span>
                  <span className="font-display text-xl font-semibold">{String(hour).padStart(2, "0")}:00</span>
                </div>
                <Slider min={0} max={23} step={1} value={[hour]} onValueChange={(v) => setHour(v[0] ?? 0)} aria-label="Buyurtma vaqti" />
                <p className={`mt-2 text-xs ${preview.happyHourEligible ? "text-success" : "text-muted-foreground"}`}>
                  {preview.happyHourEligible ? "Baxtli soat faol! −20%" : "Baxtli soat: 14:00 – 17:00"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 md:p-8">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-semibold">3 ta taom</h2>
              <div className="hidden flex-wrap gap-2 md:flex">
                {MENU.map((m) => (
                  <button key={m.name} type="button" className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    onClick={() => setItems((arr) => { const i = arr.findIndex((x) => !x.name); const idx = i === -1 ? 2 : i; return arr.map((it, j) => (j === idx ? { ...m, qty: 1 } : it)); })}>
                    + {m.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border bg-secondary p-4 md:grid-cols-[auto_2fr_1.3fr_0.8fr_auto] md:items-end">
                  <span className="row-span-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-saffron font-display font-bold text-primary-foreground md:row-span-1">{i + 1}</span>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Taom nomi</Label><Input value={it.name} maxLength={60} onChange={(e) => upd(i, "name", e.target.value)} /></div>
                  <div className="space-y-1 col-start-2 md:col-start-auto"><Label className="text-xs text-muted-foreground">Narxi (so'm)</Label><Input type="number" min={0} value={it.price} onChange={(e) => upd(i, "price", e.target.value)} /></div>
                  <div className="space-y-1 col-start-2 md:col-start-auto"><Label className="text-xs text-muted-foreground">Miqdori</Label><Input type="number" min={1} value={it.qty} onChange={(e) => upd(i, "qty", e.target.value)} /></div>
                  <p className="col-start-2 text-right font-semibold text-primary md:col-start-auto md:pb-2">{som(it.price * it.qty)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border bg-card p-6 shadow-glow md:p-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Jonli hisob</p>
            <p className="mt-2 font-display text-5xl font-extrabold text-gradient-saffron">{som(preview.finalTotal)}</p>
            <div className="mt-6 space-y-3 text-sm">
              <Row label="Chegirmadan oldin" value={som(preview.subtotal)} />
              <Row label="Chegirmalar" value={`− ${som(preview.totalDiscount)}`} accent />
              <Row label="Xizmat haqi (10%)" value={som(preview.serviceFee)} />
              <Row label="Yetkazib berish" value={preview.freeDelivery ? "Bepul" : som(preview.delivery)} />
            </div>
            <button type="button" disabled={mutation.isPending || !name.trim()} onClick={() => mutation.mutate()}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-saffron py-4 font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
              {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Receipt className="h-5 w-5" />}
              Buyurtmani tasdiqlash
            </button>
            {!name.trim() && <p className="mt-2 text-center text-xs text-muted-foreground">Avval ismingizni kiriting</p>}
          </div>
        </aside>
      </section>

      {result && <ReceiptView r={result} />}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-semibold">So'nggi buyurtmalar</h2>
        <div className="mt-6 overflow-hidden rounded-3xl border bg-card">
          {history.isLoading ? (
            <p className="p-6 text-muted-foreground">Yuklanmoqda…</p>
          ) : !history.data?.length ? (
            <p className="p-6 text-muted-foreground">Hozircha buyurtmalar yo'q. Birinchi bo'ling!</p>
          ) : (
            <ul className="divide-y">
              {history.data.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
                  <div>
                    <p className="font-medium">{o.customer_name} {o.is_student && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-primary">talaba</span>}</p>
                    <p className="text-xs text-muted-foreground">{String(o.order_hour).padStart(2, "0")}:00 · {new Date(o.created_at).toLocaleString("uz-UZ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold">{som(Number(o.final_total))}</p>
                    <p className="text-xs text-success">tejaldi {som(Number(o.total_discount))}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-semibold text-success" : "font-medium"}>{value}</span>
    </div>
  );
}

function Flag({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs text-success"><Check className="h-3 w-3" />True</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"><X className="h-3 w-3" />False</span>
  );
}

function ReceiptView({ r }: { r: OrderResult }) {
  const mainLabel = r.mainType === "student" ? "Talaba chegirmasi" : r.mainType === "happy_hour" ? "Baxtli soat chegirmasi" : "Yo'q";
  return (
    <section id="chek" className="mx-auto max-w-3xl px-6 pb-20 animate-rise">
      <div className="rounded-3xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Chek</p>
            <h2 className="mt-1 text-3xl font-bold">{r.customerName}</h2>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Talaba: <Flag ok={r.hasStudentId} /></p>
            <p className="mt-1">Vaqt: {String(r.orderHour).padStart(2, "0")}:00</p>
          </div>
        </div>

        <ul className="space-y-2 border-b border-dashed py-6">
          {r.items.map((it, i) => (
            <li key={i} className="flex justify-between gap-4">
              <span>{i + 1}. {it.name} <span className="text-muted-foreground">× {it.qty} · {som(it.price)}</span></span>
              <span className="font-medium">{som(it.total)}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-3 border-b border-dashed py-6 text-sm">
          <Row label="Chegirmalardan oldingi jami" value={som(r.subtotal)} />
          <div className="flex justify-between"><span className="text-muted-foreground">Talaba chegirmasi (15%) <Flag ok={r.studentEligible} /></span><span>{som(r.studentDiscount)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Baxtli soat (20%) <Flag ok={r.happyHourEligible} /></span><span>{som(r.happyHourDiscount)}</span></div>
          <Row label="Qo'llanilgan chegirma (kattarog'i)" value={`${mainLabel} · ${som(r.mainDiscount)}`} />
          <div className="flex justify-between"><span className="text-muted-foreground">Katta buyurtma (5%) <Flag ok={r.bigOrderEligible} /></span><span>{som(r.bigOrderDiscount)}</span></div>
          <Row label="Jami chegirmalar" value={`− ${som(r.totalDiscount)}`} accent />
          <Row label="Chegirmalardan keyingi jami" value={som(r.afterDiscount)} />
          <Row label="Xizmat haqi (10%)" value={som(r.serviceFee)} />
          <div className="flex justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Truck className="h-4 w-4" /> Yetkazib berish · bepul <Flag ok={r.freeDelivery} /></span><span>{som(r.delivery)}</span></div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Yakuniy jami</p>
            <p className="font-display text-4xl font-extrabold text-gradient-saffron">{som(r.finalTotal)}</p>
          </div>
          <p className="rounded-full bg-accent px-4 py-2 text-sm text-success">Jami tejaldi: {som(r.saved)}</p>
        </div>
      </div>
    </section>
  );
}
