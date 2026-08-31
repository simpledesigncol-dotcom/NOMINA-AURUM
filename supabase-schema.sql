-- ============================================================
--  AURUM MOTORS - NÓMINA & GESTIÓN LABORAL
--  Esquema de base de datos para Supabase
--  Ejecutar completo en: Dashboard > SQL Editor > New query
-- ============================================================
-- NOTA: Las entidades con sub-objetos (emergency_contact, bank_info,
-- items, explanations, etc.) se modelan como JSONB, mapeando 1:1
-- los tipos de TypeScript de src/types/index.ts.

-- ------------------------------------------------------------
-- 1. EMPRESA (solo 1 fila)
-- ------------------------------------------------------------
create table if not exists public.company (
  id text primary key,
  legal_name text,
  trade_name text,
  nit text,
  dv text,
  address text,
  city text,
  department text,
  phone text,
  email text,
  legal_representative text,
  representative_doc text,
  economic_activity text,
  ciiu_code text,
  arl_name text,
  eps_default text,
  pension_default text,
  compensation_box text,
  sena_exempt boolean default false,
  icbf_exempt boolean default false,
  health_exempt boolean default false,
  pila_operator text,
  bank_name text,
  bank_account_type text,
  bank_account_number text,
  payment_frequency text,
  weekly_work_hours numeric default 44,
  data jsonb default '{}'::jsonb
);

