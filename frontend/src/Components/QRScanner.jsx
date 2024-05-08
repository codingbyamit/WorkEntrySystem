import React, { useState } from 'react';
import QrReader from 'react-qr-reader';

function QRScanner() {
  const [qrData, setQrData] = useState(null);
  const [formData, setFormData] = useState({
    OperatorNo: '',
    StepNo: '',
    MachineNo: ''
  });

  console.log(qrData);

  const handleScan = (data) => {
    if (data) {
      // QR code se data extract karke state mein store karein
      setQrData(data);
      // Data ko parse karke form fields mein set karein
      try {
        const parsedData = JSON.parse(data);
        setFormData({
          OperatorNo: parsedData.OperatorNo,
          StepNo: parsedData.StepNo,
          MachineNo: parsedData.MachineNo
        });
      } catch (error) {
        console.error('Invalid QR code data:', error);
      }
    }
  };

  const handleError = (error) => {
    console.error('QR code scan error:', error);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Form field ki value ko state mein update karein
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <div>
        <label>
          Operator No:
          <input
            type="text"
            name="OperatorNo"
            value={formData.OperatorNo}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Step No:
          <input
            type="text"
            name="StepNo"
            value={formData.StepNo}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Machine No:
          <input
            type="text"
            name="MachineNo"
            value={formData.MachineNo}
            onChange={handleInputChange}
          />
        </label>
      </div>
    </div>
  );
}

export default QRScanner;
