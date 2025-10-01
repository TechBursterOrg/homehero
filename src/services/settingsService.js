// services/settingsService.js
class SettingsService {
  static async getSettings() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/settings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch settings');
    const result = await response.json();
    return result.data;
  }

  static async updateSettings(updates) {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) throw new Error('Failed to update settings');
    const result = await response.json();
    return result.data;
  }

  static async updateSection(section, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/settings/${section}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`Failed to update ${section} settings`);
    const result = await response.json();
    return result.data;
  }
}

export default SettingsService;