import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { NINValidator, NINValidationResult } from '../utils/ninValidator';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (data: { nin: string; nepaBill: File | null }) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormData {
  nin: string;
  nepaBill: File | null;
}

const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    nin: '',
    nepaBill: null
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [validationResult, setValidationResult] = useState<NINValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleNINChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    setFormData(prev => ({ ...prev, nin: value }));
    
    // Clear previous validation results
    setValidationResult(null);
    
    if (errors.nin) {
      setErrors(prev => ({ ...prev, nin: '' }));
    }

    // Real-time validation when user completes typing (11 digits)
    if (value.length === 11) {
      await validateNIN(value);
    }
  };

  const validateNIN = async (nin: string) => {
    setIsValidating(true);
    try {
      const result = NINValidator.validateNIN(nin);
      setValidationResult(result);

      if (!result.isValid && result.error) {
        setErrors(prev => ({ ...prev, nin: result.error! }));
      } else {
        setErrors(prev => ({ ...prev, nin: '' }));
      }
    } catch (error) {
      console.error('NIN validation error:', error);
      setErrors(prev => ({ ...prev, nin: 'Validation error occurred' }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, nepaBill: 'Please upload a JPEG, PNG, or PDF file' }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, nepaBill: 'File size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, nepaBill: file }));
      setErrors(prev => ({ ...prev, nepaBill: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // NIN validation
    if (!formData.nin.trim()) {
      newErrors.nin = 'NIN is required';
    } else if (formData.nin.length !== 11) {
      newErrors.nin = 'NIN must be 11 digits';
    } else if (validationResult && !validationResult.isValid) {
      newErrors.nin = validationResult.error || 'Invalid NIN';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onVerify(formData);
    } catch (error) {
      console.error('Verification error:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error instanceof Error ? error.message : 'Failed to submit verification. Please try again.' 
      }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, nepaBill: null }));
    setErrors(prev => ({ ...prev, nepaBill: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Identity Verification</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
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
                  <p className="text-sm text-blue-800 font-medium">Verification Levels</p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• <strong>Basic:</strong> NIN only - Can apply for jobs</li>
                    <li>• <strong>Full:</strong> NIN + Utility Bill - Higher customer trust</li>
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
                    validationResult?.isValid ? 'border-green-300' : 'border-gray-300'
                  } pr-10`}
                  disabled={isSubmitting}
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                )}
                {validationResult?.isValid && !isValidating && (
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
              
              {/* Validation Details */}
              {validationResult?.isValid && validationResult.details && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <p className="text-green-800 font-medium">✓ NIN Validated</p>
                  <p className="text-green-700">
                    {validationResult.details.state} • {validationResult.details.gender} • Issued: {validationResult.details.year}
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Your 11-digit NIN is required for identity verification
              </p>
            </div>

            {/* Utility Bill Field */}
            <div>
              <label htmlFor="nepaBill" className="block text-sm font-medium text-gray-700 mb-1">
                Utility Bill (Optional)
              </label>
              
              {!formData.nepaBill ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="nepaBill"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="nepaBill" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload utility bill (JPG, PNG, PDF)</p>
                    <p className="text-xs text-gray-500 mt-1">Max 5MB • Optional but recommended</p>
                  </label>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        {formData.nepaBill.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      disabled={isSubmitting}
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
              
              <p className="text-xs text-gray-500 mt-1">
                Upload a recent utility bill (NEPA, water, etc.) for full verification. Must show your name and address.
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>Security Notice:</strong> Your NIN is encrypted and stored securely. 
                We verify against national databases to ensure authenticity.
              </p>
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
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.nin || !validationResult?.isValid}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
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