import React, { useState } from 'react';
import { 
  Employee, 
  Novedad, 
  NovedadType, 
  OvertimeType, 
  LeaveType, 
  Loan, 
  Company 
} from '../../types';
import { legalRulesEngine } from '../../services/legalRulesEngine';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  CirclePlus, 
  CircleCheckBig, 
  HeartHandshake, 
  CircleAlert, 
  FileText, 
  ShieldCheck,
  Percent,
  Search,
  ListFilter
} from 'lucide-react';

interface NovedadesManagerProps {
  employees: Employee[];
  novedades: Novedad[];
  loans: Loan[];
  company: Company;
  onAddNovedad: (novedad: Novedad) => void;
  onAddLoan: (loan: Loan) => void;
}

export const NovedadesManager: React.FC<NovedadesManagerProps> = ({
  employees,
  novedades,
  loans,
  company,
  onAddNovedad,
  onAddLoan,
}) => {
  const [activeTab, setActiveTab] = useState<'NOVEDADES' | 'HORAS_EXTRAS' | 'PRESTAMOS' | 'INCAPACIDADES'>('NOVEDADES');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for adding novelty
  const [noveltyType, setNoveltyType] = useState<NovedadType>('HORA_EXTRA');
  const [overtimeType, setOvertimeType] = useState<OvertimeType>('HED');
  const [quantity, setQuantity] = useState<number>(4);
  const [amount, setAmount] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [observation, setObservation] = useState<string>('Actividad extraordinaria programada');
  const [isSalaryNature, setIsSalaryNature] = useState<boolean>(true);

  // Loan state
  const [loanPrincipal, setLoanPrincipal] = useState<number>(1000000);
  const [loanInstallments, setLoanInstallments] = useState<number>(6);
  const [loanReason, setLoanReason] = useState<string>('Calamidad doméstica / Educación');

  const selectedEmp = employees.find(e => e.id === selectedEmpId);
  const hourlyRate = selectedEmp ? selectedEmp.currentSalary / 230 : 0;

  // Auto calculate overtime amount
  const calculateOvertimeCost = (ot: OvertimeType, hrs: number) => {
    const mult = legalRulesEngine.getOvertimeMultiplier(ot);
    return Math.round(hourlyRate * mult * hrs);
  };

  const handleCreateNovelty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    let finalAmount = amount;
    if (noveltyType === 'HORA_EXTRA' || noveltyType === 'RECARGO') {
      finalAmount = calculateOvertimeCost(overtimeType, quantity);
    }

    // La opción UI 'COMISION' se resuelve a su tipo de nómina real:
    // COMISION_SALARIAL (naturaleza salarial) o COMISION_NO_SALARIAL.
    const resolvedType: string =
      noveltyType === 'COMISION'
        ? (isSalaryNature ? 'COMISION_SALARIAL' : 'COMISION_NO_SALARIAL')
        : noveltyType;

    const newNov: Novedad = {
      id: `nov-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      type: resolvedType as NovedadType,
      overtimeType: (noveltyType === 'HORA_EXTRA' || noveltyType === 'RECARGO') ? overtimeType : undefined,
      quantity,
      amount: finalAmount,
      calculatedValue: finalAmount,
      isSalaryNature,
      startDate,
      endDate: (noveltyType === 'INCAPACIDAD' || noveltyType === 'VACACIONES' || noveltyType === 'LICENCIA') ? endDate : undefined,
      observation,
      status: 'Aprobado',
      createdAt: new Date().toISOString(),
      approvedBy: 'Dirección de Gestión Humana',
    };

    onAddNovedad(newNov);
    setShowAddModal(false);
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const installmentAmt = Math.round(loanPrincipal / loanInstallments);
    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      requestDate: new Date().toISOString().split('T')[0],
      approvedDate: new Date().toISOString().split('T')[0],
      principalAmount: loanPrincipal,
      installments: loanInstallments,
      installmentAmount: installmentAmt,
      balance: loanPrincipal,
      status: 'Activo',
      reason: loanReason,
      paidInstallments: 0,
    };

    onAddLoan(newLoan);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950">Gestión de Novedades e Incidencias Laborales</h1>
          <p className="text-xs text-slate-600">
            Registro con afectación automática a la nómina: Horas Extras, Recargos Ley 2466, Incapacidades, Vacaciones, Préstamos y Bonos.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <CirclePlus className="w-4 h-4" />
          Registrar Nueva Novedad / Préstamo
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex gap-1 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('NOVEDADES')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'NOVEDADES' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'hover:bg-slate-100'
          }`}
        >
          Todas las Novedades ({novedades.length})
        </button>
        <button
          onClick={() => setActiveTab('HORAS_EXTRAS')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'HORAS_EXTRAS' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'hover:bg-slate-100'
          }`}
        >
          Horas Extras & Recargos
        </button>
        <button
          onClick={() => setActiveTab('PRESTAMOS')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'PRESTAMOS' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'hover:bg-slate-100'
          }`}
        >
          Préstamos Corporativos ({loans.length})
        </button>
        <button
          onClick={() => setActiveTab('INCAPACIDADES')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'INCAPACIDADES' ? 'bg-slate-900 text-white shadow-2xs font-bold' : 'hover:bg-slate-100'
          }`}
        >
          Incapacidades & Licencias
        </button>
      </div>

      {/* Content for Novedades & Overtime */}
      {(activeTab === 'NOVEDADES' || activeTab === 'HORAS_EXTRAS' || activeTab === 'INCAPACIDADES') && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Listado de Novedades para Período en Curso</span>
            <span className="text-slate-500 font-mono text-[11px]">Agosto 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100/70 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="p-3">Empleado</th>
                  <th className="p-3">Tipo de Novedad</th>
                  <th className="p-3 text-center">Cantidad / Días</th>
                  <th className="p-3 text-right">Valor Afectación</th>
                  <th className="p-3">Naturaleza</th>
                  <th className="p-3">Observación</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {novedades
                  .filter(n => {
                    if (activeTab === 'HORAS_EXTRAS') return n.type === 'HORA_EXTRA' || n.type === 'RECARGO';
                    if (activeTab === 'INCAPACIDADES') return n.type === 'INCAPACIDAD' || n.type === 'LICENCIA' || n.type === 'VACACIONES';
                    return true;
                  })
                  .map(nov => (
                    <tr key={nov.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">{nov.employeeName}</td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-800 text-[11px]">
                          {nov.type} {nov.overtimeType ? `(${nov.overtimeType})` : ''}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-medium">
                        {nov.quantity} {nov.type === 'HORA_EXTRA' || nov.type === 'RECARGO' ? 'horas' : 'días'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ${(nov.amount ?? 0).toLocaleString('es-CO')}
                      </td>
                      <td className="p-3">
                        {nov.isSalaryNature ? (
                          <span className="text-neutral-900 font-semibold text-[11px]">Salarial (IBC)</span>
                        ) : (
                          <span className="text-slate-500 font-medium text-[11px]">No Salarial (Ley 1393)</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{nov.observation}</td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-50 text-neutral-900 rounded-full font-bold text-[10px]">
                          <CircleCheckBig className="w-3 h-3" />
                          {nov.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for Loans */}
      {activeTab === 'PRESTAMOS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Cartera y Préstamos Corporativos a Empleados</span>
            <span className="text-slate-500 text-[11px]">Deducción automática mensual por nómina</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100/70 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="p-3">Empleado</th>
                  <th className="p-3">Fecha Aprobación</th>
                  <th className="p-3 text-right">Monto Original</th>
                  <th className="p-3 text-center">Cuotas (Pagas/Totales)</th>
                  <th className="p-3 text-right">Cuota Mensual</th>
                  <th className="p-3 text-right">Saldo Actual</th>
                  <th className="p-3">Motivo</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map(loan => (
                  <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">{loan.employeeName}</td>
                    <td className="p-3 text-slate-600">{loan.approvedDate || loan.startDate || '2026-08-01'}</td>
                    <td className="p-3 text-right font-mono font-medium">${(loan.principalAmount ?? loan.initialAmount ?? 0).toLocaleString('es-CO')}</td>
                    <td className="p-3 text-center font-mono">
                      {loan.paidInstallments || 0} / {loan.installments || loan.totalInstallments || 1}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      ${(loan.installmentAmount ?? loan.monthlyInstallment ?? 0).toLocaleString('es-CO')}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-neutral-900">
                      ${(loan.balance ?? 0).toLocaleString('es-CO')}
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{loan.reason}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        loan.status === 'Activo' ? 'bg-neutral-50 text-neutral-900' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Novelty / Loan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CirclePlus className="w-5 h-5 text-neutral-600" />
                <h2 className="text-base font-semibold">Registro de Novedad o Préstamo</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seleccione Empleado *</label>
                <select
                  value={selectedEmpId}
                  onChange={e => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.position} - ${emp.currentSalary.toLocaleString('es-CO')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Concepto</label>
                <select
                  value={noveltyType}
                  onChange={e => setNoveltyType(e.target.value as NovedadType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                >
                  <option value="HORA_EXTRA">Hora Extra (HED, HEN, HEFD, HEFN)</option>
                  <option value="RECARGO">Recargo Nocturno / Festivo (Ley 2466)</option>
                  <option value="BONIFICACION">Bonificación / Auxilio Extralegal</option>
                  <option value="COMISION">Comisión por Ventas / Metas</option>
                  <option value="INCAPACIDAD">Incapacidad Médica (EPS / ARL)</option>
                  <option value="VACACIONES">Vacaciones (Disfrute / Compensadas)</option>
                  <option value="LICENCIA">Licencia (Maternidad, Paternidad, Luto, No Remun.)</option>
                  <option value="PRESTAMO">Préstamo Corporativo a Empleado</option>
                  <option value="EMBARGO">Embargo Judicial de Alimentos / Comercial</option>
                </select>
              </div>

              {/* Dynamic form fields for Overtime & Surcharges */}
              {(noveltyType === 'HORA_EXTRA' || noveltyType === 'RECARGO') && (
                <div className="grid grid-cols-2 gap-4 bg-neutral-50/50 p-3 rounded-lg border border-neutral-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo Específico</label>
                    <select
                      value={overtimeType}
                      onChange={e => setOvertimeType(e.target.value as OvertimeType)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white font-medium"
                    >
                      <option value="HED">HED - Extra Diurna (+25%)</option>
                      <option value="HEN">HEN - Extra Nocturna (+75%)</option>
                      <option value="HEFD">HEFD - Extra Festiva Diurna (+100%)</option>
                      <option value="HEFN">HEFN - Extra Festiva Nocturna (+150%)</option>
                      <option value="RN">RN - Recargo Nocturno (+35%)</option>
                      <option value="RDF">RDF - Dominical/Festivo (+100% Ley 2466)</option>
                      <option value="RDN">RDN - Dominical Nocturno (+110%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cantidad de Horas</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-2 text-[11px] text-neutral-950 flex justify-between font-mono font-semibold pt-1 border-t border-neutral-200">
                    <span>Valor calculado automático:</span>
                    <span>${calculateOvertimeCost(overtimeType, quantity).toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
              )}

              {/* Loan Form */}
              {noveltyType === 'PRESTAMO' && (
                <div className="grid grid-cols-2 gap-4 bg-neutral-100/50 p-3 rounded-lg border border-neutral-300">
                  <div>
                    <label className="block font-semibold text-neutral-950 mb-1">Monto del Préstamo (COP)</label>
                    <input
                      type="number"
                      step="50000"
                      value={loanPrincipal}
                      onChange={e => setLoanPrincipal(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-neutral-400 rounded text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-950 mb-1">Número de Cuotas Mensuales</label>
                    <input
                      type="number"
                      min="1"
                      max="36"
                      value={loanInstallments}
                      onChange={e => setLoanInstallments(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-neutral-400 rounded text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-2 text-[11px] text-neutral-950 flex justify-between font-mono font-semibold pt-1 border-t border-neutral-300">
                    <span>Descuento mensual en nómina:</span>
                    <span>${Math.round(loanPrincipal / loanInstallments).toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
              )}

              {/* General inputs for Bonos, Incapacidades, etc. */}
              {noveltyType !== 'HORA_EXTRA' && noveltyType !== 'RECARGO' && noveltyType !== 'PRESTAMO' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Valor en Dinero (COP)</label>
                    <input
                      type="number"
                      step="10000"
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Días o Cantidad</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observación / Soporte</label>
                <input
                  type="text"
                  value={observation}
                  onChange={e => setObservation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={noveltyType === 'PRESTAMO' ? handleCreateLoan : handleCreateNovelty}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg font-bold shadow-xs"
                >
                  <CircleCheckBig className="w-4 h-4" />
                  Guardar y Aplicar a Nómina
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
