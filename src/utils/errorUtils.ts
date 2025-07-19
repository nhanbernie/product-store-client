/**
 * Parse API error response and return user-friendly message
 */
export function parseApiError(error: unknown): string {
  // Default error message
  let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
  
  if (error instanceof Error) {
    try {
      // Try to parse JSON error message from API
      const errorData = JSON.parse(error.message);
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.data && Array.isArray(errorData.data) && errorData.data.length > 0) {
        // Handle array of error messages
        errorMessage = errorData.data[0];
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (parseError) {
      // If not JSON, check for specific error patterns
      const message = error.message;
      
      if (message.includes('customerInfo.address')) {
        errorMessage = "Địa chỉ giao hàng phải có ít nhất 10 ký tự.";
      } else if (message.includes('customerInfo.phone')) {
        errorMessage = "Số điện thoại không hợp lệ.";
      } else if (message.includes('customerInfo.email')) {
        errorMessage = "Email không hợp lệ.";
      } else if (message.includes('customerInfo.name')) {
        errorMessage = "Tên khách hàng không được để trống.";
      } else if (message.includes('items') && message.includes('required')) {
        errorMessage = "Vui lòng chọn ít nhất một sản phẩm.";
      } else if (message.includes('HTTP 400')) {
        errorMessage = "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";
      } else if (message.includes('HTTP 401')) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (message.includes('HTTP 403')) {
        errorMessage = "Bạn không có quyền thực hiện thao tác này.";
      } else if (message.includes('HTTP 404')) {
        errorMessage = "Không tìm thấy thông tin yêu cầu.";
      } else if (message.includes('HTTP 500')) {
        errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
      } else if (message.includes('Network Error') || message.includes('fetch')) {
        errorMessage = "Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.";
      } else if (message.length > 0 && message.length < 200) {
        // Use original message if it's reasonable length
        errorMessage = message;
      }
    }
  }
  
  return errorMessage;
}

/**
 * Parse validation errors from API response
 */
export function parseValidationErrors(error: unknown): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (error instanceof Error) {
    try {
      const errorData = JSON.parse(error.message);
      
      if (errorData.errors && typeof errorData.errors === 'object') {
        // Handle validation errors object
        Object.keys(errorData.errors).forEach(field => {
          const fieldError = errorData.errors[field];
          if (typeof fieldError === 'string') {
            errors[field] = fieldError;
          } else if (Array.isArray(fieldError) && fieldError.length > 0) {
            errors[field] = fieldError[0];
          }
        });
      }
    } catch (parseError) {
      // If parsing fails, return empty object
    }
  }
  
  return errors;
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('401') || 
           message.includes('unauthorized') || 
           message.includes('token') ||
           message.includes('authentication');
  }
  return false;
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('fetch') ||
           message.includes('connection') ||
           message.includes('timeout');
  }
  return false;
}
