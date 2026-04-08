import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Eye, MousePointerClick, Users, TrendingUp,
  Download, LogOut, Loader2, Clock, MessageSquare,
} from "lucide-react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const StatCard = ({ icon: Icon, label, value, sub, testId }) => (
  <div data-testid={testId} className="bg-card border border-border/50 rounded-lg p-5" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground font-heading">{label}</span>
    </div>
    <p className="text-3xl font-heading font-bold text-foreground">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const SECTION_COLORS = {
  hero: "bg-blue-500",
  features: "bg-emerald-500",
  "how-it-works": "bg-amber-500",
  "footer-cta": "bg-purple-500",
};

const SECTION_LABELS = {
  hero: "Hero",
  features: "Features",
  "how-it-works": "How It Works",
  "footer-cta": "Footer CTA",
};

export default function AdminDashboard({ token, onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [signups, setSignups] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, sRes, fRes] = await Promise.all([
          axios.get(`${API}/admin/analytics`, { headers }),
          axios.get(`${API}/admin/signups`, { headers }),
          axios.get(`${API}/admin/feedback`, { headers }),
        ]);
        setAnalytics(aRes.data);
        setSignups(sRes.data);
        setFeedback(fRes.data);
      } catch {
        // token expired
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const exportCSV = () => {
    window.open(`${API}/admin/export-csv?token=${token}`, "_blank");
  };

  const handleLogout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true }).catch(() => {});
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const maxSectionTime = analytics?.section_times?.length
    ? Math.max(...analytics.section_times.map((s) => s.avg_seconds))
    : 1;

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/job_first-pass-ai/artifacts/uz0vyu96_Rupert.png"
              alt="RupertJolt"
              className="w-7 h-7 rounded-md object-contain"
            />
            <span className="font-heading font-semibold text-foreground">Admin Dashboard</span>
          </div>
          <Button
            data-testid="admin-logout-button"
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-card/60 border border-border/40 rounded-lg p-1 w-fit" data-testid="dashboard-tabs">
          {["overview", "signups", "feedback"].map((t) => (
            <button
              key={t}
              data-testid={`tab-${t}`}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-heading font-medium transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && analytics && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard icon={Eye} label="Page Visits" value={analytics.total_visits} testId="stat-visits" />
              <StatCard icon={MousePointerClick} label="CTA Clicks" value={analytics.total_clicks} testId="stat-clicks" />
              <StatCard icon={Users} label="Signups" value={analytics.total_signups} testId="stat-signups" />
              <StatCard
                icon={TrendingUp}
                label="Conversion"
                value={`${analytics.conversion_rate}%`}
                sub="Visits → Signups"
                testId="stat-conversion"
              />
            </div>

            {/* Section Time Heatmap */}
            <div className="bg-card border border-border/50 rounded-lg p-6 mb-8" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }} data-testid="section-heatmap">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">
                  Section Time Heatmap
                </h3>
                <span className="text-xs text-muted-foreground ml-1">
                  (avg seconds per session)
                </span>
              </div>
              {analytics.section_times.length > 0 ? (
                <div className="space-y-3">
                  {analytics.section_times.map((s) => {
                    const pct = maxSectionTime > 0 ? (s.avg_seconds / maxSectionTime) * 100 : 0;
                    const color = SECTION_COLORS[s.section] || "bg-primary";
                    return (
                      <div key={s.section} data-testid={`heatmap-${s.section}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground font-medium">
                            {SECTION_LABELS[s.section] || s.section}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {s.avg_seconds}s avg &middot; {s.sessions} sessions
                          </span>
                        </div>
                        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%`, opacity: 0.4 + (pct / 100) * 0.6 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No section time data yet. Data appears as visitors browse the site.</p>
              )}
            </div>

            {/* Click breakdown */}
            <div className="bg-card border border-border/50 rounded-lg p-6" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }} data-testid="click-breakdown">
              <div className="flex items-center gap-2 mb-5">
                <MousePointerClick className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Click Breakdown</h3>
              </div>
              {analytics.click_breakdown.length > 0 ? (
                <div className="space-y-2">
                  {analytics.click_breakdown.map((c) => (
                    <div key={c.element} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-sm text-foreground">{c.element}</span>
                      <span className="text-sm font-semibold text-primary">{c.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No click data yet.</p>
              )}
            </div>
          </>
        )}

        {tab === "signups" && (
          <div className="bg-card border border-border/50 rounded-lg p-6" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }} data-testid="signups-table">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">
                  Waitlist Signups ({signups.length})
                </h3>
              </div>
              <Button
                data-testid="export-csv-button"
                variant="outline"
                size="sm"
                onClick={exportCSV}
                className="border-primary/30 text-primary hover:bg-primary/10 text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border/40">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((s, i) => {
                    const d = new Date(s.signed_up_at);
                    return (
                      <tr key={s.id || i} className="border-b border-border/20 last:border-0">
                        <td className="py-2.5 text-muted-foreground">{i + 1}</td>
                        <td className="py-2.5 text-foreground">{s.email}</td>
                        <td className="py-2.5 text-muted-foreground">
                          {d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-2.5 text-muted-foreground">
                          {d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "feedback" && (
          <div className="bg-card border border-border/50 rounded-lg p-6" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }} data-testid="feedback-table">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">
                Feedback ({feedback.length})
              </h3>
            </div>
            {feedback.length > 0 ? (
              <div className="space-y-4">
                {feedback.map((f, i) => (
                  <div key={f.id || i} className="border-b border-border/20 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{f.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(f.submitted_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{f.feedback}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No feedback yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
