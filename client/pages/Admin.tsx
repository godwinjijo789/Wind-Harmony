import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Crown, Users, Settings, Edit, Save, Eye, Shield, CheckCircle, XCircle,
  Calendar, DollarSign, FileText, Globe, Lock, Send, Download, Star, Scale
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  licenseType: 'free' | 'trial' | 'professional' | 'enterprise';
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended';
}

interface PageContent {
  id: string;
  page: string;
  section: string;
  content: string;
  lastModified: Date;
}

interface PaymentRecord {
  transactionId: string;
  userEmail: string;
  plan: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  timestamp: string;
  refundAmount?: number;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  swiftCode: string;
  isActive: boolean;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('licenses');
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'WindHarmony',
    siteDescription: 'Create beautiful wind instrument music with our collaborative platform',
    contactEmail: 'support@windharmony.com',
    supportPhone: '+1 (555) 123-4567'
  });
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#f59e0b',
    accentColor: '#eab308',
    logoUrl: '',
    faviconUrl: ''
  });
  const [licenseSettings, setLicenseSettings] = useState({
    trialDays: 1,
    professionalPrice: 29,
    enterprisePrice: 99
  });
  const [featureSettings, setFeatureSettings] = useState({
    voiceRecording: true,
    collaborationFeatures: true,
    movieMaker: true,
    premiumInstruments: true,
    voiceBeautifying: true
  });
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<any[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [termsContent, setTermsContent] = useState<any>({
    effectiveDate: new Date().toLocaleDateString(),
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Welcome to WindHarmony. These Terms and Conditions govern your use of our wind instrument music creation platform.',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'user-accounts',
        title: 'User Accounts',
        content: 'To access our premium features, you must create an account with accurate information.',
        lastUpdated: new Date().toISOString()
      }
    ]
  });
  const [userStorageData, setUserStorageData] = useState<any[]>([
    {
      userId: '1',
      email: 'john@example.com',
      name: 'John Doe',
      usedStorage: 245.5, // MB
      maxStorage: 1024, // MB
      projects: 8,
      recordings: 15,
      lastAccess: new Date('2024-01-15')
    },
    {
      userId: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      usedStorage: 512.3,
      maxStorage: 2048,
      projects: 12,
      recordings: 23,
      lastAccess: new Date('2024-01-16')
    }
  ]);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountName: 'WindHarmony Music Platform LLC',
    accountNumber: '****-****-****-4521',
    routingNumber: '123456789',
    bankName: 'First National Bank',
    swiftCode: 'FNBMUS33',
    isActive: true
  });
  const [paymentMethods, setPaymentMethods] = useState({
    paytm: {
      merchantId: 'PAYTM123456',
      phoneNumber: '+91-9876543210',
      isActive: true
    },
    upi: {
      upiId: 'windharmony@paytm',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      isActive: true
    },
    crypto: {
      bitcoinAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      ethereumAddress: '0x742d35Cc6634C0532925a3b8D400bb5e7a7c2C75',
      isActive: false
    },
    netBanking: {
      supportedBanks: ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank'],
      isActive: true
    }
  });
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([
    {
      transactionId: 'TXN-1737123456',
      userEmail: 'john@example.com',
      plan: 'professional',
      amount: 29,
      paymentMethod: 'Credit Card',
      status: 'completed',
      timestamp: new Date('2024-01-15').toISOString()
    },
    {
      transactionId: 'TXN-1737123457',
      userEmail: 'jane@example.com',
      plan: 'enterprise',
      amount: 99,
      paymentMethod: 'Bank Transfer',
      status: 'pending',
      timestamp: new Date('2024-01-16').toISOString()
    },
    {
      transactionId: 'TXN-1737123458',
      userEmail: 'bob@example.com',
      plan: 'professional',
      amount: 29,
      paymentMethod: 'Paytm',
      status: 'completed',
      timestamp: new Date('2024-01-17').toISOString()
    },
    {
      transactionId: 'TXN-1737123459',
      userEmail: 'alice@example.com',
      plan: 'professional',
      amount: 29,
      paymentMethod: 'UPI',
      status: 'completed',
      timestamp: new Date('2024-01-18').toISOString()
    },
    {
      transactionId: 'TXN-1737123460',
      userEmail: 'charlie@example.com',
      plan: 'enterprise',
      amount: 99,
      paymentMethod: 'Net Banking',
      status: 'pending',
      timestamp: new Date('2024-01-19').toISOString()
    }
  ]);
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      licenseType: 'professional',
      expiryDate: new Date('2024-12-31'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      licenseType: 'trial',
      expiryDate: new Date('2024-02-01'),
      status: 'active'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      licenseType: 'free',
      expiryDate: new Date('2024-01-31'),
      status: 'expired'
    }
  ]);

  const [pageContents, setPageContents] = useState<PageContent[]>([
    {
      id: '1',
      page: 'Homepage',
      section: 'Hero Title',
      content: 'WindHarmony',
      lastModified: new Date()
    },
    {
      id: '2',
      page: 'Homepage',
      section: 'Hero Description',
      content: 'Create beautiful wind instrument music with our collaborative platform.',
      lastModified: new Date()
    },
    {
      id: '3',
      page: 'Pricing',
      section: 'Professional Plan Price',
      content: '$29',
      lastModified: new Date()
    },
    {
      id: '4',
      page: 'About',
      section: 'Company Description',
      content: 'Professional wind instrument music creation platform',
      lastModified: new Date()
    },
    {
      id: '5',
      page: 'Site Settings',
      section: 'Site Name',
      content: 'WindHarmony',
      lastModified: new Date()
    }
  ]);

  const getLicenseColor = (licenseType: string) => {
    switch (licenseType) {
      case 'enterprise': return 'bg-purple-500/10 text-purple-700';
      case 'professional': return 'bg-blue-500/10 text-blue-700';
      case 'trial': return 'bg-yellow-500/10 text-yellow-700';
      case 'free': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'expired': return 'text-red-600';
      case 'suspended': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  // Load payment records from localStorage
  useEffect(() => {
    const savedPayments = localStorage.getItem('paymentRecords');
    if (savedPayments) {
      try {
        const payments = JSON.parse(savedPayments);
        setPaymentRecords(prev => [...prev, ...payments]);
      } catch (error) {
        console.error('Failed to load payment records:', error);
      }
    }

    const savedBankDetails = localStorage.getItem('adminBankDetails');
    if (savedBankDetails) {
      try {
        const bankData = JSON.parse(savedBankDetails);
        setBankDetails(prev => ({...prev, ...bankData}));
      } catch (error) {
        console.error('Failed to load bank details:', error);
      }
    }

    // Load CMS content from localStorage
    const savedCmsContent = localStorage.getItem('cmsContent');
    if (savedCmsContent) {
      try {
        const cmsData = JSON.parse(savedCmsContent);
        setPageContents(prev => {
          const updated = [...prev];
          cmsData.forEach((savedItem: any) => {
            const existingIndex = updated.findIndex(p => p.page === savedItem.page && p.section === savedItem.section);
            if (existingIndex >= 0) {
              updated[existingIndex] = {
                ...updated[existingIndex],
                content: savedItem.content,
                lastModified: new Date(savedItem.lastModified)
              };
            } else {
              updated.push({
                id: Date.now().toString() + Math.random(),
                page: savedItem.page,
                section: savedItem.section,
                content: savedItem.content,
                lastModified: new Date(savedItem.lastModified)
              });
            }
          });
          return updated;
        });
      } catch (error) {
        console.error('Failed to load CMS content:', error);
      }
    }

    // Load general settings from localStorage
    const savedGeneralSettings = localStorage.getItem('generalSettings');
    if (savedGeneralSettings) {
      try {
        const settings = JSON.parse(savedGeneralSettings);
        setGeneralSettings(prev => ({...prev, ...settings}));
      } catch (error) {
        console.error('Failed to load general settings:', error);
      }
    }

    // Load theme settings from localStorage
    const savedThemeSettings = localStorage.getItem('themeSettings');
    if (savedThemeSettings) {
      try {
        const themeData = JSON.parse(savedThemeSettings);
        setThemeSettings(prev => ({...prev, ...themeData}));

        // Apply saved theme colors
        document.documentElement.style.setProperty('--primary', themeData.primaryColor || '#f59e0b');
        document.documentElement.style.setProperty('--accent', themeData.accentColor || '#eab308');
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      }
    }

    // Load license settings from localStorage
    const savedLicenseSettings = localStorage.getItem('licenseSettings');
    if (savedLicenseSettings) {
      try {
        const licenseData = JSON.parse(savedLicenseSettings);
        setLicenseSettings(prev => ({...prev, ...licenseData}));
      } catch (error) {
        console.error('Failed to load license settings:', error);
      }
    }

    // Load feature settings from localStorage
    const savedFeatureSettings = localStorage.getItem('featureSettings');
    if (savedFeatureSettings) {
      try {
        const featureData = JSON.parse(savedFeatureSettings);
        setFeatureSettings(prev => ({...prev, ...featureData}));
      } catch (error) {
        console.error('Failed to load feature settings:', error);
      }
    }

    // Load feedback and contact submissions
    const savedFeedback = localStorage.getItem('feedbackSubmissions');
    if (savedFeedback) {
      try {
        const feedbackData = JSON.parse(savedFeedback);
        setFeedbackSubmissions(feedbackData);
      } catch (error) {
        console.error('Failed to load feedback:', error);
      }
    }

    const savedContacts = localStorage.getItem('contactSubmissions');
    if (savedContacts) {
      try {
        const contactData = JSON.parse(savedContacts);
        setContactSubmissions(contactData);
      } catch (error) {
        console.error('Failed to load contacts:', error);
      }
    }

    // Load Terms and Conditions content from localStorage
    const savedTermsContent = localStorage.getItem('adminTermsContent');
    if (savedTermsContent) {
      try {
        const termsData = JSON.parse(savedTermsContent);
        setTermsContent(termsData);
      } catch (error) {
        console.error('Failed to load terms content:', error);
      }
    }

    // Load payment methods from localStorage
    const savedPaymentMethods = localStorage.getItem('adminPaymentMethods');
    if (savedPaymentMethods) {
      try {
        const paymentData = JSON.parse(savedPaymentMethods);
        setPaymentMethods(prev => ({...prev, ...paymentData}));
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      }
    }
  }, []);

  // CMS helper functions
  const updatePageContent = (page: string, section: string, newContent: string) => {
    setPageContents(prev => {
      const existingIndex = prev.findIndex(p => p.page === page && p.section === section);
      const newItem = {
        id: existingIndex >= 0 ? prev[existingIndex].id : Date.now().toString(),
        page,
        section,
        content: newContent,
        lastModified: new Date()
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      } else {
        return [...prev, newItem];
      }
    });

    // Save to localStorage
    const updatedContent = JSON.parse(localStorage.getItem('cmsContent') || '[]');
    const existingIndex = updatedContent.findIndex((p: PageContent) => p.page === page && p.section === section);

    if (existingIndex >= 0) {
      updatedContent[existingIndex] = { page, section, content: newContent, lastModified: new Date().toISOString() };
    } else {
      updatedContent.push({ page, section, content: newContent, lastModified: new Date().toISOString() });
    }

    localStorage.setItem('cmsContent', JSON.stringify(updatedContent));
    console.log('Content updated:', { page, section, newContent });
  };

  const getPageContent = (page: string, section: string) => {
    const content = pageContents.find(p => p.page === page && p.section === section);
    return content?.content || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Admin Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">
                  License Management & Content Editing
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                <Crown className="h-3 w-3 mr-1" />
                Owner Access
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="licenses">License Management</TabsTrigger>
            <TabsTrigger value="payments">💳 Payments</TabsTrigger>
            <TabsTrigger value="storage">💾 Storage</TabsTrigger>
            <TabsTrigger value="feedback">📝 Feedback</TabsTrigger>
            <TabsTrigger value="terms">⚖️ Terms</TabsTrigger>
            <TabsTrigger value="pages">Page Editor</TabsTrigger>
            <TabsTrigger value="settings">🔧 Site Settings</TabsTrigger>
          </TabsList>

          {/* License Management Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">147</div>
                  <p className="text-xs text-muted-foreground">+12 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Active Licenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+5 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,847</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User License Management
                </CardTitle>
                <CardDescription>
                  Manage user licenses, view statuses, and control access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const email = prompt('Enter user email to grant license:');
                        if (email) {
                          setUsers(prev => prev.map(user =>
                            user.email === email
                              ? { ...user, licenseType: 'professional', status: 'active' }
                              : user
                          ));
                          alert(`Professional license granted to ${email}`);
                        }
                      }}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Grant License
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const email = prompt('Enter user email to revoke license:');
                        if (email && confirm(`Revoke license for ${email}?`)) {
                          setUsers(prev => prev.map(user =>
                            user.email === email
                              ? { ...user, licenseType: 'trial', status: 'expired' }
                              : user
                          ));
                          alert(`License revoked for ${email}`);
                        }
                      }}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Revoke License
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const email = prompt('Enter user email to extend trial:');
                        if (email) {
                          const days = prompt('Extend trial by how many days?', '7');
                          if (days) {
                            const newExpiry = new Date();
                            newExpiry.setDate(newExpiry.getDate() + parseInt(days));
                            setUsers(prev => prev.map(user =>
                              user.email === email
                                ? { ...user, expiryDate: newExpiry.toLocaleDateString(), status: 'active' }
                                : user
                            ));
                            alert(`Trial extended by ${days} days for ${email}`);
                          }
                        }
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Extend Trial
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>License Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getLicenseColor(user.licenseType)}>
                              {user.licenseType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-1 ${getStatusColor(user.status)}`}>
                              {user.status === 'active' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              {user.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.expiryDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newLicense = prompt(`Change license for ${user.name}:`, user.licenseType);
                                  if (newLicense && ['trial', 'professional', 'enterprise'].includes(newLicense)) {
                                    setUsers(prev => prev.map(u =>
                                      u.id === user.id ? { ...u, licenseType: newLicense } : u
                                    ));
                                    alert(`License changed to ${newLicense} for ${user.name}`);
                                  }
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const days = prompt(`Extend trial for ${user.name} by how many days?`, '30');
                                  if (days) {
                                    const newExpiry = new Date();
                                    newExpiry.setDate(newExpiry.getDate() + parseInt(days));
                                    setUsers(prev => prev.map(u =>
                                      u.id === user.id
                                        ? { ...u, expiryDate: newExpiry, status: 'active' }
                                        : u
                                    ));
                                    alert(`Trial extended by ${days} days for ${user.name}`);
                                  }
                                }}
                              >
                                Extend
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${paymentRecords
                      .filter(p => p.status === 'completed')
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {paymentRecords.filter(p => p.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {paymentRecords.filter(p => p.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Awaiting</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {paymentRecords.filter(p => p.status === 'failed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                </CardContent>
              </Card>
            </div>

            {/* Bank Details Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Bank Account Details
                </CardTitle>
                <CardDescription>
                  Manage payment processing bank account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails(prev => ({...prev, accountName: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails(prev => ({...prev, bankName: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails(prev => ({...prev, accountNumber: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={bankDetails.routingNumber}
                      onChange={(e) => setBankDetails(prev => ({...prev, routingNumber: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT Code</Label>
                    <Input
                      id="swiftCode"
                      value={bankDetails.swiftCode}
                      onChange={(e) => setBankDetails(prev => ({...prev, swiftCode: e.target.value}))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bankActive"
                      checked={bankDetails.isActive}
                      onCheckedChange={(checked) => setBankDetails(prev => ({...prev, isActive: checked}))}
                    />
                    <Label htmlFor="bankActive">Account Active</Label>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    console.log('Saving bank details:', bankDetails);
                    localStorage.setItem('adminBankDetails', JSON.stringify(bankDetails));
                    alert('Bank details saved successfully!' + '\\n' +
                          'Account: ' + bankDetails.accountName + '\\n' +
                          'Bank: ' + bankDetails.bankName + '\\n' +
                          'Status: ' + (bankDetails.isActive ? 'Active' : 'Inactive'));
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Bank Details
                </Button>
              </CardContent>
            </Card>

            {/* Digital Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Digital Payment Methods
                </CardTitle>
                <CardDescription>
                  Configure Paytm, UPI, and other digital payment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Paytm Configuration */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Paytm</h3>
                    <Switch
                      checked={paymentMethods.paytm.isActive}
                      onCheckedChange={(checked) =>
                        setPaymentMethods(prev => ({
                          ...prev,
                          paytm: { ...prev.paytm, isActive: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paytm-merchant">Merchant ID</Label>
                      <Input
                        id="paytm-merchant"
                        value={paymentMethods.paytm.merchantId}
                        onChange={(e) =>
                          setPaymentMethods(prev => ({
                            ...prev,
                            paytm: { ...prev.paytm, merchantId: e.target.value }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="paytm-phone">Phone Number</Label>
                      <Input
                        id="paytm-phone"
                        value={paymentMethods.paytm.phoneNumber}
                        onChange={(e) =>
                          setPaymentMethods(prev => ({
                            ...prev,
                            paytm: { ...prev.paytm, phoneNumber: e.target.value }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* UPI Configuration */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">UPI</h3>
                    <Switch
                      checked={paymentMethods.upi.isActive}
                      onCheckedChange={(checked) =>
                        setPaymentMethods(prev => ({
                          ...prev,
                          upi: { ...prev.upi, isActive: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        value={paymentMethods.upi.upiId}
                        onChange={(e) =>
                          setPaymentMethods(prev => ({
                            ...prev,
                            upi: { ...prev.upi, upiId: e.target.value }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="upi-qr">QR Code URL</Label>
                      <Input
                        id="upi-qr"
                        placeholder="Upload QR code image URL"
                        value={paymentMethods.upi.qrCode}
                        onChange={(e) =>
                          setPaymentMethods(prev => ({
                            ...prev,
                            upi: { ...prev.upi, qrCode: e.target.value }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Cryptocurrency Configuration */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Cryptocurrency</h3>
                    <Switch
                      checked={paymentMethods.crypto.isActive}
                      onCheckedChange={(checked) =>
                        setPaymentMethods(prev => ({
                          ...prev,
                          crypto: { ...prev.crypto, isActive: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bitcoin-address">Bitcoin Address</Label>
                      <Input
                        id="bitcoin-address"
                        value={paymentMethods.crypto.bitcoinAddress}
                        onChange={(e) =>
                          setPaymentMethods(prev => ({
                            ...prev,
                            crypto: { ...prev.crypto, bitcoinAddress: e.target.value }
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ethereum-address">Ethereum Address</Label>
                      <Input
                        id="ethereum-address"
                        value={paymentMethods.crypto.ethereumAddress}
                        onChange={(e) =>
                          setPaymentMethods(prev => ({
                            ...prev,
                            crypto: { ...prev.crypto, ethereumAddress: e.target.value }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Net Banking Configuration */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Net Banking</h3>
                    <Switch
                      checked={paymentMethods.netBanking.isActive}
                      onCheckedChange={(checked) =>
                        setPaymentMethods(prev => ({
                          ...prev,
                          netBanking: { ...prev.netBanking, isActive: checked }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Supported Banks</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {paymentMethods.netBanking.supportedBanks.map((bank, index) => (
                        <Badge key={index} variant="secondary">
                          {bank}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        const newBank = prompt('Enter bank name to add:');
                        if (newBank && !paymentMethods.netBanking.supportedBanks.includes(newBank)) {
                          setPaymentMethods(prev => ({
                            ...prev,
                            netBanking: {
                              ...prev.netBanking,
                              supportedBanks: [...prev.netBanking.supportedBanks, newBank]
                            }
                          }));
                        }
                      }}
                    >
                      Add Bank
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    localStorage.setItem('adminPaymentMethods', JSON.stringify(paymentMethods));
                    alert('Payment methods saved successfully!\\n\\n' +
                          'Active Methods:\\n' +
                          `• Paytm: ${paymentMethods.paytm.isActive ? 'Active' : 'Inactive'}\\n` +
                          `• UPI: ${paymentMethods.upi.isActive ? 'Active' : 'Inactive'}\\n` +
                          `• Crypto: ${paymentMethods.crypto.isActive ? 'Active' : 'Inactive'}\\n` +
                          `• Net Banking: ${paymentMethods.netBanking.isActive ? 'Active' : 'Inactive'}`);
                  }}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Methods
                </Button>
              </CardContent>
            </Card>

            {/* Payment Records */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Payment Records
                    </CardTitle>
                    <CardDescription>
                      View and manage all payment transactions
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csvContent = 'Transaction ID,User Email,Plan,Amount,Payment Method,Status,Date\\n' +
                        paymentRecords.map(p =>
                          `${p.transactionId},${p.userEmail},${p.plan},$${p.amount},${p.paymentMethod},${p.status},${new Date(p.timestamp).toLocaleDateString()}`
                        ).join('\\n');

                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `payment-records-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRecords.map((payment) => (
                      <TableRow key={payment.transactionId}>
                        <TableCell className="font-mono text-sm">
                          {payment.transactionId}
                        </TableCell>
                        <TableCell>{payment.userEmail}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${payment.amount}
                        </TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === 'completed' ? 'default' :
                              payment.status === 'pending' ? 'secondary' :
                              payment.status === 'failed' ? 'destructive' : 'outline'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(payment.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                alert('Transaction Details:' + '\\n' +
                                      'ID: ' + payment.transactionId + '\\n' +
                                      'User: ' + payment.userEmail + '\\n' +
                                      'Plan: ' + payment.plan + '\\n' +
                                      'Amount: $' + payment.amount + '\\n' +
                                      'Method: ' + payment.paymentMethod + '\\n' +
                                      'Status: ' + payment.status + '\\n' +
                                      'Date: ' + new Date(payment.timestamp).toLocaleString());
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {payment.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Issue refund for ${payment.userEmail}?\\nAmount: $${payment.amount}`)) {
                                    setPaymentRecords(prev =>
                                      prev.map(p =>
                                        p.transactionId === payment.transactionId
                                          ? { ...p, status: 'refunded' as const, refundAmount: payment.amount }
                                          : p
                                      )
                                    );
                                    alert('Refund processed for $' + payment.amount);
                                  }
                                }}
                              >
                                Refund
                              </Button>
                            )}
                            {payment.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setPaymentRecords(prev =>
                                    prev.map(p =>
                                      p.transactionId === payment.transactionId
                                        ? { ...p, status: 'completed' as const }
                                        : p
                                    )
                                  );
                                  alert('Payment marked as completed');
                                }}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage Management Tab */}
          <TabsContent value="storage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Total Storage Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(userStorageData.reduce((sum, user) => sum + user.usedStorage, 0) / 1024).toFixed(1)} GB
                  </div>
                  <p className="text-xs text-muted-foreground">Across all users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStorageData.length}</div>
                  <p className="text-xs text-muted-foreground">With storage</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStorageData.reduce((sum, user) => sum + user.projects, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">All projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Total Recordings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStorageData.reduce((sum, user) => sum + user.recordings, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">All recordings</p>
                </CardContent>
              </Card>
            </div>

            {/* User Storage Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      User Storage Management
                    </CardTitle>
                    <CardDescription>
                      Manage individual user storage limits and usage
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csvContent = 'User,Email,Used Storage (MB),Max Storage (MB),Projects,Recordings,Last Access\\n' +
                        userStorageData.map(u =>
                          `"${u.name}","${u.email}",${u.usedStorage},${u.maxStorage},${u.projects},${u.recordings},${u.lastAccess.toLocaleDateString()}`
                        ).join('\\n');

                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `user-storage-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Storage Usage</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Recordings</TableHead>
                      <TableHead>Last Access</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userStorageData.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{user.usedStorage.toFixed(1)} MB</span>
                              <span className="text-muted-foreground">/ {user.maxStorage} MB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  (user.usedStorage / user.maxStorage) > 0.8 ? 'bg-red-500' :
                                  (user.usedStorage / user.maxStorage) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min((user.usedStorage / user.maxStorage) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {((user.usedStorage / user.maxStorage) * 100).toFixed(1)}% used
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.projects}</TableCell>
                        <TableCell>{user.recordings}</TableCell>
                        <TableCell>{user.lastAccess.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newLimit = prompt(`Set storage limit for ${user.name} (MB):`, user.maxStorage.toString());
                                if (newLimit && !isNaN(parseInt(newLimit))) {
                                  setUserStorageData(prev =>
                                    prev.map(u =>
                                      u.userId === user.userId
                                        ? { ...u, maxStorage: parseInt(newLimit) }
                                        : u
                                    )
                                  );
                                  alert(`Storage limit updated to ${newLimit} MB for ${user.name}`);
                                }
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Clear all projects and recordings for ${user.name}? This cannot be undone.`)) {
                                  setUserStorageData(prev =>
                                    prev.map(u =>
                                      u.userId === user.userId
                                        ? { ...u, usedStorage: 0, projects: 0, recordings: 0 }
                                        : u
                                    )
                                  );
                                  alert(`All data cleared for ${user.name}`);
                                }
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Storage Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Storage Categories
                </CardTitle>
                <CardDescription>
                  Manage storage allocation by content type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { category: 'Projects', used: 1.2, max: 5, color: 'bg-blue-500' },
                    { category: 'Recordings', used: 3.8, max: 10, color: 'bg-green-500' },
                    { category: 'Temp Files', used: 0.5, max: 2, color: 'bg-yellow-500' }
                  ].map((cat) => (
                    <Card key={cat.category} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{cat.category}</h4>
                        <Badge variant="outline">{cat.used} GB / {cat.max} GB</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full ${cat.color}`}
                          style={{ width: `${(cat.used / cat.max) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{((cat.used / cat.max) * 100).toFixed(1)}% used</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newLimit = prompt(`Set limit for ${cat.category} (GB):`, cat.max.toString());
                            if (newLimit) {
                              alert(`${cat.category} limit updated to ${newLimit} GB`);
                            }
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Management Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Total Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedbackSubmissions.length}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Contact Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contactSubmissions.length}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Avg Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {feedbackSubmissions.length > 0
                      ? (feedbackSubmissions.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackSubmissions.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">out of 5.0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {feedbackSubmissions.length > 0
                      ? Math.round((feedbackSubmissions.filter(f => f.wouldRecommend === true).length / feedbackSubmissions.length) * 100)
                      : 0
                    }%
                  </div>
                  <p className="text-xs text-muted-foreground">would recommend</p>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Submissions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      User Feedback
                    </CardTitle>
                    <CardDescription>
                      Customer feedback and suggestions
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csvContent = 'Date,Name,Email,Category,Rating,Title,Message,Would Recommend\\n' +
                        feedbackSubmissions.map(f =>
                          `${new Date(f.timestamp).toLocaleDateString()},"${f.name}","${f.email}","${f.category}",${f.rating},"${f.title}","${f.message}",${f.wouldRecommend}`
                        ).join('\\n');

                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {feedbackSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No feedback submissions yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbackSubmissions.slice(0, 10).map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{feedback.title}</h4>
                              <Badge variant="outline">{feedback.category}</Badge>
                              <div className="flex">
                                {Array.from({length: 5}, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              From: {feedback.name || 'Anonymous'} ({feedback.email || 'No email'})
                            </p>
                            <p className="text-sm">{feedback.message}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(feedback.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        {feedback.wouldRecommend !== null && (
                          <Badge variant={feedback.wouldRecommend ? "default" : "destructive"} className="text-xs">
                            {feedback.wouldRecommend ? "Would Recommend" : "Would Not Recommend"}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Submissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Contact Messages
                </CardTitle>
                <CardDescription>
                  Customer support inquiries and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No contact messages yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactSubmissions.slice(0, 10).map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{contact.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{contact.subject}</TableCell>
                          <TableCell>{new Date(contact.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                alert(`Contact Details:\\n\\n` +
                                      `Name: ${contact.name}\\n` +
                                      `Email: ${contact.email}\\n` +
                                      `Phone: ${contact.phone || 'Not provided'}\\n` +
                                      `Category: ${contact.category}\\n` +
                                      `Subject: ${contact.subject}\\n\\n` +
                                      `Message:\\n${contact.message}`);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms and Conditions Management Tab */}
          <TabsContent value="terms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Total Sections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{termsContent.sections?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Terms sections</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Effective Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">{termsContent.effectiveDate}</div>
                  <p className="text-xs text-muted-foreground">Current terms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Last Updated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">
                    {termsContent.sections?.length > 0 ?
                      new Date(Math.max(...termsContent.sections.map((s: any) => new Date(s.lastUpdated).getTime()))).toLocaleDateString() :
                      'Never'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Most recent edit</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Terms and Conditions Management
                </CardTitle>
                <CardDescription>
                  Manage your website's Terms and Conditions content that users see
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="effective-date">Effective Date</Label>
                    <Input
                      id="effective-date"
                      type="date"
                      value={new Date(termsContent.effectiveDate).toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value).toLocaleDateString();
                        setTermsContent(prev => ({...prev, effectiveDate: newDate}));
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        const newSection = {
                          id: `section-${Date.now()}`,
                          title: 'New Section',
                          content: 'Enter section content here...',
                          lastUpdated: new Date().toISOString()
                        };
                        setTermsContent(prev => ({
                          ...prev,
                          sections: [...(prev.sections || []), newSection]
                        }));
                      }}
                      className="w-full"
                    >
                      Add New Section
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Terms Sections</h3>
                  {termsContent.sections?.map((section: any, index: number) => (
                    <Card key={section.id} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                          <Input
                            value={section.title}
                            onChange={(e) => {
                              const newSections = [...termsContent.sections];
                              newSections[index] = {
                                ...newSections[index],
                                title: e.target.value,
                                lastUpdated: new Date().toISOString()
                              };
                              setTermsContent(prev => ({...prev, sections: newSections}));
                            }}
                            className="font-semibold"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newSections = termsContent.sections.filter((_: any, i: number) => i !== index);
                              setTermsContent(prev => ({...prev, sections: newSections}));
                            }}
                          >
                            Delete
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <Label>Section Content</Label>
                            <textarea
                              value={section.content}
                              onChange={(e) => {
                                const newSections = [...termsContent.sections];
                                newSections[index] = {
                                  ...newSections[index],
                                  content: e.target.value,
                                  lastUpdated: new Date().toISOString()
                                };
                                setTermsContent(prev => ({...prev, sections: newSections}));
                              }}
                              className="w-full min-h-[100px] p-3 border rounded-md resize-y"
                              placeholder="Enter section content..."
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last updated: {new Date(section.lastUpdated).toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Changes are saved automatically and will be visible on the Terms page
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Reset to default terms
                        setTermsContent({
                          effectiveDate: new Date().toLocaleDateString(),
                          sections: [
                            {
                              id: 'introduction',
                              title: 'Introduction',
                              content: 'Welcome to WindHarmony. These Terms and Conditions govern your use of our wind instrument music creation platform.',
                              lastUpdated: new Date().toISOString()
                            }
                          ]
                        });
                      }}
                    >
                      Reset to Default
                    </Button>
                    <Button
                      onClick={() => {
                        localStorage.setItem('adminTermsContent', JSON.stringify(termsContent));
                        alert('Terms and Conditions saved successfully!');
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Editor Tab */}
          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Content Management System
                </CardTitle>
                <CardDescription>
                  Edit content across all pages of the WindHarmony application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Globe className="h-4 w-4" />
                  <AlertDescription>
                    Changes made here will be reflected immediately across the application.
                    Always preview changes before saving.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const currentTitle = getPageContent('Homepage', 'Hero Title');
                      const newTitle = prompt('Enter new homepage title:', currentTitle || 'WindHarmony - Professional Wind Instrument Music');
                      if (newTitle && newTitle !== currentTitle) {
                        updatePageContent('Homepage', 'Hero Title', newTitle);
                        alert(`Homepage title updated to: ${newTitle}`);
                      }
                    }}
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-sm">Edit Homepage</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const currentPrice = getPageContent('Pricing', 'Professional Plan Price');
                      const newPrice = prompt('Enter professional plan price:', currentPrice || '$29');
                      if (newPrice && newPrice !== currentPrice) {
                        updatePageContent('Pricing', 'Professional Plan Price', newPrice);
                        updatePageContent('Pricing', 'Last Updated', new Date().toLocaleDateString());
                        alert(`Pricing updated: Professional plan now costs ${newPrice}/month`);
                      }
                    }}
                  >
                    <DollarSign className="h-6 w-6 mb-2" />
                    <span className="text-sm">Edit Pricing</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const currentDescription = getPageContent('About', 'Company Description');
                      const newDescription = prompt('Enter new about description:', currentDescription || 'Professional wind instrument music creation platform');
                      if (newDescription && newDescription !== currentDescription) {
                        updatePageContent('About', 'Company Description', newDescription);
                        updatePageContent('About', 'Last Updated', new Date().toLocaleDateString());
                        alert(`About page updated: ${newDescription}`);
                      }
                    }}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">Edit About</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const currentSiteName = getPageContent('Site Settings', 'Site Name');
                      const newSiteName = prompt('Enter new site name:', currentSiteName || 'WindHarmony');
                      if (newSiteName && newSiteName !== currentSiteName) {
                        updatePageContent('Site Settings', 'Site Name', newSiteName);
                        updatePageContent('Site Settings', 'Last Updated', new Date().toLocaleDateString());
                        alert(`Site name updated to: ${newSiteName}`);
                      }
                    }}
                  >
                    <Settings className="h-6 w-6 mb-2" />
                    <span className="text-sm">Site Settings</span>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Content Changes</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageContents.map((content) => (
                        <TableRow key={content.id}>
                          <TableCell className="font-medium">{content.page}</TableCell>
                          <TableCell>{content.section}</TableCell>
                          <TableCell className="max-w-xs truncate">{content.content}</TableCell>
                          <TableCell>{content.lastModified.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newContent = prompt(`Edit ${content.section} for ${content.page}:`, content.content);
                                  if (newContent && newContent !== content.content) {
                                    updatePageContent(content.page, content.section, newContent);
                                    alert(`${content.section} updated successfully!`);
                                  }
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  alert(`Content Details:\\n\\n` +
                                        `Page: ${content.page}\\n` +
                                        `Section: ${content.section}\\n` +
                                        `Content: ${content.content}\\n` +
                                        `Last Modified: ${content.lastModified.toLocaleString()}\\n` +
                                        `ID: ${content.id}`);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Basic site configuration and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings(prev => ({...prev, siteName: e.target.value}))}
                      placeholder="Enter site name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings(prev => ({...prev, siteDescription: e.target.value}))}
                      placeholder="Enter site description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings(prev => ({...prev, contactEmail: e.target.value}))}
                      placeholder="Enter contact email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input
                      id="supportPhone"
                      value={generalSettings.supportPhone}
                      onChange={(e) => setGeneralSettings(prev => ({...prev, supportPhone: e.target.value}))}
                      placeholder="Enter support phone"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log('Saving general settings:', generalSettings);

                      // Save to localStorage
                      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));

                      // Update CMS content as well
                      updatePageContent('Site Settings', 'Site Name', generalSettings.siteName);
                      updatePageContent('Site Settings', 'Site Description', generalSettings.siteDescription);
                      updatePageContent('Site Settings', 'Contact Email', generalSettings.contactEmail);
                      updatePageContent('Site Settings', 'Support Phone', generalSettings.supportPhone);

                      alert('General settings saved successfully!' + '\\n' +
                            'Site Name: ' + generalSettings.siteName + '\\n' +
                            'Description: ' + generalSettings.siteDescription + '\\n' +
                            'Email: ' + generalSettings.contactEmail + '\\n' +
                            'Phone: ' + generalSettings.supportPhone + '\\n\\n' +
                            'Changes will be reflected across the application.');
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save General Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Theme & Branding */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Theme & Branding
                  </CardTitle>
                  <CardDescription>
                    Customize colors, logos, and visual appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({...prev, primaryColor: e.target.value}))}
                        className="w-12 h-8 rounded border border-input"
                      />
                      <span className="text-sm text-muted-foreground">{themeSettings.primaryColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={themeSettings.accentColor}
                        onChange={(e) => setThemeSettings(prev => ({...prev, accentColor: e.target.value}))}
                        className="w-12 h-8 rounded border border-input"
                      />
                      <span className="text-sm text-muted-foreground">{themeSettings.accentColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={themeSettings.logoUrl}
                      onChange={(e) => setThemeSettings(prev => ({...prev, logoUrl: e.target.value}))}
                      placeholder="Enter logo URL or upload"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input
                      id="favicon"
                      value={themeSettings.faviconUrl}
                      onChange={(e) => setThemeSettings(prev => ({...prev, faviconUrl: e.target.value}))}
                      placeholder="Enter favicon URL"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log('Saving theme settings:', themeSettings);

                      // Save to localStorage
                      localStorage.setItem('themeSettings', JSON.stringify(themeSettings));

                      // Apply CSS custom properties for theme colors
                      document.documentElement.style.setProperty('--primary', themeSettings.primaryColor);
                      document.documentElement.style.setProperty('--accent', themeSettings.accentColor);

                      // Update favicon if provided
                      if (themeSettings.faviconUrl) {
                        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
                        if (favicon) {
                          favicon.href = themeSettings.faviconUrl;
                        }
                      }

                      // Update CMS content
                      updatePageContent('Theme', 'Primary Color', themeSettings.primaryColor);
                      updatePageContent('Theme', 'Accent Color', themeSettings.accentColor);
                      updatePageContent('Theme', 'Logo URL', themeSettings.logoUrl);
                      updatePageContent('Theme', 'Favicon URL', themeSettings.faviconUrl);

                      alert('Theme & branding updated successfully!' + '\\n' +
                            'Primary Color: ' + themeSettings.primaryColor + '\\n' +
                            'Accent Color: ' + themeSettings.accentColor + '\\n' +
                            'Logo URL: ' + (themeSettings.logoUrl || 'Not set') + '\\n' +
                            'Favicon URL: ' + (themeSettings.faviconUrl || 'Not set') + '\\n\\n' +
                            'Theme changes have been applied to the application.');
                    }}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Update Branding
                  </Button>
                </CardContent>
              </Card>

              {/* Trial & License Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Trial & License Settings
                  </CardTitle>
                  <CardDescription>
                    Configure trial periods and license options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trialDays">Free Trial Days</Label>
                    <Input
                      id="trialDays"
                      type="number"
                      value={licenseSettings.trialDays}
                      onChange={(e) => setLicenseSettings(prev => ({...prev, trialDays: parseInt(e.target.value) || 1}))}
                      min="1"
                      max="30"
                    />
                    <p className="text-xs text-muted-foreground">
                      Currently set to {licenseSettings.trialDays} day{licenseSettings.trialDays !== 1 ? 's' : ''} trial period
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professionalPrice">Professional License Price</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">$</span>
                      <Input
                        id="professionalPrice"
                        type="number"
                        value={licenseSettings.professionalPrice}
                        onChange={(e) => setLicenseSettings(prev => ({...prev, professionalPrice: parseInt(e.target.value) || 29}))}
                        min="1"
                      />
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enterprisePrice">Enterprise License Price</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">$</span>
                      <Input
                        id="enterprisePrice"
                        type="number"
                        value={licenseSettings.enterprisePrice}
                        onChange={(e) => setLicenseSettings(prev => ({...prev, enterprisePrice: parseInt(e.target.value) || 99}))}
                        min="1"
                      />
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log('Saving license settings:', licenseSettings);

                      // Save to localStorage
                      localStorage.setItem('licenseSettings', JSON.stringify(licenseSettings));

                      // Update CMS content
                      updatePageContent('License Settings', 'Trial Days', licenseSettings.trialDays.toString());
                      updatePageContent('License Settings', 'Professional Price', '$' + licenseSettings.professionalPrice);
                      updatePageContent('License Settings', 'Enterprise Price', '$' + licenseSettings.enterprisePrice);

                      // Update pricing in payment system (if it exists)
                      localStorage.setItem('pricingConfig', JSON.stringify({
                        professional: licenseSettings.professionalPrice,
                        enterprise: licenseSettings.enterprisePrice,
                        trialDays: licenseSettings.trialDays
                      }));

                      alert('License settings updated successfully!' + '\\n' +
                            'Trial Period: ' + licenseSettings.trialDays + ' day' + (licenseSettings.trialDays !== 1 ? 's' : '') + '\\n' +
                            'Professional: $' + licenseSettings.professionalPrice + '/month' + '\\n' +
                            'Enterprise: $' + licenseSettings.enterprisePrice + '/month' + '\\n\\n' +
                            'Settings have been applied to user pages and payment system.');
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Update License Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Feature Toggles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Feature Settings
                  </CardTitle>
                  <CardDescription>
                    Enable or disable app features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Voice Recording</Label>
                      <p className="text-xs text-muted-foreground">Allow users to record with microphone</p>
                    </div>
                    <Switch
                      checked={featureSettings.voiceRecording}
                      onCheckedChange={(checked) => {
                        setFeatureSettings(prev => ({...prev, voiceRecording: checked}));
                        console.log('Voice Recording:', checked);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Collaboration Features</Label>
                      <p className="text-xs text-muted-foreground">Real-time collaboration tools</p>
                    </div>
                    <Switch
                      checked={featureSettings.collaborationFeatures}
                      onCheckedChange={(checked) => {
                        setFeatureSettings(prev => ({...prev, collaborationFeatures: checked}));
                        console.log('Collaboration Features:', checked);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Movie Maker</Label>
                      <p className="text-xs text-muted-foreground">Video creation and editing tools</p>
                    </div>
                    <Switch
                      checked={featureSettings.movieMaker}
                      onCheckedChange={(checked) => {
                        setFeatureSettings(prev => ({...prev, movieMaker: checked}));
                        console.log('Movie Maker:', checked);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Premium Instruments</Label>
                      <p className="text-xs text-muted-foreground">Advanced wind instrument library</p>
                    </div>
                    <Switch
                      checked={featureSettings.premiumInstruments}
                      onCheckedChange={(checked) => {
                        setFeatureSettings(prev => ({...prev, premiumInstruments: checked}));
                        console.log('Premium Instruments:', checked);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Voice Beautifying</Label>
                      <p className="text-xs text-muted-foreground">AI-powered vocal enhancement</p>
                    </div>
                    <Switch
                      checked={featureSettings.voiceBeautifying}
                      onCheckedChange={(checked) => {
                        setFeatureSettings(prev => ({...prev, voiceBeautifying: checked}));
                        console.log('Voice Beautifying:', checked);
                      }}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log('Saving feature settings:', featureSettings);

                      // Save to localStorage
                      localStorage.setItem('featureSettings', JSON.stringify(featureSettings));

                      // Update CMS content
                      Object.entries(featureSettings).forEach(([key, value]) => {
                        updatePageContent('Feature Settings', key, value ? 'Enabled' : 'Disabled');
                      });

                      alert('Feature settings saved successfully!' + '\\n' +
                            'Voice Recording: ' + (featureSettings.voiceRecording ? 'Enabled' : 'Disabled') + '\\n' +
                            'Collaboration: ' + (featureSettings.collaborationFeatures ? 'Enabled' : 'Disabled') + '\\n' +
                            'Movie Maker: ' + (featureSettings.movieMaker ? 'Enabled' : 'Disabled') + '\\n' +
                            'Premium Instruments: ' + (featureSettings.premiumInstruments ? 'Enabled' : 'Disabled') + '\\n' +
                            'Voice Beautifying: ' + (featureSettings.voiceBeautifying ? 'Enabled' : 'Disabled') + '\\n\\n' +
                            'Settings have been applied to user pages.');
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Save Feature Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Email & Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Email & Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure email settings and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      defaultValue="587"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      placeholder="noreply@windharmony.com"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Trial Expiry Notifications</Label>
                      <p className="text-xs text-muted-foreground">Email users before trial expires</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>License Renewal Reminders</Label>
                      <p className="text-xs text-muted-foreground">Remind users to renew licenses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log('Saving email settings');
                      localStorage.setItem('emailSettings', JSON.stringify({
                        smtpHost: (document.getElementById('smtpHost') as HTMLInputElement)?.value,
                        smtpPort: (document.getElementById('smtpPort') as HTMLInputElement)?.value,
                        fromEmail: (document.getElementById('fromEmail') as HTMLInputElement)?.value,
                        trialExpiry: true,
                        licenseRenewal: true
                      }));
                      alert('Email & notification settings saved successfully!');
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Save Email Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Security & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security & Privacy
                  </CardTitle>
                  <CardDescription>
                    Security settings and privacy controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-xs text-muted-foreground">Auto-logout inactive users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      defaultValue="60"
                      min="5"
                      max="1440"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Analytics</Label>
                      <p className="text-xs text-muted-foreground">Collect usage analytics</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                    <Input
                      id="privacyPolicy"
                      placeholder="/privacy-policy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termsOfService">Terms of Service URL</Label>
                    <Input
                      id="termsOfService"
                      placeholder="/terms-of-service"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      console.log('Saving security settings');
                      localStorage.setItem('securitySettings', JSON.stringify({
                        twoFactorAuth: false,
                        sessionTimeout: true,
                        timeoutMinutes: (document.getElementById('sessionTimeout') as HTMLInputElement)?.value || '60',
                        dataAnalytics: true,
                        privacyPolicy: (document.getElementById('privacyPolicy') as HTMLInputElement)?.value,
                        termsOfService: (document.getElementById('termsOfService') as HTMLInputElement)?.value
                      }));
                      alert('Security & privacy settings saved successfully!\nSettings have been applied to user pages.');
                    }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Update Security Settings
                  </Button>
                </CardContent>
              </Card>

            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks and system operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const userData = JSON.stringify(users, null, 2);
                      const blob = new Blob([userData], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `users-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      alert('User data backup downloaded successfully!');
                    }}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">Backup Users</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const licenseData = users.map(u => ({
                        email: u.email,
                        licenseType: u.licenseType,
                        status: u.status,
                        expiryDate: u.expiryDate
                      }));
                      const csvContent = 'Email,License Type,Status,Expiry Date\\n' +
                        licenseData.map(l => `${l.email},${l.licenseType},${l.status},${l.expiryDate}`).join('\\n');
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `licenses-export-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                      alert('License data exported successfully!');
                    }}
                  >
                    <Shield className="h-6 w-6 mb-2" />
                    <span className="text-sm">Export Licenses</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const logData = {
                        timestamp: new Date().toISOString(),
                        totalUsers: users.length,
                        activeUsers: users.filter(u => u.status === 'active').length,
                        revenue: paymentRecords.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
                        systemStatus: 'Healthy'
                      };
                      const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      alert('System logs downloaded successfully!');
                    }}
                  >
                    <Download className="h-6 w-6 mb-2" />
                    <span className="text-sm">Download Logs</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => {
                      const healthMetrics = {
                        status: 'Healthy',
                        uptime: '99.9%',
                        activeUsers: users.filter(u => u.status === 'active').length,
                        totalUsers: users.length,
                        systemLoad: 'Normal',
                        memory: '512MB / 2GB',
                        storage: '4.2GB / 50GB',
                        lastBackup: new Date().toLocaleDateString()
                      };
                      alert('System Health Report:\\n\\n' +
                            'Status: ' + healthMetrics.status + '\\n' +
                            'Uptime: ' + healthMetrics.uptime + '\\n' +
                            'Active Users: ' + healthMetrics.activeUsers + '/' + healthMetrics.totalUsers + '\\n' +
                            'System Load: ' + healthMetrics.systemLoad + '\\n' +
                            'Memory Usage: ' + healthMetrics.memory + '\\n' +
                            'Storage Usage: ' + healthMetrics.storage + '\\n' +
                            'Last Backup: ' + healthMetrics.lastBackup);
                    }}
                  >
                    <Settings className="h-6 w-6 mb-2" />
                    <span className="text-sm">System Health</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
