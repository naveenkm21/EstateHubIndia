import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CalendarIcon, Clock, User, Phone, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const visitSchema = z.object({
  visitorName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
  visitorPhone: z.string().trim()
    .regex(/^[6-9]\d{9}$/, { message: "Enter valid 10-digit Indian mobile number" }),
  message: z.string().trim().max(500, { message: "Message must be less than 500 characters" }).optional(),
});

interface BookVisitProps {
  propertyId: string;
  propertyTitle: string;
  agentName?: string;
}

const BookVisit = ({ propertyId, propertyTitle, agentName }: BookVisitProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a visit",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select date and time",
        variant: "destructive",
      });
      return;
    }

    const validationResult = visitSchema.safeParse({
      visitorName,
      visitorPhone,
      message,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save visit booking to database
      const { data, error } = await supabase
        .from('visits')
        .insert([{
          user_id: user.id,
          property_id: propertyId,
          visitor_name: visitorName.trim(),
          visitor_phone: visitorPhone.trim(),
          visit_date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          visit_time: selectedTime,
          message: message?.trim() || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error booking visit:', error);
        throw error;
      }

      const visitDateTime = `${format(selectedDate, 'PPP')} at ${selectedTime}`;
      
      toast({
        title: "Visit booked successfully!",
        description: `Your visit for ${propertyTitle} is scheduled for ${visitDateTime}. ${agentName ? `${agentName} will contact you soon.` : 'The agent will contact you soon.'}`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setVisitorName('');
      setVisitorPhone('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Book a Visit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-md border pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Select Time *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visitor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitor-name">Your Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="visitor-name"
                  placeholder="Enter your full name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitor-phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="visitor-phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="message"
                placeholder="Any specific questions or requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pl-10 resize-none"
                rows={3}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Booking Visit...' : 'Book Visit'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            * By booking a visit, you agree to be contacted by the property agent
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookVisit;