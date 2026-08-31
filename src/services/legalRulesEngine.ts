import { LegalRule, LegalRuleParameters } from '../types';

export const INITIAL_LEGAL_RULES: LegalRule[] = [
  // 1. SALARIOS
  {
    id: 'lr-smlmv-2026',
    codigo: 'SMLMV',
    nombre: 'Salario Mínimo Legal Mensual Vigente',
    descripcion: 'Remuneración mínima obligatoria para todo trabajador dependiente en Colombia en 2026',
    categoria: 'SALARIOS',
    valor: 1423500,
    unidad: '$ COP',
    fuenteNormativa: 'Ministerio del Trabajo / Decreto de Salario Mínimo',
    numeroNorma: 'Decreto Nacional Anual',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Fijado anualmente por Comisión Permanente de Concertación o Decreto Presidencial',
  },
  {
    id: 'lr-aux-transporte-2026',
    codigo: 'AUX_TRANSPORTE',
    nombre: 'Auxilio Legal de Transporte',
    descripcion: 'Subsidio obligatorio para trabajadores que devenguen hasta dos (2) SMLMV',
    categoria: 'SALARIOS',
    valor: 200000,
    unidad: '$ COP',
    fuenteNormativa: 'Ley 15 de 1959 / Decreto Reglamentario Anual',
    numeroNorma: 'Decreto Anual de Auxilio de Transporte',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Aplica si Salario Básico <= (2 * SMLMV) y modalidad no 100% teletrabajo sin desplazamiento',
  },
  {
    id: 'lr-salario-integral-factor',
    codigo: 'SALARIO_INTEGRAL_MIN',
    nombre: 'Mínimo Salario Integral (10 SMLMV + 30% Prestacional)',
    descripcion: 'Mínimo 13 SMLMV (10 salarios mínimos base + 30% factor prestacional exento de prestaciones ordinarias)',
    categoria: 'SALARIOS',
    valor: 18505500,
    unidad: '$ COP',
    fuenteNormativa: 'Código Sustantivo del Trabajo, Art. 132',
    numeroNorma: 'Ley 50 de 1990, Art. 18',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: '10 * SMLMV + 30% factor prestacional = 13 * SMLMV',
  },

  // 2. JORNADA Y HORAS EXTRAS / RECARGOS
  {
    id: 'lr-jornada-maxima-2026',
    codigo: 'JORNADA_MAXIMA_SEMANAL',
    nombre: 'Jornada Laboral Máxima Semanal (Ley 2101)',
    descripcion: 'Reducción gradual de la jornada ordinaria laboral en Colombia (44 horas semanales en 2025/2026)',
    categoria: 'HORAS_EXTRAS_Y_RECARGOS',
    valor: 44,
    unidad: 'Horas',
    fuenteNormativa: 'Ley 2101 de 2021 / Ministerio del Trabajo',
    numeroNorma: 'Ley 2101 de 2021, Art. 2',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2025-07-15',
    formula: 'Divisor mensual = (Horas Semanales * 52 semanas / 12 meses) ≈ 220 horas para 44h semanales',
  },
  {
    id: 'lr-hed-recargo',
    codigo: 'FACTOR_HED',
    nombre: 'Hora Extra Diurna Ordinaria (+25%)',
    descripcion: 'Trabajo suplementario que se realiza entre las 6:00 a.m. y las 7:00 p.m. / 9:00 p.m.',
    categoria: 'HORAS_EXTRAS_Y_RECARGOS',
    valor: 1.25,
    unidad: 'Factor',
    fuenteNormativa: 'Código Sustantivo del Trabajo, Art. 168 numeral 2',
    numeroNorma: 'Ley 2466 de 2025 / CST Art. 168',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Valor Hora Ordinaria * 1.25',
  },
  {
    id: 'lr-hen-recargo',
    codigo: 'FACTOR_HEN',
    nombre: 'Hora Extra Nocturna Ordinaria (+75%)',
    descripcion: 'Trabajo suplementario realizado en jornada nocturna',
    categoria: 'HORAS_EXTRAS_Y_RECARGOS',
    valor: 1.75,
    unidad: 'Factor',
    fuenteNormativa: 'Código Sustantivo del Trabajo, Art. 168 numeral 3',
    numeroNorma: 'Ley 2466 de 2025 / CST Art. 168',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Valor Hora Ordinaria * 1.75',
  },
  {
    id: 'lr-rn-recargo',
    codigo: 'FACTOR_RN',
    nombre: 'Recargo Nocturno Ordinario (+35%)',
    descripcion: 'Recargo por laborar en el horario nocturno (7:00 p.m. a 6:00 a.m. según reforma Ley 2466)',
    categoria: 'HORAS_EXTRAS_Y_RECARGOS',
    valor: 0.35,
    unidad: 'Factor',
    fuenteNormativa: 'Código Sustantivo del Trabajo, Art. 168 / Ley 2466 de 2025',
    numeroNorma: 'Ley 2466 de 2025, Art. 13',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2025-12-01',
    formula: 'Valor Hora Ordinaria * 0.35',
  },
  {
    id: 'lr-rdf-recargo',
    codigo: 'FACTOR_RDF',
    nombre: 'Recargo Dominical y Festivo Ordinario (+100%)',
    descripcion: 'Recargo por trabajo en domingos y festivos conforme al incremento progresivo Ley 2466',
    categoria: 'HORAS_EXTRAS_Y_RECARGOS',
    valor: 1.00,
    unidad: 'Factor',
    fuenteNormativa: 'Ley 2466 de 2025 / CST Art. 179',
    numeroNorma: 'Ley 2466 de 2025, Art. 18',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Valor Hora Ordinaria * 1.00 (Recargo 100% sobre hora ordinaria)',
  },
  {
    id: 'lr-hefd-recargo',
    codigo: 'FACTOR_HEFD',
    nombre: 'Hora Extra Dominical/Festiva Diurna (+100% + 25% = 2.00x)',
    descripcion: 'Hora extra laborada en domingo o festivo durante la jornada diurna',
    categoria: 'HORAS_EXTRAS_Y_RECARGOS',
    valor: 2.00,
    unidad: 'Factor',
    fuenteNormativa: 'CST Art. 168 y 179 / Ley 2466 de 2025',
    numeroNorma: 'Ley 2466 de 2025',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Valor Hora Ordinaria * 2.00',
  },
  {
    id: 'lr-hefn-recargo',
    codigo: 'FACTOR_HEFN',
    nombre: 'Hora Extra Dominical/Festiva Nocturna (+100% + 75% = 2.50x)',
    descripcion: 'Hora extra laborada en domingo o festivo durante la jornada nocturna',
    categoria: 'HORAS_EXTRAS_Y_RECARGOS',
    valor: 2.50,
    unidad: 'Factor',
    fuenteNormativa: 'CST Art. 168 y 179 / Ley 2466 de 2025',
    numeroNorma: 'Ley 2466 de 2025',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Valor Hora Ordinaria * 2.50',
  },

  // 3. SEGURIDAD SOCIAL
  {
    id: 'lr-salud-empleado',
    codigo: 'SALUD_EMPLEADO',
    nombre: 'Aporte Salud Empleado (4%)',
    descripcion: 'Deducción obligatoria de salud al trabajador sobre el IBC',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 4.0,
    unidad: '%',
    fuenteNormativa: 'Ley 100 de 1993, Art. 204 / Ley 1122 de 2007',
    numeroNorma: 'Ley 1122 de 2007, Art. 10',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1993-12-23',
    formula: 'IBC * 0.04',
  },
  {
    id: 'lr-pension-empleado',
    codigo: 'PENSION_EMPLEADO',
    nombre: 'Aporte Pensión Empleado (4%)',
    descripcion: 'Deducción obligatoria de pensión al trabajador sobre el IBC',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 4.0,
    unidad: '%',
    fuenteNormativa: 'Ley 100 de 1993, Art. 20 / Ley 797 de 2003',
    numeroNorma: 'Ley 797 de 2003, Art. 7',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2003-01-29',
    formula: 'IBC * 0.04',
  },
  {
    id: 'lr-salud-empleador',
    codigo: 'SALUD_EMPLEADOR',
    nombre: 'Aporte Salud Empleador (8.5%)',
    descripcion: 'Aporte patronal al SGSSS (Exonerado para trabajadores < 10 SMLMV bajo Art. 114-1 E.T.)',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 8.5,
    unidad: '%',
    fuenteNormativa: 'Ley 100 de 1993, Art. 204 / Estatuto Tributario Art. 114-1',
    numeroNorma: 'Ley 1607 de 2012 / Ley 1819 de 2016',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2016-12-29',
    formula: 'Si exonerado y devengo < 10 SMLMV = 0%, sino IBC * 0.085',
  },
  {
    id: 'lr-pension-empleador',
    codigo: 'PENSION_EMPLEADOR',
    nombre: 'Aporte Pensión Empleador (12%)',
    descripcion: 'Aporte patronal a fondo de pensiones (Colpensiones o Fondos Privados)',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 12.0,
    unidad: '%',
    fuenteNormativa: 'Ley 100 de 1993, Art. 20 / Ley 797 de 2003',
    numeroNorma: 'Ley 797 de 2003, Art. 7',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2003-01-29',
    formula: 'IBC * 0.12',
  },
  {
    id: 'lr-arl-clase-1',
    codigo: 'ARL_CLASE_I',
    nombre: 'Tarifa ARL Riesgo I (Financiero, Administrativo)',
    descripcion: 'Aporte a Riesgos Laborales Clase I a cargo 100% del empleador',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 0.522,
    unidad: '%',
    fuenteNormativa: 'Decreto 1772 de 1994 / Decreto 1072 de 2015',
    numeroNorma: 'Decreto 1072 de 2015, Art. 2.2.4.3.5',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1994-08-03',
    formula: 'IBC * 0.00522',
  },
  {
    id: 'lr-arl-clase-2',
    codigo: 'ARL_CLASE_II',
    nombre: 'Tarifa ARL Riesgo II (Comercio, Manufactura liviana)',
    descripcion: 'Aporte a Riesgos Laborales Clase II',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 1.044,
    unidad: '%',
    fuenteNormativa: 'Decreto 1072 de 2015',
    numeroNorma: 'Decreto 1072 de 2015',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1994-08-03',
    formula: 'IBC * 0.01044',
  },
  {
    id: 'lr-arl-clase-3',
    codigo: 'ARL_CLASE_III',
    nombre: 'Tarifa ARL Riesgo III (Industria, Químicos, Bodegaje)',
    descripcion: 'Aporte a Riesgos Laborales Clase III',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 2.436,
    unidad: '%',
    fuenteNormativa: 'Decreto 1072 de 2015',
    numeroNorma: 'Decreto 1072 de 2015',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1994-08-03',
    formula: 'IBC * 0.02436',
  },
  {
    id: 'lr-arl-clase-4',
    codigo: 'ARL_CLASE_IV',
    nombre: 'Tarifa ARL Riesgo IV (Transporte, Aceites, Almacenaje pesado)',
    descripcion: 'Aporte a Riesgos Laborales Clase IV',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 4.350,
    unidad: '%',
    fuenteNormativa: 'Decreto 1072 de 2015',
    numeroNorma: 'Decreto 1072 de 2015',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1994-08-03',
    formula: 'IBC * 0.04350',
  },
  {
    id: 'lr-arl-clase-5',
    codigo: 'ARL_CLASE_V',
    nombre: 'Tarifa ARL Riesgo V (Construcción, Minería, Alturas)',
    descripcion: 'Aporte a Riesgos Laborales Clase V (Máximo riesgo)',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 6.960,
    unidad: '%',
    fuenteNormativa: 'Decreto 1072 de 2015',
    numeroNorma: 'Decreto 1072 de 2015',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1994-08-03',
    formula: 'IBC * 0.06960',
  },
  {
    id: 'lr-tope-ibc-max',
    codigo: 'TOPE_IBC_MAX',
    nombre: 'Tope Máximo IBC Seguridad Social (25 SMLMV)',
    descripcion: 'Límite superior legal para cotizaciones al Sistema General de Seguridad Social',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 25,
    unidad: 'Factor',
    fuenteNormativa: 'Ley 797 de 2003, Art. 5 / Decreto 510 de 2003',
    numeroNorma: 'Ley 797 de 2003',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2003-01-29',
    formula: 'Min(IBC, 25 * SMLMV)',
  },

  // 4. PARAFISCALES
  {
    id: 'lr-ccf-caja',
    codigo: 'CCF_CAJA',
    nombre: 'Caja de Compensación Familiar (4%)',
    descripcion: 'Aporte patronal parafiscal obligatorio a Caja de Compensación (Compensar, Colsubsidio, Cafam, etc.)',
    categoria: 'PARAFISCALES',
    valor: 4.0,
    unidad: '%',
    fuenteNormativa: 'Ley 21 de 1982, Art. 12',
    numeroNorma: 'Ley 21 de 1982',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1982-01-22',
    formula: 'Nómina mensual de salarios * 0.04 (No exonerado)',
  },
  {
    id: 'lr-sena',
    codigo: 'SENA_PARAFISCAL',
    nombre: 'Aporte SENA (2%)',
    descripcion: 'Aporte patronal al Servicio Nacional de Aprendizaje (Exonerado bajo Art. 114-1 E.T. si devengo < 10 SMLMV)',
    categoria: 'PARAFISCALES',
    valor: 2.0,
    unidad: '%',
    fuenteNormativa: 'Ley 21 de 1982 / Estatuto Tributario Art. 114-1',
    numeroNorma: 'Ley 1607 de 2012',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2012-12-26',
    formula: 'Si exonerado y devengo < 10 SMLMV = 0%, sino Nómina Salarial * 0.02',
  },
  {
    id: 'lr-icbf',
    codigo: 'ICBF_PARAFISCAL',
    nombre: 'Aporte ICBF (3%)',
    descripcion: 'Aporte patronal al Instituto Colombiano de Bienestar Familiar (Exonerado bajo Art. 114-1 E.T.)',
    categoria: 'PARAFISCALES',
    valor: 3.0,
    unidad: '%',
    fuenteNormativa: 'Ley 89 de 1988 / Estatuto Tributario Art. 114-1',
    numeroNorma: 'Ley 1607 de 2012',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2012-12-26',
    formula: 'Si exonerado y devengo < 10 SMLMV = 0%, sino Nómina Salarial * 0.03',
  },

  // 5. PRESTACIONES SOCIALES
  {
    id: 'lr-cesantias-rate',
    codigo: 'PROVISION_CESANTIAS',
    nombre: 'Provisión Legal Cesantías (8.33%)',
    descripcion: 'Un mes de salario por cada año laborado o proporcional por fracción de año',
    categoria: 'PRESTACIONES',
    valor: 8.333,
    unidad: '%',
    fuenteNormativa: 'Código Sustantivo del Trabajo, Art. 249 / Ley 50 de 1990',
    numeroNorma: 'Ley 50 de 1990',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1990-12-28',
    formula: '(Salario Base + Auxilio Transporte + Devengados Salariales) * (Días Trabajados / 360)',
  },
  {
    id: 'lr-intereses-cesantias-rate',
    codigo: 'PROVISION_INT_CESANTIAS',
    nombre: 'Provisión Intereses sobre Cesantías (1.0% mensual / 12% anual)',
    descripcion: '12% anual sobre el saldo de cesantías acumuladas pagadero directamente al trabajador en enero',
    categoria: 'PRESTACIONES',
    valor: 1.0,
    unidad: '%',
    fuenteNormativa: 'Ley 52 de 1975 / Decreto 116 de 1976',
    numeroNorma: 'Ley 52 de 1975',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1975-12-18',
    formula: '(Cesantías * Días Trabajados * 0.12) / 360',
  },
  {
    id: 'lr-prima-servicios-rate',
    codigo: 'PROVISION_PRIMA',
    nombre: 'Provisión Prima de Servicios (8.33%)',
    descripcion: '30 días de salario por año pagadero en dos cuotas: mitad en junio y mitad en diciembre',
    categoria: 'PRESTACIONES',
    valor: 8.333,
    unidad: '%',
    fuenteNormativa: 'Código Sustantivo del Trabajo, Art. 306 / Ley 1788 de 2016',
    numeroNorma: 'Ley 1788 de 2016',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2016-07-07',
    formula: '(Salario Base + Auxilio Transporte + Devengados Salariales) * (Días Semestre / 360)',
  },
  {
    id: 'lr-vacaciones-rate',
    codigo: 'PROVISION_VACACIONES',
    nombre: 'Provisión Descanso Remunerado / Vacaciones (4.17%)',
    descripcion: '15 días hábiles consecutivos de descanso remunerado por cada año de servicios (sin auxilio de transporte)',
    categoria: 'PRESTACIONES',
    valor: 4.167,
    unidad: '%',
    fuenteNormativa: 'Código Sustantivo del Trabajo, Art. 186',
    numeroNorma: 'CST Art. 186',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '1950-08-05',
    formula: '(Salario Básico Ordinario) * (Días Trabajados / 720)',
  },

  // 6. TRIBUTARIO
  {
    id: 'lr-uvt-2026',
    codigo: 'UVT',
    nombre: 'Unidad de Valor Tributario (UVT)',
    descripcion: 'Medida de valor fijada anualmente por la DIAN para calcular retenciones y topes impositivos',
    categoria: 'TRIBUTARIO',
    valor: 49799,
    unidad: '$ COP',
    fuenteNormativa: 'Estatuto Tributario Art. 868 / Resolución DIAN',
    numeroNorma: 'Resolución DIAN Anual',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2026-01-01',
    formula: 'Fijado por la Dirección de Impuestos y Aduanas Nacionales (DIAN)',
  },
  {
    id: 'lr-ley1393-40',
    codigo: 'LIMITE_40_NO_SALARIAL',
    nombre: 'Límite de Pagos No Salariales para IBC (Ley 1393 de 2010 Art. 30)',
    descripcion: 'Los pagos no salariales que excedan el 40% de la remuneración total deben sumar a la base de cotización IBC',
    categoria: 'SEGURIDAD_SOCIAL',
    valor: 40.0,
    unidad: '%',
    fuenteNormativa: 'Ley 1393 de 2010, Art. 30 / Concepto UGPP',
    numeroNorma: 'Ley 1393 de 2010',
    estado: 'Vigente',
    version: '2026.1',
    year: 2026,
    fechaInicio: '2010-07-12',
    formula: 'Exceso = Max(0, Pagos_No_Salariales - (Total_Devengado * 0.40)) -> Suma a IBC',
  },
];

