import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ 
  length, 
  value, 
  onChange, 
  disabled = false, 
  error = false 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Update internal state when value prop changes
    const otpArray = value.split('').slice(0, length);
    const paddedOtp = [...otpArray, ...new Array(length - otpArray.length).fill('')];
    setOtp(paddedOtp);
  }, [value, length]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Call onChange with the complete OTP string
    onChange(newOtp.join(''));

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (pastedNumbers) {
      const newOtp = pastedNumbers.split('');
      const paddedOtp = [...newOtp, ...new Array(length - newOtp.length).fill('')];
      setOtp(paddedOtp);
      onChange(pastedNumbers);
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedNumbers.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
            error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
          } ${
            disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : ''
          }`}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;
