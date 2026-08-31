import React, { useState } from 'react';
import { 
  Employee, 
  PayrollItem, 
  AuditLog, 
  Company, 
  Loan, 
  Novedad 
} from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  FileSpreadsheet, 
  Activity, 
  Building,
  Calendar
} from 'lucide-react';

interface AnalyticsDashboardProps {
  company: Company;
  employees: Employee[];
  payrollItems: PayrollItem[];
  auditLogs: AuditLog[];
  novedades: Novedad[];
  loans: Loan[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  company,
  employees,
  payrollItems,
  auditLogs,
  novedades,
  loans,
}) => {
  const [activeTab, setActiveTab] = useState<'COSTOS' | 'PROVISIONES' | 'AUDITORIA'>('COSTOS');

  // Aggregations
  const totalPayrollCost = payrollItems.reduce((acc, curr) => acc + curr.totalCompanyCost, 0);
  const totalNetPay = payrollItems.reduce((acc, curr) => acc + curr.netPay, 0);
  const totalEmployerSS = payrollItems.reduce((acc, curr) => acc + curr.totalEmployerSocialSecurity + curr.totalEmployerParafiscal, 0);
  const totalProvisions = payrollItems.reduce((acc, curr) => acc + curr.totalProvisions, 0);
  const totalSeverance = payrollItems.reduce((acc, curr) => acc + curr.severanceProvision, 0);
  const totalServiceBonus = payrollItems.reduce((acc, curr) => acc + curr.serviceBonusProvision, 0);
  const totalVacation = payrollItems.reduce((acc, curr) => acc + curr.vacationProvision, 0);

  // Department cost breakdown
  const deptCostMap: Record<string, number> = {};
  payrollItems.forEach(item => {
    deptCostMap[item.department] = (deptCostMap[item.department] || 0) + item.totalCompanyCost;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-950">Inteligencia Laboral, Costos & Auditoría</h1>
          <p className="text-xs text-slate-600">
            Métricas ejecutivas de nómina, provisiones prestacionales, distribución por centros de costo y pista de auditoría inmutable.
          </p>
        </div>

        <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex gap-1 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('COSTOS')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'COSTOS' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'
            }`}
          >
            Costos & Áreas
          </button>
          <button
            onClick={() => setActiveTab('PROVISIONES')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'PROVISIONES' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'
            }`}
          >
            Balance de Provisiones
          </button>
          <button
            onClick={() => setActiveTab('AUDITORIA')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'AUDITORIA' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'
            }`}
          >
            Auditoría Inmutable ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* TAB: COSTOS & AREAS */}
      {activeTab === 'COSTOS' && (
        <div className="space-y-6">
          
          {/* Top 4 KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Gasto Real Nómina</span>
              <span className="text-xl font-bold font-mono text-slate-950 mt-1 block">
                ${totalPayrollCost.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-neutral-900 mt-1 block">100% de la carga patronal</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Neto Dispersado</span>
              <span className="text-xl font-bold font-mono text-neutral-900 mt-1 block">
                ${totalNetPay.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Pagado a cuentas de nómina</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Seguridad Social Patronal</span>
              <span className="text-xl font-bold font-mono text-blue-700 mt-1 block">
                ${totalEmployerSS.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">PILA: Pensión + ARL + Caja</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold block text-[11px]">Provisiones Causadas</span>
              <span className="text-xl font-bold font-mono text-purple-700 mt-1 block">
                ${totalProvisions.toLocaleString('es-CO')}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Cesantías, Prima, Vacaciones</span>
            </div>
          </div>

          {/* Department breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Dept distribution card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs text-xs">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-neutral-800" />
                Distribución de Costo por Centro de Costo & Área
              </h3>

              <div className="space-y-3">
                {Object.entries(deptCostMap).map(([dept, cost]) => {
                  const percent = totalPayrollCost > 0 ? (cost / totalPayrollCost) * 100 : 0;
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{dept}</span>
                        <span className="font-mono text-slate-900">${(cost ?? 0).toLocaleString('es-CO')} ({percent.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neutral-800 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ARL Risk distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs text-xs">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-800" />
                Distribución de Riesgos Laborales (ARL)
              </h3>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span>Clase I (0.522% - Oficinas, TI, Dirección)</span>
                  <span className="font-bold text-slate-900">{employees.filter(e => e.riskClass === 'I').length} Colaboradores</span>
                </div>
                <div className="flex justify-between">
                  <span>Clase II (1.044% - Comercial, Ventas)</span>
                  <span className="font-bold text-slate-900">{employees.filter(e => e.riskClass === 'II').length} Colaboradores</span>
                </div>
                <div className="flex justify-between">
                  <span>Clase III (2.436% - Logística, Bodega)</span>
                  <span className="font-bold text-slate-900">{employees.filter(e => e.riskClass === 'III').length} Colaboradores</span>
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl text-[11px] text-neutral-950">
                <strong>Beneficio Tributario Art. 114-1 E.T.:</strong> La empresa está exonerada del pago de aportes patronales a Salud (8.5%), SENA (2%) e ICBF (3%) para todos los colaboradores con remuneración inferior a 10 SMLMV.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: PROVISIONES PRESTACIONALES */}
      {activeTab === 'PROVISIONES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Pasivo Laboral y Provisiones Acumuladas</h3>
              <p className="text-xs text-slate-500">
                Causación mensual obligatoria conforme al Código Sustantivo del Trabajo
              </p>
            </div>
            <span className="font-mono font-bold text-slate-900 text-base">
              Total Acumulado: ${totalProvisions.toLocaleString('es-CO')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] font-semibold">Provisión Cesantías (8.33%)</span>
              <span className="text-lg font-bold font-mono text-slate-900 block">${totalSeverance.toLocaleString('es-CO')}</span>
              <span className="text-[10px] text-slate-400">Consignación anual al fondo</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] font-semibold">Provisión Prima Legal (8.33%)</span>
              <span className="text-lg font-bold font-mono text-slate-900 block">${totalServiceBonus.toLocaleString('es-CO')}</span>
              <span className="text-[10px] text-slate-400">Pago semestral Junio / Diciembre</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] font-semibold">Provisión Vacaciones (4.17%)</span>
              <span className="text-lg font-bold font-mono text-slate-900 block">${totalVacation.toLocaleString('es-CO')}</span>
              <span className="text-[10px] text-slate-400">15 días hábiles por año</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUDITORIA INMUTABLE */}
      {activeTab === 'AUDITORIA' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">Registro Inmutable de Auditoría & Trazabilidad</span>
              <p className="text-[11px] text-slate-500">Eventos del sistema con usuario, fecha, módulo e IP</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-200 rounded-full font-mono text-[10px] font-bold">
              {auditLogs.length} Eventos Auditados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100/70 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="p-3">Fecha / Hora</th>
                  <th className="p-3">Usuario</th>
                  <th className="p-3">Módulo</th>
                  <th className="p-3">Acción Ejecutada</th>
                  <th className="p-3">Detalle & Afectación</th>
                  <th className="p-3 font-mono text-right">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-600">{new Date(log.timestamp).toLocaleString('es-CO')}</td>
                    <td className="p-3 font-semibold text-slate-900">{log.userName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-[10px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{log.action}</td>
                    <td className="p-3 text-slate-600 max-w-sm">{log.details}</td>
                    <td className="p-3 font-mono text-slate-400 text-right">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
