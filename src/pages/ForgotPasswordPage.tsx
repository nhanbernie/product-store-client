import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { authService } from "../services/authService";
import { useToast } from "@/hooks/use-toast";
import OTPInput from "../components/OTPInput";

type Step = "email" | "verify" | "reset" | "success";

interface FormData {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [resetId, setResetId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetCode = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.resetCode.trim()) {
      newErrors.resetCode = "Mã xác thực là bắt buộc";
    } else if (formData.resetCode.length !== 6) {
      newErrors.resetCode = "Mã xác thực phải có 6 chữ số";
    } else if (!/^\d{6}$/.test(formData.resetCode)) {
      newErrors.resetCode = "Mã xác thực chỉ được chứa số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60); // 60 seconds cooldown
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const resetIdResponse = await authService.forgotPassword(formData.email);
      setResetId(resetIdResponse);

      // Start the resend timer
      startResendTimer();

      // Only change step if not already on verify step (for resend case)
      if (currentStep === "email") {
        setCurrentStep("verify");
      }

      toast({
        title: "Mã xác thực đã được gửi",
        description: "Vui lòng kiểm tra email của bạn để lấy mã xác thực.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi mã xác thực. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetCode()) return;

    setIsLoading(true);
    try {
      await authService.verifyResetCode(resetId, formData.resetCode);
      setCurrentStep("reset");
      toast({
        title: "Mã xác thực hợp lệ",
        description: "Bây giờ bạn có thể đặt lại mật khẩu.",
      });
    } catch (error) {
      toast({
        title: "Mã xác thực không hợp lệ",
        description: "Vui lòng kiểm tra lại mã xác thực.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await authService.resetPassword(
        resetId,
        formData.resetCode,
        formData.newPassword
      );
      setCurrentStep("success");
      toast({
        title: "Đặt lại mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Quên mật khẩu";
      case "verify":
        return "Xác thực mã";
      case "reset":
        return "Đặt lại mật khẩu";
      case "success":
        return "Thành công";
      default:
        return "Quên mật khẩu";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Nhập email để nhận mã xác thực";
      case "verify":
        return "Nhập mã 6 chữ số đã được gửi đến email của bạn";
      case "reset":
        return "Tạo mật khẩu mới cho tài khoản của bạn";
      case "success":
        return "Mật khẩu đã được đặt lại thành công";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/login"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại đăng nhập
            </Link>

            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "email"
                      ? "bg-emerald-600 text-white"
                      : ["verify", "reset", "success"].includes(currentStep)
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-8 h-1 ${
                    ["verify", "reset", "success"].includes(currentStep)
                      ? "bg-emerald-600"
                      : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "verify"
                      ? "bg-emerald-600 text-white"
                      : ["reset", "success"].includes(currentStep)
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  2
                </div>
                <div
                  className={`w-8 h-1 ${
                    ["reset", "success"].includes(currentStep)
                      ? "bg-emerald-600"
                      : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === "reset"
                      ? "bg-emerald-600 text-white"
                      : currentStep === "success"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  3
                </div>
              </div>
            </div>

            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {currentStep === "success" ? (
                <CheckCircle className="text-white" size={24} />
              ) : (
                <span className="text-white font-bold text-xl">FC</span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {getStepTitle()}
            </h2>
            <p className="text-gray-600">{getStepDescription()}</p>
          </div>

          {/* Step Content */}
          {currentStep === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập email của bạn"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
              </button>
            </form>
          )}

          {currentStep === "verify" && (
            <form
              id="verify-form"
              onSubmit={handleVerifySubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Mã xác thực
                </label>
                <OTPInput
                  length={6}
                  value={formData.resetCode}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, resetCode: value }));
                    // Clear error when user starts typing
                    if (errors.resetCode) {
                      setErrors((prev) => ({ ...prev, resetCode: "" }));
                    }
                    // Auto-submit when OTP is complete
                    if (value.length === 6 && !isLoading) {
                      setTimeout(() => {
                        const form = document.getElementById(
                          "verify-form"
                        ) as HTMLFormElement;
                        if (form) form.requestSubmit();
                      }, 100);
                    }
                  }}
                  disabled={isLoading}
                  error={!!errors.resetCode}
                />
                {errors.resetCode && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {errors.resetCode}
                  </p>
                )}
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Mã xác thực đã được gửi đến <strong>{formData.email}</strong>
                </p>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={isLoading || resendTimer > 0}
                    className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={16} className="mr-1" />
                    {resendTimer > 0
                      ? `Gửi lại mã (${resendTimer}s)`
                      : "Gửi lại mã"}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("email")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực"}
                </button>
              </div>
            </form>
          )}

          {currentStep === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-12 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-12 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("verify")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                </button>
              </div>
            </form>
          )}

          {currentStep === "success" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-emerald-600" size={40} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mật khẩu đã được đặt lại thành công!
                </h3>
                <p className="text-gray-600">
                  Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
