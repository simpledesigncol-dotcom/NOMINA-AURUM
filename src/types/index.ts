export type DocumentType = 'CC' | 'CE' | 'TI' | 'PAS' | 'PEP' | 'PPT';

export type MaritalStatus = 'Soltero' | 'Casado' | 'Unión Libre' | 'Divorciado' | 'Viudo';

export type EmployeeState = 
  | 'Preingreso' 
  | 'Activo' 
  | 'Licencia' 
  | 'Incapacidad' 
  | 'Vacaciones' 
  | 'Suspendido' 
  | 'Retirado';

export type ContractType = 
  | 'Término Indefinido' 
  | 'Término Fijo' 
  | 'Obra o Labor' 
  | 'Aprendizaje' 
  | 'Salario Integral' 
  | 'Ocasional / Transitorio';

export type WorkModality = 'Presencial' | 'Remoto' | 'Híbrido' | 'Teletrabajo';

export type PaymentFrequency = 'Mensual' | 'Quincenal';

export type RiskClass = 'I' | 'II' | 'III' | 'IV' | 'V';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'RRHH' | 'CONTABILIDAD' | 'GERENTE' | 'EMPLEADO';

export type OvertimeType = 'HED' | 'HEN' | 'HEFD' | 'HEFN' | 'RN' | 'RDF' | 'RDNF';

export type LeaveType = 
  | 'INCAPACIDAD_GENERAL' 
  | 'INCAPACIDAD_LABORAL' 
  | 'LICENCIA_MATERNIDAD' 
  | 'LICENCIA_PATERNIDAD' 
  | 'LICENCIA_REMUNERADA' 
  | 'LICENCIA_NO_REMUNERADA' 
  | 'PERMISO_REMUNERADO' 
  | 'AUSENCIA_INJUSTIFICADA' 
  | 'SUSPENSION';

export type TerminationReason = 
  | 'Renuncia voluntaria'
  | 'Terminación por justa causa (Empleador)'
  | 'Terminación sin justa causa (Despido injustificado)'
  | 'Vencimiento de término fijo'
  | 'Terminación por mutuo acuerdo'
  | 'Terminación de obra o labor';

export interface PayrollPeriod {
  id: string;
  name: string;
  year: number;
  month: number;
  periodType: 'Mensual' | 'Quincenal';
  startDate: string;
  endDate: string;
  paymentDate: string;
  status: 'Borrador' | 'Calculada' | 'Cerrada' | 'Pagada';
  totalAccrued: number;
  totalDeductions: number;
  totalNetPay: number;
  totalEmployerCost: number;
}

export interface LegalRuleParameters {
  smlmv: number;
  auxTransporte: number;
  jornadaSemanal: number;
  saludEmpleado: number;
  pensionEmpleado: number;
  saludEmpleador: number;
  pensionEmpleador: number;
  cajaCompensacion: number;
  sena: number;
  icbf: number;
  cesantias: number;
  interesesCesantias: number;
  primaServicios: number;
  vacaciones: number;
  uvt: number;
  factorHED: number;
  factorHEN: number;
  factorHEFD: number;
  factorHEFN: number;
  factorRN: number;
  factorRDF: number;
  exoneracionArt114_1: boolean;
}

