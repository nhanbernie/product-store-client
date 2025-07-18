/**
 * Decode JWT token without verification (client-side only)
 * Note: This is for reading token payload only, not for security validation
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    return true;
  }
}

/**
 * Get user info from JWT token
 */
export function getUserFromToken(token: string): any {
  try {
    const decoded = decodeJWT(token);
    if (!decoded) {
      return null;
    }

    // Extract user information from token payload
    // Adjust these fields based on your JWT structure
    return {
      id: decoded.userId || decoded.sub || decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || 'user',
    };
  } catch (error) {
    console.error('Failed to get user from token:', error);
    return null;
  }
}
