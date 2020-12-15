import React from 'react';
import {
  CHOOSE_CATALOG,
  LOAD_DICTIONARY,
  LOAD_CATALOG_NAMES,
  CHANGE_PAGE,
  CREATE_NEW_CATALOG,
  DEFAULT_CATALOG_NAME
} from './constants';
export const ContextApp = React.createContext();

export const initialState = {
  activeCatalogName: DEFAULT_CATALOG_NAME,
  catalogNames: [],
  data: [],
  pageOptions: {
    first: 10,
    after: null
  }
}

export const appReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case CHOOSE_CATALOG:
      return { ...state, activeCatalogName: payload.activeCatalogName, pageOptions: initialState.pageOptions }
    case LOAD_DICTIONARY:
      return { ...state, data: payload.data }
    case LOAD_CATALOG_NAMES:
      return { ...state, catalogNames: payload.data }
    case CHANGE_PAGE:
      return { ...state, pageOptions: payload.data }
    case CREATE_NEW_CATALOG:
      return { ...state, catalogNames: payload.catalogNames, activeCatalogName: payload.activeCatalogName }
    default:
      return state;
  }
}

