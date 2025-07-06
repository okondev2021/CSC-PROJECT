import React, { useState } from "react";
import {
  SendIcon,
  CheckCircleIcon,
  ShieldIcon,
  EyeOffIcon,
  FileTextIcon,
  AlertCircleIcon,
} from "lucide-react";
import { supabase } from "../database/supabase";

interface FormData {
  category: string;
  message: string;
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface StatusMessageProps {
  type: "success" | "error";
  title: string;
  message: string;
}

const SubmitFeedback = () => {
  const [formData, setFormData] = useState<FormData>({
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const categories: string[] = [
    "Academics",
    "Hostel",
    "Administrative Issues",
    "Facilities",
    "Welfare",
    "Others",
  ];

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = (): void => {
    setFormData({ category: "", message: "" });
    setSubmitStatus(null);
    setErrorMessage("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.category || !formData.message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.from("feedback").insert([
        {
          category: formData.category,
          message: formData.message.trim(),
        },
      ]);

      if (error) {
        throw error;
      }

      setSubmitStatus("success");
      setFormData({ category: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitStatus("error");
      setErrorMessage("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <div className="bg-purple-100 p-3 rounded-full mb-4">
        <Icon className="h-6 w-6 text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const StatusMessage: React.FC<StatusMessageProps> = ({
    type,
    title,
    message,
  }) => {
    const isSuccess = type === "success";
    const bgColor = isSuccess ? "bg-green-50" : "bg-red-50";
    const borderColor = isSuccess ? "border-green-200" : "border-red-200";
    const textColor = isSuccess ? "text-green-800" : "text-red-800";
    const descColor = isSuccess ? "text-green-700" : "text-red-700";
    const Icon = isSuccess ? CheckCircleIcon : AlertCircleIcon;
    const iconColor = isSuccess ? "text-green-500" : "text-red-500";

    return (
      <div
        className={`${bgColor} border ${borderColor} rounded-md p-4 flex items-center`}
      >
        <Icon className={`h-6 w-6 ${iconColor} mr-3 flex-shrink-0`} />
        <div>
          <h3 className={`font-medium ${textColor}`}>{title}</h3>
          <p className={`${descColor} mt-1`}>{message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Share Your Feedback Anonymously
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help improve your school by providing honest feedback without
            revealing your identity. Your input matters and can make a real
            difference.
          </p>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={EyeOffIcon}
            title="100% Anonymous"
            description="We don't collect any personal information. Your identity remains completely protected."
          />
          <FeatureCard
            icon={ShieldIcon}
            title="Safe & Secure"
            description="Your feedback is securely handled and only accessible to authorized personnel."
          />
          <FeatureCard
            icon={FileTextIcon}
            title="Actionable Insights"
            description="Your feedback helps identify issues and implement meaningful improvements."
          />
        </section>

        {/* Form Section */}
        <section className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Submit Your Feedback
          </h2>

          {submitStatus === "success" && (
            <div className="mb-6">
              <StatusMessage
                type="success"
                title="Feedback Submitted Successfully!"
                message="Thank you for helping improve your school. Your feedback has been received."
              />
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6">
              <StatusMessage
                type="error"
                title="Submission Failed"
                message={errorMessage}
              />
            </div>
          )}

          {submitStatus !== "success" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-vertical"
                  placeholder="Please describe your feedback, suggestion or concern in detail..."
                  required
                  disabled={isSubmitting}
                  minLength={10}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 10 characters required
                </p>
              </div>

              {errorMessage && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {formData.category || formData.message ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-md flex items-center transition-colors"
                  disabled={
                    isSubmitting ||
                    !formData.category ||
                    !formData.message.trim()
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Privacy Notice:</strong> This system is designed to be
              completely anonymous. We do not track IP addresses, require login
              credentials, or collect any personally identifiable information
              when you submit feedback.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubmitFeedback;
