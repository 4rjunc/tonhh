// @ts-nocheck
import React, { useState, useEffect } from "react";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import QRCode from "react-qr-code";
import {
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import { FaSquareUpwork } from "react-icons/fa6";

interface SocialMedia {
  onProofReceived: (proof: any) => void;
}

const APP_ID = import.meta.env.VITE_RECLAIM_APP_ID;
const APP_SECRET = import.meta.env.VITE_RECLAIM_SECRET_ID;

const getAPPID = (social: string) => {
  const ids = {
    instagram: "a7dcfc29-25a6-44ca-8e7b-a3099044bc63",
    x: "2523321f-f61d-4db3-b4e6-e665af5efdc1",
    github: "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
  };
  return ids[social as keyof typeof ids] || null;
};

// Mapping of social media platforms to their icons and display names
const SOCIAL_PLATFORMS = {
  instagram: { icon: FaInstagram, name: "Instagram" },
  x: { icon: FaXTwitter, name: "Twitter (X)" },
  github: { icon: FaGithub, name: "Github" },
};

function ReclaimDemo({ onProofReceived }: SocialMedia) {
  const [social, setSocial] = useState<keyof typeof SOCIAL_PLATFORMS>("x");
  const [requestUrl, setRequestUrl] = useState<string | null>(null);
  const [proofs, setProofs] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSocialSelect = (platform: keyof typeof SOCIAL_PLATFORMS) => {
    setSocial(platform);
    setRequestUrl(null);
    setProofs(null);
    setStatus("");
  };

  const setup = async () => {
    try {
      setIsLoading(true);
      const PROVIDER_ID = getAPPID(social);
      console.log("setupcalled");

      if (!PROVIDER_ID) {
        setStatus("Invalid social media platform.");
        return;
      }
      console.log("Initializing", APP_ID, APP_SECRET, PROVIDER_ID);

      setStatus("Initializing verification...");
      const reclaimProofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID,
      );
      const url = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(url);
      setStatus("Ready for verification");
      console.log("Verification Started");

      await reclaimProofRequest.startSession({
        onSuccess: (proofs: any) => {
          setProofs(proofs);
          console.log("Verification Session Started");
          onProofReceived(proofs);
          setStatus("Verification successful!");
        },
        onFailure: (error: any) => {
          console.error("Verification failed", error);
          setStatus("Verification failed");
        },
      });
    } catch (error: any) {
      setStatus("Setup failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (requestUrl) {
      navigator.clipboard.writeText(requestUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-200 rounded-lg shadow-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="text-center mt-8">
          <h5
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "transparent",
              background:
                "linear-gradient(to right, #3b82f6, #2563eb, #1d4ed8)",
              WebkitBackgroundClip: "text",
              display: "inline-block",
              letterSpacing: "0.1em",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            Create Your Credo ID
          </h5>
        </div>
      </div>

      {/* Platform Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Platform to Verify
        </label>

        {/* Social Media Icons */}
        <div className="mb-4 flex justify-center gap-8">
          {Object.entries(SOCIAL_PLATFORMS).map(
            ([platform, { icon: Icon }]) => (
              <div
                key={platform}
                onClick={() =>
                  handleSocialSelect(platform as keyof typeof SOCIAL_PLATFORMS)
                }
                className={`cursor-pointer p-2 rounded-full transition-all ${social === platform
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "hover:bg-gray-100"
                  }`}
              >
                <Icon
                  className={`w-10 h-10 ${social === platform ? "text-blue-600" : "text-gray-600"
                    }`}
                />
              </div>
            ),
          )}
        </div>

        {/* Dropdown-like Display of Selected Platform */}
        <div className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg flex items-center">
          {React.createElement(SOCIAL_PLATFORMS[social].icon, {
            className: "w-6 h-6 mr-2 text-gray-700",
          })}
          <span className="text-gray-700">{SOCIAL_PLATFORMS[social].name}</span>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <h2>{status}</h2>
      <button
        onClick={setup}
        disabled={isLoading}
        className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors ${isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
          }`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Generate Verification Link"
        )}
      </button>

      {/* Existing verification URL and success state rendering */}
      {requestUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div style={{ margin: "20px 0" }}>
            <QRCode value={requestUrl} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Verification Link
            </span>
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-md transition-colors ${copied ? "bg-green-100 text-green-600" : "hover:bg-gray-200"
                }`}
            >
              {copied ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={requestUrl}
            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-sm font-mono text-gray-900"
          />
          {/* Share buttons remain the same */}
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-600 mb-2 block">
              Share Link On
            </span>
            <div className="flex items-center w-full" style={{ gap: "10px" }}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Verify your social media account using this link: ${requestUrl}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                style={{ padding: "3px 6px" }}
              >
                <FaWhatsapp className="mr-2" />
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(requestUrl)}&text=${encodeURIComponent(
                  "Verify your social media account using this link!",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium  bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                style={{ padding: "3px 6px" }}
              >
                <FaTelegram className="mr-2" />
                Telegram
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {verified && (
        <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">
              Verification Complete
            </h3>
            <p className="text-sm text-green-700">
              Social media account verified successfully
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReclaimDemo;
