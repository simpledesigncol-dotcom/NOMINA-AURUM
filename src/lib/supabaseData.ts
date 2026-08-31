import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Company, Employee, EmploymentContract, SalaryHistoryRecord,
  PositionHistoryRecord, Loan, Novedad, PayrollPeriod, PayrollItem,
  AuditLog, DotacionDelivery, SalaryAdvance, NotificationAlert,
} from '../types';

// ============================================================
// Helpers de mapeo snake_case (SQL) <-> camelCase (TypeScript)
// ============================================================

function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapRow<T = any>(row: Record<string, any>): T {
  const out: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    out[toCamel(key)] = row[key];
  }
  return out as T;
}

// ============================================================
// COMPANY
// ============================================================
export async function fetchCompany(): Promise<Company | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase!
    .from('company')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return { ...mapRow<Company>(data), ...(data.data || {}) };
}

// ============================================================
// EMPLOYEES
// ============================================================
export async function fetchEmployees(): Promise<Employee[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[Supabase] fetchEmployees', error.message);
    return [];
  }
  return (data || []).map(row => ({ ...mapRow<Employee>(row), ...(row.data || {}) }));
}

export async function saveEmployee(employee: Employee): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const payload = {
    id: employee.id,
    code: employee.code,
    first_name: employee.firstName,
    last_name: employee.lastName,
    document_type: employee.documentType,
    document_number: employee.documentNumber,
    expedition_city: employee.expeditionCity,
    birth_date: employee.birthDate,
    gender: employee.gender,
    marital_status: employee.maritalStatus,
    nationality: employee.nationality,
    address: employee.address,
    city: employee.city,
    state_region: employee.stateRegion,
    phone: employee.phone,
    email: employee.email,
    emergency_contact: employee.emergencyContact,
    bank_info: employee.bankInfo,
    hire_date: employee.hireDate,
    position: employee.position,
    department: employee.department,
    cost_center: employee.costCenter,
    immediate_supervisor: employee.immediateSupervisor,
    worker_type: employee.workerType,
    state: employee.state,
    eps: employee.eps,
    pension_fund: employee.pensionFund,
    severance_fund: employee.severanceFund,
    arl: employee.arl,
    risk_class: employee.riskClass,
    active_contract_id: employee.activeContractId,
    current_salary: employee.currentSalary,
    is_transport_allowance_eligible: employee.isTransportAllowanceEligible,
    commission_enabled: employee.commissionEnabled ?? false,
    non_salary_bonus: employee.nonSalaryBonus ?? 0,
    accrued_vacation_days: employee.accruedVacationDays,
    taken_vacation_days: employee.takenVacationDays,
    compensated_vacation_days: employee.compensatedVacationDays,
    pending_severance_balance: employee.pendingSeveranceBalance ?? null,
    workshop_specialty: employee.workshopSpecialty,
    dotacion_sizes: employee.dotacionSizes,
  };
  const { error } = await supabase!
    .from('employees')
    .upsert(payload, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveEmployee', error.message);
}

// ============================================================
// CONTRACTS
// ============================================================
export async function fetchContracts(): Promise<EmploymentContract[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('contracts').select('*');
  if (error) { console.error(error.message); return []; }
  return (data || []).map(row => mapRow<EmploymentContract>(row));
}

export async function saveContract(contract: EmploymentContract): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const payload = {
    id: contract.id,
    contract_number: contract.contractNumber,
    employee_id: contract.employeeId,
    type: contract.type,
    start_date: contract.startDate,
    end_date: contract.endDate,
    position: contract.position,
    salary: contract.salary,
    is_integral_salary: contract.isIntegralSalary,
    has_transport_allowance: contract.hasTransportAllowance,
    payment_frequency: contract.paymentFrequency,
    weekly_hours: contract.weeklyHours,
    work_schedule: contract.workSchedule,
    work_place: contract.workPlace,
    modality: contract.modality,
    probation_period_days: contract.probationPeriodDays,
    job_functions: contract.jobFunctions,
    benefits: contract.benefits,
    clauses: contract.clauses,
    state: contract.state,
    version: contract.version,
    created_at: contract.createdAt,
    signed_date: contract.signedDate,
  };
  const { error } = await supabase!.from('contracts').upsert(payload, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveContract', error.message);
}

// ============================================================
// SALARY HISTORY
// ============================================================
export async function fetchSalaryHistory(): Promise<SalaryHistoryRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('salary_history').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<SalaryHistoryRecord>(row));
}

export async function saveSalaryHistory(record: SalaryHistoryRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('salary_history').upsert({
    id: record.id,
    employee_id: record.employeeId,
    salary: record.salary,
    start_date: record.startDate,
    end_date: record.endDate,
    reason: record.reason,
    contract_id: record.contractId,
    created_by: record.createdBy,
    created_at: record.createdAt,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveSalaryHistory', error.message);
}

// ============================================================
// POSITION HISTORY
// ============================================================
export async function fetchPositionHistory(): Promise<PositionHistoryRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('position_history').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<PositionHistoryRecord>(row));
}