export class LegalRulesEngineService {
  private rules: Map<string, LegalRule>;

  constructor(initialRules: LegalRule[] = INITIAL_LEGAL_RULES) {
    this.rules = new Map();
    initialRules.forEach(r => this.rules.set(r.codigo, r));
  }

  public getAllRules(): LegalRule[] {
    return Array.from(this.rules.values());
  }

  public getRule(code: string): LegalRule | undefined {
    return this.rules.get(code);
  }

  public getValue(code: string, defaultValue: number = 0): number {
    const rule = this.rules.get(code);
    return rule ? rule.valor : defaultValue;
  }

  public updateRule(code: string, updatedValues: Partial<LegalRule>, modifiedBy: string): LegalRule {
    const existing = this.rules.get(code);
    if (!existing) {
      throw new Error(`Regla legal ${code} no encontrada`);
    }

    const updatedRule: LegalRule = {
      ...existing,
      ...updatedValues,
      version: `${existing.year}.${Date.now().toString().slice(-4)}`,
    };

    this.rules.set(code, updatedRule);
    return updatedRule;
  }

  public addCustomRule(rule: LegalRule): void {
    this.rules.set(rule.codigo, rule);
  }

  public getRules(): LegalRuleParameters {
    return {
      smlmv: this.getSMLMV(),
      auxTransporte: this.getAuxTransporte(),
      jornadaSemanal: this.getWeeklyHours(),
      saludEmpleado: this.getValue('SALUD_EMPLEADO', 4.0),
      pensionEmpleado: this.getValue('PENSION_EMPLEADO', 4.0),
      saludEmpleador: this.getValue('SALUD_EMPLEADOR', 8.5),
      pensionEmpleador: this.getValue('PENSION_EMPLEADOR', 12.0),
      cajaCompensacion: this.getValue('CCF_CAJA', 4.0),
      sena: this.getValue('SENA', 2.0),
      icbf: this.getValue('ICBF', 3.0),
      cesantias: this.getValue('CESANTIAS', 8.33),
      interesesCesantias: this.getValue('INTERESES_CESANTIAS', 1.0),
      primaServicios: this.getValue('PRIMA_SERVICIOS', 8.33),
      vacaciones: this.getValue('VACACIONES', 4.17),
      uvt: this.getValue('UVT', 49799),
      factorHED: this.getValue('FACTOR_HED', 1.25),
      factorHEN: this.getValue('FACTOR_HEN', 1.75),
      factorHEFD: this.getValue('FACTOR_HEFD', 2.00),
      factorHEFN: this.getValue('FACTOR_HEFN', 2.50),
      factorRN: this.getValue('FACTOR_RN', 0.35),
      factorRDF: this.getValue('FACTOR_RDF', 0.75),
      exoneracionArt114_1: true,
    };
  }

