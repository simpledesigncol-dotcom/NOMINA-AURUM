import React, { useState } from 'react';
import { 
  Employee, 
  EmploymentContract, 
  DocumentType, 
  MaritalStatus, 
  RiskClass, 
  ContractType, 
  WorkModality, 
  Company 
} from '../../types';
import { contractEngine } from '../../services/contractEngine';
import { legalRulesEngine } from '../../services/legalRulesEngine';
import { 
  UserPlus, 
  FileText, 
  CircleCheckBig, 
  ChevronRight, 
  ChevronLeft, 
  Building, 
  CreditCard, 
  HeartHandshake, 
  Briefcase, 
  Scale, 
  X,
  Sparkles
} from 'lucide-react';

interface EmployeeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onSaveEmployee: (newEmployee: Employee, newContract: EmploymentContract) => void;
}

export const EmployeeOnboardingModal: React.FC<EmployeeOnboardingModalProps> = ({
  isOpen,
  onClose,
  company,
  onSaveEmployee,
}) => {
  const [step, setStep] = useState<number>(1);
  const smlmv = legalRulesEngine.getSMLMV();

  // Personal Info Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('CC');
  const [docNumber, setDocNumber] = useState('');
  const [expeditionCity, setExpeditionCity] = useState(company.city || 'Bogotá D.C.');
  const [birthDate, setBirthDate] = useState('1995-06-15');
  const [gender, setGender] = useState<'M' | 'F' | 'Otro'>('M');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Soltero');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(company.city || 'Bogotá D.C.');
  const [department, setDepartment] = useState(company.department || 'Cundinamarca');
  const [phone, setPhone] = useState('310 ');
  const [email, setEmail] = useState('');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Familiar');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Bank Info
  const [bankName, setBankName] = useState('Bancolombia');
  const [bankAccountType, setBankAccountType] = useState<'Ahorros' | 'Corriente'>('Ahorros');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  // Laboral & Affiliations
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);
  const [position, setPosition] = useState('');
  const [deptName, setDeptName] = useState('Tecnología e Innovación');
  const [costCenter, setCostCenter] = useState('CC-101 Desarrollo TI');
  const [workerType, setWorkerType] = useState<'Dependiente' | 'Salario Integral' | 'Aprendiz Lectiva' | 'Aprendiz Productiva'>('Dependiente');
  const [eps, setEps] = useState('Sanitas EPS');
  const [pensionFund, setPensionFund] = useState('Protección');
  const [severanceFund, setSeveranceFund] = useState('Protección');
  const [arl, setArl] = useState(company.arlName || 'Positiva');
  const [riskClass, setRiskClass] = useState<RiskClass>('I');

  // Contract State
  const [contractType, setContractType] = useState<ContractType>('Término Indefinido');
  const [salary, setSalary] = useState<number>(2500000);
  const [isIntegralSalary, setIsIntegralSalary] = useState(false);
  const [modality, setModality] = useState<WorkModality>('Presencial');
  const [weeklyHours, setWeeklyHours] = useState<number>(44); // Ley 2101
  const [endDate, setEndDate] = useState('');
  const [probationDays, setProbationDays] = useState<number>(60);
  const [workSchedule, setWorkSchedule] = useState('Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 8:00 AM - 12:00 M');

  if (!isOpen) return null;

  const handleSalaryChange = (val: number) => {
    setSalary(val);
    if (val >= smlmv * 13) {
      setIsIntegralSalary(true);
      setWorkerType('Salario Integral');
    } else {
      setIsIntegralSalary(false);
      if (workerType === 'Salario Integral') setWorkerType('Dependiente');
    }
  };

  const handleFinish = () => {
    const newEmpId = `emp-${Date.now()}`;
    const code = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEmployee: Employee = {
      id: newEmpId,
      code,
      firstName,
      lastName,
      documentType: docType,
      documentNumber: docNumber,
      expeditionCity,
      birthDate,
      gender,
      maritalStatus,
      nationality: 'Colombiana',
      address,
      city,
      stateRegion: department,
      phone,
      email,
      emergencyContact: {
        name: emergencyName || 'Contacto Familiar',
        relationship: emergencyRel,
        phone: emergencyPhone || phone,
      },
      bankInfo: {
        bankName,
        accountType: bankAccountType,
        accountNumber: bankAccountNumber || 'Por registrar',
      },
      hireDate,
      position: position || 'Analista Especialista',
      department: deptName,
      costCenter,
      workerType: isIntegralSalary ? 'Salario Integral' : workerType,
      state: 'Activo',
      eps,
      pensionFund,
      severanceFund,
      arl,
      riskClass,
      currentSalary: salary,
      isTransportAllowanceEligible: !isIntegralSalary && salary <= (smlmv * 2),
      accruedVacationDays: 0,
      takenVacationDays: 0,
      compensatedVacationDays: 0,
    };

    const newContract = contractEngine.createInitialContract(newEmployee, company, {
      type: contractType,
      salary,
      isIntegralSalary,
      weeklyHours,
      startDate: hireDate,
      endDate: contractType === 'Término Fijo' ? endDate : undefined,
      modality,
      position: newEmployee.position,
      probationPeriodDays: probationDays,
      workSchedule,
    });

    newEmployee.activeContractId = newContract.id;
    try {
      onSaveEmployee(newEmployee, newContract);
    } catch (err) {
      console.error('[Onboarding] Error al guardar empleado/contrato:', err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white/95 backdrop-blur-2xl w-full max-w-3xl rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* iOS Drag Handle & Header */}
        <div className="pt-3 pb-2 px-6 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-neutral-100 rounded-2xl text-neutral-800 border border-neutral-200/70 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 truncate">Wizard de Contratación e Ingreso Laboral</h2>
              <p className="text-xs text-slate-500 truncate">
                Crea el empleado, genera automáticamente su contrato bajo Ley 2466 y da de alta su expediente
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator - iOS segmented style */}
        <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 font-medium ${step >= 1 ? 'text-neutral-950 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-neutral-800 text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
            <span className="hidden sm:inline">Datos Personales</span>
            <span className="sm:hidden">Personal</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-2 font-medium ${step >= 2 ? 'text-neutral-950 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-neutral-800 text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
            <span className="hidden sm:inline">Afiliaciones y Puesto</span>
            <span className="sm:hidden">Afiliación</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className={`flex items-center gap-2 font-medium ${step >= 3 ? 'text-neutral-950 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-neutral-800 text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
            <span className="hidden sm:inline">Contrato & Cláusulas</span>
            <span className="sm:hidden">Contrato</span>
          </div>
        </div>

        {/* Step Contents */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* STEP 1: Personal & Bank Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">1. Datos Personales e Identificación</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Carlos"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Pérez Gómez"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as DocumentType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs bg-white"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="PAS">Pasaporte (PAS)</option>
                    <option value="PPT">Permiso Protección Temporal (PPT)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1020489312"
                    value={docNumber}
                    onChange={e => setDocNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Ciudad Expedición</label>
                  <input
                    type="text"
                    value={expeditionCity}
                    onChange={e => setExpeditionCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Género</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'M' | 'F' | 'Otro')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs bg-white"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Estado Civil</label>
                  <select
                    value={maritalStatus}
                    onChange={e => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs bg-white"
                  >
                    <option value="Soltero">Soltero(a)</option>
                    <option value="Casado">Casado(a)</option>
                    <option value="Unión Libre">Unión Libre</option>
                    <option value="Divorciado">Divorciado(a)</option>
                    <option value="Viudo">Viudo(a)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Dirección de Residencia</label>
                  <input
                    type="text"
                    placeholder="Ej. Calle 100 # 15 - 30"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Teléfono / Móvil</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Banco de Nómina</label>
                  <div className="flex gap-2">
                    <select
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Banco Itaú">Banco Itaú</option>
                      <option value="Nequi / Daviplata">Nequi / Daviplata</option>
                    </select>
                    <input
                      type="text"
                      placeholder="No. de Cuenta"
                      value={bankAccountNumber}
                      onChange={e => setBankAccountNumber(e.target.value)}
                      className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Laboral & Affiliations */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">2. Asignación Laboral y Afiliaciones</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Cargo a Desempeñar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Desarrollador Fullstack"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Área / Departamento</label>
                  <select
                    value={deptName}
                    onChange={e => setDeptName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs bg-white"
                  >
                    <option value="Tecnología e Innovación">Tecnología e Innovación</option>
                    <option value="Comercial y Expansión">Comercial y Expansión</option>
                    <option value="Operaciones e Infraestructura">Operaciones e Infraestructura</option>
                    <option value="Gestión Humana">Gestión Humana</option>
                    <option value="Finanzas y Contabilidad">Finanzas y Contabilidad</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Fecha de Ingreso</label>
                  <input
                    type="date"
                    value={hireDate}
                    onChange={e => setHireDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-neutral-700 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Centro de Costos</label>
                  <input
                    type="text"
                    value={costCenter}
                    onChange={e => setCostCenter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Clase de Riesgo ARL</label>
                  <select
                    value={riskClass}
                    onChange={e => setRiskClass(e.target.value as RiskClass)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white font-medium"
                  >
                    <option value="I">Clase I (0.522% - Administrativo, Oficina, Software)</option>
                    <option value="II">Clase II (1.044% - Comercio, Manufactura liviana)</option>
                    <option value="III">Clase III (2.436% - Bodega, Industria, Mantenimiento)</option>
                    <option value="IV">Clase IV (4.350% - Transporte, Aceites)</option>
                    <option value="V">Clase V (6.960% - Construcción, Minería, Alturas)</option>
                  </select>
                </div>
              </div>

              {/* Affiliations Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-neutral-800" />
                  Afiliaciones a Seguridad Social y Fondos
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">EPS (Salud)</label>
                    <select
                      value={eps}
                      onChange={e => setEps(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Sanitas EPS">Sanitas EPS</option>
                      <option value="Sura EPS">Sura EPS</option>
                      <option value="Compensar EPS">Compensar EPS</option>
                      <option value="Nueva EPS">Nueva EPS</option>
                      <option value="Famisanar">Famisanar</option>
                      <option value="Salud Total">Salud Total</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Fondo de Pensiones (AFP)</label>
                    <select
                      value={pensionFund}
                      onChange={e => setPensionFund(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Protección">Protección</option>
                      <option value="Porvenir">Porvenir</option>
                      <option value="Colfondos">Colfondos</option>
                      <option value="Skandia">Skandia</option>
                      <option value="Colpensiones (Público)">Colpensiones (Público)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">Fondo de Cesantías</label>
                    <select
                      value={severanceFund}
                      onChange={e => setSeveranceFund(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Protección">Protección</option>
                      <option value="Porvenir">Porvenir</option>
                      <option value="FNA (Fondo Nacional del Ahorro)">FNA</option>
                      <option value="Colfondos">Colfondos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contract, Salary, Clauses & Live Generation */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">3. Contrato, Salario y Cláusulas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Tipo de Contrato</label>
                  <select
                    value={contractType}
                    onChange={e => setContractType(e.target.value as ContractType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white font-medium"
                  >
                    <option value="Término Indefinido">Término Indefinido</option>
                    <option value="Término Fijo">Término Fijo (Con fecha vencimiento)</option>
                    <option value="Obra o Labor">Por Obra o Labor Determinada</option>
                    <option value="Salario Integral">Salario Integral (desde 13 SMLMV)</option>
                    <option value="Aprendizaje">Contrato de Aprendizaje SENA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Salario Básico Mensual (COP) *</label>
                  <input
                    type="number"
                    step="50000"
                    value={salary}
                    onChange={e => handleSalaryChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    SMLMV 2026: ${smlmv.toLocaleString('es-CO')} • {salary <= (smlmv * 2) ? '✓ Con derecho a Auxilio de Transporte' : 'Sin auxilio de transporte (supera 2 SMLMV)'}
                  </span>
                </div>
              </div>

              {contractType === 'Término Fijo' && (
                <div className="grid grid-cols-2 gap-4 bg-neutral-100/50 p-3 rounded-2xl border border-neutral-300/70">
                  <div>
                    <label className="block font-semibold text-neutral-950 mb-1">Fecha de Terminación (Plazo Fijo)</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-950 mb-1">Período de Prueba (Días)</label>
                    <input
                      type="number"
                      value={probationDays}
                      onChange={e => setProbationDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs"
                    />
                    <span className="text-[10px] text-neutral-900 mt-0.5 block">Máx 1/5 del plazo o 60 días</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Modalidad de Trabajo</label>
                  <select
                    value={modality}
                    onChange={e => setModality(e.target.value as WorkModality)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">100% Remoto</option>
                    <option value="Híbrido">Híbrido (Oficina + Casa)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Jornada Semanal (Ley 2101)</label>
                  <input
                    type="number"
                    value={weeklyHours}
                    onChange={e => setWeeklyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">44 Horas estándar</span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Horario Laboral</label>
                  <select
                    value={workSchedule}
                    onChange={e => setWorkSchedule(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 8:00 AM - 12:00 M">
                      Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 8:00 AM - 12:00 M
                    </option>
                    <option value="Lunes a Viernes 9:00 AM - 7:00 PM">
                      Lunes a Viernes 9:00 AM - 7:00 PM (sin sábados — compensa 4h semanales)
                    </option>
                    <option value="Lunes a Viernes 8:00 AM - 7:00 PM">
                      Lunes a Viernes 8:00 AM - 7:00 PM (sin sábados — compensa 4h semanales)
                    </option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Selecciona el turno del colaborador</span>
                </div>
              </div>

              {/* Automatic Contract Preview Badge */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-neutral-800 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-950 text-xs">Generación Automática de Contrato Legal</h4>
                  <p className="text-[11px] text-neutral-900 mt-0.5 leading-relaxed">
                    Al confirmar, el sistema generará de forma instantánea el contrato oficial con 9 cláusulas sustantivas, control de turnos y recargos bajo Ley 2466, confidencialidad, y lo archivará en el expediente digital del empleado.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!firstName || !lastName || !docNumber}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Siguiente Paso
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
            >
              <CircleCheckBig className="w-4 h-4" />
              Emitir Contrato y Activar Empleado
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
