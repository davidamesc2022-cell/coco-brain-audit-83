import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Users, Lock, Trash2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  description?: string;
  business_type?: string;
  client_type?: string;
  acquisition_channel?: string;
  file_url?: string;
  operating_time?: string;
  ai_usage?: string;
  country?: string;
  audits?: {
    total_score: number;
    area_scores: Record<string, number>;
  }[];
}

const getLeadDiagnostics = (lead: Lead) => {
  const audit = lead.audits?.[0];
  if (!audit || !audit.area_scores) {
    return { bottleneck: '-', route: '-' };
  }

  const scoresArray = Object.entries(audit.area_scores).map(([areaId, score]) => ({
    areaId: parseInt(areaId),
    score,
  }));

  if (scoresArray.length === 0) {
    return { bottleneck: '-', route: '-' };
  }

  let filteredScores = scoresArray;
  if (audit.total_score < 40) {
    filteredScores = scoresArray.filter(item => item.areaId !== 6);
  }
  if (filteredScores.length === 0) {
    filteredScores = scoresArray;
  }

  // Ordenamos de menor a mayor
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
  const bottleneck = areaNames[bottleneckAreaId] || 'Estrategia';

  let route = "";
  if (bottleneckAreaId === 2 || bottleneckAreaId === 3 || bottleneckAreaId === 4) {
    route = "Método 4C";
  } else if (bottleneckAreaId === 1 || bottleneckAreaId === 5) {
    route = "Marketing Base con SOSTAC";
  } else {
    route = "Implementación Coco Brain";
  }

  return { bottleneck, route };
};

const businessTypeLabels: Record<string, string> = {
  productos: '📦 Prod. Físicos',
  servicios: '💼 Servicios',
  local: '📍 Negocio Local',
  digital: '🖥️ Digital / Tech',
};

const clientTypeLabels: Record<string, string> = {
  B2C: '👥 B2C',
  B2B: '🏢 B2B',
  ambos: '🤝 Ambos',
};

const acquisitionChannelLabels: Record<string, string> = {
  redes: '📱 Redes Soc.',
  web: '🌐 Web/SEO',
  local: '📍 Físico',
  venta_directa: '📞 Directa/Recom.',
};

const operatingTimeLabels: Record<string, string> = {
  iniciando: '🚀 < 6 meses',
  crecimiento: '🌱 6m - 2a',
  consolidacion: '🎯 2a - 5a',
  trayectoria: '👑 > 5a',
};

const aiUsageLabels: Record<string, string> = {
  no_uso: '❌ No usa',
  basico: '✍️ Básico',
  automatizado: '⚙️ Automatizado',
  interesa: '💡 Interesado',
};

