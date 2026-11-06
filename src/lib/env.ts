export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const isProduction = process.env.NODE_ENV === "production";

export const withBasePath = (path: string) => `${basePath}${path}`;
