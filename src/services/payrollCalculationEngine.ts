import { 
  Employee, 
  EmploymentContract, 
  Novedad, 
  PayrollItem, 
  CalculationExplanationItem, 
  Company 
} from '../types';
import { legalRulesEngine } from './legalRulesEngine';

export interface PayrollCalculationInput {
  employee: Employee;
  contract?: EmploymentContract;
  company: Company;
  periodDays?: number; // Divisor del salario mensual (por convención 30 días); default 30
  paidDays?: number;   // Días efectivamente pagados en el período (p.ej. 15 o 16 en quincena)
  novedades: Novedad[];
  appliedSalary?: number; // Permite histórico de salario en la fecha
}

export class PayrollCalculationEngine {
  public calculateItem(input: PayrollCalculationInput): PayrollItem {
    const { employee, contract, company, novedades } = input;
    // Divisor mensual del salario: por convención 30 días.
    const periodDays = input.periodDays || 30;
    // Días efectivamente pagados en este período (quincena: 15/16, o mes completo).
    const paidDays = Math.max(1, input.paidDays ?? periodDays);
    const smlmv = legalRulesEngine.getSMLMV();
    const auxTransporteFull = legalRulesEngine.getAuxTransporte();
    const explanations: CalculationExplanationItem[] = [];

    // 1 & 2 & 3. Salario e información laboral
    const baseSalary = input.appliedSalary || employee.currentSalary || 1423500;
    const isIntegral = contract?.isIntegralSalary || employee.workerType === 'Salario Integral' || baseSalary >= smlmv * 13;
    const hourlyRate = legalRulesEngine.calculateHourlyRate(baseSalary);

    // 4 & 5 & 6. Análisis de Novedades de tiempo y ausencias
    let unpaidLeaveDays = 0;
    let paidLeaveDays = 0;
    let incapacityDays = 0;
    let vacationDays = 0;

    // Devengados acumuladores
    let overtimeDiurna = 0;
    let overtimeNocturna = 0;
    let overtimeFestivaDiurna = 0;
    let overtimeFestivaNocturna = 0;
    let recargoNocturno = 0;
    let recargoFestivo = 0;

    let salaryCommissions = 0;
    let nonSalaryCommissions = 0;
    let salaryBonuses = 0;
    let nonSalaryBonuses = 0;
    let otherNonSalaryAccruals = 0;

    // Deducciones acumuladores
    let loanDeductions = 0;
    let advancesDeductions = 0;
    let garnishmentsDeductions = 0;
    let otherDeductions = 0;

    novedades.forEach(nov => {
      if (nov.status === 'Rechazada') return;

      switch (nov.type) {
        // Horas extras y recargos
        case 'HED': {
          const factor = legalRulesEngine.getValue('FACTOR_HED', 1.25);
          const val = nov.quantity * hourlyRate * factor;
          overtimeDiurna += val;
          explanations.push({
            concept: 'Horas Extras Diurnas (HED)',
            formula: `${nov.quantity} horas × $${Math.round(hourlyRate).toLocaleString('es-CO')} × factor ${factor}`,
            quantity: nov.quantity,
            rateOrFactor: factor,
            result: Math.round(val),
            legalBasis: 'CST Art. 168 / Ley 2466',
          });
          break;
        }
        case 'HEN': {
          const factor = legalRulesEngine.getValue('FACTOR_HEN', 1.75);
          const val = nov.quantity * hourlyRate * factor;
          overtimeNocturna += val;
          explanations.push({
            concept: 'Horas Extras Nocturnas (HEN)',
            formula: `${nov.quantity} horas × $${Math.round(hourlyRate).toLocaleString('es-CO')} × factor ${factor}`,
            quantity: nov.quantity,
            rateOrFactor: factor,
            result: Math.round(val),
            legalBasis: 'CST Art. 168 / Ley 2466',
          });
          break;
        }
        case 'HEFD': {
          const factor = legalRulesEngine.getValue('FACTOR_HEFD', 2.00);
          const val = nov.quantity * hourlyRate * factor;
          overtimeFestivaDiurna += val;
          explanations.push({
            concept: 'Horas Extras Festivas Diurnas (HEFD)',
            formula: `${nov.quantity} horas × $${Math.round(hourlyRate).toLocaleString('es-CO')} × factor ${factor}`,
            quantity: nov.quantity,
            rateOrFactor: factor,
            result: Math.round(val),
            legalBasis: 'CST Art. 168 y 179 / Ley 2466',
          });
          break;
        }
        case 'HEFN': {
          const factor = legalRulesEngine.getValue('FACTOR_HEFN', 2.50);
          const val = nov.quantity * hourlyRate * factor;
          overtimeFestivaNocturna += val;
          explanations.push({
            concept: 'Horas Extras Festivas Nocturnas (HEFN)',
            formula: `${nov.quantity} horas × $${Math.round(hourlyRate).toLocaleString('es-CO')} × factor ${factor}`,
            quantity: nov.quantity,
            rateOrFactor: factor,
            result: Math.round(val),
            legalBasis: 'CST Art. 168 y 179 / Ley 2466',
          });
          break;
        }
        case 'RN': {
          const factor = legalRulesEngine.getValue('FACTOR_RN', 0.35);
          const val = nov.quantity * hourlyRate * factor;
          recargoNocturno += val;
          explanations.push({
            concept: 'Recargo Nocturno (7pm - 6am)',
            formula: `${nov.quantity} horas × $${Math.round(hourlyRate).toLocaleString('es-CO')} × factor ${factor}`,
            quantity: nov.quantity,
            rateOrFactor: factor,
            result: Math.round(val),
            legalBasis: 'Ley 2466 de 2025 Art. 13 (Horario nocturno)',
          });
          break;
        }
        case 'RDF': {
          const factor = legalRulesEngine.getValue('FACTOR_RDF', 1.00);
          const val = nov.quantity * hourlyRate * factor;
          recargoFestivo += val;
          explanations.push({
            concept: 'Recargo Dominical y Festivo',
            formula: `${nov.quantity} horas × $${Math.round(hourlyRate).toLocaleString('es-CO')} × factor ${factor}`,
            quantity: nov.quantity,
            rateOrFactor: factor,
            result: Math.round(val),
            legalBasis: 'Ley 2466 de 2025 / CST Art. 179',
          });
          break;
        }
        // Ausencias
        case 'AUSENCIA_INJUSTIFICADA':
        case 'LICENCIA_NO_REMUNERADA':
        case 'SUSPENSION':
          unpaidLeaveDays += nov.quantity;
          break;
        case 'INCAPACIDAD_GENERAL':
        case 'INCAPACIDAD_LABORAL':
          incapacityDays += nov.quantity;
          break;
        case 'VACACIONES_DISFRUTADAS':
          vacationDays += nov.quantity;
          break;
        case 'LICENCIA_REMUNERADA':
        case 'PERMISO_REMUNERADO':
        case 'LICENCIA_MATERNIDAD':
        case 'LICENCIA_PATERNIDAD':
          paidLeaveDays += nov.quantity;
          break;

        // Comisiones & Bonos
        case 'COMISION_SALARIAL':
          salaryCommissions += nov.calculatedValue;
          break;
        case 'COMISION_NO_SALARIAL':
          nonSalaryCommissions += nov.calculatedValue;
          break;
        case 'BONO_SALARIAL':
        case 'INCENTIVO':
          salaryBonuses += nov.calculatedValue;
          break;
        case 'BONO_NO_SALARIAL':
        case 'AUXILIO_RODAMIENTO':
        case 'AUXILIO_ALIMENTACION':
          nonSalaryBonuses += nov.calculatedValue;
          break;

        // Deducciones
        case 'PRESTAMO_CUOTA':
          loanDeductions += nov.calculatedValue;
          break;
        case 'ANTICIPO':
          advancesDeductions += nov.calculatedValue;
          break;
        case 'EMBARGO_ALIMENTOS':
        case 'EMBARGO_COMERCIAL':
          garnishmentsDeductions += nov.calculatedValue;
          break;
        case 'LIBRANZA':
        case 'DESCUENTO_AUTORIZADO':
        case 'OTRO_DESCUENTO':
          otherDeductions += nov.calculatedValue;
          break;
      }
    });

    // 7. Cálculo de tiempo trabajado y Salario Básico Proporcional
    const workedDays = Math.max(0, paidDays - unpaidLeaveDays);
    const basicSalaryAccrued = Math.round((baseSalary / periodDays) * workedDays);

    explanations.push({
      concept: 'Salario Básico Devengado',
      formula: `($${baseSalary.toLocaleString('es-CO')} / ${periodDays} días) × ${workedDays} días laborados`,
      baseAmount: baseSalary,
      quantity: workedDays,
      result: basicSalaryAccrued,
      legalBasis: 'CST Art. 127',
    });

    const totalOvertime = overtimeDiurna + overtimeNocturna + overtimeFestivaDiurna + overtimeFestivaNocturna;
    const totalSurcharges = recargoNocturno + recargoFestivo;

    // Total Devengados Salariales
    const totalSalaryAccruals = Math.round(
      basicSalaryAccrued + 
      totalOvertime + 
      totalSurcharges + 
      salaryCommissions + 
      salaryBonuses
    );

    // Auxilio de Transporte
    // Legalmente: Aplica si devengo básico mensual <= 2 SMLMV, no es salario integral, y asiste presencial/híbrido
    const isTransportEligible = !isIntegral && (baseSalary <= (smlmv * 2));
    let transportAllowance = 0;
    if (isTransportEligible) {
      transportAllowance = Math.round((auxTransporteFull / periodDays) * workedDays);
      explanations.push({
        concept: 'Auxilio Legal de Transporte',
        formula: `($${auxTransporteFull.toLocaleString('es-CO')} / ${periodDays}) × ${workedDays} días (Aplica Salario <= 2 SMLMV)`,
        baseAmount: auxTransporteFull,
        quantity: workedDays,
        result: transportAllowance,
        legalBasis: 'Ley 15 de 1959 / Decreto Anual',
      });
    }

    const totalNonSalaryAccruals = Math.round(
      transportAllowance + 
      nonSalaryBonuses + 
      nonSalaryCommissions + 
      otherNonSalaryAccruals
    );

    const totalAccrued = totalSalaryAccruals + totalNonSalaryAccruals;

    // 8 & 9. Determinación del IBC (Ingreso Base de Cotización)
    // Aplicación de la Regla del 40% (Ley 1393 de 2010 Art. 30):
    // Los pagos no salariales que excedan el 40% de la remuneración total suman a la base de IBC.
    // Auxilio de transporte no entra en remuneración para cálculo de regla del 40%.
    const nonSalaryForRule = nonSalaryBonuses + nonSalaryCommissions + otherNonSalaryAccruals;
    const remunerationTotal = totalSalaryAccruals + nonSalaryForRule;
    const maxNonSalaryAllowed = remunerationTotal * 0.40;
    const exceeding40RuleAmount = Math.max(0, nonSalaryForRule - maxNonSalaryAllowed);

    let rawIbc = isIntegral ? (baseSalary * 0.70) : (totalSalaryAccruals + exceeding40RuleAmount);
    
    // Topes de IBC: Mínimo 1 SMLMV (proporcional si trabajó menos días), Máximo 25 SMLMV
    const minIbc = Math.round((smlmv / periodDays) * workedDays);
    const maxIbc = smlmv * legalRulesEngine.getValue('TOPE_IBC_MAX', 25);
    const ibcSecuritySocial = Math.min(Math.max(rawIbc, minIbc), maxIbc);

    explanations.push({
      concept: 'Ingreso Base de Cotización (IBC)',
      formula: isIntegral 
        ? `Salario Integral ($${baseSalary.toLocaleString('es-CO')}) × 70% factor salarial`
        : `Devengados Salariales ($${totalSalaryAccruals.toLocaleString('es-CO')}) ${exceeding40RuleAmount > 0 ? `+ Exceso 40% Ley 1393 ($${Math.round(exceeding40RuleAmount).toLocaleString('es-CO')})` : ''} [Tope min: 1 SMLMV, max: 25 SMLMV]`,
      baseAmount: rawIbc,
      result: Math.round(ibcSecuritySocial),
      legalBasis: 'Ley 100 de 1993 Art. 204 / Ley 1393 de 2010 Art. 30',
    });

    // 10. Deducciones de Seguridad Social al Empleado
    const healthRateEmployee = legalRulesEngine.getValue('SALUD_EMPLEADO', 4.0) / 100;
    const pensionRateEmployee = legalRulesEngine.getValue('PENSION_EMPLEADO', 4.0) / 100;

    const healthEmployee = Math.round(ibcSecuritySocial * healthRateEmployee);
    const pensionEmployee = Math.round(ibcSecuritySocial * pensionRateEmployee);

    explanations.push({
      concept: 'Aporte Salud Trabajador (4%)',
      formula: `IBC ($${Math.round(ibcSecuritySocial).toLocaleString('es-CO')}) × 4%`,
      baseAmount: ibcSecuritySocial,
      rateOrFactor: '4%',
      result: healthEmployee,
      legalBasis: 'Ley 100 de 1993 Art. 204 / Ley 1122 de 2007',
    });

    explanations.push({
      concept: 'Aporte Pensión Trabajador (4%)',
      formula: `IBC ($${Math.round(ibcSecuritySocial).toLocaleString('es-CO')}) × 4%`,
      baseAmount: ibcSecuritySocial,
      rateOrFactor: '4%',
      result: pensionEmployee,
      legalBasis: 'Ley 100 de 1993 Art. 20 / Ley 797 de 2003',
    });

    // Fondo de Solidaridad Pensional (si IBC >= 4 SMLMV)
    const solidarityRate = legalRulesEngine.calculateFondoSolidaridadRate(ibcSecuritySocial);
    const solidarityPensionFund = Math.round(ibcSecuritySocial * solidarityRate);
    if (solidarityPensionFund > 0) {
      explanations.push({
        concept: 'Fondo de Solidaridad Pensional',
        formula: `IBC ($${Math.round(ibcSecuritySocial).toLocaleString('es-CO')} >= 4 SMLMV) × ${(solidarityRate * 100).toFixed(1)}%`,
        baseAmount: ibcSecuritySocial,
        rateOrFactor: `${(solidarityRate * 100).toFixed(1)}%`,
        result: solidarityPensionFund,
        legalBasis: 'Ley 100 de 1993 Art. 27 / Ley 797 de 2003',
      });
    }

    // 11. Retención en la fuente (Procedimiento 1, Art. 383 E.T.)
    // Depuración tributaria simplificada en UVT:
    // Ingreso Gravado = Total Devengado - Salud - Pensión - FSP
    // Menos Renta Exenta 25% (Numeral 10 Art. 206 E.T.)
    const uvt = legalRulesEngine.getValue('UVT', 49799);
    const grossTaxableIncome = Math.max(0, totalAccrued - healthEmployee - pensionEmployee - solidarityPensionFund);
    const exemptIncome25 = grossTaxableIncome * 0.25;
    const netTaxableIncomeCop = grossTaxableIncome - exemptIncome25;
    const netTaxableIncomeUvt = netTaxableIncomeCop / uvt;

    let withholdingTax = 0;
    if (netTaxableIncomeUvt > 95) {
      if (netTaxableIncomeUvt <= 150) {
        withholdingTax = Math.round((netTaxableIncomeUvt - 95) * 0.19 * uvt);
      } else if (netTaxableIncomeUvt <= 360) {
        withholdingTax = Math.round(((netTaxableIncomeUvt - 150) * 0.28 + 10) * uvt);
      } else {
        withholdingTax = Math.round(((netTaxableIncomeUvt - 360) * 0.33 + 69) * uvt);
      }
      explanations.push({
        concept: 'Retención en la Fuente (Art. 383 E.T.)',
        formula: `Base Depurada: ${netTaxableIncomeUvt.toFixed(2)} UVT (> 95 UVT)`,
        baseAmount: netTaxableIncomeCop,
        result: withholdingTax,
        legalBasis: 'Estatuto Tributario Art. 383 (Procedimiento 1)',
      });
    }

    // 12. Total Deducciones
    const totalDeductions = Math.round(
      healthEmployee + 
      pensionEmployee + 
      solidarityPensionFund + 
      withholdingTax + 
      loanDeductions + 
      advancesDeductions + 
      garnishmentsDeductions + 
      otherDeductions
    );

    // 13. Neto a Pagar
    const netPay = Math.max(0, totalAccrued - totalDeductions);

    // 14. Aportes Patronales (Empresa)
    // Exoneración Art. 114-1 Estatuto Tributario / Ley 1607 de 2012:
    // Personas jurídicas empleadoras están exoneradas de aportar Salud patronal (8.5%), SENA (2%) e ICBF (3%)
    // por los trabajadores que devenguen individualmente menos de 10 SMLMV.
    const isExemptByArt114_1 = company.senaExempt && (totalSalaryAccruals < (smlmv * 10));

    const healthEmployer = isExemptByArt114_1 ? 0 : Math.round(ibcSecuritySocial * 0.085);
    const pensionEmployer = Math.round(ibcSecuritySocial * 0.12);
    
    const arlRate = legalRulesEngine.getARLRate(employee.riskClass || 'I');
    const arlEmployer = Math.round(ibcSecuritySocial * arlRate);

    const totalEmployerSocialSecurity = healthEmployer + pensionEmployer + arlEmployer;

    // 15. Parafiscales
    const ccfRate = legalRulesEngine.getValue('CCF_CAJA', 4.0) / 100;
    const compensationBoxEmployer = Math.round(totalSalaryAccruals * ccfRate);
    const senaEmployer = isExemptByArt114_1 ? 0 : Math.round(totalSalaryAccruals * 0.02);
    const icbfEmployer = isExemptByArt114_1 ? 0 : Math.round(totalSalaryAccruals * 0.03);
    const totalEmployerParafiscal = compensationBoxEmployer + senaEmployer + icbfEmployer;

    // 16. Provisiones Prestacionales (Empresa)
    // Base para cesantías y prima = Devengados Salariales + Auxilio de transporte
    // Salario Integral no causa cesantías ni prima en nómina ordinaria (ya están incluidas en el 30% prestacional)
    // Nota: el devengado base ya es proporcional al período (quincena = mitad del mes),
    // por lo que aplicar la tasa mensual (8.33%, 4.17%) sobre esa base da la provisión correcta.
    let severanceProvision = 0;
    let severanceInterestProvision = 0;
    let serviceBonusProvision = 0;
    let vacationProvision = 0;

    if (!isIntegral) {
      const baseForBenefits = totalSalaryAccruals + transportAllowance;
      severanceProvision = Math.round(baseForBenefits * 0.08333); // 8.33% mensual
      severanceInterestProvision = Math.round(severanceProvision * 0.12 / 12); // 1.0% mensual
      serviceBonusProvision = Math.round(baseForBenefits * 0.08333); // 8.33% mensual
      vacationProvision = Math.round(totalSalaryAccruals * 0.04167); // 4.17% mensual (sin auxilio transporte)
    } else {
      // Salario integral causa únicamente provisión de vacaciones
      vacationProvision = Math.round(totalSalaryAccruals * 0.04167);
    }

    const totalProvisions = severanceProvision + severanceInterestProvision + serviceBonusProvision + vacationProvision;

    // 17. Costo Real Empleador
    const totalCompanyCost = Math.round(
      totalAccrued + 
      totalEmployerSocialSecurity + 
      totalEmployerParafiscal + 
      totalProvisions
    );

    return {
      id: `item-${employee.id}-${Date.now()}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      employeeDoc: `${employee.documentType} ${employee.documentNumber}`,
      position: employee.position,
      department: employee.department,
      contractType: contract?.type || 'Término Indefinido',
      salaryBase: baseSalary,
      workedDays,
      
      basicSalaryAccrued,
      overtimeAccrued: Math.round(totalOvertime),
      surchargesAccrued: Math.round(totalSurcharges),
      salaryCommissionsAccrued: salaryCommissions,
      salaryBonusesAccrued: salaryBonuses,
      paidLeaveAccrued: 0,
      totalSalaryAccruals,
      
      transportAllowance,
      nonSalaryBonuses,
      nonSalaryCommissions,
      otherNonSalaryAccruals,
      totalNonSalaryAccruals,
      
      totalAccrued,
      ibcSecuritySocial,
      ibcExceeding40RuleAmount: exceeding40RuleAmount,
      
      healthEmployee,
      pensionEmployee,
      solidarityPensionFund,
      withholdingTax,
      loanDeductions,
      advancesDeductions,
      garnishmentsDeductions,
      otherDeductions,
      totalDeductions,
      
      netPay,
      
      healthEmployer,
      pensionEmployer,
      arlEmployer,
      compensationBoxEmployer,
      senaEmployer,
      icbfEmployer,
      totalEmployerSocialSecurity,
      totalEmployerParafiscal,
      
      severanceProvision,
      severanceInterestProvision,
      serviceBonusProvision,
      vacationProvision,
      totalProvisions,
      
      totalCompanyCost,
      explanations,
    };
  }

  public calculateEmployeePayroll(
    employee: Employee,
    periodDays: number = 30,
    novedades: Novedad[] = [],
    loans: any[] = [],
    company: Company,
    paidDays?: number
  ): PayrollItem {
    return this.calculateItem({
      employee,
      periodDays,
      paidDays,
      novedades,
      company,
    });
  }
}

export const payrollCalculationEngine = new PayrollCalculationEngine();
