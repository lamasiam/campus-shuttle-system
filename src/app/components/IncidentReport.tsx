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
  userRole: 'student' | 'admin';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-yellow-500" />;
      case 'resolved':
        return <CheckCircle2 size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Report Form */}
      <Card>
        <CardHeader>
          <CardTitle>Report an Incident</CardTitle>
          <CardDescription>Submit delays, accidents, or other issues</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="incident-type">Incident Type</Label>
              <Select value={incidentType} onValueChange={setIncidentType}>
                <SelectTrigger id="incident-type">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delay">Delay</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                  <SelectItem value="overcrowding">Overcrowding</SelectItem>
                  <SelectItem value="route-deviation">Route Deviation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select value={routeId} onValueChange={setRouteId}>
                <SelectTrigger id="route">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as 'low' | 'medium' | 'high')}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the incident in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={!incidentType || !routeId}>
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Track reported issues and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {incidents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No incidents reported</p>
              ) : (
                incidents.map((incident) => (
                  <Card key={incident.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(incident.status)}
                          <div>
                            <p className="font-medium capitalize">{incident.type}</p>
                            <p className="text-sm text-muted-foreground">{incident.routeName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(incident.priority)}`}
                          />
                          <Badge variant="secondary" className="text-xs">
                            {incident.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm">{incident.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{incident.reportedBy}</span>
                        <span>{new Date(incident.timestamp).toLocaleString()}</span>
                      </div>
                      {userRole === 'admin' && incident.status !== 'resolved' && (
                        <div className="flex gap-2 pt-2">
                          {incident.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUpdateStatus(incident.id, 'in-progress')}
                            >
                              Mark In Progress
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(incident.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
