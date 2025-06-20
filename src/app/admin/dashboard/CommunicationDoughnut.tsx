import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Video, MessageCircle, Phone } from 'lucide-react';
const communicationData = [{
  name: 'Video Calls',
  value: 125000,
  color: '#3b82f6',
  icon: Video
}, {
  name: 'Chats',
  value: 75000,
  color: '#10b981',
  icon: MessageCircle
}, {
  name: 'Audio Calls',
  value: 45000,
  color: '#f59e0b',
  icon: Phone
}];
const total = communicationData.reduce((sum, item) => sum + item.value, 0);
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-sm font-medium">
      {`${(percent * 100).toFixed(0)}%`}
    </text>;
};
const CommunicationDoughnut = () => {
  return <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Communication Type</h3>
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={communicationData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} innerRadius={40} fill="#8884d8" dataKey="value">
              {communicationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={value => [`₹${value.toLocaleString()}`, 'Revenue']} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-medium text-gray-900 text-base">₹{(total / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-600">Total Revenue</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        {communicationData.map((item, index) => {
        const Icon = item.icon;
        const percentage = (item.value / total * 100).toFixed(1);
        return <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg`} style={{
              backgroundColor: `${item.color}20`
            }}>
                  <Icon className="h-5 w-5" style={{
                color: item.color
              }} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{percentage}% of total</p>
                </div>
              </div>
              <p className="font-medium text-gray-800">₹{item.value.toLocaleString()}</p>
            </div>;
      })}
      </div>
    </div>;
};
export default CommunicationDoughnut;