export interface Company {
  id: string;
  legalName: string; // Razón Social
  tradeName: string; // Nombre Comercial
  nit: string;
  dv: string; // Dígito de verificación
  address: string;
  city: string;
  department: string;
  phone: string;
  email: string;
  legalRepresentative: string;
  representativeDoc: string;
  economicActivity: string;
  ciiuCode: string;
  arlName: string;
  epsDefault: string;
  pensionDefault: string;
  compensationBox: string; // Caja de compensación
  senaExempt: boolean; // Exoneración Art. 114-1 ET / Ley 1607
  icbfExempt: boolean;
  healthExempt: boolean;
  pilaOperator: string;
  bankName: string;
  bankAccountType: 'Ahorros' | 'Corriente';
  bankAccountNumber: string;
  paymentFrequency: PaymentFrequency;
  weeklyWorkHours: number; // 44h en 2025/2026 bajo Ley 2101
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface BankInfo {
  bankName: string;
  accountType: 'Ahorros' | 'Corriente';
  accountNumber: string;
}

export interface SalaryHistoryRecord {
  id: string;
  employeeId: string;
  salary: number;
  startDate: string;
  endDate?: string;
  reason: string; // 'Ingreso inicial', 'Aumento anual', 'Promoción de cargo', 'Ajuste normativo SMLMV'
  contractId?: string;
  createdBy: string;
  createdAt: string;
}

export interface PositionHistoryRecord {
  id: string;
  employeeId: string;
  position: string;
  department: string;
  costCenter: string;
  startDate: string;
  endDate?: string;
  reason: string;
  createdBy: string;
}

export interface AffiliationHistoryRecord {
  id: string;
  employeeId: string;
  type: 'EPS' | 'Pensión' | 'ARL' | 'Cesantías';
  entityName: string;
  startDate: string;
  endDate?: string;
  reason?: string;
}

export interface Employee {
  id: string;
  code: string; // Código interno
  // Personal
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  expeditionCity: string;
  birthDate: string;
  gender: 'M' | 'F' | 'Otro';
  maritalStatus: MaritalStatus;
  nationality: string;
  address: string;
  city: string;
  stateRegion?: string;
  phone: string;
  email: string;
  emergencyContact: EmergencyContact;
  bankInfo: BankInfo;
  
  // Laboral
  hireDate: string;
  position: string;
  department: string;
  costCenter: string;
  immediateSupervisor?: string;
  workerType: 'Dependiente' | 'Salario Integral' | 'Aprendiz Lectiva' | 'Aprendiz Productiva' | 'Practicante';
  state: EmployeeState;
  
  // Seguridad Social
  eps: string;
  pensionFund: string;
  severanceFund: string; // Fondo de cesantías
  arl: string;
  riskClass: RiskClass;
  
  // Actual Contract Ref
  activeContractId?: string;
  currentSalary: number;
  isTransportAllowanceEligible: boolean;
  commissionEnabled?: boolean; // Recibe comisión del 10% sobre ventas
  
  // Saldo laboral / acumulados
  accruedVacationDays: number;
  takenVacationDays: number;
  compensatedVacationDays: number;
  pendingSeveranceBalance?: number;
  
