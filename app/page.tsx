import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { Benefits } from "@/components/Benefits";
import { Events } from "@/components/Events";
import { Partners } from "@/components/Partners";
import { Footer } from "@/components/Footer";
import { getEvents, getSiteSettings, getTeam } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [settings, team, events] = await Promise.all([
    getSiteSettings(),
    getTeam(),
    getEvents(),
  ]);

  return (
    <main className="relative min-h-screen">
      <Backdrop />
      <Navbar />
      <Hero settings={settings} />
      <About />
      <Team members={team} />
      <Benefits />
      <Events events={events} />
      <Partners />
      <Footer />
    </main>
  );
}
