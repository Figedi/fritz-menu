import { get } from 'lodash';
import { createSelector } from 'reselect';

// ======================= fritz reducer selectors =============================
export const getToken = state => get(state.fritz, 'tokenObj.token');
export const getTokenObj = state => state.fritz.tokenObj;
export const getError = state => state.fritz.error;

// ======================= graph reducer selectors =============================
export const getGraphData = type => state => state.graph.data[type];
export const getDownstreamData = getGraphData('downstream');
export const getUpstreamData = getGraphData('upstream');

// ======================= config reducer selectors ============================
export const getRehydrateTimeout = state => state.config.rehydrateTimeout || 5000;
export const getConfig = state => state.config;

// ======================== page reducer selectors =============================
// Home

export const hasGraphDataSelector = createSelector(
  getDownstreamData,
  getUpstreamData,
  (downstream, upstream) =>
    (downstream.series && downstream.series.length > 0) ||
    (upstream.series && upstream.series.length > 0),
);

export const shouldOpenModalSelector = createSelector(
  getError,
  getToken,
  hasGraphDataSelector,
  (error, token, hasGraphData) => !!error || (!token && !hasGraphData),
);

// Config

export const OSSelector = state => state.fritz.meta.OS;
