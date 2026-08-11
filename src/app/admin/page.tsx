"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, ADMIN_EMAIL } from "@/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import BlogDashboard from "./BlogDashboard";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center space-y-4">
        <h1 className="text-2xl font-bold font-headline text-primary">Not Authorized</h1>
        <p className="text-muted-foreground">
          Signed in as {user.email}, which isn&apos;t the admin account for this site.
        </p>
        <Button variant="outline" onClick={() => signOut(getFirebaseAuth())}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Site Admin</h1>
          <p className="text-muted-foreground text-sm">Signed in as {user.email}</p>
        </div>
        <Button variant="outline" onClick={() => signOut(getFirebaseAuth())}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue="gallery">
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery" className="pt-6">
          <AdminDashboard user={user} hideHeader />
        </TabsContent>
        <TabsContent value="blog" className="pt-6">
          <BlogDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
        setError("Incorrect email or password.");
      } else if (code.includes("too-many-requests")) {
        setError("Too many attempts. Please wait a moment and try again.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card className="shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Image src="/MJFritLogo1.png" alt="MJ Frit" width={56} height={56} />
          </div>
          <CardTitle className="text-2xl font-headline text-primary">Site Admin</CardTitle>
          <CardDescription>Sign in to manage the gallery and blog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
