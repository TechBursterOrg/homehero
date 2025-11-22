import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader, Camera, User, Shield } from 'lucide-react';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (data: { 
    nin: string; 
    nepaBill: File | null;
    selfie: File | null;
    consent: boolean;
  }) => Promise<void>;
  isSubmitting?: boolean;
  showStatus?: boolean;
  hasSubmittedVerification?: boolean
}

interface FormData {
  nin: string;
  nepaBill: File | null;
  selfie: File | null;
  consent: boolean;
}

const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  isSubmitting = false,
  showStatus = true
}) => {
  const [formData, setFormData] = useState<FormData>({
    nin: '',
    nepaBill: null,
    selfie: null,
    consent: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [nepaBillPreview, setNepaBillPreview] = useState<string | null>(null);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [ninValid, setNinValid] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ nin: '', nepaBill: null, selfie: null, consent: false });
      setErrors({});
      setNinValid(false);
      setSelfiePreview(null);
      setNepaBillPreview(null);
    }
  }, [isOpen]);

  const handleNINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, nin: value }));
    
    if (errors.nin) {
      setErrors(prev => ({ ...prev, nin: '' }));
    }

    if (value.length === 11) {
      const isValid = /^\d{11}$/.test(value);
      setNinValid(isValid);
      if (!isValid) {
        setErrors(prev => ({ ...prev, nin: 'NIN must contain only numbers' }));
      } else {
        setErrors(prev => ({ ...prev, nin: '' }));
      }
    } else if (value.length > 0 && value.length < 11) {
      setErrors(prev => ({ 
        ...prev, 
        nin: `NIN must be 11 digits (${value.length}/11)`
      }));
      setNinValid(false);
    } else {
      setNinValid(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'nepaBill' | 'selfie') => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (fileType === 'selfie' && !file.type.startsWith('image/')) {
        setErrors(prev => ({ 
          ...prev, 
          selfie: 'Please upload a valid image file for selfie' 
        }));
        return;
      }

      if (fileType === 'nepaBill' && !validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          [fileType]: 'Please upload a JPEG, PNG, or PDF file' 
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          [fileType]: 'File size must be less than 5MB' 
        }));
        return;
      }

      setFormData(prev => ({ ...prev, [fileType]: file }));
      setErrors(prev => ({ ...prev, [fileType]: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (fileType === 'selfie') {
          setSelfiePreview(e.target?.result as string);
        } else {
          setNepaBillPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fileType: 'nepaBill' | 'selfie') => {
    setFormData(prev => ({ ...prev, [fileType]: null }));
    setErrors(prev => ({ ...prev, [fileType]: '' }));
    
    if (fileType === 'selfie') {
      setSelfiePreview(null);
    } else {
      setNepaBillPreview(null);
    }
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, consent: e.target.checked }));
    if (errors.consent) {
      setErrors(prev => ({ ...prev, consent: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nin.trim()) {
      newErrors.nin = 'NIN is required';
    } else if (formData.nin.length !== 11) {
      newErrors.nin = 'NIN must be exactly 11 digits';
    } else if (!ninValid) {
      newErrors.nin = 'Please enter a valid NIN';
    }

    if (!formData.selfie) {
      newErrors.selfie = 'Selfie photo is required for verification';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must consent to identity verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmittingVerification(true);
    try {
      await onVerify(formData);
    } catch (error) {
      console.error('Verification error:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error instanceof Error ? error.message : 'Failed to submit verification. Please try again.' 
      }));
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isSubmittingVerification) {
      setFormData({ nin: '', nepaBill: null, selfie: null, consent: false });
      setErrors({});
      setNinValid(false);
      setSelfiePreview(null);
      setNepaBillPreview(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Identity Verification</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting || isSubmittingVerification}
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-gray-900">Verify your identity to apply for jobs</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This helps build trust with customers. Your information is secure and will only be used for verification purposes.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Document Requirements</p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• <strong>NIN:</strong> 11-digit National Identification Number</li>
                    <li>• <strong>Selfie:</strong> Clear photo for identity confirmation</li>
                    <li>• <strong>Utility Bill:</strong> Optional for address verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NIN Field */}
            <div>
              <label htmlFor="nin" className="block text-sm font-medium text-gray-700 mb-1">
                National Identification Number (NIN) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nin"
                  maxLength={11}
                  value={formData.nin}
                  onChange={handleNINChange}
                  placeholder="Enter your 11-digit NIN"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.nin ? 'border-red-300' : 
                    ninValid ? 'border-green-300' : 'border-gray-300'
                  } pr-10`}
                  disabled={isSubmitting || isSubmittingVerification}
                />
                {ninValid && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              
              {errors.nin && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.nin}
                </p>
              )}
              
              {ninValid && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <p className="text-green-800 font-medium">✓ NIN Format Valid</p>
                  <p className="text-green-600 text-xs mt-1">
                    Your NIN will be saved for verification
                  </p>
                </div>
              )}
            </div>

            {/* Selfie Photo Field */}
            <div>
              <label htmlFor="selfie" className="block text-sm font-medium text-gray-700 mb-1">
                Selfie Photo for Verification *
              </label>
              
              {!formData.selfie ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="selfie"
                    onChange={(e) => handleFileChange(e, 'selfie')}
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    disabled={isSubmitting || isSubmittingVerification}
                  />
                  <label htmlFor="selfie" className="cursor-pointer block">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Take a clear selfie photo</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Required for identity confirmation • Max 5MB
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      📱 Use camera for best results
                    </p>
                  </label>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {selfiePreview ? (
                        <img 
                          src={selfiePreview} 
                          alt="Selfie preview" 
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <User className="w-5 h-5 text-green-600 mr-2" />
                      )}
                      <span className="text-sm font-medium text-green-800">
                        Selfie photo ready
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('selfie')}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      disabled={isSubmitting || isSubmittingVerification}
                    >
                      Retake
                    </button>
                  </div>
                </div>
              )}
              
              {errors.selfie && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.selfie}
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Take a clear selfie for identity confirmation
              </p>
            </div>

            {/* Utility Bill Field */}
            <div>
              <label htmlFor="nepaBill" className="block text-sm font-medium text-gray-700 mb-1">
                Utility Bill (Optional - For Address Verification)
              </label>
              
              {!formData.nepaBill ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="nepaBill"
                    onChange={(e) => handleFileChange(e, 'nepaBill')}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    disabled={isSubmitting || isSubmittingVerification}
                  />
                  <label htmlFor="nepaBill" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Upload utility bill</p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF • Max 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {nepaBillPreview && nepaBillPreview.startsWith('data:image/') ? (
                        <img 
                          src={nepaBillPreview} 
                          alt="Utility bill preview" 
                          className="w-8 h-8 object-cover rounded mr-2"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                      )}
                      <span className="text-sm font-medium text-blue-800">
                        {formData.nepaBill.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('nepaBill')}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      disabled={isSubmitting || isSubmittingVerification}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              
              {errors.nepaBill && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.nepaBill}
                </p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={handleConsentChange}
                  className="mt-1 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting || isSubmittingVerification}
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  <span className="font-medium">I consent to identity verification</span>
                  <p className="text-xs text-gray-600 mt-1">
                    I authorize HomeHeroes to store my verification documents for provider verification purposes. 
                    I understand this information is encrypted and stored securely in compliance with data protection regulations.
                  </p>
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting || isSubmittingVerification}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSubmittingVerification || !formData.nin || !ninValid || !formData.selfie || !formData.consent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting || isSubmittingVerification ? (
                  <>
                    <Loader className="w-4 h-4 text-white mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Verification'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationModal;