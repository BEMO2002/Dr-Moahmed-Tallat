"use client";

import React, { useState, useContext, useEffect, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { submitContactForm, fetchContactTypes } from "../lib/server-api";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaSpinner,
  FaListUl,
  FaPaperclip,
  FaChevronDown,
} from "react-icons/fa";
import contactImage from "../../public/Home/contatc.png";

const ContactFormContent = () => {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isRTL = locale === "ar";

  const initialTypeId = searchParams.get("type") || "";

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    extra_key: "",
    contact_type_id: initialTypeId,
    attachment: null,
  });

  const [contactTypes, setContactTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // Fetch Contact Types
  useEffect(() => {
    const getContactTypes = async () => {
      try {
        const data = await fetchContactTypes();
        setContactTypes(data);
      } catch (err) {
        console.error("Failed to fetch contact types:", err);
      }
    };
    getContactTypes();
  }, []);

  // Update selection if URL param changes
  useEffect(() => {
    if (initialTypeId) {
      setFormData((prev) => ({
        ...prev,
        contact_type_id: initialTypeId,
      }));
    }
  }, [initialTypeId]);

  // Generate random math question
  useEffect(() => {
    const generateMathQuestion = () => {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operations = ["+", "-", "*"];
      const operation =
        operations[Math.floor(Math.random() * operations.length)];
      let question, answer;

      switch (operation) {
        case "+":
          question = `${num1} + ${num2} = ?`;
          answer = num1 + num2;
          break;
        case "-":
          question = `${num1} - ${num2} = ?`;
          answer = num1 - num2;
          break;
        case "*":
          question = `${num1} × ${num2} = ?`;
          answer = num1 * num2;
          break;
        default:
          question = `${num1} + ${num2} = ?`;
          answer = num1 + num2;
      }

      setMathQuestion(question);
      setCorrectAnswer(answer);
    };

    generateMathQuestion();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      setFormData((prev) => ({
        ...prev,
        attachment: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing/changing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle math answer change
  const handleMathAnswerChange = (e) => {
    setMathAnswer(e.target.value);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("contactForm.errorNameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("contactForm.errorNameTooShort");
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t("contactForm.errorPhoneRequired");
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = t("contactForm.errorPhoneInvalid");
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("contactForm.errorEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contactForm.errorEmailInvalid");
    }

    // Contact Type validation
    if (!formData.contact_type_id) {
      newErrors.contact_type_id = t("contactForm.errorContactTypeRequired");
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t("contactForm.errorMessageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contactForm.errorMessageTooShort");
    }

    // Extra key validation (honeypot)
    if (formData.extra_key && formData.extra_key.trim() !== "") {
      newErrors.extra_key = t("contactForm.errorInvalidSubmission");
    }

    // Math answer validation
    if (!mathAnswer.trim()) {
      newErrors.mathAnswer = t("contactForm.errorMathRequired");
    } else if (parseInt(mathAnswer) !== correctAnswer) {
      newErrors.mathAnswer = t("contactForm.errorMathIncorrect");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("contactForm.errorValidation"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Construct FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("message", formData.message);
      data.append("contact_type_id", formData.contact_type_id);
      data.append("extra_key", ""); // Always empty on success submission

      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }

      console.log("Submitting FormData...");

      const response = await submitContactForm(data);

      console.log("API Response:", response);

      if (response.ok) {
        toast.success(t("contactForm.successMessage"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          extra_key: "",
          contact_type_id: "",
          attachment: null,
        });
        setMathAnswer("");
        setErrors({});
        // Generate new math question
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operations = ["+", "-", "*"];
        const operation =
          operations[Math.floor(Math.random() * operations.length)];
        let question, answer;
        switch (operation) {
          case "+":
            question = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
            break;
          case "-":
            question = `${num1} - ${num2} = ?`;
            answer = num1 - num2;
            break;
          case "*":
            question = `${num1} × ${num2} = ?`;
            answer = num1 * num2;
            break;
          default:
            question = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
        }
        setMathQuestion(question);
        setCorrectAnswer(answer);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      let errorMessage = t("contactForm.errorGeneral");

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        errorMessage = errorData.message || t("contactForm.errorGeneral");
      }

      toast.error(errorMessage, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="py-16  px-4 md:px-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Image on the left */}
            <div className="hidden md:block">
              <img
                src={contactImage.src || contactImage}
                alt="Contact us"
                className=" w-full h-full object-cover  "
              />
            </div>
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-3xl  p-8 md:p-12 border border-gray-100 flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                    >
                      <FaUser className="text-primary" />
                      <span className={isRTL ? "text-right" : "text-left"}>
                        {t("contactForm.labelName")}
                      </span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                        errors.name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderName")}
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p
                        className={`text-red-500 text-sm mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                    >
                      <FaPhone className="text-primary" />
                      <span className={isRTL ? "text-right" : "text-left"}>
                        {t("contactForm.labelPhone")}
                      </span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderPhone")}
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p
                        className={`text-red-500 text-sm mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                    >
                      <FaEnvelope className="text-primary" />
                      <span className={isRTL ? "text-right" : "text-left"}>
                        {t("contactForm.labelEmail")}
                      </span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderEmail")}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p
                        className={`text-red-500 text-sm mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Contact Type Dropdown */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact_type_id"
                      className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                    >
                      <FaListUl className="text-primary" />
                      <span className={isRTL ? "text-right" : "text-left"}>
                        {t("contactForm.labelContactType")}
                      </span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group/select">
                      <select
                        id="contact_type_id"
                        name="contact_type_id"
                        value={formData.contact_type_id}
                        onChange={handleChange}
                        className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white appearance-none cursor-pointer pr-10 pl-4 ${
                          errors.contact_type_id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300 hover:border-primary/50"
                        } ${isRTL ? "text-right pr-4 pl-10" : "text-left pr-10 pl-4"}`}
                        disabled={isLoading}
                      >
                        <option value="">
                          {t("contactForm.placeholderContactType")}
                        </option>
                        {contactTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name[locale]}
                          </option>
                        ))}
                      </select>
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover/select:text-primary ${
                          isRTL ? "left-4" : "right-4"
                        }`}
                      >
                        <FaChevronDown
                          size={14}
                          className="text-gray-400 group-focus-within/select:rotate-180 transition-transform"
                        />
                      </div>
                    </div>
                    {errors.contact_type_id && (
                      <p
                        className={`text-red-500 text-sm mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.contact_type_id}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    <FaCommentDots className="text-primary" />
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("contactForm.labelMessage")}
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo resize-vertical ${
                      errors.message
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contactForm.placeholderMessage")}
                    disabled={isLoading}
                  />
                  {errors.message && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Attachment Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="attachment"
                    className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    <FaPaperclip className="text-primary" />
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("contactForm.labelAttachment")}
                    </span>
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      id="attachment"
                      name="attachment"
                      onChange={handleChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="attachment"
                      className={`flex items-center justify-between w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 cursor-pointer bg-white group-hover:border-gray-400 ${
                        isRTL ? "flex-row-reverse" : ""
                      } border-gray-300`}
                    >
                      <span
                        className={`text-gray-500 truncate ${
                          isRTL ? "text-right mr-2" : "text-left ml-2"
                        }`}
                      >
                        {formData.attachment
                          ? formData.attachment.name
                          : t("contactForm.placeholderAttachment")}
                      </span>
                      <div className="px-4 py-1.5 bg-gray-100 text-baseTwo rounded-lg text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                        {isRTL ? "اختر ملفاً" : "Browse"}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Extra Key (Honeypot) */}
                <div className="hidden">
                  <label htmlFor="extra_key">
                    {t("contactForm.honeypotLabel")}
                  </label>
                  <input
                    type="text"
                    id="extra_key"
                    name="extra_key"
                    value={formData.extra_key}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                  {errors.extra_key && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.extra_key}
                    </p>
                  )}
                </div>

                {/* Math CAPTCHA */}
                <div className="space-y-2">
                  <label
                    htmlFor="mathAnswer"
                    className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("contactForm.labelMath")} ({mathQuestion})
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="mathAnswer"
                    name="mathAnswer"
                    value={mathAnswer}
                    onChange={handleMathAnswerChange}
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                      errors.mathAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contactForm.placeholderMath")}
                    disabled={isLoading}
                  />
                  {errors.mathAnswer && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.mathAnswer}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-baseTwo to-primary text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t("contactForm.buttonSending")}
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        {t("contactForm.buttonSend")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ContactForm = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-primary text-4xl" />
        </div>
      }
    >
      <ContactFormContent />
    </Suspense>
  );
};

export default ContactForm;
