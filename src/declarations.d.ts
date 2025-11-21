declare module "*.css" {
    const content: Record<string, string>;
    export default content;
}
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// These declarations are for common image/media files
declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_URL: string;
    // Add other environment variables here that start with VITE_
    // Example:
    // readonly VITE_ANALYTICS_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}