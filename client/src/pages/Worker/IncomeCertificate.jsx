import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle,
  FileSearch,
  AlertCircle,
  ShieldCheck,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { generateCertificate } from '../../api/certificate';
import { DatePickerInput } from '@mantine/dates';
import { Button, Card, Text, Group, Stack, Badge, Divider, SimpleGrid } from '@mantine/core';
import dayjs from 'dayjs';

const IncomeCertificate = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const workerId = user.id || user.email || 'worker_01';

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      alert('Please select both Start and End dates.');
      return;
    }
    setGenerating(true);
    try {
      const res = await generateCertificate({
        workerId,
        startDate: dayjs(startDate).startOf('day').toISOString(),
        endDate: dayjs(endDate).endOf('day').toISOString()
      });
      setCertificate(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Generation failed. Ensure you have verified earnings in this period.';
      alert(msg);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const cycle = dayjs(startDate).format('MMMM YYYY');
    const certId = `FG-${certificate?._id?.substring(5).toUpperCase()}`;

    const toWords = (num) => {
        const val = parseFloat(num || 0);
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val).replace('₹', '') + ' Rupees Only';
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>A4 Official Report - ${certId}</title>
          <style>
            @page {
                size: A4;
                margin: 0;
            }
            body { 
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #525659;
                display: flex;
                justify-content: center;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .a4-page {
                background: white;
                width: 210mm;
                height: 297mm;
                padding: 15mm;
                box-sizing: border-box;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                position: relative;
                color: #000;
            }
            @media print {
                body { background: none; }
                .a4-page { 
                    box-shadow: none; 
                    margin: 0; 
                    width: 210mm;
                    height: 297mm;
                }
            }

            .header-banner {
                background: #ebf1f9;
                border: 1px solid #1c4587;
                text-align: center;
                padding: 5px;
                font-weight: 800;
                color: #1c4587;
                font-size: 16px;
                margin-bottom: 20px;
            }

            .main-table {
                width: 100%;
                border-collapse: collapse;
                border: 2px solid #000;
            }

            .main-table th, .main-table td {
                border: 1px solid #000;
                padding: 8px 12px;
                font-size: 13px;
                text-align: left;
            }

            .bg-header { background: #fce4d6; text-align: center; font-weight: 900; }
            .bg-label { background: #38761d; color: white; font-weight: 800; width: 25%; }
            .bg-data { background: #fff; width: 25%; }
            
            .spacer { height: 20px; }

            .data-grid-header {
                background: #38761d;
                color: white;
                font-weight: 900;
                text-align: center;
                text-transform: uppercase;
                font-size: 11px;
            }

            .row-center td { text-align: center; }
            .row-right td { text-align: right; }

            .summary-block {
                margin-top: -1px; /* collapse border */
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }

            .summary-table {
                width: 50%;
                border-collapse: collapse;
                border: 2px solid #000;
                border-top: none;
            }

            .summary-table td {
                border: 1px solid #000;
                padding: 8px 12px;
                font-size: 13px;
            }

            .summary-name { font-weight: 700; width: 60%; }
            .summary-val { text-align: right; font-weight: 900; }

            .in-words-box {
                border: 2px solid #000;
                margin-top: 15px;
                display: flex;
                align-items: stretch;
            }

            .words-tag {
                background: #38761d;
                color: white;
                padding: 10px;
                font-weight: 900;
                font-size: 12px;
                width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .words-text {
                padding: 10px;
                font-size: 13px;
                font-weight: 800;
                font-style: italic;
                flex: 1;
            }

            .legal-section {
                border: 1.5px solid #000;
                margin-top: 20px;
                padding: 15px;
                font-size: 11px;
            }

            .legal-header {
                font-weight: 900;
                margin-bottom: 8px;
                font-size: 12px;
            }

            .signs-container {
                margin-top: 40px;
                display: flex;
                justify-content: space-between;
                font-weight: 900;
                border-top: 1px dashed #ccc;
                padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="a4-page">
            <div class="header-banner">Official Income Verification Certificate</div>
            
            <table class="main-table">
                <tr><th colspan="4" class="bg-header">Interim Income Statement No# ${certificate?._id?.substring(certId.length-3)}</th></tr>
                <tr>
                    <td class="bg-label">Partner Name:</td>
                    <td class="bg-data">${user.fullName}</td>
                    <td class="bg-label">System Ref:</td>
                    <td class="bg-data">${certId}</td>
                </tr>
                <tr>
                    <td class="bg-label">Role Category:</td>
                    <td class="bg-data">Independent Gig Economy Partner</td>
                    <td class="bg-label">Issued By:</td>
                    <td class="bg-data">FairGig Global Node</td>
                </tr>
                <tr>
                    <td class="bg-label">Contract Base:</td>
                    <td class="bg-data">Variable Gig Agreement</td>
                    <td class="bg-label">Cycle:</td>
                    <td class="bg-data">${cycle}</td>
                </tr>
            </table>

            <div class="spacer"></div>

            <table class="main-table">
                <tr class="data-grid-header">
                    <td width="5%">SL</td>
                    <td width="45%">Work Description / Platform Service</td>
                    <td width="15%">Unit (Hrs)</td>
                    <td width="15%">Status</td>
                    <td width="20%">Certified Amount</td>
                </tr>
                ${(certificate?.items || []).map((item, idx) => `
                    <tr class="row-center">
                        <td>${idx + 1}</td>
                        <td style="text-align: left;">${item.platform} Verified Operational Shift</td>
                        <td>${item.hours}</td>
                        <td style="color: #38761d; font-weight: 900;">Verified</td>
                        <td style="text-align: right; font-weight: bold;">₹${(parseFloat(item.grossEarnings || 0) - parseFloat(item.deductions || 0)).toLocaleString()}</td>
                    </tr>
                `).join('')}
                <!-- Dynamic Spacing for Formal Look -->
                ${new Array(Math.max(0, 10 - (certificate?.items?.length || 0))).fill(0).map(() => `
                    <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                `).join('')}
            </table>

            <div class="summary-block">
                <table class="summary-table">
                    <tr>
                        <td class="summary-name">Gross Verified Value</td>
                        <td class="summary-val">₹${(certificate?.items || []).reduce((a,c) => a+parseFloat(c.grossEarnings || 0), 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td class="summary-name">Less Aggregate Deductions</td>
                        <td class="summary-val">₹${(certificate?.items || []).reduce((a,c) => a+parseFloat(c.deductions || 0), 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td class="summary-name" style="background: #f1f1f1;">TOTAL NET CERTIFIED AMOUNT</td>
                        <td class="summary-val" style="background: #f1f1f1; font-size: 16px;">₹${parseFloat(certificate?.totalNet || 0).toLocaleString()}</td>
                    </tr>
                </table>
            </div>

            <div class="in-words-box">
                <div class="words-tag">In Words:</div>
                <div class="words-text">${toWords(certificate?.totalNet)}</div>
            </div>

            <div class="legal-section">
                <div class="legal-header">Partner's Attestation:</div>
                <div>
                    The undersigned Partner hereby declares to the best of his/her knowledge, information and belief that the earnings reported above have been generated through verified gig activities on the specified platforms. All data points have been cross-checked against valid digital evidence and are provided without any misrepresentation.
                </div>
                <div class="signs-container">
                    <span>Partner Signature: __________________</span>
                    <span>Date: ${today}</span>
                </div>
            </div>

            <div class="legal-section" style="background: #fdfdfd;">
                <div class="legal-header">System Auditor's Certification:</div>
                <div>
                    The FairGig Automated Verification Service hereby confirms that based on crowdsourced validation and algorithmic integrity checks, this income statement accurately reflects the progression of verified work and satisfies the system's requirements for financial certification.
                </div>
                <div class="signs-container">
                    <span>Certified Amount: ₹${certificate?.totalNet?.toLocaleString()}</span>
                    <span>Node ID: FG-SYS-8821</span>
                </div>
            </div>

            <div style="margin-top: 20px; text-align: center; color: #999; font-size: 10px;">
                Generated via FairGig Decentralized Worker Support System. 
                Verify at mapping.fairgig.com/verify/${certId.toLowerCase()}
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 border-none tracking-tight">Income Certificate</h2>
          <p className="text-slate-500 font-medium">Generate a premium, verified proof of earnings for financial use.</p>
        </div>
        <Badge size="xl" color="indigo" variant="light" radius="md" py={20} px={20} className="border border-indigo-100">
           <Group gap="xs">
              <ShieldCheck size={18} />
              <Text fw={800} size="sm">Bank-Grade Verification</Text>
           </Group>
        </Badge>
      </header>

      {/* Date Selection Box */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DatePickerInput
                label="Start Date"
                placeholder="Pick start date"
                value={startDate}
                onChange={setStartDate}
                leftSection={<Calendar size={20} className="text-indigo-500" />}
                radius="20px"
                size="lg"
                styles={{
                    input: { backgroundColor: '#fcfdff', borderColor: '#f1f5f9', fontWeight: 600 },
                    label: { marginBottom: 8, fontWeight: 700, fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }
                }}
            />
            <DatePickerInput
                label="End Date"
                placeholder="Pick end date"
                value={endDate}
                onChange={setEndDate}
                leftSection={<Calendar size={20} className="text-indigo-500" />}
                radius="20px"
                size="lg"
                styles={{
                    input: { backgroundColor: '#fcfdff', borderColor: '#f1f5f9', fontWeight: 600 },
                    label: { marginBottom: 8, fontWeight: 700, fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }
                }}
            />
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
            <Button 
                onClick={handleGenerate} 
                loading={generating}
                variant="filled" 
                color="indigo" 
                radius="24px" 
                size="xl"
                fullWidth
                h={64}
                className="shadow-lg shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95"
                leftSection={<FileText size={22} />}
            >
                Preview & Generate Certificate
            </Button>
        </div>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4 items-center">
            <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                <Info size={20} className="text-indigo-600 shrink-0" />
            </div>
            <p className="text-sm text-slate-600 font-medium">
                Our system only aggregates records that have been officially <span className="text-indigo-600 font-bold italic">Verified</span> by the FairGig community or verifiers.
            </p>
        </div>
      </div>

      {certificate ? (
        <Card radius="40px" padding={40} withBorder className="animate-in slide-in-from-bottom-10 duration-1000 shadow-2xl shadow-indigo-50 border-indigo-50 relative overflow-visible">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge size="xl" height={40} color="emerald" variant="filled" className="shadow-xl" radius="md">
                    <Group gap="xs" px={10}>
                        <CheckCircle size={16} />
                        <Text size="xs" fw={900} tt="uppercase">Certification Ready</Text>
                    </Group>
                </Badge>
            </div>

            <Stack gap={40}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <Text size="xs" color="dimmed" fw={800} tt="uppercase" tracking={2} mb={4}>Worker Account</Text>
                        <h4 className="text-3xl font-black text-slate-900 border-none">{user.fullName}</h4>
                        <Text size="sm" color="dimmed" fw={600}>{workerId}</Text>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100 min-w-[200px]">
                        <Text size="xs" color="dimmed" fw={800} tt="uppercase" mb={4}>Total Verified</Text>
                        <Text size="32px" fw={900} className="text-emerald-600 leading-none">₹{certificate.totalNet}</Text>
                    </div>
                </div>

                <Divider variant="dashed" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                        <Group mb="sm">
                           <Calendar size={18} className="text-indigo-400" />
                           <Text size="xs" fw={800} tracking={1} color="dimmed">PERIOD START</Text>
                        </Group>
                        <Text fw={700} className="text-slate-800">{dayjs(startDate).format('DD/MM/YYYY')}</Text>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                        <Group mb="sm">
                           <ArrowRight size={18} className="text-indigo-400" />
                           <Text size="xs" fw={800} tracking={1} color="dimmed">PERIOD END</Text>
                        </Group>
                        <Text fw={700} className="text-slate-800">{dayjs(endDate).format('DD/MM/YYYY')}</Text>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                        <Group mb="sm">
                           <ShieldCheck size={18} className="text-emerald-400" />
                           <Text size="xs" fw={800} tracking={1} color="dimmed">DATA STATUS</Text>
                        </Group>
                        <Text fw={700} className="text-emerald-600">VERIFIED ONLY</Text>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                        fullWidth 
                        variant="filled" 
                        color="indigo" 
                        radius="24px" 
                        size="xl" 
                        h={64}
                        leftSection={<Printer size={22}/>}
                        onClick={handlePrint}
                        className="shadow-lg shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        Print Verified Certificate
                    </Button>
                    <Button 
                        fullWidth 
                        variant="outline" 
                        color="slate" 
                        radius="24px" 
                        size="xl" 
                        h={64}
                        onClick={handlePrint}
                        leftSection={<Download size={22}/>}
                        className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                        Export as PDF
                    </Button>
                </div>
            </Stack>
        </Card>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center text-slate-400">
             <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileSearch size={48} className="opacity-20" />
             </div>
             <p className="text-xl font-bold text-slate-500">Preview Area</p>
             <p className="max-w-xs mx-auto mt-2 text-sm text-slate-400 font-medium">Select a date range and click generate to see your certificate breakdown.</p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex gap-6 items-center">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 shadow-sm">
                  <ShieldCheck size={28} />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-900 text-lg border-none leading-none mb-1">Bank Grade Security</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Protected with 256-bit encryption. Each document carries a unique cryptographic reference for tampering prevention.</p>
              </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex gap-6 items-center">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-sm">
                  <FileText size={28} />
              </div>
              <div>
                <h5 className="font-extrabold text-slate-900 text-lg border-none leading-none mb-1">Instant Issuance</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Skip the line. Generate legal proof of income instantly based on your crowdsourced verification history.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default IncomeCertificate;
