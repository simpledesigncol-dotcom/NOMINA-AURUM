import React, { useState } from 'react';
import { Employee, EmploymentContract } from '../../types';
import { 
  X, 
  Calendar, 
  User, 
  Briefcase, 
  DollarSign, 
  Shirt, 
  Save, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Sparkles
} from 'lucide-react';

interface EditEmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  contract?: EmploymentContract;
  onClose: () => void;
  onSave: (updatedEmployee: Employee, updatedContract?: Partial<EmploymentContract>) => void;
}

interface EditEmployeeModalContentProps {
  employee: Employee;
  contract?: EmploymentContract;
  onClose: () => void;
  onSave: (updatedEmployee: Employee, updatedContract?: Partial<EmploymentContract>) => void;
}

const EditEmployeeModalContent: React.FC<EditEmployeeModalContentProps> = ({
  employee,
  contract,
  onClose,
  onSave,
}) => {
  // Form state
  const [firstName, setFirstName] = useState(employee.firstName);
  const [lastName, setLastName] = useState(employee.lastName);
  const [hireDate, setHireDate] = useState(employee.hireDate); // CRITICAL: Hire date modification
  const [position, setPosition] = useState(employee.position);
  const [department, setDepartment] = useState(employee.department);
  const [workshopSpecialty, setWorkshopSpecialty] = useState<any>(
    employee.workshopSpecialty || 'Mecánica General & Diagnóstico'
  );
  const [currentSalary, setCurrentSalary] = useState(employee.currentSalary);
  const [phone, setPhone] = useState(employee.phone);
  const [email, setEmail] = useState(employee.email);
  const [address, setAddress] = useState(employee.address);
  const [state, setState] = useState(employee.state);

  // Dotación Sizes
  const [shoeSize, setShoeSize] = useState(employee.dotacionSizes?.shoeSize || '41');
  const [overolSize, setOverolSize] = useState(employee.dotacionSizes?.overolSize || 'L');
  const [gloveSize, setGloveSize] = useState(employee.dotacionSizes?.gloveSize || 'M');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedEmployee: Employee = {
      ...employee,
      firstName,
      lastName,
      hireDate, // Updated hire date!
      position,
      department,
      workshopSpecialty,
      currentSalary,
      phone,
      email,
      address,
      state,
      isTransportAllowanceEligible: currentSalary <= (1750905 * 2) && employee.workerType !== 'Salario Integral',
      dotacionSizes: {
        shoeSize,
        overolSize,
        gloveSize,
        shirtSize: overolSize,
        pantsSize: shoeSize === '41' ? '32' : '34',
      },
    };

    const updatedContractData: Partial<EmploymentContract> = {
      startDate: hireDate,
      position,
      salary: currentSalary,
      hasTransportAllowance: updatedEmployee.isTransportAllowanceEligible,
    };

    onSave(updatedEmployee, updatedContractData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full border border-slate-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* iOS Drag Handle & Header */}
        <div className="pt-3 pb-2 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex-1 text-center sm:text-left">
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mb-2" />
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-800" />
              Editar Expediente y Fecha de Contratación
            </h2>
            <p className="text-xs text-slate-500">
              Colaborador: {employee.firstName} {employee.lastName} ({employee.code})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Section: HIRE DATE (Highlighted for user request) */}
          <div className="p-4 bg-neutral-100/80 border border-neutral-300/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Calendar className="w-4 h-4 text-neutral-800" />
                Fecha de Ingreso / Contratación *
              </label>
              <span className="text-[10px] bg-neutral-300/60 text-neutral-950 px-2 py-0.5 rounded-md font-semibold">
                Modificación Clave
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Ajuste la fecha exacta en la que el colaborador inició labores en Aurum Motors. Esta fecha actualiza la antigüedad para vacaciones, cesantías y certificaciones laborales.
            </p>
            <input
              type="date"
              required
              value={hireDate}
              onChange={e => setHireDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-neutral-400 rounded-xl font-bold font-mono text-slate-900 text-sm focus:ring-2 focus:ring-neutral-700 shadow-2xs"
            />
          </div>

          {/* Section: Personal Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              1. Identidad del Colaborador
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Nombres *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Apellidos *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section: Taller Specialty & Position */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              2. Asignación Técnica & Taller Aurum Motors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Especialidad de Taller *</label>
                <select
                  value={workshopSpecialty}
                  onChange={e => {
                    const spec = e.target.value;
                    setWorkshopSpecialty(spec);
                    if (spec === 'Latonería & Pintura al Horno') setDepartment('Latonería y Pintura al Horno');
                    else if (spec === 'Detailing Cerámico & Estética') setDepartment('Detailing y Estética Automotriz');
                    else if (spec === 'Mecánica General & Diagnóstico') setDepartment('Mecánica Especializada');
                    else setDepartment('Administración y Atención al Cliente');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                >
                  <option value="Latonería & Pintura al Horno">Latonería & Pintura al Horno</option>
                  <option value="Detailing Cerámico & Estética">Detailing Cerámico & Estética</option>
                  <option value="Mecánica General & Diagnóstico">Mecánica General & Diagnóstico</option>
                  <option value="Electromecánica & Scanner">Electromecánica & Scanner</option>
                  <option value="Administración & Servicio">Administración & Servicio</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Cargo Contractual *</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Salario Básico Mensual (COP) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={currentSalary}
                    onChange={e => setCurrentSalary(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Estado Laboral</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                >
                  <option value="Activo">Activo</option>
                  <option value="Vacaciones">Vacaciones</option>
                  <option value="Incapacidad">Incapacidad</option>
                  <option value="Licencia">Licencia</option>
                  <option value="Retirado">Retirado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Dotación & EPP Sizes */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-neutral-800" />
              3. Tallas de Dotación y EPP (Art. 230 CST)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 text-[11px]">Calzado Seguridad</label>
                <select
                  value={shoeSize}
                  onChange={e => setShoeSize(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                >
                  {['37', '38', '39', '40', '41', '42', '43', '44'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 text-[11px]">Overol de Taller</label>
                <select
                  value={overolSize}
                  onChange={e => setOverolSize(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                >
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 text-[11px]">Guantes EPP</label>
                <select
                  value={gloveSize}
                  onChange={e => setGloveSize(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                >
                  {['7 (S)', '8 (M)', '9 (L)', '10 (XL)'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Contact */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              4. Datos de Contacto y Residencia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">Dirección Domicilio</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-neutral-700 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Cambios
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  employee,
  contract,
  onClose,
  onSave,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <EditEmployeeModalContent
      key={employee.id}
      employee={employee}
      contract={contract}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