  public updateRules(params: Partial<LegalRuleParameters>): void {
    if (params.smlmv !== undefined) this.updateRule('SMLMV', { valor: params.smlmv }, 'Admin');
    if (params.auxTransporte !== undefined) this.updateRule('AUX_TRANSPORTE', { valor: params.auxTransporte }, 'Admin');
    if (params.jornadaSemanal !== undefined) this.updateRule('JORNADA_MAXIMA_SEMANAL', { valor: params.jornadaSemanal }, 'Admin');
    if (params.saludEmpleado !== undefined) this.updateRule('SALUD_EMPLEADO', { valor: params.saludEmpleado }, 'Admin');
    if (params.pensionEmpleado !== undefined) this.updateRule('PENSION_EMPLEADO', { valor: params.pensionEmpleado }, 'Admin');
    if (params.saludEmpleador !== undefined) this.updateRule('SALUD_EMPLEADOR', { valor: params.saludEmpleador }, 'Admin');
    if (params.pensionEmpleador !== undefined) this.updateRule('PENSION_EMPLEADOR', { valor: params.pensionEmpleador }, 'Admin');
    if (params.cajaCompensacion !== undefined) this.updateRule('CCF_CAJA', { valor: params.cajaCompensacion }, 'Admin');
    if (params.sena !== undefined) this.updateRule('SENA', { valor: params.sena }, 'Admin');
    if (params.icbf !== undefined) this.updateRule('ICBF', { valor: params.icbf }, 'Admin');
    if (params.cesantias !== undefined) this.updateRule('CESANTIAS', { valor: params.cesantias }, 'Admin');
    if (params.interesesCesantias !== undefined) this.updateRule('INTERESES_CESANTIAS', { valor: params.interesesCesantias }, 'Admin');
    if (params.primaServicios !== undefined) this.updateRule('PRIMA_SERVICIOS', { valor: params.primaServicios }, 'Admin');
    if (params.vacaciones !== undefined) this.updateRule('VACACIONES', { valor: params.vacaciones }, 'Admin');
    if (params.uvt !== undefined) this.updateRule('UVT', { valor: params.uvt }, 'Admin');
    if (params.factorHED !== undefined) this.updateRule('FACTOR_HED', { valor: params.factorHED }, 'Admin');
    if (params.factorHEN !== undefined) this.updateRule('FACTOR_HEN', { valor: params.factorHEN }, 'Admin');
    if (params.factorHEFD !== undefined) this.updateRule('FACTOR_HEFD', { valor: params.factorHEFD }, 'Admin');
    if (params.factorHEFN !== undefined) this.updateRule('FACTOR_HEFN', { valor: params.factorHEFN }, 'Admin');
    if (params.factorRN !== undefined) this.updateRule('FACTOR_RN', { valor: params.factorRN }, 'Admin');
    if (params.factorRDF !== undefined) this.updateRule('FACTOR_RDF', { valor: params.factorRDF }, 'Admin');
  }

