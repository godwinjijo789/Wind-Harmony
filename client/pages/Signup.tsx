import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Wind, Eye, EyeOff, Music, Check, Phone, Shield, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// OAuth Configuration
const GOOGLE_CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';
const APPLE_CLIENT_ID = 'com.windharmony.musicapp';

// Declare global types for OAuth
declare global {
  interface Window {
    google?: any;
    AppleID?: any;
  }
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'otp' | 'trial'>('form');
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    marketingEmails: true
  });
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send OTP to mobile number
    console.log('Sending OTP to:', formData.mobile);
    setCurrentStep('otp');
  };

  const handleOtpSubmit = () => {
    if (otpValue.length === 6) {
      setIsVerifying(true);
      // Simulate OTP verification
      setTimeout(() => {
        setIsVerifying(false);
        setCurrentStep('trial');
      }, 2000);
    }
  };

  const handleStartTrial = () => {
    console.log('Starting trial for user:', formData);
    // Redirect to dashboard with trial license
    window.location.href = '/dashboard?trial=true';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains a number', met: /\d/.test(formData.password) },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
  ];

  // Initialize OAuth
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    };

    // Load Google Identity Services
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.head.appendChild(script);
    } else {
      initializeGoogleAuth();
    }

    // Load Apple ID script
    if (!window.AppleID) {
      const appleScript = document.createElement('script');
      appleScript.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      appleScript.async = true;
      appleScript.onload = () => {
        if (window.AppleID) {
          window.AppleID.auth.init({
            clientId: APPLE_CLIENT_ID,
            scope: 'name email',
            redirectURI: window.location.origin + '/auth/apple/callback',
            usePopup: true
          });
        }
      };
      document.head.appendChild(appleScript);
    }
  }, []);

  const handleGoogleCallback = (response: any) => {
    setOauthLoading('google');
    setError('');

    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));

      console.log('Google signup successful:', payload);

      setFormData({
        email: payload.email || '',
        username: payload.name || '',
        mobile: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: true,
        marketingEmails: true
      });

      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          provider: 'google',
          trial: true,
          trialEnds: Date.now() + 24 * 60 * 60 * 1000
        }));

        setOauthLoading(null);
        setCurrentStep('trial');
      }, 1500);
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Google signup failed. Please try again.');
      setOauthLoading(null);
    }
  };

  const handleGoogleSignup = () => {
    setError('');
    if (window.google) {
      setOauthLoading('google');
      window.google.accounts.id.prompt();
    } else {
      setError('Google signup not available. Please refresh the page.');
    }
  };

  const handleAppleSignup = async () => {
    setError('');
    setOauthLoading('apple');

    try {
      if (window.AppleID) {
        const response = await window.AppleID.auth.signIn();

        console.log('Apple signup successful:', response);

        const user = {
          id: response.authorization.id_token ? JSON.parse(atob(response.authorization.id_token.split('.')[1])).sub : 'apple_' + Date.now(),
          name: response.user?.name ? `${response.user.name.firstName} ${response.user.name.lastName}` : 'Apple User',
          email: response.user?.email || 'apple.user@private.com',
          provider: 'apple',
          trial: true,
          trialEnds: Date.now() + 24 * 60 * 60 * 1000
        };

        setFormData({
          email: user.email,
          username: user.name,
          mobile: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: true,
          marketingEmails: true
        });

        localStorage.setItem('user', JSON.stringify(user));

        setTimeout(() => {
          setOauthLoading(null);
          setCurrentStep('trial');
        }, 1500);
      } else {
        throw new Error('Apple ID not initialized');
      }
    } catch (error) {
      console.error('Apple signup error:', error);
      setError('Apple signup failed. Please try again.');
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 text-2xl font-bold">
            <div className="bg-primary/20 p-3 rounded-full">
              <Wind className="h-8 w-8 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WindHarmony
            </span>
          </Link>
        </div>

        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold">
              {currentStep === 'form' && 'Sign up for free'}
              {currentStep === 'otp' && 'Verify your number'}
              {currentStep === 'trial' && 'Start your trial'}
            </CardTitle>
            <CardDescription className="text-base">
              {currentStep === 'form' && 'Start creating wind instrument music today'}
              {currentStep === 'otp' && `Enter the 6-digit code sent to ${formData.mobile}`}
              {currentStep === 'trial' && 'Get instant access with a 1-day free trial'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 'form' && (
              <>
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Social Signup Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-left justify-start space-x-3"
                    size="lg"
                    onClick={handleGoogleSignup}
                    disabled={oauthLoading === 'google'}
                  >
                    {oauthLoading === 'google' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    <span>
                      {oauthLoading === 'google' ? 'Signing up with Google...' : 'Sign up with Google'}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-left justify-start space-x-3"
                    size="lg"
                    onClick={handleAppleSignup}
                    disabled={oauthLoading === 'apple'}
                  >
                    {oauthLoading === 'apple' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    )}
                    <span>
                      {oauthLoading === 'apple' ? 'Signing up with Apple...' : 'Sign up with Apple'}
                    </span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
              </>
            )}

            {currentStep === 'form' && (
              /* Signup Form */
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  What's your email?
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Create a username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter a username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="h-12 border-border/50 focus:border-primary"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This appears on your profile.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium">
                  Mobile number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="h-12 border-border/50 focus:border-primary pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send you a verification code via SMS. Both email and mobile number are required.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Create a password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 border-border/50 focus:border-primary pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1 mt-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <Check 
                          className={`h-3 w-3 ${req.met ? 'text-green-500' : 'text-muted-foreground'}`} 
                        />
                        <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="rounded border-border"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      WindHarmony Terms and Conditions of Use
                    </Link>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="marketing"
                    type="checkbox"
                    checked={formData.marketingEmails}
                    onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="marketing" className="text-sm text-muted-foreground">
                    I would like to receive news and offers from WindHarmony
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                size="lg"
                disabled={!formData.agreeToTerms || !formData.mobile || !formData.email || !formData.username || !formData.password}
              >
                Send SMS verification code
              </Button>
            </form>
            )}

            {currentStep === 'otp' && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-4">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={(value) => setOtpValue(value)}
                    onComplete={handleOtpSubmit}
                  />

                  <Button
                    onClick={handleOtpSubmit}
                    className="w-full h-12"
                    disabled={otpValue.length !== 6 || isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                  </Button>

                  <Button variant="ghost" className="text-sm">
                    Resend code
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'trial' && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">1-Day Free Trial</h3>
                    <p className="text-sm text-muted-foreground">
                      Try all premium wind instruments and collaboration features.
                      No payment required until trial ends.
                    </p>
                  </div>

                  <ul className="text-sm space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>All instrument categories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Voice & non-voice options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Collaborative workspace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Premium sound quality</span>
                    </li>
                  </ul>

                  <Button
                    onClick={handleStartTrial}
                    className="w-full h-12 bg-green-600 hover:bg-green-700"
                  >
                    Start Free Trial
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Trial automatically expires after 1 day.
                    Upgrade to a license for continued access.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'form' && (
              <>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Log in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {currentStep === 'form' && (
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our{' '}
              <a href="#" className="underline hover:text-foreground">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
