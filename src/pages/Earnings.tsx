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
  AlertCircle
} from 'lucide-react';

const Earnings: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const earningsData = {
    total: 2850,
    thisMonth: 890,
    lastMonth: 750,
    pending: 125,
    growth: 18.7
  };

  const transactions = [
    {
      id: 1,
      client: 'Sarah Johnson',
      service: 'Deep House Cleaning',
      amount: 75,
      date: '2025-01-06',
      status: 'completed',
      method: 'Credit Card'
    },
    {
      id: 2,
      client: 'Mike Chen',
      service: 'Plumbing Repair',
      amount: 120,
      date: '2025-01-06',
      status: 'completed',
      method: 'Cash'
    },
    {
      id: 3,
      client: 'Emma Wilson',
      service: 'Garden Maintenance',
      amount: 60,
      date: '2025-01-05',
      status: 'completed',
      method: 'Bank Transfer'
    },
    {
      id: 4,
      client: 'David Brown',
      service: 'Bathroom Deep Clean',
      amount: 80,
      date: '2025-01-04',
      status: 'completed',
      method: 'Credit Card'
    },
    {
      id: 5,
      client: 'Lisa White',
      service: 'Kitchen Cleaning',
      amount: 55,
      date: '2025-01-03',
      status: 'pending',
      method: 'Credit Card'
    },
    {
      id: 6,
      client: 'Tom Garcia',
      service: 'Window Cleaning',
      amount: 70,
      date: '2025-01-02',
      status: 'pending',
      method: 'Bank Transfer'
    }
  ];

  const monthlyData = [
    { month: 'Jul', amount: 2200 },
    { month: 'Aug', amount: 2400 },
    { month: 'Sep', amount: 2100 },
    { month: 'Oct', amount: 2650 },
    { month: 'Nov', amount: 2300 },
    { month: 'Dec', amount: 2850 },
    { month: 'Jan', amount: 890 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'Bank Transfer':
        return <Wallet className="w-4 h-4 text-green-500" />;
      case 'Cash':
        return <DollarSign className="w-4 h-4 text-gray-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600">Track your income and payment history</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${earningsData.total.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{earningsData.growth}% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${earningsData.thisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-blue-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +${earningsData.thisMonth - earningsData.lastMonth} vs last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${earningsData.pending}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            2 payments processing
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Job</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${Math.round(earningsData.total / 47)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Based on 47 completed jobs
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Earnings Trend</h3>
          <div className="text-sm text-gray-600">Last 7 months</div>
        </div>
        
        <div className="space-y-4">
          {monthlyData.map((data, index) => {
            const maxAmount = Math.max(...monthlyData.map(d => d.amount));
            const width = (data.amount / maxAmount) * 100;
            
            return (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-gray-600">{data.month}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-500"
                    style={{ width: `${width}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-sm font-medium text-white">${data.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.service}</h4>
                    <p className="text-sm text-gray-600">{transaction.client}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {getPaymentMethodIcon(transaction.method)}
                    <span>{transaction.method}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${transaction.amount}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;