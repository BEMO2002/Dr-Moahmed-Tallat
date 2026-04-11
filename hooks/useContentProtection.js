"use client";

import { useEffect, useState } from 'react';
import { PROTECT_CONTENT } from '@/lib/security';

/**
 * Hook to enforce client-side content protection limits.
 * 
 * Features when PROTECT_CONTENT is true:
 * - Disables right click
 * - Disables selection
 * - Disables copy/cut
 * - Detects developer tools shortcuts
 * - Option to trigger a blur overlay
 */
export const useContentProtection = () => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    if (!PROTECT_CONTENT) return;

    // Disable Right Click (Context Menu)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable Copy/Cut
    const handleCopy = (e) => {
      e.preventDefault();
      // Optional: alert the user or show a toast
    };

    // Disable DevTools Keyboard Shortcuts
    const handleKeyDown = (e) => {
      // Prevent F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Prevent Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }

      // Prevent Ctrl+Shift+J / Cmd+Option+J
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }

      // Prevent Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
    };

    // Very basic DevTools detection via window sizing / debugger
    // Note: Reliable DevTools detection is impossible in modern browsers,
    // this relies on checking the difference between outer and inner window bounds.
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    
    // Add CSS properties for disabling text selection globally for a specific class or the entire body
    document.body.style.userSelect = 'none';
    document.body.style.WebkitUserSelect = 'none';
    
    window.addEventListener('resize', detectDevTools);
    detectDevTools(); // Initial check

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', detectDevTools);
      
      document.body.style.userSelect = 'auto';
      document.body.style.WebkitUserSelect = 'auto';
    };
  }, []);

  return { isDevToolsOpen };
};
