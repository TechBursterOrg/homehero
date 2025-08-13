import React, { useState } from 'react';
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
  Star,
  Award,
  Activity,
  Zap,
  Target,
  ChevronRight,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Filter,
  Search
} from 'lucide-react';

const Earnings: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

  const earningsData = {
    total: 2850,
    thisMonth: 890,
    lastMonth: 750,
    pending: 125,
    growth: 18.7,
    avgPerJob: 60
  };

  const transactions = [
    {
      id: 1,
      client: 'Sarah Johnson',
      service: 'Deep House Cleaning',
      amount: 75,
      date: '2025-01-06',
      status: 'completed',
      method: 'Credit Card',
      category: 'cleaning'
    },
    {
      id: 2,
      client: 'Mike Chen',
      service: 'Plumbing Repair',
      amount: 120,
      date: '2025-01-06',
      status: 'completed',
      method: 'Cash',
      category: 'handyman'
    },
    {
      id: 3,
      client: 'Emma Wilson',
      service: 'Garden Maintenance',
      amount: 60,
      date: '2025-01-05',
      status: 'completed',
      method: 'Bank Transfer',
      category: 'gardening'
    },
    {
      id: 4,
      client: 'David Brown',
      service: 'Bathroom Deep Clean',
      amount: 80,
      date: '2025-01-04',
      status: 'completed',
      method: 'Credit Card',
      category: 'cleaning'
    },
    {
      id: 5,
      client: 'Lisa White',
      service: 'Kitchen Cleaning',
      amount: 55,
      date: '2025-01-03',
      status: 'pending',
      method: 'Credit Card',
      category: 'cleaning'
    },
    {
      id: 6,
      client: 'Tom Garcia',
      service: 'Window Cleaning',
      amount: 70,
      date: '2025-01-02',
      status: 'pending',
      method: 'Bank Transfer',
      category: 'cleaning'
    }
  ];

  const monthlyData = [
    { month: 'Jul', amount: 2200, growth: 5.2 },
    { month: 'Aug', amount: 2400, growth: 9.1 },
    { month: 'Sep', amount: 2100, growth: -12.5 },
    { month: 'Oct', amount: 2650, growth: 26.2 },
    { month: 'Nov', amount: 2300, growth: -13.2 },
    { month: 'Dec', amount: 2850, growth: 23.9 },
    { month: 'Jan', amount: 890, growth: 18.7 }
  ];

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return '🧽';
      case 'handyman': return '🔧';
      case 'gardening': return '🌿';
      case 'petcare': return '🐾';
      case 'childcare': return '👶';
      default: return '💼';
    }
  };

  const getClientInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Mobile-Optimized Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Earnings Overview 💰
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg">Track your income and financial performance</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm font-medium transition-all duration-200"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-emerald-600">
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${earningsData.total.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-emerald-600 font-semibold">+{earningsData.growth}%</span>
                <span className="text-gray-500">from last month</span>
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
              <p className="text-xs sm:text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${earningsData.thisMonth}</p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-blue-600 font-semibold">+${earningsData.thisMonth - earningsData.lastMonth}</span>
                <span className="text-gray-500">vs last month</span>
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
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${earningsData.pending}</p>
              <div className="text-xs sm:text-sm text-gray-500">
                2 payments processing
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-purple-600">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg per Job</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${earningsData.avgPerJob}</p>
              <div className="text-xs sm:text-sm text-gray-500">
                Based on 47 completed jobs
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
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Monthly Earnings Trend</h3>
                <p className="text-sm sm:text-base text-gray-600">Performance over the last 7 months</p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl self-start sm:self-center">
              Last 7 months
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {monthlyData.map((data, index) => {
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
                      <span className="text-base sm:text-lg font-bold text-gray-900">${data.amount.toLocaleString()}</span>
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
          <div className="p-4 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Transactions</h3>
                  <p className="text-sm sm:text-base text-gray-600">Your latest payment activities</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
                <button className="p-2.5 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl transition-colors">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-8">
            <div className="space-y-3 sm:space-y-4">
              {filteredTransactions.map((transaction) => (
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
                          ${transaction.amount}
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
                        ${transaction.amount}
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