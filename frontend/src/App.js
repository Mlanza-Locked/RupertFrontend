import { useState } from "react";
import "@/App.css";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import RiverBackground from "@/components/RiverBackground";
import { Toaster } from "sonner";

function App() {
  const [signedUpEmail, setSignedUpEmail] = useState(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-body relative">
      <RiverBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero signedUpEmail={signedUpEmail} setSignedUpEmail={setSignedUpEmail} />
          <Features />
          <HowItWorks />
        </main>
        <Footer />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
