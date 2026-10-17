import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { calculateOrder } from "./order-calc";

const schema = z.object({
  customerName: z.string().trim().min(1).max(80),
  hasStudentId: z.boolean(),
  orderHour: z.number().int().min(0).max(23),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(60),
        price: z.number().min(0).max(100_000_000),
        qty: z.number().int().min(1).max(1000),
      }),
    )
    .length(3),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const r = calculateOrder(data);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").insert({
      customer_name: r.customerName,
      is_student: r.hasStudentId,
      order_hour: r.orderHour,
      items: r.items,
      subtotal: r.subtotal,
      student_discount: r.studentDiscount,
      happy_hour_discount: r.happyHourDiscount,
      main_discount_type: r.mainType,
      big_order_discount: r.bigOrderDiscount,
      total_discount: r.totalDiscount,
      after_discount: r.afterDiscount,
      service_fee: r.serviceFee,
      delivery: r.delivery,
      final_total: r.finalTotal,
    });
    if (error) throw new Error(error.message);
    return r;
  });

export const listOrders = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id, customer_name, is_student, order_hour, final_total, total_discount, created_at")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw new Error(error.message);
  return data ?? [];
});
