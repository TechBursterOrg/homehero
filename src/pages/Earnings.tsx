import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  Loader2,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Define proper types
interface EarningsData {
  total: number;
  thisWeek: number;
  thisMonth: number;
  thisQuarter: number;
  thisYear: number;
  lastMonth: number;
  pending: number;
  growth: number;
  avgPerJob: number;
  currency: string;
}

interface Transaction {
  id: number;
  client: string;
  service: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  category: string;
}

interface MonthlyData {
  month: string;
  amount: number;
  growth: number;
}

const Earnings: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [earningsData, setEarningsData] = useState<EarningsData>({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisQuarter: 0,
    thisYear: 0,
    lastMonth: 0,
    pending: 0,
    growth: 0,
    avgPerJob: 0,
    currency: 'NGN'
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Currency configuration - Only Naira
  const currencyConfig = {
    symbol: '₦',
    icon: () => <span className="text-base font-bold">₦</span>,
    name: 'NGN'
  };

  const CurrencyIcon = currencyConfig.icon;

  // Initialize auth token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    setAuthToken(token);
  }, []);

  // Fetch earnings data from backend API
  const fetchEarningsData = async (period: string = selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have an auth token
      if (!authToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/api/earnings?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Earnings response status:', response.status);
      
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        setAuthToken(null);
        throw new Error('Your session has expired. Please log in again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setEarningsData(result.data.earnings || result.data.earningsData || {});
        setTransactions(result.data.transactions || []);
        setMonthlyData(result.data.monthlyData || []);
      } else {
        throw new Error(result.message || 'Failed to fetch earnings data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Earnings fetch error:', err);
      
      // Use mock data if API fails
      const mockData = getMockEarningsData(period);
      setEarningsData(mockData.earningsData);
      setTransactions(mockData.transactions);
      setMonthlyData(mockData.monthlyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchEarningsData();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  // Handle period change
  const handlePeriodChange = async (period: string) => {
    setSelectedPeriod(period);
    await fetchEarningsData(period);
  };

  // Mock data for development with Naira amounts
  const getMockEarningsData = (period: string = 'month') => {
    const baseData = {
      earningsData: {
        total: 4702500, // ₦4,702,500
        thisWeek: 346500, // ₦346,500
        thisMonth: 1468500, // ₦1,468,500
        thisQuarter: 4125000, // ₦4,125,000
        thisYear: 18700000, // ₦18,700,000
        lastMonth: 1237500, // ₦1,237,500
        pending: 206250, // ₦206,250
        growth: 18.7,
        avgPerJob: 99000, // ₦99,000
        currency: 'NGN'
      },
      transactions: [
        {
          id: 1,
          client: 'Sarah Johnson',
          service: 'Deep House Cleaning',
          amount: 123750, // ₦123,750
          date: '2025-01-06',
          status: 'completed' as const,
          method: 'Bank Transfer',
          category: 'cleaning'
        },
        {
          id: 2,
          client: 'Mike Chen',
          service: 'Plumbing Repair',
          amount: 198000, // ₦198,000
          date: '2025-01-06',
          status: 'completed' as const,
          method: 'Cash',
          category: 'handyman'
        },
        {
          id: 3,
          client: 'Emma Wilson',
          service: 'Garden Maintenance',
          amount: 99000, // ₦99,000
          date: '2025-01-05',
          status: 'completed' as const,
          method: 'Bank Transfer',
          category: 'gardening'
        },
        {
          id: 4,
          client: 'David Brown',
          service: 'Bathroom Deep Clean',
          amount: 132000, // ₦132,000
          date: '2025-01-04',
          status: 'completed' as const,
          method: 'Bank Transfer',
          category: 'cleaning'
        },
        {
          id: 5,
          client: 'Lisa White',
          service: 'Kitchen Cleaning',
          amount: 90750, // ₦90,750
          date: '2025-01-03',
          status: 'pending' as const,
          method: 'Bank Transfer',
          category: 'cleaning'
        },
        {
          id: 6,
          client: 'Tom Garcia',
          service: 'Window Cleaning',
          amount: 115500, // ₦115,500
          date: '2025-01-02',
          status: 'pending' as const,
          method: 'Bank Transfer',
          category: 'cleaning'
        }
      ],
      monthlyData: [
        { month: 'Jul', amount: 3630000, growth: 5.2 },
        { month: 'Aug', amount: 3960000, growth: 9.1 },
        { month: 'Sep', amount: 3465000, growth: -12.5 },
        { month: 'Oct', amount: 4372500, growth: 26.2 },
        { month: 'Nov', amount: 3795000, growth: -13.2 },
        { month: 'Dec', amount: 4702500, growth: 23.9 },
        { month: 'Jan', amount: 1468500, growth: 18.7 }
      ]
    };

    // Adjust data based on selected period
    switch (period) {
      case 'week':
        baseData.earningsData.growth = 12.3;
        break;
      case 'quarter':
        baseData.earningsData.growth = 22.1;
        break;
      case 'year':
        baseData.earningsData.growth = 45.6;
        break;
      default:
        baseData.earningsData.growth = 18.7;
    }

    return baseData;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'Bank Transfer':
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      case 'Cash':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'cleaning': return '🧽';
      case 'handyman': return '🔧';
      case 'gardening': return '🌿';
      case 'petcare': return '🐾';
      case 'childcare': return '👶';
      default: return '💼';
    }
  };

  const getClientInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter((transaction: Transaction) =>
    transaction.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportData = async () => {
    try {
      setExportLoading(true);
      if (!authToken) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${API_BASE_URL}/api/earnings/export?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `earnings-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export data';
      setError(errorMessage);
      console.error('Export error:', err);
      
      // Fallback: Create a simple CSV download
      const csvContent = createCSVExport();
      downloadCSV(csvContent, `earnings-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
    } finally {
      setExportLoading(false);
    }
  };

  const createCSVExport = (): string => {
    const headers = ['Date', 'Client', 'Service', 'Amount (₦)', 'Status', 'Payment Method', 'Category'];
    const rows = transactions.map(transaction => [
      transaction.date,
      transaction.client,
      transaction.service,
      transaction.amount.toString(),
      transaction.status,
      transaction.method,
      transaction.category
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRetry = async () => {
    // Refresh the token from localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    setAuthToken(token);
    setError(null);
    await fetchEarningsData();
  };

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/login';
  };

  // Get current period amount
  const getCurrentPeriodAmount = () => {
    switch (selectedPeriod) {
      case 'week':
        return earningsData.thisWeek;
      case 'month':
        return earningsData.thisMonth;
      case 'quarter':
        return earningsData.thisQuarter;
      case 'year':
        return earningsData.thisYear;
      default:
        return earningsData.thisMonth;
    }
  };

  // Get period label
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  // Authentication error
  if (!authToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircleIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please log in to view your earnings.</p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Error state (other than auth)
  if (error && !earningsData.total) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircleIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Earnings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
          >
            Retry
          </button>
          <button
            onClick={handleLogin}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Log In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Mobile-Optimized Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg sm:text-2xl">₦</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Earnings Overview
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600 text-base sm:text-lg">Track your income and financial performance</p>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-lg border">
                      <span className="text-sm">🇳🇬</span>
                      <span className="text-xs font-medium text-gray-600">NGN</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['week', 'month', 'quarter', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {period === 'week' && 'This Week'}
                    {period === 'month' && 'This Month'}
                    {period === 'quarter' && 'This Quarter'}
                    {period === 'year' && 'This Year'}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleExportData}
                disabled={exportLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                )}
                <span>{exportLoading ? 'Exporting...' : 'Export Data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">₦</span>
              </div>
              <div className="text-emerald-600">
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">₦{earningsData.total.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-emerald-600 font-semibold">+{earningsData.growth}%</span>
                <span className="text-gray-500">from last period</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-blue-600">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">{getPeriodLabel()}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">₦{getCurrentPeriodAmount().toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-blue-600 font-semibold">+{earningsData.growth}%</span>
                <span className="text-gray-500">growth</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-amber-600">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">₦{earningsData.pending.toLocaleString()}</p>
              <div className="text-xs sm:text-sm text-gray-500">
                {transactions.filter(t => t.status === 'pending').length} payments processing
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-purple-600">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg per Job</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">₦{earningsData.avgPerJob.toLocaleString()}</p>
              <div className="text-xs sm:text-sm text-gray-500">
                Based on {transactions.filter(t => t.status === 'completed').length} completed jobs
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Earnings Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Earnings Trend - {getPeriodLabel()}</h3>
                <p className="text-sm sm:text-base text-gray-600">Performance overview</p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl self-start sm:self-center">
              {selectedPeriod === 'week' && 'Last 7 days'}
              {selectedPeriod === 'month' && 'Last 7 months'}
              {selectedPeriod === 'quarter' && 'Last 4 quarters'}
              {selectedPeriod === 'year' && 'Last 5 years'}
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {monthlyData.map((data: MonthlyData) => {
              const maxAmount = Math.max(...monthlyData.map(d => d.amount));
              const width = (data.amount / maxAmount) * 100;
              const isPositive = data.growth > 0;
              
              return (
                <div key={data.month} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 sm:w-10 text-sm font-bold text-gray-700">{data.month}</div>
                      <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${
                        isPositive ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        <span>{Math.abs(data.growth)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-bold text-gray-900">₦{data.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl h-6 sm:h-8 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 h-6 sm:h-8 rounded-xl sm:rounded-2xl transition-all duration-1000 ease-out group-hover:shadow-lg relative overflow-hidden"
                        style={{ width: `${width}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile-Optimized Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Transactions</h3>
                  <p className="text-sm sm:text-base text-gray-600">Your payment history</p>
                </div>
              </div>
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredTransactions.map((transaction: Transaction) => (
                <div key={transaction.id} className="group p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg border border-gray-100">
                  
                  {/* Mobile Layout - Vertical Stack */}
                  <div className="flex flex-col sm:hidden space-y-3">
                    {/* Top Row: Avatar, Service, Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {getClientInitials(transaction.client)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{getCategoryIcon(transaction.category)}</span>
                            <h4 className="font-bold text-gray-900 text-sm truncate">
                              {transaction.service}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">{transaction.client}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-emerald-600 mb-1">
                          ₦{transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Bottom Row: Payment Method, Date, Status */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(transaction.method)}
                          <span className="text-gray-600">{transaction.method}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1 capitalize">{transaction.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout - Horizontal */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {getClientInitials(transaction.client)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {transaction.service}
                          </h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            <span className="ml-1">{transaction.status}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">{transaction.client}</span>
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(transaction.method)}
                            <span>{transaction.method}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600 mb-1">
                        ₦{transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-sm sm:text-base">No transactions found</p>
                <p className="text-gray-400 text-xs sm:text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;