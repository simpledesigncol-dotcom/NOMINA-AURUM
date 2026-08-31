import React, { useState } from 'react';
import { Employee, EmploymentContract, Company } from '../../types';
import { TrendingUp, CheckCircle2, X } from 'lucide-react';

interface SalaryChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  contract?: EmploymentContract;
  company: Company;
  onApplyChange: (
    employeeId: string, 
    newSalary: number, 
    newPosition: string, 
    reason: string, 
    effectiveDate: string
  ) => void;
}

interface SalaryChangeModalContentProps {
  employee: Employee;
  contract?: EmploymentContract;
  company: Company;
  onClose: () => void;
  onApplyChange: (
    employeeId: string, 
    newSalary: number, 
    newPosition: string, 
    reason: string, 
    effectiveDate: string
  ) => void;
}

const SalaryChangeModalContent: React.FC<SalaryChangeModalContentProps> = ({
  employee,
  contract,
  company,
  onClose,
  onApplyChange,
}) => {
  const [newSalary, setNewSalary] = useState<number>(employee.currentSalary + 300000);
  const [newPosition, setNewPosition] = useState<string>(employee.position);
  const [reason, setReason] = useState<string>('Ajuste de mérito y reestructuración salarial');
  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyChange(employee.id, newSalary, newPosition, reason, effectiveDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Modificar Salario / Cargo</h2>
              <p className="text-xs text-slate-400">
                Genera nueva versión inmutable en el historial y Otrosí contractual
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Empleado</span>
            <span className="font-bold text-slate-900 text-sm">{employee.firstName} {employee.lastName}</span>
            <span className="text-slate-500 block">{employee.position} • Salario actual: ${employee.currentSalary.toLocaleString('es-CO')}</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nuevo Salario Mensual (COP) *</label>
            <input
              type="number"
              step="50000"
              required
              value={newSalary}
              onChange={e => setNewSalary(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cargo</label>
            <input
              type="text"
              value={newPosition}
              onChange={e => setNewPosition(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha de Entrada en Vigencia</label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={e => setEffectiveDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Motivo del Ajuste</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="Aumento anual por IPC / Concertación">Aumento anual IPC</option>
                <option value="Promoción de cargo / Ascenso">Promoción de cargo</option>
                <option value="Ajuste de mérito y desempeño">Mérito y desempeño</option>
                <option value="Ajuste normativo SMLMV">Ajuste normativo SMLMV</option>
                <option value="Reestructuración organizacional">Reestructuración</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-900 leading-relaxed">
            <strong>Trazabilidad Legal:</strong> El salario anterior (${employee.currentSalary.toLocaleString('es-CO')}) quedará registrado con fecha final de vigencia previa al {effectiveDate}. Las nóminas históricas previas mantendrán su cálculo inalterado.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Guardar Historial & Aplicar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export const SalaryChangeModal: React.FC<SalaryChangeModalProps> = ({
  isOpen,
  onClose,
  employee,
  contract,
  company,
  onApplyChange,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <SalaryChangeModalContent
      key={employee.id}
      employee={employee}
      contract={contract}
      company={company}
      onClose={onClose}
      onApplyChange={onApplyChange}
    />
  );
};
