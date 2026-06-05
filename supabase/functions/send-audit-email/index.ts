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
    const { email, name, score, company } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('No RESEND_API_KEY provided')
    }

    // Determinamos el texto persuasivo de acuerdo al puntaje
    let scoreText = "";
    if (score < 50) {
      scoreText = `Esto indica que tu estrategia actual de marketing digital tiene debilidades críticas que muy probablemente te están costando clientes y presupuesto todos los días. Necesitas tomar medidas correctivas urgentes para detener la pérdida de oportunidades.`;
    } else if (score < 75) {
      scoreText = `Esto indica que tienes una base sobre la cual construir, pero existen puntos ciegos importantes en tu marketing que están frenando el crecimiento de tu marca e impidiendo que consigas mejores resultados de ventas.`;
    } else {
      scoreText = `¡Felicitaciones! Tienes un marketing estructurado y saludable, aunque siempre hay oportunidades avanzadas para optimizar y escalar tus conversiones al siguiente nivel.`;
    }

    // Preparamos el enlace de mailto para el botón de respuesta fácil
    const mailtoSubject = encodeURIComponent(`Quiero mi Plan de Acción de 90 días - ${company}`);
    const mailtoBody = encodeURIComponent(`Hola David,\n\nobtuve un puntaje de ${score}/100 en la auditoría de ${company} y me interesa recibir el plan de acción de 90 días en PDF para analizarlo.\n\nSaludos.`);
    const mailtoUrl = `mailto:hablemos@davidamesc.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 16px;">
        <h2 style="color: #111827; margin-top: 0;">Estimado/a ${name},</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Un gusto saludarte. Acabas de completar el Diagnóstico de Marketing Digital basado en la metodología Coco Brain para tu marca, <strong>${company}</strong>.
        </p>
        
        <div style="background-color: #f3f4f6; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb; text-align: center;">
          <h3 style="margin: 0; color: #111827; font-size: 18px;">Tu Puntaje Global:</h3>
          <div style="font-size: 48px; font-weight: bold; color: #ea580c; margin: 10px 0;">${score}/100</div>
          <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.5; font-style: italic;">
            ${scoreText}
          </p>
        </div>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Como habrás notado, existen áreas de oportunidad que podemos potenciar. Para ayudarte a resolverlas, he preparado un <strong>Plan de Acción de 90 días</strong> exclusivo para tu negocio.
        </p>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Si deseas que te envíe este plan en formato PDF de manera gratuita, haz clic en el siguiente botón para solicitármelo por correo:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${mailtoUrl}" style="background-color: #ea580c; color: #ffffff; padding: 16px 32px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
            Solicitar mi Plan de Acción de 90 Días
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        
        <p style="color: #111827; font-size: 16px; margin-bottom: 5px;"><strong>David Ames</strong></p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Fundador de <a href="https://davidconsultores.com" style="color: #ea580c; text-decoration: none;">davidconsultores.com</a></p>
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
