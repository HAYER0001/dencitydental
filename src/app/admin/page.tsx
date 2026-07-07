"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2, Check, X, LogOut, LayoutDashboard } from "lucide-react";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  service: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
};

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appts: Appointment[] = [];
      snapshot.forEach((doc) => {
        appts.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      setAppointments(appts);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError("Failed to authenticate. Check credentials.");
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'denied') => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/appointments/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert("Error updating appointment.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-charcoal">
        <Loader2 className="h-8 w-8 animate-spin text-clinic-teal" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-card border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-lifted">
          <div className="mb-8 text-center">
            <h1 className="text-heading-2 mb-2 text-white">Admin Portal</h1>
            <p className="text-white/60">Sign in to manage appointments</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Admin Email" 
                className="w-full rounded-button border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full rounded-button border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-clinic-teal focus:outline-none focus:ring-1 focus:ring-clinic-teal transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {authError && <p className="text-sm text-red-400">{authError}</p>}
            <button 
              type="submit" 
              className="mt-4 w-full rounded-button bg-clinic-teal px-4 py-3 text-white font-medium hover:bg-clinic-teal-soft transition-colors shadow-soft"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-card">
        <div className="flex items-center gap-4 text-white">
          <div className="rounded-full bg-clinic-teal/20 p-3">
            <LayoutDashboard className="h-6 w-6 text-clinic-teal-soft" />
          </div>
          <div>
            <h1 className="text-heading-3">Dashboard</h1>
            <p className="text-sm text-white/60">Manage your clinic appointments</p>
          </div>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 rounded-pill border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {appointments.length === 0 ? (
          <div className="col-span-full rounded-card border border-white/10 bg-white/5 p-16 text-center text-white/70 backdrop-blur-sm">
            No appointments found.
          </div>
        ) : (
          appointments.map((appt) => (
            <div 
              key={appt.id} 
              className="group flex flex-col justify-between rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-soft hover:shadow-card hover:bg-white/10 transition-all duration-300"
            >
              <div>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="overflow-hidden">
                    <h3 className="font-medium text-white text-lg truncate">{appt.name}</h3>
                    <a href={`mailto:${appt.email}`} className="text-sm text-clinic-teal-soft hover:underline truncate block">{appt.email}</a>
                    {appt.phone && <a href={`tel:${appt.phone}`} className="text-sm text-white/50 hover:text-white/80 transition-colors block mt-1">{appt.phone}</a>}
                  </div>
                  <span className={`shrink-0 rounded-pill px-3 py-1 text-xs font-semibold capitalize border ${
                    appt.status === 'pending' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' : 
                    appt.status === 'approved' ? 'bg-green-500/10 text-green-300 border-green-500/20' : 
                    'bg-red-500/10 text-red-300 border-red-500/20'
                  }`}>
                    {appt.status}
                  </span>
                </div>
                
                <div className="mb-6 space-y-2 text-sm text-white/80">
                  <div className="flex justify-between rounded-button bg-black/20 px-4 py-3">
                    <span className="text-white/50">Service</span>
                    <span className="font-medium text-white text-right">{appt.service}</span>
                  </div>
                  <div className="flex justify-between rounded-button bg-black/20 px-4 py-3">
                    <span className="text-white/50">Date</span>
                    <span className="font-medium text-white text-right">{appt.date}</span>
                  </div>
                </div>
              </div>

              {appt.status === 'pending' && (
                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => handleStatusUpdate(appt.id, 'approved')}
                    disabled={processingId === appt.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-button bg-clinic-teal px-4 py-2.5 text-sm font-medium text-white hover:bg-clinic-teal-soft transition-colors disabled:opacity-50"
                  >
                    {processingId === appt.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(appt.id, 'denied')}
                    disabled={processingId === appt.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-button border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    {processingId === appt.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
