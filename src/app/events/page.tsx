import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar } from 'lucide-react';
import type { Event } from '@/lib/types'; // Use the defined type

// --- Simulate API Call ---
// Replace this with actual data fetching logic
async function getEvents(): Promise<Event[]> {
  // Simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return [
    { eventId: 1, name: 'Tech Conference 2024', description: 'Join industry leaders for the latest trends in technology and innovation.', date: '2024-10-25', time: '09:00', locationId: 1, venue: { venueId: 1, name: 'Anytown Convention Center', city: 'Anytown', state: 'CA' } },
    { eventId: 2, name: 'Music Fest Downtown', description: 'Experience live music from various artists under the stars.', date: '2024-11-12', time: '18:00', locationId: 2, venue: { venueId: 2, name: 'Central Park', city: 'Metropolis', state: 'NY' } },
    { eventId: 3, name: 'Artisan Market Fair', description: 'Discover unique crafts and handmade goods from local artisans.', date: '2024-12-05', time: '10:00', locationId: 3, venue: { venueId: 3, name: 'Old Town Square', city: 'Villagetown', state: 'TX' } },
    { eventId: 4, name: 'Startup Pitch Night', description: 'Watch entrepreneurs pitch their ideas to investors.', date: '2024-11-20', time: '19:00', locationId: 1, venue: { venueId: 1, name: 'Anytown Convention Center', city: 'Anytown', state: 'CA' } },
    { eventId: 5, name: 'Food Truck Festival', description: 'Taste delicious food from a variety of local food trucks.', date: '2024-10-30', time: '12:00', locationId: 2, venue: { venueId: 2, name: 'Central Park', city: 'Metropolis', state: 'NY' } },
    { eventId: 6, name: 'Photography Workshop', description: 'Learn the basics of digital photography from a pro.', date: '2024-11-08', time: '13:00', locationId: 4, venue: { venueId: 4, name: 'Community Art Center', city: 'Villagetown', state: 'TX'} },
  ];
}
// --- End Simulate API Call ---


export default async function EventsPage() {
  const events = await getEvents();

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Events</h1>

        {/* Search and Filter Bar */}
        <div className="mb-8 p-4 bg-secondary rounded-lg shadow">
           <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="search" placeholder="Search events..." className="pl-10" />
                </div>
                <Input type="text" placeholder="Location (e.g., city)" className="md:w-1/4" />
                <Input type="date" placeholder="Date" className="md:w-1/4" />
                <Button className="w-full md:w-auto bg-accent hover:bg-accent/90">Find Events</Button>
           </div>
        </div>


        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.eventId} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  // Use a placeholder image service
                  src={`https://picsum.photos/400/250?random=${event.eventId}`} // Ensure unique image per event
                  alt={`Image for ${event.name}`}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground pt-1 space-y-1">
                     <div className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4"/> {formatDate(event.date)} at {event.time}
                     </div>
                     {event.venue && (
                         <div className="flex items-center">
                            <MapPin className="mr-1.5 h-4 w-4" /> {event.venue.name}, {event.venue.city}
                         </div>
                     )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href={`/events/${event.eventId}`}>View Details & Tickets</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No events found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

