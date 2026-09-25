// api/mandi.js
// ----------------------------------------------------------------------------
// Vercel Serverless Function - proxies Mandi Bhav price requests to data.gov.in.
//
// WHY THIS FILE EXISTS:
// data.gov.in requires an api-key on every request. That key must never be
// sent to the browser (anyone could open dev-tools and steal it). This
// function keeps the key on the server and the React app calls this
// endpoint instead of calling data.gov.in directly.
//
// REQUIRED ENV VAR (already set in Vercel Project Settings -> Environment
// Variables as REACT_APP_MANDI_KEY - reused here as-is):
//   REACT_APP_MANDI_KEY
//
// IMPORTANT NAMING-CONVENTION WARNING:
// The "REACT_APP_" prefix normally signals "safe to use in frontend code"
// to Create React App's build tooling, which auto-inlines any REACT_APP_*
// variable that is referenced via process.env in files under src/. This
// variable is an exception - it is only ever read here, inside this
// serverless function (api/mandi.js lives outside src/, so react-scripts'
// webpack build never touches this file and never inlines this value into
// the browser bundle). DO NOT add `process.env.REACT_APP_MANDI_KEY` inside
// any file under src/ (App.js etc.) - doing so WOULD leak the key into the
// public JS bundle. If this key ever needs to be used in the frontend,
// route it through this proxy instead of reading it directly.
//
// You can register a free personal key at https://data.gov.in (My Account ->
// API Key) for reliable use. Do not commit a real key to git.
// ----------------------------------------------------------------------------

const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const TIMEOUT_MS = 8000;

module.exports = async function handler(req, res) {
  const location = (req.query.location || "").toString().trim();

  if (!location) {
    return res.status(400).json({
      success: false,
      live: false,
      error: "invalid_location",
      message: "Location zaroori hai.",
    });
  }

  const apiKey = process.env.REACT_APP_MANDI_KEY;
  if (!apiKey) {
    console.error("[api/mandi] REACT_APP_MANDI_KEY is not set in Vercel environment variables");
    return res.status(500).json({
      success: false,
      live: false,
      error: "server_config",
      message: "Server par mandi API abhi configure nahi hai.",
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url =
      `https://api.data.gov.in/resource/${RESOURCE_ID}` +
      `?api-key=${apiKey}&format=json&limit=20` +
      `&filters[market]=${encodeURIComponent(location)}`;

    const upstream = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (upstream.status === 429) {
      return res.status(429).json({
        success: false,
        live: false,
        error: "rate_limited",
        message: "Mandi API abhi busy hai (rate limit). Thodi der baad try karein.",
      });
    }

    if (!upstream.ok) {
      return res.status(502).json({
        success: false,
        live: false,
        error: "upstream_error",
        message: `Mandi API se error mila (status ${upstream.status}).`,
      });
    }

    let data;
    try {
      data = await upstream.json();
    } catch (parseErr) {
      return res.status(502).json({
        success: false,
        live: false,
        error: "invalid_response",
        message: "Mandi API se samajh na aane wala response mila.",
      });
    }

    const records = Array.isArray(data?.records) ? data.records : [];

    return res.status(200).json({
      success: true,
      live: true,
      records,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      return res.status(504).json({
        success: false,
        live: false,
        error: "timeout",
        message: "Mandi API ne samay par jawab nahi diya.",
      });
    }
    console.error("[api/mandi] network error:", err);
    return res.status(500).json({
      success: false,
      live: false,
      error: "network_error",
      message: "Mandi data laane mein network error aaya.",
    });
  }
};