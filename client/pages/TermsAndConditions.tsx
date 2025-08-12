import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Scale, Shield, Clock, AlertCircle } from 'lucide-react';

interface TermsSection {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export default function TermsAndConditions() {
  const [termsData, setTermsData] = useState<TermsSection[]>([
    {
      id: 'introduction',
      title: 'Introduction',
      content: 'Welcome to WindHarmony. These Terms and Conditions govern your use of our wind instrument music creation platform. By accessing or using our service, you agree to be bound by these terms.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      content: 'To access our premium features, you must create an account with accurate information. You are responsible for maintaining the security of your account credentials and all activities under your account.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      content: 'You may use WindHarmony for lawful purposes only. You agree not to use the service to create, upload, or share content that is illegal, harmful, or infringes on others\' rights.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'subscription',
      title: 'Subscription and Payment',
      content: 'Premium features require a paid subscription. Subscriptions auto-renew unless cancelled. Refunds are provided according to our refund policy. All payments are processed securely.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      content: 'WindHarmony and its content are protected by copyright and other intellectual property laws. Users retain rights to their original compositions while granting us limited rights to provide the service.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'privacy',
      title: 'Privacy and Data',
      content: 'We collect and process your data according to our Privacy Policy. We implement appropriate security measures to protect your personal information and musical creations.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      content: 'WindHarmony is provided "as is" without warranties. Our liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'termination',
      title: 'Termination',
      content: 'Either party may terminate the agreement at any time. Upon termination, your access to the service will cease, though certain provisions will survive termination.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      content: 'We may update these terms periodically. Significant changes will be communicated to users. Continued use of the service after changes constitutes acceptance of the new terms.',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'contact',
      title: 'Contact Information',
      content: 'For questions about these Terms and Conditions, please contact our support team through the admin panel or your account settings.',
      lastUpdated: new Date().toISOString()
    }
  ]);

  const [effectiveDate, setEffectiveDate] = useState(new Date().toLocaleDateString());

  // Load admin-managed content from localStorage
  useEffect(() => {
    const adminTermsContent = localStorage.getItem('adminTermsContent');
    if (adminTermsContent) {
      try {
        const parsedContent = JSON.parse(adminTermsContent);
        if (parsedContent.sections && Array.isArray(parsedContent.sections)) {
          setTermsData(parsedContent.sections);
        }
        if (parsedContent.effectiveDate) {
          setEffectiveDate(parsedContent.effectiveDate);
        }
      } catch (error) {
        console.error('Failed to load admin terms content:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/20 p-4 rounded-full mr-4">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Terms and Conditions
              </h1>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Effective Date: {effectiveDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                <span>WindHarmony Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">
                  Please Read Carefully
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  These Terms and Conditions constitute a legal agreement between you and WindHarmony. 
                  By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {termsData.map((section, index) => (
            <Card key={section.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
                {section.lastUpdated && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Last updated: {new Date(section.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Questions or Concerns?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                If you have any questions about these Terms and Conditions or need clarification on any section, 
                please don't hesitate to contact our support team.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button variant="outline" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
