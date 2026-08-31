import React, { useState } from 'react';
import { Employee, SalaryAdvance, Loan, Company } from '../../types';
import { 
  Banknote, 
  Plus, 
  CircleCheckBig, 
  Clock, 
  CircleX, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  CircleAlert,
  TrendingDown,
  ArrowDownRight,
  ShieldAlert,
  Send
} from 'lucide-react';

interface SalaryAdvancesManagerProps {
  employees: Employee[];
  advances: SalaryAdvance[];
  loans: Loan[];
  company: Company;
  onSaveAdvance: (advance: SalaryAdvance) => void;
  onUpdateAdvanceStatus: (id: string, status: 'Aprobado' | 'Desembolsado' | 'Rechazado' | 'Descontado') => void;
}

export const SalaryAdvancesManager: React.FC<SalaryAdvancesManagerProps> = ({
  employees,
  advances,
  loans,
  company,
  onSaveAdvance,
  onUpdateAdvanceStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'ADVANCES' | 'LOANS' | 'NEW_ADVANCE'>('ADVANCES');

  // Form state for new advance
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [amount, setAmount] = useState<number>(300000);
  const [reason, setReason] = useState<string>('Adelanto de quincena ordinario');
  const [disbursedVia, setDisbursedVia] = useState<any>('Transferencia Bancolombia');
  const [deductPeriodId, setDeductPeriodId] = useState<string>('2026-08');

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
  const maxAllowed = selectedEmp ? Math.round(selectedEmp.currentSalary * 0.5) : 0; // Max 50% de salario mensual

  const handleCreateAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const newAdvance: SalaryAdvance = {
      id: `adv-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      requestDate: new Date().toISOString().split('T')[0],
      disbursementDate: new Date().toISOString().split('T')[0],
      amount: amount,
      maxAllowedAmount: maxAllowed,
      reason: reason,
      deductPeriodId: deductPeriodId,
      status: 'Aprobado',
      approvedBy: 'Mateo Alejandro Cárdenas (Admin)',
      disbursedVia: disbursedVia,
    };

    onSaveAdvance(newAdvance);
    setActiveTab('ADVANCES');
  };

  const totalActiveAdvances = advances
    .filter(a => a.status === 'Aprobado' || a.status === 'Desembolsado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalActiveLoans = loans
    .filter(l => l.status === 'Activo')
    .reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-700/10 text-neutral-800 flex items-center justify-center shadow-inner">
            <Banknote className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">Tesorería & Beneficios</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-semibold rounded-full">Descuento en Nómina</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Adelantos de Quincena & Préstamos de Taller</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestión controlada de anticipos salariales (máx 50% de salario devengado) y créditos corporativos para herramientas.
            </p>
          </div>
        </div>

        {/* iOS Segmented Control */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('ADVANCES')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'ADVANCES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Adelantos de Quincena ({advances.length})
          </button>
          <button
            onClick={() => setActiveTab('LOANS')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'LOANS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Libranzas & Créditos ({loans.length})
          </button>
          <button
            onClick={() => setActiveTab('NEW_ADVANCE')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'NEW_ADVANCE'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Solicitar Adelanto
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Total Adelantos por Descontar (Agosto)</span>
            <ArrowDownRight className="w-4 h-4 text-neutral-800" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            ${totalActiveAdvances.toLocaleString('es-CO')} COP
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Se descuentan automáticamente en la liquidación del período</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Saldo Cartera de Préstamos Activos</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            ${totalActiveLoans.toLocaleString('es-CO')} COP
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Créditos de bienestar con 0% tasa de interés</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Límite Máximo de Endeudamiento</span>
            <ShieldAlert className="w-4 h-4 text-neutral-800" />
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            50% Salario
          </p>
          <p className="text-[10px] text-neutral-900 font-medium mt-1">Conforme a la protección del mínimo vital (Art. 149 CST)</p>
        </div>
      </div>

      {/* VIEW: ADVANCES LIST */}
      {activeTab === 'ADVANCES' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-800" />
              Solicitudes y Anticipos Salariales Registrados
            </h2>
            <button
              onClick={() => setActiveTab('NEW_ADVANCE')}
              className="text-xs font-semibold text-neutral-800 hover:text-neutral-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Adelanto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advances.map(adv => (
              <div 
                key={adv.id}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 flex flex-col justify-between hover:border-neutral-600 hover:shadow-xs transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{adv.employeeName}</h3>
                      <p className="text-xs text-slate-500">{adv.reason}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      adv.status === 'Aprobado' || adv.status === 'Desembolsado'
                        ? 'bg-neutral-100 text-neutral-900'
                        : adv.status === 'Descontado'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-neutral-200 text-neutral-900'
                    }`}>
                      {adv.status}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Monto del Anticipo:</span>
                      <span className="text-base font-extrabold text-neutral-800 font-mono">
                        ${adv.amount.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Descuento programado:</span>
                      <span className="text-xs font-bold text-slate-800">Nómina {adv.deductPeriodId}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Desembolso: {adv.disbursedVia}</span>
                    <span>Fecha: {adv.disbursementDate}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Aprobado por: {adv.approvedBy || 'Admin'}</span>
                  {adv.status === 'Aprobado' && (
                    <button
                      onClick={() => onUpdateAdvanceStatus(adv.id, 'Descontado')}
                      className="px-3 py-1 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-[11px] font-semibold transition-colors"
                    >
                      Marcar Descontado
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: LOANS LIST */}
      {activeTab === 'LOANS' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Créditos de Bienestar y Préstamos de Taller</h2>
              <p className="text-xs text-slate-500">Deducción de cuotas fijas mensuales mediante libranza legal autorizada.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map(loan => (
              <div key={loan.id} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{loan.employeeName || 'Colaborador Aurum Motors'}</h3>
                    <p className="text-xs text-slate-500">{loan.description}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                    {loan.status}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Monto Inicial Prestado:</span>
                    <strong className="text-slate-800">${(loan.initialAmount || loan.principalAmount || 0).toLocaleString('es-CO')} COP</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Saldo Pendiente:</span>
                    <strong className="text-neutral-900 font-bold">${(loan.balance ?? 0).toLocaleString('es-CO')} COP</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cuota Mensual a Descontar:</span>
                    <strong className="text-slate-800 font-mono">${(loan.monthlyInstallment || loan.installmentAmount || 0).toLocaleString('es-CO')} COP</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Progreso de Pago:</span>
                    <strong className="text-slate-800">{loan.paidInstallments} de {loan.totalInstallments || loan.installments} cuotas</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.round((loan.paidInstallments / (loan.totalInstallments || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: NEW ADVANCE FORM */}
      {activeTab === 'NEW_ADVANCE' && (
        <form onSubmit={handleCreateAdvance} className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200/80 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registrar Solicitud de Adelanto de Quincena</h2>
              <p className="text-xs text-slate-500">Aprobación inmediata para desembolso vía transferencia o caja menor con descuento programado.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('ADVANCES')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Colaborador Solicitante *</label>
              <select
                value={selectedEmpId}
                onChange={e => {
                  setSelectedEmpId(e.target.value);
                  const emp = employees.find(x => x.id === e.target.value);
                  if (emp) {
                    setAmount(Math.min(amount, Math.round(emp.currentSalary * 0.5)));
                  }
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-neutral-700"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} — ${e.currentSalary.toLocaleString('es-CO')} COP
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Monto del Adelanto ($ COP) *</label>
              <input
                type="number"
                min={50000}
                max={maxAllowed}
                step={50000}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-neutral-700"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Límite legal sugerido (50% salario): <strong>${maxAllowed.toLocaleString('es-CO')} COP</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Motivo del Anticipo</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-neutral-700"
              >
                <option value="Adelanto de quincena ordinario">Adelanto de quincena ordinario</option>
                <option value="Calamidad doméstica comprobada">Calamidad doméstica comprobada</option>
                <option value="Gasto médico o farmacéutico urgente">Gasto médico o farmacéutico urgente</option>
                <option value="Matrícula educativa o útiles">Matrícula educativa o útiles</option>
                <option value="Adquisición de kit de herramientas de taller">Adquisición de herramientas de taller</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Medio de Desembolso</label>
              <select
                value={disbursedVia}
                onChange={e => setDisbursedVia(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-neutral-700"
              >
                <option value="Transferencia Bancolombia">Transferencia Bancolombia</option>
                <option value="DaviPlata">DaviPlata</option>
                <option value="Efectivo Caja Menor">Efectivo Caja Menor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Período de Descuento en Nómina</label>
              <select
                value={deductPeriodId}
                onChange={e => setDeductPeriodId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-neutral-700"
              >
                <option value="2026-08">Nómina Agosto 2026</option>
                <option value="2026-09">Nómina Septiembre 2026</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('ADVANCES')}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-2xl text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-2xl text-xs font-bold shadow-xs transition-colors"
            >
              Aprobar y Registrar Adelanto
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
