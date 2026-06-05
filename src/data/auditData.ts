export interface Area {
  id: number;
  name: string;
  icon: string;
  colorKey: string;
  colorHex: string;
  subtitle: string;
  description: string;
}

export type QuestionType = 'yesno' | 'yesno_text' | 'single' | 'checkbox' | 'scale' | 'number';

export interface FollowUpField {
  type: 'textarea' | 'text' | 'number' | 'radio' | 'checkbox';
  label: string;
  placeholder?: string;
  suffix?: string;
  options?: string[];
}

export interface QuestionOption {
  label: string;
  points: number;
}

export interface Question {
  id: string;
  areaId: number;
  type: QuestionType;
  question: string;
  hint?: string;
  yesLabel?: string;
  noLabel?: string;
  yesPoints?: number;
  noPoints?: number;
  followUp?: FollowUpField;
  options?: QuestionOption[];
  exclusiveOption?: string;
  pointsPerOption?: number;
  maxPoints?: number;
  scaleLeftLabel?: string;
  scaleRightLabel?: string;
  scalePoints?: number[];
  suffix?: string;
  numberRanges?: { min: number; max: number; points: number }[];
  placeholder?: string;
}

export const areas: Area[] = [
  { id: 1, name: 'Análisis Situacional', icon: '📊', colorKey: 'situational', colorHex: '#2563EB', subtitle: '¿Conoces tu mercado y tu posición en él?', description: 'Evaluamos qué tan bien conoces tu entorno, competencia y cliente ideal.' },
  { id: 2, name: 'Objetivos y Metas', icon: '🎯', colorKey: 'goals', colorHex: '#7C3AED', subtitle: '¿Sabes exactamente hacia dónde vas?', description: 'Evaluamos si tienes metas claras, medibles y con recursos asignados.' },
  { id: 3, name: 'Estrategia de Marca', icon: '🧭', colorKey: 'strategy', colorHex: '#0891B2', subtitle: '¿Tienes un camino claro para diferenciarte?', description: 'Evaluamos tu posicionamiento, propuesta de valor y coherencia de marca.' },
  { id: 4, name: 'Tácticas y Contenido', icon: '🛠️', colorKey: 'tactics', colorHex: '#D97706', subtitle: '¿Qué acciones concretas estás ejecutando?', description: 'Evaluamos la consistencia y variedad de tus acciones de marketing.' },
  { id: 5, name: 'Medición y Control', icon: '📈', colorKey: 'measurement', colorHex: '#059669', subtitle: '¿Sabes realmente qué está funcionando?', description: 'Evaluamos si tienes sistemas para medir, controlar y mejorar resultados.' },
  { id: 6, name: 'Post-Venta y Fidelización', icon: '🔄', colorKey: 'postsale', colorHex: '#DC2626', subtitle: '¿Cuidas a los clientes que ya tienes?', description: 'Evaluamos si conviertes clientes en promotores leales de tu marca.' },
];

