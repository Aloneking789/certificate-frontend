"use client"
import React from 'react';
import { Certificate } from '@/app/lib/mock-data';
import { QRCode } from './QRCode';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function CertificateTemplate({ data }: { data: Certificate }) {
  const logo = PlaceHolderImages.find(img => img.id === 'company-logo')?.imageUrl;

  return (
    <div className="relative w-full max-w-[1100px] aspect-[1.414/1] bg-white border-[16px] border-primary/10 shadow-2xl p-12 overflow-hidden print:m-0 print:border-[10px] mx-auto">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-primary/5 rounded-br-full -translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-tl-full translate-x-12 translate-y-12" />

      {/* Header section */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col gap-2">
          {logo && <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />}
          <div className="mt-2">
            <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Eunous IT</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Excellence in Technology</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Registration No.</p>
          <p className="text-sm font-code font-bold text-primary">{data.registrationNumber}</p>
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Issue Date</p>
            <p className="text-sm font-semibold text-primary">{data.issueDate}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-headline font-bold text-primary mb-8 tracking-tight uppercase">Certificate of Internship</h2>
        <p className="text-lg text-muted-foreground mb-6">This is to certify that</p>
        <h3 className="text-4xl font-headline font-bold text-accent mb-6 italic underline decoration-primary/20 underline-offset-8">
          {data.studentName}
        </h3>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-muted-foreground">
          Son/Daughter of <span className="text-primary font-semibold">{data.fatherName}</span>, 
          a student of <span className="text-primary font-semibold">{data.courseName} ({data.branch})</span> 
          at <span className="text-primary font-semibold">{data.collegeName}</span>, 
          has successfully completed a <span className="text-primary font-semibold">{data.internshipDomain}</span> internship.
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-8 mb-12 border-y border-primary/10 py-8 text-center bg-primary/[0.02] rounded-xl">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Duration</p>
          <p className="text-md font-semibold text-primary">{data.startDate} to {data.endDate}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Hours</p>
          <p className="text-md font-semibold text-primary">{data.totalHours} Hours</p>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Performance</p>
          <p className="text-md font-semibold text-primary">{data.performance}</p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-end mt-auto">
        <div className="flex flex-col items-center">
          <QRCode value={`https://certificate-frontend-navy.vercel.app/certificate/${encodeURIComponent(data.registrationNumber)}`} size={100} />
          <p className="text-[10px] mt-2 text-muted-foreground font-code">Verify authenticity</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-48 border-b-2 border-primary mb-2" />
          <p className="text-sm font-bold text-primary">{data.authorizedSignatory}</p>
          <p className="text-xs text-muted-foreground">Authorized Signatory</p>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 w-full text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Corporate Office: Bangalore, India | eunousit.com | info@eunousit.com
        </p>
      </div>
    </div>
  );
}
