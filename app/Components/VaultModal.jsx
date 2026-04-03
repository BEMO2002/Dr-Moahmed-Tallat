"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useVault } from "../Context/VaultContext";
import { useRouter } from "../../i18n/routing";
import { FaPaperPlane } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import toast from "react-hot-toast";
import { RiLockPasswordFill } from "react-icons/ri";
const VaultModal = ({ isOpen, onClose, isRTL }) => {
  const t = useTranslations("navbar");
  const { unlock } = useVault();
  const router = useRouter();
  const [vaultPassword, setVaultPassword] = useState("");
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultError, setVaultError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVaultLoading(true);
    setVaultError("");
    try {
      const res = await unlock(vaultPassword);
      if (res.success) {
        toast.success(res.message);
        onClose();
        router.push("/research-archive");
      } else {
        setVaultError(t("vault.wrongPassword"));
      }
    } catch (err) {
      setVaultError("An error occurred. Please try again.");
    } finally {
      setVaultLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => !vaultLoading && onClose()}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RiLockPasswordFill className="text-primary text-2xl" />
            </div>
            <h3 className="text-2xl font-black text-baseTwo mb-2">
              {t("vault.enterPassword")}
            </h3>
            <p className="text-slate-500 text-sm">
              {t(
                "vault.passwordSubtitle",
                "Please enter the password to access the research archive",
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={vaultPassword}
                onChange={(e) => setVaultPassword(e.target.value)}
                placeholder="*****"
                className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all text-center text-xl tracking-widest ${
                  vaultError
                    ? "border-red-100 focus:border-red-200"
                    : "border-gray-100 focus:border-primary/20"
                }`}
                autoFocus
              />
              {vaultError && (
                <p className="text-red-500 text-xs mt-2 text-center font-bold">
                  {vaultError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={vaultLoading || !vaultPassword}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:opacity-50 disabled:shadow-none transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3"
            >
              {vaultLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t("vault.submit")}</span>
                  <RiLockPasswordFill size={24} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VaultModal;
