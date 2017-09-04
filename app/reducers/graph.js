import { omit } from 'lodash';

import { FRITZ_ACTIONS } from '../constants';
import { promiseHelpers } from '../utils';

const CONSTANTS = promiseHelpers.getPendingSymbols(FRITZ_ACTIONS);

const INITAL_STATE = {
  rawData: {},
  data: {
    upstream: {
      max: 0,
      series: [],
    },
    downstream: {
      max: 0,
      series: [],
    },
  },
};

// [
//   {
//     id: 'name',
//     data: [
//       {
//         x: current.upstream.data.x[i],
//         y: current.upstream.data.columns.default[i] ...
//       }
//     ]
//   }
// ]
function transformColumn(x, column) {
  return x.map((xValue, i) => ({ x: xValue, y: column[i] }));
}

function transformColumns(x, columns) {
  return Object.keys(columns).map(columnType => {
    const columnValues = transformColumn(x, columns[columnType]);
    return { id: columnType, data: columnValues };
  }, {});
}

function transformData(rawData) {
  return ['upstream', 'downstream'].reduce(
    (acc, type) => ({
      ...acc,
      [type]: {
        max: rawData.available[type],
        series: transformColumns(rawData.current[type].data.x, rawData.current[type].data.columns),
      },
    }),
    {},
  );
}

function setGraphData(state, data) {
  if (!data) {
    return state;
  }

  return {
    ...omit(state, 'error'),
    rawData: data,
    data: transformData(data),
  };
}

function onConnectionError(state, error) {
  return {
    ...state,
    error,
  };
}

export default function graphReducer(state = INITAL_STATE, action) {
  switch (action.type) {
    case CONSTANTS.resetData.$symbol:
      return INITAL_STATE;
    case CONSTANTS.getData.fulfilled:
      return setGraphData(state, action.payload.response);
    case CONSTANTS.getData.rejected:
      return onConnectionError(state, action.payload);
    default:
      return state;
  }
}