export const questions: Question[] = [
  // AREA 1
  { id: 'a1q1', areaId: 1, type: 'yesno_text', question: '¿Tienes definida la misión y visión de tu negocio?', hint: 'No necesita estar escrita formalmente, con tenerla clara es suficiente.', yesLabel: 'Sí, la tengo definida', noLabel: 'No, aún no la he definido', yesPoints: 20, noPoints: 0, followUp: { type: 'textarea', label: 'Descríbela brevemente', placeholder: 'Ej: Ayudamos a emprendedores latinoamericanos a digitalizar sus negocios...' } },
  { id: 'a1q2', areaId: 1, type: 'checkbox', question: '¿En qué redes sociales tienes presencia activa?', hint: 'Marca solo las que actualizas con regularidad.', options: [{ label: 'Instagram', points: 4 }, { label: 'Facebook', points: 4 }, { label: 'TikTok', points: 4 }, { label: 'LinkedIn', points: 4 }, { label: 'YouTube', points: 4 }, { label: 'Twitter/X', points: 4 }, { label: 'Pinterest', points: 4 }, { label: 'WhatsApp Business', points: 4 }, { label: 'Ninguna', points: 0 }], exclusiveOption: 'Ninguna', pointsPerOption: 4, maxPoints: 20 },
  { id: 'a1q3', areaId: 1, type: 'yesno_text', question: '¿Tienes identificados a tus competidores principales?', yesLabel: 'Sí, los conozco bien', noLabel: 'No los tengo claros', yesPoints: 20, noPoints: 0, followUp: { type: 'text', label: 'Menciona 2 o 3 competidores principales', placeholder: 'Ej: Empresa A, Empresa B, Marca C...' } },
  { id: 'a1q4', areaId: 1, type: 'yesno_text', question: '¿Tienes definido tu cliente ideal (Buyer Persona)?', hint: '¿Sabes quién es, qué necesita y cómo toma decisiones de compra?', yesLabel: 'Sí, lo tengo claro', noLabel: 'No, es algo muy general', yesPoints: 20, noPoints: 0, followUp: { type: 'textarea', label: 'Descríbelo brevemente', placeholder: 'Ej: Mujer de 30-45 años, dueña de negocio, busca más clientes online...' } },
  { id: 'a1q5', areaId: 1, type: 'single', question: '¿Con qué frecuencia analizas a tu competencia?', options: [{ label: 'Regularmente (cada mes o más)', points: 20 }, { label: 'Ocasionalmente (cada 3 a 6 meses)', points: 12 }, { label: 'Casi nunca', points: 4 }, { label: 'Nunca lo hago', points: 0 }] },

  // AREA 2
  { id: 'a2q1', areaId: 2, type: 'yesno_text', question: '¿Tienes objetivos de marketing definidos para este año?', yesLabel: 'Sí, los tengo claros', noLabel: 'No, trabajo sin objetivos formales', yesPoints: 20, noPoints: 0, followUp: { type: 'textarea', label: '¿Cuál es tu objetivo principal este año?', placeholder: 'Ej: Aumentar ventas 40%, conseguir 200 clientes nuevos...' } },
  { id: 'a2q2', areaId: 2, type: 'yesno', question: '¿Tus objetivos tienen métricas claras para medirlos?', hint: 'Ej: "10.000 seguidores" en lugar de "crecer en redes".', yesLabel: 'Sí, son concretos y medibles', noLabel: 'No, son más bien generales', yesPoints: 20, noPoints: 0 },
  { id: 'a2q3', areaId: 2, type: 'single', question: '¿Con qué frecuencia revisas el avance de tus metas?', options: [{ label: 'Semanalmente', points: 20 }, { label: 'Mensualmente', points: 15 }, { label: 'Trimestralmente', points: 8 }, { label: 'No las reviso regularmente', points: 0 }] },
  { id: 'a2q4', areaId: 2, type: 'yesno_text', question: '¿Tienes un presupuesto asignado para marketing?', yesLabel: 'Sí, tengo un presupuesto definido', noLabel: 'No, invierto según pueda', yesPoints: 20, noPoints: 0, followUp: { type: 'number', label: '¿Qué % de tus ingresos inviertes en marketing?', placeholder: '10', suffix: '%' } },
  { id: 'a2q5', areaId: 2, type: 'single', question: '¿Cuánto tiempo lleva activo tu negocio?', options: [{ label: 'Menos de 6 meses', points: 8 }, { label: '6 meses a 2 años', points: 12 }, { label: '2 a 5 años', points: 17 }, { label: 'Más de 5 años', points: 20 }] },

  // AREA 3
  { id: 'a3q1', areaId: 3, type: 'yesno_text', question: '¿Tienes una propuesta de valor clara y diferenciada?', hint: '¿Puedes explicar en una frase por qué elegirte a ti y no a la competencia?', yesLabel: 'Sí, sé exactamente qué nos diferencia', noLabel: 'No, aún no lo tengo del todo claro', yesPoints: 20, noPoints: 0, followUp: { type: 'textarea', label: '¿Cuál es tu propuesta de valor?', placeholder: 'Ej: Somos la única agencia que garantiza resultados en 30 días...' } },
  { id: 'a3q2', areaId: 3, type: 'yesno', question: '¿Tienes definido el tono de voz de tu marca?', hint: '¿Tu marca habla formal, cercana, divertida o experta? ¿Es consistente en todos tus canales?', yesLabel: 'Sí, es consistente en todos mis canales', noLabel: 'No, cambia según quién publica', yesPoints: 20, noPoints: 0 },
  { id: 'a3q3', areaId: 3, type: 'single', question: '¿Cuál es tu canal de ventas principal actualmente?', options: [{ label: 'Redes sociales (orgánico)', points: 15 }, { label: 'Publicidad pagada (Meta Ads, Google...)', points: 18 }, { label: 'Referidos y boca a boca', points: 12 }, { label: 'Sitio web / E-commerce', points: 18 }, { label: 'WhatsApp directo', points: 12 }, { label: 'Tienda física', points: 10 }, { label: 'No tengo canal definido', points: 0 }] },
  { id: 'a3q4', areaId: 3, type: 'checkbox', question: '¿En qué te diferencias principalmente de tu competencia?', hint: 'Selecciona todos los que aplican realmente a tu negocio.', options: [{ label: 'Precio más accesible', points: 5 }, { label: 'Mayor calidad', points: 5 }, { label: 'Atención al cliente excepcional', points: 5 }, { label: 'Velocidad de entrega', points: 5 }, { label: 'Especialización única', points: 5 }, { label: 'Innovación / tecnología', points: 5 }, { label: 'Marca personal fuerte', points: 5 }, { label: 'Garantías exclusivas', points: 5 }], pointsPerOption: 5, maxPoints: 20 },
  { id: 'a3q5', areaId: 3, type: 'scale', question: '¿Qué tan consistente es tu identidad visual en todos tus canales?', hint: 'Colores, logo, tipografía y estilo de imágenes.', scaleLeftLabel: 'Muy inconsistente', scaleRightLabel: 'Totalmente consistente', scalePoints: [0, 5, 10, 15, 20] },

  // AREA 4
  { id: 'a4q1', areaId: 4, type: 'yesno_text', question: '¿Tienes un plan o calendario de contenidos?', yesLabel: 'Sí, publico de forma planificada', noLabel: 'No, publico cuando puedo o me acuerdo', yesPoints: 20, noPoints: 0, followUp: { type: 'radio', label: '¿Con qué frecuencia publicas?', options: ['Diariamente', '3–5 veces por semana', '1–2 veces por semana', 'Cada dos semanas', 'Menos frecuente'] } },
  { id: 'a4q2', areaId: 4, type: 'checkbox', question: '¿Qué tipo de contenido produces regularmente?', hint: 'Marca los que produces al menos una vez al mes.', options: [{ label: 'Videos / Reels', points: 4 }, { label: 'Imágenes / Carruseles', points: 4 }, { label: 'Stories / Historias', points: 4 }, { label: 'Artículos o Blog', points: 4 }, { label: 'Email / Newsletter', points: 4 }, { label: 'Podcasts', points: 4 }, { label: 'Infografías', points: 4 }, { label: 'No produzco contenido', points: 0 }], exclusiveOption: 'No produzco contenido', pointsPerOption: 4, maxPoints: 20 },
  { id: 'a4q3', areaId: 4, type: 'yesno_text', question: '¿Realizas publicidad pagada para tu negocio?', yesLabel: 'Sí, invierto en publicidad', noLabel: 'No, solo hago marketing orgánico', yesPoints: 20, noPoints: 5, followUp: { type: 'checkbox', label: '¿En qué plataformas pautas?', options: ['Meta Ads (Facebook/Instagram)', 'Google Ads', 'TikTok Ads', 'LinkedIn Ads', 'YouTube Ads', 'Otra plataforma'] } },
  { id: 'a4q4', areaId: 4, type: 'yesno_text', question: '¿Tienes un proceso para captar nuevos clientes potenciales (leads)?', yesLabel: 'Sí, tengo un proceso definido', noLabel: 'No, los clientes llegan de forma espontánea', yesPoints: 20, noPoints: 0, followUp: { type: 'textarea', label: '¿Cómo es tu proceso principal de captación?', placeholder: 'Ej: Formulario en mi web, DMs en Instagram, WhatsApp Business...' } },
  { id: 'a4q5', areaId: 4, type: 'single', question: '¿Cuántas acciones de marketing ejecutas activamente cada mes?', options: [{ label: 'Más de 15 acciones', points: 20 }, { label: '8 a 15 acciones', points: 15 }, { label: '4 a 7 acciones', points: 8 }, { label: '1 a 3 acciones', points: 3 }, { label: 'Casi ninguna', points: 0 }] },

  // AREA 5
  { id: 'a5q1', areaId: 5, type: 'yesno_text', question: '¿Mides regularmente los resultados de tus acciones de marketing?', yesLabel: 'Sí, tengo métricas que reviso con frecuencia', noLabel: 'No, trabajo más por intuición', yesPoints: 20, noPoints: 0, followUp: { type: 'text', label: '¿Qué herramientas usas para medir?', placeholder: 'Ej: Meta Business Suite, Google Analytics, Excel, Notion...' } },
  { id: 'a5q2', areaId: 5, type: 'single', question: '¿Con qué frecuencia revisas tus métricas clave?', options: [{ label: 'Diariamente', points: 20 }, { label: 'Semanalmente', points: 17 }, { label: 'Mensualmente', points: 10 }, { label: 'Rara vez o nunca', points: 0 }] },
  { id: 'a5q3', areaId: 5, type: 'number', question: '¿Cuántos clientes activos tiene tu negocio aproximadamente?', suffix: 'clientes', placeholder: 'Escribe un número aproximado', numberRanges: [{ min: 0, max: 0, points: 0 }, { min: 1, max: 10, points: 8 }, { min: 11, max: 50, points: 13 }, { min: 51, max: 200, points: 17 }, { min: 201, max: 999999, points: 20 }] },
  { id: 'a5q4', areaId: 5, type: 'single', question: '¿Conoces tu tasa de conversión de prospectos a clientes?', options: [{ label: 'Sí, la mido y está por encima del 20%', points: 20 }, { label: 'Sí, la mido y está entre 5% y 20%', points: 15 }, { label: 'Sí, pero está por debajo del 5%', points: 8 }, { label: 'No la he calculado nunca', points: 0 }] },
  { id: 'a5q5', areaId: 5, type: 'yesno', question: '¿Tienes documentados los procesos clave de tu negocio?', hint: '¿Si alguien te ayudara mañana, podría entender cómo funciona tu marketing?', yesLabel: 'Sí, están documentados y son replicables', noLabel: 'No, todo está solo en mi cabeza', yesPoints: 20, noPoints: 0 },

  // AREA 6
  { id: 'a6q1', areaId: 6, type: 'yesno_text', question: '¿Tienes un proceso de seguimiento después de una venta?', yesLabel: 'Sí, tengo un proceso definido', noLabel: 'No, la relación termina con la venta', yesPoints: 20, noPoints: 0, followUp: { type: 'textarea', label: '¿Cómo es ese proceso?', placeholder: 'Ej: Llamo a los 7 días, envío encuesta, tengo grupo de WhatsApp...' } },
  { id: 'a6q2', areaId: 6, type: 'yesno_text', question: '¿Mides la satisfacción de tus clientes?', yesLabel: 'Sí, tengo una forma de medirla', noLabel: 'No de forma formal', yesPoints: 20, noPoints: 0, followUp: { type: 'text', label: '¿Cómo la mides?', placeholder: 'Ej: Encuestas, Google Forms, NPS, reseñas en Google Maps...' } },
  { id: 'a6q3', areaId: 6, type: 'checkbox', question: '¿Qué estrategias usas para que tus clientes vuelvan a comprarte?', hint: 'Selecciona todas las que aplicas actualmente.', options: [{ label: 'Descuentos para clientes frecuentes', points: 5 }, { label: 'Newsletter o correo regular', points: 5 }, { label: 'Programa de puntos o lealtad', points: 5 }, { label: 'Seguimiento por WhatsApp', points: 5 }, { label: 'Comunidad de clientes', points: 5 }, { label: 'Contenido exclusivo para clientes', points: 5 }, { label: 'Ninguna actualmente', points: 0 }], exclusiveOption: 'Ninguna actualmente', pointsPerOption: 5, maxPoints: 20 },
  { id: 'a6q4', areaId: 6, type: 'single', question: '¿Qué porcentaje de tus ventas vienen de clientes que ya te compraron antes?', options: [{ label: 'No lo sé con certeza', points: 0 }, { label: 'Menos del 20%', points: 5 }, { label: 'Entre el 20% y 40%', points: 12 }, { label: 'Entre el 40% y 60%', points: 17 }, { label: 'Más del 60%', points: 20 }] },
  { id: 'a6q5', areaId: 6, type: 'yesno', question: '¿Pides activamente referidos a tus clientes satisfechos?', yesLabel: 'Sí, tengo un proceso para pedirlos', noLabel: 'No, espero que lleguen solos', yesPoints: 20, noPoints: 0 },
];

