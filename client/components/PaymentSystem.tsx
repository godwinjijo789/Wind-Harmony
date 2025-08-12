import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CreditCard,
  Shield,
  CheckCircle,
  Crown,
  DollarSign,
  Lock,
  Calendar,
  Banknote,
  AlertCircle,
  Smartphone,
  Wifi,
  Globe
} from 'lucide-react';

interface PaymentSystemProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: 'professional' | 'enterprise';
  currentUserType?: 'free' | 'trial' | 'licensed';
  onPaymentSuccess?: (plan: string, transactionId: string) => void;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  swiftCode: string;
}

interface PaymentDetails {
  email: string;
  fullName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function PaymentSystem({ 
  isOpen, 
  onClose, 
  selectedPlan = 'professional', 
  currentUserType = 'trial',
  onPaymentSuccess 
}: PaymentSystemProps) {
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'crypto' | 'paytm' | 'upi' | 'netbanking'>('card');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    email: '',
    fullName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  // Admin bank details for payment processing
  const adminBankDetails: BankDetails = {
    accountName: 'WindHarmony Music Platform LLC',
    accountNumber: '****-****-****-4521',
    routingNumber: '123456789',
    bankName: 'First National Bank',
    swiftCode: 'FNBMUS33'
  };

  const plans = {
    professional: {
      name: 'Professional',
      price: 29,
      duration: 'month',
      features: [
        'All premium instruments',
        'Unlimited projects',
        'Real-time collaboration',
        'Voice beautifying AI',
        'Export to multiple formats',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 99,
      duration: 'month',
      features: [
        'Everything in Professional',
        'Custom branding',
        'Admin dashboard',
        'Advanced analytics',
        'Dedicated support',
        'Custom integrations',
        'SSO authentication'
      ]
    }
  };

  const selectedPlanDetails = plans[selectedPlan];

  const handlePayment = async () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const transactionId = 'TXN-' + Date.now().toString();
      
      // Save payment details to localStorage (in real app, this would go to secure backend)
      const paymentRecord = {
        transactionId,
        plan: selectedPlan,
        amount: selectedPlanDetails.price,
        paymentMethod,
        userDetails: paymentDetails,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      const existingPayments = JSON.parse(localStorage.getItem('paymentRecords') || '[]');
      existingPayments.push(paymentRecord);
      localStorage.setItem('paymentRecords', JSON.stringify(existingPayments));
      
      console.log('Payment processed:', paymentRecord);
      
      setStep('success');
      
      if (onPaymentSuccess) {
        onPaymentSuccess(selectedPlan, transactionId);
      }
    }, 3000);
  };

  const updatePaymentDetail = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Upgrade Your License
          </DialogTitle>
          <DialogDescription>
            Choose your plan and complete the payment process
          </DialogDescription>
        </DialogHeader>

