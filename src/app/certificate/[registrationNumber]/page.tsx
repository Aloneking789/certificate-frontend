"use client"
import { useParams } from 'next/navigation';
import { getCertificateByReg } from '@/app/lib/mock-data';
import { CertificateTemplate } from '@/components/certificate/CertificateTemplate';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CertificatePreviewPage() {
  const params = useParams();
  const regNumber = params.registrationNumber as string;
  const certificate = getCertificateByReg(regNumber);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-12 px-4">
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

      <div className="hidden print:block">
        <CertificateTemplate data={certificate} />
      </div>
    </div>
  );
}
