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
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? 'cursor-pointer transition-all hover:scale-120' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          >
            <Star
              size={interactive ? 36 : 14}
              className={`${
                star <= (interactive ? hoveredRating || rating : count)
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                  : 'text-slate-200 fill-slate-50'
              } transition-all duration-200`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Feedback Form */}
      <Card className="lg:col-span-5 border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-slate-900">Share Your Thoughts</CardTitle>
          <CardDescription className="text-slate-500 font-medium">Your feedback helps us create a better commute for everyone.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Select Route</Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="h-12 border-slate-200 bg-slate-50/50 focus:ring-blue-500 rounded-xl transition-all">
                  <SelectValue placeholder="Which route did you take?" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id} className="focus:bg-blue-50 focus:text-blue-600 rounded-lg mx-1 my-0.5">
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 py-4 px-6 bg-slate-50/80 rounded-2xl border border-slate-100">
              <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider block text-center">How was your journey?</Label>
              <div className="flex flex-col items-center gap-4">
                {renderStars(rating, true)}
                <div className="h-6">
                  {rating > 0 && (
                    <Badge className="bg-white text-blue-600 border-blue-100 shadow-sm px-4 py-1 text-xs font-bold uppercase tracking-tighter">
                      {rating === 1 && 'Needs Improvement'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good Experience'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Outstanding!'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 border-slate-200 bg-slate-50/50 focus:ring-blue-500 rounded-xl transition-all">
                  <SelectValue placeholder="What is this about?" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="cleanliness" className="rounded-lg mx-1 my-0.5">Cleanliness</SelectItem>
                  <SelectItem value="timeliness" className="rounded-lg mx-1 my-0.5">Timeliness</SelectItem>
                  <SelectItem value="driver-behavior" className="rounded-lg mx-1 my-0.5">Driver Behavior</SelectItem>
                  <SelectItem value="comfort" className="rounded-lg mx-1 my-0.5">Comfort</SelectItem>
                  <SelectItem value="safety" className="rounded-lg mx-1 my-0.5">Safety</SelectItem>
                  <SelectItem value="other" className="rounded-lg mx-1 my-0.5">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="comment" className="text-sm font-bold text-slate-700 uppercase tracking-wider">Additional Comments</Label>
              <Textarea
                id="comment"
                placeholder="Anything else you'd like to share?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none border-slate-200 bg-slate-50/50 focus:ring-blue-500 rounded-2xl p-4 transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale" 
              disabled={!selectedRoute || rating === 0}
            >
              <Send className="mr-2 h-5 w-5" />
              Send Feedback
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feedback History */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Recent Feedback</h3>
            <p className="text-slate-500 font-medium">History of your previous reviews</p>
          </div>
          <Badge className="bg-slate-100 text-slate-600 border-slate-200 shadow-none hover:bg-slate-100">
            {feedbackHistory.length} total
          </Badge>
        </div>

        <ScrollArea className="h-[700px] pr-4 -mr-4">
          <div className="space-y-4 pb-8">
            {feedbackHistory.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
                <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
                    <Star size={40} className="text-slate-200" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">No feedback yet</h4>
                  <p className="text-slate-500 max-w-[240px] mt-2">Share your first experience to help us improve!</p>
                </CardContent>
              </Card>
            ) : (
              feedbackHistory.map((feedback) => (
                <Card key={feedback.id} className="group border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-4">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900">{feedback.routeName}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                              {new Date(feedback.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <Badge variant="outline" className="text-[10px] font-bold uppercase border-blue-100 text-blue-600 bg-blue-50/50">
                              {feedback.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-amber-50 transition-colors">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      
                      {feedback.comment && (
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
                          <p className="pl-4 text-sm text-slate-600 leading-relaxed italic font-medium">
                            "{feedback.comment}"
                          </p>
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
