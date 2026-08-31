import React, { useState } from 'react';
import { 
  Employee, 
  PayrollPeriod, 
  PayrollItem, 
  Company, 
  Novedad, 
  Loan, 
  LegalRuleParameters 
} from '../../types';
import { payrollCalculationEngine } from '../../services/payrollCalculationEngine';
import { legalRulesEngine } from '../../services/legalRulesEngine';
import { 
  Calculator, 
  FileSpreadsheet, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Download, 
  Eye, 
  AlertCircle,
  HelpCircle,
  Building,
  TrendingUp,
  Info
} from 'lucide-react';

interface PayrollDashboardProps {
  company: Company;
  employees: Employee[];
  novedades: Novedad[];
  loans: Loan[];
  currentPeriod: PayrollPeriod;
  payrollItems: PayrollItem[];
  onRecalculatePayroll: () => void;
  onOpenPayrollDoc: (item: PayrollItem) => void;
  onClosePeriod: () => void;
}

export const PayrollDashboard: React.FC<PayrollDashboardProps> = ({
  company,
  employees,
  novedades,
  loans,
  currentPeriod,
  payrollItems,
  onRecalculatePayroll,
  onOpenPayrollDoc,
  onClosePeriod,
}) => {
  const [selectedItemForInspect, setSelectedItemForInspect] = useState<PayrollItem | null>(null);
  const [filterDept, setFilterDept] = useState<string>('ALL');

  // Summary calculations
  const totalEmployeesCount = payrollItems.length;
  const totalAccruedAll = payrollItems.reduce((acc, curr) => acc + curr.totalAccrued, 0);
  const totalDeductionsAll = payrollItems.reduce((acc, curr) => acc + curr.totalDeductions, 0);
  const totalNetPayAll = payrollItems.reduce((acc, curr) => acc + curr.netPay, 0);
  const totalEmployerCostAll = payrollItems.reduce((acc, curr) => acc + curr.totalCompanyCost, 0);
  const totalProvisionsAll = payrollItems.reduce((acc, curr) => acc + curr.totalProvisions, 0);
  const totalEmployerSSAll = payrollItems.reduce((acc, curr) => acc + curr.totalEmployerSocialSecurity + curr.totalEmployerParafiscal, 0);

  const filteredItems = payrollItems.filter(item => {
    if (filterDept === 'ALL') return true;
    return item.department === filterDept;
  });

  const handleExportCSV = () => {
    const headers = [
      'Documento', 'Empleado', 'Cargo', 'Area', 'Dias', 'Basico', 'AuxTransporte',
      'HorasExtras', 'Recargos', 'Comisiones', 'BonosNoSalariales', 'TotalDevengado',
      'IBC_SaludPension', 'SaludTrabajador', 'PensionTrabajador', 'Retefuente',
      'Prestamos', 'TotalDeducciones', 'NetoPagar', 'PensionPatronal', 'ARL',
      'CajaCompensacion', 'CesantiasProvision', 'PrimaProvision', 'VacacionesProvision',
      'CostoRealEmpresa'
    ];

    const rows = payrollItems.map(p => [
      p.employeeDoc,
      `"${p.employeeName}"`,
      `"${p.position}"`,
      `"${p.department}"`,
      p.workedDays,
      p.basicSalaryAccrued,
      p.transportAllowance,
      p.overtimeAccrued,
      p.surchargesAccrued,
      p.salaryCommissionsAccrued,
      p.nonSalaryBonuses,
      p.totalAccrued,
      p.ibcSecuritySocial,
      p.healthEmployee,
      p.pensionEmployee,
      p.withholdingTax,
      p.loanDeductions,
      p.totalDeductions,
      p.netPay,
      p.pensionEmployer,
      p.arlEmployer,
      p.compensationBoxEmployer,
      p.severanceProvision,
      p.serviceBonusProvision,
      p.vacationProvision,
      p.totalCompanyCost
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nomina_${currentPeriod.month}_${currentPeriod.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Period Info & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-950">Liquidación Integral de Nómina</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              currentPeriod.status === 'Borrador' ? 'bg-amber-100 text-amber-800' :
              currentPeriod.status === 'Calculada' ? 'bg-blue-100 text-blue-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              Estado: {currentPeriod.status}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Período: <span className="font-semibold text-slate-900">{currentPeriod.name}</span> ({currentPeriod.startDate} al {currentPeriod.endDate}) • Tipo: Mensual
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRecalculatePayroll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Recalcular Nómina en Lote
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Exportar CSV / Excel
          </button>

          {currentPeriod.status !== 'Cerrada' && (
            <button
              onClick={onClosePeriod}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Aprobar & Cerrar Período
            </button>
          )}
        </div>
      </div>

      {/* Financial Metrics Summary Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 block text-[11px] font-semibold">1. Total Devengados</span>
          <span className="text-base font-bold font-mono text-slate-900 mt-1 block">
            ${totalAccruedAll.toLocaleString('es-CO')}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{totalEmployeesCount} Colaboradores</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 block text-[11px] font-semibold">2. Total Deducciones</span>
          <span className="text-base font-bold font-mono text-rose-700 mt-1 block">
            ${totalDeductionsAll.toLocaleString('es-CO')}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Salud, Pensión, Retefuente</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-emerald-900 block text-[11px] font-bold">3. Total Neto a Pagar</span>
          <span className="text-lg font-bold font-mono text-emerald-900 mt-1 block">
            ${totalNetPayAll.toLocaleString('es-CO')}
          </span>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">Dispersión bancaria</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 block text-[11px] font-semibold">4. SS & Parafiscales Patronales</span>
          <span className="text-base font-bold font-mono text-blue-700 mt-1 block">
            ${totalEmployerSSAll.toLocaleString('es-CO')}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Planilla PILA</span>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md col-span-2 lg:col-span-1">
          <span className="text-slate-300 block text-[11px] font-semibold uppercase">5. Costo Total Empresa</span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
            ${totalEmployerCostAll.toLocaleString('es-CO')}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Devengados + Aportes + Provisiones</span>
        </div>
      </div>

      {/* Payroll Matrix Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        
        {/* Table Header Filter & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">Nómina Detallada por Colaborador</span>
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium"
            >
              <option value="ALL">Todos los Departamentos</option>
              <option value="Tecnología e Innovación">Tecnología e Innovación</option>
              <option value="Comercial y Expansión">Comercial y Expansión</option>
              <option value="Operaciones e Infraestructura">Operaciones e Infraestructura</option>
              <option value="Gestión Humana">Gestión Humana</option>
              <option value="Finanzas y Contabilidad">Finanzas y Contabilidad</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Haga clic en <strong>"Explicar"</strong> para ver el desglose matemático y normativo de cada valor.</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100/70 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <th className="p-3">Empleado</th>
                <th className="p-3 text-center">Días</th>
                <th className="p-3 text-right">Básico Devengado</th>
                <th className="p-3 text-right">Aux. Transp.</th>
                <th className="p-3 text-right">Extras & Recargos</th>
                <th className="p-3 text-right">Otros Devengos</th>
                <th className="p-3 text-right font-bold text-slate-900">Total Devengado</th>
                <th className="p-3 text-right">Salud + Pensión (8%)</th>
                <th className="p-3 text-right">Retefuente / Otros</th>
                <th className="p-3 text-right font-bold text-emerald-700 bg-emerald-50/50">Neto a Pagar</th>
                <th className="p-3 text-right font-bold text-slate-900">Costo Empresa</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{item.employeeName}</div>
                    <div className="text-[11px] text-slate-500">{item.position} • {item.department}</div>
                  </td>
                  <td className="p-3 text-center font-mono font-medium">{item.workedDays || 30}</td>
                  <td className="p-3 text-right font-mono">${(item.basicSalaryAccrued ?? 0).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-right font-mono">${(item.transportAllowance ?? 0).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-right font-mono">${((item.overtimeAccrued ?? 0) + (item.surchargesAccrued ?? 0)).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-right font-mono">${((item.salaryCommissionsAccrued ?? 0) + (item.nonSalaryBonuses ?? 0)).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">${(item.totalAccrued ?? 0).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-right font-mono text-rose-700">${((item.healthEmployee ?? 0) + (item.pensionEmployee ?? 0)).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-right font-mono text-rose-700">${((item.withholdingTax ?? 0) + (item.loanDeductions ?? 0) + (item.advancesDeductions ?? 0)).toLocaleString('es-CO')}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-800 bg-emerald-50/50 text-sm">
                    ${(item.netPay ?? 0).toLocaleString('es-CO')}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ${(item.totalCompanyCost ?? 0).toLocaleString('es-CO')}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onOpenPayrollDoc(item)}
                        title="Ver Desprendible Oficial de Pago"
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedItemForInspect(item)}
                        title="Explicar cálculo paso a paso"
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory Drawer / Modal when Inspecting a Payroll Item */}
      {selectedItemForInspect && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-semibold">Trazabilidad & Explicabilidad Normativa</h2>
              </div>
              <button onClick={() => setSelectedItemForInspect(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Empleado</span>
                <span className="font-bold text-slate-900 text-sm">{selectedItemForInspect.employeeName}</span>
                <span className="text-slate-600 block">{selectedItemForInspect.position} • Básico: ${selectedItemForInspect.salaryBase.toLocaleString('es-CO')}</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase text-xs">Paso a Paso de Cálculos Aplicados:</h3>
                
                {selectedItemForInspect.explanations.map((exp, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>{exp.concept}</span>
                      <span className="font-mono text-emerald-700">${exp.value.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                      {exp.formula}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <span>Fundamento Normativo:</span>
                      <span className="font-semibold text-slate-600">{exp.legalBasis}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedItemForInspect(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs"
              >
                Cerrar Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
