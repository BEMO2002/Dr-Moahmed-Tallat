"use client";
import React, { useState, useEffect, useId } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, usePathname, useRouter } from "../../i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSettings } from "../Context/SettingContext";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaPaperPlane, FaChevronDown } from "react-icons/fa";
import { fetchContactTypes } from "../lib/server-api";

// US Flag Component
const USFlag = ({ className = "w-6 h-4" }) => (
  <div
    className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
  >
    <img
      src="https://flagcdn.com/w40/us.png"
      alt="English"
      className="w-full h-full object-cover"
    />
  </div>
);

// Egypt Flag Component
const EgyptFlag = ({ className = "w-10 h-6" }) => (
  <div
    className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
  >
    <img
      src="https://flagcdn.com/w40/eg.png"
      alt="Arabic"
      className="w-full h-full object-cover"
    />
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { settings } = useSettings();

  const [contactTypes, setContactTypes] = useState([]);
  const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
  const [isMobileExecutiveDropdownOpen, setIsMobileExecutiveDropdownOpen] =
    useState(false);

  useEffect(() => {
    fetchContactTypes().then(setContactTypes).catch(console.error);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => pathname === path;

  const toggleLanguage = () => {
    router.replace(pathname, {
      locale: locale === "en" ? "ar" : "en",
      scroll: false,
    });
  };

  const navLinks = [
    { to: "/", label: t("navbar.home") },
    { to: "/courses", label: t("navbar.services") },
    { to: "/blogs", label: t("navbar.blogs") },
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

  const LanguageBtn = ({ className }) => (
    <button
      onClick={toggleLanguage}
      className={className}
      title={locale === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      {locale === "en" ? (
        <USFlag className="w-7 h-4" />
      ) : (
        <EgyptFlag className="w-7 h-4" />
      )}
      <span className="text-baseTwo font-bold uppercase">
        {locale === "en" ? "AR" : "EN"}
      </span>
    </button>
  );

  return (
    <>
      <nav className="bg-white shadow-sm backdrop-blur-sm fixed top-0 left-0 right-0 z-[999] py-4 md:px-6 px-2">
        <div className="max-w-7xl mx-auto md:px-4 px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" onClick={closeMenu} className="flex items-center">
                {settings?.logo && (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="md:w-30 w-28 lg:h-30 lg:w-auto  object-contain p-1"
                  />
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden whitespace-nowrap lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <DesktopNavLink key={link.to} to={link.to}>
                  {link.label}
                </DesktopNavLink>
              ))}
            </div>

            {/* Utility Space*/}
            <div className="flex items-center md:space-x-4 space-x-2">
              <LanguageBtn className="flex items-center space-x-1 bg-gray-50 shadow-sm rounded-full px-2.5 py-2 transition-all duration-300 border border-gray-200 text-xs" />

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
                    className={`absolute top-full ${isRTL ? "-left-4" : "-right-4"} pt-2 z-[60] min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200`}
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
            <div className="p-6 flex items-center justify-between border-b border-gray-100 shadow-sm bg-white">
              <Link href="/" onClick={closeMenu} className="block">
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="h-20 w-auto object-contain"
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
              {navLinks.map((link) => (
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
              ))}

              {/* Mobile Executive Request Collapsible */}
              {contactTypes.length > 0 && (
                <div className="w-full mt-6">
                  <button
                    onClick={() =>
                      setIsMobileExecutiveDropdownOpen(
                        !isMobileExecutiveDropdownOpen,
                      )
                    }
                    className="w-full flex items-center justify-between text-baseTwo hover:text-primary py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 block"></span>
                      <span className="text-gray-500 text-xs font-black uppercase tracking-widest text-start">
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
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <LanguageBtn className="flex items-center justify-center space-x-3 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:border-primary transition-all text-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
