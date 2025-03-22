import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Define the i18n instance but don't initialize it yet
const i18nInstance = i18n.createInstance();

// Export a function to initialize i18n (to be called in a client component)
export const initI18n = () => {
  return i18nInstance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: {
            welcome: "Welcome to Desketo",
            register: "Register",
            mobile: "Mobile Number",
            verify_otp: "Verify OTP",
            otp: "OTP",
            submit: "Submit",
            update_profile: "Update Profile",
            name: "Name",
            id_number: "ID Number",
            kyc_file: "KYC File",
            select_package: "Select Package",
            packages: "Packages",
          },
        },
        fa: {
          translation: {
            welcome: "به دسکتو خوش آمدید",
            register: "ثبت‌نام",
            mobile: "شماره موبایل",
            verify_otp: "تأیید کد OTP",
            otp: "کد OTP",
            submit: "ارسال",
            update_profile: "بروزرسانی پروفایل",
            name: "نام",
            id_number: "شماره شناسایی",
            kyc_file: "فایل KYC",
            select_package: "انتخاب بسته",
            packages: "بسته‌ها",
          },
        },
      },
      fallbackLng: "en",
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
        caches: ["localStorage", "cookie"],
      },
    })
    .then(() => i18nInstance); // Return the i18nInstance after initialization
};

export default i18nInstance;