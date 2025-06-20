
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const revenueData = [
  { month: 'Jan', actual: 45000, projected: 42000 },
  { month: 'Feb', actual: 52000, projected: 48000 },
  { month: 'Mar', actual: 48000, projected: 50000 },
  { month: 'Apr', actual: 61000, projected: 55000 },
  { month: 'May', actual: 58000, projected: 60000 },
  { month: 'Jun', actual: 67000, projected: 65000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const actual = payload.find((p: any) => p.dataKey === 'actual');
    const projected = payload.find((p: any) => p.dataKey === 'projected');
    const difference = actual?.value - projected?.value;
    const percentage = ((difference / projected?.value) * 100).toFixed(1);
    
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">Actual: ₹{actual?.value.toLocaleString()}</p>
        <p className="text-gray-600">Projected: ₹{projected?.value.toLocaleString()}</p>
        <p className={`text-sm ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {difference >= 0 ? '+' : ''}{percentage}% vs projected
        </p>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const totalActual = revenueData.reduce((sum, item) => sum + item.actual, 0);
  const totalProjected = revenueData.reduce((sum, item) => sum + item.projected, 0);
  const overallChange = ((totalActual - totalProjected) / totalProjected * 100).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Revenue Analytics</h3>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="h-5 w-5" />
          <span className="font-medium">+{overallChange}% vs projected</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Actual Revenue"
            dot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="projected" 
            stroke="#94a3b8" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Projected Revenue"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
