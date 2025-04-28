"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole } from '@/lib/types'; // Import User type
import { Header } from '@/components/shared/header'; // Import Header
import { Footer } from '@/components/shared/footer'; // Import Footer
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // --- Simulate API Call ---
    // Replace this with your actual API call to verify credentials
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    try {
       // In a real app, the API would return the user object upon successful login
       // We simulate this based on the email for demo purposes
      let simulatedUser: User | null = null;
      if (data.email === 'organizer@example.com') {
          simulatedUser = { userId: 1, name: 'Organizer One', email: data.email, userType: 'organizer' };
      } else if (data.email === 'attendee@example.com') {
          simulatedUser = { userId: 2, name: 'Attendee Alice', email: data.email, userType: 'attendee' };
      }

      if (simulatedUser && data.password === 'password') { // Simulate correct password
          login(simulatedUser);
          toast({
             title: "Login Successful",
             description: `Welcome back, ${simulatedUser.name}!`,
           });
          router.push(simulatedUser.userType === 'organizer' ? '/dashboard' : '/'); // Redirect based on role
      } else {
        throw new Error("Invalid email or password."); // Simulate login failure
      }
    } catch (error) {
       toast({
         title: "Login Failed",
         description: error instanceof Error ? error.message : "An unexpected error occurred.",
         variant: "destructive",
       });
    } finally {
      setIsLoading(false);
    }
    // --- End Simulate API Call ---
  };

  return (
    <div className="flex flex-col min-h-screen">
       <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Login to EventFlow</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} type="email" disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" {...field} type="password" disabled={isLoading} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                     <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </form>
                </Form>
                 <p className="mt-6 text-center text-sm text-muted-foreground">
                   Don't have an account?{' '}
                   <Button variant="link" asChild className="p-0 h-auto">
                     <Link href="/signup">
                       Sign up
                     </Link>
                   </Button>
                 </p>
                 <p className="mt-2 text-center text-xs text-muted-foreground">
                    Hint: organizer@example.com / password <br/>
                    or attendee@example.com / password
                 </p>
              </CardContent>
            </Card>
        </main>
      <Footer />
    </div>
  );
}
