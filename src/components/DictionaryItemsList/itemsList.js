import React, { Component, Fragment } from 'react';
import {
  Button,
  IconEdit,
  Table,
  Tag,
  IconCancel,
  IconOk,
  Switcher
} from '@tarantool.io/ui-kit';
import { DEFAULT_CATALOG_NAME } from '../../app/constants';
import {
  ActionsColumn,
  DescriptionColumn, StatusColumn
} from './columnRenders';
import * as HeaderRenders from './headerRenders'

export class ItemsList extends Component {
  state = {
    editingItem: null,
    newItem: null,
    page: 0
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { editingItem } = this.state;

    if(editingItem && nextState.editingItem && nextState.editingItem.description !== editingItem.description)
      return false;
    else return true;
  }

  activeChangeHandler = e => {
    const { editingItem } = this.state;
    const newItem = { ...editingItem };
    newItem['active'] = !newItem.active;
    this.setState(_ => { return { editingItem: newItem } });
  }

  descriptionChangeHandler = (name, value) => {
    const { editingItem } = this.state;
    const newItem = { ...editingItem };
    newItem[name] = value;
    this.setState(_ => { return { editingItem: newItem } });
  }

  activeNewChangeHandler = e => {
    const { newItem } = this.state;
    const item = { ...newItem };
    item['active'] = !item.active;
    this.setState(_ => { return { newItem: item } });
  }

  descriptionNewChangeHandler = (name, value) => {
    const { newItem } = this.state;
    const item = { ...newItem };
    item[name] = value;
    this.setState(_ => { return { newItem: item } });
  }

  codeNewChangeHandler = (name, value) => {
    const { newItem } = this.state;
    const item = { ...newItem };
    item[name] = value;
    this.setState(_ => { return { newItem: item } });
  }

  EditItem = () => {
    const { editingItem } = this.state;
    const { editItemHandler } = this.props;
    editItemHandler && editItemHandler(editingItem);
    this.setState(_ => {
      return { editingItem: null }
    });
  }
  CreateNewItem = () => {
    const { newItem } = this.state;
    const { catalogName, createItemHandler } = this.props;
    newItem.catalogName = catalogName;
    createItemHandler && createItemHandler(newItem);
    this.setState(_ => {
      return { newItem: null }
    });
  }

  getColumns = () => {
    const { editingItem, newItem } = this.state;
    const { catalogName } = this.props;
    const renderForm = catalogName === DEFAULT_CATALOG_NAME ? false : true;

    const header = [
      {
        Header: <HeaderRenders.CodeHeader onChangeHandler={this.descriptionNewChangeHandler} renderForm={renderForm} />,
        accessor: 'code',
        disableSortBy: true
      },
      {
        Header: (
          <HeaderRenders.DescriptionHeader
            renderForm={renderForm}
            name={'description'}
            onChangeHandler={this.descriptionNewChangeHandler}
          />
        ),
        accessor: 'description',
        disableSortBy: true,
        Cell: ( { row } )  => {
          return (
            <DescriptionColumn
              row={row}
              name={'description'}
              onChangeHandler={this.descriptionChangeHandler}
              editingItem={editingItem}
            />
          )
        }
      },
      {
        Header: (
          <HeaderRenders.StatusHeader
            checked={newItem&&newItem.active}
            renderForm={renderForm}
            onChange={ this.activeNewChangeHandler }
          />),
        accessor: 'active',
        disableSortBy: true,
        Cell: ( { row } )  => {
          return (
            <StatusColumn
              row={row}
              onChange={this.activeChangeHandle}
              editingItem={editingItem}
              checked={editingItem ? editingItem.active : false}
            />)
          /*const { original } = row;
          const { code, active } = original;

          if (editingItem && code === editingItem.code) {
            return (
              <Switcher checked={editingItem.active} name={'active'} onChange={ this.activeChangeHandler }/>
            )
          }
          return <Tag text={active ? 'Active' : 'Disabled'} /> */
        }
      },
      {
        Header: (
          <HeaderRenders.ActionsHeader
            newItemHandler={this.CreateNewItem}
            renderForm={renderForm}
          />),
        accessor: 'actions',
        disableSortBy: true,
        className: 'rightAlignStyle',
        Cell: ( { row } )  => {
          const { original } = row;
          const onSetEditHandler = () => {
            this.setState(_ => {
              return { editingItem: original, editDescription: original.description }
            })
          }
          const onCancelHandler = () => {
            this.setState(_ => {
              return { editingItem: null }
            })
          };

          return (
            <ActionsColumn
              data={original}
              editingItem={editingItem}
              onSetEditHandler={onSetEditHandler}
              onCancelHandler={onCancelHandler}
              onSaveHandler={this.EditItem}
            />)
        }
      }
    ]
    return header;
  }

  render() {
    const data = this.props.data;
    const { onChangePage } = this.props;
    const { page } = this.state;
    const pageSize=10;
    const changePage = nextPage => {
      const ops = {};
      if (page > nextPage) {
        ops.after = data.length ? data[0].cursor : null;
        ops.first = data.length ? 0 - pageSize : pageSize;
      }
      if (page < nextPage) {
        ops.after = data[data.length - 1].cursor;
        ops.first = pageSize;
      }

      this.setState({ page: nextPage }, ()=>{
        onChangePage(ops);
      })

    }
    return (
      <div style={{ backgroundColor: '#F0F2F5' }}>
        <Table
          columns={this.getColumns()}
          data={data}
          codeRowKey='cod11e'
          manualPagination={{ page, onChangePage: changePage, disableNextPageButton: data.length < pageSize }}
        />
      </div>
    )
  }
}

export default ItemsList;
