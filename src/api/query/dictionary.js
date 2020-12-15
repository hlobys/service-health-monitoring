import gql from 'graphql-tag';

export const getDictionaryDataQuery = gql`
    query ($catalogName: String!, $after: String, $first: Int) {
        Dictionary(catalogName: $catalogName, after: $after, first: $first) {
            catalogName
            description
            code
            cursor
            active
        }
    }
`;

export const getDictionaryCatalogNamesQuery = gql`
    query {
        BaseCatalogName {
            catalogName
            description
        }
    }
`;

export const saveDictionaryItemMutation = gql`
    mutation UpdateDictionaryItem ($item: DictionaryInput!) {
        UpdateDictionaryItem(fields_to_update: $item) {
            code
            catalogName
            description
            active
        }
    }
`
export const createDictionaryItemMutation = gql`
    mutation InsertDictionaryItem ($item: DictionaryInput!) {
        InsertDictionaryItem(item: $item) {
            code
            catalogName
            description
            active
        }
    }
`

export const saveDictionaryCatalogMutation = gql`
    mutation InsertCatalog ($catalog: BaseCatalogNameInput!) {
        InsertCatalog(catalog: $catalog) {
            catalogName
            description
        }
    }
    
`
