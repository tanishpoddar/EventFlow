"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-context';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarPlus, Edit, Trash2, Users, Settings, BarChart2 } from 'lucide-react';
import type { Event } from '@/lib/types';

// --- Simulate API Call ---
async function getOrganizerEvents(userId: number): Promise<Event[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  // In real app, filter events by the organizer's userId
  return [
    { eventId: 1, name: 'Tech Conference 2024', description: 'Annual tech conference.', date: '2024-10-25', time: '09:00', locationId: 1 },
    { eventId: 4, name: 'Startup Pitch Night', description: 'Entrepreneurs pitch ideas.', date: '2024-11-20', time: '19:00', locationId: 1 },
    // Add more events organized by this user
  ];
}
// --- End Simulate API Call ---

export default function DashboardPage() {
  const { user, isAuthenticated, userRole, logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

   useEffect(() => {
    // Redirect if not authenticated or not an organizer
    if (!isAuthenticated || userRole !== 'organizer') {
      router.push('/login'); // Or '/'
    } else {
      // Fetch organizer-specific data
       const fetchData = async () => {
           if (user?.userId) {
              setIsLoading(true);
              const fetchedEvents = await getOrganizerEvents(user.userId);
              setEvents(fetchedEvents);
              setIsLoading(false);
           }
       };
       fetchData();
    }
   }, [isAuthenticated, userRole, router, user]);


   // Format date for display
   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
      });
   }

   // Render skeleton or loading state while fetching
   if (isLoading || !isAuthenticated || userRole !== 'organizer') {
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
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <Button asChild>
            <Link href="/events/create">
              <CalendarPlus className="mr-2 h-4 w-4" /> Create New Event
            </Link>
          </Button>
        </div>

         {/* Quick Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                 <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">Events you are hosting</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                 <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">+1,234</div> {/* Placeholder */}
                <p className="text-xs text-muted-foreground">+50 this month</p> {/* Placeholder */}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                 <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">$5,678</div> {/* Placeholder */}
                <p className="text-xs text-muted-foreground">From ticket sales</p> {/* Placeholder */}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Event</CardTitle>
                 <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-lg font-semibold">{events[0]?.name || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">{events[0] ? formatDate(events[0].date) : 'No upcoming events'}</p>
                </CardContent>
            </Card>
        </div>


        {/* My Events Table */}
         <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Manage your created events.</CardDescription>
          </CardHeader>
          <CardContent>
             {events.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Attendees</TableHead> {/* Placeholder */}
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                        <TableRow key={event.eventId}>
                            <TableCell className="font-medium">{event.name}</TableCell>
                            <TableCell>{formatDate(event.date)}</TableCell>
                            <TableCell>{event.time}</TableCell>
                             <TableCell>150 / 500</TableCell> {/* Placeholder */}
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="mr-1 h-8 w-8" onClick={() => router.push(`/events/${event.eventId}`)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                     <span className="sr-only">Delete</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                 <p className="text-center text-muted-foreground py-4">You haven't created any events yet.</p>
             )}
          </CardContent>
        </Card>

        {/* Add other dashboard sections like Venue Management, Speaker Management etc. */}

      </main>
      <Footer />
    </div>
  );
}


import { Loader2, Calendar } from 'lucide-react'; // Ensure Calendar is imported
import React from 'react'; // Ensure React is imported
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Ensure Avatar is imported
