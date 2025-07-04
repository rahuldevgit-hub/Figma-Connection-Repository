'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTenderById } from '@/services/tendersService';

export default function TenderDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTender = async () => {
      try {
        const data = await getTenderById(Number(id));
        console.log(data);
        
        setTender(data);
      } catch (error) {
        console.error('Failed to fetch tender:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!tender) return <div className="p-4 text-red-500">Tender not found.</div>;

  return (
    <div className="p-6">
       <h1 className="text-2xl font-medium text-gray-900">Tender Details</h1>
       <div className="text-l font-medium text-gray-900">
      <p><strong>ID:</strong> {tender.id}</p>
      <p><strong>Title:</strong> {tender.title}</p>
      <p><strong>Category:</strong> {tender.category?.name}</p>
      <p><strong>Ref ID:</strong> {tender.ref_id}</p>
      <p><strong>Status:</strong> {tender.status}</p>
      <p><strong>Short Description:</strong> {tender.ten_shortdescr}</p></div>
    </div>
  );
}
