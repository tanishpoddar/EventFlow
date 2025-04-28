import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
              Discover & Host Events with EventFlow
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your seamless platform for finding exciting events or organizing your own. Explore, book, and manage everything in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/events">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/events/create">
                  Create an Event
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Placeholder for Featured Events Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example Event Card (Replace with dynamic data) */}
              <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="https://picsum.photos/400/250?random=1"
                  alt="Event Image"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Tech Conference 2024</h3>
                  <p className="text-muted-foreground text-sm mb-1">Oct 25, 2024 | Anytown Convention Center</p>
                  <p className="text-sm mb-4 line-clamp-2">Join industry leaders for the latest trends in technology and innovation.</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#">Learn More</Link>
                  </Button>
                </div>
              </div>
              {/* Repeat similar cards or fetch dynamically */}
               <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="https://picsum.photos/400/250?random=2"
                  alt="Event Image"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Music Fest Downtown</h3>
                   <p className="text-muted-foreground text-sm mb-1">Nov 12, 2024 | Central Park</p>
                  <p className="text-sm mb-4 line-clamp-2">Experience live music from various artists under the stars.</p>
                   <Button variant="outline" size="sm" asChild>
                    <Link href="#">Learn More</Link>
                  </Button>
                </div>
              </div>
               <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="https://picsum.photos/400/250?random=3"
                  alt="Event Image"
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Artisan Market Fair</h3>
                   <p className="text-muted-foreground text-sm mb-1">Dec 5, 2024 | Old Town Square</p>
                  <p className="text-sm mb-4 line-clamp-2">Discover unique crafts and handmade goods from local artisans.</p>
                   <Button variant="outline" size="sm" asChild>
                    <Link href="#">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
             <div className="text-center mt-12">
               <Button variant="link" asChild>
                 <Link href="/events">
                   View All Events <ArrowRight className="ml-1 h-4 w-4" />
                 </Link>
               </Button>
             </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
