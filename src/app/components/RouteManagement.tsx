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
    color: '#3b82f6',
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
        color: '#3b82f6',
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Route Management</CardTitle>
              <CardDescription>Create and manage shuttle routes</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Route
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {routes.map((route) => (
                <Card key={route.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{route.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {route.frequency}
                            </span>
                            <Badge variant="secondary">{route.operatingHours}</Badge>
                            <span>{route.estimatedDuration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(route)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteRoute(route.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Stops ({route.stops.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {route.stops.map((stop, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <MapPin size={12} />
                            {stop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRoute ? 'Edit Route' : 'Create New Route'}</DialogTitle>
            <DialogDescription>
              {editingRoute
                ? 'Update route information and stops'
                : 'Add a new shuttle route to the system'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Route Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., North Campus Loop"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Route Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input value={formData.color} readOnly className="flex-1" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stops">Stops (comma-separated)</Label>
              <Input
                id="stops"
                value={formData.stops}
                onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                placeholder="Main Library, Science Building, Student Union"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  placeholder="Every 15 min"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Operating Hours</Label>
                <Input
                  id="hours"
                  value={formData.operatingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, operatingHours: e.target.value })
                  }
                  placeholder="7 AM - 10 PM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedDuration: e.target.value })
                  }
                  placeholder="25 min"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.stops}>
              {editingRoute ? 'Update Route' : 'Create Route'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
