import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface Incident {
  id: string;
  type: string;
  routeId: string;
  routeName: string;
  description: string;
  reportedBy: string;
  timestamp: Date;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

interface IncidentReportProps {
  routes: Array<{ id: string; name: string }>;
  onSubmitIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'status'>) => void;
  incidents: Incident[];
  onUpdateStatus: (id: string, status: 'open' | 'in-progress' | 'resolved') => void;
  userRole: 'student' | 'admin' | 'driver' | 'coordinator';
}

export function IncidentReport({
  routes,
  onSubmitIncident,
  incidents,
  onUpdateStatus,
  userRole,
}: IncidentReportProps) {
  const [incidentType, setIncidentType] = useState('');
  const [routeId, setRouteId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const route = routes.find((r) => r.id === routeId);
    if (!route) return;

    onSubmitIncident({
      type: incidentType,
      routeId,
      routeName: route.name,
      description,
      reportedBy: 'Current User',
      priority,
    });

    // Reset form
    setIncidentType('');
    setRouteId('');
    setDescription('');
    setPriority('medium');
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'in-progress':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500 shadow-rose-200';
      case 'medium':
        return 'bg-amber-500 shadow-amber-200';
      case 'low':
        return 'bg-blue-500 shadow-blue-200';
      default:
        return 'bg-slate-500 shadow-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={20} className="text-rose-600" />;
      case 'in-progress':
        return <Clock size={20} className="text-amber-600" />;
      case 'resolved':
        return <CheckCircle2 size={20} className="text-emerald-600" />;
      default:
        return <AlertCircle size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Report Form */}
      <Card className="lg:col-span-5 border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="text-rose-500" />
            Report an Incident
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">Submit delays, accidents, or other operational issues</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="incident-type" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Incident Type</Label>
              <Select value={incidentType} onValueChange={setIncidentType}>
                <SelectTrigger id="incident-type" className="h-12 border-slate-200 bg-slate-50/50 focus:ring-emerald-500 rounded-xl transition-all">
                  <SelectValue placeholder="What happened?" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="delay" className="rounded-lg mx-1 my-0.5">Delay</SelectItem>
                  <SelectItem value="accident" className="rounded-lg mx-1 my-0.5">Accident</SelectItem>
                  <SelectItem value="breakdown" className="rounded-lg mx-1 my-0.5">Breakdown</SelectItem>
                  <SelectItem value="overcrowding" className="rounded-lg mx-1 my-0.5">Overcrowding</SelectItem>
                  <SelectItem value="route-deviation" className="rounded-lg mx-1 my-0.5">Route Deviation</SelectItem>
                  <SelectItem value="other" className="rounded-lg mx-1 my-0.5">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="route" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Affected Route</Label>
              <Select value={routeId} onValueChange={setRouteId}>
                <SelectTrigger id="route" className="h-12 border-slate-200 bg-slate-50/50 focus:ring-emerald-500 rounded-xl transition-all">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id} className="rounded-lg mx-1 my-0.5">
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Priority Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-bold uppercase tracking-tighter transition-all ${
                      priority === p 
                        ? p === 'high' ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm' :
                          p === 'medium' ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-sm' :
                          'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide as much detail as possible..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="resize-none border-slate-200 bg-slate-50/50 focus:ring-emerald-500 rounded-2xl p-4 transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale" 
              disabled={!incidentType || !routeId}
            >
              Submit Incident Report
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Recent Incidents</h3>
            <p className="text-slate-500 font-medium">Monitoring and tracking reported issues</p>
          </div>
          <Badge className="bg-slate-100 text-slate-600 border-slate-200 shadow-none">
            {incidents.length} reported
          </Badge>
        </div>

        <ScrollArea className="h-[700px] pr-4 -mr-4">
          <div className="space-y-4 pb-8">
            {incidents.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-emerald-300" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">All clear!</h4>
                  <p className="text-slate-500 max-w-[240px] mt-2">No incidents have been reported recently.</p>
                </CardContent>
              </Card>
            ) : (
              incidents.map((incident) => (
                <Card key={incident.id} className="group border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-4">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${getStatusStyles(incident.status)} border bg-opacity-50`}>
                            {getStatusIcon(incident.status)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 capitalize leading-none">{incident.type}</h4>
                            <p className="text-sm text-slate-500 mt-1 font-medium">{incident.routeName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`${getPriorityStyles(incident.priority)} text-white border-0 text-[10px] font-bold uppercase tracking-wider px-2`}>
                            {incident.priority} priority
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-tighter ${getStatusStyles(incident.status)} border`}>
                            {incident.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {incident.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">
                            {incident.reportedBy.charAt(0)}
                          </div>
                          <span>{incident.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>{new Date(incident.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {userRole === 'admin' && incident.status !== 'resolved' && (
                        <div className="flex gap-3 pt-2">
                          {incident.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-10 rounded-xl border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 font-bold transition-all"
                              onClick={() => onUpdateStatus(incident.id, 'in-progress')}
                            >
                              Process Incident
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-100 transition-all"
                            onClick={() => onUpdateStatus(incident.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
