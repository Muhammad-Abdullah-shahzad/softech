import React, { useState } from 'react';
import { 
  TextInput, 
  NumberInput, 
  Select, 
  Button, 
  Stack, 
  Group, 
  Alert,
  FileInput
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { Info, Check, Send, Upload } from 'lucide-react';
import dayjs from 'dayjs';
import { addEarning } from '../api/earnings';
import { uploadToCloudinary } from '../utils/cloudinary';

const AddEarningForm = ({ onEarningAdded }) => {
  const [formData, setFormData] = useState({
    workerId: JSON.parse(localStorage.getItem('user') || '{}').id || JSON.parse(localStorage.getItem('user') || '{}').email || 'worker_01', 
    platform: 'Uber',
    grossAmount: '',
    shiftStart: null,
    shiftEnd: null,
    evidenceUrls: [],
    city: JSON.parse(localStorage.getItem('user') || '{}').city || 'Lahore'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shiftStart || !formData.shiftEnd) {
        setMessage({ type: 'error', text: 'Please select shift times.' });
        return;
    }

    setLoading(true);
    setMessage(null);
    try {
      let evidenceUrls = formData.evidenceUrls;
      
      if (file) {
        const uploadedUrl = await uploadToCloudinary(file);
        evidenceUrls = [...evidenceUrls, uploadedUrl];
      }

      await addEarning({
        ...formData,
        evidenceUrls,
        grossAmount: parseFloat(formData.grossAmount),
        shiftStart: dayjs(formData.shiftStart).toISOString(),
        shiftEnd: dayjs(formData.shiftEnd).toISOString()
      });
      setMessage({ type: 'success', text: 'Activity logged successfully.' });
      setTimeout(() => {
          onEarningAdded();
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to sync activity' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {message && (
          <Alert 
            variant="light" 
            color={message.type === 'success' ? 'green' : 'red'} 
            title={message.type === 'success' ? 'Success' : 'Error'}
            icon={message.type === 'success' ? <Check /> : <Info />}
          >
            {message.text}
          </Alert>
        )}

        <Select
          label="Gig Platform"
          placeholder="Pick platform"
          data={['Uber', 'Deliveroo', 'DoorDash', 'Other']}
          value={formData.platform}
          onChange={(value) => setFormData({...formData, platform: value})}
          required
          size="sm"
          variant="default"
        />

        <NumberInput
          label="Gross Earnings"
          placeholder="0.00"
          prefix="$"
          precision={2}
          decimalScale={2}
          step={0.01}
          value={formData.grossAmount}
          onChange={(value) => setFormData({...formData, grossAmount: value})}
          required
          size="sm"
          variant="default"
          hideControls
        />

        <Group grow>
          <DateTimePicker
            label="Shift Start"
            placeholder="Pick date and time"
            value={formData.shiftStart}
            onChange={(value) => setFormData({...formData, shiftStart: value})}
            required
            size="sm"
            variant="default"
          />
          <DateTimePicker
            label="Shift End"
            placeholder="Pick date and time"
            value={formData.shiftEnd}
            onChange={(value) => setFormData({...formData, shiftEnd: value})}
            required
            size="sm"
            variant="default"
          />
        </Group>

        <FileInput
          label="Payment Evidence"
          placeholder="Upload screenshot"
          leftSection={<Upload size={16} />}
          accept="image/*"
          value={file}
          onChange={setFile}
          size="sm"
          variant="default"
          clearable
        />

        <Button
          type="submit"
          fullWidth
          size="sm"
          variant="filled"
          color="black"
          loading={loading}
          loaderProps={{ type: 'dots' }}
          mt="md"
          rightSection={<Send size={16} />}
        >
          Sync Data
        </Button>
      </Stack>
    </form>
  );
};

export default AddEarningForm;