  // Taller Automotriz & Dotación
  workshopSpecialty?: 'Mecánica General & Diagnóstico' | 'Detailing & Cerámica' | 'Latonería & Pintura al Horno' | 'Administración & Servicio' | 'Gerencia & Operaciones';
  dotacionSizes?: {
    shoeSize: string;
    overolSize: string;
    gloveSize?: string;
    shirtSize?: string;
    pantsSize?: string;
  };
}

export interface DotacionItem {
  id: string;
  name: string; // e.g., 'Overol Ignífugo Aurum Motors', 'Botas dieléctricas con puntera', 'Gafas de policarbonato', 'Mascarilla 3M gases/pintura'
  category: 'Calzado' | 'Vestido de Labor' | 'EPP Seguridad' | 'Protección Respiratoria' | 'Protección Visual';
  quantity: number;
  size?: string;
  condition: 'Nuevo' | 'Buen Estado';
}

export interface DotacionDelivery {
  id: string;
  employeeId: string;
  employeeName: string;
  periodLabel: 'Primera Entrega (Abril 30)' | 'Segunda Entrega (Agosto 31)' | 'Tercera Entrega (Diciembre 20)' | 'Dotación Extraordinaria / Ingreso';
  deliveryDate: string;
  items: DotacionItem[];
  shoeSize: string;
  overolSize: string;
  signedByEmployee: boolean;
  deliveredBy: string;
  notes?: string;
  status: 'Entregada' | 'Pendiente' | 'Programada';
  actNumber: string;
}

export interface SalaryAdvance {
  id: string;
  employeeId: string;
  employeeName: string;
  requestDate: string;
  disbursementDate: string;
  amount: number;
  maxAllowedAmount: number;
  reason: string; // e.g., 'Adelanto Quincena', 'Calamidad doméstica', 'Gasto médico urgente'
  deductPeriodId: string; // Periodo donde se descontará (e.g. '2026-08')
  status: 'Pendiente' | 'Aprobado' | 'Desembolsado' | 'Descontado' | 'Rechazado';
  approvedBy?: string;
  disbursedVia?: 'Transferencia Bancolombia' | 'Efectivo Caja Menor' | 'DaviPlata';
}

export interface ContractClause {
  title: string;
  content: string;
  isCustom?: boolean;
}

export interface EmploymentContract {
  id: string;
  contractNumber: string;
  employeeId: string;
  type: ContractType;
  startDate: string;
  endDate?: string; // Requerido para término fijo u obra
  position: string;
  salary: number;
  isIntegralSalary: boolean;
  hasTransportAllowance: boolean;
  paymentFrequency: PaymentFrequency;
  weeklyHours: number;
  workSchedule: string; // e.g., "Lunes a Viernes 8:00 AM - 5:00 PM, Sábados 8:00 AM - 12:00 M"
  workPlace: string;
  modality: WorkModality;
  probationPeriodDays: number; // Max 60 días o 1/5 del plazo fijo
  jobFunctions: string[];
  benefits: string[];
  clauses: ContractClause[];
  state: 'Borrador' | 'Vigente' | 'Prorrogado' | 'Terminado' | 'Suspendido';
  version: number;
  createdAt: string;
  signedDate?: string;
}

export interface LegalRule {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'SALARIOS' | 'HORAS_EXTRAS_Y_RECARGOS' | 'SEGURIDAD_SOCIAL' | 'PARAFISCALES' | 'PRESTACIONES' | 'TRIBUTARIO' | 'CONTRATOS';
  valor: number;
  unidad: '$ COP' | '%' | 'Horas' | 'Días' | 'UVT' | 'Factor';
  formula?: string;
  fechaInicio: string;
  fechaFin?: string;
  fuenteNormativa: string;
  numeroNorma: string;
  estado: 'Vigente' | 'Histórico' | 'Proyectado';
  version: string;
  year: number;
}

export type NovedadType = 
  // Tiempo / Horas extras y recargos
  | 'HED' // Hora Extra Diurna (+25%)
  | 'HEN' // Hora Extra Nocturna (+75%)
  | 'HEFD' // Hora Extra Festiva Diurna (+100% / +75%)
  | 'HEFN' // Hora Extra Festiva Nocturna (+150% / +110%)
  | 'RN' // Recargo Nocturno (+35%)
  | 'RDF' // Recargo Dominical/Festivo (+75% / +100%)
  | 'RDNF' // Recargo Dominical Nocturno (+110%)
  // Ausencias
  | 'INCAPACIDAD_GENERAL'
  | 'INCAPACIDAD_LABORAL'
  | 'LICENCIA_MATERNIDAD'
  | 'LICENCIA_PATERNIDAD'
  | 'LICENCIA_REMUNERADA'
  | 'LICENCIA_NO_REMUNERADA'
  | 'PERMISO_REMUNERADO'
  | 'AUSENCIA_INJUSTIFICADA'
  | 'SUSPENSION'
  // Vacaciones
  | 'VACACIONES_DISFRUTADAS'
  | 'VACACIONES_COMPENSADAS'
  // Ingresos
  | 'COMISION_SALARIAL'
  | 'COMISION_NO_SALARIAL'
  | 'BONO_SALARIAL'
  | 'BONO_NO_SALARIAL'
  | 'AUXILIO_RODAMIENTO'
  | 'AUXILIO_ALIMENTACION'
  | 'INCENTIVO'
  // Descuentos
  | 'ANTICIPO'
  | 'PRESTAMO_CUOTA'
  | 'EMBARGO_ALIMENTOS'
  | 'EMBARGO_COMERCIAL'
  | 'LIBRANZA'
  | 'DESCUENTO_AUTORIZADO'
  | 'OTRO_DESCUENTO';

export interface Novedad {
  id: string;
  employeeId: string;
  employeeName?: string;
  periodId?: string; // e.g. '2026-08'
  type: any;
  overtimeType?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  quantity: number; // Horas o Días
  unitRate?: number;
  calculatedValue?: number;
  amount?: number;
  isSalaryAffecting?: boolean; // Si hace base para IBC y prestaciones
  isSalaryNature?: boolean;
  observation: string;
  supportDocumentUrl?: string;
  supportNumber?: string;
  status: any;
  approvedBy?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  employeeId: string;
  employeeName?: string;
  initialAmount?: number;
  principalAmount?: number;
  balance: number;
  monthlyInstallment?: number;
  installmentAmount?: number;
  totalInstallments?: number;
  installments?: number;
  paidInstallments: number;
  interestRate?: number;
  startDate?: string;
  requestDate?: string;
  approvedDate?: string;
  description?: string;
  reason?: string;
  status: any;
}

export interface PayrollConcept {
  id: string;
  code: string;
  name: string;
  type: 'Devengado' | 'Deduccion' | 'NoSalarial' | 'AportePatronal' | 'Provision' | 'Informativo';
  affectsSalary: boolean;
  affectsIBC: boolean;
  affectsBenefits: boolean; // Afecta prima y cesantías
  affectsVacation: boolean;
  affectsWithholding: boolean; // Afecta retención
  priority: number;
}

export interface CalculationExplanationItem {
  concept: string;
  formula: string;
  baseAmount?: number;
  rateOrFactor?: number | string;
  quantity?: number;
  result: number;
  legalBasis: string;
}

export interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDoc: string;
  position: string;
  department: string;
  contractType: ContractType;
  salaryBase: number;
  workedDays: number;
  
