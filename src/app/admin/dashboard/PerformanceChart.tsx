import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
const performanceData = [{
  name: 'Patient Satis ',
  value: 85,
  target: 90
}, {
  name: 'Diagnosis ',
  value: 72,
  target: 80
}, {
  name: 'Treatment ',
  value: 91,
  target: 85
}, {
  name: 'Timely Care',
  value: 88,
  target: 75
}]; 
const PerformanceChart = () => {
  return <div className="bg-white  text-sm p-6 rounded-lg shadow-sm border">
      <h3 className="font-medium text-gray-900 mb-4 text-lg">Performance Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={performanceData} margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5
      }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value, name) => [`${value}%`, name === 'value' ? 'Current' : 'Target']} />
          <Bar dataKey="value" fill="#3b82f6" name="Current Performance" />
          <Bar dataKey="target" fill="#e5e7eb" name="Target" />
        </BarChart>
      </ResponsiveContainer>
    </div>;
};
export default PerformanceChart;