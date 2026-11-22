import { apiRequest } from '../api/api';

export const userService = {
  /**
   * Fetch current authenticated user's profile from the backend.
   * First tries /users/profile, and falls back to /auth/me if needed.
   */
  async getProfile() {
    try {
      const response = await apiRequest('/users/profile');
      return response.data || response;
    } catch (err) {
      // Fallback to /auth/me if /users/profile is not available
      const meResponse = await apiRequest('/auth/me');
      return meResponse.data || meResponse;
    }
  },

  /**
   * Update the current authenticated user's profile.
   * Sends sanitized DTO matching backend specifications:
   * fullName, mobile, dateOfBirth, gender, heightCm, profileImage
   */
  async updateProfile(profileData) {
    // Only send non-undefined allowed fields to satisfy backend validation
    const payload = {};

    if (profileData.fullName !== undefined && profileData.fullName !== '') {
      payload.fullName = String(profileData.fullName).trim();
    }
    if (profileData.mobile !== undefined && profileData.mobile !== '') {
      payload.mobile = String(profileData.mobile).trim();
    }
    if (profileData.dateOfBirth !== undefined && profileData.dateOfBirth !== '') {
      // Backend expects YYYY-MM-DD date string
      payload.dateOfBirth = String(profileData.dateOfBirth).trim();
    }
    if (profileData.gender !== undefined && profileData.gender !== '') {
      payload.gender = String(profileData.gender).trim();
    }
    if (profileData.heightCm !== undefined && profileData.heightCm !== '' && !isNaN(Number(profileData.heightCm))) {
      payload.heightCm = Number(profileData.heightCm);
    }
    if (profileData.profileImage !== undefined && profileData.profileImage !== '') {
      payload.profileImage = String(profileData.profileImage);
    }

    const response = await apiRequest('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    return response.data || response;
  },

  /**
   * Fetch user health dashboard summary from backend
   */
  async getHealthSummary() {
    try {
      const response = await apiRequest('/users/health-summary');
      return response.data || response;
    } catch {
      return null;
    }
  },
};
