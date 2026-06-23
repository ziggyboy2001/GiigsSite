import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import StatBand from "./components/StatBand";
import ProblemSection from "./components/ProblemSection";
import FeaturesSection from "./components/FeaturesSection";
import VenueMarquee from "./components/VenueMarquee";
import BookingSection from "./components/BookingSection";
import DownloadSection from "./components/DownloadSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink-950 antialiased">
      <Navbar />
      <HeroSection />
      <StatBand />
      <ProblemSection />
      <FeaturesSection />
      <VenueMarquee />
      <BookingSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
