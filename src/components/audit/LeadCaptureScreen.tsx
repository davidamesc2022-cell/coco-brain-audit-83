import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { OnboardingData } from '@/hooks/useAudit';

const formSchema = z.object({
  fullName: z.string().min(2, 'Por favor ingresa tu nombre completo'),
  email: z.string().email('Por favor ingresa un correo electrónico válido'),
  phone: z.string().min(6, 'Por favor ingresa un número de teléfono válido'),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadCaptureScreenProps {
  onSuccess: (leadId: string) => void;
  auditData: {
    totalScore: number;
    areaScores: Record<string, number>;
    answers: Record<string, any>;
  };
  onboardingData: OnboardingData | null;
}

export function LeadCaptureScreen({ onSuccess, auditData, onboardingData }: LeadCaptureScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  });
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Guardar el Lead en Supabase incluyendo los datos de Onboarding
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([
          {
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            company_name: onboardingData?.companyName || '',
            description: onboardingData?.description || '',
            business_type: onboardingData?.businessType || '',
            operating_time: onboardingData?.operatingTime || '',
            ai_usage: onboardingData?.aiUsage || '',
            country: onboardingData?.country || '',
            client_type: onboardingData?.clientType || '',
            acquisition_channel: onboardingData?.acquisitionChannel || '',
            file_url: onboardingData?.fileUrl || '',
          }
        ])
        .select()
        .single();

      if (leadError) throw leadError;

      // 2. Guardar los Resultados de la Auditoría asociados a este Lead
      const { error: auditError } = await supabase
        .from('audits')
        .insert([
          {
            lead_id: leadData.id,
            total_score: auditData.totalScore,
            area_scores: auditData.areaScores,
            answers: auditData.answers,
          }
        ]);

      if (auditError) throw auditError;

      // 3. Calcular cuello de botella y ruta recomendada para el email
      const scoresArray = Object.entries(auditData.areaScores).map(([areaId, score]) => ({
        areaId: parseInt(areaId),
        score,
      }));

      let filteredScores = scoresArray;
      if (auditData.totalScore < 40) {
        filteredScores = scoresArray.filter(item => item.areaId !== 6);
      }
      if (filteredScores.length === 0) {
        filteredScores = scoresArray;
      }

      filteredScores.sort((a, b) => a.score - b.score);
      const bottleneckAreaId = filteredScores[0]?.areaId || 1;

      const areaNames: Record<number, string> = {
        1: 'Análisis Situacional',
        2: 'Objetivos y Metas',
        3: 'Estrategia de Marca',
        4: 'Tácticas y Contenido',
        5: 'Medición y Control',
        6: 'Post-Venta y Fidelización',
      };
      const bottleneckName = areaNames[bottleneckAreaId] || 'Estrategia';

      let recommendedRoute = "";
      if (bottleneckAreaId === 2 || bottleneckAreaId === 3 || bottleneckAreaId === 4) {
        recommendedRoute = "Método 4C";
      } else if (bottleneckAreaId === 1 || bottleneckAreaId === 5) {
        recommendedRoute = "Marketing Base con SOSTAC";
      } else {
        recommendedRoute = "Implementación Coco Brain";
      }

      // 4. Enviar correo a través de Supabase Edge Function (Resend) - NO BLOQUEANTE
      supabase.functions.invoke('send-audit-email', {
        body: { 
          email: data.email, 
          name: data.fullName, 
          score: auditData.totalScore,
          company: onboardingData?.companyName || '',
          bottleneck: bottleneckName,
          route: recommendedRoute
        }
      }).then(({ data: fnRes, error: fnErr }) => {
        if (fnErr) {
          console.error('Error en Edge Function:', fnErr);
        } else if (fnRes && fnRes.statusCode && fnRes.statusCode >= 400) {
          console.error('Error de Resend al enviar correo:', fnRes);
        } else {
          console.log('Correo enviado exitosamente:', fnRes);
        }
      }).catch(err => {
        console.error('Excepción al invocar send-audit-email:', err);
      });

      // Todo salió bien en base de datos, avanzamos de inmediato a los resultados
      onSuccess(leadData.id);
      toast.success('¡Análisis completado exitosamente!');
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Hubo un error al guardar tus datos. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 animate-fade-slide-up">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            ¡Tu Auditoría está Lista!
          </h2>
          <p className="text-muted-foreground text-sm">
            Ingresa tus datos para ver tus resultados detallados y recibir tu plan de acción de 90 días personalizado.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Carlos Mendoza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico (Donde enviaremos el reporte)</FormLabel>
                  <FormControl>
                    <Input placeholder="carlos@empresa.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono / WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="+51 987 654 321" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando Reporte...
                  </>
                ) : (
                  <>
                    Ver mis Resultados <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                🔒 Tus datos están seguros y no serán compartidos.
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
