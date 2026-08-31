import { PayrollPeriod } from '../types';

// ============================================================
// ENGINE DE PERÍODOS QUINCENALES
// Aurum Motors paga de forma QUINCENAL:
//   - 1ra quincena:  día 1 al 15 (se paga el 15)
//   - 2da quincena:  día 16 al fin de mes (30 o 31 según el mes; se paga ese mismo día)
// El día de fin de mes se INCLUYE en la liquidación.
// ============================================================

const pad = (n: number) => String(n).padStart(2, '0');

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function monthName(month: number): string {
  return MONTHS[(month - 1 + 12) % 12];
}

export function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export interface PayrollPeriodInfo {
  period: PayrollPeriod;
  periodDays: number;
  startDate: string;
  endDate: string;
  paymentDate: string;
  label: string; // "Quincena 1" / "Quincena 2"
}

export function getCurrentPayrollPeriodInfo(refDate?: Date): PayrollPeriodInfo {
  const date = refDate || new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const ym = `${year}-${pad(month)}`;

  const isFirstHalf = day <= 15;
  const startDay = isFirstHalf ? 1 : 16;
  const endDay = isFirstHalf ? 15 : lastDayOfMonth(year, month);
  const periodDays = endDay - startDay + 1;

  const startDate = `${ym}-${pad(startDay)}`;
  const endDate = `${ym}-${pad(endDay)}`;
  const paymentDate = endDate;

  const period: PayrollPeriod = {
    id: `pp-${ym}-${isFirstHalf ? '1' : '2'}`,
    name: `Quincena ${isFirstHalf ? '1' : '2'} ${monthName(month)} ${year}`,
    year,
    month,
    periodType: 'Quincenal',
    startDate,
    endDate,
    paymentDate,
    status: 'Borrador',
    totalAccrued: 0,
    totalDeductions: 0,
    totalNetPay: 0,
    totalEmployerCost: 0,
  };

  return {
    period,
    periodDays,
    startDate,
    endDate,
    paymentDate,
    label: isFirstHalf ? 'Quincena 1' : 'Quincena 2',
  };
}

export function getNextPayrollPeriodInfo(current: PayrollPeriod): PayrollPeriodInfo {
  const end = new Date(`${current.endDate}T12:00:00`);
  end.setDate(end.getDate() + 1);
  return getCurrentPayrollPeriodInfo(end);
}

export const periodEngine = {
  getCurrentPayrollPeriodInfo,
  getNextPayrollPeriodInfo,
  lastDayOfMonth,
};
