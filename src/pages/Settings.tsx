import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  CreditCard,
  User,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Key,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Check,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  Zap,
  Star,
  Activity,
  LucideIcon,
  Menu,
  X,
  Calendar,
  DollarSign,
  Clock,
  CreditCard as BankIcon,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Define types for our data structures
type NotificationSettings = {
  email: boolean;
  push: boolean;
  sms: boolean;
  newJobs: boolean;
  messages: boolean;
  payments: boolean;
  reminders: boolean;
  marketing: boolean;
};

type SettingSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
};

type AccountSettings = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  profileImage: string;
  experience: string;
  services: string[];
  hourlyRate: number;
};

type GeneralSettings = {
  language: string;
  timeZone: string;
  currency: string;
  theme: string;
};

type SecurityData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
};

type BankAccount = {
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  bankName: string;
  accountHolderName: string;
  lastFour: string;
};

type PaymentSettings = {
  payoutSchedule: string;
  currency: string;
  bankAccount: BankAccount | null;
};

type ProviderSettings = {
  autoAcceptJobs: boolean;
  maxJobsPerDay: number;
  serviceRadius: number;
  workingHours: {
    start: string;
    end: string;
  };
  vacationMode: boolean;
};

// ProviderBankAccount Component
const ProviderBankAccount = () => {
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankCode: ''
  });
  const [existingAccount, setExistingAccount] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    fetchBankAccount();
    fetchBanks();
    // Check user type
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setUserType(user.userType);
    }
  }, []);

  const fetchBankAccount = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/providers/bank-account`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 403) {
        console.log('User is not a provider');
        return;
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        setExistingAccount(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch bank account:', error);
    }
  };

  const fetchBanks = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/banks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setBanks(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      alert('Failed to load bank list');
    }
  };

  const handleAccountVerification = async () => {
    if (!bankDetails.accountNumber || !bankDetails.bankCode) {
      alert('Please select a bank and enter account number');
      return;
    }

    if (bankDetails.accountNumber.length < 10) {
      alert('Please enter a valid 10-digit account number');
      return;
    }

    setVerifying(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/verify-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          accountNumber: bankDetails.accountNumber,
          bankCode: bankDetails.bankCode
        })
      });

      const result = await response.json();

      if (result.success) {
        setBankDetails(prev => ({
          ...prev,
          accountName: result.data.accountName
        }));
        alert(`Account verified: ${result.data.accountName}`);
      } else {
        alert('Account verification failed: ' + result.message);
      }
    } catch (error) {
      console.error('Account verification error:', error);
      alert('Failed to verify account number');
    } finally {
      setVerifying(false);
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = banks.find(bank => bank.code === e.target.value);
    setBankDetails(prev => ({
      ...prev,
      bankCode: e.target.value,
      bankName: selectedBank ? selectedBank.name : ''
    }));
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setBankDetails(prev => ({
      ...prev,
      accountNumber: accountNumber
    }));

    // Auto-verify when account number is 10 digits and bank is selected
    if (accountNumber.length === 10 && bankDetails.bankCode) {
      // Small delay to let user finish typing
      setTimeout(() => {
        handleAccountVerification();
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is a provider
    if (!userType.includes('provider')) {
      alert('Only providers can add bank accounts. Please switch to provider mode.');
      return;
    }

    // Validate form
    if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName || !bankDetails.bankCode) {
      alert('Please complete all bank account details');
      return;
    }

    if (bankDetails.accountNumber.length !== 10) {
      alert('Please enter a valid 10-digit account number');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/providers/bank-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bankDetails)
      });

      const result = await response.json();

      if (result.success) {
        alert('Bank account added successfully!');
        setExistingAccount(result.data);
        setBankDetails({ bankName: '', accountNumber: '', accountName: '', bankCode: '' });
      } else {
        alert('Failed to add bank account: ' + result.message);
      }
    } catch (error) {
      console.error('Add bank account error:', error);
      alert('Failed to add bank account');
    } finally {
      setLoading(false);
    }
  };

  // Show message if user is not a provider
  if (userType && !userType.includes('provider')) {
    return (
      <div className="p-6 bg-gradient-to-br from-green-50 to-indigo-50 rounded-xl lg:rounded-2xl border border-green-200">
        <h2 className="text-2xl font-bold mb-6">Bank Account Settings</h2>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">
            Only providers can add bank accounts. Please switch to provider mode in your account settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-indigo-50 rounded-xl lg:rounded-2xl border border-green-200">
      <h2 className="text-2xl font-bold mb-6">Bank Account Settings</h2>
      
      {existingAccount ? (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-green-800">Bank Account Configured</h3>
          <p className="text-green-700">
            {existingAccount.bankAccount?.bankName} - ****{existingAccount.bankAccount?.accountNumber}
          </p>
          <p className="text-green-700">Account Name: {existingAccount.bankAccount?.accountName}</p>
          <p className="text-green-700 text-sm mt-2">✅ Verified and ready to receive payments</p>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">
            You need to add a bank account to receive payments. Payments will be automatically transferred to this account when jobs are completed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Bank <span className="text-red-500">*</span>
          </label>
          <select
            value={bankDetails.bankCode}
            onChange={handleBankChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Choose a bank</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={bankDetails.accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="10-digit account number"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
              maxLength={10}
              required
            />
            <button
              type="button"
              onClick={handleAccountVerification}
              disabled={verifying || !bankDetails.accountNumber || !bankDetails.bankCode}
              className="mt-1 px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 whitespace-nowrap"
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter your 10-digit account number. It will be automatically verified when complete.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Name
          </label>
          <input
            type="text"
            value={bankDetails.accountName}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
            placeholder="Will be automatically filled after verification"
          />
          {bankDetails.accountName && (
            <p className="text-green-600 text-sm mt-1">✅ Account name verified</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !bankDetails.accountName}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-md disabled:opacity-50 font-medium hover:bg-green-700 transition-colors"
          >
            {loading ? 'Adding Bank Account...' : 'Save Bank Account'}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Your bank account will be securely verified with Paystack
          </p>
        </div>
      </form>
    </div>
  );
};

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // State for all settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    newJobs: true,
    messages: true,
    payments: true,
    reminders: true,
    marketing: false,
  });

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    language: "en-US",
    timeZone: "America/New_York",
    currency: "USD",
    theme: "light"
  });

  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    profileImage: "",
    experience: "",
    services: [],
    hourlyRate: 0
  });

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    payoutSchedule: "weekly",
    currency: "NGN",
    bankAccount: null
  });

  const [providerSettings, setProviderSettings] = useState<ProviderSettings>({
    autoAcceptJobs: false,
    maxJobsPerDay: 5,
    serviceRadius: 25,
    workingHours: {
      start: "09:00",
      end: "17:00"
    },
    vacationMode: false
  });

  const [accountStats, setAccountStats] = useState({
    jobsCompleted: 0,
    averageRating: 0,
    totalEarnings: 0,
    activeClients: 0
  });

  const [newService, setNewService] = useState("");
  const [newBankAccount, setNewBankAccount] = useState({
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
    bankName: "",
    accountHolderName: ""
  });

  const settingSections: SettingSection[] = [
    {
      id: "general",
      label: "General",
      icon: SettingsIcon,
      color: "from-blue-500 to-green-600",
      bgColor: "from-green-50 to-green-50",
      description: "App preferences & display",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "from-green-500 to-pink-600",
      bgColor: "from-green-50 to-green-50",
      description: "Alerts & communications",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
      description: "Password & authentication",
    },
    {
      id: "payment",
      label: "Payment",
      icon: CreditCard,
      color: "from-yellow-500 to-orange-600",
      bgColor: "from-yellow-50 to-orange-50",
      description: "Billing & payouts",
    },
    {
      id: "provider",
      label: "Provider",
      icon: User,
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50",
      description: "Service preferences",
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-50",
      description: "Personal information",
    },
  ];

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        setErrorMessage('Please log in to access settings');
        return;
      }

      // Fetch all settings
      const settingsResponse = await fetch(`${API_BASE_URL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch user profile
      const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch dashboard stats
      const dashboardResponse = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (settingsResponse.ok) {
        const result = await settingsResponse.json();
        if (result.success) {
          const settings = result.data;
          
          // Update all settings from API
          if (settings.notifications) {
            setNotifications(prev => ({
              ...prev,
              ...settings.notifications
            }));
          }
          
          if (settings.general) {
            setGeneralSettings(prev => ({
              ...prev,
              ...settings.general
            }));
          }

          if (settings.security) {
            setSecurityData(prev => ({
              ...prev,
              twoFactorEnabled: settings.security.twoFactorEnabled || false
            }));
          }

          if (settings.payment) {
            setPaymentSettings(prev => ({
              ...prev,
              ...settings.payment
            }));
          }

          if (settings.provider) {
            setProviderSettings(prev => ({
              ...prev,
              ...settings.provider
            }));
          }
        }
      } else {
        console.error('Failed to fetch settings:', settingsResponse.status);
        if (settingsResponse.status === 401) {
          setErrorMessage('Authentication failed. Please log in again.');
        }
      }

      if (profileResponse.ok) {
        const result = await profileResponse.json();
        if (result.success && result.data.user) {
          const user = result.data.user;
          setAccountSettings(prev => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            country: user.country || "",
            profileImage: user.profileImage || user.profilePicture || "",
            experience: user.experience || "",
            services: user.services || [],
            hourlyRate: user.hourlyRate || 0
          }));
        }
      } else {
        console.error('Failed to fetch profile:', profileResponse.status);
      }

      if (dashboardResponse.ok) {
        const result = await dashboardResponse.json();
        if (result.success) {
          setAccountStats({
            jobsCompleted: result.stats?.jobsCompleted || result.stats?.completedJobs || 0,
            averageRating: result.stats?.averageRating || 0,
            totalEarnings: result.stats?.totalEarnings || 0,
            activeClients: result.stats?.activeClients || 0
          });
        }
      } else {
        console.error('Failed to fetch dashboard:', dashboardResponse.status);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setErrorMessage('Failed to load settings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Notification handlers
  const handleNotificationChange = async (key: keyof NotificationSettings) => {
    const newValue = !notifications[key];
    const newNotifications = {
      ...notifications,
      [key]: newValue
    };
    
    setNotifications(newNotifications);
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [key]: newValue })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save notification setting');
      }
    } catch (error) {
      console.error('Error saving notification setting:', error);
      // Revert on error
      setNotifications(notifications);
      setErrorMessage(`Failed to update notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Save handlers for each section
  const saveGeneralSettings = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/settings/general`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generalSettings)
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save general settings');
      }
    } catch (error) {
      console.error('Error saving general settings:', error);
      setSaveStatus('error');
      setErrorMessage(`Failed to save general settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const saveSecuritySettings = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');
      
      if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
        setErrorMessage("New passwords don't match");
        setSaveStatus('error');
        return;
      }

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/settings/security`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword,
          enableTwoFactor: securityData.twoFactorEnabled
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSaveStatus('success');
        // Clear password fields
        setSecurityData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(result.message || 'Failed to update security settings');
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      setSaveStatus('error');
      setErrorMessage(`Failed to update security settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const saveAccountSettings = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Update profile information
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: accountSettings.name,
          phoneNumber: accountSettings.phoneNumber,
          address: accountSettings.address,
          city: accountSettings.city,
          state: accountSettings.state,
          country: accountSettings.country,
          experience: accountSettings.experience,
          services: accountSettings.services,
          hourlyRate: accountSettings.hourlyRate
        })
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Failed to save account settings');
      }
    } catch (error) {
      console.error('Error saving account settings:', error);
      setSaveStatus('error');
      setErrorMessage(`Failed to save account settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const savePaymentSettings = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/settings/payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentSettings)
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save payment settings');
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      setSaveStatus('error');
      setErrorMessage(`Failed to save payment settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const saveProviderSettings = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      console.log('Saving provider settings:', providerSettings);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_BASE_URL}/api/settings/provider`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(providerSettings)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Provider settings saved successfully:', result);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        let errorMessage = 'Failed to save provider settings';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Server error response:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving provider settings:', error);
      setSaveStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Failed to save provider settings: ${errorMsg}`);
      
      // Log additional debug info
      console.error('Debug info:', {
        API_BASE_URL,
        providerSettings,
        hasToken: !!localStorage.getItem('authToken') || !!localStorage.getItem('token')
      });
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Service management
  const addService = () => {
    if (newService.trim() && !accountSettings.services.includes(newService.trim())) {
      setAccountSettings(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setAccountSettings(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  // Bank account management
  const addBankAccount = () => {
    if (newBankAccount.accountNumber && newBankAccount.routingNumber && newBankAccount.accountHolderName) {
      const bankAccount: BankAccount = {
        ...newBankAccount,
        lastFour: newBankAccount.accountNumber.slice(-4)
      };
      
      setPaymentSettings(prev => ({
        ...prev,
        bankAccount
      }));
      setNewBankAccount({
        accountNumber: "",
        routingNumber: "",
        accountType: "checking",
        bankName: "",
        accountHolderName: ""
      });
    }
  };

  const removeBankAccount = () => {
    setPaymentSettings(prev => ({
      ...prev,
      bankAccount: null
    }));
  };

  const handleSaveAll = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');
      
      // Save based on active section
      switch (activeSection) {
        case 'general':
          await saveGeneralSettings();
          break;
        case 'security':
          await saveSecuritySettings();
          break;
        case 'account':
          await saveAccountSettings();
          break;
        case 'payment':
          await savePaymentSettings();
          break;
        case 'provider':
          await saveProviderSettings();
          break;
        default:
          setSaveStatus('success');
          setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setErrorMessage(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const confirmation = prompt('Please type "DELETE MY ACCOUNT" to confirm:');
      
      if (confirmation === 'DELETE MY ACCOUNT') {
        try {
          const token = localStorage.getItem('authToken') || localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/api/settings/account`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ confirmation })
          });

          if (response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/';
          } else {
            throw new Error('Failed to delete account');
          }
        } catch (error) {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again.');
        }
      }
    }
  };

  const getCurrentSection = (): SettingSection | undefined => {
    return settingSections.find((section) => section.id === activeSection);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
    setErrorMessage(''); // Clear error when switching sections
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved!';
      case 'error':
        return 'Error Saving';
      default:
        return 'Save Changes';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-green-600 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    Settings
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-tight">
                    Manage your provider account
                  </p>
                </div>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            <button 
              onClick={handleSaveAll}
              disabled={saveStatus === 'saving'}
              className={`w-full lg:w-auto px-4 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-2 lg:gap-3 ${
                saveStatus === 'saving' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : saveStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
              }`}
            >
              <div className={`w-4 h-4 lg:w-6 lg:h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                saveStatus === 'success' ? 'bg-white/20' : 'bg-white/20'
              }`}>
                <Save className={`w-3 h-3 lg:w-4 lg:h-4 ${
                  saveStatus === 'saving' ? 'animate-spin' : ''
                }`} />
              </div>
              <span className="text-sm lg:text-base">{getSaveButtonText()}</span>
            </button>
          </div>
        </div>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="relative">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Settings Navigation */}
            <div className={`
              fixed inset-y-0 left-0 z-50 w-80 max-w-[calc(100vw-2rem)] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-auto lg:z-auto
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:col-span-1
            `}>
              <div className="h-full lg:h-auto bg-white/90 lg:bg-white/80 backdrop-blur-sm rounded-none lg:rounded-3xl shadow-xl lg:shadow-sm border-r border-gray-200 lg:border lg:border-gray-100 p-4 sm:p-6 overflow-y-auto">
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1 lg:mb-2">
                    Settings Menu
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Configure your provider account
                  </p>
                </div>
                <nav className="space-y-2 lg:space-y-3">
                  {settingSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`group w-full p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-200 text-left ${
                        activeSection === section.id
                          ? `bg-gradient-to-r ${section.bgColor} border border-white/50 shadow-sm scale-[1.02] lg:scale-105`
                          : "bg-white/50 hover:bg-white/80 hover:scale-[1.01] lg:hover:scale-102 border border-transparent hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div
                          className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${
                            section.color
                          } rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg ${
                            activeSection === section.id
                              ? "scale-105 lg:scale-110"
                              : "group-hover:scale-105"
                          } transition-transform flex-shrink-0`}
                        >
                          <section.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm lg:text-base leading-tight">
                            {section.label}
                          </h4>
                          <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors leading-tight">
                            {section.description}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 lg:w-5 lg:h-5 text-gray-400 transition-all flex-shrink-0 ${
                            activeSection === section.id
                              ? "rotate-90 text-blue-600"
                              : "group-hover:text-gray-600"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Section Header */}
                <div
                  className={`h-24 sm:h-28 lg:h-32 bg-gradient-to-r ${
                    getCurrentSection()?.color || "from-blue-500 to-indigo-600"
                  } relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 lg:left-8 flex items-center gap-3 lg:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                      {React.createElement(
                        getCurrentSection()?.icon || SettingsIcon,
                        { className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" }
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                        {getCurrentSection()?.label}
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base leading-tight">
                        {getCurrentSection()?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  {/* General Settings */}
                  {activeSection === "general" && (
                    <div className="space-y-6 lg:space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Language
                            </h3>
                          </div>
                          <select 
                            value={generalSettings.language}
                            onChange={(e) => setGeneralSettings(prev => ({...prev, language: e.target.value}))}
                            className="w-full p-3 sm:p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm sm:text-base"
                          >
                            <option value="en-US">🇺🇸 English (US)</option>
                            <option value="es-ES">🇪🇸 Spanish</option>
                            <option value="fr-FR">🇫🇷 French</option>
                            <option value="de-DE">🇩🇪 German</option>
                          </select>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-green-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-pink-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Time Zone
                            </h3>
                          </div>
                          <select 
                            value={generalSettings.timeZone}
                            onChange={(e) => setGeneralSettings(prev => ({...prev, timeZone: e.target.value}))}
                            className="w-full p-3 sm:p-3 bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm sm:text-base"
                          >
                            <option value="America/New_York">🕐 Eastern Time (ET)</option>
                            <option value="America/Chicago">🕑 Central Time (CT)</option>
                            <option value="America/Denver">🕒 Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">🕓 Pacific Time (PT)</option>
                          </select>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Currency
                            </h3>
                          </div>
                          <select 
                            value={generalSettings.currency}
                            onChange={(e) => setGeneralSettings(prev => ({...prev, currency: e.target.value}))}
                            className="w-full p-3 sm:p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                          >
                            
                            <option value="NGN">🇳🇬 Nigerian Naira (NGN)</option>
                          </select>
                        </div>

                        {/* <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-orange-200">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                              Theme
                            </h3>
                          </div>
                          <select 
                            value={generalSettings.theme}
                            onChange={(e) => setGeneralSettings(prev => ({...prev, theme: e.target.value}))}
                            className="w-full p-3 sm:p-3 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-sm sm:text-base"
                          >
                            <option value="light">🌞 Light</option>
                            <option value="dark">🌙 Dark</option>
                            <option value="auto">⚙️ Auto</option>
                          </select>
                        </div> */}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={saveGeneralSettings}
                          disabled={saveStatus === 'saving'}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold disabled:opacity-50"
                        >
                          {saveStatus === 'saving' ? 'Saving...' : 'Save General Settings'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeSection === "notifications" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Delivery Methods */}
                      <div className="bg-gradient-to-br from-green-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-green-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Delivery Methods
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              How you want to receive notifications
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:gap-4">
                          {[
                            {
                              key: "email",
                              label: "Email Notifications",
                              description: "Receive updates via email",
                              icon: Mail,
                              color: "from-blue-500 to-indigo-600",
                            },
                            {
                              key: "push",
                              label: "Push Notifications", 
                              description: "Receive push notifications in app",
                              icon: Bell,
                              color: "from-emerald-500 to-green-600",
                            },
                            {
                              key: "sms",
                              label: "SMS Notifications",
                              description: "Receive updates via SMS",
                              icon: Smartphone,
                              color: "from-orange-500 to-red-600",
                            },
                          ].map((method) => (
                            <div key={method.key} className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50 hover:shadow-lg transition-all">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${method.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                                    <method.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                                      {method.label}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                                      {method.description}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleNotificationChange(method.key as keyof NotificationSettings)}
                                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 shadow-lg flex-shrink-0 ${
                                    notifications[method.key as keyof NotificationSettings]
                                      ? `bg-gradient-to-r ${method.color}`
                                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
                                      notifications[method.key as keyof NotificationSettings]
                                        ? "transform translate-x-6 sm:translate-x-7"
                                        : ""
                                    }`}
                                  >
                                    {notifications[method.key as keyof NotificationSettings] && (
                                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notification Types */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Notification Types
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              What you want to be notified about
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:gap-4">
                          {[
                            {
                              key: "newJobs",
                              label: "New Job Opportunities",
                              description: "Get notified when new jobs match your skills",
                              icon: Star,
                              color: "from-yellow-500 to-orange-600",
                            },
                            {
                              key: "messages",
                              label: "New Messages",
                              description: "Receive alerts for new client messages",
                              icon: Mail,
                              color: "from-green-500 to-emerald-600",
                            },
                            {
                              key: "payments",
                              label: "Payment Updates",
                              description: "Get notified about payment confirmations and issues",
                              icon: CreditCard,
                              color: "from-green-500 to-pink-600",
                            },
                            {
                              key: "reminders",
                              label: "Booking Reminders",
                              description: "Get reminders for upcoming appointments",
                              icon: Calendar,
                              color: "from-blue-500 to-cyan-600",
                            },
                          ].map((type) => (
                            <div key={type.key} className="group bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50 hover:shadow-lg transition-all">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${type.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                                    <type.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                                      {type.label}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                                      {type.description}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleNotificationChange(type.key as keyof NotificationSettings)}
                                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 shadow-lg flex-shrink-0 ${
                                    notifications[type.key as keyof NotificationSettings]
                                      ? `bg-gradient-to-r ${type.color}`
                                      : "bg-gradient-to-r from-gray-300 to-gray-400"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
                                      notifications[type.key as keyof NotificationSettings]
                                        ? "transform translate-x-6 sm:translate-x-7"
                                        : ""
                                    }`}
                                  >
                                    {notifications[type.key as keyof NotificationSettings] && (
                                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeSection === "security" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Security Status */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 leading-tight">
                              Account Security
                              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                securityData.twoFactorEnabled ? 'bg-green-500' : 'bg-yellow-500'
                              }`}>
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </h3>
                            <p className="text-sm sm:text-base text-emerald-700 leading-tight">
                              {securityData.twoFactorEnabled 
                                ? 'Your account is secured with two-factor authentication'
                                : 'Enable two-factor authentication for extra security'
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Password Change */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Change Password
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Update your account password
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={securityData.currentPassword}
                                onChange={(e) => setSecurityData(prev => ({...prev, currentPassword: e.target.value}))}
                                className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium pr-12 text-sm sm:text-base"
                                placeholder="Enter current password"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData(prev => ({...prev, newPassword: e.target.value}))}
                                className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                                placeholder="Enter new password"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData(prev => ({...prev, confirmPassword: e.target.value}))}
                                className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>

                          <button 
                            onClick={saveSecuritySettings}
                            disabled={saveStatus === 'saving'}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base disabled:opacity-50"
                          >
                            <Lock className="w-4 h-4" />
                            <span>{saveStatus === 'saving' ? 'Updating...' : 'Update Password'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="bg-gradient-to-br from-green-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-green-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Key className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base leading-tight">
                                  SMS Authentication
                                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    securityData.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-400'
                                  }`}>
                                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                  </div>
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                                  {securityData.twoFactorEnabled 
                                    ? 'Enabled for your phone number'
                                    : 'Enable two-factor authentication via SMS'
                                  }
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSecurityData(prev => ({...prev, twoFactorEnabled: !prev.twoFactorEnabled}))}
                              className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium text-sm ${
                                securityData.twoFactorEnabled
                                  ? 'bg-gray-600 text-white'
                                  : 'bg-gradient-to-r from-green-600 to-pink-600 text-white'
                              }`}
                            >
                              {securityData.twoFactorEnabled ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Settings */}
                  {activeSection === "payment" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Payout Settings */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Payout Settings
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Configure how you receive payments
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Payout Schedule
                            </label>
                            <select
                              value={paymentSettings.payoutSchedule}
                              onChange={(e) => setPaymentSettings(prev => ({...prev, payoutSchedule: e.target.value}))}
                              className="w-full p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                            >
                              <option value="daily">📅 Daily</option>
                              <option value="weekly">📆 Weekly (Fridays)</option>
                              <option value="bi-weekly">🗓️ Bi-weekly</option>
                              <option value="monthly">📊 Monthly</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Currency
                            </label>
                            <select
                              value={paymentSettings.currency}
                              onChange={(e) => setPaymentSettings(prev => ({...prev, currency: e.target.value}))}
                              className="w-full p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                            >
                              <option value="USD">💵 USD - US Dollar</option>
                              <option value="EUR">💶 EUR - Euro</option>
                              <option value="GBP">💷 GBP - British Pound</option>
                              <option value="NGN">🇳🇬 NGN - Nigerian Naira</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Bank Account */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mb-4 sm:mb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <BankIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                                Bank Account
                              </h3>
                              <p className="text-sm sm:text-base text-gray-600 leading-tight">
                                Manage your payout method
                              </p>
                            </div>
                          </div>
                          {!paymentSettings.bankAccount && (
                            <button 
                              onClick={() => document.getElementById('bank-account-form')?.scrollIntoView({ behavior: 'smooth' })}
                              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-medium text-sm"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add Bank Account</span>
                            </button>
                          )}
                        </div>

                        {paymentSettings.bankAccount ? (
                          <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                <div className="w-12 h-8 sm:w-16 sm:h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                                  <span className="text-white font-bold text-xs">BANK</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                                    {paymentSettings.bankAccount.bankName || 'Bank Account'}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                                    ****{paymentSettings.bankAccount.lastFour} - {paymentSettings.bankAccount.accountHolderName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {paymentSettings.bankAccount.accountType === 'checking' ? 'Checking Account' : 'Savings Account'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 self-end sm:self-center">
                                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                  <Edit3 className="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                  onClick={removeBankAccount}
                                  className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div id="bank-account-form" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Bank Name
                                </label>
                                <input
                                  type="text"
                                  value={newBankAccount.bankName}
                                  onChange={(e) => setNewBankAccount(prev => ({...prev, bankName: e.target.value}))}
                                  className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                                  placeholder="Enter bank name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Account Holder Name
                                </label>
                                <input
                                  type="text"
                                  value={newBankAccount.accountHolderName}
                                  onChange={(e) => setNewBankAccount(prev => ({...prev, accountHolderName: e.target.value}))}
                                  className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                                  placeholder="Full name as on account"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Account Number
                                </label>
                                <input
                                  type="text"
                                  value={newBankAccount.accountNumber}
                                  onChange={(e) => setNewBankAccount(prev => ({...prev, accountNumber: e.target.value}))}
                                  className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                                  placeholder="Enter account number"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Routing Number
                                </label>
                                <input
                                  type="text"
                                  value={newBankAccount.routingNumber}
                                  onChange={(e) => setNewBankAccount(prev => ({...prev, routingNumber: e.target.value}))}
                                  className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                                  placeholder="Enter routing number"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                  Account Type
                                </label>
                                <select
                                  value={newBankAccount.accountType}
                                  onChange={(e) => setNewBankAccount(prev => ({...prev, accountType: e.target.value}))}
                                  className="w-full p-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                                >
                                  <option value="checking">Checking</option>
                                  <option value="savings">Savings</option>
                                </select>
                              </div>
                            </div>
                            <button
                              onClick={addBankAccount}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold text-sm"
                            >
                              Add Bank Account
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Provider Bank Account Component */}
                      <ProviderBankAccount />

                      <div className="flex justify-end">
                        <button
                          onClick={savePaymentSettings}
                          disabled={saveStatus === 'saving'}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold disabled:opacity-50"
                        >
                          {saveStatus === 'saving' ? 'Saving...' : 'Save Payment Settings'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Provider Settings */}
                  {activeSection === "provider" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Service Preferences */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Service Preferences
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Configure your service settings
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900">Auto-accept Jobs</h4>
                              <p className="text-sm text-gray-600">Automatically accept new job requests</p>
                            </div>
                            <button
                              onClick={() => setProviderSettings(prev => ({...prev, autoAcceptJobs: !prev.autoAcceptJobs}))}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-lg ${
                                providerSettings.autoAcceptJobs
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                  : "bg-gradient-to-r from-gray-300 to-gray-400"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                                  providerSettings.autoAcceptJobs
                                    ? "transform translate-x-6"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Maximum Jobs Per Day
                            </label>
                            <input
                              type="number"
                              value={providerSettings.maxJobsPerDay}
                              onChange={(e) => setProviderSettings(prev => ({...prev, maxJobsPerDay: parseInt(e.target.value) || 1}))}
                              min="1"
                              max="20"
                              className="w-full p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Service Radius (miles)
                            </label>
                            <input
                              type="number"
                              value={providerSettings.serviceRadius}
                              onChange={(e) => setProviderSettings(prev => ({...prev, serviceRadius: parseInt(e.target.value) || 1}))}
                              min="1"
                              max="100"
                              className="w-full p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="bg-gradient-to-br from-green-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-green-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Working Hours
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Set your availability for appointments
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={providerSettings.workingHours.start}
                              onChange={(e) => setProviderSettings(prev => ({
                                ...prev,
                                workingHours: {...prev.workingHours, start: e.target.value}
                              }))}
                              className="w-full p-3 bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={providerSettings.workingHours.end}
                              onChange={(e) => setProviderSettings(prev => ({
                                ...prev,
                                workingHours: {...prev.workingHours, end: e.target.value}
                              }))}
                              className="w-full p-3 bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Vacation Mode */}
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Vacation Mode</h3>
                              <p className="text-sm text-gray-600">Temporarily pause receiving new job requests</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setProviderSettings(prev => ({...prev, vacationMode: !prev.vacationMode}))}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-lg ${
                              providerSettings.vacationMode
                                ? "bg-gradient-to-r from-red-500 to-pink-600"
                                : "bg-gradient-to-r from-gray-300 to-gray-400"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                                providerSettings.vacationMode
                                  ? "transform translate-x-6"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={saveProviderSettings}
                          disabled={saveStatus === 'saving'}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold disabled:opacity-50"
                        >
                          {saveStatus === 'saving' ? 'Saving...' : 'Save Provider Settings'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Account Settings */}
                  {activeSection === "account" && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Profile Information */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                              Profile Information
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-tight">
                              Update your personal and professional details
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={accountSettings.name}
                              onChange={(e) => setAccountSettings(prev => ({...prev, name: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={accountSettings.email}
                              onChange={(e) => setAccountSettings(prev => ({...prev, email: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="Enter your email"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={accountSettings.phoneNumber}
                              onChange={(e) => setAccountSettings(prev => ({...prev, phoneNumber: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="Enter your phone number"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Hourly Rate ($)
                            </label>
                            <input
                              type="number"
                              value={accountSettings.hourlyRate}
                              onChange={(e) => setAccountSettings(prev => ({...prev, hourlyRate: parseFloat(e.target.value) || 0}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="Enter your hourly rate"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Experience
                            </label>
                            <input
                              type="text"
                              value={accountSettings.experience}
                              onChange={(e) => setAccountSettings(prev => ({...prev, experience: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="e.g., 5 years in plumbing"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={accountSettings.address}
                              onChange={(e) => setAccountSettings(prev => ({...prev, address: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="Enter your address"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={accountSettings.city}
                              onChange={(e) => setAccountSettings(prev => ({...prev, city: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="Enter your city"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              value={accountSettings.state}
                              onChange={(e) => setAccountSettings(prev => ({...prev, state: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                              placeholder="Enter your state"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Country
                            </label>
                            <select
                              value={accountSettings.country}
                              onChange={(e) => setAccountSettings(prev => ({...prev, country: e.target.value}))}
                              className="w-full p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm sm:text-base"
                            >
                              <option value="">Select Country</option>
                              <option value="USA">United States</option>
                              <option value="UK">United Kingdom</option>
                              <option value="CANADA">Canada</option>
                              <option value="NIGERIA">Nigeria</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Services Management */}
                        <div className="mt-6">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Services Offered
                          </label>
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              value={newService}
                              onChange={(e) => setNewService(e.target.value)}
                              className="flex-1 p-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                              placeholder="Add a service you offer"
                              onKeyPress={(e) => e.key === 'Enter' && addService()}
                            />
                            <button
                              onClick={addService}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold text-sm"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {accountSettings.services.map((service, index) => (
                              <div
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                              >
                                {service}
                                <button
                                  onClick={() => removeService(service)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end mt-6">
                          <button
                            onClick={saveAccountSettings}
                            disabled={saveStatus === 'saving'}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-semibold disabled:opacity-50"
                          >
                            {saveStatus === 'saving' ? 'Saving...' : 'Save Account Settings'}
                          </button>
                        </div>
                      </div>

                      {/* Account Statistics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-emerald-200 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
                            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                            {accountStats.jobsCompleted}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
                            Jobs Completed
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-green-200 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
                            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                            {accountStats.averageRating.toFixed(1)}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
                            Average Rating
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-yellow-200 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
                            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                            ${accountStats.totalEarnings}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
                            Total Earnings
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-cyan-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-blue-200 text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3 sm:mb-4">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                            {accountStats.activeClients}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
                            Active Clients
                          </p>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 sm:p-6 rounded-xl lg:rounded-2xl border border-red-200">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-red-700 leading-tight">
                              Danger Zone
                            </h3>
                            <p className="text-sm sm:text-base text-red-600 leading-tight">
                              Irreversible account actions
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <button className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-50 hover:shadow-lg transition-all font-bold text-sm sm:text-base">
                            Deactivate Account
                          </button>
                          <button 
                            onClick={handleDeleteAccount}
                            className="p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-bold text-sm sm:text-base"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;