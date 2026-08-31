import React, { useState, useEffect } from 'react';
import { 
  initialCompany, 
  initialEmployees, 
  initialContracts, 
  initialSalaryHistory, 
  INITIAL_POSITION_HISTORY,
  initialLoans, 
  initialNovedades, 
  initialPayrollPeriod, 
  initialPayrollItems, 
  initialAuditLogs,
  INITIAL_DOTACION_DELIVERIES,
  INITIAL_SALARY_ADVANCES
} from './data/initialData';
import { loadAllFromSupabase, saveEmployee, saveContract, saveSalaryHistory, saveLoan, saveNovedad, savePayrollPeriod, savePayrollItems, saveAuditLog, saveDotacionDelivery, saveSalaryAdvance } from './lib/supabaseData';
import { isSupabaseConfigured } from './lib/supabase';
import { 
  Employee, 
  EmploymentContract, 
  SalaryHistoryRecord, 
  PositionHistoryRecord,
  Loan, 
  Novedad, 
  PayrollPeriod, 
  PayrollItem, 
  AuditLog, 
  Company, 
  TerminationSettlement,
  DotacionDelivery,
  SalaryAdvance
} from './types';
import { payrollCalculationEngine } from './services/payrollCalculationEngine';
import { legalRulesEngine } from './services/legalRulesEngine';
import { EmployeesDirectory } from './components/employees/EmployeesDirectory';
import { EmployeeProfileView } from './components/employees/EmployeeProfileView';
import { EmployeeOnboardingModal } from './components/employees/EmployeeOnboardingModal';
import { SalaryChangeModal } from './components/employees/SalaryChangeModal';
import { EditEmployeeModal } from './components/employees/EditEmployeeModal';
import { TerminationModal } from './components/settlement/TerminationModal';
import { DotacionManager } from './components/dotacion/DotacionManager';
import { SalaryAdvancesManager } from './components/advances/SalaryAdvancesManager';
import { NovedadesManager } from './components/novedades/NovedadesManager';
import { PayrollDashboard } from './components/payroll/PayrollDashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { LegalRulesModal } from './components/legal/LegalRulesModal';
import { OfficialDocumentsModal } from './components/documents/OfficialDocumentsModal';
import { 
  Users, 
  Calculator, 
  Clock, 
  ChartColumn, 
  Scale, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  CircleAlert,
  Shirt,
  Banknote,
  Wrench,
  ChevronRight,
  RefreshCw,
  Sliders,
  CircleCheckBig,
  Package
} from 'lucide-react';

type ActiveView = 'EMPLEADOS' | 'NOMINA' | 'DOTACION' | 'ADELANTOS' | 'NOVEDADES' | 'REPORTES' | 'PERFIL_DETALLE';

