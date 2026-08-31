import React, { useState } from 'react';
import { Employee, EmploymentContract, Company, ContractType } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  ListFilter, 
  FileText, 
  FileCheck, 
  TrendingUp, 
  CircleAlert, 
  Eye, 
  ChevronRight,
  Briefcase,
  Building,
  HeartPulse,
  PenLine,
  Calendar,
  Wrench,
  Shirt
} from 'lucide-react';

interface EmployeesDirectoryProps {
  employees: Employee[];
  contracts: EmploymentContract[];
  company: Company;
  onSelectEmployee: (emp: Employee) => void;
  onOpenOnboarding: () => void;
  onOpenContractDoc: (emp: Employee, contract: EmploymentContract) => void;
  onOpenCertificateDoc: (emp: Employee) => void;
  onOpenSalaryChangeModal: (emp: Employee) => void;
  onOpenTerminationModal: (emp: Employee, contract: EmploymentContract) => void;
  onOpenEditEmployee: (emp: Employee) => void;
}

export const EmployeesDirectory: React.FC<EmployeesDirectoryProps> = ({
  employees,
  contracts,
  company,
  onSelectEmployee,
  onOpenOnboarding,
  onOpenContractDoc,
  onOpenCertificateDoc,
  onOpenSalaryChangeModal,
  onOpenTerminationModal,
  onOpenEditEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setListFilterState] = useState<string>('ALL');
  const [filterDept, setListFilterDept] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('TABLE');

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.documentNumber.includes(searchTerm) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.workshopSpecialty && emp.workshopSpecialty.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesState = filterState === 'ALL' || emp.state === filterState;
    const matchesDept = filterDept === 'ALL' || emp.department === filterDept;

    return matchesSearch && matchesState && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Main Call to Action - iOS Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">Aurum Motors • Talento Humano</span>
            <span className="px-2 py-0.5 bg-neutral-200 text-neutral-950 text-[10px] font-semibold rounded-full">Taller & Detailing</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">Expedientes de Personal & Contratación</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de ciclo laboral, contratos de taller Ley 2466 de 2025, dotación EPP y fechas de contratación.
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-700 hover:bg-neutral-800 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Contratar Nuevo Colaborador
        </button>
      </div>

      {/* ListFilter and Search Bar - iOS Style */}
      <div className="bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, cargo o especialidad..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-neutral-700"
          />
        </div>

        {/* ListFilters & View Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterState}
            onChange={e => setListFilterState(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Activo">Activos</option>
            <option value="Vacaciones">En Vacaciones</option>
            <option value="Incapacidad">En Incapacidad</option>
            <option value="Retirado">Retirados</option>
          </select>

          <select
            value={filterDept}
            onChange={e => setListFilterDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
          >
            <option value="ALL">Todas las Áreas de Taller</option>
            <option value="Latonería y Pintura al Horno">Latonería y Pintura al Horno</option>
            <option value="Detailing y Estética Automotriz">Detailing y Estética Automotriz</option>
            <option value="Mecánica Especializada">Mecánica Especializada</option>
            <option value="Administración y Atención al Cliente">Administración y Atención al Cliente</option>
          </select>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'TABLE' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'}`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'CARDS' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'}`}
            >
              Tarjetas
            </button>
          </div>
        </div>
      </div>

      {/* View Mode: TABLE */}
      {viewMode === 'TABLE' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                  <th className="p-3.5">Código</th>
                  <th className="p-3.5">Colaborador / Documento</th>
                  <th className="p-3.5">Cargo & Área</th>
                  <th className="p-3.5">Fecha Contratación</th>
                  <th className="p-3.5 text-right">Salario Básico</th>
                  <th className="p-3.5">Dotación</th>
                  <th className="p-3.5 text-center">Estado</th>
                  <th className="p-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map(emp => {
                  const empContract = contracts.find(c => c.id === emp.activeContractId || c.employeeId === emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="p-3.5 font-mono font-bold text-slate-700">
                        {emp.code}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => onSelectEmployee(emp)}
                          className="font-bold text-slate-900 hover:text-neutral-900 text-left transition-colors flex items-center gap-1.5"
                        >
                          {emp.firstName} {emp.lastName}
                        </button>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {emp.documentType} {emp.documentNumber}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{emp.position}</div>
                        <div className="text-[10px] text-neutral-900 font-medium">
                          {emp.workshopSpecialty || emp.department}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium font-mono">
                          <Calendar className="w-3.5 h-3.5 text-neutral-800" />
                          {emp.hireDate}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {empContract?.type || 'Indefinido'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                        ${(emp.currentSalary ?? 0).toLocaleString('es-CO')}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md font-mono text-[10px] text-slate-700 font-bold">
                          {emp.dotacionSizes?.shoeSize || '41'} / {emp.dotacionSizes?.overolSize || 'L'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.state === 'Activo' ? 'bg-neutral-100 text-neutral-900' :
                          emp.state === 'Vacaciones' ? 'bg-blue-100 text-blue-800' :
                          emp.state === 'Incapacidad' ? 'bg-neutral-200 text-neutral-900' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {emp.state}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Hire Date & Info */}
                          <button
                            onClick={() => onOpenEditEmployee(emp)}
                            title="Editar Datos y Fecha de Contratación"
                            className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg transition-colors border border-neutral-300"
                          >
                            <PenLine className="w-3.5 h-3.5" />
                          </button>

                          {/* View Profile */}
                          <button
                            onClick={() => onSelectEmployee(emp)}
                            title="Ver Expediente"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Contract Document */}
                          {empContract && (
                            <button
                              onClick={() => onOpenContractDoc(emp, empContract)}
                              title="Ver Contrato Aurum Motors"
                              className="p-1.5 bg-slate-100 hover:bg-neutral-100 hover:text-neutral-900 text-slate-700 rounded-lg transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Certificate */}
                          <button
                            onClick={() => onOpenCertificateDoc(emp)}
                            title="Certificado Laboral"
                            className="p-1.5 bg-slate-100 hover:bg-neutral-50 hover:text-neutral-900 text-slate-700 rounded-lg transition-colors"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode: CARDS */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => {
            const empContract = contracts.find(c => c.id === emp.activeContractId || c.employeeId === emp.id);
            return (
              <div 
                key={emp.id}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md hover:border-neutral-500 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-neutral-700/10 text-neutral-900 flex items-center justify-center font-bold text-base shadow-inner">
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-neutral-900 transition-colors">
                          {emp.firstName} {emp.lastName}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono">{emp.code} • {emp.documentNumber}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.state === 'Activo' ? 'bg-neutral-100 text-neutral-900' :
                      emp.state === 'Vacaciones' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {emp.state}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cargo:</span>
                      <strong className="text-slate-800 text-right">{emp.position}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Especialidad:</span>
                      <strong className="text-neutral-900 font-medium">{emp.workshopSpecialty || emp.department}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fecha Ingreso:</span>
                      <strong className="text-slate-800 font-mono">{emp.hireDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Salario Básico:</span>
                      <strong className="text-neutral-900 font-mono font-bold">${(emp.currentSalary ?? 0).toLocaleString('es-CO')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dotación (Calz/Overol):</span>
                      <strong className="text-slate-800 font-mono">{emp.dotacionSizes?.shoeSize || '41'} / {emp.dotacionSizes?.overolSize || 'L'}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenEditEmployee(emp)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    Editar Fecha
                  </button>

                  <button
                    onClick={() => onSelectEmployee(emp)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Ver Expediente <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
