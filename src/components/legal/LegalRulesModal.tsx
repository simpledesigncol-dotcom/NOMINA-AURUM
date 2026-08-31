import React, { useState } from 'react';
import { LegalRuleParameters } from '../../types';
import { legalRulesEngine } from '../../services/legalRulesEngine';
import { 
  Scale, 
  Settings2, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  ShieldCheck, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

interface LegalRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRulesUpdated: () => void;
}

export const LegalRulesModal: React.FC<LegalRulesModalProps> = ({
  isOpen,
  onClose,
  onRulesUpdated,
}) => {
  const [rules, setRules] = useState<LegalRuleParameters>(legalRulesEngine.getRules());
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    legalRulesEngine.updateRules(rules);
    onRulesUpdated();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  const handleResetDefaults = () => {
    legalRulesEngine.resetToDefaults();
    setRules(legalRulesEngine.getRules());
    onRulesUpdated();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Motor de Reglas y Parámetros Legales (Ley 2466 / CST)</h2>
              <p className="text-xs text-slate-400">
                Arquitectura desacoplada: No hay números mágicos en código. Modifique salarios, UVT y porcentajes sin tocar la aplicación.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ¡Parámetros normativos actualizados exitosamente! Todos los cálculos de nómina reflejan las nuevas tasas.
            </div>
          )}

          {/* 1. Salarios y Topes */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              1. Parámetros Monetarios Base (Vigencia {rules.year})
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SMLMV (Salario Mínimo)</label>
                <input
                  type="number"
                  step="1000"
                  value={rules.smlmv}
                  onChange={e => setRules({ ...rules, smlmv: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auxilio de Transporte Legal</label>
                <input
                  type="number"
                  step="1000"
                  value={rules.transportAllowance}
                  onChange={e => setRules({ ...rules, transportAllowance: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Valor UVT Dian ({rules.year})</label>
                <input
                  type="number"
                  step="100"
                  value={rules.uvtValue}
                  onChange={e => setRules({ ...rules, uvtValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 2. Jornada y Recargos Ley 2466 */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              2. Jornada Laboral y Recargos (Ley 2101 y Ley 2466 de 2025)
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jornada Semanal (Horas)</label>
                <input
                  type="number"
                  value={rules.weeklyWorkHours}
                  onChange={e => setRules({ ...rules, weeklyWorkHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400">44 horas (Ley 2101)</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recargo Nocturno (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rules.nightSurchargeRate}
                  onChange={e => setRules({ ...rules, nightSurchargeRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400">0.35 (35%) desde 7:00 PM</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recargo Dominical (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rules.sundayHolidaySurchargeRate}
                  onChange={e => setRules({ ...rules, sundayHolidaySurchargeRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-emerald-800"
                />
                <span className="text-[10px] text-slate-400">1.00 (100% Ley 2466)</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tope Límite Salario Int.</label>
                <input
                  type="number"
                  value={rules.integralSalaryMinimumSmlmv}
                  onChange={e => setRules({ ...rules, integralSalaryMinimumSmlmv: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400">13 SMLMV (10 + 3)</span>
              </div>
            </div>
          </div>

          {/* 3. Seguridad Social y Parafiscales */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              3. Aportes a Seguridad Social y Parafiscales
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Salud Trabajador</label>
                <input
                  type="number"
                  step="0.005"
                  value={rules.healthEmployeeRate}
                  onChange={e => setRules({ ...rules, healthEmployeeRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400">4.0%</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pensión Trabajador</label>
                <input
                  type="number"
                  step="0.005"
                  value={rules.pensionEmployeeRate}
                  onChange={e => setRules({ ...rules, pensionEmployeeRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400">4.0%</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pensión Empleador</label>
                <input
                  type="number"
                  step="0.005"
                  value={rules.pensionEmployerRate}
                  onChange={e => setRules({ ...rules, pensionEmployerRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400">12.0%</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caja Compensación</label>
                <input
                  type="number"
                  step="0.005"
                  value={rules.compensationBoxRate}
                  onChange={e => setRules({ ...rules, compensationBoxRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-400">4.0%</span>
              </div>
            </div>
          </div>

          {/* 4. Tabla de ARL */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              4. Tabla Tarifaria de Riesgos Laborales (ARL)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clase I (Oficina)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={rules.arlRates.I}
                  onChange={e => setRules({ ...rules, arlRates: { ...rules.arlRates, I: Number(e.target.value) } })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400">0.522%</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clase II (Comercio)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={rules.arlRates.II}
                  onChange={e => setRules({ ...rules, arlRates: { ...rules.arlRates, II: Number(e.target.value) } })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400">1.044%</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clase III (Bodega)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={rules.arlRates.III}
                  onChange={e => setRules({ ...rules, arlRates: { ...rules.arlRates, III: Number(e.target.value) } })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400">2.436%</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clase IV (Transp.)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={rules.arlRates.IV}
                  onChange={e => setRules({ ...rules, arlRates: { ...rules.arlRates, IV: Number(e.target.value) } })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400">4.350%</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clase V (Construc.)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={rules.arlRates.V}
                  onChange={e => setRules({ ...rules, arlRates: { ...rules.arlRates, V: Number(e.target.value) } })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono text-[11px]"
                />
                <span className="text-[10px] text-slate-400">6.960%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Valores por Defecto 2026
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Guardar y Recalcular
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
