// utils/ninValidator.ts
export interface NINValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    state: string;
    gender: string;
    fullName?: string; // Will be populated by API verification
    photoUrl?: string; // Will be populated by API verification
  };
}

export class NINValidator {
  private static stateCodes: { [key: string]: string } = {
    '01': 'Lagos', '02': 'Ogun', '03': 'Oyo', '04': 'Ondo', '05': 'Osun',
    '06': 'Oyo', '07': 'Ogun', '08': 'Lagos', '09': 'Borno', '10': 'Bauchi',
    '11': 'Kano', '12': 'Kaduna', '13': 'Katsina', '14': 'Kano', '15': 'Kaduna',
    '16': 'Plateau', '17': 'Adamawa', '18': 'Kebbi', '19': 'Sokoto', '20': 'Kano',
    '21': 'Kano', '22': 'Kogi', '23': 'Kwara', '24': 'Niger', '25': 'Edo',
    '26': 'Delta', '27': 'Rivers', '28': 'Bayelsa', '29': 'Edo', '30': 'Imo',
    '31': 'Abia', '32': 'Anambra', '33': 'Lagos', // FIXED: 33 is Lagos, not Benue
    '34': 'Cross River', '35': 'Akwa Ibom', '36': 'Kogi', '37': 'Kwara', 
    '38': 'Taraba', '39': 'Adamawa', '40': 'Delta', '41': 'Ogun', '42': 'Lagos',
    '43': 'Osun', '44': 'Oyo', '45': 'Ondo', '46': 'Osun', '47': 'Oyo',
    '48': 'Ekiti', '49': 'Kwara', '50': 'FCT', '51': 'Kaduna', '52': 'Kano',
    '53': 'Katsina', '54': 'Kano', '55': 'Kaduna', '56': 'Plateau', '57': 'Adamawa',
    '58': 'Kebbi', '59': 'Sokoto', '60': 'Kano', '61': 'Kano', '62': 'Kogi',
    '63': 'Kwara', '64': 'Niger', '65': 'Edo', '66': 'Delta', '67': 'Rivers',
    '68': 'Bayelsa', '69': 'Edo', '70': 'Imo', '71': 'Abia', '72': 'Anambra',
    '73': 'Benue', '74': 'Cross River', '75': 'Akwa Ibom', '76': 'Kogi',
    '77': 'Kwara', '78': 'Taraba', '79': 'Adamawa', '80': 'Delta', '81': 'Ogun',
    '82': 'Lagos', '83': 'Osun', '84': 'Oyo', '85': 'Ondo', '86': 'Osun',
    '87': 'Oyo', '88': 'Ekiti', '89': 'Kwara', '90': 'FCT'
  };

  static validateNIN(nin: string): NINValidationResult {
    const cleanNIN = nin.replace(/\D/g, '');
    
    if (cleanNIN.length !== 11) {
      return {
        isValid: false,
        error: 'NIN must be exactly 11 digits'
      };
    }

    if (!/^\d{11}$/.test(cleanNIN)) {
      return {
        isValid: false,
        error: 'NIN must contain only numbers'
      };
    }

    // Extract components
    const stateCode = cleanNIN.substring(0, 2);
    const genderDigit = cleanNIN.substring(7, 8);

    // Validate state code
    const state = this.stateCodes[stateCode];
    if (!state) {
      return {
        isValid: false,
        error: 'Invalid state code in NIN'
      };
    }

    // Validate gender digit
    const genderNum = parseInt(genderDigit);
    if (isNaN(genderNum)) {
      return {
        isValid: false,
        error: 'Invalid gender code in NIN'
      };
    }

    // Determine gender (odd = Male, even = Female)
    const gender = genderNum % 2 === 1 ? 'Male' : 'Female';

    return {
      isValid: true,
      details: {
        state: state,
        gender: gender
      }
    };
  }

  // Additional method to format NIN for display
  static formatNIN(nin: string): string {
    const cleanNIN = nin.replace(/\D/g, '');
    if (cleanNIN.length !== 11) return nin;
    
    return cleanNIN.replace(/(\d{3})(\d{3})(\d{5})/, '$1-$2-$3');
  }

  // Method to get state from NIN
  static getStateFromNIN(nin: string): string {
    const cleanNIN = nin.replace(/\D/g, '');
    if (cleanNIN.length !== 11) return 'Unknown';
    
    const stateCode = cleanNIN.substring(0, 2);
    return this.stateCodes[stateCode] || 'Unknown';
  }

  // Method to validate NIN with external API (for real verification)
  static async validateNINWithAPI(nin: string, selfieImage?: string): Promise<NINValidationResult> {
    try {
      // This would call your backend API which then calls IdentityPass
      const response = await fetch('/api/verification/verify-nin-basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nin, selfieImage }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          details: {
            state: data.state || 'Unknown',
            gender: data.gender || 'Unknown',
            fullName: data.fullName,
            photoUrl: data.photoUrl
          }
        };
      } else {
        const errorData = await response.json();
        return {
          isValid: false,
          error: errorData.message || 'NIN verification failed'
        };
      }
    } catch (error) {
      console.error('NIN API validation error:', error);
      return {
        isValid: false,
        error: 'Verification service unavailable'
      };
    }
  }

  // Helper method to convert file to base64 (for selfie upload)
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}