  // Devengados Salariales
  basicSalaryAccrued: number;
  overtimeAccrued: number;
  surchargesAccrued: number;
  salaryCommissionsAccrued: number;
  salaryBonusesAccrued: number;
  paidLeaveAccrued: number;
  totalSalaryAccruals: number;
  
  // Devengados No Salariales
  transportAllowance: number;
  nonSalaryBonuses: number;
  nonSalaryCommissions: number;
  otherNonSalaryAccruals: number;
  totalNonSalaryAccruals: number;
  
  // Total Devengado
  totalAccrued: number;
  
  // Bases de cálculo
  ibcSecuritySocial: number;
  ibcExceeding40RuleAmount?: number; // Ley 1393 de 2010
  
  // Deducciones Empleado
  healthEmployee: number; // 4%
  pensionEmployee: number; // 4%
  solidarityPensionFund: number; // 1% a 2% si > 4 SMLMV
  withholdingTax: number; // Retención en la fuente Art. 383 ET
  loanDeductions: number;
  advancesDeductions: number;
  garnishmentsDeductions: number;
  otherDeductions: number;
  totalDeductions: number;
  
  // Neto a pagar
  netPay: number;
  
  // Aportes Patronales (Empresa)
  healthEmployer: number; // 8.5% (o 0% con exoneración)
  pensionEmployer: number; // 12%
  arlEmployer: number; // 0.522% a 6.960%
  compensationBoxEmployer: number; // 4%
  senaEmployer: number; // 2% (o 0% con exoneración)
  icbfEmployer: number; // 3% (o 0% con exoneración)
  totalEmployerSocialSecurity: number;
  totalEmployerParafiscal: number;
  
  // Provisiones Prestacionales Empresa
  severanceProvision: number; // 8.33% (Cesantías)
  severanceInterestProvision: number; // 1.00% (Intereses de cesantías mensual)
  serviceBonusProvision: number; // 8.33% (Prima de servicios)
  vacationProvision: number; // 4.17% (Vacaciones)
  totalProvisions: number;
  
  // Costo Real Empleador
  totalCompanyCost: number;
  
