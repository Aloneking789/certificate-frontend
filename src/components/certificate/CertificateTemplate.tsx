"use client"
import React from 'react';
import { Certificate } from '@/app/lib/mock-data';
import { QRCode } from './QRCode';
import logoImg from '../../logo.jpg';
import signImg from '../../sign.jpg';
import type { StaticImageData } from 'next/image';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function CertificateTemplate({ data }: { data: Certificate }) {
  const logo = logoImg;
  const signature = signImg;

  const logoUrl: string = typeof logo === 'string' ? logo : (logo as StaticImageData).src;
  const signatureUrl: string = typeof signature === 'string' ? signature : (signature as StaticImageData).src;

  return (
    <div
      className="cert-root relative w-full max-w-[1120px] mx-auto print:m-0"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 5mm; }
          body, html { margin: 0 !important; padding: 0 !important; }
          .cert-root { width: 100% !important; max-width: 100% !important; page-break-inside: avoid; }
          .cert-band {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
        .cert-band {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
        }
      `}</style>
      {/* Outer gold border frame */}
      <div
        className="relative bg-white shadow-2xl print:shadow-none overflow-hidden"
        style={{
          border: '3px solid #b8973a',
          padding: '6px',
        }}
      >
        {/* Inner decorative border */}
        <div
          className="relative"
          style={{
            border: '1.5px solid #d4b05a',
            padding: '0',
            background: '#fff',
          }}
        >

          {/* ── TOP HEADER BAND ── */}
          <div
            className="cert-band"
            style={{
              background: 'linear-gradient(135deg, #0a2342 0%, #163a6b 50%, #0a2342 100%)',
              padding: '16px 40px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid #b8973a',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  style={{
                    width: 220,
                    height: 'auto',
                    objectFit: 'contain',
                    background: '#fff',
                    borderRadius: 6,
                    padding: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  }}
                />
              )}
              <div>
                <div style={{ color: '#d4b05a', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Georgia, serif', marginBottom: 2 }}>
                  Eunous IT Pvt. Limited
                </div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9.5, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
                  Training & Certification Division
                </div>
              </div>
            </div>

            {/* Center ornament */}
            <div style={{ textAlign: 'center', flex: 1, padding: '0 32px' }}>
              {/* Decorative rule with star */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, #d4b05a)' }} />
                <span style={{ color: '#d4b05a', fontSize: 18 }}>✦</span>
                <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, #d4b05a)' }} />
              </div>
              <div style={{ color: '#d4b05a', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
                Est. 2017 · Jaipur, India
              </div>
            </div>

            {/* Reg No & Status */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
                Registration No.
              </div>
              <div style={{ color: '#d4b05a', fontSize: 13, fontFamily: 'Courier New, monospace', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>
                {data.registrationNumber}
              </div>
              {data.status === 'valid' ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(52, 199, 89, 0.15)', border: '1px solid rgba(52,199,89,0.4)',
                  color: '#4cd964', padding: '4px 12px', borderRadius: 20, fontSize: 10,
                  fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  <CheckCircle2 size={12} />
                  Verified
                </div>
              ) : (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.35)',
                  color: '#ff6b6b', padding: '4px 12px', borderRadius: 20, fontSize: 10,
                  fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  <AlertCircle size={12} />
                  Not Verified
                </div>
              )}
            </div>
          </div>

          {/* ── MAIN BODY ── */}
          <div style={{ padding: '20px 48px 18px', position: 'relative' }}>

            {/* Watermark text */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: 110, fontFamily: 'Georgia, serif', fontWeight: 700,
              color: 'rgba(10,35,66,0.03)', letterSpacing: '-0.02em',
              whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
              zIndex: 0,
            }}>
              INTERNSHIP
            </div>

            {/* Title block */}
            <div style={{ textAlign: 'center', marginBottom: 16, position: 'relative', zIndex: 1 }}>
              {/* Top ornament line */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 10 }}>
                <div style={{ height: 1, flex: 1, maxWidth: 140, background: 'linear-gradient(to right, transparent, #b8973a)' }} />
                <span style={{ color: '#b8973a', fontSize: 14, letterSpacing: 4 }}>✦ ✦ ✦</span>
                <div style={{ height: 1, flex: 1, maxWidth: 140, background: 'linear-gradient(to left, transparent, #b8973a)' }} />
              </div>

              <div style={{
                fontSize: 10.5, letterSpacing: '0.4em', textTransform: 'uppercase',
                color: '#8a7240', fontFamily: 'Georgia, serif', marginBottom: 10,
              }}>
                This Certificate is Proudly Presented To
              </div>

              <h2 style={{
                fontSize: 34, fontFamily: 'Georgia, serif', fontWeight: 700,
                color: '#0a2342', letterSpacing: '0.05em', textTransform: 'uppercase',
                margin: '0 0 4px',
                textShadow: '0 1px 0 rgba(184,151,58,0.15)',
                lineHeight: 1.1,
              }}>
                Certificate of Internship
              </h2>

              {/* Gold underline */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 3, margin: '6px 0 12px' }}>
                <div style={{ height: 3, width: 80, background: '#b8973a', borderRadius: 2 }} />
                <div style={{ height: 3, width: 16, background: '#d4b05a', borderRadius: 2 }} />
                <div style={{ height: 3, width: 6, background: '#e8c87a', borderRadius: 2 }} />
              </div>

              <p style={{ fontSize: 13, color: '#5a6070', marginBottom: 8, fontStyle: 'italic', letterSpacing: '0.03em' }}>
                This is to certify that
              </p>

              {/* Student name */}
              <div style={{
                display: 'inline-block',
                borderBottom: '2.5px solid #b8973a',
                paddingBottom: 4,
                marginBottom: 10,
              }}>
                <h3 style={{
                  fontSize: 32, fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  fontWeight: 700, color: '#163a6b', margin: 0,
                  letterSpacing: '0.04em',
                }}>
                  {data.studentName}
                </h3>
              </div>

              {/* Body paragraph */}
              <p style={{
                maxWidth: 680, margin: '0 auto', fontSize: 13.5,
                lineHeight: 1.75, color: '#444c5c',
                fontFamily: 'Georgia, serif',
              }}>
                {(data.gender === 'Female') ? 'Daughter' : 'Son'} of{' '}
                <strong style={{ color: '#0a2342' }}>{`Mr. ${data.fatherName}`}</strong>,
                a student of{' '}
                <strong style={{ color: '#0a2342' }}>{data.courseName} ({data.branch})</strong>{' '}
                at{' '}
                <strong style={{ color: '#0a2342' }}>{data.collegeName}</strong>,
                has successfully completed an internship programme in{' '}
                <strong style={{ color: '#0a2342' }}>{data.internshipDomain}</strong>{' '}
                with dedication, professionalism, and commendable performance throughout the tenure.
              </p>
            </div>

            {/* ── DETAILS STRIP ── */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
              border: '1.5px solid #d4b05a',
              borderRadius: 8, overflow: 'hidden',
              marginBottom: 18,
              background: 'linear-gradient(to bottom, #fffdf5, #fff)',
              position: 'relative', zIndex: 1,
            }}>
              {[
                { label: 'Duration', value: `${data.startDate} — ${data.endDate}` },
                null,
                { label: 'Total Hours', value: `${data.totalHours} Hours` },
                null,
                { label: 'Performance', value: data.performance },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} style={{ background: '#d4b05a', width: 1 }} />
                ) : (
                  <div key={i} style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{
                      fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
                      color: '#8a7240', fontWeight: 700, marginBottom: 6,
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2342', fontFamily: 'Georgia, serif' }}>
                      {item.value}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* ── FOOTER ROW: QR + Issue date + Signature ── */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              position: 'relative', zIndex: 1,
            }}>
              {/* QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ padding: 6, border: '1.5px solid #d4b05a', borderRadius: 6, background: '#fff' }}>
                  <QRCode
                    value={`https://certificate-frontend-navy.vercel.app/certificate/${encodeURIComponent(data.registrationNumber)}`}
                    size={80}
                  />
                </div>
                <span style={{ fontSize: 9, color: '#8a7240', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Scan to Verify
                </span>
              </div>

              {/* Issue Date center */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8a7240', marginBottom: 4 }}>
                  Date of Issue
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2342', fontFamily: 'Georgia, serif' }}>
                  {data.issueDate}
                </div>

                {/* Bottom ornament */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 }}>
                  <div style={{ height: 1, width: 48, background: 'linear-gradient(to right, transparent, #b8973a)' }} />
                  <span style={{ color: '#b8973a', fontSize: 13 }}>✦</span>
                  <div style={{ height: 1, width: 48, background: 'linear-gradient(to left, transparent, #b8973a)' }} />
                </div>
              </div>

              {/* Signature */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {signatureUrl && (
                  <img
                    src={signatureUrl}
                    alt="Signature"
                    style={{ width: 148, height: 'auto', objectFit: 'contain', marginBottom: 4, filter: 'grayscale(0.05)' }}
                  />
                )}
                <div style={{ width: 180, height: 1.5, background: '#0a2342', marginBottom: 6 }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2342', fontFamily: 'Georgia, serif' }}>
                  {data.authorizedSignatory}
                </div>
                <div style={{ fontSize: 9.5, color: '#8a7240', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM FOOTER BAND ── */}
          <div
            className="cert-band"
            style={{
            background: 'linear-gradient(135deg, #0a2342 0%, #163a6b 50%, #0a2342 100%)',
            borderTop: '3px solid #b8973a',
            padding: '10px 40px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <img
              src={logoUrl}
              alt="Logo"
              style={{ width: 64, height: 'auto', objectFit: 'contain', background: '#fff', borderRadius: 4, padding: 3 }}
            />

            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9.5, letterSpacing: '0.1em', margin: 0 }}>
                Plot No 4, Devinagar, New Saganer Road, Jaipur – 302019
              </p>
              <p style={{ color: 'rgba(212,176,90,0.8)', fontSize: 9.5, letterSpacing: '0.1em', margin: '3px 0 0' }}>
                info@euonusit.com &nbsp;·&nbsp; eunousit.com
              </p>
            </div>

            <div style={{ fontSize: 9, color: 'rgba(212,176,90,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'right' }}>
              Eunous IT<br />Pvt. Limited
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}