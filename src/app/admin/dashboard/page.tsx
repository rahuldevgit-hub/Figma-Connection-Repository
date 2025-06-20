'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { DollarSign, Users, RefreshCw, Tag, UserCheck, Calendar, TrendingUp, Star } from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import RatingChart from './RatingChart';
import RevenueChart from './RevenueChart';
import LiveScheduleCalendar from './LiveScheduleCalendar';
import CustomerExpertDoughnut from './CustomerExpertDoughnut';
import ComparisonChart from './ComparisonChart';
const summaryData = [{
  title: 'Total Refunds',
  value: '₹2,45,000',
  icon: RefreshCw,
  change: '+12%',
  color: 'bg-red-500'
}, {
  title: 'Total Recharge',
  value: '₹8,95,000',
  icon: DollarSign,
  change: '+18%',
  color: 'bg-green-500'
}, {
  title: 'Total Categories',
  value: '24',
  icon: Tag,
  change: '+3%',
  color: 'bg-blue-500'
}, {
  title: 'Total Customers',
  value: '1,245',
  icon: Users,
  change: '+8%',
  color: 'bg-purple-500'
}, {
  title: 'Total Experts',
  value: '89',
  icon: UserCheck,
  change: '+5%',
  color: 'bg-orange-500'
}];
const barData = [{
  name: 'Jan',
  refunds: 4000
}, {
  name: 'Feb',
  refunds: 3000
}, {
  name: 'Mar',
  refunds: 2000
}, {
  name: 'Apr',
  refunds: 2780
}, {
  name: 'May',
  refunds: 1890
}, {
  name: 'Jun',
  refunds: 2390
}];
const lineData = [{
  name: 'Jan',
  recharge: 4000
}, {
  name: 'Feb',
  recharge: 3000
}, {
  name: 'Mar',
  recharge: 2000
}, {
  name: 'Apr',
  recharge: 2780
}, {
  name: 'May',
  recharge: 1890
}, {
  name: 'Jun',
  recharge: 2390
}];
const pieData = [{
  name: 'Customers',
  value: 400,
  color: '#8884d8'
}, {
  name: 'Experts',
  value: 300,
  color: '#82ca9d'
}];
const refundData = [{
  id: 1,
  customer: 'John Doe',
  amount: '₹500',
  status: 'Pending',
  date: '2024-01-15'
}, {
  id: 2,
  customer: 'Jane Smith',
  amount: '₹750',
  status: 'Approved',
  date: '2024-01-14'
}, {
  id: 3,
  customer: 'Bob Wilson',
  amount: '₹300',
  status: 'Rejected',
  date: '2024-01-13'
}, {
  id: 4,
  customer: 'Alice Johnson',
  amount: '₹1200',
  status: 'Pending',
  date: '2024-01-12'
}, {
  id: 5,
  customer: 'Charlie Brown',
  amount: '₹450',
  status: 'Approved',
  date: '2024-01-11'
}];
const consultationData = [{
  id: 1,
  customer: 'Sarah Wilson',
  expert: 'Dr. Smith',
  duration: '30 min',
  status: 'Completed'
}, {
  id: 2,
  customer: 'Mike Johnson',
  expert: 'Dr. Brown',
  duration: '45 min',
  status: 'Ongoing'
}, {
  id: 3,
  customer: 'Lisa Davis',
  expert: 'Dr. Wilson',
  duration: '20 min',
  status: 'Scheduled'
}, {
  id: 4,
  customer: 'Tom Anderson',
  expert: 'Dr. Johnson',
  duration: '35 min',
  status: 'Completed'
}, {
  id: 5,
  customer: 'Emma Taylor',
  expert: 'Dr. Lee',
  duration: '25 min',
  status: 'Completed'
}];
const rechargeData = [{
  id: 1,
  customer: 'David Miller',
  amount: '₹1000',
  method: 'UPI',
  status: 'Success'
}, {
  id: 2,
  customer: 'Jennifer White',
  amount: '₹500',
  method: 'Card',
  status: 'Success'
}, {
  id: 3,
  customer: 'Robert Garcia',
  amount: '₹2000',
  method: 'Net Banking',
  status: 'Pending'
}, {
  id: 4,
  customer: 'Maria Rodriguez',
  amount: '₹750',
  method: 'UPI',
  status: 'Success'
}, {
  id: 5,
  customer: 'James Wilson',
  amount: '₹1500',
  method: 'Card',
  status: 'Failed'
}];
const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  return <div className="space-y-6">
        <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {summaryData.map((item, index) => {
          const Icon = item.icon;
          return <div key={index} className="bg-white p-6 rounded-lg shadow-lg border ">
                <div className="flex items-center ">
                  <div className={`${item.color} p-3 rounded-lg mr-4`} >
                    {/* transform transition-transform duration-700 transition group-hover:rotate-[360deg] */}
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{item.title}</p>
                    <p className="text-gray-700 font-medium text-sm">{item.value}</p>
                    <p className="text-sm text-green-600">{item.change}</p>
                  </div>
                </div>
              </div>;
        })}
        </div>

        {/* Performance and Comparison Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart />
          <ComparisonChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingChart />
          <LiveScheduleCalendar />
</div>
        {/* Calendar and Revenue Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
           <CustomerExpertDoughnut />
        </div>

      

      

        {/* Original Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-base font-medium text-gray-900 mb-4">Total Refunds</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="refunds" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-base font-medium text-gray-900 mb-4">Total Recharge</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="recharge" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Tables */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
          {/* Last 5 Refund Requests */}
          {/* <div className="bg-white p-6 rounded-lg shadow-sm border"> */}
            {/* <h3 className="text-base font-medium text-gray-900 mb-4">Last 5 Refund Requests</h3> */}
            {/* <div className="overflow-x-auto"> */}
              {/* <table className="min-w-full divide-y divide-gray-200"> */}
                {/* <thead className="bg-gray-50"> */}
                  {/* <tr> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th> */}
                  {/* </tr> */}
                {/* </thead> */}
                {/* <tbody className="bg-white divide-y divide-gray-200"> */}
                  {/* {refundData.map(row => <tr key={row.id}> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer}</td> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.amount}</td> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap"> */}
                        {/* <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.status === 'Approved' ? 'bg-green-100 text-green-800' : row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}> */}
                          {/* {row.status} */}
                        {/* </span> */}
                      {/* </td> */}
                    {/* </tr>)} */}
                {/* </tbody> */}
              {/* </table> */}
            {/* </div> */}
          {/* </div> */}

          {/* Last 5 Consultations */}
          {/* <div className="bg-white p-6 rounded-lg shadow-sm border"> */}
            {/* <h3 className="text-base font-medium text-gray-900 mb-4">Last 5 Consultations</h3> */}
            {/* <div className="overflow-x-auto"> */}
              {/* <table className="min-w-full divide-y divide-gray-200"> */}
                {/* <thead className="bg-gray-50"> */}
                  {/* <tr> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expert</th> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th> */}
                  {/* </tr> */}
                {/* </thead> */}
                {/* <tbody className="bg-white divide-y divide-gray-200"> */}
                  {/* {consultationData.map(row => <tr key={row.id}> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer}</td> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.expert}</td> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap"> */}
                        {/* </div><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.status === 'Completed' ? 'bg-green-100 text-green-800' : row.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}> */}
                          {/* {row.status} */}
                        {/* </span> */}
                      {/* </td> */}
                    {/* </tr>)} */}
                {/* </tbody> */}
              {/* </table> */}
             {/* </div> */}
           {/* </div> */}

          {/* Last 5 Recharge Done */}
           {/* <div className="bg-white p-6 rounded-lg shadow-sm border"> */}
            {/* <h3 className="text-base font-medium text-gray-900 mb-4">Last 5 Recharge Done</h3> */}
            {/* <div className="overflow-x-auto"> */}
              {/* <table className="min-w-full divide-y divide-gray-200"> */}
                {/* <thead className="bg-gray-50"> */}
                  {/* <tr> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th> */}
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th> */}
                  {/* </tr> */}
                {/* </thead> */}
                {/* <tbody className="bg-white divide-y divide-gray-200"> */}
                  {/* {rechargeData.map(row => <tr key={row.id}> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer}</td> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.amount}</td> */}
                      {/* <td className="px-4 py-4 whitespace-nowrap"> */}
                        {/* <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.status === 'Success' ? 'bg-green-100 text-green-800' : row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}> */}
                          {/* {row.status} */}
                        {/* </span> */}
                      {/* </td> */}
                    {/* </tr>)} */}
                {/* </tbody> */}
              {/* </table> */}
            {/* </div> */}
          {/* </div> */}
        {/* // </div> */}
      </div>
 
};
export default DashboardPage;