"use client";
import React, { useState, useEffect, useId } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, usePathname, useRouter } from "../../i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSettings } from "../Context/SettingContext";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaPaperPlane, FaChevronDown } from "react-icons/fa";
import { fetchContactTypes } from "../lib/server-api";
import Image from "next/image";

// US Flag Component (Using UK flag as per user change)
const USFlag = ({ className = "w-6 h-4" }) => (
  <div
    className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
  >
    <Image
      src="https://flagcdn.com/w40/gb.png"
      alt="English"
      fill
      className="object-cover"
    />
  </div>
);

// Egypt Flag Component (Using Saudi flag as per user change)
const EgyptFlag = ({ className = "" }) => (
  <div
    className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
  >
    <Image
      src="https://flagcdn.com/w40/sa.png"
      alt="Arabic"
      fill
      className="object-cover"
    />
  </div>
);

const LanguageDropdown = ({
  className,
  locale,
  isRTL,
  isLangDropdownOpen,
  setIsLangDropdownOpen,
  switchLanguage,
}) => {
  const t = useTranslations("navbar");
  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsLangDropdownOpen(true)}
      onMouseLeave={() => setIsLangDropdownOpen(false)}
    >
      <button
        className={`${className} flex items-center gap-2 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-200 rounded-full px-3 py-2 w-full `}
      >
        <div className="flex items-center gap-2">
          {locale === "en" ? (
            <USFlag className="w-6 h-4 scale-125" />
          ) : (
            <EgyptFlag className="w-6 h-4 scale-125" />
          )}
          <span className="text-baseTwo font-bold uppercase text-xs">
            {locale === "en" ? "EN" : "AR"}
          </span>
        </div>
        <FaChevronDown
          size={10}
          className={`opacity-50 transition-transform duration-300 ${isLangDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isLangDropdownOpen && (
        <div
          className={`absolute top-full ${isRTL ? "left-0" : "right-0"} pt-2 z-60 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200`}
        >
          <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col py-1 overflow-hidden">
            <button
              onClick={() => switchLanguage("en")}
              className={`px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${locale === "en" ? "bg-primary/5 text-primary" : "text-baseTwo"}`}
            >
              <USFlag className="w-5 h-3.5" />
              <span className="font-bold text-xs uppercase text-start">
                {t("english")}
              </span>
            </button>
            <button
              onClick={() => switchLanguage("ar")}
              className={`px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${locale === "ar" ? "bg-primary/5 text-primary" : "text-baseTwo"}`}
            >
              <EgyptFlag className="w-6 h-4" />
              <span className="font-bold text-xs uppercase text-start">
                {t("arabic")}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { settings } = useSettings();

  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
  const [isMobileMediaDropdownOpen, setIsMobileMediaDropdownOpen] =
    useState(false);

  const [contactTypes, setContactTypes] = useState([]);
  const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
  const [isMobileExecutiveDropdownOpen, setIsMobileExecutiveDropdownOpen] =
    useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    fetchContactTypes().then(setContactTypes).catch(console.error);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMediaDropdownOpen(false);
    setIsMobileMediaDropdownOpen(false);
    setIsExecutiveDropdownOpen(false);
    setIsMobileExecutiveDropdownOpen(false);
    setIsLangDropdownOpen(false);
  };
  const isActive = (path) => pathname === path;

  const switchLanguage = (newLocale) => {
    router.replace(pathname, {
      locale: newLocale,
      scroll: false,
    });
    setIsLangDropdownOpen(false);
  };

  const navLinks = [
    { to: "/", label: t("navbar.home") },
    { to: "/courses", label: t("navbar.services") },
    {
      label: t("navbar.media.title"),
      isDropdown: true,
      items: [
        { to: "/meetings-conferences", label: t("navbar.media.interviews") },
        { to: "/blogs?type=articles", label: t("navbar.media.articles") },
        { to: "/meetings-conferences", label: t("navbar.media.conferences") },
        { to: "/quotations", label: t("navbar.media.citations") },
      ],
    },
    { to: "/about", label: t("navbar.about") },
    { to: "/contact", label: t("navbar.contact") },
  ];

  const DesktopNavLink = ({ to, children }) => (
    <Link
      href={to}
      onClick={closeMenu}
      className={`relative group px-4 py-3 text-lg font-medium transition-all duration-300 rounded-lg hover:bg-black/5 ${
        isActive(to) ? "text-baseTwo" : "text-baseTwo hover:text-primary"
      }`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(to) ? "w-full" : "w-0 group-hover:w-full"}`}
      ></span>
    </Link>
  );

  return (
    <>
      <nav className="bg-white shadow-sm backdrop-blur-sm fixed top-0 left-0 right-0 z-[999] py-4 md:px-6 px-2">
        <div className="max-w-7xl mx-auto md:px-4 px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo Section */}
            <div className="">
              <Link
                href="/"
                onClick={closeMenu}
                className="block group relative w-30 h-30 md:w-30 lg:w-30 lg:h-30"
              >
                {settings?.logo && (
                  <Image
                    src={settings.logo}
                    alt="Logo"
                    fill
                    priority
                    sizes="(max-width: 768px) 112px, 160px"
                    className="object-contain p-1.5"
                  />
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden whitespace-nowrap lg:flex items-center space-x-2">
              {navLinks.map((link, idx) => {
                if (link.isDropdown) {
                  return (
                    <div
                      key={idx}
                      className="relative group"
                      onMouseEnter={() => setIsMediaDropdownOpen(true)}
                      onMouseLeave={() => setIsMediaDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center gap-1 px-4 py-3 text-lg font-medium transition-all duration-300 rounded-lg hover:bg-black/5 text-baseTwo group-hover:text-primary`}
                      >
                        <span>{link.label}</span>
                        <FaChevronDown
                          size={12}
                          className={`opacity-50 transition-transform duration-300 ${isMediaDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isMediaDropdownOpen && (
                        <div
                          className={`absolute top-full ${isRTL ? "right-0" : "left-0"} pt-1  min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200`}
                        >
                          <div className="bg-white border border-gray-100 shadow-xl rounded-2xl flex flex-col py-1 overflow-hidden">
                            {link.items.map((item, i) => (
                              <Link
                                key={i}
                                href={item.to}
                                onClick={() => setIsMediaDropdownOpen(false)}
                                className={`px-5 py-3.5 text-baseTwo hover:bg-gray-50 hover:text-primary transition-all border-b last:border-0 border-gray-50 flex items-center justify-between group ${isRTL ? "text-right" : "text-left"}`}
                              >
                                <span className="font-semibold text-sm">
                                  {item.label}
                                </span>
                                <MdOutlineKeyboardArrowDown
                                  size={16}
                                  className={`opacity-0 group-hover:opacity-30 transition-all ${isRTL ? "rotate-90" : "-rotate-90"}`}
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <DesktopNavLink key={link.to} to={link.to}>
                    {link.label}
                  </DesktopNavLink>
                );
              })}
            </div>

            {/* Utility Space*/}
            <div className="flex items-center md:space-x-4 space-x-2">
              <LanguageDropdown
                className=""
                locale={locale}
                isRTL={isRTL}
                isLangDropdownOpen={isLangDropdownOpen}
                setIsLangDropdownOpen={setIsLangDropdownOpen}
                switchLanguage={switchLanguage}
              />

              {/* Desktop Executive Request CTA */}
              <div
                className="relative group lg:block hidden"
                onMouseEnter={() => setIsExecutiveDropdownOpen(true)}
                onMouseLeave={() => setIsExecutiveDropdownOpen(false)}
              >
                <button className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-primary/30 transition-all text-sm">
                  <span>{t("navbar.executiveRequest")}</span>
                  <FaChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${isExecutiveDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isExecutiveDropdownOpen && (
                  <div
                    className={`absolute top-full ${isRTL ? "-left-4" : "-right-4"} pt-2  min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200`}
                  >
                    <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col py-1 overflow-hidden">
                      {contactTypes.map((type) => (
                        <Link
                          key={type.id}
                          href={`/contact?type=${type.id}`}
                          onClick={() => setIsExecutiveDropdownOpen(false)}
                          className={`px-6 py-4 text-baseTwo hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-50 flex items-center gap-4 group ${isRTL ? "flex-row-reverse text-right" : "flex-row text-left"}`}
                        >
                          <span className="font-semibold whitespace-nowrap text-md flex-1">
                            {type.name?.[locale] || ""}
                          </span>
                          <FaPaperPlane
                            size={12}
                            className={`opacity-0 group-hover:opacity-100 transition-all shrink-0 ${isRTL ? "-translate-x-2 group-hover:translate-x-0" : "translate-x-2 group-hover:translate-x-0"}`}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button toggle */}
              <button
                onClick={toggleMenu}
                className="lg:hidden text-primary p-2 transition-all duration-300"
              >
                <div className="relative w-7 h-7">
                  <FiMenu
                    size={28}
                    className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"}`}
                  />
                  <FiX
                    size={28}
                    className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-[1000] transition-all duration-500 ${isMenuOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeMenu}
        />

        <div
          className={`absolute top-0 ${isRTL ? "right-0 translate-x-full" : "left-0 -translate-x-full"} w-72 h-full bg-white shadow-2xl transition-transform duration-500 transform ${isMenuOpen && "!translate-x-0"}`}
        >
          <div className="flex flex-col h-full bg-third/5">
            {/* Header */}
            <div className="p-2 flex items-center justify-between border-b border-gray-100 shadow-sm bg-white">
              <Link
                href="/"
                onClick={closeMenu}
                className="block relative h-20 w-32"
              >
                {settings?.logo ? (
                  <Image
                    src={settings.logo}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary">
                    {settings?.site_name?.[locale] || "Logo"}
                  </span>
                )}
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 text-primary hover:bg-primary/5 rounded-full bg-gray-50"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {navLinks.map((link, idx) => {
                if (link.isDropdown) {
                  return (
                    <div key={idx} className="w-full">
                      <button
                        onClick={() =>
                          setIsMobileMediaDropdownOpen(
                            !isMobileMediaDropdownOpen,
                          )
                        }
                        className={`w-full text-lg font-bold py-3 transition-colors flex items-center justify-between ${isMobileMediaDropdownOpen ? "text-primary" : "text-baseTwo"}`}
                      >
                        <span className="text-start">{link.label}</span>
                        <FaChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${isMobileMediaDropdownOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileMediaDropdownOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="flex flex-col gap-1 border-s-2 border-primary/10 ml-2 rtl:ml-0 rtl:mr-2 pl-4 rtl:pl-0 rtl:pr-4 py-2">
                          {link.items.map((item, i) => (
                            <Link
                              key={i}
                              href={item.to}
                              onClick={closeMenu}
                              className="py-2.5 text-md font-medium text-slate-600 hover:text-primary transition-colors text-start block"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    onClick={closeMenu}
                    className={`text-lg font-bold py-3 transition-colors flex items-center justify-between ${isActive(link.to) ? "text-primary" : "text-baseTwo hover:text-primary"}`}
                  >
                    <span className="text-start">{link.label}</span>
                    <MdOutlineKeyboardArrowDown
                      className={`opacity-30 ${isRTL ? "rotate-90" : "-rotate-90"}`}
                    />
                  </Link>
                );
              })}

              {/* Mobile Executive Request Collapsible */}
              {contactTypes.length > 0 && (
                <div className="w-full mt-6">
                  <button
                    onClick={() =>
                      setIsMobileExecutiveDropdownOpen(
                        !isMobileExecutiveDropdownOpen,
                      )
                    }
                    className="w-full bg-gray-100 rounded-xl px-2 flex items-center justify-between text-baseTwo hover:text-primary py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 block"></span>
                      <span className="text-baseTwo text-md font-black uppercase tracking-widest text-start">
                        {t("navbar.executiveRequest")}
                      </span>
                    </div>
                    <FaChevronDown
                      size={14}
                      className={`transition-transform duration-300 opacity-60 ${isMobileExecutiveDropdownOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileExecutiveDropdownOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                  >
                    <div className="flex flex-col gap-2 border-s-2 border-gray-100 rtl:border-r-2 rtl:border-l-0 pl-4 rtl:pr-4 mx-2">
                      {contactTypes.map((type) => (
                        <Link
                          key={type.id}
                          href={`/contact?type=${type.id}`}
                          onClick={closeMenu}
                          className="p-3 bg-white border border-gray-50 rounded-xl text-baseTwo hover:text-primary transition-all flex items-center gap-3 group shadow-sm hover:bg-primary/5 hover:border-primary"
                        >
                          <div className="w-7 h-7 shrink-0 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <FaPaperPlane
                              size={10}
                              className="opacity-80 rtl:rotate-180"
                            />
                          </div>
                          <span className="text-sm font-bold flex-1 text-start">
                            {type.name?.[locale] || ""}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-bold text-baseTwo uppercase">
                  {t("navbar.language", "Language")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => switchLanguage("en")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${locale === "en" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-gray-200 text-baseTwo hover:border-primary"}`}
                >
                  <USFlag className="w-5 h-3.5" />
                  <span className="font-bold text-sm uppercase">
                    {t("navbar.english")}
                  </span>
                </button>
                <button
                  onClick={() => switchLanguage("ar")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${locale === "ar" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-gray-200 text-baseTwo hover:border-primary"}`}
                >
                  <EgyptFlag className="w-5 h-3.5" />
                  <span className="font-bold text-sm uppercase">
                    {t("navbar.arabic")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
