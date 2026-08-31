import { Company, PayrollPeriod } from '../types';
import { periodEngine } from '../services/periodEngine';

// ============================================================
// AURUM MOTORS - Configuración base
// La data operativa (empleados, contratos, nómina, etc.) se
// carga desde Supabase (src/lib/supabaseData.ts). Aquí solo
// se mantiene la configuración de la empresa como valor inicial
// de referencia mientras no haya un registro en la BD.
// ============================================================

export const INITIAL_COMPANY: Company = {
  id: 'comp-aurum-01',
  legalName: 'AURUM MOTORS S.A.S.',
  tradeName: 'AURUM MOTORS — Taller Especializado',
  nit: '901.782.345',
  dv: '9',
  address: 'Av. Carrera 70 No. 80 - 45 (Zona Automotriz)',
  city: 'Bogotá D.C.',
  department: 'Cundinamarca',
  phone: '(601) 794 8200 / 318 450 9900',
  email: 'contacto@aurummotors.com.co',
  legalRepresentative: 'Mateo Alejandro Cárdenas Silva',
  representativeDoc: 'CC 80.198.432 de Bogotá',
  economicActivity: 'Mantenimiento y Reparación de Vehículos Automotores, Detailing, Latonería y Pintura al Horno',
  ciiuCode: '4520',
  arlName: 'Positiva Compañía de Seguros S.A.',
  epsDefault: 'Sanitas EPS',
  pensionDefault: 'Protección S.A.',
  compensationBox: 'Compensar',
  senaExempt: true,
  icbfExempt: true,
  healthExempt: true,
  pilaOperator: 'Aportes en Línea',
  bankName: 'Bancolombia',
  bankAccountType: 'Corriente',
  bankAccountNumber: '310-892341-20',
  paymentFrequency: 'Quincenal',
  weeklyWorkHours: 44,
};

// ============================================================
// Estado inicial VACÍO.
// Los arreglos se llenan con la base de datos (Supabase).
// Ya no se siembra data de prueba (mock data eliminada).
// ============================================================

export const INITIAL_EMPLOYEES = [];
export const INITIAL_CONTRACTS = [];
export const INITIAL_SALARY_HISTORY = [];
export const INITIAL_POSITION_HISTORY = [];
export const INITIAL_LOANS = [];
export const INITIAL_NOVEDADES = [];
export const INITIAL_AUDIT_LOGS = [];
export const INITIAL_DOTACION_DELIVERIES = [];
export const INITIAL_SALARY_ADVANCES = [];
export const INITIAL_ALERTS = [];

export const initialPayrollPeriod: PayrollPeriod = periodEngine.getCurrentPayrollPeriodInfo().period;

export const initialCompany = INITIAL_COMPANY;
export const initialEmployees = INITIAL_EMPLOYEES;
export const initialContracts = INITIAL_CONTRACTS;
export const initialSalaryHistory = INITIAL_SALARY_HISTORY;
export const initialLoans = INITIAL_LOANS;
export const initialNovedades = INITIAL_NOVEDADES;
export const initialAuditLogs = INITIAL_AUDIT_LOGS;
export const initialPayrollItems = [];
export { periodEngine };
