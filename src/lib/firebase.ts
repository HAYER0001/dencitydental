import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

/**
 * Firebase configuration.
 *
 * Every value is sourced from `NEXT_PUBLIC_*` environment variables — nothing is
 * hardcoded. These are inlined into the client bundle at build time by Next.js,
 * so they must be public-safe (Firebase web keys are, by design, not secrets:
 * access is governed by Firestore/Storage security rules, not by key secrecy).
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** True when the API key is missing or an obvious placeholder value. */
function looksLikePlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  if (v.length < 10) return true;
  return /your[_-]?api[_-]?key|placeholder|change[_-]?me|example|todo|dummy|x{3,}|demo/.test(v);
}

/**
 * Fail loud, not fatal: a misconfigured key must not crash the app on import.
 * We surface a clean, styled developer warning (browser console only, where %c
 * renders) so the missing/placeholder config is impossible to miss in dev.
 */
export const firebaseConfigValid = !looksLikePlaceholder(firebaseConfig.apiKey);

if (!firebaseConfigValid && typeof window !== 'undefined') {
  console.warn(
    '%c⚠ Firebase not configured%c\n' +
      'NEXT_PUBLIC_FIREBASE_API_KEY is undefined or a placeholder.\n' +
      'Authentication and Firestore will fail until real credentials are set in .env.local.',
    'background:#0A5C5C;color:#fff;padding:3px 10px;border-radius:4px;font-weight:700;',
    'color:#b45309;font-weight:500;',
  );
}

/**
 * Initialize Firebase safely. The `!getApps().length` guard makes this
 * idempotent across SSR renders, React Fast Refresh (HMR), and repeated
 * module evaluation — Firebase throws if the same app is initialized twice.
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Auth and Firestore are browser-only singletons.
 *
 * Initialising them at module scope runs `getAuth`/`getFirestore` wherever this
 * module is evaluated — including on the server during SSR/prerender, where the
 * runtime API key is absent and Firebase throws `auth/invalid-api-key`, failing
 * the Vercel build. Gating on `typeof window` defers initialisation to the
 * client, where every consumer already touches them only inside effects and
 * event handlers. `initializeApp` above is safe to run anywhere — it registers
 * config without validating the key.
 */
export const auth: Auth =
  typeof window !== 'undefined' ? getAuth(app) : (undefined as unknown as Auth);
export const db: Firestore =
  typeof window !== 'undefined' ? getFirestore(app) : (undefined as unknown as Firestore);

/**
 * Analytics is browser-only. It touches `window`/`document` and the
 * `measurementId`, so it must never run during SSR or in Node — hence the
 * `typeof window !== 'undefined'` guard. `isSupported()` additionally rules out
 * browsers/environments (e.g. some in-app webviews) where the SDK can't run.
 *
 * Resolves to `null` on the server, when config is invalid, or when analytics
 * is unsupported. Consumers should await it and null-check:
 *
 *   const analytics = await analyticsPromise;
 *   if (analytics) logEvent(analytics, 'page_view');
 */
export const analyticsPromise: Promise<Analytics | null> =
  typeof window !== 'undefined' && firebaseConfigValid && firebaseConfig.measurementId
    ? isSupported()
        .then((supported) => (supported ? getAnalytics(app) : null))
        .catch(() => null)
    : Promise.resolve(null);

export default app;
