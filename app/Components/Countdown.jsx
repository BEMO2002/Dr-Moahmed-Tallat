"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LightweightBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Detect mobile to reduce star count
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 30 : 60;

    const generatedStars = [...Array(count)].map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.5 + 0.3,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none">
      {/* Deep Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Static Stars (CSS based) */}
      <div className="absolute inset-0 opacity-30">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: `twinkle ${star.duration} infinite ease-in-out`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

// Use memo to prevent re-rendering when value hasn't changed
const TimeUnit = React.memo(({ value, label, id }) => (
  <div className="flex flex-col items-center gap-3 md:gap-5">
    <div className="relative">
      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
      <div className="relative w-20 h-24 md:w-32 md:h-44 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`${id}-${value}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
            className="text-4xl md:text-7xl font-black text-white"
          >
            {value.toString().padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/5" />
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
    <span className="text-[11px] md:text-sm font-black text-primary uppercase tracking-[0.2em]">
      {label}
    </span>
  </div>
));

TimeUnit.displayName = "TimeUnit";

const Countdown = ({ targetDate, onComplete = () => {} }) => {
  const serverTime = new Date();
  const targetTime = new Date(targetDate);
  const initiallyExpired = serverTime >= targetTime;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(initiallyExpired);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let mounted = true;

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) return { expired: true };

      return {
        expired: false,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const updateTimer = () => {
      const res = calculateTimeLeft();
      if (!mounted) return;

      if (res.expired) {
        setIsExpired(true);
        onComplete();
        if (!initiallyExpired) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        // Only update if something actually changed
        setTimeLeft(prev => {
          if (prev.seconds === res.seconds && 
              prev.minutes === res.minutes && 
              prev.hours === res.hours && 
              prev.days === res.days) return prev;
          return res;
        });
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    setIsMounted(true);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [targetDate, onComplete, initiallyExpired]);

  useEffect(() => {
    if (isMounted && isExpired) {
      document.documentElement.classList.remove("is-counting");
      const content = document.getElementById("site-main-content");
      if (content) {
        content.style.opacity = "1";
        content.style.pointerEvents = "auto";
        content.style.visibility = "visible";
      }
    }
  }, [isExpired, isMounted]);

  if (isExpired) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {!isExpired && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
            dir="rtl"
          >
            <LightweightBackground />

            <div className={`relative z-10 flex flex-col items-center gap-12 md:gap-16 px-6 text-center transition-opacity duration-1000 ${isMounted ? "opacity-100" : "opacity-0"}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isMounted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center gap-6"
              >
                {/* Badge */}
                <div className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[11px] md:text-sm font-black text-primary uppercase tracking-[0.3em]">
                    الافتتاح الرسمي للموقع الإلكتروني
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 
                    className="text-6xl md:text-[6rem] font-bold text-white leading-tight drop-shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                  >
                    محمد طلعت <span className="text-primary">عبد العزيز</span>
                  </h1>
                  <p className="text-gray-400 text-center text-sm md:text-xl mx-auto font-medium leading-relaxed opacity-80 max-w-2xl">
                    نحن نضع اللمسات الأخيرة على منصتنا الاستراتيجية المتكاملة. <br className="hidden md:block" />
                    استعدوا لتجربة فريدة في عالم التحليلات الاستراتيجية والوعي.
                  </p>
                </div>
              </motion.div>

              {/* Countdown Grid */}
              <div className="flex gap-4 md:gap-10">
                <TimeUnit value={timeLeft.days} label="أيام" id="days" />
                <TimeUnit value={timeLeft.hours} label="ساعات" id="hours" />
                <TimeUnit value={timeLeft.minutes} label="دقائق" id="minutes" />
                <TimeUnit value={timeLeft.seconds} label="ثواني" id="seconds" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isMounted ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] opacity-50">
                  سيتم إطلاق المنصة في: 5 مايو 2026 - 05:00 مساءً (بتوقيت البحرين)
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Countdown;
