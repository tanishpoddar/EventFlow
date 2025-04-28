import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Clock, Users, Mic, Ticket as TicketIcon, Edit, Trash2 } from 'lucide-react';
import type { Event, Speaker, Venue, TicketType } from '@/lib/types';
// import { useAuth } from '@/components/auth/auth-context'; // Import useAuth if needed for role checks Client Side

// --- Simulate API Call ---
// Replace this with actual data fetching logic based on eventId
async function getEventDetails(eventId: number): Promise<Event | null> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

  // Find the event from a simulated list or fetch from API
   const allEvents: Event[] = [
    { eventId: 1, name: 'Tech Conference 2024', description: 'An annual conference bringing together the brightest minds in technology to discuss the future of innovation, AI, cloud computing, and software development. Includes keynote speeches, workshops, and networking opportunities.', date: '2024-10-25', time: '09:00', locationId: 1, venue: { venueId: 1, name: 'Anytown Convention Center', address: '123 Tech Ave', capacity: 5000, city: 'Anytown', state: 'CA', zipCode: '90210' }, speakers: [{ speakerId: 1, name: 'Dr. Evelyn Reed', bio: 'Leading AI Researcher', eventId: 1}, { speakerId: 2, name: 'John Smith', bio: 'Cloud Solutions Architect', eventId: 1}] },
    { eventId: 2, name: 'Music Fest Downtown', description: 'A vibrant outdoor music festival featuring a diverse lineup of local and national bands across multiple genres. Enjoy food trucks, art installations, and great music.', date: '2024-11-12', time: '18:00', locationId: 2, venue: { venueId: 2, name: 'Central Park', address: '456 Park St', capacity: 10000, city: 'Metropolis', state: 'NY', zipCode: '10001' }, speakers: [] }, // No speakers for this event
    { eventId: 3, name: 'Artisan Market Fair', description: 'Browse and purchase unique handmade crafts, jewelry, pottery, and art from talented local artisans. A perfect place to find unique gifts.', date: '2024-12-05', time: '10:00', locationId: 3, venue: { venueId: 3, name: 'Old Town Square', address: '789 Market Pl', capacity: 500, city: 'Villagetown', state: 'TX', zipCode: '73301' }, speakers: [] },
    // Add other events if needed for testing different IDs
  ];

  const event = allEvents.find(e => e.eventId === eventId);
  return event || null; // Return the found event or null if not found
}

// Simulate ticket types for an event
async function getTicketTypes(eventId: number): Promise<{type: TicketType, price: number}[]> {
     await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
     if (eventId === 1) {
        return [
            { type: 'general admission', price: 99.99 },
            { type: 'vip', price: 249.99 },
        ];
     } else if (eventId === 2) {
         return [
             { type: 'general admission', price: 45.00 },
         ];
     }
     return [
         { type: 'general admission', price: 10.00 } // Default for others
     ];
}
// --- End Simulate API Call ---

export default async function EventDetailsPage({ params }: { params: { eventId: string } }) {
  // const { userRole } = useAuth(); // Use this client side if needed
  const eventId = parseInt(params.eventId, 10);
  const event = await getEventDetails(eventId);
  const ticketTypes = await getTicketTypes(eventId);

  if (!event) {
    // Handle event not found, maybe redirect or show a 404 component
    return (
       <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-destructive">Event Not Found</h1>
          <p className="text-muted-foreground mt-2">The event you are looking for does not exist.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/events">Back to Events</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
  }

  // Placeholder for organizer check - In real app, useAuth() on client or server session
  const isOrganizer = true; // Assume organizer for demo of buttons

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-secondary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden shadow-xl">
            <div className="relative h-64 md:h-96 w-full">
               <Image
                src={`https://picsum.photos/1200/400?random=${event.eventId}`}
                alt={`Banner for ${event.name}`}
                layout="fill"
                objectFit="cover"
                priority // Load banner image faster
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.name}</h1>
                 {isOrganizer && (
                    <div className="flex gap-2 mt-2">
                       <Button size="sm" variant="outline" className="text-white border-white/50 hover:bg-white/10">
                         <Edit className="mr-2 h-4 w-4"/> Edit Event
                       </Button>
                       <Button size="sm" variant="destructive">
                         <Trash2 className="mr-2 h-4 w-4"/> Delete Event
                       </Button>
                    </div>
                 )}
              </div>
            </div>

            <CardContent className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-3 text-primary">Event Details</h2>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {/* Date & Time */}
                    <div className="flex items-start space-x-3">
                        <Calendar className="h-6 w-6 text-primary mt-1 shrink-0" />
                        <div>
                        <h3 className="font-semibold">Date & Time</h3>
                        <p className="text-muted-foreground">{formatDate(event.date)}</p>
                        <p className="text-muted-foreground">{event.time}</p>
                        </div>
                    </div>

                   {/* Location */}
                   {event.venue && (
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
                            <div>
                            <h3 className="font-semibold">Location</h3>
                            <p className="text-muted-foreground">{event.venue.name}</p>
                            <p className="text-muted-foreground">{event.venue.address}, {event.venue.city}, {event.venue.state} {event.venue.zipCode}</p>
                            {event.venue.capacity && <p className="text-sm text-muted-foreground/80">Capacity: {event.venue.capacity}</p>}
                            </div>
                        </div>
                   )}
                </div>

                {/* Speakers Section */}
                {event.speakers && event.speakers.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-primary">Speakers</h2>
                      <div className="space-y-4">
                        {event.speakers.map((speaker) => (
                          <div key={speaker.speakerId} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                             <Avatar>
                                {/* Placeholder Avatar */}
                                <AvatarFallback><Mic className="h-5 w-5"/></AvatarFallback>
                             </Avatar>
                             <div>
                               <h4 className="font-medium">{speaker.name}</h4>
                               <p className="text-sm text-muted-foreground">{speaker.bio}</p>
                             </div>
                             {isOrganizer && (
                                <div className="ml-auto flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                     <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                             )}
                          </div>
                        ))}
                        {isOrganizer && (
                            <Button variant="outline" size="sm">Add Speaker</Button>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Right Column: Tickets */}
              <div className="lg:col-span-1 space-y-6">
                 <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                           <TicketIcon className="mr-2 h-5 w-5 text-primary" /> Tickets
                        </CardTitle>
                         <CardDescription>Select your ticket type.</CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                       {ticketTypes.map((ticket, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                                <div>
                                    <p className="font-medium capitalize">{ticket.type}</p>
                                    <p className="text-lg font-semibold text-primary">${ticket.price.toFixed(2)}</p>
                                </div>
                                {/* Add quantity selector and Add to Cart button here */}
                                <Button className="bg-accent hover:bg-accent/90">Book Now</Button>
                            </div>
                       ))}
                       {isOrganizer && (
                         <Button variant="outline" className="w-full mt-4">Manage Tickets</Button>
                       )}
                    </CardContent>
                 </Card>

                {/* Placeholder for map or other widgets */}
                 <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Venue Location</CardTitle>
                    </CardHeader>
                     <CardContent>
                        {/* In a real app, embed an interactive map here */}
                        <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                            Map Placeholder
                        </div>
                     </CardContent>
                 </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Optional: Generate static paths if you have a known list of events
// export async function generateStaticParams() {
//   // Fetch all event IDs
//   // const events = await fetchAllEventIds(); // Implement this function
//   // return events.map((event) => ({
//   //   eventId: event.id.toString(),
//   // }));
//   return [{ eventId: '1' }, { eventId: '2' }, { eventId: '3' }]; // Example
// }
