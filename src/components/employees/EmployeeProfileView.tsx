import React, { useState } from 'react';
import { 
  Employee, 
  EmploymentContract, 
  SalaryHistoryRecord, 
  PositionHistoryRecord, 
  Loan, 
  Novedad, 
  PayrollItem, 
  Company 
} from '../../types';
import { 
  User, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  ArrowLeft, 
  Edit3, 
  PlusCircle, 
  Download, 
  FileCheck,
  Building,
  HeartHandshake,
  Shirt,
  Wrench,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface EmployeeProfileViewProps {
  employee: Employee;
  contract?: EmploymentContract;
  salaryHistory: SalaryHistoryRecord[];
  positionHistory: PositionHistoryRecord[];
  loans: Loan[];
  novedades: Novedad[];
  payrollHistory: PayrollItem[];
  company: Company;
  onBack: () => void;
  onOpenContractDoc: (emp: Employee, contract: EmploymentContract) => void;
  onOpenPayrollDoc: (item: PayrollItem) => void;
  onOpenCertificateDoc: (emp: Employee) => void;
  onOpenSalaryChangeModal: (emp: Employee) => void;
  onOpenTerminationModal: (emp: Employee, contract: EmploymentContract) => void;
  onOpenEditEmployee: (emp: Employee) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employee,
  contract,
  salaryHistory,
  positionHistory,
  loans,
  novedades,
  payrollHistory,
  company,
  onBack,
  onOpenContractDoc,
  onOpenPayrollDoc,
  onOpenCertificateDoc,
  onOpenSalaryChangeModal,
  onOpenTerminationModal,
  onOpenEditEmployee,
}) => {
  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'TIMELINE' | 'INFORMACION' | 'FINANZAS' | 'DOCUMENTOS'>('RESUMEN');

  // Filtered data for this employee
  const empSalaryHistory = salaryHistory.filter(s => s.employeeId === employee.id);
  const empLoans = loans.filter(l => l.employeeId === employee.id);
  const empNovedades = novedades.filter(n => n.employeeId === employee.id);
  const empPayrolls = payrollHistory.filter(p => p.employeeId === employee.id);

  // Financial metrics
  const lastPayroll = empPayrolls[0];
  const totalLoanBalance = empLoans.reduce((acc, curr) => acc + (curr.status === 'Activo' ? curr.balance : 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top iOS Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          Volver al Directorio
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* CRITICAL: Edit Hire Date & Profile */}
          <button
            onClick={() => onOpenEditEmployee(employee)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editar Datos & Fecha Contratación
          </button>

          <button
            onClick={() => onOpenCertificateDoc(employee)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            Certificado Laboral
          </button>
          
          <button
            onClick={() => onOpenSalaryChangeModal(employee)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Ajuste Salarial / Cargo
          </button>

          {contract && (
            <button
              onClick={() => onOpenTerminationModal(employee, contract)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Retiro & Liquidación
            </button>
          )}
        </div>
      </div>

      {/* Hero Profile Card - iOS Style */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-extrabold text-xl shadow-md border border-amber-400/50">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                employee.state === 'Activo' ? 'bg-emerald-100 text-emerald-800' :
                employee.state === 'Vacaciones' ? 'bg-blue-100 text-blue-800' :
                employee.state === 'Incapacidad' ? 'bg-amber-100 text-amber-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {employee.state}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-900">{employee.position}</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">{employee.workshopSpecialty || employee.department}</span>
              <span>•</span>
              <span className="font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{employee.code}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2">
              <span>{employee.documentType} {employee.documentNumber}</span>
              <span>•</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                Ingreso: {employee.hireDate}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Highlights Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Salario Básico</span>
            <span className="font-bold text-slate-900 font-mono text-sm">${employee.currentSalary.toLocaleString('es-CO')}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Tipo Contrato</span>
            <span className="font-bold text-slate-900">{contract?.type || 'Indefinido'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Vacaciones Pend.</span>
            <span className="font-bold text-emerald-700 font-mono">{employee.accruedVacationDays - employee.takenVacationDays} Días</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Dotación (Calzado/Overol)</span>
            <span className="font-bold text-amber-700 font-mono">{employee.dotacionSizes?.shoeSize || '41'} / {employee.dotacionSizes?.overolSize || 'L'}</span>
          </div>
        </div>
      </div>

      {/* iOS Segmented Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap items-center gap-1 border border-slate-200/60">
        <button
          onClick={() => setActiveTab('RESUMEN')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'RESUMEN' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Resumen General
        </button>
        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'TIMELINE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Historial & Timeline
        </button>
        <button
          onClick={() => setActiveTab('INFORMACION')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'INFORMACION' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Expediente & Taller
        </button>
        <button
          onClick={() => setActiveTab('FINANZAS')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'FINANZAS' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Costos & Nómina
        </button>
        <button
          onClick={() => setActiveTab('DOCUMENTOS')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'DOCUMENTOS' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Documentos & PDFs
        </button>
      </div>

      {/* TAB CONTENT: RESUMEN */}
      {activeTab === 'RESUMEN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Active Contract Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  Contrato de Trabajo Aurum Motors
                </h3>
                {contract && (
                  <button
                    onClick={() => onOpenContractDoc(employee, contract)}
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1"
                  >
                    Ver Contrato Oficial <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {contract ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Número</span>
                    <span className="font-mono font-bold text-slate-900">{contract.contractNumber}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Tipo</span>
                    <span className="font-bold text-slate-900">{contract.type}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Jornada Semanal</span>
                    <span className="font-bold text-slate-900">{contract.weeklyHours}h (Ley 2101)</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Modalidad</span>
                    <span className="font-bold text-slate-900">{contract.modality}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Fecha Inicio</span>
                    <span className="font-bold text-slate-900">{contract.startDate}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Período de Prueba</span>
                    <span className="font-bold text-slate-900">{contract.probationPeriodDays} días</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Sin contrato activo vinculado.</p>
              )}
            </div>

            {/* Latest Payroll voucher card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Última Nómina Liquidada (Agosto 2026)
                </h3>
                {lastPayroll && (
                  <button
                    onClick={() => onOpenPayrollDoc(lastPayroll)}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
                  >
                    Ver Desprendible Oficial <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {lastPayroll ? (
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-800 block text-[11px] font-semibold">Total Devengado</span>
                    <span className="font-mono font-bold text-emerald-950 text-sm">${lastPayroll.totalAccrued.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100">
                    <span className="text-rose-800 block text-[11px] font-semibold">Total Deducciones</span>
                    <span className="font-mono font-bold text-rose-950 text-sm">${lastPayroll.totalDeductions.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-2xl text-white col-span-2 flex items-center justify-between shadow-inner">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Neto Recibido</span>
                      <span className="font-mono font-bold text-emerald-400 text-base">${lastPayroll.netPay.toLocaleString('es-CO')}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Abonado a Cuenta</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Sin nóminas calculadas para este periodo.</p>
              )}
            </div>

          </div>

          {/* Column 3: Saldo Laboral & Workshop Specialty */}
          <div className="space-y-6">
            
            {/* Dotación & Workshop Spec Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Shirt className="w-4 h-4 text-amber-600" />
                Dotación & Seguridad en Taller
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Especialidad</span>
                  <span className="font-semibold text-amber-700">{employee.workshopSpecialty || 'Mecánica'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Talla Calzado</span>
                  <span className="font-mono font-bold text-slate-900">{employee.dotacionSizes?.shoeSize || '41'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Talla Overol</span>
                  <span className="font-mono font-bold text-slate-900">{employee.dotacionSizes?.overolSize || 'L'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Talla Guantes</span>
                  <span className="font-mono font-bold text-slate-900">{employee.dotacionSizes?.gloveSize || 'M'}</span>
                </div>
              </div>
            </div>

            {/* Saldo Laboral Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Saldo Laboral & Prestaciones
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Vacaciones Causadas</span>
                  <span className="font-mono font-bold text-slate-900">{employee.accruedVacationDays} Días</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-600">Vacaciones Disfrutadas</span>
                  <span className="font-mono font-medium text-slate-500">{employee.takenVacationDays} Días</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-emerald-800 font-semibold">Vacaciones Pendientes</span>
                  <span className="font-mono font-bold text-emerald-700">{employee.accruedVacationDays - employee.takenVacationDays} Días</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Saldo Préstamos Activos</span>
                  <span className="font-mono font-bold text-amber-700">${totalLoanBalance.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: INFORMACION */}
      {activeTab === 'INFORMACION' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-2xs text-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Expediente Personal y de Seguridad Social</h3>
              <p className="text-slate-500">Afiliaciones vigentes a PILA, EPS, Fondo de Pensiones, Cesantías y ARL.</p>
            </div>
            <button
              onClick={() => onOpenEditEmployee(employee)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Fecha Ingreso & Datos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
              <h4 className="font-bold text-slate-800 uppercase text-[11px]">Seguridad Social</h4>
              <div className="space-y-1.5">
                <div><span className="text-slate-400 block text-[10px]">EPS</span><strong className="text-slate-900">{employee.eps}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Fondo de Pensiones</span><strong className="text-slate-900">{employee.pensionFund}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Fondo de Cesantías</span><strong className="text-slate-900">{employee.severanceFund}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">ARL & Nivel de Riesgo</span><strong className="text-slate-900">{employee.arl} (Riesgo {employee.riskClass})</strong></div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
              <h4 className="font-bold text-slate-800 uppercase text-[11px]">Ubicación & Contacto</h4>
              <div className="space-y-1.5">
                <div><span className="text-slate-400 block text-[10px]">Dirección Domicilio</span><strong className="text-slate-900">{employee.address}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Ciudad / Región</span><strong className="text-slate-900">{employee.city}, {employee.stateRegion}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Teléfono Móvil</span><strong className="text-slate-900">{employee.phone}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Email</span><strong className="text-slate-900">{employee.email}</strong></div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
              <h4 className="font-bold text-slate-800 uppercase text-[11px]">Dispersión Bancaria</h4>
              <div className="space-y-1.5">
                <div><span className="text-slate-400 block text-[10px]">Entidad Bancaria</span><strong className="text-slate-900">{employee.bankInfo.bankName}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Tipo de Cuenta</span><strong className="text-slate-900">{employee.bankInfo.accountType}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">No. de Cuenta</span><strong className="text-slate-900 font-mono">{employee.bankInfo.accountNumber}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-2xs text-xs">
          <h3 className="font-bold text-base text-slate-900">Historial de Salarios y Cargos en Aurum Motors</h3>
          
          <div className="space-y-3">
            {empSalaryHistory.map(sh => (
              <div key={sh.id} className="p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 font-mono text-sm">${sh.salary.toLocaleString('es-CO')} COP</span>
                  <p className="text-slate-600 mt-0.5">{sh.reason}</p>
                  <span className="text-[10px] text-slate-400">Vigencia: {sh.startDate} {sh.endDate ? `hasta ${sh.endDate}` : '(Vigente)'}</span>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-full text-[10px]">
                  Registrado
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINANZAS */}
      {activeTab === 'FINANZAS' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-2xs text-xs">
          <h3 className="font-bold text-base text-slate-900">Análisis Financiero y Costo Real Empresa (Agosto 2026)</h3>
          
          {lastPayroll ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  <span className="text-emerald-800 block text-[11px] font-semibold">Neto Recibido por Empleado</span>
                  <span className="text-lg font-bold font-mono text-emerald-950">${lastPayroll.netPay.toLocaleString('es-CO')}</span>
                </div>
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl">
                  <span className="text-blue-800 block text-[11px] font-semibold">Aportes & Seguridad Social</span>
                  <span className="text-lg font-bold font-mono text-blue-950">${(lastPayroll.healthEmployee + lastPayroll.pensionEmployee + lastPayroll.pensionEmployer + lastPayroll.arlEmployer).toLocaleString('es-CO')}</span>
                </div>
                <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-inner">
                  <span className="text-slate-400 block text-[11px]">Costo Real Total Empresa</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">${lastPayroll.totalCompanyCost.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Explanatory table */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-slate-800">
                  Desglose de Costo Real para Aurum Motors
                </div>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="flex justify-between p-3">
                      <span className="text-slate-600">1. Devengados Totales Trabajador</span>
                      <span className="font-mono font-medium">${lastPayroll.totalAccrued.toLocaleString('es-CO')}</span>
                    </tr>
                    <tr className="flex justify-between p-3">
                      <span className="text-slate-600">2. Pensión Patronal (12%)</span>
                      <span className="font-mono font-medium">${lastPayroll.pensionEmployer.toLocaleString('es-CO')}</span>
                    </tr>
                    <tr className="flex justify-between p-3">
                      <span className="text-slate-600">3. ARL Riesgo {employee.riskClass}</span>
                      <span className="font-mono font-medium">${lastPayroll.arlEmployer.toLocaleString('es-CO')}</span>
                    </tr>
                    <tr className="flex justify-between p-3">
                      <span className="text-slate-600">4. Caja de Compensación (4%)</span>
                      <span className="font-mono font-medium">${lastPayroll.compensationBoxEmployer.toLocaleString('es-CO')}</span>
                    </tr>
                    <tr className="flex justify-between p-3">
                      <span className="text-slate-600">5. Provisión Cesantías (8.33%)</span>
                      <span className="font-mono font-medium">${lastPayroll.severanceProvision.toLocaleString('es-CO')}</span>
                    </tr>
                    <tr className="flex justify-between p-3">
                      <span className="text-slate-600">6. Provisión Prima de Servicios (8.33%)</span>
                      <span className="font-mono font-medium">${lastPayroll.serviceBonusProvision.toLocaleString('es-CO')}</span>
                    </tr>
                    <tr className="flex justify-between p-3">
                      <span className="text-slate-600">7. Provisión Vacaciones (4.17%)</span>
                      <span className="font-mono font-medium">${lastPayroll.vacationProvision.toLocaleString('es-CO')}</span>
                    </tr>
                    <tr className="flex justify-between p-3.5 bg-slate-50 font-bold border-t border-slate-200">
                      <span>COSTO REAL MENSUAL EMPRESA:</span>
                      <span className="font-mono text-emerald-700 text-sm">${lastPayroll.totalCompanyCost.toLocaleString('es-CO')} COP</span>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Ejecute la liquidación de nómina para consultar el análisis financiero.</p>
          )}
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTOS */}
      {activeTab === 'DOCUMENTOS' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 space-y-4 text-xs shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">Expediente Documental Digital</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contrato Laboral */}
            {contract && (
              <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:border-amber-500 transition-colors bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Contrato de Trabajo ({contract.contractNumber})</h4>
                    <p className="text-[11px] text-slate-500">Firmado digitalmente • Vigencia {contract.startDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenContractDoc(employee, contract)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl"
                >
                  Abrir / Imprimir
                </button>
              </div>
            )}

            {/* Certificado Laboral */}
            <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:border-amber-500 transition-colors bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Certificación Laboral Oficial</h4>
                  <p className="text-[11px] text-slate-500">Generación instantánea con sueldo y cargo</p>
                </div>
              </div>
              <button
                onClick={() => onOpenCertificateDoc(employee)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl"
              >
                Generar PDF
              </button>
            </div>

            {/* Desprendible de Nómina */}
            {lastPayroll && (
              <div className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between hover:border-amber-500 transition-colors bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Desprendible de Nómina (Agosto 2026)</h4>
                    <p className="text-[11px] text-slate-500">Comprobante electrónico para el empleado</p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenPayrollDoc(lastPayroll)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl"
                >
                  Ver Detalle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
