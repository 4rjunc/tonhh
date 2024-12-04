// @ts-nocheck

import React, { useState, useEffect } from "react";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { CheckCircle, Copy, Music, Loader2 } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
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

// console.log(
//   "ENVS:",
//   import.meta.env.VITE_PUBLIC_RECLAIM_APP_ID,
//   import.meta.env.VITE_PUBLIC_RECLAIM_APP_SECRET,
// );

const APP_ID = import.meta.env.VITE_RECLAIM_APP_ID;
const APP_SECRET = import.meta.env.VITE_RECLAIM_SECRET_ID;

const getAPPID = (social: string) => {
  const ids = {
    instagram: "a7dcfc29-25a6-44ca-8e7b-a3099044bc63",
    x: "2523321f-f61d-4db3-b4e6-e665af5efdc1",
    // youtube: "5a939797-afe0-4ad9-8dc4-6db967841a2c",
    github: "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
    // linkedin: "a9f1063c-06b7-476a-8410-9ff6e427e637",
    // upwork: "f0912203-36b3-4cf4-b78d-30853245f6b9",
    // spotify: "31d6ad77-b726-4726-a5b3-330e16482ab6",
  };
  return ids[social as keyof typeof ids] || null;
};

function ReclaimDemo({ onProofReceived }: SocialMedia) {
  const [social, setSocial] = useState<string>("X");
  const [requestUrl, setRequestUrl] = useState<string | null>(null);
  const [proofs, setProofs] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileLink, setProfileLink] = useState(""); // New state for profile link
  const [verified, setVerified] = useState(false);

  const handleSocialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSocial(e.target.value);
    setRequestUrl(null);
    setProofs(null);
    setStatus("");
  };

  const handleProfileLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileLink(e.target.value);
  };

  const setup = async () => {
    console.log("setup");
    try {
      setIsLoading(true);
      const PROVIDER_ID = getAPPID(social);

      if (!PROVIDER_ID) {
        setStatus("Invalid social media platform.");
        return;
      }

      setStatus("Initializing verification...");
      console.log("verfication init", APP_ID, APP_SECRET);
      const reclaimProofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID,
      );

      console.log("verification inited!");
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

  // Automatically verify username from profile link
  useEffect(() => {
    const verifyUsername = () => {
      const usernameFromLink = profileLink.split("/").pop();

      if (proofs && proofs.claimData) {
        // Check if proofs and claimData exist
        const parameters = JSON.parse(proofs.claimData.parameters);
        const extractedUsername = parameters.paramValues.username;

        if (extractedUsername === usernameFromLink) {
          console.log("Username verified successfully!");
          setVerified(true);
        } else {
          console.log("Username verification failed");
          setVerified(false);
        }
      }
    };
    verifyUsername();
  }, [proofs, profileLink]);

  return (
    <div className="max-w-2xl  p-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center mt-8">
          <h5 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 tracking-wider mb-6 shadow-md">
            Social Verification
          </h5>
        </div>
      </div>
      {/* Profile Link Input */}
      {/* <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Profile Link
        </label>
        <input
          type="text"
          value={profileLink}
          onChange={handleProfileLinkChange}
          placeholder="Ex: https://instagram.com/username"
          className="w-full p-3 border border-gray-200 rounded-lg bg-white text-sm font-mono text-gray-900"
        />
      </div> */}
      {/* Platform Selector - Updated */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Platform to Verify
        </label>
        <div className="relative">
          {/* Icon */}
          <div className="mt-8">
            <div className="mb-6 flex justify-center gap-8">
              <div className="cursor-pointer">
                <FaInstagram className="w-10 h-10 text-gray-600" />
              </div>
              <div className="cursor-pointer">
                <FaXTwitter className="w-10 h-10 text-gray-600" />
              </div>
              <div className="cursor-pointer">
                <FaGithub className="w-10 h-10 text-gray-600" />
              </div>
            </div>
          </div>
          {/* Current Selected Icon */}
          {/* <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {social === "instagram" && (
              <>
                <FaInstagram className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Instagram</span>
              </>
            )}
            {social === "github" && (
              <>
                <FaGithub className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700">Github</span>
              </>
            )}
            {social === "x" && (
              <>
                <FaXTwitter className="w-6 h-6 text-gray-900" />
                <span className="text-gray-700">Twitter</span>
              </>
            )}
          </div> */}

          <select
            value={social}
            onChange={handleSocialChange}
            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-blue-500 transition-colors"
          >
            <option value="github">Github</option>
            <option value="instagram">Instagram</option>
            <option value="x">Twitter(X)</option>
          </select>
        </div>
      </div>{" "}
      {/* Generate Button */}
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
      {/* Verification URL */}
      {requestUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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

          {/* Share Buttons */}

          <div className="mt-4">
            {/* Share Link Title */}
            <span className="text-sm font-medium text-gray-600 mb-2 block">
              Share Link On
            </span>

            <div className="flex items-center w-full" style={{ gap: "10px" }}>
              {/* WhatsApp Share Button */}
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

              {/* Telegram Share Button */}
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