  public resetToDefaults(): void {
    this.rules = new Map();
    INITIAL_LEGAL_RULES.forEach(r => this.rules.set(r.codigo, r));
  }

  public getOvertimeMultiplier(type: string): number {
    switch (type) {
      case 'HED': return this.getValue('FACTOR_HED', 1.25);
      case 'HEN': return this.getValue('FACTOR_HEN', 1.75);
      case 'HEFD': return this.getValue('FACTOR_HEFD', 2.00);
      case 'HEFN': return this.getValue('FACTOR_HEFN', 2.50);
      case 'RN': return this.getValue('FACTOR_RN', 0.35);
      case 'RDF': return this.getValue('FACTOR_RDF', 0.75);
      case 'RDNF': return 1.10;
      default: return 1.0;
    }
  }

  // Cálculos parametrizados
  public getSMLMV(): number {
    return this.getValue('SMLMV', 1423500);
  }

  public getAuxTransporte(): number {
    return this.getValue('AUX_TRANSPORTE', 200000);
  }

  public getWeeklyHours(): number {
    return this.getValue('JORNADA_MAXIMA_SEMANAL', 44);
  }

  public getMonthlyHoursDivisor(): number {
    // Para 44h semanales: 44 * 52 / 12 = 190.66 o 220 según doctrina laboral en transición
    const weekly = this.getWeeklyHours();
    return Math.round((weekly * 52) / 12);
  }

