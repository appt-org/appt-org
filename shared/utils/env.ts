export function isProd() {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
}

export function analyticsEnabled() {
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
}
