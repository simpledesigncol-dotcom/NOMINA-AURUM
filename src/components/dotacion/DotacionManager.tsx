import React, { useState } from 'react';
import { Employee, DotacionDelivery, DotacionItem, Company } from '../../types';
import { 
  Shirt, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  FileText, 
  Printer, 
  UserCheck, 
  Sparkles, 
  AlertTriangle,
  ChevronRight,
  Package,
  Wrench,
  Eye,
  Sliders
} from 'lucide-react';

interface DotacionManagerProps {
  employees: Employee[];
  dotacionDeliveries: DotacionDelivery[];
  company: Company;
  onSaveDelivery: (delivery: DotacionDelivery) => void;
  onOpenDotacionDoc: (delivery: DotacionDelivery, employee: Employee) => void;
  onUpdateEmployeeSizes: (employeeId: string, sizes: { shoeSize: string; overolSize: string; gloveSize?: string }) => void;
}

export const DotacionManager: React.FC<DotacionManagerProps> = ({
  employees,
  dotacionDeliveries,
  company,
  onSaveDelivery,
  onOpenDotacionDoc,
  onUpdateEmployeeSizes,
}) => {
  const [activeTab, setActiveTab] = useState<'DELIVERIES' | 'SIZES' | 'NEW_DELIVERY'>('DELIVERIES');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Segunda Entrega (Agosto 31)');
  
  // New delivery state
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [periodLabel, setPeriodLabel] = useState<any>('Segunda Entrega (Agosto 31)');
  const [notes, setNotes] = useState<string>('Entrega obligatoria cuatrimestral de dotación de taller automotriz y EPP bajo Art. 230 CST.');
  const [deliveredBy, setDeliveredBy] = useState<string>('Mateo Alejandro Cárdenas (Gerente de Taller)');

  // Selected employee
  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Eligible employees (Salario <= 2 SMLMV)
  const eligibleEmployees = employees.filter(e => e.currentSalary <= (1423500 * 2) || e.workerType === 'Dependiente');

  // Custom Items builder for delivery
  const [items, setItems] = useState<DotacionItem[]>([
    { id: 'i-1', name: 'Overol de Taller Ignífugo con bordado Aurum Motors', category: 'Vestido de Labor', quantity: 2, size: selectedEmp?.dotacionSizes?.overolSize || 'L', condition: 'Nuevo' },
    { id: 'i-2', name: 'Botas de Seguridad con Puntera Dieléctrica y Suela Antideslizante', category: 'Calzado', quantity: 1, size: selectedEmp?.dotacionSizes?.shoeSize || '41', condition: 'Nuevo' },
    { id: 'i-3', name: 'Mascarilla Respiratoria 3M con filtros para vapores orgánicos y pintura', category: 'Protección Respiratoria', quantity: 1, size: 'M', condition: 'Nuevo' },
    { id: 'i-4', name: 'Gafas de Seguridad en Policarbonato Antiempañante', category: 'Protección Visual', quantity: 2, condition: 'Nuevo' },
    { id: 'i-5', name: 'Guantes de Nitrilo de Alta Resistencia para Solventes y Aceites', category: 'EPP Seguridad', quantity: 4, size: 'M', condition: 'Nuevo' },
  ]);

  const handleCreateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const newDelivery: DotacionDelivery = {
      id: `dot-${Date.now()}`,
      employeeId: selectedEmp.id,
      employeeName: `${selectedEmp.firstName} ${selectedEmp.lastName}`,
      periodLabel: periodLabel,
      deliveryDate: deliveryDate,
      items: items,
      shoeSize: selectedEmp.dotacionSizes?.shoeSize || '41',
      overolSize: selectedEmp.dotacionSizes?.overolSize || 'L',
      signedByEmployee: true,
      deliveredBy: deliveredBy,
      notes: notes,
      status: 'Entregada',
      actNumber: `ACT-DOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    };

    onSaveDelivery(newDelivery);
    setActiveTab('DELIVERIES');
  };

  return (
    <div className="space-y-6">
      
      {/* iOS Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-inner">
            <Shirt className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">SG-SST & Art. 230-234 CST</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">Ley Colombiana</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Control de Dotación & EPP de Taller</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Administración de entregas cuatrimestrales obligatorias (30 Abr, 31 Ago, 20 Dic), tallas de operarios y actas oficiales.
            </p>
          </div>
        </div>

        {/* iOS Segmented Control */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('DELIVERIES')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'DELIVERIES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historial de Entregas
          </button>
          <button
            onClick={() => setActiveTab('SIZES')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'SIZES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tallas de Taller
          </button>
          <button
            onClick={() => setActiveTab('NEW_DELIVERY')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'NEW_DELIVERY'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Registrar Entrega
          </button>
        </div>
      </div>

      {/* Calendar Alert: Legal Deadlines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            1ª
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Primera Entrega Legal</p>
            <p className="text-sm font-bold text-slate-900">30 de Abril</p>
            <span className="text-[10px] text-emerald-600 font-medium">Cumplida 2026 ✓</span>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            2ª
          </div>
          <div>
            <p className="text-[11px] text-amber-700 font-medium">Segunda Entrega Legal</p>
            <p className="text-sm font-bold text-amber-950">31 de Agosto</p>
            <span className="text-[10px] text-amber-700 font-semibold">Período Actual — En Curso</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
            3ª
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Tercera Entrega Legal</p>
            <p className="text-sm font-bold text-slate-900">20 de Diciembre</p>
            <span className="text-[10px] text-slate-500">Programada</span>
          </div>
        </div>
      </div>

      {/* VIEW: DELIVERIES LIST */}
      {activeTab === 'DELIVERIES' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              Actas de Entrega de Dotación & EPP Registradas ({dotacionDeliveries.length})
            </h2>
            <button
              onClick={() => setActiveTab('NEW_DELIVERY')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Nueva
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dotacionDeliveries.map((delivery) => {
              const emp = employees.find(e => e.id === delivery.employeeId);
              return (
                <div 
                  key={delivery.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 flex flex-col justify-between hover:border-amber-400 hover:shadow-xs transition-all group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{delivery.actNumber}</span>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {delivery.employeeName}
                        </h3>
                        <p className="text-xs text-slate-500">{emp?.position || 'Especialista de Taller'}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100/80 text-emerald-800 text-[10px] font-bold rounded-full">
                        {delivery.status}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-600">
                        <span>Período:</span>
                        <strong className="text-slate-800">{delivery.periodLabel}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Fecha Entrega:</span>
                        <strong className="text-slate-800">{delivery.deliveryDate}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Talla Overol / Calzado:</span>
                        <strong className="text-amber-700 font-mono">{delivery.overolSize} / {delivery.shoeSize}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Elementos entregados:</span>
                        <span className="font-semibold text-slate-800">{delivery.items.length} ítems de taller</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 italic line-clamp-2">
                      "{delivery.notes}"
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Entregado por: {delivery.deliveredBy.split('(')[0]}</span>
                    <button
                      onClick={() => emp && onOpenDotacionDoc(delivery, emp)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-amber-50 hover:border-amber-300 text-slate-700 hover:text-amber-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-600" />
                      Acta Oficial
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: SIZES MANAGEMENT */}
      {activeTab === 'SIZES' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Registro de Tallas de Personal de Taller</h2>
              <p className="text-xs text-slate-500">Tallas oficiales para confección de overoles, calzado de seguridad y dotación técnica.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600">
                  <th className="py-3 px-4 font-semibold">Colaborador</th>
                  <th className="py-3 px-3 font-semibold">Cargo & Especialidad</th>
                  <th className="py-3 px-3 font-semibold">Talla Calzado</th>
                  <th className="py-3 px-3 font-semibold">Talla Overol</th>
                  <th className="py-3 px-3 font-semibold">Talla Guantes</th>
                  <th className="py-3 px-3 font-semibold">Elegibilidad Dotación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{emp.documentNumber}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-slate-800 font-medium">{emp.position}</div>
                      <div className="text-[10px] text-amber-600">{emp.workshopSpecialty || emp.department}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-slate-800">
                        {emp.dotacionSizes?.shoeSize || '41'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-slate-800">
                        {emp.dotacionSizes?.overolSize || 'L'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-slate-800">
                        {emp.dotacionSizes?.gloveSize || 'M'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {emp.currentSalary <= (1423500 * 2) ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">
                          Obligatoria (Art. 230 CST)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-semibold rounded-full">
                          EPP de Taller & Bioseguridad
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: NEW DELIVERY FORM */}
      {activeTab === 'NEW_DELIVERY' && (
        <form onSubmit={handleCreateDelivery} className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200/80 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registrar Nueva Entrega de Dotación y EPP</h2>
              <p className="text-xs text-slate-500">Genera el acta de entrega formal y actualiza el kardex de seguridad y salud en el trabajo.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('DELIVERIES')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Colaborador de Taller *</label>
              <select
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} — {e.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Período Cuatrimestral Legal *</label>
              <select
                value={periodLabel}
                onChange={e => setPeriodLabel(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
              >
                <option value="Primera Entrega (Abril 30)">Primera Entrega (Abril 30)</option>
                <option value="Segunda Entrega (Agosto 31)">Segunda Entrega (Agosto 31)</option>
                <option value="Tercera Entrega (Diciembre 20)">Tercera Entrega (Diciembre 20)</option>
                <option value="Dotación Extraordinaria / Ingreso">Dotación Extraordinaria / Ingreso</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Fecha de Entrega Física *</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Items to deliver */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              Elementos de Dotación & EPP a Entregar
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <span className="text-[10px] text-slate-500 font-medium">Categoría: {item.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-800">
                      Cant: {item.quantity} {item.size ? `(${item.size})` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Responsable de Entrega (Taller)</label>
              <input
                type="text"
                value={deliveredBy}
                onChange={e => setDeliveredBy(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Observaciones / Estado del Equipo</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('DELIVERIES')}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-2xl text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-colors"
            >
              Guardar Entrega y Generar Acta
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