  public calculateHourlyRate(monthlySalary: number): number {
    const divisor = this.getMonthlyHoursDivisor();
    return monthlySalary / (divisor > 0 ? divisor : 220);
  }

  public getARLRate(riskClass: string): number {
    switch (riskClass) {
      case 'I': return this.getValue('ARL_CLASE_I', 0.522) / 100;
      case 'II': return this.getValue('ARL_CLASE_II', 1.044) / 100;
      case 'III': return this.getValue('ARL_CLASE_III', 2.436) / 100;
      case 'IV': return this.getValue('ARL_CLASE_IV', 4.350) / 100;
      case 'V': return this.getValue('ARL_CLASE_V', 6.960) / 100;
      default: return 0.00522;
    }
  }

  public calculateFondoSolidaridadRate(salaryIBC: number): number {
    const smlmv = this.getSMLMV();
    const multiplesOfSMLMV = salaryIBC / smlmv;
    if (multiplesOfSMLMV < 4) return 0;
    if (multiplesOfSMLMV <= 16) return 0.01; // 1%
    if (multiplesOfSMLMV <= 17) return 0.012; // 1.2%
    if (multiplesOfSMLMV <= 18) return 0.014; // 1.4%
    if (multiplesOfSMLMV <= 19) return 0.016; // 1.6%
    if (multiplesOfSMLMV <= 20) return 0.018; // 1.8%
    return 0.02; // 2% para > 20 SMLMV
  }
}

export const legalRulesEngine = new LegalRulesEngineService();
