import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestedPrompt?: string;
}

export default function PlaceholderPage({ title, description, suggestedPrompt }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-2xl text-center">
          <CardHeader className="space-y-4 pb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Construction className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {suggestedPrompt && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Suggested prompt:</p>
                <p className="text-sm font-medium italic">"{suggestedPrompt}"</p>
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Continue prompting to fill in this page contents, or return to the homepage.
              </p>
              
              <div className="flex gap-2 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
