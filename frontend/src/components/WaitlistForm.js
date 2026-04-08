import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Check, Loader2, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function WaitlistForm({ signedUpEmail, setSignedUpEmail }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/waitlist`, { email: email.trim() });
      setSignedUpEmail(email.trim());
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.detail || "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setFeedbackLoading(true);
    try {
      await axios.post(`${API}/waitlist/feedback`, {
        email: signedUpEmail,
        feedback: feedback.trim(),
      });
      setFeedbackSent(true);
      toast.success("Thanks for sharing!");
    } catch {
      toast.error("Could not submit feedback. Try again.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!signedUpEmail ? (
        <motion.form
          key="form"
          data-testid="waitlist-form"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            data-testid="waitlist-email-input"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card border-border/60 text-foreground placeholder:text-muted-foreground rounded-full px-5 flex-1 focus-visible:ring-primary/50 focus-visible:border-primary/40"
          />
          <Button
            data-testid="waitlist-submit-button"
            type="submit"
            disabled={loading}
            className="h-11 bg-primary text-primary-foreground font-heading font-semibold rounded-full px-7 hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(64,224,208,0.3)] disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Get Early Access"
            )}
          </Button>
        </motion.form>
      ) : (
        <motion.div
          key="confirmation"
          data-testid="waitlist-confirmation"
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="font-heading font-semibold text-foreground">
              You're on the list!
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            We'll notify <span className="text-foreground">{signedUpEmail}</span> when
            Rupert is ready to dive in.
          </p>

          {!feedbackSent ? (
            <form onSubmit={handleFeedback} data-testid="feedback-form">
              <p className="text-sm text-muted-foreground mb-3 italic">
                P.S. While you wait &mdash; what's your biggest editing bottleneck?
              </p>
              <Textarea
                data-testid="feedback-textarea"
                placeholder="e.g., I spend 2 hours cutting silence from every podcast episode..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-card border-border/60 text-foreground placeholder:text-muted-foreground min-h-[80px] mb-3 rounded-lg focus-visible:ring-primary/50"
              />
              <Button
                data-testid="feedback-submit-button"
                type="submit"
                disabled={feedbackLoading || !feedback.trim()}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 rounded-full px-6 font-heading font-medium"
              >
                {feedbackLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Share with Rupert
                  </>
                )}
              </Button>
            </form>
          ) : (
            <motion.p
              data-testid="feedback-thanks"
              className="text-sm text-primary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Thanks for sharing! We'll use this to make Rupert even better.
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
