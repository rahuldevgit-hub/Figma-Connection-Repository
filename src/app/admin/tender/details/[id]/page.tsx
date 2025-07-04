'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { getTenderById } from '@/services/tendersService';

const TenderDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTender = async () => {
      try {
        const data = await getTenderById(Number(id));
        setTender(data);
      } catch (error) {
        console.error('Failed to fetch tender:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!tender) {
    return <div className="p-4 text-center text-red-500">Tender not found.</div>;
  }

  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleString() : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-9xl mx-auto px-4">
          <div className="flex h-12 items-center space-x-4 text-black">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xl">Back</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-9xl mx-auto px-4 py-4">
        <Card className="w-full bg-white shadow-xl mb-4">
          <h2 className="text-xl font-medium text-gray-900 mb-2 p-4">Tender Detail</h2>
          <CardContent>
            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column */}
              <div className="space-y-1">
                {[
                  { label: "Reference", value: tender.ref_id },
                  { label: "Title", value: tender.title },
                  { label: "Currency", value: tender.currency },
                  { label: "Budget", value: tender.ten_cost || "N/A" },
                  { label: "Bid Validity (Days)", value: tender.bidvalidity },
                  { label: "Tender Open Date", value: formatDate(tender.topen_date), color: "text-green-600" },
                  { label: "Tender Close Date", value: formatDate(tender.tclose_date), color: "text-red-600" },
                  { label: "eBox Email 1", value: tender.e_box1 },
                  { label: "eBox Email 2", value: tender.e_box2 },
                  { label: "Description", value: tender.ten_desc || "N/A" },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-1 border-b border-gray-200">
                    <div className={`font-medium ${item.color || "text-gray-700"}`}>{item.label}</div>
                    <div className="md:col-span-2 text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-1">
                {[
                  { label: "Evaluator Guide", value: tender.ten_evalutorguide },
                  { label: "Confidential Doc", value: tender.conf_doc },
                  { label: "Checklist", value: tender.comp_checklist },
                  { label: "Prequalification", value: tender.prequalifiaction },
                  { label: "Plan Document", value: tender.plandocument },
                  { label: "Appendices", value: tender.appendices },
                  { label: "Contract Doc", value: tender.contract_doc },
                  { label: "Payment Instructions", value: tender.paymentinstruct },
                ].map((doc, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-1 border-b border-gray-200">
                    <div className="font-medium text-gray-700">{doc.label}</div>
                    <div className="md:col-span-2">
                      {doc.value && doc.value !== "default.jpg" ? (
                        <a
                          href={`/uploads/tenderdocs/${doc.value}`}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          {doc.value}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not Available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluators */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Preapproved Evaluators</h3>
              <div className="space-y-1">
                {tender.invitedEvaluators?.length ? (
                  tender.invitedEvaluators.map((evalr: any, idx: number) => (
                    <div key={idx} className="text-xs border-b py-1 text-gray-900">
                      {evalr.user?.email} ({evalr.user?.name})
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No evaluators assigned.</div>
                )}
              </div>
            </div>

            {/* Suppliers */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Invited Suppliers</h3>
              <div className="space-y-1">
                {tender.InvitedSuppliers?.length ? (
                  tender.InvitedSuppliers.map((supp: any, idx: number) => (
                    <div key={idx} className="text-xs border-b py-1 text-gray-900">
                      {supp.username}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No suppliers invited.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TenderDetail;
