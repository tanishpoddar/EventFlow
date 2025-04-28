export type UserRole = 'organizer' | 'attendee' | 'administrator';
export type TicketType = 'general admission' | 'vip' | 'other';
export type PaymentMethod = 'credit card' | 'paypal' | 'other';

export interface User {
  userId: number;
  name: string;
  email: string;
  // password should not be stored or transmitted to frontend
  userType: UserRole;
}

export interface Venue {
  venueId: number;
  name: string;
  address?: string | null;
  capacity?: number | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}

export interface Speaker {
  speakerId: number;
  name: string;
  bio?: string | null;
  eventId: number;
}

export interface Event {
  eventId: number;
  name: string;
  description?: string | null;
  date: string; // Store as ISO string or use Date object
  time: string; // Store as HH:MM or use Date object
  locationId: number;
  venue?: Venue; // Optional: Include venue details if fetched together
  speakers?: Speaker[]; // Optional: Include speaker details
}

export interface Order {
  orderId: number;
  userId: number;
  date: string; // Store as ISO string or use Date object
  totalPrice: number;
  paymentId?: number | null;
  user?: User; // Optional: Include user details
  tickets?: Ticket[]; // Optional: Include ticket details
  payment?: Payment; // Optional: Include payment details
}

export interface Ticket {
  ticketId: number;
  eventId: number;
  orderId: number;
  price: number;
  type: TicketType;
  seatNumber?: number | null;
  event?: Event; // Optional: Include event details
  order?: Order; // Optional: Include order details
}


export interface Payment {
  paymentId: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  transactionId?: string | null;
  order?: Order; // Optional: Include order details
}
