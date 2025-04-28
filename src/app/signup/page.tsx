"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/components/auth/auth-context'; // Assuming signup might log user in
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole } from '@/lib/types';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
  userType: z.enum(['attendee', 'organizer'], { required_error: 'Please select a role.' }), // Removed administrator
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { login } = useAuth(); // Use login if signup automatically logs in user
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: undefined,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
     setIsLoading(true);
    console.log('Signup data:', data);

    // --- Simulate API Call for Signup ---
    // Replace this with your actual API call to create a new user
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    try {
      // Simulate successful signup
      const newUser: User = {
          userId: Math.floor(Math.random() * 1000) + 3, // Generate a fake ID
          name: data.name,
          email: data.email,
          userType: data.userType,
      };

      console.log("Simulated new user:", newUser);

      // Optionally log the user in immediately after signup
      login(newUser);

       toast({
         title: "Signup Successful!",
         description: `Welcome, ${data.name}! Your account has been created.`,
       });

       // Redirect after signup (e.g., to dashboard or home)
       router.push(newUser.userType === 'organizer' ? '/dashboard' : '/');

    } catch (error) {
      // Simulate signup failure (e.g., email already exists)
       toast({
         title: "Signup Failed",
         description: error instanceof Error ? error.message : "Could not create account. Please try again.",
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
                <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                <CardDescription>Join EventFlow to discover or host events.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                            <Input placeholder="••••••••" {...field} type="password" disabled={isLoading}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" {...field} type="password" disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I am joining as</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="attendee">An Attendee</SelectItem>
                              <SelectItem value="organizer">An Organizer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <Button type="submit" className="w-full" disabled={isLoading}>
                       {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Sign Up
                    </Button>
                  </form>
                </Form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/login">
                      Login
                    </Link>
                  </Button>
                </p>
              </CardContent>
            </Card>
       </main>
       <Footer />
     </div>
  );
}
