"use client"
import { useParams } from 'next/navigation';
import { CertificateTemplate } from '@/components/certificate/CertificateTemplate';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CertificatePreviewPage() {
  const params = useParams();
  // the route still uses [registrationNumber] in the file name for compatibility with routing,
  // but we treat the param as a certificateNumber (preferred) and fall back as needed.
  const certParam = (params.registrationNumber || params.certificateNumber) as string;
  const [certificate, setCertificate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCert = async () => {
      setLoading(true);
      try {
        // prefer the certificate-number proxy endpoint (backend returns { success: true, data: { ... } })
        const res = await fetch(`/api/certificates/number/${encodeURIComponent(certParam)}`);
        const data = await res.json();
        if (res.ok && data?.data) {
          const c = data.data;
          // Map backend fields to template fields
          const mapped = {
            id: String(c.id),
            registrationNumber: c.registrationNumber,
            certificateNumber: c.certificateNumber || c.registrationNumber,
            studentRoll: c.studentRoll || c.studentRoll || '',
            studentName: c.fullName,
            fatherName: c.fatherName || '',
            courseName: c.courseName || '',
            collegeName: c.collegeName || '',
            branch: c.branch || '',
            semester: c.semester || '',
            internshipDomain: c.internshipDomain || '',
            startDate: c.startDate ? new Date(c.startDate).toLocaleDateString() : '',
            endDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : '',
            totalHours: c.totalHours || 0,
            performance: c.performance || 'Very Good',
            issueDate: c.certificateIssueDate ? new Date(c.certificateIssueDate).toLocaleDateString() : (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''),
            authorizedSignatory: c.authorizedSignatory || 'Authorized Signatory',
            status: c.isVerified ? 'valid' : 'invalid'
          };

          if (mounted) setCertificate(mapped);
        } else {
          if (mounted) setCertificate(null);
        }
      } catch (err) {
        if (mounted) setCertificate(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCert();
    return () => { mounted = false };
  }, [certParam]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <p>Loading...</p>
    </div>
  );

  if (!certificate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
        <Link href="/verify">
          <Button>Back to Verification</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 py-12 px-4">
      <style>{`@media print{body *{visibility:hidden!important}.print-only,.print-only *{visibility:visible!important}.print-only{position:absolute;left:0;top:0;width:100%}}`}</style>
      <div className="max-w-[1100px] mx-auto mb-8 flex justify-between items-center no-print">
        <Link href={`/verify`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Verification
          </Button>
        </Link>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print Certificate
          </Button>
          <Button className="gap-2 bg-primary" onClick={handlePrint}>
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="shadow-2xl no-print mb-12">
        <CertificateTemplate data={certificate} />
      </div>

      <div className="hidden print:block print-only">
        <CertificateTemplate data={certificate} />
      </div>
    </div>
  );
}
