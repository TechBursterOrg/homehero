// services/ninValidator.ts
import axios from 'axios';

interface ValidationResult {
  isValid: boolean;
  data?: any;
  source: string;
  error?: string;
  warning?: string;
}

type ValidationService = (nin: string) => Promise<ValidationResult>;

class NINValidator {
  private validationServices: ValidationService[];

  constructor() {
    // You can use different validation services based on availability
    this.validationServices = [
      this.validateViaNIMC, // Official NIMC API (if available)
      this.validateViaThirdParty, // Third-party services
      this.validateViaAlgorithm // Basic algorithmic validation
    ];
  }

  // Method 1: Official NIMC API (You'll need to get API credentials)
  async validateViaNIMC(nin: string): Promise<ValidationResult> {
    try {
      const response = await axios.post('https://api.nimc.gov.ng/verify', {
        nin: nin,
        apiKey: process.env.NIMC_API_KEY // You'll need to register for this
      }, {
        timeout: 10000
      });

      return {
        isValid: response.data.status === 'valid',
        data: response.data,
        source: 'nimc'
      };
    } catch (error) {
      console.error('NIMC API error:', error);
      return { isValid: false, error: 'NIMC service unavailable', source: 'nimc' };
    }
  }

  // Method 2: Third-party validation service (Example)
  async validateViaThirdParty(nin: string): Promise<ValidationResult> {
    try {
      const response = await axios.post('https://api.verification.com/nin', {
        nin: nin,
        api_key: process.env.THIRD_PARTY_API_KEY
      }, {
        timeout: 8000
      });

      return {
        isValid: response.data.valid === true,
        data: response.data,
        source: 'third_party'
      };
    } catch (error) {
      console.error('Third-party API error:', error);
      return { isValid: false, error: 'Third-party service unavailable', source: 'third_party' };
    }
  }

  // Method 3: Algorithmic validation (Basic checks without external API)
  async validateViaAlgorithm(nin: string): Promise<ValidationResult> {
    // Basic NIN validation rules for Nigeria
    if (!nin || nin.length !== 11) {
      return { isValid: false, error: 'NIN must be 11 digits', source: 'algorithm' };
    }

    if (!/^\d+$/.test(nin)) {
      return { isValid: false, error: 'NIN must contain only numbers', source: 'algorithm' };
    }

    // Check if it's not a obvious fake pattern (all same digits, sequential, etc.)
    if (this.isObviousFake(nin)) {
      return { isValid: false, error: 'NIN appears to be invalid', source: 'algorithm' };
    }

    // Basic checks passed (this is not real validation, just format checking)
    return { 
      isValid: true, 
      data: { message: 'Format validation passed. Manual verification recommended.' },
      source: 'algorithm',
      warning: 'This is format validation only. Real verification requires API service.'
    };
  }

  // Helper method to detect obvious fake NINs
  private isObviousFake(nin: string): boolean {
    // Check for all same digits (11111111111, 22222222222, etc.)
    if (/^(\d)\1+$/.test(nin)) return true;
    
    // Check for sequential digits (12345678901, 98765432109, etc.)
    if (this.isSequential(nin)) return true;
    
    // Check for common test patterns
    const testPatterns = [
      '00000000000',
      '11111111111',
      '12345678901',
      '98765432109'
    ];
    
    return testPatterns.includes(nin);
  }

  private isSequential(nin: string): boolean {
    // Check ascending sequence
    let ascending = true;
    for (let i = 0; i < nin.length - 1; i++) {
      if (parseInt(nin[i+1]) !== parseInt(nin[i]) + 1) {
        ascending = false;
        break;
      }
    }
    
    // Check descending sequence
    let descending = true;
    for (let i = 0; i < nin.length - 1; i++) {
      if (parseInt(nin[i+1]) !== parseInt(nin[i]) - 1) {
        descending = false;
        break;
      }
    }
    
    return ascending || descending;
  }

  // Main validation method that tries different services
  async validate(nin: string): Promise<ValidationResult> {
    // First, do basic format validation
    const basicCheck = await this.validateViaAlgorithm(nin);
    if (!basicCheck.isValid) {
      return basicCheck;
    }

    // Try different validation services in order
    for (const service of this.validationServices) {
      try {
        const result = await service.call(this, nin);
        if (result.isValid) {
          return result;
        }
        // If service is available but returns invalid, trust it
        if (!result.error || !result.error.includes('unavailable')) {
          return result;
        }
      } catch (error) {
        console.error(`Validation service error:`, error);
        // Continue to next service
      }
    }

    // If all services fail, return the algorithmic result with warning
    return {
      ...basicCheck,
      warning: 'Could not verify with external services. Format appears correct.'
    };
  }
}

export default new NINValidator();