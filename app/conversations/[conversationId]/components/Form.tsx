"use client";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto, HiPaperAirplane, HiLanguage, HiChevronUp } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
import Modal from "@/app/components/Modal";
import { useState, useRef, useEffect } from "react";

interface Language {
  name: string;
  code: string;
}

const Form = () => {
  const { conversationId } = useConversation();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId,
      language: selectedLanguage?.code, // Pass the selected language code to the API
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", { image: result?.info?.secure_url, conversationId });
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages: Language[] = [
    { name: "English", code: "en" },
    { name: "Spanish", code: "es" },
    { name: "French", code: "fr" },
    { name: "German", code: "de" },
    { name: "Italian", code: "it" },
    { name: "Portuguese", code: "pt" },
    { name: "Russian", code: "ru" },
    { name: "Arabic", code: "ar" },
    { name: "Chinese (Simplified)", code: "zh-cn" },
    { name: "Chinese (Traditional)", code: "zh-tw" },
    { name: "Japanese", code: "ja" },
    { name: "Korean", code: "ko" },
    { name: "Hindi", code: "hi" },
    { name: "Bengali", code: "bn" },
    { name: "Urdu", code: "ur" },
    { name: "Turkish", code: "tr" },
    { name: "Polish", code: "pl" },
    { name: "Thai", code: "th" },
    { name: "Malay", code: "ms" },
    { name: "Indonesian", code: "id" },
  ];

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton options={{ maxFiles: 1 }} onUpload={handleUpload} uploadPreset="lil8gd5f">
        <HiPhoto size={32} className="text-sky-500" />
      </CldUploadButton>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
        <MessageInput id="message" register={register} errors={errors} required placeholder="Write a Message" />
        <button type="submit" className="bg-sky-500 text-white p-2 rounded-full cursor-pointer hover:bg-sky-600 transition">
          <HiPaperAirplane size={18} />
        </button>
        <div className="relative">
          <button
            type="button"
            className="bg-sky-500 text-white p-2 rounded-full cursor-pointer hover:bg-sky-600 transition flex items-center"
            onClick={toggleLanguageDropdown}
          >
            <HiLanguage size={18} />
            <HiChevronUp size={18} />
            {selectedLanguage && <span className="ml-2">{selectedLanguage.code.toLocaleUpperCase()}</span>}
          </button>
          {showLanguageDropdown && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full right-0 mb-2 bg-white rounded-md shadow-lg z-10 max-h-48 overflow-y-auto"
              style={{ maxWidth: "calc(100vw - 32px)" }}
            >
              <div className="py-1">
                {languages.map((language) => (
                  <a
                    key={language.code}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleLanguageSelect(language)}
                  >
                    {language.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;