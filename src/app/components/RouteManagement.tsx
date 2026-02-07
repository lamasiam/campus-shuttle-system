import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

interface Route {
  id: string;
  name: string;
  color: string;
  stops: string[];
  frequency: string;
  operatingHours: string;
  estimatedDuration: string;
}

interface RouteManagementProps {
  routes: Route[];
  onCreateRoute: (route: Omit<Route, 'id'>) => void;
  onEditRoute: (id: string, route: Partial<Route>) => void;
  onDeleteRoute: (id: string) => void;
}

export function RouteManagement({
  routes,
  onCreateRoute,
  onEditRoute,
  onDeleteRoute,
}: RouteManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#6366f1',
    stops: '',
    frequency: '',
    operatingHours: '',
    estimatedDuration: '',
  });

  const handleOpenDialog = (route?: Route) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        name: route.name,
        color: route.color,
        stops: route.stops.join(', '),
        frequency: route.frequency,
        operatingHours: route.operatingHours,
        estimatedDuration: route.estimatedDuration,
      });
    } else {
      setEditingRoute(null);
      setFormData({
        name: '',
        color: '#6366f1',
        stops: '',
        frequency: '',
        operatingHours: '',
        estimatedDuration: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const routeData = {
      name: formData.name,
      color: formData.color,
      stops: formData.stops.split(',').map((s) => s.trim()).filter(Boolean),
      frequency: formData.frequency,
      operatingHours: formData.operatingHours,
      estimatedDuration: formData.estimatedDuration,
    };

    if (editingRoute) {
      onEditRoute(editingRoute.id, routeData);
    } else {
      onCreateRoute(routeData);
    }

    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="overflow-hidden border-0 shadow-xl shadow-indigo-100/50 bg-white/70 backdrop-blur-md">
        <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600" />
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-800">Route Management</CardTitle>
              <CardDescription className="text-indigo-400 font-medium">Create and manage campus shuttle routes</CardDescription>
            </div>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-200 transition-all active:scale-[0.98] rounded-xl px-6"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Route
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[650px] pr-4 -mr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              {routes.map((route) => (
                <Card key={route.id} className="group relative overflow-hidden border border-indigo-50 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                  <div 
                    className="absolute top-0 left-0 w-1.5 h-full transition-all duration-300 group-hover:w-2"
                    style={{ backgroundColor: route.color }}
                  />
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {route.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                              <Clock size={12} className="mr-1" />
                              {route.frequency}
                            </Badge>
                            <Badge variant="outline" className="border-indigo-100 text-indigo-600 font-bold text-[10px] uppercase tracking-wider">
                              {route.operatingHours}
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {route.estimatedDuration}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(route)}
                            className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteRoute(route.id)}
                            className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                          <MapPin size={12} className="text-indigo-400" />
                          Stops ({route.stops.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {route.stops.map((stop, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 border-none text-[11px] font-medium rounded-lg px-2 py-0.5 transition-colors"
                            >
                              {stop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl border-0 shadow-2xl overflow-hidden p-0">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Plus size={120} className="rotate-12" />
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight">
              {editingRoute ? 'Edit Route' : 'Create New Route'}
            </DialogTitle>
            <DialogDescription className="text-purple-100 text-lg mt-2 font-medium">
              {editingRoute
                ? 'Update route information and stops'
                : 'Add a new shuttle route to the system'}
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Route Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., North Campus Loop"
                  className="rounded-xl border-slate-200 focus:border-purple-400 focus:ring-purple-400 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Route Color</Label>
                <div className="flex gap-3">
                  <div className="relative group">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-12 p-1 rounded-xl border-slate-200 cursor-pointer overflow-hidden"
                    />
                  </div>
                  <Input 
                    value={formData.color} 
                    readOnly 
                    className="flex-1 rounded-xl border-slate-200 bg-slate-50 h-12 font-mono text-slate-500" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stops" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Stops (comma-separated)</Label>
              <Input
                id="stops"
                value={formData.stops}
                onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                placeholder="Main Library, Science Building, Student Union"
                className="rounded-xl border-slate-200 focus:border-purple-400 focus:ring-purple-400 h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Frequency</Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  placeholder="Every 15 min"
                  className="rounded-xl border-slate-200 focus:border-purple-400 focus:ring-purple-400 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Operating Hours</Label>
                <Input
                  id="hours"
                  value={formData.operatingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, operatingHours: e.target.value })
                  }
                  placeholder="7 AM - 10 PM"
                  className="rounded-xl border-slate-200 focus:border-purple-400 focus:ring-purple-400 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Duration</Label>
                <Input
                  id="duration"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedDuration: e.target.value })
                  }
                  placeholder="25 min"
                  className="rounded-xl border-slate-200 focus:border-purple-400 focus:ring-purple-400 h-12"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setDialogOpen(false)}
              className="rounded-xl h-12 px-6 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.name || !formData.stops}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-200 transition-all active:scale-[0.98] rounded-xl h-12 px-8"
            >
              {editingRoute ? 'Update Route' : 'Create Route'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