export default function App() {
  // Global Application State
  const [company, setCompany] = useState<Company>(initialCompany);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [contracts, setContracts] = useState<EmploymentContract[]>(initialContracts);
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistoryRecord[]>(initialSalaryHistory);
  const [positionHistory, setPositionHistory] = useState<PositionHistoryRecord[]>(INITIAL_POSITION_HISTORY);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [novedades, setNovedades] = useState<Novedad[]>(initialNovedades);
  const [dotacionDeliveries, setDotacionDeliveries] = useState<DotacionDelivery[]>(INITIAL_DOTACION_DELIVERIES);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvance[]>(INITIAL_SALARY_ADVANCES);
  const [currentPeriod, setCurrentPeriod] = useState<PayrollPeriod>(initialPayrollPeriod);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>(initialPayrollItems);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Supabase data loading state
  const [isHydrating, setIsHydrating] = useState(true);

  // Load initial data from Supabase
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await loadAllFromSupabase();
        if (cancelled) return;
        if (remote.company) setCompany(remote.company);
        if (remote.employees.length) setEmployees(remote.employees);
        if (remote.contracts.length) setContracts(remote.contracts);
        if (remote.salaryHistory.length) setSalaryHistory(remote.salaryHistory);
        if (remote.positionHistory.length) setPositionHistory(remote.positionHistory);
        if (remote.loans.length) setLoans(remote.loans);
        if (remote.novedades.length) setNovedades(remote.novedades);
        if (remote.dotacionDeliveries.length) setDotacionDeliveries(remote.dotacionDeliveries);
        if (remote.salaryAdvances.length) setSalaryAdvances(remote.salaryAdvances);
        if (remote.payrollPeriods.length) setCurrentPeriod(remote.payrollPeriods[0]);
        if (remote.payrollItems.length) setPayrollItems(remote.payrollItems);
        if (remote.auditLogs.length) setAuditLogs(remote.auditLogs);
      } catch (err) {
        console.error('[App] Error cargando datos desde Supabase', err);
      } finally {
        if (!cancelled) setIsHydrating(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('EMPLEADOS');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Modal States
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showLegalRulesModal, setShowLegalRulesModal] = useState(false);
  const [salaryChangeEmp, setSalaryChangeEmp] = useState<Employee | null>(null);
  const [editEmployeeData, setEditEmployeeData] = useState<{ employee: Employee; contract?: EmploymentContract } | null>(null);
  const [terminationData, setTerminationData] = useState<{ employee: Employee; contract: EmploymentContract } | null>(null);

  // Document Viewer State
  const [documentModalState, setDocumentModalState] = useState<{
    isOpen: boolean;
    type: 'CONTRATO' | 'DESPRENDIBLE_NOMINA' | 'LIQUIDACION_FINAL' | 'PAZ_Y_SALVO' | 'CERTIFICADO_LABORAL' | 'OTROS_SI' | 'ACTA_DOTACION';
    employee?: Employee;
    contract?: EmploymentContract;
    payrollItem?: PayrollItem;
    settlement?: TerminationSettlement;
    dotacionDelivery?: DotacionDelivery;
    otrosiData?: any;
  }>({
    isOpen: false,
    type: 'CONTRATO',
  });

  // Helper to log audit actions
  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-001',
      userName: 'Mateo Alejandro Cárdenas (Gerente General)',
      action,
      module,
      details,
      ipAddress: '190.158.42.110 (Bogotá, CO)',
    };
    setAuditLogs(prev => [newLog, ...prev]);
    saveAuditLog(newLog);
  };

  // Recalculate Payroll Engine for all active employees
  const handleRecalculatePayroll = () => {
    const activeEmps = employees.filter(e => e.state !== 'Retirado');
    const calculatedItems = activeEmps.map(emp => {
      const empNovedades = novedades.filter(n => n.employeeId === emp.id);
      const empLoans = loans.filter(l => l.employeeId === emp.id && l.status === 'Activo');
      return payrollCalculationEngine.calculateEmployeePayroll(
        emp,
        30,
        empNovedades,
        empLoans,
        company
      );
    });

    setPayrollItems(calculatedItems);
    setCurrentPeriod(prev => ({
      ...prev,
      status: 'Calculada',
      totalAccrued: calculatedItems.reduce((a, b) => a + b.totalAccrued, 0),
      totalDeductions: calculatedItems.reduce((a, b) => a + b.totalDeductions, 0),
      totalNetPay: calculatedItems.reduce((a, b) => a + b.netPay, 0),
      totalEmployerCost: calculatedItems.reduce((a, b) => a + b.totalCompanyCost, 0),
    }));

    addAuditLog(
      'RECALCULO_NOMINA_BATCH',
      'Nómina',
      `Recálculo automático ejecutado para ${calculatedItems.length} colaboradores de taller con normativas vigentes.`
    );

    savePayrollItems(calculatedItems, currentPeriod.id);
    const updatedPeriod = {
      ...currentPeriod,
      status: 'Calculada',
      totalAccrued: calculatedItems.reduce((a, b) => a + b.totalAccrued, 0),
      totalDeductions: calculatedItems.reduce((a, b) => a + b.totalDeductions, 0),
      totalNetPay: calculatedItems.reduce((a, b) => a + b.netPay, 0),
      totalEmployerCost: calculatedItems.reduce((a, b) => a + b.totalCompanyCost, 0),
    };
    savePayrollPeriod(updatedPeriod);
  };

  // Save New Employee (from Onboarding Wizard)
  const handleSaveNewEmployee = (newEmployee: Employee, newContract: EmploymentContract) => {
    console.log('[App] handleSaveNewEmployee', newEmployee.id, newContract.id);
    setEmployees(prev => [newEmployee, ...prev]);
    setContracts(prev => [newContract, ...prev]);
    saveEmployee(newEmployee);
    saveContract(newContract);

    const initialSal: SalaryHistoryRecord = {
      id: `sh-${Date.now()}`,
      employeeId: newEmployee.id,
      contractId: newContract.id,
      salary: newEmployee.currentSalary,
      startDate: newEmployee.hireDate,
      reason: 'Salario inicial de contratación pactado',
      createdBy: 'Mateo Cárdenas (Admin)',
      createdAt: new Date().toISOString(),
    };
    setSalaryHistory(prev => [initialSal, ...prev]);
    saveSalaryHistory(initialSal);

    addAuditLog(
      'ALTA_EMPLEADO_CONTRATO',
      'Contratación',
      `Ingreso de ${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.position}) con contrato ${newContract.contractNumber}.`
    );

    setDocumentModalState({
      isOpen: true,
      type: 'CONTRATO',
      employee: newEmployee,
      contract: newContract,
    });

    setTimeout(handleRecalculatePayroll, 200);
  };

  // Edit Employee Data & Hire Date (CRITICAL for user request)
  const handleSaveEditedEmployee = (updatedEmp: Employee, updatedContractData?: Partial<EmploymentContract>) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmp.id ? updatedEmp : e));
    saveEmployee(updatedEmp);

    if (updatedContractData) {
      setContracts(prev => prev.map(c => {
        if (c.employeeId === updatedEmp.id || c.id === updatedEmp.activeContractId) {
          return {
            ...c,
            startDate: updatedContractData.startDate || c.startDate,
            position: updatedContractData.position || c.position,
            salary: updatedContractData.salary || c.salary,
            hasTransportAllowance: updatedContractData.hasTransportAllowance ?? c.hasTransportAllowance,
          };
        }
        return c;
      }));
    }

    addAuditLog(
      'ACTUALIZACION_EXPEDIENTE',
      'Expediente Personal',
      `Modificación de datos y/o fecha de contratación (${updatedEmp.hireDate}) para ${updatedEmp.firstName} ${updatedEmp.lastName}.`
    );

    setTimeout(handleRecalculatePayroll, 200);
  };

  // Salary / Position Change Handler
  const handleApplySalaryChange = (
    employeeId: string, 
    newSalary: number, 
    newPosition: string, 
    reason: string, 
    effectiveDate: string
  ) => {
    const targetEmp = employees.find(e => e.id === employeeId);
    if (!targetEmp) return;

    const previousSalary = targetEmp.currentSalary;

    setSalaryHistory(prev => 
      prev.map(sh => 
        sh.employeeId === employeeId && !sh.endDate 
          ? { ...sh, endDate: effectiveDate } 
          : sh
      )
    );

    const newSh: SalaryHistoryRecord = {
      id: `sh-${Date.now()}`,
      employeeId,
      salary: newSalary,
      startDate: effectiveDate,
      reason,
      createdBy: 'Mateo Cárdenas (Admin)',
      createdAt: new Date().toISOString(),
    };
    setSalaryHistory(prev => [newSh, ...prev]);
    saveSalaryHistory(newSh);

    const smlmv = legalRulesEngine.getSMLMV();
    saveEmployee({
      ...targetEmp,
      currentSalary: newSalary,
      position: newPosition,
      isTransportAllowanceEligible: newSalary <= (smlmv * 2) && targetEmp.workerType !== 'Salario Integral',
    });
    setEmployees(prev => 
      prev.map(e => 
        e.id === employeeId 
          ? { 
              ...e, 
              currentSalary: newSalary, 
              position: newPosition,
              isTransportAllowanceEligible: newSalary <= (smlmv * 2) && e.workerType !== 'Salario Integral'
            } 
          : e
      )
    );

    addAuditLog(
      'MODIFICACION_SALARIO_CARGO',
      'Historial Salarial',
      `Ajuste salarial para ${targetEmp.firstName} ${targetEmp.lastName}: de $${previousSalary.toLocaleString('es-CO')} a $${newSalary.toLocaleString('es-CO')} (${reason}).`
    );

    setDocumentModalState({
      isOpen: true,
      type: 'OTROS_SI',
      employee: { ...targetEmp, currentSalary: newSalary, position: newPosition },
      otrosiData: {
        type: 'SALARIO',
        newSalary,
        newPosition,
        effectiveDate,
        reason,
      },
    });

    handleRecalculatePayroll();
  };

  // Termination Settlement Handler
  const handleConfirmTermination = (settlement: TerminationSettlement) => {
    setEmployees(prev => 
      prev.map(e => e.id === settlement.employeeId ? { ...e, state: 'Retirado' } : e)
    );
    const retiredEmp = employees.find(e => e.id === settlement.employeeId);
    if (retiredEmp) saveEmployee({ ...retiredEmp, state: 'Retirado' });

    if (settlement.pendingLoansDeduction > 0) {
      setLoans(prev => 
        prev.map(l => l.employeeId === settlement.employeeId ? { ...l, balance: 0, status: 'Cancelado' } : l)
      );
      loans.filter(l => l.employeeId === settlement.employeeId)
        .forEach(l => saveLoan({ ...l, balance: 0, status: 'Cancelado' }));
    }

    addAuditLog(
      'TERMINACION_LIQUIDACION',
      'Liquidación Final',
      `Liquidación final registrada para ${settlement.employeeName}. Neto a pagar: $${settlement.netSettlementAmount.toLocaleString('es-CO')} COP.`
    );

    const emp = employees.find(e => e.id === settlement.employeeId);
    setDocumentModalState({
      isOpen: true,
      type: 'LIQUIDACION_FINAL',
      employee: emp,
      settlement: settlement,
    });

    handleRecalculatePayroll();
  };

  // Dotación Delivery Handler
  const handleSaveDotacionDelivery = (delivery: DotacionDelivery) => {
    setDotacionDeliveries(prev => [delivery, ...prev]);
    saveDotacionDelivery(delivery);
    const emp = employees.find(e => e.id === delivery.employeeId);

    addAuditLog(
      'ENTREGA_DOTACION_EPP',
      'Dotación SG-SST',
      `Entrega de dotación registrada para ${delivery.employeeName} (${delivery.periodLabel}) con acta ${delivery.actNumber}.`
    );

    if (emp) {
      setDocumentModalState({
        isOpen: true,
        type: 'ACTA_DOTACION',
        employee: emp,
        dotacionDelivery: delivery,
      });
    }
  };

  // Salary Advance Handler
  const handleSaveSalaryAdvance = (advance: SalaryAdvance) => {
    setSalaryAdvances(prev => [advance, ...prev]);
    saveSalaryAdvance(advance);

    // Create a novelty to deduct it automatically in payroll
    const advanceNovedad: Novedad = {
      id: `nov-adv-${Date.now()}`,
      employeeId: advance.employeeId,
      employeeName: advance.employeeName,
      periodId: advance.deductPeriodId,
      type: 'PRESTAMO_CUOTA',
      date: advance.disbursementDate,
      quantity: 1,
      calculatedValue: advance.amount,
      isSalaryAffecting: false,
      observation: `Descuento de anticipo de nómina: ${advance.reason}`,
      status: 'Aprobada',
      approvedBy: advance.approvedBy,
      createdAt: new Date().toISOString(),
    };
    setNovedades(prev => [advanceNovedad, ...prev]);
    saveNovedad(advanceNovedad);

    addAuditLog(
      'SOLICITUD_ADELANTO_NOMINA',
      'Adelantos & Anticipos',
      `Adelanto de $${advance.amount.toLocaleString('es-CO')} COP aprobado para ${advance.employeeName}.`
    );

    setTimeout(handleRecalculatePayroll, 200);
  };

  const handleUpdateAdvanceStatus = (id: string, status: any) => {
    setSalaryAdvances(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Open Employee Profile Detail
  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployeeId(emp.id);
    setActiveView('PERFIL_DETALLE');
  };

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);
  const selectedContract = contracts.find(c => c.employeeId === selectedEmployeeId || c.id === selectedEmployee?.activeContractId);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-sans antialiased pb-20 selection:bg-neutral-700 selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. iOS FROSTED GLASS TOP BAR (Header) */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-neutral-950 to-neutral-900 text-white flex items-center justify-center font-black text-lg shadow-md border border-neutral-700/30">
              <Wrench className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                  AURUM MOTORS
                </span>
                <span className="px-2 py-0.5 bg-neutral-200/80 text-neutral-950 font-semibold text-[10px] rounded-full">
                  Taller & Detailing
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Mecánica Especializada • Detailing Cerámico • Latonería y Pintura al Horno
              </p>
            </div>
          </div>

          {/* Quick iOS Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegalRulesModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/60 transition-colors shadow-2xs"
            >
              <Scale className="w-3.5 h-3.5 text-neutral-800" />
              <span className="hidden md:inline">Normativa 2026 (Ley 2466 / 2101)</span>
              <span className="md:hidden">Leyes</span>
            </button>

            <button
              onClick={handleRecalculatePayroll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/60 transition-colors shadow-2xs"
              title="Recalcular Nómina de Taller"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Recalcular</span>
            </button>

            <button
              onClick={() => setShowOnboardingModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-700 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Contratar</span>
            </button>
          </div>
        </div>

        {/* iOS Segmented Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5 pt-1 overflow-x-auto no-scrollbar">
          <div className="bg-slate-200/60 p-1 rounded-2xl inline-flex items-center gap-1 min-w-max border border-slate-300/40">
            <button
              onClick={() => setActiveView('EMPLEADOS')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'EMPLEADOS' || activeView === 'PERFIL_DETALLE'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-neutral-800" />
              Colaboradores ({employees.length})
            </button>

            <button
              onClick={() => setActiveView('NOMINA')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'NOMINA'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-neutral-800" />
              Liquidación de Nómina
            </button>

            <button
              onClick={() => setActiveView('DOTACION')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'DOTACION'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-neutral-800" />
              Dotación & EPP
            </button>

            <button
              onClick={() => setActiveView('ADELANTOS')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'ADELANTOS'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Banknote className="w-3.5 h-3.5 text-neutral-800" />
              Adelantos & Préstamos
            </button>

            <button
              onClick={() => setActiveView('NOVEDADES')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'NOVEDADES'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Horas Extras & Novedades
            </button>

            <button
              onClick={() => setActiveView('REPORTES')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'REPORTES'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ChartColumn className="w-3.5 h-3.5 text-purple-600" />
              Costos & Auditoría
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN APPLICATION VIEWS */}
      {/* ============================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* VIEW 1: EMPLOYEES DIRECTORY */}
        {activeView === 'EMPLEADOS' && (
          <EmployeesDirectory
            employees={employees}
            contracts={contracts}
            company={company}
            onSelectEmployee={handleSelectEmployee}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
            onOpenContractDoc={(emp, contract) => {
              setDocumentModalState({
                isOpen: true,
                type: 'CONTRATO',
                employee: emp,
                contract: contract,
              });
            }}
            onOpenCertificateDoc={emp => {
              setDocumentModalState({
                isOpen: true,
                type: 'CERTIFICADO_LABORAL',
                employee: emp,
              });
            }}
            onOpenSalaryChangeModal={emp => setSalaryChangeEmp(emp)}
            onOpenTerminationModal={(emp, contract) => setTerminationData({ employee: emp, contract })}
            onOpenEditEmployee={emp => {
              const contract = contracts.find(c => c.employeeId === emp.id || c.id === emp.activeContractId);
              setEditEmployeeData({ employee: emp, contract });
            }}
          />
        )}

        {/* VIEW 2: EMPLOYEE PROFILE DETAIL */}
        {activeView === 'PERFIL_DETALLE' && selectedEmployee && (
          <EmployeeProfileView
            employee={selectedEmployee}
            contract={selectedContract}
            salaryHistory={salaryHistory}
            positionHistory={positionHistory}
            loans={loans}
            novedades={novedades}
            payrollHistory={payrollItems}
            company={company}
            onBack={() => setActiveView('EMPLEADOS')}
            onOpenContractDoc={(emp, contract) => {
              setDocumentModalState({
                isOpen: true,
                type: 'CONTRATO',
                employee: emp,
                contract: contract,
              });
            }}
            onOpenPayrollDoc={item => {
              setDocumentModalState({
                isOpen: true,
                type: 'DESPRENDIBLE_NOMINA',
                payrollItem: item,
                employee: selectedEmployee,
              });
            }}
            onOpenCertificateDoc={emp => {
              setDocumentModalState({
                isOpen: true,
                type: 'CERTIFICADO_LABORAL',
                employee: emp,
              });
            }}
            onOpenSalaryChangeModal={emp => setSalaryChangeEmp(emp)}
            onOpenTerminationModal={(emp, contract) => setTerminationData({ employee: emp, contract })}
            onOpenEditEmployee={emp => {
              const contract = contracts.find(c => c.employeeId === emp.id || c.id === emp.activeContractId);
              setEditEmployeeData({ employee: emp, contract });
            }}
          />
        )}

        {/* VIEW 3: PAYROLL DASHBOARD */}
        {activeView === 'NOMINA' && (
          <PayrollDashboard
            company={company}
            employees={employees}
            novedades={novedades}
            loans={loans}
            currentPeriod={currentPeriod}
            payrollItems={payrollItems}
            onRecalculatePayroll={handleRecalculatePayroll}
            onOpenPayrollDoc={item => {
              const emp = employees.find(e => e.id === item.employeeId);
              setDocumentModalState({
                isOpen: true,
                type: 'DESPRENDIBLE_NOMINA',
                payrollItem: item,
                employee: emp,
                periodName: currentPeriod.name,
              });
            }}
            onClosePeriod={() => {
              const closed = { ...currentPeriod, status: 'Cerrada' };
              setCurrentPeriod(closed);
              savePayrollPeriod(closed);
              addAuditLog('CIERRE_PERIODO_NOMINA', 'Nómina', `Período ${currentPeriod.name} cerrado exitosamente.`);
            }}
          />
        )}

        {/* VIEW 4: DOTACION & EPP MANAGER */}
        {activeView === 'DOTACION' && (
          <DotacionManager
            employees={employees}
            dotacionDeliveries={dotacionDeliveries}
            company={company}
            onSaveDelivery={handleSaveDotacionDelivery}
            onOpenDotacionDoc={(delivery, emp) => {
              setDocumentModalState({
                isOpen: true,
                type: 'ACTA_DOTACION',
                employee: emp,
                dotacionDelivery: delivery,
              });
            }}
            onUpdateEmployeeSizes={(empId, sizes) => {
              setEmployees(prev => prev.map(e => e.id === empId ? { ...e, dotacionSizes: { ...e.dotacionSizes, ...sizes, shirtSize: sizes.overolSize, pantsSize: '32' } } : e));
            }}
          />
        )}

        {/* VIEW 5: SALARY ADVANCES & LOANS */}
        {activeView === 'ADELANTOS' && (
          <SalaryAdvancesManager
            employees={employees}
            advances={salaryAdvances}
            loans={loans}
            company={company}
            onSaveAdvance={handleSaveSalaryAdvance}
            onUpdateAdvanceStatus={handleUpdateAdvanceStatus}
          />
        )}

        {/* VIEW 6: NOVEDADES & HORAS EXTRAS */}
        {activeView === 'NOVEDADES' && (
          <NovedadesManager
            employees={employees}
            novedades={novedades}
            loans={loans}
            company={company}
            onAddNovedad={newNov => {
              setNovedades(prev => [newNov, ...prev]);
              saveNovedad(newNov);
              addAuditLog('REGISTRO_NOVEDAD', 'Novedades', `${newNov.type} registrada para ${newNov.employeeName}.`);
              setTimeout(handleRecalculatePayroll, 200);
            }}
            onAddLoan={newLoan => {
              setLoans(prev => [newLoan, ...prev]);
              saveLoan(newLoan);
              addAuditLog('NUEVO_PRESTAMO', 'Préstamos', `Préstamo por $${newLoan.initialAmount || newLoan.principalAmount} creado para ${newLoan.employeeName}.`);
              setTimeout(handleRecalculatePayroll, 200);
            }}
          />
        )}

        {/* VIEW 7: ANALYTICS & AUDIT */}
        {activeView === 'REPORTES' && (
          <AnalyticsDashboard
            employees={employees}
            payrollItems={payrollItems}
            auditLogs={auditLogs}
            company={company}
          />
        )}

      </main>

      {/* ============================================================ */}
      {/* 3. MODAL COMPONENTS */}
      {/* ============================================================ */}
      
      {/* A. Edit Employee & Hire Date Modal */}
      <EditEmployeeModal
        isOpen={!!editEmployeeData}
        employee={editEmployeeData?.employee || null}
        contract={editEmployeeData?.contract}
        onClose={() => setEditEmployeeData(null)}
        onSave={handleSaveEditedEmployee}
      />

      {/* B. Onboarding Wizard Modal */}
      <EmployeeOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSave={handleSaveNewEmployee}
        company={company}
      />

      {/* C. Salary Change Modal */}
      <SalaryChangeModal
        isOpen={!!salaryChangeEmp}
        employee={salaryChangeEmp}
        company={company}
        onClose={() => setSalaryChangeEmp(null)}
        onSave={handleApplySalaryChange}
      />

      {/* D. Termination Settlement Modal */}
      {terminationData && (
        <TerminationModal
          isOpen={!!terminationData}
          employee={terminationData.employee}
          contract={terminationData.contract}
          loans={loans}
          company={company}
          onClose={() => setTerminationData(null)}
          onConfirm={handleConfirmTermination}
        />
      )}

      {/* E. Legal Rules Modal */}
      <LegalRulesModal
        isOpen={showLegalRulesModal}
        onClose={() => setShowLegalRulesModal(false)}
        onRulesUpdated={handleRecalculatePayroll}
      />

      {/* F. Official Documents Modal */}
      <OfficialDocumentsModal
        isOpen={documentModalState.isOpen}
        documentType={documentModalState.type}
        company={company}
        employee={documentModalState.employee}
        contract={documentModalState.contract}
        payrollItem={documentModalState.payrollItem}
        settlement={documentModalState.settlement}
        dotacionDelivery={documentModalState.dotacionDelivery}
        otrosiData={documentModalState.otrosiData}
        onClose={() => setDocumentModalState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
