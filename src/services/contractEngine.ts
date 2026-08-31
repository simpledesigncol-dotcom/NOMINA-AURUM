import { Employee, EmploymentContract, Company } from '../types';

export class ContractEngineService {
  public generateContractClauses(
    contractType: string,
    salary: number,
    isIntegralSalary: boolean,
    weeklyHours: number,
    probationDays: number,
    workPlace: string,
    modality: string,
    position: string,
    company: Company
  ): { title: string; content: string }[] {
    const isFixed = contractType === 'Término Fijo';
    const isObra = contractType === 'Obra o Labor';
    const isAprendiz = contractType === 'Aprendizaje';

    return [
      {
        title: 'CLÁUSULA PRIMERA — OBJETO Y ESPECIFICACIÓN DE FUNCIONES TÉCNICAS',
        content: `EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñarse en el cargo de ${position.toUpperCase()} en las instalaciones del taller automotriz de ${company.legalName} (${company.tradeName}). Sus funciones principales comprenden la ejecución técnica con estándares de alta precisión, diagnóstico, reparación, mantenimiento preventivo y correctivo, alistamiento, aplicación de recubrimientos o pintura automotriz al horno, según corresponda a su especialidad, así como todas aquellas actividades conexas, afines y complementarias encomendadas por la Dirección Técnica y de Operaciones.`,
      },
      {
        title: 'CLÁUSULA SEGUNDA — LUGAR DE PRESTACIÓN DEL SERVICIO Y FACULTAD DE TRASLADO (IUS VARIANDI)',
        content: `EL TRABAJADOR prestará sus servicios de manera presencial en la sede principal del taller automotriz ubicada en ${company.address}, en la ciudad de ${company.city}. Las partes acuerdan expresamente que EL EMPLEADOR, en ejercicio legítimo del ius variandi y según las necesidades operativas de servicio, aperturas de nuevas bahías o centros de detailing/pintura de la compañía, podrá determinar traslados temporales o definitivos dentro del perímetro urbano o áreas metropolitanas, garantizando siempre el respeto por los derechos fundamentales, la dignidad del trabajador y sus condiciones salariales.`,
      },
      {
        title: 'CLÁUSULA TERCERA — JORNADA DE TRABAJO Y REDUCCIÓN LEGAL (LEY 2101 DE 2021 Y LEY 2466 DE 2025)',
        content: `EL TRABAJADOR cumplirá una jornada ordinaria de ${weeklyHours || 44} horas semanales, distribuidas en los turnos fijados por EL EMPLEADOR dentro del horario de atención del taller (Lunes a Viernes de 8:00 a.m. a 5:30 p.m. y Sábados de 8:00 a.m. a 1:00 p.m., con los respectivos descansos pactados). Esta jornada acoge plenamente la reducción progresiva de la jornada laboral prevista en la Ley 2101 de 2021 sin disminución de la remuneración. El trabajo suplementario o en días domingos y festivos sólo procederá por orden y autorización previa y escrita de la Gerencia, liquidándose con los recargos de ley conforme al Art. 168 del CST y las reformas de la Ley 2466 de 2025.`,
      },
      {
        title: 'CLÁUSULA CUARTA — REMUNERACIÓN, PERIODICIDAD Y AUXILIO DE TRANSPORTE',
        content: isIntegralSalary 
          ? `EL EMPLEADOR pagará a EL TRABAJADOR un Salario Integral mensual de $${salary.toLocaleString('es-CO')} COP, en el cual se encuentra integrado un factor salarial del 70% ($${Math.round(salary * 0.7).toLocaleString('es-CO')} COP) y un factor prestacional del 30% ($${Math.round(salary * 0.3).toLocaleString('es-CO')} COP). Conforme al Art. 132 del CST, este factor compensa de antemano el valor de prestaciones sociales, recargos nocturnos, dominicales y festivos ordinarios, cesantías y primas legales, quedando únicamente obligado el empleador al pago de vacaciones legales y aportes a la seguridad social y parafiscales sobre el 70% del ingreso.`
          : `EL EMPLEADOR pagará a EL TRABAJADOR un salario básico mensual de $${salary.toLocaleString('es-CO')} COP, pagadero de manera vencida según la periodicidad ${company.paymentFrequency || 'Mensual'}. Adicionalmente, cuando el salario devengado no supere el equivalente a dos (2) Salarios Mínimos Legales Mensuales Vigentes (SMLMV), EL EMPLEADOR reconocerá y pagará el Auxilio Legal de Transporte conforme a la Ley 15 de 1959 y los decretos reglamentarios vigentes.`,
      },
      {
        title: 'CLÁUSULA QUINTA — PAGOS NO CONSTITUTIVOS DE SALARIO (ART. 128 CST)',
        content: `De conformidad con el Artículo 128 del Código Sustantivo del Trabajo (modificado por la Ley 50 de 1990) y el Artículo 15 de la Ley 50 de 1990, las partes acuerdan de manera expresa y libre que los auxilios habituales u ocasionales de alimentación, auxilio de herramientas, bonificaciones de mera liberalidad por cumplimiento de metas de taller, primas extralegales o auxilios de rodamiento que EL EMPLEADOR otorgue, NO constituyen salario ni factor salarial para ningún efecto prestacional, indemnizatorio ni de liquidación de seguridad social, respetando el límite del 40% consagrado en el Art. 30 de la Ley 1393 de 2010.`,
      },
      {
        title: 'CLÁUSULA SEXTA — PERÍODO DE PRUEBA LEGAL (ARTS. 76 A 79 CST)',
        content: `Las partes acuerdan un período de prueba de ${probationDays} días calendario contados a partir de la fecha de inicio del presente contrato. Durante este período, cualquiera de las partes podrá dar por terminado el contrato en cualquier momento, de forma unilateral, motivada o libre, sin que cause preaviso ni indemnización alguna, conforme a los Artículos 76 a 80 del Código Sustantivo del Trabajo. Superado este período con éxito, el contrato continuará su vigencia plena.`,
      },
      {
        title: 'CLÁUSULA SÉPTIMA — OBLIGACIONES ESPECIALES Y CUSTODIA DE VEHÍCULOS DE CLIENTES',
        content: `En razón a la naturaleza de taller automotriz de alta gama de ${company.tradeName}, EL TRABAJADOR asume de manera expresa y rigurosa las siguientes obligaciones especiales: (a) Realizar inspección minuciosa y registro fotográfico de inventario de todo vehículo ingresado a su bahía de trabajo; (b) Cuidar con extrema diligencia los vehículos, llaves, accesorios y pertenencias de los clientes, quedando terminantemente prohibido conducir vehículos de clientes fuera del taller sin orden de prueba de ruta escrita; (c) Emplear los cobertores protectores de timón, palanca y sillas, así como plásticos de enmascarar en áreas no intervenidas; (d) Mantener y custodiar el instrumental técnico, escáneres de diagnóstico, pistolas de pintura HVLP, pulidoras rotorbitales y herramientas de precisión entregadas bajo inventario.`,
      },
      {
        title: 'CLÁUSULA OCTAVA — SEGURIDAD Y SALUD EN EL TRABAJO (SG-SST), DOTACIÓN Y USO OBLIGATORIO DE EPP',
        content: `EL TRABAJADOR se obliga a cumplir estrictamente el Reglamento de Higiene y Seguridad Industrial y el SG-SST (Decreto 1072 de 2015 y Resolución 0312 de 2019). EL EMPLEADOR suministrará la dotación legal de calzado y vestido de labor correspondiente tres (3) veces al año (30 de abril, 31 de agosto y 20 de diciembre) conforme al Art. 230 del CST para salarios de hasta 2 SMLMV, así como los Elementos de Protección Personal (EPP) requeridos: Overol ignífugo, calzado con puntera de seguridad dieléctrica, protección respiratoria 3M con filtros para vapores orgánicos y partículas de pintura, gafas de policarbonato antiempañante y guantes de nitrilo. EL USO DE LOS EPP EN BAHÍA ES OBLIGATORIO Y SU OMISIÓN CONSTITUYE FALTA GRAVE.`,
      },
      {
        title: 'CLÁUSULA NOVENA — CONFIDENCIALIDAD, FÓRMULAS DE COLORIMETRÍA Y SECRETO INDUSTRIAL',
        content: `EL TRABAJADOR se compromete a guardar absoluta reserva y confidencialidad sobre la información técnica, fórmulas de colorimetría y preparación de pintura, procesos de corrección de barniz y detallado cerámico, listas y contactos de clientes, tarifas preferenciales de repuestos y proveedores, y secretos comerciales de ${company.tradeName}. Esta obligación subsistirá aún después de terminado el contrato laboral por un término de dos (2) años. El incumplimiento dará lugar a las acciones civiles y penales pertinentes (Ley 256 de 1996 de Competencia Desleal y Art. 269 y 308 del Código Penal).`,
      },
      {
        title: 'CLÁUSULA DÉCIMA — NO CONCURRENCIA, EXCLUSIVIDAD Y PROHIBICIÓN DE DESVÍO DE CLIENTES',
        content: `EL TRABAJADOR se compromete a no prestar servicios directos ni indirectos en talleres competidores durante la vigencia del presente contrato, ni a realizar trabajos automotrices particulares o domiciliarios a los clientes de ${company.tradeName}, ni a desviar la clientela o comercializar repuestos por cuenta propia utilizando la infraestructura, insumos, prestigio o instalaciones de EL EMPLEADOR.`,
      },
      {
        title: 'CLÁUSULA DÉCIMA PRIMERA — CAUSALES DE TERMINACIÓN CON JUSTA CAUSA (ART. 62 CST)',
        content: `Constituyen justas causas para que EL EMPLEADOR dé por terminado unilateralmente este contrato, sin lugar a indemnización alguna: (a) Las contempladas en el Art. 62 del CST; (b) El daño intencional, culposo o por negligencia grave a los vehículos de los clientes o a la maquinaria del taller; (c) La sustracción o uso no autorizado de herramientas, insumos de pintura/detailing, combustible o repuestos; (d) Conducir vehículos de clientes bajo el efecto del alcohol o sustancias psicoactivas o sin pase de conducción vigente; (e) La no utilización reiterada de la dotación y EPP de seguridad en las áreas de taller y cabina de pintura.`,
      },
      {
        title: 'CLÁUSULA DÉCIMA SEGUNDA — AUTORIZACIÓN EXPRESA DE DESCUENTOS Y ADELANTOS DE NÓMINA',
        content: `EL TRABAJADOR autoriza expresamente a EL EMPLEADOR para deducir de sus salarios ordinarios, prestaciones sociales, vacaciones o liquidación final de contrato de trabajo las sumas adeudadas por concepto de aportes legales obligatorios a seguridad social, retención en la fuente, cuotas de préstamos por libranza autorizados, anticipos o adelantos de nómina previamente desembolsados, o por daños culposos causados a herramientas o vehículos debidamente comprobados y aceptados en descargos con arreglo al Art. 149 y 150 del CST.`,
      },
      {
        title: 'CLÁUSULA DÉCIMA TERCERA — PROTECCIÓN DE DATOS PERSONALES (LEY 1581 DE 2012)',
        content: `En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013, EL TRABAJADOR autoriza de manera voluntaria, previa, explícita e informada a ${company.legalName} para recolectar, almacenar, usar, circular y suprimir sus datos personales y biométricos para el desarrollo de la relación laboral, afiliaciones a seguridad social, pagos de nómina, control de acceso y seguridad perimetral por circuito cerrado de televisión (CCTV) del taller.`,
      },
      {
        title: 'CLÁUSULA DÉCIMA CUARTA — DURACIÓN, PRÓRROGAS Y MÉRITO EJECUTIVO',
        content: isFixed 
          ? `El presente contrato se celebra a TÉRMINO FIJO. Si con antelación no inferior a treinta (30) días calendario a la fecha de vencimiento ninguna de las partes notifica por escrito su intención de darlo por terminado, este se entenderá renovado sucesivamente de acuerdo con lo normado en el Art. 46 del CST y la Ley 2466 de 2025. El presente documento presta mérito ejecutivo pleno ante la jurisdicción laboral ordinaria para la exigibilidad de todas las obligaciones pactadas.`
          : isObra
          ? `El presente contrato se celebra por la duración de la OBRA O LABOR DETERMINADA consistente en la ejecución técnica de los proyectos y órdenes de servicio asignadas en el taller, finalizando una vez culmine la necesidad de la labor contratada.`
          : isAprendiz
          ? `El presente contrato de aprendizaje se rige por la normatividad especial de formación del SENA y las disposiciones laborales de la Ley 2466 de 2025, orientadas a la formación práctica en el oficio automotriz.`
          : `El presente contrato se pacta a TÉRMINO INDEFINIDO y conservará plena vigencia mientras subsistan las causas que le dieron origen y la materia del trabajo. Las partes manifiestan que el presente instrumento presta mérito ejecutivo pleno.`,
      },
    ];
  }

