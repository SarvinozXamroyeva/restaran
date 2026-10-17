import { describe, it, expect } from "vitest";
import { calculateOrder } from "@/lib/order-calc";

const base = (over: Partial<Parameters<typeof calculateOrder>[0]> = {}) =>
  calculateOrder({
    customerName: "Ali",
    hasStudentId: false,
    orderHour: 12,
    items: [
      { name: "Osh", price: 50000, qty: 2 },
      { name: "Somsa", price: 10000, qty: 3 },
      { name: "Choy", price: 5000, qty: 4 },
    ],
    ...over,
  });

describe("order rules", () => {
  it("subtotal is 150000", () => expect(base().subtotal).toBe(150000));
  it("student gets 15%", () => expect(base({ hasStudentId: true }).studentDiscount).toBe(22500));
  it("happy hour 14..17 gives 20%", () => {
    expect(base({ orderHour: 14 }).happyHourDiscount).toBe(30000);
    expect(base({ orderHour: 17 }).happyHourEligible).toBe(true);
    expect(base({ orderHour: 18 }).happyHourEligible).toBe(false);
  });
  it("student and happy hour do not stack", () => {
    const r = base({ hasStudentId: true, orderHour: 15 });
    expect(r.mainType).toBe("happy_hour");
    expect(r.mainDiscount).toBe(30000);
  });
  it("big order 5% after main discount", () => {
    expect(base({ orderHour: 15 }).bigOrderDiscount).toBe(6000);
  });
  it("service 10% after discounts, delivery 15000 when subtotal >= 100000", () => {
    const r = base();
    expect(r.serviceFee).toBeCloseTo(14250);
    expect(r.delivery).toBe(15000);
  });
  it("delivery is 0 under 100000", () => {
    const r = base({ items: [{ name: "a", price: 1000, qty: 1 }, { name: "b", price: 1000, qty: 1 }, { name: "c", price: 1000, qty: 1 }] });
    expect(r.delivery).toBe(0);
  });
});