        {step === 'plan' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(plans).map(([key, plan]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === key ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setStep('payment')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {key === 'enterprise' ? <Crown className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                        {plan.name}
                      </CardTitle>
                      {key === selectedPlan && <Badge>Selected</Badge>}
                    </div>
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-lg font-normal text-muted-foreground">/{plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4">
                      Select {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            {/* Plan Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedPlanDetails.name} Plan</h3>
                    <p className="text-sm text-muted-foreground">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${selectedPlanDetails.price}</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="h-16 flex-col"
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-xs">Credit/Debit Card</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('upi')}
                    className="h-16 flex-col"
                  >
                    <Smartphone className="h-5 w-5 mb-1" />
                    <span className="text-xs">UPI</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'paytm' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('paytm')}
                    className="h-16 flex-col"
                  >
                    <Wifi className="h-5 w-5 mb-1" />
                    <span className="text-xs">Paytm</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'netbanking' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('netbanking')}
                    className="h-16 flex-col"
                  >
                    <Globe className="h-5 w-5 mb-1" />
                    <span className="text-xs">Net Banking</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('bank')}
                    className="h-16 flex-col"
                  >
                    <Banknote className="h-5 w-5 mb-1" />
                    <span className="text-xs">Bank Transfer</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('crypto')}
                    className="h-16 flex-col"
                  >
                    <DollarSign className="h-5 w-5 mb-1" />
                    <span className="text-xs">Cryptocurrency</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            {paymentMethod === 'card' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={paymentDetails.email}
                        onChange={(e) => updatePaymentDetail('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={paymentDetails.fullName}
                        onChange={(e) => updatePaymentDetail('fullName', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input
                      value={paymentDetails.cardNumber}
                      onChange={(e) => updatePaymentDetail('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Month</Label>
                      <Select value={paymentDetails.expiryMonth} onValueChange={(value) => updatePaymentDetail('expiryMonth', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 12}, (_, i) => (
                            <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                              {String(i+1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry Year</Label>
                      <Select value={paymentDetails.expiryYear} onValueChange={(value) => updatePaymentDetail('expiryYear', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 10}, (_, i) => (
                            <SelectItem key={2024+i} value={String(2024+i)}>
                              {2024+i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input
                        value={paymentDetails.cvv}
                        onChange={(e) => updatePaymentDetail('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Billing Address</h4>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={paymentDetails.billingAddress}
                        onChange={(e) => updatePaymentDetail('billingAddress', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={paymentDetails.city}
                          onChange={(e) => updatePaymentDetail('city', e.target.value)}
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          value={paymentDetails.state}
                          onChange={(e) => updatePaymentDetail('state', e.target.value)}
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input
                          value={paymentDetails.zipCode}
                          onChange={(e) => updatePaymentDetail('zipCode', e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select value={paymentDetails.country} onValueChange={(value) => updatePaymentDetail('country', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'bank' && (
              <Card>
                <CardHeader>
                  <CardTitle>Bank Transfer Details</CardTitle>
                  <CardDescription>Transfer funds to our business account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Banknote className="h-4 w-4" />
                    <AlertDescription>
                      Please transfer ${selectedPlanDetails.price} to the account below and include your email as reference.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Account Name</Label>
                        <p className="text-sm">{adminBankDetails.accountName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Bank Name</Label>
                        <p className="text-sm">{adminBankDetails.bankName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Account Number</Label>
                        <p className="text-sm font-mono">{adminBankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Routing Number</Label>
                        <p className="text-sm font-mono">{adminBankDetails.routingNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">SWIFT Code</Label>
                        <p className="text-sm font-mono">{adminBankDetails.swiftCode}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Amount</Label>
                        <p className="text-sm font-bold">${selectedPlanDetails.price} USD</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Your Email (for confirmation)</Label>
                    <Input
                      type="email"
                      value={paymentDetails.email}
                      onChange={(e) => updatePaymentDetail('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'upi' && (
              <Card>
                <CardHeader>
                  <CardTitle>UPI Payment</CardTitle>
                  <CardDescription>Pay using any UPI app like GPay, PhonePe, Paytm</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Smartphone className="h-4 w-4" />
                    <AlertDescription>
                      You'll be redirected to your UPI app to complete the payment of ₹{selectedPlanDetails.price * 75}.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>UPI ID (Optional)</Label>
                    <Input
                      placeholder="yourname@paytm / yourname@phonepe"
                      value={paymentDetails.email}
                      onChange={(e) => updatePaymentDetail('email', e.target.value)}
                    />
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Supported UPI Apps</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-green-700">
                      <span>• Google Pay</span>
                      <span>• PhonePe</span>
                      <span>• Paytm</span>
                      <span>• BHIM</span>
                      <span>• Amazon Pay</span>
                      <span>• And more...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'paytm' && (
              <Card>
                <CardHeader>
                  <CardTitle>Paytm Payment</CardTitle>
                  <CardDescription>Pay securely with your Paytm wallet or linked bank account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Wifi className="h-4 w-4" />
                    <AlertDescription>
                      You'll be redirected to Paytm to complete the payment of ₹{selectedPlanDetails.price * 75}.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={paymentDetails.fullName}
                      onChange={(e) => updatePaymentDetail('fullName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={paymentDetails.email}
                      onChange={(e) => updatePaymentDetail('email', e.target.value)}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Paytm Payment Options</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <p>• Paytm Wallet</p>
                      <p>• Linked Bank Account</p>
                      <p>• Credit/Debit Cards</p>
                      <p>• UPI via Paytm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'netbanking' && (
              <Card>
                <CardHeader>
                  <CardTitle>Net Banking</CardTitle>
                  <CardDescription>Pay directly from your bank account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      You'll be redirected to your bank's secure website to complete the payment.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>Select Your Bank</Label>
                    <Select value={paymentDetails.cardNumber} onValueChange={(value) => updatePaymentDetail('cardNumber', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sbi">State Bank of India</SelectItem>
                        <SelectItem value="hdfc">HDFC Bank</SelectItem>
                        <SelectItem value="icici">ICICI Bank</SelectItem>
                        <SelectItem value="axis">Axis Bank</SelectItem>
                        <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                        <SelectItem value="pnb">Punjab National Bank</SelectItem>
                        <SelectItem value="canara">Canara Bank</SelectItem>
                        <SelectItem value="bob">Bank of Baroda</SelectItem>
                        <SelectItem value="union">Union Bank</SelectItem>
                        <SelectItem value="other">Other Banks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Holder Name</Label>
                    <Input
                      value={paymentDetails.fullName}
                      onChange={(e) => updatePaymentDetail('fullName', e.target.value)}
                      placeholder="As per bank records"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email for Receipt</Label>
                    <Input
                      type="email"
                      value={paymentDetails.email}
                      onChange={(e) => updatePaymentDetail('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === 'crypto' && (
              <Card>
                <CardHeader>
                  <CardTitle>Cryptocurrency Payment</CardTitle>
                  <CardDescription>Pay with Bitcoin, Ethereum, or other cryptocurrencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Cryptocurrency payments are processed through our secure partner. You'll be redirected to complete the payment.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={paymentDetails.email}
                      onChange={(e) => updatePaymentDetail('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('plan')}>
                Back to Plans
              </Button>
              <Button onClick={handlePayment} className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Complete Payment - ${selectedPlanDetails.price}
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <h3 className="text-lg font-semibold">Processing Payment...</h3>
            <p className="text-muted-foreground">Please wait while we process your payment securely</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-12 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Welcome to WindHarmony {selectedPlanDetails.name}! Your account has been upgraded.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 justify-center">
                <Crown className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {selectedPlanDetails.name} License Activated
                </span>
              </div>
            </div>
            <Button onClick={onClose} className="mt-4">
              Continue to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
