import HeroSection from '../components/HeroSection';
import StorySection from '../components/StorySection';
import FeaturedDonuts from '../components/FeaturedDonuts';
import OtherTreats from '../components/OtherTreats';
import Beverages from '../components/Beverages';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <FeaturedDonuts />
      <OtherTreats />
      <Beverages />
    </>
  );
}
