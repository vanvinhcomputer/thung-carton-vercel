/// <reference types="astro/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_FB_PIXEL_ID: string;
  readonly VITE_GTM_ID: string;
  readonly VITE_HOTJAR_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}