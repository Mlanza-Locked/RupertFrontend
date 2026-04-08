import { useState, useEffect } from "react";
import axios from "axios";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminPage() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })
      .then((res) => setAdmin(res.data))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;

  if (!admin) {
    return (
      <AdminLogin
        onLogin={(data) => setAdmin({ username: data.username, token: data.token })}
      />
    );
  }

  return (
    <AdminDashboard
      token={admin.token}
      onLogout={() => setAdmin(null)}
    />
  );
}
