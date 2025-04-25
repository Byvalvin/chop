"use client";

import BaseBanner from "./Banner";
import { useState, useEffect } from "react";

const DISMISS_KEY = "chop-install-dismissed"; // Key to track dismissal in sessionStorage

export default function InstallPWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if user already dismissed the banner in the current session
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      const dismissed = sessionStorage.getItem(DISMISS_KEY);

      if (!dismissed) {
        setDeferredPrompt(e);
        setIsInstallable(true);
        setIsVisible(true);
        console.log("[PWA] Install prompt captured and banner shown");
      } else {
        console.log("[PWA] Install previously dismissed");
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWA] User response:", outcome);

    if (outcome === "accepted" || outcome === "dismissed") {
      sessionStorage.setItem(DISMISS_KEY, "true"); // Store dismissal in sessionStorage
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true"); // Store dismissal in sessionStorage
    setIsVisible(false);
  };

  const handleReset = () => {
    // Reset the dismissal flag from sessionStorage for testing purposes
    sessionStorage.removeItem(DISMISS_KEY);
    setIsVisible(true);  // Show banner again
    console.log("[PWA] Install banner reset for testing");
  };

  if (!isVisible) return null;

  return (
    <div>
      <BaseBanner
        title="Install Chop"
        message="Add Chop to your device for quicker access and offline cooking!"
        onConfirm={handleInstall}
        onDismiss={handleDismiss}
        confirmText="Install"
        dismissText="Not now"
      />
      
      {/* Debug button to reset banner visibility */}
      {/* <button 
        onClick={handleReset} 
        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
      >
        Reset Install Banner
      </button> */}
    </div>
  );
}
