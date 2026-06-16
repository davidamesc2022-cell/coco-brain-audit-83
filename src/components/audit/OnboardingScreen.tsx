import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Sparkles, Building, Globe, Clock, UserCheck, UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface OnboardingData {
  companyName: string;
  description: string;
  country: string;
  businessType: string;
  operatingTime: string;
  aiUsage: string;
  clientType: string;
  acquisitionChannel: string;
  fileUrl?: string;
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

const clientTypes = [
  { value: 'B2C', label: '👥 Consumidores finales (B2C)' },
  { value: 'B2B', label: '🏢 Otras empresas / Negocios (B2B)' },
  { value: 'ambos', label: '🤝 Ambos por igual (B2C y B2B)' },
];

const acquisitionChannels = [
  { value: 'redes', label: '📱 Redes Sociales (Instagram, TikTok, WhatsApp)' },
  { value: 'web', label: '🌐 Página Web / Buscadores (Google, SEO, E-commerce)' },
  { value: 'local', label: '📍 Local físico / Tráfico a pie' },
  { value: 'venta_directa', label: '📞 Venta directa / Llamadas / Recomendaciones' },
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
  const [clientType, setClientType] = useState('');
  const [acquisitionChannel, setAcquisitionChannel] = useState('');
  const [operatingTime, setOperatingTime] = useState('');
  const [aiUsage, setAiUsage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !description.trim() || !businessType || !clientType || !acquisitionChannel || !operatingTime || !aiUsage) {
      setError('Por favor, completa todas las preguntas para personalizar tu diagnóstico.');
      return;
    }

    if (description.trim().length < 25) {
      setError('Por favor, escribe una descripción de tu negocio de al menos 25 caracteres para poder darte un diagnóstico preciso.');
      return;
    }

    setError('');
    setIsUploading(true);

    let fileUrl = '';
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('lead-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('lead-documents')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
      } catch (err: any) {
        console.error('Error al subir archivo:', err);
        setError('No se pudo cargar el archivo. Por favor, inténtalo de nuevo o continúa sin archivo.');
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);
    onSubmit({
      companyName: companyName.trim(),
      description: description.trim(),
      country,
      businessType,
      clientType,
      acquisitionChannel,
      operatingTime,
      aiUsage,
      fileUrl,
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
            Antes de iniciar con tu diagnóstico, cuéntame sobre tu negocio. Así el algoritmo Coco Brain adaptará dinámicamente tu **Plan de Acción de 90 Días** en base a tu sector y madurez.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
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
              disabled={isUploading}
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
              className="flex min-h-[90px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
              disabled={isUploading}
            />
            <div className="flex justify-between items-center text-xs mt-1 px-1">
              <span className="text-muted-foreground italic">
                Tip: ¿Qué vendes y a quién está dirigido?
              </span>
              <span className={description.trim().length >= 25 ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                {description.trim().length}/25 caracteres mín.
              </span>
            </div>
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
              disabled={isUploading}
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
                      ? 'border-primary bg-primary/5 text-foreground font-semibold' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                  disabled={isUploading}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Cliente (B2B/B2C) */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <UserCheck size={16} className="text-muted-foreground" />
              ¿Quién es tu cliente principal?
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {clientTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setClientType(type.value)}
                  className={`text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    clientType === type.value 
                      ? 'border-primary bg-primary/5 text-foreground font-semibold' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                  disabled={isUploading}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canal de Ventas/Captación */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Globe size={16} className="text-muted-foreground" />
              ¿Cuál es tu canal de ventas o captación principal?
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {acquisitionChannels.map(channel => (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() => setAcquisitionChannel(channel.value)}
                  className={`text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    acquisitionChannel === channel.value 
                      ? 'border-primary bg-primary/5 text-foreground font-semibold' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                  disabled={isUploading}
                >
                  {channel.label}
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
                      ? 'border-primary bg-primary/5 text-foreground font-semibold' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                  disabled={isUploading}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inteligencia Artificial */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-muted-foreground" />
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
                      ? 'border-primary bg-primary/5 text-foreground font-semibold' 
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                  disabled={isUploading}
                >
                  {usage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Carga de Archivo (Opcional) */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <UploadCloud size={16} className="text-muted-foreground" />
              ¿Tienes algún briefing o presentación de tu negocio? (Opcional)
            </Label>
            <div className="border border-dashed border-border rounded-2xl p-4 bg-muted/20 text-center relative hover:bg-muted/30 transition-colors">
              {!file ? (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-1">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-1" />
                  <span className="text-sm font-semibold text-foreground">Cargar briefing / presentación</span>
                  <span className="text-xs text-muted-foreground">PDF, Word o imagen (Máx. 10MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        if (selectedFile.size > 10 * 1024 * 1024) {
                          setError('El archivo supera el tamaño máximo de 10MB.');
                          return;
                        }
                        setFile(selectedFile);
                        setError('');
                      }
                    }}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between bg-background p-2.5 rounded-lg border border-border">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground truncate max-w-[200px]" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    disabled={isUploading}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
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
              disabled={isUploading}
            >
              Atrás
            </Button>
            <Button 
              type="submit" 
              className="flex-[2] py-6 rounded-xl text-base font-semibold"
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Subiendo archivos...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Comenzar Diagnóstico <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
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
