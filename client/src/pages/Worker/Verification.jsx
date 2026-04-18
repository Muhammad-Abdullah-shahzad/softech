import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileCheck2, 
  FileWarning, 
  Clock, 
  MessageSquare,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { getEarnings, updateEarning } from '../../api/earnings';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { FileInput, Button, Badge, Timeline, Text, Group } from '@mantine/core';

const Verification = () => {
  const [earnings, setEarnings] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const workerId = user.id || user.email || 'worker_01';

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await getEarnings(workerId);
      const allEarnings = Array.isArray(res.data.data) ? res.data.data : [];
      // Only show records that HAVEN'T been reviewed yet (unverified or pending)
      setEarnings(allEarnings.filter(e => e.verificationStatus === 'unverified' || e.verificationStatus === 'pending'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (id) => {
    if (!selectedFile) return;
    setUploadingId(id);
    try {
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      
      await updateEarning(id, {
        evidenceUrls: [uploadedUrl],
        verificationStatus: 'pending'
      });

      alert('Upload successful! Status changed to Pending.');
      fetchEarnings();
      setSelectedFile(null);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 border-none">Verification Center</h2>
        <p className="text-slate-500">Verify your earnings by uploading platform screenshots.</p>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white flex items-center justify-between shadow-xl shadow-indigo-100">
        <div className="space-y-2">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck size={24} />
            Why verify?
          </h3>
          <p className="text-indigo-100 opacity-90 max-w-md">
            Verified earnings are required for Income Certificates and building your FairGig trust score.
          </p>
        </div>
        <div className="hidden md:block">
           <UploadCloud size={64} className="text-indigo-400 opacity-50" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 px-2">Records Awaiting Verification</h3>
        {earnings.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center text-slate-400">
            <FileCheck2 size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">All records are verified or submitted.</p>
          </div>
        ) : (
          earnings.map((item) => (
            <div key={item._id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all group">
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-500">
                    {item.platform[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.platform}</h4>
                    <p className="text-sm text-slate-500">{item.shiftStart?.split('T')[0]} • ₹{item.grossAmount}</p>
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] flex items-center gap-2">
                   <FileInput
                     placeholder="Choose screenshot"
                     size="sm"
                     className="flex-1"
                     leftSection={<UploadCloud size={14} />}
                     onChange={setSelectedFile}
                     accept="image/*"
                   />
                   <Button 
                     size="sm" 
                     color="indigo" 
                     radius="md" 
                     loading={uploadingId === item._id}
                     disabled={!selectedFile}
                     onClick={() => handleUpload(item._id)}
                   >
                     Submit
                   </Button>
                </div>

                <div className="text-right">
                    <Badge color={item.verificationStatus === 'flagged' ? 'red' : 'yellow'} variant="light">
                        {item.verificationStatus?.toUpperCase() || 'UNVERIFIED'}
                    </Badge>
                    {item.verifierComments && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-rose-500 font-bold uppercase">
                            <MessageSquare size={10} />
                            Issue Reported
                        </div>
                    )}
                </div>
              </div>

              {item.verificationStatus === 'flagged' && (
                <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <div className="flex gap-3">
                        <FileWarning size={18} className="text-rose-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-rose-900">Flag Reason:</p>
                            <p className="text-sm text-rose-700 italic">
                                {item.verifierComments || (item.anomalies && item.anomalies.length > 0 ? item.anomalies[0].message : "Record flagged for manual review.")}
                            </p>
                        </div>
                    </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Verification Timeline Info */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-8 border-none">Verification Process</h3>
        <Timeline active={1} bulletSize={24} lineWidth={2}>
          <Timeline.Item bullet={<UploadCloud size={12}/>} title="Submission">
            <Text color="dimmed" size="sm">You upload a screenshot from your platform (Uber/Foodpanda etc).</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<Clock size={12}/>} title="Crowd Verification">
            <Text color="dimmed" size="sm">Verified members or automated systems check the document.</Text>
          </Timeline.Item>
          <Timeline.Item bullet={<ShieldCheck size={12}/>} title="Final Approval">
            <Text color="dimmed" size="sm">Status changes to 'Verified' and record is locked for editing.</Text>
          </Timeline.Item>
        </Timeline>
      </div>
    </div>
  );
};

export default Verification;
