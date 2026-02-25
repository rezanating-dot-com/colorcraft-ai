"use client";

import { useState } from "react";
import { Lock, X } from "lucide-react";

interface PasscodeModalProps {
  onVerify: (code: string) => boolean;
  onClose: () => void;
}

export default function PasscodeModal({ onVerify, onClose }: PasscodeModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onVerify(code.trim())) {
      onClose();
    } else {
      setError(true);
      setCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Daily Limit Reached
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          You&apos;ve used all 3 free generations for today. Enter the passcode
          to unlock unlimited access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Enter passcode"
            autoFocus
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          {error && (
            <p className="text-sm text-red-600">
              Incorrect passcode. Please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={!code.trim()}
            className="w-full px-4 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
