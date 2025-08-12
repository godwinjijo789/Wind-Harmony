import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, Check, Crown, Users, Zap, Shield } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '$0',
    period: '1 day',
    description: 'Try all features with limited access',
    features: [
      'Basic wind instruments',
      'Voice & non-voice categories',
      'Limited collaboration (2 users)',
      'Basic sound quality',
      '1-day trial period'
    ],
    limitations: [
      'No premium instruments',
      'Limited export options',
      'Watermarked recordings'
    ],
    icon: Wind,
    color: 'muted'
  },
  {
    id: 'professional',
    name: 'Professional License',
    price: '$29',
    period: 'per month',
    description: 'Full access for serious musicians',
    features: [
      'All premium wind instruments',
      'Professional sound quality',
      'Unlimited collaboration',
      'Voice & non-voice categories',
      'Export in all formats',
      'Commercial use rights',
      'Cloud storage (10GB)',
      'Priority support'
    ],
    icon: Crown,
    color: 'primary',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise License',
    price: '$99',
    period: 'per month',
    description: 'For music studios and organizations',
    features: [
      'Everything in Professional',
      'Multi-user management',
      'Advanced collaboration tools',
      'Custom instrument creation',
      'White-label options',
      'Unlimited cloud storage',
      'Dedicated account manager',
      'Custom integrations',
      'Bulk licensing discounts'
    ],
    icon: Users,
    color: 'accent'
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/20 p-3 rounded-full mr-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Choose Your License</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              WindHarmony operates on a license-based model. Choose the plan that best fits your music creation needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* License Info */}
        <div className="text-center mb-12">
          <div className="bg-wind-50/50 border border-wind-200/50 rounded-lg p-6 max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-wind-600 mr-2" />
              <h2 className="text-xl font-semibold">License-Based Access</h2>
            </div>
            <p className="text-muted-foreground">
              WindHarmony requires an active license for continued use. Start with our 1-day free trial, 
              then choose a license plan that unlocks the full potential of wind instrument creation.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative ${
                  plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border/50'
                } hover:shadow-lg transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-${plan.color}/20 flex items-center justify-center mb-4`}>
                    <IconComponent className={`h-8 w-8 text-${plan.color === 'muted' ? 'muted-foreground' : plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.limitations && (
                    <div className="space-y-2 pt-4 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Limitations
                      </p>
                      {plan.limitations.map((limitation, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          • {limitation}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    className={`w-full h-12 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    asChild
                  >
                    <Link to={plan.id === 'free' ? '/signup' : '/checkout'}>
                      {plan.id === 'free' ? 'Start Free Trial' : 'Get License'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What happens when my trial expires?</h3>
                <p className="text-muted-foreground text-sm">
                  After your 1-day free trial, you'll need to purchase a license to continue using WindHarmony. 
                  Your projects will be saved, but access will be limited until you upgrade.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I use WindHarmony for commercial projects?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Professional and Enterprise licenses include commercial use rights. 
                  The free trial is for personal/educational use only.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How does licensing work for teams?</h3>
                <p className="text-muted-foreground text-sm">
                  Each team member needs their own license. Enterprise plans offer bulk licensing discounts 
                  and centralized user management for organizations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Need help choosing the right license? 
          </p>
          <Button variant="outline" asChild>
            <Link to="/contact">
              Contact Sales Team
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