export async function savePositionHistory(record: PositionHistoryRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('position_history').upsert({
    id: record.id,
    employee_id: record.employeeId,
    position: record.position,
    department: record.department,
    cost_center: record.costCenter,
    start_date: record.startDate,
    end_date: record.endDate,
    reason: record.reason,
    created_by: record.createdBy,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] savePositionHistory', error.message);
}

// ============================================================
// LOANS
// ============================================================
export async function fetchLoans(): Promise<Loan[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('loans').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<Loan>(row));
}

export async function saveLoan(loan: Loan): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('loans').upsert({
    id: loan.id,
    employee_id: loan.employeeId,
    employee_name: loan.employeeName,
    initial_amount: loan.initialAmount,
    principal_amount: loan.principalAmount,
    balance: loan.balance,
    monthly_installment: loan.monthlyInstallment,
    installment_amount: loan.installmentAmount,
    total_installments: loan.totalInstallments,
    installments: loan.installments,
    paid_installments: loan.paidInstallments,
    interest_rate: loan.interestRate,
    start_date: loan.startDate,
    request_date: loan.requestDate,
    approved_date: loan.approvedDate,
    description: loan.description,
    reason: loan.reason,
    status: loan.status,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveLoan', error.message);
}

// ============================================================
// NOVEDADES
// ============================================================
export async function fetchNovedades(): Promise<Novedad[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('novedades').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<Novedad>(row));
}

export async function saveNovedad(novedad: Novedad): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('novedades').upsert({
    id: novedad.id,
    employee_id: novedad.employeeId,
    employee_name: novedad.employeeName,
    period_id: novedad.periodId,
    type: novedad.type,
    overtime_type: novedad.overtimeType,
    date: novedad.date,
    start_date: novedad.startDate,
    end_date: novedad.endDate,
    quantity: novedad.quantity,
    unit_rate: novedad.unitRate,
    calculated_value: novedad.calculatedValue,
    amount: novedad.amount,
    is_salary_affecting: novedad.isSalaryAffecting,
    is_salary_nature: novedad.isSalaryNature,
    observation: novedad.observation,
    support_document_url: novedad.supportDocumentUrl,
    support_number: novedad.supportNumber,
    status: novedad.status,
    approved_by: novedad.approvedBy,
    created_at: novedad.createdAt,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveNovedad', error.message);
}

// ============================================================
// PAYROLL PERIOD
// ============================================================
export async function fetchPayrollPeriods(): Promise<PayrollPeriod[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('payroll_periods').select('*').order('year', { ascending: false });
  if (error) return [];
  return (data || []).map(row => mapRow<PayrollPeriod>(row));
}

export async function savePayrollPeriod(period: PayrollPeriod): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('payroll_periods').upsert({
    id: period.id,
    name: period.name,
    year: period.year,
    month: period.month,
    period_type: period.periodType,
    start_date: period.startDate,
    end_date: period.endDate,
    payment_date: period.paymentDate,
    status: period.status,
    total_accrued: period.totalAccrued,
    total_deductions: period.totalDeductions,
    total_net_pay: period.totalNetPay,
    total_employer_cost: period.totalEmployerCost,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] savePayrollPeriod', error.message);
}

// ============================================================
// PAYROLL ITEMS
// ============================================================
export async function fetchPayrollItems(): Promise<PayrollItem[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('payroll_items').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<PayrollItem>(row));
}

export async function savePayrollItems(items: PayrollItem[], periodId?: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  if (items.length === 0) return;
  // Reemplaza los items del período: primero elimina lo previo de este período
  // para evitar acumulación de items antiguos duplicados (las ids cambian en cada recálculo).
  if (periodId) {
    await supabase!.from('payroll_items').delete().eq('period_id', periodId);
  }
  const rows = items.map(item => ({
    id: item.id,
    employee_id: item.employeeId,
    employee_name: item.employeeName,
    employee_doc: item.employeeDoc,
    position: item.position,
    department: item.department,
    contract_type: item.contractType,
    salary_base: item.salaryBase,
    worked_days: item.workedDays,
    basic_salary_accrued: item.basicSalaryAccrued,
    overtime_accrued: item.overtimeAccrued,
    surcharges_accrued: item.surchargesAccrued,
    salary_commissions_accrued: item.salaryCommissionsAccrued,
    salary_bonuses_accrued: item.salaryBonusesAccrued,
    paid_leave_accrued: item.paidLeaveAccrued,
    total_salary_accruals: item.totalSalaryAccruals,
    transport_allowance: item.transportAllowance,
    non_salary_bonuses: item.nonSalaryBonuses,
    non_salary_commissions: item.nonSalaryCommissions,
    other_non_salary_accruals: item.otherNonSalaryAccruals,
    total_non_salary_accruals: item.totalNonSalaryAccruals,
    total_accrued: item.totalAccrued,
    ibc_security_social: item.ibcSecuritySocial,
    health_employee: item.healthEmployee,
    pension_employee: item.pensionEmployee,
    solidarity_pension_fund: item.solidarityPensionFund,
    withholding_tax: item.withholdingTax,
    loan_deductions: item.loanDeductions,
    advances_deductions: item.advancesDeductions,
    garnishments_deductions: item.garnishmentsDeductions,
    other_deductions: item.otherDeductions,
    total_deductions: item.totalDeductions,
    net_pay: item.netPay,
    health_employer: item.healthEmployer,
    pension_employer: item.pensionEmployer,
    arl_employer: item.arlEmployer,
    compensation_box_employer: item.compensationBoxEmployer,
    sena_employer: item.senaEmployer,
    icbf_employer: item.icbfEmployer,
    total_employer_social_security: item.totalEmployerSocialSecurity,
    total_employer_parafiscal: item.totalEmployerParafiscal,
    severance_provision: item.severanceProvision,
    severance_interest_provision: item.severanceInterestProvision,
    service_bonus_provision: item.serviceBonusProvision,
    vacation_provision: item.vacationProvision,
    total_provisions: item.totalProvisions,
    total_company_cost: item.totalCompanyCost,
    explanations: item.explanations,
    period_id: periodId,
  }));
  const { error } = await supabase!.from('payroll_items').upsert(rows, { onConflict: 'id' });
  if (error) console.error('[Supabase] savePayrollItems', error.message);
}

