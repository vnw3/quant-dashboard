"use client";

import { useState, useEffect } from "react";
import { getApiKey, setApiKey, clearApiKey } from "../lib/gemini";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ open, onClose }: ApiKeyModalProps) {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const existing = getApiKey();
    if (existing) {
      setKey(existing);
      setHasKey(true);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      setSaved(true);
      setHasKey(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setKey("");
    setHasKey(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#171c1f]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-md shadow-[0_20px_40px_rgba(23,28,31,0.15)] p-6 w-[480px] max-w-[90vw]">
        <h3
          className="text-[#171c1f] text-lg font-semibold mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          API Key Settings
        </h3>
        <p className="text-[#6b7280] text-xs mb-4">
          Enter your Google Gemini API key to enable live simulations.
          Your key is stored locally in your browser and never sent to any server.
        </p>

        <div className="mb-4">
          <label className="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1.5 block">
            Gemini API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-[#f6fafe] text-[#171c1f] text-sm rounded-md px-3 py-2.5 placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30"
          />
        </div>

        <div className="bg-[#f0f4f8] rounded-md p-3 mb-4">
          <p className="text-[#42474d] text-[11px] leading-relaxed">
            <span className="font-medium text-[#171c1f]">Get a free key:</span>{" "}
            Visit{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] underline"
            >
              aistudio.google.com/apikey
            </a>{" "}
            and create a new API key. The free tier allows 15 requests/min and 1M tokens/day.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasKey && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-600 text-xs font-medium">Key configured</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasKey && (
              <button
                onClick={handleClear}
                className="px-3 py-2 text-red-600 text-xs font-medium hover:bg-red-50 rounded-md transition-colors"
              >
                Remove Key
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-2 text-[#6b7280] text-xs font-medium hover:bg-[#f0f4f8] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!key.trim()}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                saved
                  ? "bg-emerald-500 text-white"
                  : key.trim()
                  ? "bg-[#001629] text-white hover:bg-[#002B49]"
                  : "bg-[#e8ecf0] text-[#6b7280] cursor-not-allowed"
              }`}
            >
              {saved ? "Saved!" : "Save Key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
