import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Star, Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface Feedback {
  id: string;
  routeName: string;
  rating: number;
  category: string;
  comment: string;
  date: Date;
}

interface FeedbackFormProps {
  routes: Array<{ id: string; name: string }>;
  onSubmit: (feedback: Omit<Feedback, 'id' | 'date'>) => void;
  feedbackHistory: Feedback[];
}

export function FeedbackForm({ routes, onSubmit, feedbackHistory }: FeedbackFormProps) {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const route = routes.find((r) => r.id === selectedRoute);
    if (!route || rating === 0) return;

    onSubmit({
      routeName: route.name,
      rating,
      category,
      comment,
    });

    // Reset form
    setSelectedRoute('');
    setRating(0);
    setCategory('');
    setComment('');
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 32 : 16}
            className={`${
              star <= (interactive ? hoveredRating || rating : count)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Your Experience</CardTitle>
          <CardDescription>Help us improve our shuttle service</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Select Route</Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose the route you traveled" />
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
              <Label>Overall Rating</Label>
              <div className="flex items-center gap-4">
                {renderStars(rating, true)}
                {rating > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Feedback Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleanliness">Cleanliness</SelectItem>
                  <SelectItem value="timeliness">Timeliness</SelectItem>
                  <SelectItem value="driver-behavior">Driver Behavior</SelectItem>
                  <SelectItem value="comfort">Comfort</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedRoute || rating === 0}>
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feedback History</CardTitle>
          <CardDescription>Previous ratings and comments</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {feedbackHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Star size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No feedback submitted yet</p>
                </div>
              ) : (
                feedbackHistory.map((feedback) => (
                  <Card key={feedback.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{feedback.routeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(feedback.date).toLocaleDateString()}
                          </p>
                        </div>
                        {renderStars(feedback.rating)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feedback.category}
                      </Badge>
                      {feedback.comment && (
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
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
