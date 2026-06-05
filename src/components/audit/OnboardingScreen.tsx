import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Sparkles, Building, Globe, Clock, UserCheck } from 'lucide-react';

export interface OnboardingData {
  companyName: string;
  description: string;
  country: string;
  businessType: string;
  operatingTime: string;
  aiUsage: string;
}

interface OnboardingScreenProps {
  onSubmit: (data: OnboardingData) => void;
  onBack: () => void;
}

const countries = [
  'Perú', 'Colombia', 'México', 'España', 'Chile', 
  'Ecuador', 'Argentina', 'Estados Unidos', 'Bolivia', 
  'Venezuela', 'Costa Rica', 'Panamá', 'Otro'
];

const businessTypes = [
  { value: 'productos', label: '📦 Productos físicos (Ropa, calzado, comida, etc.)' },
  { value: 'servicios', label: '💼 Servicios profesionales / Consultoría / Educación' },
  { value: 'local', label: '📍 Negocio Local / Tienda física o de servicios zonales' },
  { value: 'digital', label: '🖥️ Tecnología / E-commerce / Infoproductos' },
];

const operatingTimes = [
  { value: 'iniciando', label: '🚀 Menos de 6 meses (Lanzamiento)' },
  { value: 'crecimiento', label: '🌱 Entre 6 meses y 2 años (Crecimiento)' },
  { value: 'consolidacion', label: '🎯 De 2 a 5 años (Consolidación)' },
  { value: 'trayectoria', label: '👑 Más de 5 años (Trayectoria)' },
];

const aiUsages = [
  { value: 'no_uso', label: '❌ No la utilizo aún' },
  { value: 'basico', label: '✍️ Uso básico (Ej: Solo ChatGPT para textos)' },
  { value: 'automatizado', label: '⚙️ Tengo procesos automatizados con IA' },
  { value: 'interesa', label: '💡 No sé cómo usarla pero me interesa aprender' },
];

export function OnboardingScreen({ onSubmit, onBack }: OnboardingScreenProps) {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('Perú');
  const [businessType, setBusinessType] = useState('');
  const [operatingTime, setOperatingTime] = useState('');
  const [aiUsage, setAiUsage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !description.trim() || !businessType || !operatingTime || !aiUsage) {
      setError('Por favor, completa todas las preguntas para personalizar tu diagnóstico.');
      return;
    }
    setError('');
    onSubmit({
      companyName: companyName.trim(),
      description: description.trim(),
      country,
      businessType,
      operatingTime,
      aiUsage,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card rounded-3xl shadow-xl border border-border p-6 md:p-8 animate-fade-slide-up">
        
        {/* Header con Presentación Humana */}
        <div className="flex flex-col items-center text-center mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3 flex items-center gap-1.5">
            <Sparkles size={12} /> Metodología Coco Brain
          </span>
          
          <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-2xl border border-border max-w-sm mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
              DA
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-foreground">David Ames</p>
              <p className="text-muted-foreground">Fundador de David Consultores</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            ¡Hola! Te saludo cordialmente.
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Antes de iniciar con tu diagnóstico, cuéntame brevemente sobre tu negocio. Así el algoritmo Coco Brain adaptará dinámicamente tu **Plan de Acción de 90 Días** en base a tu sector y madurez.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre de la Empresa */}
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-sm font-semibold flex items-center gap-2">
              <Building size={16} className="text-muted-foreground" />
              ¿Cuál es el nombre de tu marca o empresa?
            </Label>
            <Input 
              id="company" 
              placeholder="Ej: David Consultores" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="rounded-xl h-11"
            />
          </div>

          {/* Descripción del Negocio */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-muted-foreground" />
              ¿A qué se dedica tu negocio? (Describe qué vende o su actividad)
            </Label>
            <textarea
              id="description"
              placeholder="Ej: Vendemos calzado deportivo y zapatillas de marcas conocidas al por mayor y menor, o brindamos servicios estéticos de lavado de autos (Spa de autos)."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
            />
          </div>

          {/* País */}
          <div className="space-y-1.5">
            <Label htmlFor="country" className="text-sm font-semibold flex items-center gap-2">
              <Globe size={16} className="text-muted-foreground" />
              ¿En qué país está ubicado tu negocio?
            </Label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sector / Tipo */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Building size={16} className="text-muted-foreground" />
              ¿A qué sector pertenece tu negocio?
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {businessTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setBusinessType(type.value)}
                  className={`text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    businessType === type.value 
                      ? 'border-primary bg-primary/5 text-foreground font-medium' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tiempo de Operación */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              ¿Qué tiempo de operación tiene tu empresa?
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {operatingTimes.map(time => (
                <button
                  key={time.value}
                  type="button"
                  onClick={() => setOperatingTime(time.value)}
                  className={`text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    operatingTime === time.value 
                      ? 'border-primary bg-primary/5 text-foreground font-medium' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inteligencia Artificial */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <UserCheck size={16} className="text-muted-foreground" />
              ¿Qué tanto utilizas Inteligencia Artificial (IA) en tu negocio?
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {aiUsages.map(usage => (
                <button
                  key={usage.value}
                  type="button"
                  onClick={() => setAiUsage(usage.value)}
                  className={`text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    aiUsage === usage.value 
                      ? 'border-primary bg-primary/5 text-foreground font-medium' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {usage.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium text-center bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-pulse">
              ⚠️ {error}
            </p>
          )}

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 py-6 rounded-xl text-base"
            >
              Atrás
            </Button>
            <Button 
              type="submit" 
              className="flex-[2] py-6 rounded-xl text-base font-semibold"
            >
              Comenzar Diagnóstico <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            🔒 Respuestas 100% confidenciales. Se utilizarán únicamente para adaptar tu plan.
          </p>
        </form>
      </div>
    </div>
  );
}