  public createInitialContract(
    employee: Employee, 
    company: Company, 
    customParams?: Partial<EmploymentContract>
  ): EmploymentContract {
    const contractType = customParams?.type || 'Término Indefinido';
    const salary = customParams?.salary || employee.currentSalary || 2000000;
    const isIntegral = customParams?.isIntegralSalary || false;
    const weeklyHours = customParams?.weeklyHours || company.weeklyWorkHours || 44;
    
    // Periodo de prueba legal: máx 60 días para indefinido; o máx 1/5 del término fijo (con tope de 60 días)
    let probation = 60;
    if (contractType === 'Término Fijo') {
      probation = Math.min(60, Math.max(15, Math.round(30)));
    }

    const clauses = this.generateContractClauses(
      contractType,
      salary,
      isIntegral,
      weeklyHours,
      probation,
      employee.city || company.city,
      customParams?.modality || 'Presencial',
      customParams?.position || employee.position,
      company
    );

    const isTransportEligible = !isIntegral && salary <= (1423500 * 2);

    return {
      id: `ctr-${Date.now()}`,
      contractNumber: `CTR-AM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeId: employee.id,
      type: contractType,
      startDate: customParams?.startDate || employee.hireDate || new Date().toISOString().split('T')[0],
      endDate: customParams?.endDate,
      position: customParams?.position || employee.position,
      salary: salary,
      isIntegralSalary: isIntegral,
      hasTransportAllowance: isTransportEligible,
      paymentFrequency: customParams?.paymentFrequency || company.paymentFrequency || 'Mensual',
      weeklyHours: weeklyHours,
      workSchedule: customParams?.workSchedule || 'Lunes a Viernes 8:00 AM - 5:30 PM, Sábados 8:00 AM - 1:00 PM (Turno Taller)',
      workPlace: `${company.address}, ${company.city}`,
      modality: customParams?.modality || 'Presencial',
      probationPeriodDays: probation,
      jobFunctions: [
        `Ejecutar con rigor y alta calidad técnica las actividades correspondientes al cargo de ${employee.position}.`,
        'Cumplir estrictamente los protocolos de inspección, cuidado y protección de los vehículos de los clientes.',
        'Utilizar permanentemente la dotación completa de calzado, vestido de labor y EPP (mascarilla, gafas, guantes, overol).',
        'Preservar y custodiar el banco de herramientas, pistolas de pintura, escáneres e insumos asignados al puesto de trabajo.',
        'Observar activamente las normas del Reglamento Interno de Trabajo y del Sistema SG-SST de Aurum Motors.',
      ],
      benefits: [
        'Afiliación completa y oportuna al Sistema de Seguridad Social Integral (EPS, AFP Protección/Porvenir, ARL Positiva, Compensar).',
        'Entrega cuatrimestral de dotación industrial (Art. 230 CST) y elementos de bioseguridad y protección respiratoria.',
        'Bonificaciones de productividad por índice de satisfacción de cliente y vehículos entregados a tiempo.',
        'Capacitación continua en nuevas tecnologías automotrices, colorimetría y recubrimientos cerámicos de última generación.',
      ],
      clauses: clauses,
      state: 'Vigente',
      version: 1,
      createdAt: new Date().toISOString(),
      signedDate: customParams?.startDate || employee.hireDate || new Date().toISOString().split('T')[0],
    };
  }
}

export const contractEngine = new ContractEngineService();
