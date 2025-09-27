// Nigerian NIN validation utility
export interface NINValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    state: string;
    lga?: string;
    center?: string;
    year: number;
    gender: 'Male' | 'Female';
  };
}

export class NINValidator {
  // Nigerian states codes (first 2 digits)
  private static stateCodes: { [key: string]: string } = {
    '01': 'Lagos', '02': 'Ogun', '03': 'Oyo', '04': 'Ondo', '05': 'Osun',
    '06': 'Ekiti', '07': 'Edo', '08': 'Delta', '09': 'Rivers', '10': 'Bayelsa',
    '11': 'Anambra', '12': 'Imo', '13': 'Abia', '14': 'Enugu', '15': 'Ebonyi',
    '16': 'Akwa Ibom', '17': 'Cross River', '18': 'Kogi', '19': 'Kwara',
    '20': 'Niger', '21': 'Plateau', '22': 'Nassarawa', '23': 'Benue',
    '24': 'Kaduna', '25': 'Kano', '26': 'Katsina', '27': 'Jigawa',
    '28': 'Bornu', '29': 'Yobe', '30': 'Gombe', '31': 'Bauchi',
    '32': 'Sokoto', '33': 'Zamfara', '34': 'Kebbi', '35': 'Adamawa',
    '36': 'Taraba', '37': 'Federal Capital Territory (FCT)'
  };

  // Validation rules based on NIMC specifications
  static validateNIN(nin: string): NINValidationResult {
    // Remove any whitespace or special characters
    const cleanNIN = nin.replace(/\D/g, '');

    // Basic validation
    if (!cleanNIN) {
      return { isValid: false, error: 'NIN is required' };
    }

    if (cleanNIN.length !== 11) {
      return { isValid: false, error: 'NIN must be exactly 11 digits' };
    }

    if (!/^\d+$/.test(cleanNIN)) {
      return { isValid: false, error: 'NIN must contain only numbers' };
    }

    // Extract components
    const stateCode = cleanNIN.substring(0, 2);
    const lgaCode = cleanNIN.substring(2, 4);
    const centerCode = cleanNIN.substring(4, 6);
    const year = parseInt(cleanNIN.substring(6, 8));
    const genderCode = parseInt(cleanNIN.substring(8, 9));
    const serialNumber = parseInt(cleanNIN.substring(9, 11));

    // Validate state code
    if (!this.stateCodes[stateCode]) {
      return { isValid: false, error: 'Invalid state code in NIN' };
    }

    // Validate year (should be between 00-99, but reasonable years)
    const currentYear = new Date().getFullYear() % 100;
    if (year < 0 || year > currentYear) {
      return { isValid: false, error: 'Invalid year in NIN' };
    }

    // Validate gender code (odd = male, even = female)
    if (genderCode < 0 || genderCode > 9) {
      return { isValid: false, error: 'Invalid gender code in NIN' };
    }

    // Validate serial number
    if (serialNumber < 0 || serialNumber > 99) {
      return { isValid: false, error: 'Invalid serial number in NIN' };
    }

    // Check for obvious fake patterns
    if (this.isSuspiciousPattern(cleanNIN)) {
      return { isValid: false, error: 'NIN pattern appears invalid' };
    }

    return {
      isValid: true,
      details: {
        state: this.stateCodes[stateCode],
        year: year + 2000, // Convert to full year
        gender: genderCode % 2 === 0 ? 'Female' : 'Male'
      }
    };
  }

  // Check for suspicious patterns (all same digits, sequential, etc.)
  private static isSuspiciousPattern(nin: string): boolean {
    // All digits same
    if (/^(\d)\1+$/.test(nin)) return true;

    // Sequential digits
    if (this.isSequential(nin)) return true;

    // Common fake patterns
    const fakePatterns = [
      '12345678901',
      '11111111111',
      '00000000000',
      '99999999999'
    ];
    
    return fakePatterns.includes(nin);
  }

  private static isSequential(nin: string): boolean {
    // Check ascending sequence
    let ascending = true;
    for (let i = 1; i < nin.length; i++) {
      if (parseInt(nin[i]) !== parseInt(nin[i-1]) + 1) {
        ascending = false;
        break;
      }
    }
    if (ascending) return true;

    // Check descending sequence
    let descending = true;
    for (let i = 1; i < nin.length; i++) {
      if (parseInt(nin[i]) !== parseInt(nin[i-1]) - 1) {
        descending = false;
        break;
      }
    }
    return descending;
  }

  // Verify NIN against external service (mock for now, implement real API later)
  static async verifyWithNIMC(nin: string): Promise<NINValidationResult> {
    // This would integrate with actual NIMC API in production
    // For now, we'll simulate API validation with enhanced checks
    
    const basicValidation = this.validateNIN(nin);
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Enhanced validation logic (simulated)
    const isValid = await this.simulateNIMCVerification(nin);
    
    if (!isValid) {
      return { 
        isValid: false, 
        error: 'NIN could not be verified with national database' 
      };
    }

    return basicValidation;
  }

  private static async simulateNIMCVerification(nin: string): Promise<boolean> {
    // Simulate various verification scenarios
    const blacklistedNINs = ['11111111111', '99999999999', '12345678901'];
    
    if (blacklistedNINs.includes(nin)) {
      return false;
    }

    // Simulate network issues randomly (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Verification service temporarily unavailable');
    }

    // Most NINs pass in simulation (90% success rate)
    return Math.random() < 0.9;
  }
}