"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ticket, LogIn, LogOut, UserPlus, LayoutDashboard, CalendarPlus, Settings } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user, isAuthenticated, userRole, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to home after logout
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-secondary shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Ticket className="h-6 w-6" />
          <span>EventFlow</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Always show Browse Events */}
          <Button variant="ghost" asChild>
             <Link href="/events">Browse Events</Link>
          </Button>

          {isAuthenticated ? (
            <>
              {userRole === 'organizer' && (
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Organizer Dashboard
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* Add AvatarImage if user has profile picture */}
                      {/* <AvatarImage src="/avatars/01.png" alt={user?.name} /> */}
                      <AvatarFallback>{user?.name ? getInitials(user.name) : '?'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userRole === 'attendee' && (
                     <DropdownMenuItem onClick={() => router.push('/my-tickets')}>
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>My Tickets</span>
                    </DropdownMenuItem>
                  )}
                   {userRole === 'organizer' && (
                     <DropdownMenuItem onClick={() => router.push('/events/create')}>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      <span>Create Event</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                     <Settings className="mr-2 h-4 w-4" />
                     <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
