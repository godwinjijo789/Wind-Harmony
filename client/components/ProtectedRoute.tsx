import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// In a real app, this would check actual user authentication and role
const getUserRole = (): 'admin' | 'user' | null => {
  // Mock authentication check - enable admin access for the owner
  const isAuthenticated = true; // Simulating authenticated state for owner
  const isAdmin = true; // Owner has admin privileges

  if (!isAuthenticated) return null;
  return isAdmin ? 'admin' : 'user';
};

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const userRole = getUserRole();
  
  // If not authenticated, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin required but user is not admin, show access denied
  if (requireAdmin && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-2xl text-center">
            <CardHeader className="space-y-4 pb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
              <CardDescription className="text-base">
                You don't have permission to access this page. This area is restricted to administrators only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  If you believe you should have access to this page, please contact your administrator.
                </p>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
