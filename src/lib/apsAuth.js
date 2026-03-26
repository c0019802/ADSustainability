const CLIENT_ID = import.meta.env.VITE_APS_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_APS_REDIRECT_URI;
const SCOPES = "data:read";

function randomString(len = 64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let str = "";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);

  for (let i = 0; i < len; i++) {
    str += chars[bytes[i] % chars.length];
  }
  return str;
}

async function sha256Base64Url(str) {
  const buffer = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(hash);

  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function startApsLogin() {
  if (!CLIENT_ID || !REDIRECT_URI) {
    throw new Error("Missing APS env vars.");
  }

  const verifier = randomString(64);
  const challenge = await sha256Base64Url(verifier);
  const state = randomString(32);
  const nonce = randomString(32);

  sessionStorage.setItem("aps_verifier", verifier);
  sessionStorage.setItem("aps_state", state);
  sessionStorage.setItem("aps_nonce", nonce);

  const url =
    "https://developer.api.autodesk.com/authentication/v2/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
      nonce,
      prompt: "login",
    });

  window.location.href = url;
}

export async function finishApsLogin() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const returnedState = params.get("state");
  const storedState = sessionStorage.getItem("aps_state");
  const verifier = sessionStorage.getItem("aps_verifier");

  if (!code) {
    throw new Error("Missing authorization code.");
  }

  if (!verifier) {
    throw new Error("Missing PKCE verifier.");
  }

  if (!returnedState || returnedState !== storedState) {
    throw new Error("Invalid OAuth state.");
  }

  const res = await fetch(
    "https://developer.api.autodesk.com/authentication/v2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code_verifier: verifier,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`APS token exchange failed: ${text}`);
  }

  const data = await res.json();
  localStorage.setItem("aps_token", JSON.stringify(data));

  sessionStorage.removeItem("aps_verifier");
  sessionStorage.removeItem("aps_state");
  sessionStorage.removeItem("aps_nonce");

  return data;
}

export function getToken() {
  const raw = localStorage.getItem("aps_token");
  if (!raw) return null;

  try {
    return JSON.parse(raw).access_token || null;
  } catch {
    return null;
  }
}

export async function getApsUserProfile() {
  const token = getToken();

  if (!token) {
    throw new Error("No APS access token found.");
  }

  const res = await fetch("https://api.userprofile.autodesk.com/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch Autodesk user profile: ${text}`);
  }

  return await res.json();
}

export function logout() {
  localStorage.removeItem("aps_token");
  localStorage.removeItem("currentUser");
}