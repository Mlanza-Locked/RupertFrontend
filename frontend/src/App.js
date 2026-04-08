import { useState } from "react";
import "@/App.css";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

function App() {
  const [signedUpEmail, setSignedUpEmail] = useState(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main>
        <Hero signedUpEmail={signedUpEmail} setSignedUpEmail={setSignedUpEmail} />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
