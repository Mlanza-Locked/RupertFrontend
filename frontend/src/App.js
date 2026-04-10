import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import RiverBackground from "@/components/RiverBackground";
import AdminPage from "@/pages/AdminPage";
import { Toaster } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function LandingPage() {
  const [signedUpEmail, setSignedUpEmail] = useState(null);
  const { trackClick } = useAnalytics();

  return (
    <div className="min-h-screen bg-background text-foreground font-body relative">
      <RiverBackground />
      <div className="relative z-10">
        <Header trackClick={trackClick} />
        <main>
          <Hero signedUpEmail={signedUpEmail} setSignedUpEmail={setSignedUpEmail} trackClick={trackClick} />
          <Features trackClick={trackClick} />
          <HowItWorks />
        </main>
        <Footer trackClick={trackClick} />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
