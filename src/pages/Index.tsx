import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Products } from "@/components/Products";
import { Blog } from "@/components/Blog";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSlider />
      <Products />
      <Services />
      <Gallery />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
