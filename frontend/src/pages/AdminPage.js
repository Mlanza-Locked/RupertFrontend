import { useState } from "react";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function AdminPage() {
  const [admin, setAdmin] = useState(null);

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
