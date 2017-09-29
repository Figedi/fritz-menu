/* eslint-disable import/prefer-default-export */

export const isProdLike =
  process.env.NODE_ENV === 'production' || process.env.DEBUG_PROD === 'true';
