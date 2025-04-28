"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth/auth-context';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Use Textarea
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Use Calendar component
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Venue } from '@/lib/types';

// --- Simulate API Call ---
async function getVenues(): Promise<Venue[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { venueId: 1, name: 'Anytown Convention Center', city: 'Anytown', state: 'CA' },
    { venueId: 2, name: 'Central Park', city: 'Metropolis', state: 'NY' },
    { venueId: 3, name: 'Old Town Square', city: 'Villagetown', state: 'TX' },
    { venueId: 4, name: 'Community Art Center', city: 'Villagetown', state: 'TX' },
     // Add more venues
  ];
}
// --- End Simulate API Call ---


const eventSchema = z.object({
  name: z.string().min(3, { message: 'Event name must be at least 3 characters.' }),
  description: z.string().optional(),
  date: z.date({ required_error: "Event date is required." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:MM)." }),
  locationId: z.string({ required_error: "Please select a venue." }), // Use string because Select value is string
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const { user, isAuthenticated, userRole } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

   useEffect(() => {
    // Redirect if not authenticated or not an organizer
    if (!isAuthenticated || userRole !== 'organizer') {
      router.push('/login');
    } else {
         // Fetch venues
        const fetchVenues = async () => {
            setLoadingVenues(true);
            const fetchedVenues = await getVenues();
            setVenues(fetchedVenues);
            setLoadingVenues(false);
        };
        fetchVenues();
    }
  }, [isAuthenticated, userRole, router]);


  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      date: undefined,
      time: '',
      locationId: undefined,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    console.log('Event data:', data);

    // --- Simulate API Call to Create Event ---
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    try {
        // Simulate successful event creation
        const newEventId = Math.floor(Math.random() * 10000) + 10; // Fake new event ID
        console.log(`Simulated creating event with ID: ${newEventId}`);

         toast({
            title: "Event Created Successfully!",
            description: `${data.name} has been added to the listings.`,
         });

        // Redirect to the organizer's dashboard or the new event page
        router.push('/dashboard'); // Or `/events/${newEventId}`
    } catch (error) {
       toast({
         title: "Event Creation Failed",
         description: error instanceof Error ? error.message : "Could not create the event. Please try again.",
         variant: "destructive",
       });
    } finally {
       setIsLoading(false);
    }
    // --- End Simulate API Call ---
  };

  // Render loading state for venues or if user check is pending
  if (loadingVenues || !isAuthenticated || userRole !== 'organizer') {
     return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </main>
            <Footer />
        </div>
     );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
                <CardDescription>Fill in the details for your new event.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Annual Tech Summit" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                             <Textarea
                                placeholder="Tell attendees about your event..."
                                className="resize-y min-h-[100px]"
                                {...field}
                                disabled={isLoading}
                              />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Event Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                         disabled={isLoading}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date() || isLoading} // Disable past dates
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                        <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Start Time (HH:MM)</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     </div>


                     <FormField
                      control={form.control}
                      name="locationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || loadingVenues}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={loadingVenues ? "Loading venues..." : "Select a venue"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {venues.map((venue) => (
                                <SelectItem key={venue.venueId} value={venue.venueId.toString()}>
                                  {venue.name} ({venue.city}, {venue.state})
                                </SelectItem>
                              ))}
                              {/* Option to add a new venue can go here */}
                               <SelectItem value="add_new_venue" disabled>+ Add New Venue (Feature)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <Button type="submit" className="w-full" disabled={isLoading || loadingVenues}>
                      {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Event...
                        </>
                      ) : (
                        'Create Event'
                      )}
                    </Button>
                  </form>
                </Form>
            </CardContent>
         </Card>
      </main>
      <Footer />
    </div>
  );
}
