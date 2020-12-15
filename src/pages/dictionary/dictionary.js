import React, { useEffect, useContext } from 'react';
import { ContextApp } from '../../app/reducer';
import {
  PageLayout,
  withDropdown,
  Button,
  DropdownItem,
  ControlsPanel
} from '@tarantool.io/ui-kit';
import { css } from 'emotion';
import ItemsList from '../../components/DictionaryItemsList/itemsList';
import CreateCatalogForm from '../../components/CreateCatalogForm';
import {
  fetchDictionaryCatalogNames,
  fetchDictionaryData,
  saveDictionaryItem,
  createCatalogItem,
  createDictionaryItem
} from '../../api';

import {
  LOAD_CATALOG_NAMES,
  LOAD_DICTIONARY,
  CHOOSE_CATALOG,
  CHANGE_PAGE, CREATE_NEW_CATALOG
} from '../../app/constants';

const wideStyle = css`
  max-width: none;
`;

const dropDown = css`
  max-width: 400px;
  min-width: 200px;
  width: 300px;
`

const DropdownButton = withDropdown(Button)
const DropdownDictionary = () => {
  const { state, dispatch } = useContext(ContextApp);
  const { catalogNames, activeCatalogName } = state;

  return (
    <DropdownButton
      className={dropDown}
      disabled={false}
      size={'l'}
      items={catalogNames.map((value, ind) => (
        <DropdownItem
          onClick={()=>dispatch({ type: CHOOSE_CATALOG, payload: { activeCatalogName: value } })}
          key={`key${ind}`}
        >
          { value }
        </DropdownItem>
      ))}
      title='Choose dictionary'
      text={activeCatalogName}
    />
  )
}


const Dictionary = () => {

  const { state, dispatch } = useContext(ContextApp);
  const { data, activeCatalogName, pageOptions } = state;

  useEffect( () => {
    fetchDictionaryCatalogNames()
      .then( data => dispatch({ type: LOAD_CATALOG_NAMES, payload: { data: data } }))
  }, []);

  useEffect(()=>{
    fetchDictionaryData(activeCatalogName, pageOptions )
      .then(data => dispatch({ type: LOAD_DICTIONARY, payload: { data: data } }))
  }, [activeCatalogName, pageOptions]);

  const editItem = obj => {
    if (!obj) return;
    saveDictionaryItem(obj, pageOptions)
      .then(data => {
        dispatch({ type: LOAD_DICTIONARY, payload: { data: data } });
      })
  }

  const createItem = obj => {
    if (!obj) return;
    createDictionaryItem(obj)
      .then(data => dispatch({ type: LOAD_DICTIONARY, payload: { data: data } }));
  }

  const createNewCatalog = obj => {
    if (!obj) return;
    createCatalogItem(obj)
      .then(data => dispatch({ type: CREATE_NEW_CATALOG, payload: data }));
  }

  const onChangePage = ops => {
    dispatch({ type: CHANGE_PAGE, payload: { data: ops } });
  }

  return (
    <PageLayout heading="Dictionary" wide={true} className={wideStyle}>
      <ControlsPanel
        controls={[
          <DropdownDictionary />,
          < CreateCatalogForm handler={createNewCatalog}/>
        ]}
      />
      <ItemsList
        data={data}
        catalogName={activeCatalogName}
        editItemHandler={editItem}
        createItemHandler={createItem}
        onChangePage={onChangePage}
      />

    </PageLayout>
  );

}

export default Dictionary;