-- ------------------------------------------------------------
-- 2. EMPLEADOS
-- ------------------------------------------------------------
create table if not exists public.employees (
  id text primary key,
  code text,
  first_name text,
  last_name text,
  document_type text,
  document_number text,
  expedition_city text,
  birth_date text,
  gender text,
  marital_status text,
  nationality text,
  address text,
  city text,
  state_region text,
  phone text,
  email text,
  emergency_contact jsonb default '{}'::jsonb,
  bank_info jsonb default '{}'::jsonb,
  hire_date text,
  position text,
  department text,
  cost_center text,
  immediate_supervisor text,
  worker_type text,
  state text,
  eps text,
  pension_fund text,
  severance_fund text,
  arl text,
  risk_class text,
  active_contract_id text,
  current_salary numeric default 0,
  is_transport_allowance_eligible boolean default false,
  commission_enabled boolean default false,
  non_salary_bonus numeric default 0,
  accrued_vacation_days numeric default 0,
  taken_vacation_days numeric default 0,
  compensated_vacation_days numeric default 0,
  pending_severance_balance numeric,
  workshop_specialty text,
  dotacion_sizes jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. CONTRATOS LABORALES
-- ------------------------------------------------------------
create table if not exists public.contracts (
  id text primary key,
  contract_number text,
  employee_id text,
  type text,
  start_date text,
  end_date text,
  position text,
  salary numeric default 0,
  is_integral_salary boolean default false,
  has_transport_allowance boolean default false,
  payment_frequency text,
  weekly_hours numeric default 44,
  work_schedule text,
  work_place text,
  modality text,
  probation_period_days numeric default 0,
  job_functions jsonb default '[]'::jsonb,
  benefits jsonb default '[]'::jsonb,
  clauses jsonb default '[]'::jsonb,
  state text,
  version numeric default 1,
  created_at text,
  signed_date text
);
create index if not exists idx_contracts_employee on public.contracts (employee_id);

-- ------------------------------------------------------------
-- 4. HISTORIAL SALARIAL
-- ------------------------------------------------------------
create table if not exists public.salary_history (
  id text primary key,
  employee_id text,
  salary numeric default 0,
  start_date text,
  end_date text,
  reason text,
  contract_id text,
  created_by text,
  created_at text
);
create index if not exists idx_salary_history_employee on public.salary_history (employee_id);

-- ------------------------------------------------------------
-- 5. HISTORIAL DE CARGOS
-- ------------------------------------------------------------
create table if not exists public.position_history (
  id text primary key,
  employee_id text,
  position text,
  department text,
  cost_center text,
  start_date text,
  end_date text,
  reason text,
  created_by text
);
create index if not exists idx_position_history_employee on public.position_history (employee_id);

-- ------------------------------------------------------------
-- 6. PRÉSTAMOS
-- ------------------------------------------------------------
create table if not exists public.loans (
  id text primary key,
  employee_id text,
  employee_name text,
  initial_amount numeric default 0,
  principal_amount numeric default 0,
  balance numeric default 0,
  monthly_installment numeric,
  installment_amount numeric,
  total_installments numeric,
  installments numeric,
  paid_installments numeric default 0,
  interest_rate numeric default 0,
  start_date text,
  request_date text,
  approved_date text,
  description text,
  reason text,
  status text,
  created_at timestamptz default now()
);
create index if not exists idx_loans_employee on public.loans (employee_id);

-- ------------------------------------------------------------
-- 7. NOVEDADES / HORAS EXTRAS
-- ------------------------------------------------------------
create table if not exists public.novedades (
  id text primary key,
  employee_id text,
  employee_name text,
  period_id text,
  type text,
  overtime_type text,
  date text,
  start_date text,
  end_date text,
  quantity numeric default 0,
  unit_rate numeric,
  calculated_value numeric,
  amount numeric,
  is_salary_affecting boolean,
  is_salary_nature boolean,
  observation text,
  support_document_url text,
  support_number text,
  status text,
  approved_by text,
  created_at text
);
create index if not exists idx_novedades_employee on public.novedades (employee_id);

-- ------------------------------------------------------------
-- 8. PERÍODOS DE NÓMINA
-- ------------------------------------------------------------
create table if not exists public.payroll_periods (
  id text primary key,
  name text,
  year numeric,
  month numeric,
  period_type text,
  start_date text,
  end_date text,
  payment_date text,
  status text,
  total_accrued numeric default 0,
  total_deductions numeric default 0,
  total_net_pay numeric default 0,
  total_employer_cost numeric default 0
);

-- ------------------------------------------------------------
-- 9. ÍTEMS DE NÓMINA
-- ------------------------------------------------------------
create table if not exists public.payroll_items (
  id text primary key,
  employee_id text,
  employee_name text,
  employee_doc text,
  position text,
  department text,
  contract_type text,
  salary_base numeric default 0,
  worked_days numeric default 0,
  basic_salary_accrued numeric default 0,
  overtime_accrued numeric default 0,
  surcharges_accrued numeric default 0,
  salary_commissions_accrued numeric default 0,
  salary_bonuses_accrued numeric default 0,
  paid_leave_accrued numeric default 0,
  total_salary_accruals numeric default 0,
  transport_allowance numeric default 0,
  non_salary_bonuses numeric default 0,
  non_salary_commissions numeric default 0,
  other_non_salary_accruals numeric default 0,
  total_non_salary_accruals numeric default 0,
  total_accrued numeric default 0,
  ibc_security_social numeric default 0,
  health_employee numeric default 0,
  pension_employee numeric default 0,
  solidarity_pension_fund numeric default 0,
  withholding_tax numeric default 0,
  loan_deductions numeric default 0,
  advances_deductions numeric default 0,
  garnishments_deductions numeric default 0,
  other_deductions numeric default 0,
  total_deductions numeric default 0,
  net_pay numeric default 0,
  health_employer numeric default 0,
  pension_employer numeric default 0,
  arl_employer numeric default 0,
  compensation_box_employer numeric default 0,
  sena_employer numeric default 0,
  icbf_employer numeric default 0,
  total_employer_social_security numeric default 0,
  total_employer_parafiscal numeric default 0,
  severance_provision numeric default 0,
  severance_interest_provision numeric default 0,
  service_bonus_provision numeric default 0,
  vacation_provision numeric default 0,
  total_provisions numeric default 0,
  total_company_cost numeric default 0,
  explanations jsonb default '[]'::jsonb,
  period_id text,
  created_at timestamptz default now()
);
create index if not exists idx_payroll_items_employee on public.payroll_items (employee_id);

-- ------------------------------------------------------------
-- 10. REGISTROS DE AUDITORÍA
-- ------------------------------------------------------------
create table if not exists public.audit_logs (
  id text primary key,
  timestamp text,
  user_name text,
  user_id text,
  user_role text,
  ip_address text,
  action text,
  module text,
  target_record_id text,
  target_description text,
  previous_value text,
  new_value text,
  details text,
  data jsonb default '{}'::jsonb
);

-- ------------------------------------------------------------
-- 11. ENTREGAS DE DOTACIÓN
-- ------------------------------------------------------------
create table if not exists public.dotacion_deliveries (
  id text primary key,
  employee_id text,
  employee_name text,
  period_label text,
  delivery_date text,
  items jsonb default '[]'::jsonb,
  shoe_size text,
  overol_size text,
  signed_by_employee boolean default false,
  delivered_by text,
  notes text,
  status text,
  act_number text
);
create index if not exists idx_dotacion_employee on public.dotacion_deliveries (employee_id);

-- ------------------------------------------------------------
-- 12. ADELANTOS / ANTICIPOS
-- ------------------------------------------------------------
create table if not exists public.salary_advances (
  id text primary key,
  employee_id text,
  employee_name text,
  request_date text,
  disbursement_date text,
  amount numeric default 0,
  max_allowed_amount numeric default 0,
  reason text,
  deduct_period_id text,
  status text,
  approved_by text,
  disbursed_via text
);
create index if not exists idx_advances_employee on public.salary_advances (employee_id);

-- ------------------------------------------------------------
-- 13. ALERTAS / NOTIFICACIONES
-- ------------------------------------------------------------
create table if not exists public.notification_alerts (
  id text primary key,
  type text,
  title text,
  description text,
  employee_id text,
  employee_name text,
  due_date text,
  days_remaining numeric,
  severity text
);

-- ------------------------------------------------------------
-- Row Level Security
-- La app obtiene los datos con la anon/publishable key sin
-- autenticación de usuarios. Para permitir lectura/escritura
-- desde el cliente, habilitamos RLS y creamos políticas amplias.
-- ➜ Si prefieres control estricto, sustituye por políticas
--   basadas en auth.uid() y usa login.
-- ------------------------------------------------------------
alter table public.company enable row level security;
alter table public.employees enable row level security;
alter table public.contracts enable row level security;
alter table public.salary_history enable row level security;
alter table public.position_history enable row level security;
alter table public.loans enable row level security;
alter table public.novedades enable row level security;
alter table public.payroll_periods enable row level security;
alter table public.payroll_items enable row level security;
alter table public.audit_logs enable row level security;
alter table public.dotacion_deliveries enable row level security;
alter table public.salary_advances enable row level security;
alter table public.notification_alerts enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'company','employees','contracts','salary_history','position_history',
    'loans','novedades','payroll_periods','payroll_items','audit_logs',
    'dotacion_deliveries','salary_advances','notification_alerts'
  ] loop
    execute format('drop policy if exists "public_access_%s" on public.%I', t, t);
    execute format(
      'create policy "public_access_%s" on public.%I for all using (true) with check (true)',
      t, t
    );
  end loop;
end $$;

-- Migración: columna de comisión del 10% sobre ventas (idempotente)
alter table if exists public.employees
  add column if not exists commission_enabled boolean default false;

-- Migración: bono no prestacional fijo (completa el salario hasta el total pactado) (idempotente)
alter table if exists public.employees
  add column if not exists non_salary_bonus numeric default 0;
