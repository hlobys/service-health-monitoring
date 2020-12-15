import graphql from './graphql';
import {
  getDictionaryDataQuery,
  getDictionaryCatalogNamesQuery,
  saveDictionaryItemMutation,
  saveDictionaryCatalogMutation,
  createDictionaryItemMutation
} from './query/dictionary';

export async function fetchDictionaryData(catalogName, ops = {}) {
  if (!catalogName) return [];
  if (!ops) ops = {};
  ops.catalogName = catalogName;

  const getDictionaryDataResponse = await graphql.fetch(getDictionaryDataQuery, ops);
  const data = getDictionaryDataResponse.Dictionary;

  return data;
}

export async function fetchDictionaryCatalogNames() {
  const response = await graphql.fetch(getDictionaryCatalogNamesQuery);
  const data = response.BaseCatalogName.map( ({ catalogName }) => catalogName);
  return data;
}


export async function saveDictionaryItem(obj, ops={}) {
  if (obj) {
    delete obj.cursor;
    ops.catalogName = obj.catalogName;

    await graphql.mutate(saveDictionaryItemMutation, { item: obj });
    //TODO: save error to store
  }

  const dictionaryDataResponse = await graphql.fetch(getDictionaryDataQuery, ops);
  const data = dictionaryDataResponse.Dictionary;

  return data;
}

export async function createCatalogItem(obj, ops={}) {
  let activeCatalogName = '';
  if (obj) {
    const createCatalogResponce = await graphql.mutate(saveDictionaryCatalogMutation, { catalog: obj });
    activeCatalogName = createCatalogResponce.InsertCatalog.catalogName;
  }
  const response = await graphql.fetch(getDictionaryCatalogNamesQuery);
  const data = response.BaseCatalogName.map( ({ catalogName }) => catalogName);
  return { catalogNames: data, activeCatalogName }
}

export async function createDictionaryItem(obj, ops={}) {
  if (obj) {
    ops.catalogName = obj.catalogName;

    await graphql.mutate(createDictionaryItemMutation, { item: obj });
    //TODO: save error to store
  }

  const dictionaryDataResponse = await graphql.fetch(getDictionaryDataQuery, ops);
  const data = dictionaryDataResponse.Dictionary;

  return data;
}
