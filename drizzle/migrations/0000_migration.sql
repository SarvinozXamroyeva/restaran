CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  is_student boolean NOT NULL DEFAULT false,
  order_hour int NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  student_discount numeric NOT NULL,
  happy_hour_discount numeric NOT NULL,
  main_discount_type text NOT NULL,
  big_order_discount numeric NOT NULL,
  total_discount numeric NOT NULL,
  after_discount numeric NOT NULL,
  service_fee numeric NOT NULL,
  delivery numeric NOT NULL,
  final_total numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);