// ============================================================
// AUDIT LOGS
// ============================================================
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('audit_logs').select('*').order('timestamp', { ascending: false });
  if (error) return [];
  return (data || []).map(row => mapRow<AuditLog>(row));
}

export async function saveAuditLog(log: AuditLog): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('audit_logs').upsert({
    id: log.id,
    timestamp: log.timestamp,
    user_name: log.userName,
    user_id: log.userId,
    user_role: log.userRole,
    ip_address: log.ipAddress,
    action: log.action,
    module: log.module,
    target_record_id: log.targetRecordId,
    target_description: log.targetDescription,
    previous_value: log.previousValue,
    new_value: log.newValue,
    details: log.details,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveAuditLog', error.message);
}

// ============================================================
// DOTACION DELIVERIES
// ============================================================
export async function fetchDotacionDeliveries(): Promise<DotacionDelivery[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('dotacion_deliveries').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<DotacionDelivery>(row));
}

export async function saveDotacionDelivery(delivery: DotacionDelivery): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('dotacion_deliveries').upsert({
    id: delivery.id,
    employee_id: delivery.employeeId,
    employee_name: delivery.employeeName,
    period_label: delivery.periodLabel,
    delivery_date: delivery.deliveryDate,
    items: delivery.items,
    shoe_size: delivery.shoeSize,
    overol_size: delivery.overolSize,
    signed_by_employee: delivery.signedByEmployee,
    delivered_by: delivery.deliveredBy,
    notes: delivery.notes,
    status: delivery.status,
    act_number: delivery.actNumber,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveDotacionDelivery', error.message);
}

// ============================================================
// SALARY ADVANCES
// ============================================================
export async function fetchSalaryAdvances(): Promise<SalaryAdvance[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('salary_advances').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<SalaryAdvance>(row));
}

export async function saveSalaryAdvance(advance: SalaryAdvance): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase!.from('salary_advances').upsert({
    id: advance.id,
    employee_id: advance.employeeId,
    employee_name: advance.employeeName,
    request_date: advance.requestDate,
    disbursement_date: advance.disbursementDate,
    amount: advance.amount,
    max_allowed_amount: advance.maxAllowedAmount,
    reason: advance.reason,
    deduct_period_id: advance.deductPeriodId,
    status: advance.status,
    approved_by: advance.approvedBy,
    disbursed_via: advance.disbursedVia,
  }, { onConflict: 'id' });
  if (error) console.error('[Supabase] saveSalaryAdvance', error.message);
}

// ============================================================
// NOTIFICATION ALERTS
// ============================================================
export async function fetchAlerts(): Promise<NotificationAlert[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase!.from('notification_alerts').select('*');
  if (error) return [];
  return (data || []).map(row => mapRow<NotificationAlert>(row));
}

// ============================================================
// Carga inicial agrupada
// ============================================================
export async function loadAllFromSupabase() {
  const [
    company, employees, contracts, salaryHistory, positionHistory,
    loans, novedades, payrollPeriods, payrollItems, auditLogs,
    dotacionDeliveries, salaryAdvances,
  ] = await Promise.all([
    fetchCompany(), fetchEmployees(), fetchContracts(), fetchSalaryHistory(),
    fetchPositionHistory(), fetchLoans(), fetchNovedades(), fetchPayrollPeriods(),
    fetchPayrollItems(), fetchAuditLogs(), fetchDotacionDeliveries(), fetchSalaryAdvances(),
  ]);
  return {
    company, employees, contracts, salaryHistory, positionHistory,
    loans, novedades, payrollPeriods, payrollItems, auditLogs,
    dotacionDeliveries, salaryAdvances,
  };
}
