import { 
  Employee, 
  EmploymentContract, 
  TerminationSettlement, 
  CalculationExplanationItem, 
  Loan 
} from '../types';
import { legalRulesEngine } from './legalRulesEngine';

export interface TerminationInput {
  employee: Employee;
  contract: EmploymentContract;
  terminationDate: string;
  reason: 
    | 'Renuncia voluntaria'
    | 'Terminación por justa causa (Empleador)'
    | 'Terminación sin justa causa (Despido injustificado)'
    | 'Vencimiento de término fijo'
    | 'Terminación por mutuo acuerdo'
    | 'Terminación de obra o labor';
  pendingSalaryDays?: number;
  variableAverageSalary?: number;
  activeLoans?: Loan[];
}

export class SettlementEngineService {
  private calculateDaysBetween(startDateStr: string, endDateStr: string): number {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 30;
    
    // Método 360 días comercial colombiano
    const y1 = start.getFullYear();
    const m1 = start.getMonth() + 1;
    const d1 = Math.min(30, start.getDate());

    const y2 = end.getFullYear();
    const m2 = end.getMonth() + 1;
    const d2 = Math.min(30, end.getDate());

    let days = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1) + 1;
    return Math.max(1, days);
  }

  public calculateSettlement(input: TerminationInput): TerminationSettlement {
    const { employee, contract, terminationDate, reason, activeLoans = [] } = input;
    const baseSalary = employee.currentSalary || contract.salary || 1423500;
    const isIntegral = contract.isIntegralSalary || employee.workerType === 'Salario Integral';
    const smlmv = legalRulesEngine.getSMLMV();
    const auxTransporte = legalRulesEngine.getAuxTransporte();
    const explanations: CalculationExplanationItem[] = [];

    const hasTransport = !isIntegral && (baseSalary <= (smlmv * 2));
    const transportAllowanceAmount = hasTransport ? auxTransporte : 0;
    const averageVariable = input.variableAverageSalary || 0;

    // Base de liquidación para cesantías y prima (incluye auxilio y variables salariales)
    const settlementBaseSalary = baseSalary + transportAllowanceAmount + averageVariable;
    // Base de liquidación para vacaciones (NO incluye auxilio de transporte)
    const vacationBaseSalary = baseSalary + averageVariable;

    // 1. Días laborados totales
    const hireDate = contract.startDate || employee.hireDate;
    const totalDaysWorked = this.calculateDaysBetween(hireDate, terminationDate);

    // 2. Salarios pendientes en el mes de retiro
    const pendingSalaryDays = input.pendingSalaryDays !== undefined ? input.pendingSalaryDays : new Date(terminationDate).getDate();
    const pendingSalaryAmount = Math.round((baseSalary / 30) * pendingSalaryDays);

    explanations.push({
      concept: 'Salarios Pendientes',
      formula: `($${baseSalary.toLocaleString('es-CO')} / 30 días) × ${pendingSalaryDays} días`,
      baseAmount: baseSalary,
      quantity: pendingSalaryDays,
      result: pendingSalaryAmount,
      legalBasis: 'CST Art. 127',
    });

    // 3. Cesantías proporcionales
    // Días causados de cesantías en el año en curso (desde 1 ene o fecha ingreso)
    const startYear = `${new Date(terminationDate).getFullYear()}-01-01`;
    const severanceStartDate = hireDate > startYear ? hireDate : startYear;
    const severanceDays = isIntegral ? 0 : this.calculateDaysBetween(severanceStartDate, terminationDate);
    const severanceAmount = isIntegral ? 0 : Math.round((settlementBaseSalary * severanceDays) / 360);

    if (!isIntegral) {
      explanations.push({
        concept: 'Cesantías Proporcionales',
        formula: `(Base $${settlementBaseSalary.toLocaleString('es-CO')} × ${severanceDays} días) / 360`,
        baseAmount: settlementBaseSalary,
        quantity: severanceDays,
        result: severanceAmount,
        legalBasis: 'CST Art. 249 / Ley 50 de 1990',
      });
    }

    // 4. Intereses sobre Cesantías
    const severanceInterestAmount = isIntegral ? 0 : Math.round((severanceAmount * severanceDays * 0.12) / 360);
    if (!isIntegral) {
      explanations.push({
        concept: 'Intereses sobre Cesantías',
        formula: `(Cesantías $${severanceAmount.toLocaleString('es-CO')} × ${severanceDays} días × 12%) / 360`,
        baseAmount: severanceAmount,
        quantity: severanceDays,
        result: severanceInterestAmount,
        legalBasis: 'Ley 52 de 1975 / Decreto 116 de 1976',
      });
    }

    // 5. Prima de Servicios proporcional
    // Días causados en el semestre en curso (1 ene o 1 jul)
    const termMonth = new Date(terminationDate).getMonth() + 1;
    const currentYear = new Date(terminationDate).getFullYear();
    const startSemester = termMonth <= 6 ? `${currentYear}-01-01` : `${currentYear}-07-01`;
    const serviceBonusStartDate = hireDate > startSemester ? hireDate : startSemester;
    const serviceBonusDays = isIntegral ? 0 : this.calculateDaysBetween(serviceBonusStartDate, terminationDate);
    const serviceBonusAmount = isIntegral ? 0 : Math.round((settlementBaseSalary * serviceBonusDays) / 360);

    if (!isIntegral) {
      explanations.push({
        concept: 'Prima de Servicios Proporcional',
        formula: `(Base $${settlementBaseSalary.toLocaleString('es-CO')} × ${serviceBonusDays} días semestre) / 360`,
        baseAmount: settlementBaseSalary,
        quantity: serviceBonusDays,
        result: serviceBonusAmount,
        legalBasis: 'CST Art. 306 / Ley 1788 de 2016',
      });
    }

    // 6. Vacaciones pendientes / compensadas en dinero
    // Días de vacaciones causados proporcionales = (total días trabajados * 15 / 360) - disfrutadas
    const totalEarnedVacationDays = (totalDaysWorked * 15) / 360;
    const takenVacationDays = employee.takenVacationDays || 0;
    const vacationPendingDays = Math.max(0, Number((totalEarnedVacationDays - takenVacationDays).toFixed(2)));
    const vacationAmount = Math.round((vacationBaseSalary * vacationPendingDays) / 30);

    explanations.push({
      concept: 'Compensación de Vacaciones en Dinero',
      formula: `(Base $${vacationBaseSalary.toLocaleString('es-CO')} / 30) × ${vacationPendingDays} días acumulados pendientes (sin auxilio)`,
      baseAmount: vacationBaseSalary,
      quantity: vacationPendingDays,
      result: vacationAmount,
      legalBasis: 'CST Art. 189 / Ley 1429 de 2010',
    });

    // 7. Indemnización por despido injustificado (Art. 64 CST / Ley 2466 de 2025)
    let indemnityAmount = 0;
    const hasIndemnity = reason === 'Terminación sin justa causa (Despido injustificado)';

    if (hasIndemnity) {
      if (contract.type === 'Término Fijo' && contract.endDate) {
        // En contratos a término fijo: el valor de los salarios correspondientes al tiempo que faltare para cumplir el plazo
        const daysRemaining = Math.max(0, this.calculateDaysBetween(terminationDate, contract.endDate));
        indemnityAmount = Math.round((baseSalary / 30) * daysRemaining);
        explanations.push({
          concept: 'Indemnización Término Fijo (Art. 64 CST)',
          formula: `Salarios faltantes para cumplir el plazo (${daysRemaining} días restantes)`,
          baseAmount: baseSalary,
          quantity: daysRemaining,
          result: indemnityAmount,
          legalBasis: 'CST Art. 64 numeral 3',
        });
      } else {
        // En contratos a término indefinido
        // Si devenga menos de 10 SMLMV: 30 días por el 1er año + 20 días por año subsiguiente
        // Si devenga 10 SMLMV o más: 20 días por el 1er año + 15 días por año subsiguiente
        const isUnder10Smlmv = baseSalary < (smlmv * 10);
        const firstYearDays = isUnder10Smlmv ? 30 : 20;
        const subsequentYearDays = isUnder10Smlmv ? 20 : 15;

        if (totalDaysWorked <= 360) {
          indemnityAmount = Math.round((baseSalary / 30) * firstYearDays);
        } else {
          const firstYearAmount = (baseSalary / 30) * firstYearDays;
          const additionalDays = totalDaysWorked - 360;
          const additionalAmount = (baseSalary / 30) * subsequentYearDays * (additionalDays / 360);
          indemnityAmount = Math.round(firstYearAmount + additionalAmount);
        }

        explanations.push({
          concept: 'Indemnización Término Indefinido (Art. 64 CST)',
          formula: isUnder10Smlmv 
            ? `30 días primer año + 20 días por año proporcional subsiguiente (${totalDaysWorked} días trabajados)`
            : `20 días primer año + 15 días por año proporcional subsiguiente (${totalDaysWorked} días trabajados)`,
          baseAmount: baseSalary,
          result: indemnityAmount,
          legalBasis: 'CST Art. 64 numeral 4 / Ley 789 de 2002 / Ley 2466',
        });
      }
    }

    // 8. Total Devengados a favor del trabajador
    const totalAccruedCredits = Math.round(
      pendingSalaryAmount + 
      severanceAmount + 
      severanceInterestAmount + 
      serviceBonusAmount + 
      vacationAmount + 
      indemnityAmount
    );

    // 9. Deducciones (Préstamos pendientes, anticipos)
    let pendingLoansDeduction = 0;
    activeLoans.forEach(loan => {
      if (loan.employeeId === employee.id && loan.status === 'Activo' && loan.balance > 0) {
        pendingLoansDeduction += loan.balance;
      }
    });

    const totalSettlementDeductions = pendingLoansDeduction;
    const netSettlementAmount = Math.max(0, totalAccruedCredits - totalSettlementDeductions);

    // 10. Checklist de Retiro Automatizado (14 ítems obligatorios)
    const checklist = [
      { item: 'Carta de notificación / Aceptación de renuncia', completed: true, responsible: 'RRHH' },
      { item: 'Cálculo de Liquidación Final de Prestaciones', completed: true, responsible: 'Nómina' },
      { item: 'Aprobación y autorización de pago de liquidación', completed: false, responsible: 'Gerencia Financiera' },
      { item: 'Generación de Certificado Laboral oficial', completed: true, responsible: 'RRHH' },
      { item: 'Emisión de Paz y Salvo integral con firmas', completed: false, responsible: 'RRHH y Empleado' },
      { item: 'Devolución de equipos de cómputo y telefonía', completed: false, responsible: 'Tecnología / IT' },
      { item: 'Devolución de herramientas de trabajo y dotación', completed: false, responsible: 'Operaciones' },
      { item: 'Devolución de carné corporativo y llaves de acceso', completed: false, responsible: 'Seguridad' },
      { item: 'Revocación de accesos digitales, correo y ERP', completed: false, responsible: 'Tecnología / IT' },
      { item: 'Novedad de retiro en Operador PILA (Seguridad Social)', completed: false, responsible: 'Nómina' },
      { item: 'Verificación de consignación y saldos de Cesantías', completed: true, responsible: 'Nómina' },
      { item: 'Examen médico de egreso laboral', completed: false, responsible: 'SST / Salud Ocupacional' },
      { item: 'Verificación de no adeudo de préstamos o anticipos', completed: true, responsible: 'Contabilidad' },
      { item: 'Firma de recibido a conformidad por el trabajador', completed: false, responsible: 'Empleado' },
    ];

    return {
      id: `set-${Date.now()}`,
      settlementNumber: `LIQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeDoc: `${employee.documentType} ${employee.documentNumber}`,
      contractId: contract.id,
      contractType: contract.type,
      hireDate,
      terminationDate,
      totalDaysWorked,
      baseSalary,
      averageVariableSalary: averageVariable,
      hasTransportAllowance: hasTransport,
      transportAllowanceAmount,
      settlementBaseSalary,
      vacationBaseSalary,
      terminationReason: reason,
      hasIndemnity,
      pendingSalaryDays,
      pendingSalaryAmount,
      severanceDays,
      severanceAmount,
      severanceInterestAmount,
      serviceBonusDays,
      serviceBonusAmount,
      vacationPendingDays,
      vacationAmount,
      indemnityAmount,
      otherCredits: 0,
      totalAccruedCredits,
      pendingLoansDeduction,
      pendingAdvancesDeduction: 0,
      otherDeductions: 0,
      totalSettlementDeductions,
      netSettlementAmount,
      checklist,
      isPazYSalvoSigned: false,
      equipmentReturned: false,
      keysReturned: false,
      digitalAccessRevoked: false,
      explanations,
      status: 'Borrador',
      createdAt: new Date().toISOString(),
    };
  }
}

export const settlementEngine = new SettlementEngineService();
