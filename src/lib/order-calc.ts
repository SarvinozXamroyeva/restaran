export type OrderItem = { name: string; price: number; qty: number };
export type OrderInput = {
  customerName: string;
  hasStudentId: boolean;
  orderHour: number;
  items: OrderItem[];
};

export const STUDENT_RATE = 0.15;
export const HAPPY_HOUR_RATE = 0.2;
export const BIG_ORDER_RATE = 0.05;
export const BIG_ORDER_THRESHOLD = 150000;
export const SERVICE_RATE = 0.1;
export const DELIVERY_FEE = 15000;
export const DELIVERY_THRESHOLD = 100000;

export function calculateOrder(input: OrderInput) {
  const items = input.items.map((i) => ({ ...i, total: i.price * i.qty }));
  const subtotal = items.reduce((s, i) => s + i.total, 0);

  const studentEligible = input.hasStudentId;
  const happyHourEligible = input.orderHour >= 14 && input.orderHour <= 17;
  const bigOrderEligible = subtotal >= BIG_ORDER_THRESHOLD;

  const studentDiscount = Number(studentEligible) * subtotal * STUDENT_RATE;
  const happyHourDiscount = Number(happyHourEligible) * subtotal * HAPPY_HOUR_RATE;

  // Non-stacking: take the larger one (formula from the spec)
  const mainDiscount =
    studentDiscount * Number(studentDiscount >= happyHourDiscount) +
    happyHourDiscount * Number(happyHourDiscount > studentDiscount);
  const mainType: "student" | "happy_hour" | "none" =
    mainDiscount === 0 ? "none" : studentDiscount >= happyHourDiscount ? "student" : "happy_hour";

  // Big-order discount applies after the main discount
  const bigOrderDiscount = Number(bigOrderEligible) * (subtotal - mainDiscount) * BIG_ORDER_RATE;

  const totalDiscount = mainDiscount + bigOrderDiscount;
  const afterDiscount = subtotal - totalDiscount;
  const serviceFee = afterDiscount * SERVICE_RATE;
  const delivery = Number(subtotal >= DELIVERY_THRESHOLD) * DELIVERY_FEE;
  const freeDelivery = delivery === 0;
  const finalTotal = afterDiscount + serviceFee + delivery;

  return {
    customerName: input.customerName,
    hasStudentId: input.hasStudentId,
    orderHour: input.orderHour,
    items,
    subtotal,
    studentEligible,
    studentDiscount,
    happyHourEligible,
    happyHourDiscount,
    mainType,
    mainDiscount,
    bigOrderEligible,
    bigOrderDiscount,
    totalDiscount,
    afterDiscount,
    serviceFee,
    delivery,
    freeDelivery,
    finalTotal,
    saved: totalDiscount,
  };
}

export type OrderResult = ReturnType<typeof calculateOrder>;
