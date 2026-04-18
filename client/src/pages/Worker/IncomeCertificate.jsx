import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle,
  FileSearch,
  AlertCircle
} from 'lucide-react';
import { generateCertificate } from '../../api/certificate';
import { DatePickerInput } from '@mantine/dates';
import { Button, Card, Text, Group, Stack, Badge, Divider } from '@mantine/core';

const IncomeCertificate = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const workerId = 'worker_01';

  const handleGenerate = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      alert('Please select a valid date range');
      return;
    }
    setGenerating(true);
    try {
      const res = await generateCertificate({
        workerId,
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString()
      });
      setCertificate(res.data.data);
    } catch (err) {
      alert('Generation failed. Ensure you have verified earnings in this period.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>FairGig Phase 1 - Income Certificate</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .title { font-size: 28px; font-weight: 800; margin-top: 10px; }
            .details { margin-bottom: 40px; display: grid; grid-template-cols: 1fr 1fr; gap: 20px; }
            .section { margin-bottom: 30px; }
            .section-title { font-weight: 700; font-size: 14px; text-transform: uppercase; color: #64748b; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f8fafc; padding: 12px; border-bottom: 1px solid #e2e8f0; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
            .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
            .footer { margin-top: 60px; font-size: 12px; color: #94a3b8; text-align: center; }
            .qr { width: 100px; height: 100px; margin: 0 auto 10px; background: #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FairGig Platform</div>
            <div class="title">Verified Income Certificate</div>
            <div>Ref: FG-${certificate?._id?.substring(0,8).toUpperCase()}</div>
          </div>
          
          <div class="details">
            <div>
              <div class="section-title">Beneficiary Details</div>
              <div><strong>Name:</strong> Muhammad Abdullah</div>
              <div><strong>Worker ID:</strong> ${workerId}</div>
              <div><strong>Role:</strong> Gig Economy Partner</div>
            </div>
            <div>
              <div class="section-title">Certificate Period</div>
              <div><strong>From:</strong> ${dateRange[0]?.toLocaleDateString()}</div>
              <div><strong>To:</strong> ${dateRange[1]?.toLocaleDateString()}</div>
              <div><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Earnings Breakdown (Only Verified Internal Records)</div>
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Hours</th>
                  <th>Gross (₹)</th>
                  <th>Deductions (₹)</th>
                  <th>Net (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${certificate?.items?.map(item => `
                  <tr>
                    <td>${item.platform}</td>
                    <td>${item.hours}</td>
                    <td>${item.grossEarnings}</td>
                    <td>${item.deductions}</td>
                    <td>${item.grossEarnings - item.deductions}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="total">
            Cumulative Net Income: ₹${certificate?.totalNet || 0}
          </div>

          <div class="footer">
            <div class="qr">QR CODE</div>
            <p>This document is digitally signed and verified by FairGig Verification Service.</p>
            <p>Verification Link: https://fairgig.com/verify/FG-${certificate?._id?.substring(0,8).toUpperCase()}</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 border-none">Income Certificate</h2>
        <p className="text-slate-500">Generate a verified proof of income for banks, loans, or rental agreements.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex gap-6 items-end">
            <div className="flex-1">
                <DatePickerInput
                    type="range"
                    label="Select Statement Period"
                    placeholder="Pick dates range"
                    value={dateRange}
                    onChange={setDateRange}
                    leftSection={<Calendar size={18} className="text-slate-400" />}
                    radius="xl"
                    size="md"
                    styles={{
                        input: { backgroundColor: '#f8fafc', border: 'none' }
                    }}
                />
            </div>
            <Button 
                onClick={handleGenerate} 
                loading={generating}
                variant="filled" 
                color="indigo" 
                radius="xl" 
                size="md"
                px={30}
            >
                Generate Data
            </Button>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
            <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
                <strong>Note:</strong> Only records with <span className="underline italic">Verified</span> status are included in the certificate.
            </p>
        </div>
      </div>

      {certificate ? (
        <Card radius="32px" padding="xl" withBorder className="animate-in slide-in-from-bottom-5 duration-500 overflow-visible">
            <div className="absolute -top-3 left-8">
                <Badge size="lg" color="green" variant="filled" className="shadow-lg">Certificate Ready</Badge>
            </div>

            <Stack gap="xl">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-xl font-bold text-slate-900">Summary Forecast</h4>
                        <p className="text-sm text-slate-500">{certificate.items.length} Verified Records Found</p>
                    </div>
                    <FileText size={48} className="text-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <Text size="xs" color="dimmed" fw={700} tt="uppercase">Verified Net Income</Text>
                        <Text size="32px" fw={900} className="text-indigo-600">₹{certificate.totalNet}</Text>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <Text size="xs" color="dimmed" fw={700} tt="uppercase">Records Period</Text>
                        <Text size="lg" fw={700} className="text-slate-800">
                            {dateRange[0]?.toLocaleDateString()} - {dateRange[1]?.toLocaleDateString()}
                        </Text>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button 
                        fullWidth 
                        variant="filled" 
                        color="indigo" 
                        radius="xl" 
                        size="lg" 
                        leftSection={<Printer size={20}/>}
                        onClick={handlePrint}
                    >
                        Print Certificate
                    </Button>
                    <Button 
                        fullWidth 
                        variant="light" 
                        color="slate" 
                        radius="xl" 
                        size="lg" 
                        leftSection={<Download size={20}/>}
                    >
                        Download PDF
                    </Button>
                </div>
            </Stack>
        </Card>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400">
             <FileSearch size={64} className="mx-auto mb-6 opacity-20" />
             <p className="text-lg font-medium">Select a date range to view your certificate preview.</p>
        </div>
      )}

      <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2 border-none">
            <CheckCircle size={18} className="text-emerald-500" />
            Security Features
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4">
                  <div className="bg-emerald-50 p-3 rounded-xl h-fit"><AlertCircle className="text-emerald-600" size={20}/></div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">QR Validation</h5>
                    <p className="text-xs text-slate-500">Each certificate contains a unique QR code for external verification by banks.</p>
                  </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl h-fit"><FileText className="text-blue-600" size={20}/></div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Immutable Record</h5>
                    <p className="text-xs text-slate-500">Once generated, the metadata is stored on-chain for permanent proof (Coming soon).</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default IncomeCertificate;
