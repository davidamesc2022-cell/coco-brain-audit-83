import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, score, company, bottleneck, route } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('No RESEND_API_KEY provided')
    }

    // Determinamos el texto persuasivo de acuerdo al puntaje
    let scoreText = "";
    if (score < 40) {
      scoreText = `Esto indica que tu negocio se encuentra actualmente en un estado de caos operativo. Las acciones de marketing se ejecutan de forma reactiva y desorganizada, lo que consume gran parte de tu energía y presupuesto sin generar retornos estables.`;
    } else if (score < 60) {
      scoreText = `Esto indica que tu negocio cuenta con un gran potencial y un producto/servicio validado, pero carece de un sistema comercial ordenado. Los clientes llegan principalmente de forma espontánea o por esfuerzos aislados.`;
    } else if (score < 75) {
      scoreText = `Esto indica que tu negocio se encuentra en construcción estratégica. Cuentas con un marketing estructurado en ciertas áreas, pero varios procesos funcionan desconectados entre sí.`;
    } else if (score < 90) {
      scoreText = `¡Felicitaciones! Cuentas con un negocio con sistema en crecimiento. Tienes una base sólida, tracción en ventas y orden en tus operaciones. Tu oportunidad principal es optimizar la conversión y fidelización.`;
    } else {
      scoreText = `¡Extraordinario! Tu negocio está optimizado y es altamente escalable. Cuentas con procesos eficientes, medición constante y una marca diferenciada.`;
    }

    // Enlace directo de agendamiento por WhatsApp para el botón
    const whatsappMessageText = `Hola David, acabo de completar mi auditoría para ${company} y obtuve un puntaje de ${score}/100. Mi Ruta Recomendada es: ${route || 'Implementación Coco Brain'}. Quiero agendar una llamada de diagnóstico gratuita contigo.`;
    const whatsappUrl = `https://wa.me/51913321222?text=${encodeURIComponent(whatsappMessageText)}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 16px;">
        <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Estimado/a ${name},</h2>
        
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
          Un gusto saludarte. Acabas de completar el Diagnóstico de Marketing Digital basado en la metodología Coco Brain para tu marca, <strong>${company}</strong>.
        </p>
        
        <!-- SECCIÓN DE PUNTAJE -->
        <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb; text-align: center;">
          <h3 style="margin: 0; color: #374151; font-size: 16px; font-weight: 600;">Tu Puntaje Global:</h3>
          <div style="font-size: 48px; font-weight: bold; color: #ea580c; margin: 10px 0;">${score}/100</div>
          <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5; font-style: italic;">
            ${scoreText}
          </p>
        </div>
        
        <!-- SECCIÓN DE DIAGNÓSTICO ESTRATÉGICO -->
        <div style="margin: 24px 0; padding: 20px; border: 1px dashed #ea580c; border-radius: 12px; background-color: #fffaf7;">
          <h4 style="margin: 0 0 12px 0; color: #ea580c; font-size: 15px; font-weight: bold;">🔍 Diagnóstico Estratégico Especializado:</h4>
          
          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 13px; text-transform: uppercase; tracking-wider: 0.05em; display: block;">Cuello de Botella Principal:</strong>
            <span style="color: #4b5563; font-size: 14px; line-height: 1.5;">${bottleneck || 'Estrategia general'}</span>
          </div>
          
          <div>
            <strong style="color: #374151; font-size: 13px; text-transform: uppercase; tracking-wider: 0.05em; display: block;">Ruta Recomendada:</strong>
            <span style="color: #ea580c; font-size: 14px; font-weight: bold; line-height: 1.5;">${route || 'Implementación Coco Brain'}</span>
          </div>
        </div>
        
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
          Tu diagnóstico ya muestra dónde está la oportunidad. El siguiente paso es convertir esta información en acción. Te invito a agendar una llamada de diagnóstico gratuita conmigo para descubrir cómo implementar tu ruta recomendada y potenciar los resultados de tu negocio.
        </p>
        
        <!-- BOTÓN DE ACCIÓN -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${whatsappUrl}" style="background-color: #25D366; color: #ffffff; padding: 16px 32px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            💬 Agendar mi Diagnóstico por WhatsApp
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        
        <p style="color: #111827; font-size: 15px; margin-bottom: 5px;"><strong>David Ames</strong></p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 0;">Fundador de <a href="https://davidconsultores.com" style="color: #ea580c; text-decoration: none;">davidconsultores.com</a></p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Auditoría Coco Brain <hablemos@davidamesc.com>',
        to: [email],
        subject: `Resultados de tu Diagnóstico de Marketing - ${company}`,
        html: htmlContent,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
