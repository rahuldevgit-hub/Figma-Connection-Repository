'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Header from "@/components/ui/Header";

const AddTender = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    mobileNumber: '',
    address: '',
    landmark: '',
    state: '',
    experience: '',
    dateOfBirth: undefined as Date | undefined,
    gender: '',
    contactMethod: '',
    customerStatus: 'Active',
    categories: {
      healthcare: false,
      technology: false,
      education: false,
      finance: false,
      marketing: false,
      legal: false,
    },
    notes: ''
  });

  const handleBack = () => {
    router.push('/admin/tender');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: checked
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Add Customer</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-2 py-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
              <Input id="mobile" type="tel" value={formData.mobileNumber} onChange={(e) => handleInputChange('mobileNumber', e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="landmark">Landmark</Label>
              <Input id="landmark" value={formData.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} rows={3} />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="experience">Experience (years)</Label>
              <Input id="experience" type="number" value={formData.experience} onChange={(e) => handleInputChange('experience', e.target.value)} />
            </div>

            

            <div>
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferred Contact Method</Label>
              <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange('contactMethod', value)}>
                <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Customer Status</Label>
              <Select value={formData.customerStatus} onValueChange={(value) => handleInputChange('customerStatus', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {Object.entries(formData.categories).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox id={key} checked={value} onCheckedChange={(checked) => handleCategoryChange(key, checked as boolean)} />
                  <Label htmlFor={key} className="capitalize">{key}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="notes">Notes/Comments</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} rows={4} />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">Submit</Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddTender;