export interface Recommendations {
  critical: string[];
  medium: string[];
  advanced: string[];
}

export const recommendations: Record<number, Recommendations> = {
  1: {
    critical: ['Define tu misión en una frase: "(Negocio) ayuda a (cliente) a (resultado) sin (obstáculo)".', 'Crea un perfil de cliente ideal con nombre, edad y su problema principal.', 'Identifica 3 competidores y anota qué hacen diferente a ti.'],
    medium: ['Valida tu buyer persona con encuestas a clientes actuales.', 'Realiza un análisis FODA completo de tu negocio.', 'Estudia la propuesta de valor de tus 3 principales competidores.'],
    advanced: ['Actualiza tu análisis de mercado cada trimestre.', 'Implementa alertas de Google para monitorear competidores.', 'Crea mapas de empatía para cada segmento de cliente.'],
  },
  2: {
    critical: ['Define 3 objetivos concretos para los próximos 90 días.', 'Agrega un número a cada objetivo: ¿cuántos clientes, cuánto en ventas?', 'Reserva al menos el 5% de tus ingresos exclusivamente para marketing.'],
    medium: ['Crea un dashboard simple con tus 5 métricas más importantes.', 'Implementa revisiones mensuales de objetivos en fechas fijas.', 'Desglosa tus objetivos anuales en metas mensuales accionables.'],
    advanced: ['Conecta tus objetivos de marketing con los financieros.', 'Implementa revisiones semanales automáticas de tus KPIs principales.', 'Alinea las metas de marketing con cada área de tu negocio.'],
  },
  3: {
    critical: ['Escribe tu propuesta de valor en una sola frase poderosa y memorable.', 'Elige 3 adjetivos que definan la personalidad de tu marca.', 'Enfócate en UN solo canal principal antes de diversificarte.'],
    medium: ['Crea una guía de tono de voz con ejemplos concretos de qué decir y no decir.', 'Haz una auditoría de coherencia visual en todos tus canales activos.', 'Documenta tu propuesta de valor y compártela con todo tu equipo.'],
    advanced: ['Prueba tu posicionamiento con entrevistas reales a clientes actuales.', 'Crea un manual de identidad de marca completo y actualizado.', 'Realiza un audit semestral de marca para detectar inconsistencias.'],
  },
  4: {
    critical: ['Crea un calendario de contenido simple para las próximas 4 semanas.', 'Produce 1 pieza de contenido de valor por semana, sin excepción.', 'Define un proceso básico para que los clientes interesados te contacten.'],
    medium: ['Produce contenido de varias semanas en un solo día de grabación o diseño.', 'Prueba publicidad pagada con un presupuesto pequeño ($5–10 por día) para testear.', 'Crea un lead magnet gratuito para captar correos de prospectos interesados.'],
    advanced: ['Diversifica canales para no depender de una sola fuente de clientes.', 'Implementa una estrategia de contenido en embudo completo (atracción, consideración, cierre).', 'Mide el costo de adquisición de cliente por cada canal activo.'],
  },
  5: {
    critical: ['Instala Google Analytics en tu web y Meta Business Suite para redes.', 'Define 3 métricas clave que revisarás cada semana, sin excepción.', 'Registra tus ventas mensuales en una hoja de cálculo simple.'],
    medium: ['Crea un panel semanal con todas tus métricas en una sola vista.', 'Calcula tu tasa de conversión y conviértela en objetivo de mejora.', 'Documenta al menos tus 3 procesos principales de marketing.'],
    advanced: ['Centraliza toda la información de clientes en un solo lugar.', 'Conecta todas tus herramientas de medición en un panel unificado.', 'Configura alertas automáticas cuando alguna métrica se desvíe de su objetivo.'],
  },
  6: {
    critical: ['Envía un mensaje de agradecimiento a cada cliente en las primeras 24 horas.', 'Crea una encuesta de 3 preguntas para enviar después de cada compra.', 'Contacta a tus últimos 10 clientes y pídeles un testimonio o reseña.'],
    medium: ['Crea un grupo de WhatsApp exclusivo para clientes con contenido de valor.', 'Diseña un proceso simple y natural para pedir referidos a clientes felices.', 'Implementa una secuencia de 3 mensajes post-compra para mantener la relación.'],
    advanced: ['Implementa un programa de fidelización con beneficios escalonados por nivel.', 'Calcula cuánto vale un cliente a lo largo de toda su relación contigo.', 'Crea una comunidad activa de clientes como motor de crecimiento orgánico.'],
  },
};