  // Explanations for transparency
  explanations: CalculationExplanationItem[];
}

export type PayrollRunStatus = 'BORRADOR' | 'EN_REVISION' | 'APROBADA' | 'CERRADA' | 'PAGADA' | 'CONTABILIZADA';

export interface PayrollRun {
  id: string;
  periodCode: string; // e.g., "2026-08" o "2026-08-Q2"
  periodName: string; // "Agosto 2026 - Mensual"
  startDate: string;
  endDate: string;
  paymentDate: string;
  status: PayrollRunStatus;
  totalEmployees: number;
  totalAccrued: number;
  totalDeductions: number;
  totalNet: number;
  totalCompanyCost: number;
  items: PayrollItem[];
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  closedAt?: string;
  paidAt?: string;
}

export interface TerminationSettlement {
  id: string;
  settlementNumber: string;
  employeeId: string;
  employeeName: string;
  employeeDoc: string;
  contractId: string;
  contractType: ContractType;
  hireDate: string;
  terminationDate: string;
  totalDaysWorked: number;
  baseSalary: number;
  averageVariableSalary: number;
  hasTransportAllowance: boolean;
  transportAllowanceAmount: number;
  settlementBaseSalary: number; // Para cesantías y prima (incluye auxilio si aplica)
  vacationBaseSalary: number; // Sin auxilio de transporte
  
  terminationReason: 
    | 'Renuncia voluntaria'
    | 'Terminación por justa causa (Empleador)'
    | 'Terminación sin justa causa (Despido injustificado)'
    | 'Vencimiento de término fijo'
    | 'Terminación por mutuo acuerdo'
    | 'Terminación de obra o labor';
  hasIndemnity: boolean;
  
  // Días liquidados
  pendingSalaryDays: number;
  pendingSalaryAmount: number;
  
  severanceDays: number;
  severanceAmount: number;
  
  severanceInterestAmount: number;
  
  serviceBonusDays: number;
  serviceBonusAmount: number;
  
  vacationPendingDays: number;
  vacationAmount: number;
  
  indemnityAmount: number; // Art. 64 CST
  otherCredits: number;
  totalAccruedCredits: number;
  
  // Deducciones
  pendingLoansDeduction: number;
  pendingAdvancesDeduction: number;
  otherDeductions: number;
  totalSettlementDeductions: number;
  
  // Neto a liquidar
  netSettlementAmount: number;
  
  // Checklist de retiro
  checklist: {
    item: string;
    completed: boolean;
    responsible: string;
  }[];
  
  // Paz y Salvo
  isPazYSalvoSigned: boolean;
  equipmentReturned: boolean;
  keysReturned: boolean;
  digitalAccessRevoked: boolean;
  
  explanations: CalculationExplanationItem[];
  status: 'Borrador' | 'Aprobada' | 'Pagada';
  createdAt: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  category: 
    | 'Contrato Laboral' 
    | 'Otrosí' 
    | 'Comprobante de Nómina' 
    | 'Liquidación Final' 
    | 'Paz y Salvo' 
    | 'Certificado Laboral' 
    | 'Incapacidad / Soporte' 
    | 'Documento de Identidad' 
    | 'Evaluación';
  title: string;
  fileName: string;
  fileType: 'PDF' | 'IMAGE' | 'DOC';
  generatedDate: string;
  version: number;
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userId?: string;
  userRole?: any;
  ipAddress: string;
  action: any;
  module: any;
  targetRecordId?: string;
  targetDescription?: string;
  previousValue?: string;
  newValue?: string;
  details?: string;
}

export interface NotificationAlert {
  id: string;
  type: 'CONTRACT_EXPIRY' | 'PROBATION_END' | 'VACATION_OVERFLOW' | 'PAYROLL_DUE' | 'MISSING_DOCUMENT' | 'INCAPACITY';
  title: string;
  description: string;
  employeeId?: string;
  employeeName?: string;
  dueDate: string;
  daysRemaining: number;
  severity: 'high' | 'medium' | 'info';
}
