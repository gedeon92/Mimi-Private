import { Header } from "@/components/mc/Header";
import { Hero } from "@/components/mc/Hero";
import { ShapeOfTime } from "@/components/mc/ShapeOfTime";
import { Collection } from "@/components/mc/Collection";
import { SavoirFaire } from "@/components/mc/SavoirFaire";
import { Rarete } from "@/components/mc/Rarete";
import { FormSet } from "@/components/mc/FormSet";
import { BrandStory } from "@/components/mc/BrandStory";
import { Community } from "@/components/mc/Community";
import { Newsletter } from "@/components/mc/Newsletter";
import { Footer } from "@/components/mc/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <Hero />
      <ShapeOfTime />
      <Collection />
      <SavoirFaire />
      <Rarete />
      <FormSet />
      <Community />
      <Newsletter />
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="rule-fade" />
      </div>
      <BrandStory />
    </main>
    <Footer />
  </div>
);

export default Index;
