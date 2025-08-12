import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Wind, Eye, EyeOff, Music, Phone, Shield, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// OAuth Configuration
const GOOGLE_CLIENT_ID =
  "1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com";
const APPLE_CLIENT_ID = "com.windharmony.musicapp";

// Declare Google APIs
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (config: any) => void;
        signIn: () => Promise<any>;
      };
    };
  }
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<"form" | "otp">("form");
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(
    null,
  );
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    // Exactly 8 digits
    if (password.length !== 8) {
      errors.push("Password must be exactly 8 characters");
    }

    // Strong password requirements
    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Must contain at least one special character");
    }

    return errors;
  };

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    setPasswordErrors(validatePassword(password));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (loginMethod === "email" && !formData.email) {
      setError("Please enter your email address");
      return;
    }

    if (loginMethod === "mobile") {
      if (!formData.mobile) {
        setError("Please enter your mobile number");
        return;
      }
      if (formData.mobile.length !== 10) {
        setError("Mobile number must be exactly 10 digits");
        return;
      }
    }

    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    // Validate password
    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setError(
        "Password does not meet requirements: " +
          passwordValidationErrors.join(", "),
      );
      return;
    }

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("currentOTP", otp);
    localStorage.setItem("otpExpiry", (Date.now() + 10 * 60 * 1000).toString()); // 10 minutes

    const identifier =
      loginMethod === "email" ? formData.email : formData.mobile;
    console.log("Generated OTP:", otp, "for:", identifier);
    setCurrentStep("otp");

    // In real app, you would send OTP via email/SMS service
    alert(`OTP sent to ${identifier}\\nOTP: ${otp} (For demo purposes)`);
  };

  const handleOtpSubmit = () => {
    if (otpValue.length === 6) {
      setIsVerifying(true);

      // Verify OTP
      const storedOTP = localStorage.getItem("currentOTP");
      const otpExpiry = localStorage.getItem("otpExpiry");

      setTimeout(() => {
        setIsVerifying(false);

        if (!storedOTP || !otpExpiry || Date.now() > parseInt(otpExpiry)) {
          setError("OTP has expired. Please request a new one.");
          setCurrentStep("form");
          return;
        }

        if (otpValue === storedOTP) {
          // Clear OTP from storage
          localStorage.removeItem("currentOTP");
          localStorage.removeItem("otpExpiry");

          // Store login status
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", formData.email || formData.mobile);

          // Redirect to dashboard
          window.location.href = "/workspace";
        } else {
          setError("Invalid OTP. Please try again.");
          setOtpValue("");
        }
      }, 2000);
    }
  };

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    // Load Google Identity Services
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.head.appendChild(script);
    } else {
      initializeGoogleAuth();
    }

    // Load Apple ID script
    if (!window.AppleID) {
      const appleScript = document.createElement("script");
      appleScript.src =
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      appleScript.async = true;
      appleScript.onload = () => {
        if (window.AppleID) {
          window.AppleID.auth.init({
            clientId: APPLE_CLIENT_ID,
            scope: "name email",
            redirectURI: window.location.origin + "/auth/apple/callback",
            usePopup: true,
          });
        }
      };
      document.head.appendChild(appleScript);
    }
  }, []);

  const handleGoogleCallback = (response: any) => {
    setOauthLoading("google");
    setError("");

    try {
      // Decode JWT token
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split(".")[1]));

      console.log("Google login successful:", payload);

      // Simulate API call to backend
      setTimeout(() => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            provider: "google",
          }),
        );

        setOauthLoading(null);
        window.location.href = "/workspace";
      }, 1500);
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
      setOauthLoading(null);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    if (window.google) {
      setOauthLoading("google");
      window.google.accounts.id.prompt();
    } else {
      setError("Google login not available. Please refresh the page.");
    }
  };

  const handleAppleLogin = async () => {
    setError("");
    setOauthLoading("apple");

    try {
      if (window.AppleID) {
        const response = await window.AppleID.auth.signIn();

        console.log("Apple login successful:", response);

        // Process Apple response
        const user = {
          id: response.authorization.id_token
            ? JSON.parse(atob(response.authorization.id_token.split(".")[1]))
                .sub
            : "apple_" + Date.now(),
          name: response.user?.name
            ? `${response.user.name.firstName} ${response.user.name.lastName}`
            : "Apple User",
          email: response.user?.email || "apple.user@private.com",
          provider: "apple",
        };

        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          setOauthLoading(null);
          window.location.href = "/workspace";
        }, 1500);
      } else {
        throw new Error("Apple ID not initialized");
      }
    } catch (error) {
      console.error("Apple login error:", error);
      setError("Apple login failed. Please try again.");
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 text-2xl font-bold"
          >
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
              {currentStep === "form" ? "Welcome back" : "Verify your identity"}
            </CardTitle>
            <CardDescription className="text-base">
              {currentStep === "form"
                ? "Sign in to your WindHarmony account"
                : `Enter the 6-digit code sent to ${loginMethod === "email" ? formData.email : formData.mobile}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === "form" && (
              <>
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-left justify-start space-x-3"
                    size="lg"
                    onClick={handleGoogleLogin}
                    disabled={oauthLoading === "google"}
                  >
                    {oauthLoading === "google" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    <span>
                      {oauthLoading === "google"
                        ? "Signing in with Google..."
                        : "Continue with Google"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-left justify-start space-x-3"
                    size="lg"
                    onClick={handleAppleLogin}
                    disabled={oauthLoading === "apple"}
                  >
                    {oauthLoading === "apple" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    )}
                    <span>
                      {oauthLoading === "apple"
                        ? "Signing in with Apple..."
                        : "Continue with Apple"}
                    </span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                {/* Login Method Toggle */}
                <div className="flex space-x-2 p-1 bg-muted rounded-lg">
                  <Button
                    type="button"
                    variant={loginMethod === "email" ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setLoginMethod("email")}
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === "mobile" ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setLoginMethod("mobile")}
                  >
                    Mobile
                  </Button>
                </div>
              </>
            )}

            {currentStep === "form" && (
              /* Login Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={loginMethod} className="text-sm font-medium">
                    {loginMethod === "email"
                      ? "Email or username"
                      : "Mobile number"}
                  </Label>
                  {loginMethod === "email" ? (
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email or username"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="h-12 border-border/50 focus:border-primary"
                      required
                    />
                  ) : (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="1234567890 (10 digits only)"
                        value={formData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove all non-digits
                          if (value.length <= 10) {
                            setFormData((prev) => ({
                              ...prev,
                              mobile: value,
                            }));
                          }
                        }}
                        className="h-12 border-border/50 focus:border-primary pl-10"
                        maxLength={10}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
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
                </div>

                {/* Password validation feedback */}
                {formData.password && passwordErrors.length > 0 && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <div className="text-sm">
                        <p className="font-medium mb-1">
                          Password Requirements:
                        </p>
                        <ul className="text-xs space-y-1">
                          {passwordErrors.map((error, index) => (
                            <li key={index} className="text-red-600">
                              • {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-border"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  size="lg"
                >
                  Send verification code
                </Button>
              </form>
            )}

            {currentStep === "otp" && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
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
                    {isVerifying ? "Verifying..." : "Verify & Sign In"}
                  </Button>

                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep("form")}
                    >
                      Back
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Generate and store new OTP
                        const newOtp = Math.floor(
                          100000 + Math.random() * 900000,
                        ).toString();
                        localStorage.setItem("currentOTP", newOtp);
                        localStorage.setItem(
                          "otpExpiry",
                          (Date.now() + 10 * 60 * 1000).toString(),
                        );

                        const identifier =
                          loginMethod === "email"
                            ? formData.email
                            : formData.mobile;
                        console.log("Resent OTP:", newOtp, "for:", identifier);

                        // Clear current OTP input
                        setOtpValue("");
                        setError("");

                        alert(
                          `New OTP sent to ${identifier}\\nOTP: ${newOtp} (For demo purposes)`,
                        );
                      }}
                    >
                      Resend code
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "form" && (
              <>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up for WindHarmony
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {currentStep === "form" && (
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="underline hover:text-foreground">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-foreground">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