export function getQuestionsForArea(areaId: number): Question[] {
  return questions.filter(q => q.areaId === areaId);
}

export function getLevelInfo(score: number): { label: string; colorClass: string; colorHex: string } {
  if (score <= 40) return { label: 'Crítico', colorClass: 'text-level-critical', colorHex: '#DC2626' };
  if (score <= 60) return { label: 'En Desarrollo', colorClass: 'text-level-developing', colorHex: '#F97316' };
  if (score <= 80) return { label: 'Intermedio', colorClass: 'text-level-intermediate', colorHex: '#D97706' };
  return { label: 'Avanzado', colorClass: 'text-level-advanced', colorHex: '#059669' };
}

export function getRecommendationsForArea(
  areaId: number, 
  score: number, 
  businessType?: string, 
  operatingTime?: string,
  description?: string
): string[] {
  const recs = recommendations[areaId];
  let baseRecs = recs.advanced;
  if (score < 40) baseRecs = recs.critical;
  else if (score < 70) baseRecs = recs.medium;

  return baseRecs.map(rec => {
    let customRec = rec;

    // Adaptar según sector
    if (businessType === 'productos') {
      customRec = customRec
        .replace(/cliente ideal/g, 'comprador ideal de tus productos')
        .replace(/canal de ventas/g, 'tienda online o catálogo físico')
        .replace(/prospectos a clientes/g, 'visitas a compras en tu tienda')
        .replace(/tus procesos principales/g, 'tu gestión de catálogo y envíos');
    } else if (businessType === 'servicios') {
      customRec = customRec
        .replace(/cliente ideal/g, 'cliente ideal de tus servicios')
        .replace(/canal de ventas/g, 'embudo de asesorías o llamadas de venta')
        .replace(/prospectos a clientes/g, 'agendamientos a clientes pagados')
        .replace(/tus procesos principales/g, 'tu entrega de servicio y onboarding');
    } else if (businessType === 'local') {
      customRec = customRec
        .replace(/cliente ideal/g, 'vecino/cliente ideal en tu zona')
        .replace(/canal de ventas/g, 'ficha de Google Maps y WhatsApp local')
        .replace(/prospectos a clientes/g, 'contactos a visitas físicas en local')
        .replace(/tus procesos principales/g, 'tu atención en tienda y visual merchandising');
    } else if (businessType === 'digital') {
      customRec = customRec
        .replace(/cliente ideal/g, 'buyer persona digital')
        .replace(/canal de ventas/g, 'embudo automatizado o landing page')
        .replace(/prospectos a clientes/g, 'registros a conversiones online')
        .replace(/tus procesos principales/g, 'tus automatizaciones e integraciones de software');
    }

    // Adaptar según palabras clave de la descripción libre
    if (description) {
      const descLower = description.toLowerCase();
      if (descLower.includes('zapatilla') || descLower.includes('calzado') || descLower.includes('zapato') || descLower.includes('gloria store')) {
        customRec = customRec
          .replace(/cliente ideal/g, 'comprador de calzado')
          .replace(/comprador ideal de tus productos/g, 'comprador de calzado')
          .replace(/el cliente/g, 'el comprador de calzado')
          .replace(/los clientes/g, 'los compradores de calzado')
          .replace(/un cliente/g, 'un comprador de calzado')
          .replace(/tus productos/g, 'tus zapatillas y calzado')
          .replace(/productos/g, 'zapatillas y calzado');
      } else if (descLower.includes('ropa') || descLower.includes('prenda') || descLower.includes('vestir') || descLower.includes('moda') || descLower.includes('boutique') || descLower.includes('tienda de ropa')) {
        customRec = customRec
          .replace(/cliente ideal/g, 'comprador de moda')
          .replace(/comprador ideal de tus productos/g, 'comprador de moda')
          .replace(/el cliente/g, 'el cliente de moda')
          .replace(/tus productos/g, 'tus colecciones de ropa')
          .replace(/productos/g, 'prendas de vestir');
      } else if (descLower.includes('auto') || descLower.includes('carro') || descLower.includes('vehículo') || descLower.includes('spa de autos') || descLower.includes('lavado') || descLower.includes('lavadero') || descLower.includes('carol g spa')) {
        customRec = customRec
          .replace(/cliente ideal/g, 'dueño de vehículo')
          .replace(/comprador ideal de tus productos/g, 'dueño de vehículo')
          .replace(/el cliente/g, 'el dueño de vehículo')
          .replace(/tus productos/g, 'tus servicios de spa automotriz')
          .replace(/productos/g, 'servicios de lavado');
      } else if (descLower.includes('tecnología') || descLower.includes('laptop') || descLower.includes('celular') || descLower.includes('tablet') || descLower.includes('computadora')) {
        customRec = customRec
          .replace(/cliente ideal/g, 'comprador de tecnología')
          .replace(/comprador ideal de tus productos/g, 'comprador de tecnología')
          .replace(/el cliente/g, 'el usuario de tecnología')
          .replace(/tus productos/g, 'tus dispositivos tecnológicos')
          .replace(/productos/g, 'productos tecnológicos');
      }
    }

    // Adaptar según tiempo de operación (madurez)
    if (operatingTime === 'iniciando') {
      if (rec.includes('Define 3 objetivos') || rec.includes('Define 3 objetivos concretos')) {
        customRec = 'Define 1 único objetivo comercial enfocado en validar tu oferta y conseguir tus primeros clientes.';
      }
      if (rec.includes('Reserva al menos el 5%')) {
        customRec = 'Invierte lo mínimo viable para validar, priorizando el esfuerzo orgánico y el boca a boca.';
      }
    } else if (operatingTime === 'trayectoria' && score < 50) {
      if (rec.includes('Identifica 3 competidores')) {
        customRec = 'Identifica 3 competidores más jóvenes que estén usando canales digitales e imita sus mejores prácticas.';
      }
      if (rec.includes('Enfócate en UN solo canal')) {
        customRec = 'Aprovecha tu base de clientes tradicionales y digitaliza tu primer canal de comunicación oficial (WhatsApp o Instagram).';
      }
    }

    return customRec;
  });
}
