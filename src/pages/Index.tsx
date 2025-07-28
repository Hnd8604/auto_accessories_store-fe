import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
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
      <Hero />
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
