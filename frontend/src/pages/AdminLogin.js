import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, AlertCircle } from "lucide-react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      onLogin(data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground" data-testid="admin-login-title">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">RupertJolt Analytics</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2" data-testid="login-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <Input
            data-testid="admin-username-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 bg-card border-border/60 text-foreground rounded-lg"
            required
          />
          <Input
            data-testid="admin-password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-card border-border/60 text-foreground rounded-lg"
            required
          />
          <Button
            data-testid="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary text-primary-foreground font-heading font-semibold rounded-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
