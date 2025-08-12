import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Wind, Users, Crown, Headphones, Mic2 } from 'lucide-react';

const instruments = [
  {
    id: 'flute',
    name: 'Flute',
    description: 'Elegant woodwind with crystalline tones',
    icon: Wind,
    keys: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    color: 'wind-400'
  },
  {
    id: 'saxophone',
    name: 'Saxophone',
    description: 'Smooth jazz and soulful melodies',
    icon: Mic2,
    keys: ['C', 'D', 'E♭', 'F', 'G', 'A', 'B♭'],
    color: 'brass-500'
  },
  {
    id: 'trumpet',
    name: 'Trumpet',
    description: 'Bold brass with powerful projection',
    icon: Headphones,
    keys: ['C', 'D', 'E', 'F', 'G', 'A', 'B♭'],
    color: 'wind-600'
  },
  {
    id: 'clarinet',
    name: 'Clarinet',
    description: 'Rich woody tones across all registers',
    icon: Music,
    keys: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    color: 'brass-400'
  }
];

const features = [
  {
    icon: Users,
    title: 'Collaborative Workspace',
    description: 'Work together in real-time like Canva, but for music creation'
  },
  {
    icon: Crown,
    title: 'Premium Instruments',
    description: 'Access professional-grade wind instrument samples with subscription'
  },
  {
    icon: Music,
    title: 'Interactive Keys',
    description: 'Play virtual instrument keys with authentic sound reproduction'
  }
];

export default function Index() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'WindHarmony',
    siteDescription: 'Create beautiful wind instrument music with our collaborative platform.'
  });

  // Load CMS content if available
  useEffect(() => {
    const cmsContent = localStorage.getItem('cmsContent');
    if (cmsContent) {
      try {
        const content = JSON.parse(cmsContent);
        const siteName = content.find((c: any) => c.page === 'Homepage' && c.section === 'Hero Title');
        const siteDesc = content.find((c: any) => c.page === 'Homepage' && c.section === 'Hero Description');

        if (siteName) setSiteSettings(prev => ({...prev, siteName: siteName.content}));
        if (siteDesc) setSiteSettings(prev => ({...prev, siteDescription: siteDesc.content}));
      } catch (error) {
        console.error('Failed to load CMS content:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-wind-500/20 to-brass-500/20 opacity-50" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/20 p-4 rounded-full mr-4">
                <Wind className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {siteSettings.siteName}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {siteSettings.siteDescription}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                <Link to="/login" className="flex items-center gap-2">
                  Start Creating
                  <Music className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Instruments Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Instrument</h2>
            <p className="text-muted-foreground text-lg">
              Each instrument comes with authentic sounds and responsive key layouts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instruments.map((instrument) => {
              const IconComponent = instrument.icon;
              return (
                <Card key={instrument.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary/30">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-${instrument.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 text-${instrument.color}`} />
                    </div>
                    <CardTitle className="text-xl">{instrument.name}</CardTitle>
                    <CardDescription>{instrument.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {instrument.keys.slice(0, 4).map((key) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}
                        </Badge>
                      ))}
                      {instrument.keys.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{instrument.keys.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why WindHarmony?</h2>
            <p className="text-muted-foreground text-lg">
              Professional tools for wind instrument enthusiasts and creators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of musicians creating beautiful wind instrument music together. 
            Start your free trial today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              <Link to="/signup">
                Get Started Free
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Link to="/demo">
                Try Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Wind className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">WindHarmony</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/pricing" className="hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/demo" className="hover:text-primary transition-colors">
                Demo
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t text-xs text-muted-foreground">
            © 2024 WindHarmony. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