export default function Admin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          audits ( total_score, area_scores )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data as Lead[]);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el lead de "${name}" y todo su historial de auditoría?`)) {
      return;
    }

    try {
      const { data, error } = await supabase.rpc('delete_lead_secure', {
        lead_id: id,
        admin_password: 'coco2026',
      });

      if (error) throw error;

      toast.success(`Lead de "${name}" eliminado correctamente`);
      setLeads(prevLeads => prevLeads.filter(l => l.id !== id));
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error('No se pudo eliminar el lead. Asegúrate de ejecutar el script SQL de inicialización en Supabase.');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeadIds(leads.map(lead => lead.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeadIds(prev => [...prev, leadId]);
    } else {
      setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLeadIds.length === 0) return;
    
    const confirmMsg = `¿Estás seguro de que deseas eliminar permanentemente los ${selectedLeadIds.length} leads seleccionados y todo su historial de auditoría?`;
    if (!confirm(confirmMsg)) return;

    try {
      const { data, error } = await supabase.rpc('delete_leads_bulk_secure', {
        lead_ids: selectedLeadIds,
        admin_password: 'coco2026',
      });

      if (error) throw error;

      toast.success(`${selectedLeadIds.length} leads eliminados correctamente`);
      setLeads(prevLeads => prevLeads.filter(l => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
    } catch (error: any) {
      console.error('Error deleting bulk leads:', error);
      toast.error('No se pudieron eliminar los leads. Asegúrate de ejecutar la nueva función delete_leads_bulk_secure en Supabase.');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Fecha', 'Nombre', 'Email', 'Teléfono', 'Empresa', 'Descripción', 
      'País', 'Sector', 'Tipo Cliente', 'Canal Captación', 'Dossier/Brief', 
      'Madurez', 'Uso IA', 'Puntaje', 'Cuello de Botella', 'Ruta Recomendada'
    ];
    const csvData = leads.map(lead => {
      const diagnostics = getLeadDiagnostics(lead);
      return [
        format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm'),
        lead.full_name,
        lead.email,
        lead.phone,
        lead.company_name,
        lead.description || 'N/A',
        lead.country || 'N/A',
        businessTypeLabels[lead.business_type || ''] || lead.business_type || 'N/A',
        clientTypeLabels[lead.client_type || ''] || lead.client_type || 'N/A',
        acquisitionChannelLabels[lead.acquisition_channel || ''] || lead.acquisition_channel || 'N/A',
        lead.file_url || 'N/A',
        operatingTimeLabels[lead.operating_time || ''] || lead.operating_time || 'N/A',
        aiUsageLabels[lead.ai_usage || ''] || lead.ai_usage || 'N/A',
        lead.audits?.[0]?.total_score || 'N/A',
        diagnostics.bottleneck,
        diagnostics.route
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `leads_auditoria_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'coco2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Lock className="text-primary w-6 h-6" />
            </div>
            <CardTitle>Acceso Restringido</CardTitle>
            <p className="text-sm text-muted-foreground">Ingresa la contraseña para ver los prospectos.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona los prospectos generados por la auditoría y sus perfiles de negocio.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {leads.length > 0 && (
              <Button 
                onClick={() => handleSelectAll(selectedLeadIds.length !== leads.length)} 
                variant="outline" 
                className="gap-2 shrink-0 text-xs"
              >
                {selectedLeadIds.length === leads.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </Button>
            )}
            {selectedLeadIds.length > 0 && (
              <Button onClick={handleDeleteSelected} variant="destructive" className="gap-2 shrink-0 text-xs">
                <Trash2 size={16} /> Eliminar seleccionados ({selectedLeadIds.length})
              </Button>
            )}
            <Button onClick={exportToCSV} variant="outline" className="gap-2 shrink-0 text-xs">
              <Download size={16} /> Exportar CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prospectos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Leads Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aún no hay leads registrados.
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="min-w-[120px]">Fecha</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Tipo Cliente</TableHead>
                      <TableHead>Captación</TableHead>
                      <TableHead>Briefing</TableHead>
                      <TableHead>Madurez</TableHead>
                      <TableHead>Uso IA</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead className="min-w-[150px]">Cuello de Botella</TableHead>
                      <TableHead className="min-w-[150px]">Ruta Recomendada</TableHead>
                      <TableHead className="text-right">Puntaje</TableHead>
                      <TableHead className="text-right w-[60px]">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => {
                      const diagnostics = getLeadDiagnostics(lead);
                      return (
                        <TableRow key={lead.id}>
                          <TableCell className="text-center">
                            <Checkbox 
                              checked={selectedLeadIds.includes(lead.id)}
                              onCheckedChange={(checked) => handleSelectOne(lead.id, !!checked)}
                              aria-label={`Seleccionar lead de ${lead.full_name}`}
                            />
                          </TableCell>
                          <TableCell className="text-xs">{format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                          <TableCell className="font-medium text-xs md:text-sm">{lead.full_name}</TableCell>
                          <TableCell className="font-semibold text-xs md:text-sm">{lead.company_name}</TableCell>
                          <TableCell className="text-xs max-w-[180px] truncate" title={lead.description}>{lead.description || '-'}</TableCell>
                          <TableCell className="text-xs">{lead.country || '-'}</TableCell>
                          <TableCell className="text-xs">{businessTypeLabels[lead.business_type || ''] || lead.business_type || '-'}</TableCell>
                          <TableCell className="text-xs">{clientTypeLabels[lead.client_type || ''] || lead.client_type || '-'}</TableCell>
                          <TableCell className="text-xs">{acquisitionChannelLabels[lead.acquisition_channel || ''] || lead.acquisition_channel || '-'}</TableCell>
                          <TableCell className="text-xs">
                            {lead.file_url ? (
                              <a 
                                href={lead.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                              >
                                <Paperclip size={12} /> Ver Doc
                              </a>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-xs">{operatingTimeLabels[lead.operating_time || ''] || lead.operating_time || '-'}</TableCell>
                          <TableCell className="text-xs">{aiUsageLabels[lead.ai_usage || ''] || lead.ai_usage || '-'}</TableCell>
                          <TableCell className="text-xs">{lead.email}</TableCell>
                          <TableCell className="text-xs">{lead.phone}</TableCell>
                          <TableCell className="text-xs">
                            {diagnostics.bottleneck !== '-' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                                {diagnostics.bottleneck}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-xs">
                            {diagnostics.route !== '-' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                {diagnostics.route}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-right font-bold text-xs md:text-sm">
                            {lead.audits?.[0]?.total_score ? `${lead.audits[0].total_score}/100` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteLead(lead.id, lead.full_name)}
                              className="text-muted-foreground hover:text-destructive transition-colors h-7 w-7"
                              title="Eliminar lead"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
