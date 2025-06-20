import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
const monthlyData = [{
  label: 'Total Revenue',
  current: 2240000,
  change: 45.5,
  trend: 'up',
  color: 'bg-green-500'
}, {
  label: 'Total Expenses',
  current: 1242000,
  change: -8.2,
  trend: 'down',
  color: 'bg-red-500'
}, {
  label: 'Net Profit',
  current: 998000,
  change: 12.8,
  trend: 'up',
  color: 'bg-blue-500'
}];
const topExpenses = [{
  category: 'Staff Salaries',
  amount: 485000,
  color: 'bg-blue-500'
}, {
  category: 'Equipment & Maint',
  amount: 342000,
  color: 'bg-green-500'
}, {
  category: 'Facility Rent',
  amount: 258000,
  color: 'bg-purple-500'
}, {
  category: 'Utilities',
  amount: 95000,
  color: 'bg-yellow-500'
}, {
  category: 'Marketing',
  amount: 62000,
  color: 'bg-orange-500'
}];
const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `₹${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount}`;
};
const ComparisonChart = () => {
  return <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Comparison</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Overview */}
        <div>
          <h4 className="text-base font-medium text-black mb-4">Financial Overview</h4>
          <div className="space-y-4">
            {monthlyData.map((item, index) => <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-900 font-normal">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.current)}
                    </span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${item.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(item.change)}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{
                width: `${Math.min(item.current / 2500000 * 100, 100)}%`
              }}></div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Top Expenses */}
        <div>
          <h4 className="text-base font-medium text-black mb-4">Top Expenses</h4>
          <div className="space-y-3">
            {topExpenses.map((expense, index) => <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${expense.color}`}></div>
                  <span className="text-sm text-gray-700 font-normal">{expense.category}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(expense.amount)}
                </span>
              </div>)}
          </div>
          
          {/* Mini Chart */}
          <div className="mt-6 p-4 place-content-center bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-2">Expense Distribution</div>
            <div className="flex h-4 rounded-full overflow-hidden">
              {topExpenses.map((expense, index) => <div key={index} className={expense.color} style={{
              width: `${expense.amount / topExpenses.reduce((sum, e) => sum + e.amount, 0) * 100}%`
            }}></div>)}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Salaries: 39%</span>
              <span>Equipment: 28%</span>
              <span>Others: 33%</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ComparisonChart;