import React from 'react';
import InputWrapper from './inputWrapper';
import {
  Button,
  IconCancel,
  IconEdit,
  IconOk,
  Switcher,
  Tag
} from '@tarantool.io/ui-kit';

export const DescriptionColumn = props => {
  const { row, editingItem, onChangeHandler, name } = props;
  const { original } = row;
  const { code, description } = original;

  if (editingItem && code === editingItem.code) {
    return (
      <InputWrapper name={name} description={editingItem.description} onChangeHandler={onChangeHandler} />
    );
  }
  return description;
}

export const CodeColumn = props => {
  const { row } = props;
  const { original } = row;
  const { code } = original;

  return code;
}

export const ActionsColumn = props => {
  const {
    data,
    editingItem,
    onSetEditHandler,
    onSaveHandler,
    onCancelHandler
  } = props;
  const { code } = data;
  if (editingItem && code === editingItem.code) {
    return (
      <>
        <Button
          text={'Save'}
          icon={IconOk}
          onClick={onSaveHandler}
        />
        <Button
          icon={IconCancel}
          text={'Cancel'}
          onClick={onCancelHandler}
        />
      </>
    )
  }
  return (
    <Button
      icon={IconEdit}
      intent={'plain'}
      onClick={onSetEditHandler}
      size={'xs'}
    />
  )
}

export const StatusColumn = props => {
  const { row, editingItem, onChange, checked } = props;
  const { original } = row;
  const { code, active } = original;

  if (editingItem && code === editingItem.code) {
    return (
      <Switcher checked={checked} name={'active'} onChange={onChange}/>
    )
  }
  return <Tag text={active ? 'Active' : 'Disabled'} />
}
