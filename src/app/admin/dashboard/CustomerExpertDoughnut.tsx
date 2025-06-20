import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, UserCheck } from 'lucide-react';
const customerExpertData = [{
  name: 'Patients',
  value: 1245,
  color: '#3b82f6'
}, {
  name: 'Experts',
  value: 126,
  color: '#10b981'
}];
const total = customerExpertData.reduce((sum, item) => sum + item.value, 0);
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
const total1 = communicationData.reduce((sum, item) => sum + item.value, 0);
const renderCustomizedLabel1 = ({
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
const CustomerExpertDoughnut = () => {
  return( 
  <>

  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className='flex'>
    <div>
    
      <h3 className="text-lg font-medium text-gray-900 ">Customer & Expert Distribution</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={customerExpertData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} innerRadius={40} fill="#8884d8" dataKey="value">
              {customerExpertData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={value => [value.toLocaleString(), 'Count']} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-medium text-gray-900 text-base">{total.toLocaleString()}</p>
            <p className="text-gray-600 text-xs">Total Users</p>
          </div>
        </div>
      </div>
       
      <div className="grid gap-10 ">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Users className="h-8 w-6 text-blue-600" />
          <div>
            <p className="text-lg font-medium text-blue-900">1,245</p>
            <p className="text-sm text-blue-700">Customres</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <UserCheck className="h-8 w-8 text-green-600" />
          <div>
            <p className="text-lg font-medium text-green-900">126</p>
            <p className="text-sm text-green-700">Experts</p>
          </div>
        </div>
      </div>
      </div>
          <div>          
          <div className="relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={communicationData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel1} outerRadius={80} innerRadius={40} fill="#8884d8" dataKey="value">
                  {communicationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={value => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-medium text-gray-900 text-base">₹{(total1 / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            {communicationData.map((item, index) => {
            const Icon = item.icon;
            const percentage = (item.value / total1 * 100).toFixed(1);
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
                    </div>
                  </div>
                  <p className="font-medium text-gray-800">₹{item.value.toLocaleString()}</p>
                </div>;
          })}
          </div>
        </div>;
        </div>;
        </div>
    
    </>
    );
};
export default CustomerExpertDoughnut;