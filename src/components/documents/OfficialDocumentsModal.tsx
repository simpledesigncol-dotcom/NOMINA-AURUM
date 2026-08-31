import React from 'react';
import { 
  Company, 
  Employee, 
  EmploymentContract, 
  PayrollItem, 
  TerminationSettlement,
  DotacionDelivery 
} from '../../types';
import { 
  Printer, 
  X, 
  BadgeCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface OfficialDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'CONTRATO' | 'DESPRENDIBLE_NOMINA' | 'LIQUIDACION_FINAL' | 'PAZ_Y_SALVO' | 'CERTIFICADO_LABORAL' | 'OTROS_SI' | 'ACTA_DOTACION';
  company: Company;
  employee?: Employee;
  contract?: EmploymentContract;
  payrollItem?: PayrollItem;
  periodName?: string;
  settlement?: TerminationSettlement;
  dotacionDelivery?: DotacionDelivery;
  otrosiData?: {
    type: 'SALARIO' | 'CARGO' | 'PRORROGA';
    newSalary?: number;
    newPosition?: string;
    newEndDate?: string;
    effectiveDate: string;
    reason: string;
  };
}

export const OfficialDocumentsModal: React.FC<OfficialDocumentsModalProps> = ({
  isOpen,
  onClose,
  documentType,
  company,
  employee,
  contract,
  payrollItem,
  periodName,
  settlement,
  dotacionDelivery,
  otrosiData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top iOS Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-700/20 text-neutral-500 rounded-2xl border border-neutral-700/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {documentType === 'CONTRATO' && 'Contrato Laboral Oficial — Aurum Motors S.A.S.'}
                {documentType === 'DESPRENDIBLE_NOMINA' && 'Comprobante de Pago y Nómina Electrónica'}
                {documentType === 'LIQUIDACION_FINAL' && 'Liquidación Definitiva de Prestaciones e Indemnización'}
                {documentType === 'PAZ_Y_SALVO' && 'Paz y Salvo Laboral y Entrega de Puesto'}
                {documentType === 'CERTIFICADO_LABORAL' && 'Certificación Laboral Oficial'}
                {documentType === 'OTROS_SI' && 'Otrosí Modificatorio al Contrato de Trabajo'}
                {documentType === 'ACTA_DOTACION' && 'Acta Oficial de Entrega de Dotación & EPP (Art. 230 CST)'}
              </h2>
              <p className="text-xs text-slate-400">
                Formato jurídico colombiano vigente conforme al CST, Ley 2101 de 2021 y Ley 2466 de 2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 md:p-10 overflow-y-auto print:overflow-visible print:p-6 print-document bg-white text-slate-800">
          
          {/* ============================================================ */}
          {/* 1. CONTRATO DE TRABAJO ROBUSTO AURUM MOTORS */}
          {/* ============================================================ */}
          {documentType === 'CONTRATO' && contract && employee && (
            <div className="space-y-6 text-sm leading-relaxed text-justify font-serif">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <p className="text-xs font-sans tracking-widest text-slate-500 uppercase font-semibold">República de Colombia • Régimen Laboral Privado</p>
                <h1 className="text-xl font-bold text-slate-950 uppercase mt-1">
                  CONTRATO INDIVIDUAL DE TRABAJO A {(contract.type || 'Término Indefinido').toUpperCase()}
                </h1>
                <p className="text-xs font-sans text-neutral-900 font-bold mt-1">
                  AURUM MOTORS S.A.S. — TALLER AUTOMOTRIZ ESPECIALIZADO
                </p>
                <p className="text-xs font-sans text-slate-600">
                  No. de Contrato: <span className="font-mono font-bold text-slate-900">{contract.contractNumber || 'CTR-2026'}</span> • Fecha de Inicio: <span className="font-semibold">{contract.startDate || employee.hireDate}</span>
                </p>
              </div>

              {/* Information Matrix */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-sans">
                <div>
                  <span className="font-bold text-slate-700">EMPLEADOR:</span> {company.legalName}
                </div>
                <div>
                  <span className="font-bold text-slate-700">NIT:</span> {company.nit}-{company.dv}
                </div>
                <div>
                  <span className="font-bold text-slate-700">REPRESENTANTE LEGAL:</span> {company.legalRepresentative}
                </div>
                <div>
                  <span className="font-bold text-slate-700">DOCUMENTO REP.:</span> {company.representativeDoc}
                </div>
                <div>
                  <span className="font-bold text-slate-700">DOMICILIO EMPLEADOR:</span> {company.address}, {company.city}
                </div>
                <div>
                  <span className="font-bold text-slate-700">ACTIVIDAD ECONÓMICA:</span> {company.economicActivity}
                </div>
                <div className="col-span-2 border-t border-slate-200 my-1 pt-1"></div>
                <div>
                  <span className="font-bold text-slate-700">TRABAJADOR:</span> {employee.firstName} {employee.lastName}
                </div>
                <div>
                  <span className="font-bold text-slate-700">DOCUMENTO:</span> {employee.documentType} No. {employee.documentNumber} de {employee.expeditionCity || employee.city}
                </div>
                <div>
                  <span className="font-bold text-slate-700">DIRECCIÓN Y CIUDAD:</span> {employee.address}, {employee.city}
                </div>
                <div>
                  <span className="font-bold text-slate-700">TELÉFONO / EMAIL:</span> {employee.phone} • {employee.email}
                </div>
                <div>
                  <span className="font-bold text-slate-700">CARGO A DESEMPEÑAR:</span> {contract.position || employee.position}
                </div>
                <div>
                  <span className="font-bold text-slate-700">SALARIO BÁSICO MENSUAL:</span> ${(contract.salary ?? employee.currentSalary ?? 0).toLocaleString('es-CO')} COP ({contract.isIntegralSalary ? 'Salario Integral' : 'Salario Ordinario'})
                </div>
                <div>
                  <span className="font-bold text-slate-700">JORNADA SEMANAL MÁXIMA:</span> {contract.weeklyHours || 44} Horas semanales (Ley 2101 de 2021)
                </div>
                <div>
                  <span className="font-bold text-slate-700">MODALIDAD DE TRABAJO:</span> {contract.modality || 'Presencial'} (Presencial en Centro de Operaciones)
                </div>
                {contract.endDate && (
                  <div>
                    <span className="font-bold text-slate-700">FECHA VENCIMIENTO:</span> {contract.endDate}
                  </div>
                )}
                <div>
                  <span className="font-bold text-slate-700">PERÍODO DE PRUEBA:</span> {contract.probationPeriodDays || 60} días calendario (Art. 76 y ss. CST)
                </div>
              </div>

              {/* Introductory text */}
              <p>
                Entre los suscritos a saber: por una parte, <strong>{company.legalRepresentative}</strong>, mayor de edad y domiciliado en {company.city}, identificado como aparece al pie de su firma, quien actúa en calidad de Representante Legal de <strong>{company.legalName}</strong> (NIT {company.nit}-{company.dv}), sociedad comercial con domicilio principal en {company.city}, quien para todos los efectos contractuales y legales se denominará <strong>EL EMPLEADOR</strong>; y por la otra parte, <strong>{employee.firstName} {employee.lastName}</strong>, mayor de edad, identificado con {employee.documentType} No. {employee.documentNumber}, domiciliado en {employee.city}, quien en adelante se denominará <strong>EL TRABAJADOR</strong>, se ha convenido celebrar el presente <strong>CONTRATO INDIVIDUAL DE TRABAJO A {(contract.type || 'Término Indefinido').toUpperCase()}</strong>, el cual se regirá por los principios del Código Sustantivo del Trabajo, la Ley 2101 de 2021, la Ley 2466 de 2025 y las siguientes cláusulas expresas:
              </p>

              {/* Clauses */}
              <div className="space-y-4">
                {(contract.clauses || []).map((clause, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="font-bold text-xs font-sans tracking-wide text-slate-900 uppercase">
                      {clause.title}
                    </h3>
                    <p className="text-slate-800">{clause.content}</p>
                  </div>
                ))}
              </div>

              {/* Signature section with Fingerprint Box */}
              <p className="pt-4">
                Para debida constancia de su aceptación íntegra, libre y espontánea, las partes leen, ratifican y firman el presente contrato en dos (2) ejemplares del mismo tenor y validez legal, en la ciudad de {company.city}, a los {new Date().getDate()} días del mes de {new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date())} del año {new Date().getFullYear()}.
              </p>

              <div className="pt-16 grid grid-cols-2 gap-8 text-xs font-sans">
                <div className="border-t-2 border-slate-900 pt-3">
                  <p className="font-bold text-slate-900">{company.legalRepresentative}</p>
                  <p className="text-slate-600">Representante Legal</p>
                  <p className="text-slate-600 font-bold">{company.legalName}</p>
                  <p className="text-slate-600">NIT: {company.nit}-{company.dv}</p>
                  <p className="text-[10px] text-neutral-900 font-mono mt-2 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Suscripción Autorizada por Gerencia
                  </p>
                </div>

                <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</p>
                    <p className="text-slate-600 font-medium">EL TRABAJADOR</p>
                    <p className="text-slate-600">{employee.documentType} No. {employee.documentNumber}</p>
                    <p className="text-slate-600">Tel: {employee.phone}</p>
                    <p className="text-[10px] text-neutral-900 font-mono mt-2 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" /> Aceptado & Registrado en Sistema
                    </p>
                  </div>

                  {/* Fingerprint / Huella Dactilar box */}
                  <div className="w-20 h-24 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center text-center p-1 bg-slate-50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Huella Índice Derecho</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. ACTA OFICIAL DE ENTREGA DE DOTACIÓN & EPP */}
          {/* ============================================================ */}
          {documentType === 'ACTA_DOTACION' && dotacionDelivery && employee && (
            <div className="space-y-6 text-sm font-sans leading-relaxed text-justify">
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <p className="text-xs tracking-widest text-slate-500 uppercase font-semibold">Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)</p>
                <h1 className="text-xl font-bold text-slate-950 uppercase mt-1">
                  ACTA DE ENTREGA DE DOTACIÓN Y ELEMENTOS DE PROTECCIÓN PERSONAL (EPP)
                </h1>
                <p className="text-xs font-bold text-neutral-900 mt-1">
                  {company.legalName} • {dotacionDelivery.actNumber}
                </p>
                <p className="text-xs text-slate-600">
                  En cumplimiento de los Artículos 230 a 234 del Código Sustantivo del Trabajo y Resolución 2400 de 1979
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-sans">
                <div><span className="font-bold text-slate-700">EMPRESA:</span> {company.legalName}</div>
                <div><span className="font-bold text-slate-700">NIT:</span> {company.nit}-{company.dv}</div>
                <div><span className="font-bold text-slate-700">TRABAJADOR BENEFICIARIO:</span> {employee.firstName} {employee.lastName}</div>
                <div><span className="font-bold text-slate-700">DOCUMENTO:</span> {employee.documentType} No. {employee.documentNumber}</div>
                <div><span className="font-bold text-slate-700">CARGO / ESPECIALIDAD:</span> {employee.position} ({employee.workshopSpecialty || employee.department})</div>
                <div><span className="font-bold text-slate-700">PERÍODO LEGAL:</span> {dotacionDelivery.periodLabel}</div>
                <div><span className="font-bold text-slate-700">FECHA DE ENTREGA:</span> {dotacionDelivery.deliveryDate}</div>
                <div><span className="font-bold text-slate-700">TALLA DE CALZADO / OVEROL:</span> {dotacionDelivery.shoeSize} / {dotacionDelivery.overolSize}</div>
              </div>

              <p className="text-xs">
                Por medio de la presente acta se hace entrega formal, física y a título gratuito al trabajador de los siguientes elementos de dotación y protección personal indispensables para el ejercicio seguro de sus labores técnicas en el taller:
              </p>

              {/* Items Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">Ítem</th>
                      <th className="p-2.5">Descripción del Elemento / Dotación</th>
                      <th className="p-2.5">Categoría</th>
                      <th className="p-2.5">Cant.</th>
                      <th className="p-2.5">Talla / Esp.</th>
                      <th className="p-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dotacionDelivery.items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-bold">{idx + 1}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{item.name}</td>
                        <td className="p-2.5 text-slate-600">{item.category}</td>
                        <td className="p-2.5 font-mono">{item.quantity}</td>
                        <td className="p-2.5 font-mono font-bold">{item.size || 'N/A'}</td>
                        <td className="p-2.5 text-neutral-900 font-semibold">{item.condition || 'Nuevo'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-neutral-100/80 border border-neutral-300 rounded-xl text-xs space-y-1.5 text-neutral-950">
                <p className="font-bold">COMPROMISO Y OBLIGATORIEDAD DE USO (Art. 233 CST):</p>
                <p>
                  1. El trabajador se compromete expresamente a utilizar de manera obligatoria y permanente la dotación y EPP entregados durante toda su jornada laboral en las bahías de mecánica, cabinas de pintura y zonas de detailing.
                </p>
                <p>
                  2. El trabajador declara haber recibido la dotación en perfecto estado y adecuada a sus medidas físicas.
                </p>
                <p>
                  3. Queda expresamente prohibido destinar la dotación para fines ajenos al servicio de Aurum Motors o comercializarla.
                </p>
              </div>

              <div className="pt-12 grid grid-cols-2 gap-8 text-xs">
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{dotacionDelivery.deliveredBy}</p>
                  <p className="text-slate-600">Responsable de Entrega / SG-SST</p>
                  <p className="text-slate-600">{company.legalName}</p>
                </div>
                <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</p>
                    <p className="text-slate-600">Trabajador Beneficiario</p>
                    <p className="text-slate-600">{employee.documentType} No. {employee.documentNumber}</p>
                  </div>
                  <div className="w-16 h-20 border border-dashed border-slate-400 rounded flex items-center justify-center text-center p-1 bg-slate-50 text-[8px] text-slate-400">
                    Huella
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. COMPROBANTE DE PAGO Y DESPRENDIBLE DE NÓMINA */}
          {/* ============================================================ */}
          {documentType === 'DESPRENDIBLE_NOMINA' && payrollItem && (
            <div className="space-y-6 text-sm font-sans">
              <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
                <div>
                  <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                    {company.legalName}
                  </h1>
                  <p className="text-xs text-slate-500">
                    NIT: {company.nit}-{company.dv} • {company.address}, {company.city}
                  </p>
                  <p className="text-xs font-semibold text-neutral-900 mt-1">
                    COMPROBANTE OFICIAL DE PAGO DE NÓMINA ELECTRÓNICA
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-800">
                    {periodName || 'Agosto 2026'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Días liquidados: {payrollItem.workedDays || 30} días</p>
                </div>
              </div>

              {/* Employee Header */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Colaborador:</span>
                  <span className="font-bold text-slate-900">{payrollItem.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Identificación:</span>
                  <span className="font-bold text-slate-900">{payrollItem.employeeDoc}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cargo Técnico:</span>
                  <span className="font-bold text-slate-900">{payrollItem.position}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Salario Básico:</span>
                  <span className="font-bold text-neutral-900 font-mono">${(payrollItem.salaryBase ?? payrollItem.basicSalaryAccrued ?? 0).toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Table Accruals & Deductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Devengados */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <h3 className="font-bold text-neutral-900 border-b border-neutral-100 pb-1 uppercase flex justify-between">
                    <span>Conceptos Devengados</span>
                    <span>Valor</span>
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sueldo Básico ({payrollItem.workedDays || 30} días):</span>
                      <span className="font-mono font-medium">${(payrollItem.basicSalaryAccrued ?? 0).toLocaleString('es-CO')}</span>
                    </div>
                    {(payrollItem.transportAllowance ?? 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Auxilio Legal de Transporte:</span>
                        <span className="font-mono font-medium">${(payrollItem.transportAllowance ?? 0).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    {((payrollItem.overtimeAccrued ?? 0) + (payrollItem.surchargesAccrued ?? 0)) > 0 && (
                      <div className="flex justify-between text-blue-700">
                        <span>Horas Extras y Recargos:</span>
                        <span className="font-mono font-medium">${((payrollItem.overtimeAccrued ?? 0) + (payrollItem.surchargesAccrued ?? 0)).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    {(payrollItem.salaryCommissionsAccrued ?? 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Comisiones de Taller:</span>
                        <span className="font-mono font-medium">${(payrollItem.salaryCommissionsAccrued ?? 0).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    {((payrollItem.salaryBonusesAccrued ?? 0) + (payrollItem.nonSalaryBonuses ?? 0)) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bonificación Productividad:</span>
                        <span className="font-mono font-medium">${((payrollItem.salaryBonusesAccrued ?? 0) + (payrollItem.nonSalaryBonuses ?? 0)).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                    <span>TOTAL DEVENGADO:</span>
                    <span className="text-neutral-900 font-mono">${(payrollItem.totalAccrued ?? 0).toLocaleString('es-CO')}</span>
                  </div>
                </div>

                {/* Deducciones */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <h3 className="font-bold text-red-800 border-b border-red-100 pb-1 uppercase flex justify-between">
                    <span>Deducciones de Ley</span>
                    <span>Valor</span>
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Salud Empleado (4%):</span>
                      <span className="font-mono font-medium text-red-600">-${(payrollItem.healthEmployee ?? 0).toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pensión Empleado (4%):</span>
                      <span className="font-mono font-medium text-red-600">-${(payrollItem.pensionEmployee ?? 0).toLocaleString('es-CO')}</span>
                    </div>
                    {((payrollItem.loanDeductions ?? 0) + (payrollItem.advancesDeductions ?? 0)) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cuota Préstamo / Adelanto:</span>
                        <span className="font-mono font-medium text-red-600">-${((payrollItem.loanDeductions ?? 0) + (payrollItem.advancesDeductions ?? 0)).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    {(payrollItem.withholdingTax ?? 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Retención en la Fuente:</span>
                        <span className="font-mono font-medium text-red-600">-${(payrollItem.withholdingTax ?? 0).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                    <span>TOTAL DEDUCCIONES:</span>
                    <span className="text-red-700 font-mono">-${(payrollItem.totalDeductions ?? 0).toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-900 font-bold uppercase block">Neto Pagado al Colaborador:</span>
                  <span className="text-[11px] text-neutral-900">Abonado a cuenta bancaria registrada</span>
                </div>
                <span className="text-xl font-extrabold text-neutral-950 font-mono">
                  ${(payrollItem.netPay ?? 0).toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. LIQUIDACIÓN FINAL DE PRESTACIONES */}
          {/* ============================================================ */}
          {documentType === 'LIQUIDACION_FINAL' && settlement && (
            <div className="space-y-6 text-sm font-sans">
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <p className="text-xs tracking-widest text-slate-500 uppercase font-semibold">República de Colombia • Código Sustantivo del Trabajo</p>
                <h1 className="text-xl font-bold text-slate-950 uppercase mt-1">
                  LIQUIDACIÓN DEFINITIVA DE CONTRATO DE TRABAJO Y PRESTACIONES SOCIALES
                </h1>
                <p className="text-xs font-bold text-neutral-900 mt-1">
                  {company.legalName} • NIT {company.nit}-{company.dv}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div><span className="font-bold text-slate-700">TRABAJADOR:</span> {settlement.employeeName}</div>
                <div><span className="font-bold text-slate-700">DOCUMENTO:</span> {settlement.employeeDoc}</div>
                <div><span className="font-bold text-slate-700">CARGO:</span> {settlement.position}</div>
                <div><span className="font-bold text-slate-700">FECHA INGRESO:</span> {settlement.hireDate}</div>
                <div><span className="font-bold text-slate-700">FECHA RETIRO:</span> {settlement.terminationDate}</div>
                <div><span className="font-bold text-slate-700">TOTAL DÍAS LABORADOS:</span> {settlement.totalDaysWorked}</div>
                <div className="sm:col-span-2"><span className="font-bold text-slate-700">MOTIVO RETIRO:</span> {settlement.reason}</div>
                <div><span className="font-bold text-slate-700">SALARIO BASE:</span> ${(settlement.baseSalary ?? 0).toLocaleString('es-CO')}</div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Concepto Prestacional / Acreencia</th>
                      <th className="p-3 text-center">Días Base</th>
                      <th className="p-3 text-right">Valor Liquidado (COP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold">Salario Pendiente Último Período</td>
                      <td className="p-3 text-center font-mono">{settlement.pendingSalaryDays}</td>
                      <td className="p-3 text-right font-mono font-medium">${(settlement.pendingSalaryAmount ?? 0).toLocaleString('es-CO')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Cesantías Definitivas</td>
                      <td className="p-3 text-center font-mono">{settlement.severanceDays}</td>
                      <td className="p-3 text-right font-mono font-medium">${(settlement.severanceAmount ?? 0).toLocaleString('es-CO')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Intereses sobre Cesantías (12% anual)</td>
                      <td className="p-3 text-center font-mono">{settlement.severanceDays}</td>
                      <td className="p-3 text-right font-mono font-medium">${(settlement.severanceInterestAmount ?? 0).toLocaleString('es-CO')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Prima de Servicios Legal</td>
                      <td className="p-3 text-center font-mono">{settlement.serviceBonusDays}</td>
                      <td className="p-3 text-right font-mono font-medium">${(settlement.serviceBonusAmount ?? 0).toLocaleString('es-CO')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Compensación Vacaciones en Dinero</td>
                      <td className="p-3 text-center font-mono">{settlement.vacationPendingDays}</td>
                      <td className="p-3 text-right font-mono font-medium">${(settlement.vacationAmount ?? 0).toLocaleString('es-CO')}</td>
                    </tr>
                    {settlement.hasIndemnity && (
                      <tr className="bg-neutral-100 text-neutral-950 font-bold">
                        <td className="p-3">Indemnización por Despido Injustificado (Art. 64 CST)</td>
                        <td className="p-3 text-center font-mono">-</td>
                        <td className="p-3 text-right font-mono">${(settlement.indemnityAmount ?? 0).toLocaleString('es-CO')}</td>
                      </tr>
                    )}
                    {(settlement.pendingLoansDeduction ?? 0) > 0 && (
                      <tr className="text-rose-700">
                        <td className="p-3">Deducción de Saldo Préstamo Corporativo</td>
                        <td className="p-3 text-center font-mono">-</td>
                        <td className="p-3 text-right font-mono">-${(settlement.pendingLoansDeduction ?? 0).toLocaleString('es-CO')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">NETO TOTAL A PAGAR AL TRABAJADOR:</span>
                  <span className="text-[11px] text-slate-300">Pago total y definitivo de acreencias</span>
                </div>
                <span className="text-xl font-extrabold text-neutral-600 font-mono">
                  ${(settlement.netSettlementAmount ?? 0).toLocaleString('es-CO')} COP
                </span>
              </div>

              <div className="pt-12 grid grid-cols-2 gap-8 text-xs font-sans">
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{company.legalRepresentative}</p>
                  <p className="text-slate-600">Representante Legal • {company.legalName}</p>
                </div>
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{settlement.employeeName}</p>
                  <p className="text-slate-600">C.C. {settlement.employeeDoc} (Recibí Conforme)</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 5. PAZ Y SALVO LABORAL */}
          {/* ============================================================ */}
          {documentType === 'PAZ_Y_SALVO' && (settlement || employee) && (
            <div className="space-y-8 text-sm font-serif max-w-2xl mx-auto py-8">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold font-sans text-slate-900 uppercase tracking-widest">{company.legalName}</h2>
                <p className="text-xs font-sans text-slate-500">NIT: {company.nit}-{company.dv} • {company.city}</p>
                <div className="w-24 h-0.5 bg-neutral-800 mx-auto my-4"></div>
                <h1 className="text-base font-bold font-sans uppercase tracking-wider text-slate-950">
                  PAZ Y SALVO LABORAL GENERAL Y MUTUO
                </h1>
              </div>

              <p className="text-justify leading-loose">
                Por medio del presente documento, <strong>{company.legalName}</strong> y el colaborador <strong>{(settlement?.employeeName || `${employee?.firstName} ${employee?.lastName}`).toUpperCase()}</strong>, identificado con documento No. <strong>{settlement?.employeeDoc || employee?.documentNumber}</strong>, manifiestan expresamente que a la fecha de terminación del vínculo contractual:
              </p>

              <p className="text-justify leading-loose">
                1. <strong>EL EMPLEADOR</strong> ha pagado íntegra y oportunamente todos los salarios, recargos diurnos y nocturnos, horas extras, dominicales y festivos, auxilio legal de transporte, prestaciones sociales (cesantías, intereses sobre cesantías y prima de servicios), compensación de vacaciones y dotación a que tuvo derecho legal.
              </p>

              <p className="text-justify leading-loose">
                2. <strong>EL TRABAJADOR</strong> declara que ha recibido a entera satisfacción el total de sus acreencias y que ha hecho entrega formal de todas las herramientas de taller, equipos de diagnóstico, dotación de seguridad, carnés y documentos bajo su custodia.
              </p>

              <p className="text-justify leading-loose">
                En constancia de lo anterior, las partes se declaran a PAZ Y SALVO por todo concepto derivado del contrato de trabajo y firman en {company.city}, a los {new Date().getDate()} días del mes de {new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date())} de {new Date().getFullYear()}.
              </p>

              <div className="pt-16 grid grid-cols-2 gap-8 text-xs font-sans">
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{company.legalRepresentative}</p>
                  <p className="text-slate-600">Representante Legal</p>
                </div>
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{settlement?.employeeName || `${employee?.firstName} ${employee?.lastName}`}</p>
                  <p className="text-slate-600">EL TRABAJADOR</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 6. CERTIFICADO LABORAL */}
          {/* ============================================================ */}
          {documentType === 'CERTIFICADO_LABORAL' && employee && (
            <div className="space-y-8 text-sm font-serif max-w-2xl mx-auto py-8">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold font-sans text-slate-900 uppercase tracking-widest">{company.legalName}</h2>
                <p className="text-xs font-sans text-slate-500">NIT: {company.nit}-{company.dv} • {company.city}</p>
                <div className="w-24 h-0.5 bg-neutral-800 mx-auto my-4"></div>
                <h1 className="text-base font-bold font-sans uppercase tracking-wider text-slate-950">
                  LA GERENCIA Y GESTIÓN HUMANA
                </h1>
                <h3 className="text-sm font-sans font-bold text-neutral-900 uppercase">
                  CERTIFICA:
                </h3>
              </div>

              <p className="text-justify leading-loose">
                Que el señor(a) <strong>{employee.firstName.toUpperCase()} {employee.lastName.toUpperCase()}</strong>, identificado(a) con {employee.documentType} No. <strong>{employee.documentNumber}</strong> de {employee.expeditionCity || employee.city}, labora para <strong>{company.legalName}</strong> desde el día <strong>{employee.hireDate}</strong>, mediante contrato de trabajo a <strong>{employee.workerType === 'Salario Integral' ? 'SALARIO INTEGRAL' : 'TÉRMINO INDEFINIDO'}</strong>, desempeñando actualmente el cargo de <strong>{employee.position.toUpperCase()}</strong> en el área de <strong>{employee.department.toUpperCase()}</strong>.
              </p>

              <p className="text-justify leading-loose">
                A la fecha de expedición de la presente certificación, devenga una asignación salarial básica mensual de <strong>${(employee.currentSalary ?? 0).toLocaleString('es-CO')} COP</strong> ({employee.workerType === 'Salario Integral' ? 'Salario Integral' : 'Salario Ordinario'}).
              </p>

              <p className="text-justify leading-loose">
                El presente certificado se expide a solicitud de la parte interesada en la ciudad de {company.city}, a los {new Date().getDate()} días del mes de {new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date())} de {new Date().getFullYear()}.
              </p>

              <div className="pt-16 text-left text-xs font-sans max-w-xs">
                <div className="border-t-2 border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{company.legalRepresentative}</p>
                  <p className="text-slate-600">Representante Legal & Gerente General</p>
                  <p className="text-slate-600">{company.legalName}</p>
                  <p className="text-slate-500">Tel: {company.phone}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Código: CERT-AM-{employee.id.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 7. OTROSÍ AL CONTRATO */}
          {/* ============================================================ */}
          {documentType === 'OTROS_SI' && employee && otrosiData && (
            <div className="space-y-6 text-sm font-sans leading-relaxed text-justify">
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h1 className="text-lg font-bold text-slate-950 uppercase">
                  OTROSÍ No. 01 AL CONTRATO INDIVIDUAL DE TRABAJO
                </h1>
                <p className="text-xs text-slate-600 mt-1">{company.legalName} • {employee.firstName} {employee.lastName}</p>
              </div>

              <p>
                Entre los suscritos a saber: <strong>{company.legalRepresentative}</strong>, actuando en representación legal de <strong>{company.legalName}</strong> (NIT {company.nit}-{company.dv}), por una parte; y por la otra <strong>{employee.firstName} {employee.lastName}</strong>, identificado con {employee.documentType} No. {employee.documentNumber}, han convenido suscribir el presente <strong>OTROSÍ MODIFICATORIO</strong>:
              </p>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <h3 className="font-bold text-xs uppercase text-slate-900">
                  CLÁUSULA PRIMERA — MODIFICACIÓN CONTRACTUAL
                </h3>
                {otrosiData.type === 'SALARIO' && (
                  <p className="text-xs text-slate-800">
                    A partir del <strong>{otrosiData.effectiveDate}</strong>, las partes acuerdan fijar la nueva asignación salarial en la suma de <strong>${(otrosiData.newSalary || employee.currentSalary || 0).toLocaleString('es-CO')} COP</strong>. Motivo: {otrosiData.reason}.
                  </p>
                )}
                {otrosiData.type === 'CARGO' && (
                  <p className="text-xs text-slate-800">
                    A partir del <strong>{otrosiData.effectiveDate}</strong>, EL TRABAJADOR asumirá las funciones de <strong>{otrosiData.newPosition || employee.position}</strong>. Motivo: {otrosiData.reason}.
                  </p>
                )}
                {otrosiData.type === 'PRORROGA' && (
                  <p className="text-xs text-slate-800">
                    Las partes acuerdan prorrogar el contrato a término fijo hasta el día <strong>{otrosiData.newEndDate}</strong>.
                  </p>
                )}
              </div>

              <div className="pt-12 grid grid-cols-2 gap-12 text-xs">
                <div className="border-t border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{company.legalRepresentative}</p>
                  <p className="text-slate-600">Representante Legal</p>
                </div>
                <div className="border-t border-slate-900 pt-2">
                  <p className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</p>
                  <p className="text-slate-600">{employee.documentType} No. {employee.documentNumber}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
