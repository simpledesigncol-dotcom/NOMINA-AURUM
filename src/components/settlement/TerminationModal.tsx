import React, { useState } from 'react';
import { 
  Employee, 
  EmploymentContract, 
  TerminationReason, 
  TerminationSettlement, 
  Company,
  Loan
} from '../../types';
import { settlementEngine } from '../../services/settlementEngine';
import { 
  TriangleAlert, 
  CircleCheckBig, 
  FileText, 
  Scale, 
  X, 
  ShieldAlert, 
  DollarSign,
  Briefcase
} from 'lucide-react';

interface TerminationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  contract?: EmploymentContract | null;
  company: Company;
  loans?: Loan[];
  activeLoanBalance?: number;
  onConfirm?: (settlement: TerminationSettlement) => void;
  onConfirmTermination?: (settlement: TerminationSettlement) => void;
}

interface TerminationModalContentProps {
  employee: Employee;
  contract: EmploymentContract;
  company: Company;
  activeLoanBalance: number;
  onClose: () => void;
  onConfirm: (settlement: TerminationSettlement) => void;
}

const TerminationModalContent: React.FC<TerminationModalContentProps> = ({
  employee,
  contract,
  company,
  activeLoanBalance,
  onClose,
  onConfirm,
}) => {
  const [terminationDate, setTerminationDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState<TerminationReason>('Renuncia voluntaria');
  const [justification, setJustification] = useState<string>('Carta de renuncia presentada por el colaborador');
  const [pendingSalaryDays, setPendingSalaryDays] = useState<number>(15);

  // Real-time calculation
  const settlementPreview = settlementEngine.calculateSettlement({
    employee,
    contract,
    terminationDate,
    reason,
    pendingSalaryDays,
    activeLoans: activeLoanBalance > 0 ? [{
      id: 'loan-temp',
      employeeId: employee.id,
      initialAmount: activeLoanBalance,
      balance: activeLoanBalance,
      monthlyInstallment: activeLoanBalance,
      totalInstallments: 1,
      paidInstallments: 0,
      interestRate: 0,
      startDate: terminationDate,
      description: 'Saldo pendiente crédito libranza',
      status: 'Activo',
    }] : [],
  });

  const handleExecute = () => {
    onConfirm(settlementPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-rose-950 text-white px-6 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
              <TriangleAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Proceso de Retiro & Liquidación Definitiva</h2>
              <p className="text-xs text-rose-200">
                Liquidación de prestaciones sociales, vacaciones e indemnización según Ley Laboral
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-rose-300 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Employee Mini Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Empleado</span>
              <span className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Fecha Ingreso</span>
              <span className="font-bold text-slate-900">{employee.hireDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Salario Básico</span>
              <span className="font-bold text-slate-900 font-mono">${employee.currentSalary.toLocaleString('es-CO')}</span>
            </div>
          </div>

          {/* Form Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha Efectiva de Retiro *</label>
              <input
                type="date"
                required
                value={terminationDate}
                onChange={e => setTerminationDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Motivo de Retiro *</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as TerminationReason)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
              >
                <option value="Renuncia voluntaria">Renuncia voluntaria (Sin indemnización)</option>
                <option value="Despido sin justa causa">Despido sin justa causa (Con indemnización Art. 64 CST)</option>
                <option value="Despido con justa causa">Despido con justa causa (Art. 62 CST)</option>
                <option value="Mutuo acuerdo">Mutuo acuerdo / Transacción</option>
                <option value="Vencimiento de plazo pactado">Vencimiento de término fijo</option>
                <option value="Terminación de obra o labor">Terminación de la obra o labor</option>
                <option value="Pensión de vejez / invalidez">Pensión de vejez</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Días de Salario Pendiente en Último Mes</label>
              <input
                type="number"
                min="0"
                max="30"
                value={pendingSalaryDays}
                onChange={e => setPendingSalaryDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Observación / Justificación</label>
              <input
                type="text"
                value={justification}
                onChange={e => setJustification(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Dynamic Calculation Breakdown */}
          {settlementPreview && (
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 flex justify-between items-center">
                <span>DESGLOSE DE LIQUIDACIÓN FINAL</span>
                <span className="text-[11px] font-normal text-slate-600">{settlementPreview.totalDaysWorked || 0} días laborados</span>
              </div>
              <div className="p-4 space-y-2 divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span>Salario pendiente ({settlementPreview.pendingSalaryDays || 0} días):</span>
                  <span className="font-mono font-medium">${(settlementPreview.pendingSalaryAmount ?? 0).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Cesantías proporcionales ({settlementPreview.severanceDays || 0} días):</span>
                  <span className="font-mono font-medium">${(settlementPreview.severanceAmount ?? 0).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Intereses sobre cesantías (12%):</span>
                  <span className="font-mono font-medium">${(settlementPreview.severanceInterestAmount ?? 0).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Prima de servicios proporcional ({settlementPreview.serviceBonusDays || 0} días):</span>
                  <span className="font-mono font-medium">${(settlementPreview.serviceBonusAmount ?? 0).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Compensación de vacaciones pendientes ({settlementPreview.vacationPendingDays || 0} días):</span>
                  <span className="font-mono font-medium">${(settlementPreview.vacationAmount ?? 0).toLocaleString('es-CO')}</span>
                </div>
                {settlementPreview.hasIndemnity && (
                  <div className="flex justify-between pt-1 text-neutral-950 bg-neutral-100 p-2 rounded">
                    <span className="font-bold">Indemnización Art. 64 CST (Despido Injustificado):</span>
                    <span className="font-mono font-bold">${(settlementPreview.indemnityAmount ?? 0).toLocaleString('es-CO')}</span>
                  </div>
                )}
                {(settlementPreview.pendingLoansDeduction ?? 0) > 0 && (
                  <div className="flex justify-between pt-1 text-rose-700">
                    <span>Deducción de saldo préstamo corporativo:</span>
                    <span className="font-mono font-semibold">-${(settlementPreview.pendingLoansDeduction ?? 0).toLocaleString('es-CO')}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">TOTAL NETO A PAGAR AL TRABAJADOR</span>
                  <p className="text-[11px] text-slate-300">Incluye todas las acreencias laborales exigibles</p>
                </div>
                <div className="text-xl font-bold font-mono text-neutral-600">
                  ${(settlementPreview.netSettlementAmount ?? 0).toLocaleString('es-CO')} COP
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600">
            Al procesar, el estado del empleado pasará a <strong>Retirado</strong> y se generarán los documentos oficiales de <strong>Liquidación Final</strong> y <strong>Paz y Salvo Laboral</strong> listos para firma y archivo.
          </div>

        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExecute}
            className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md transition-colors"
          >
            <CircleCheckBig className="w-4 h-4" />
            Aprobar Liquidación y Finalizar Vínculo
          </button>
        </div>

      </div>
    </div>
  );
};

export const TerminationModal: React.FC<TerminationModalProps> = ({
  isOpen,
  onClose,
  employee,
  contract,
  company,
  loans,
  activeLoanBalance,
  onConfirm,
  onConfirmTermination,
}) => {
  if (!isOpen || !employee || !contract) return null;

  const resolvedLoanBalance = activeLoanBalance !== undefined
    ? activeLoanBalance
    : (loans ? loans.filter(l => l.employeeId === employee.id && l.status === 'Activo').reduce((acc, curr) => acc + curr.balance, 0) : 0);

  const resolvedConfirm = onConfirm || onConfirmTermination || (() => {});

  return (
    <TerminationModalContent
      key={employee.id}
      employee={employee}
      contract={contract}
      company={company}
      activeLoanBalance={resolvedLoanBalance}
      onClose={onClose}
      onConfirm={resolvedConfirm}
    />
  );
};
