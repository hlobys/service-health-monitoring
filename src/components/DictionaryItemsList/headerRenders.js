import React from 'react';
import InputWrapper from './inputWrapper';
import { Button, Switcher } from '@tarantool.io/ui-kit';

export const CodeHeader = props => {
  const { renderForm, onChangeHandler } = props;
  return (
    <>
      { renderForm && <InputWrapper name={'code'} onChangeHandler={onChangeHandler} />  }
      <div>Code</div>
    </>
  )
}

export const DescriptionHeader = props => {
  const { renderForm, onChangeHandler, name } = props;
  return (
    <>
      { renderForm && <InputWrapper name={name} onChangeHandler={onChangeHandler} />}
      <div>Description</div>
    </>
  )
}

export const StatusHeader = props => {
  const { renderForm, onChange, active } = props;
  return (
    <>
      { renderForm && <Switcher checked={active} name={'active'} onChange={onChange}/> }
      <div>Status</div>
    </>
  )
}
export const ActionsHeader = props => {
  const { renderForm } = props;
  const { newItemHandler } = props;
  return (
    <>
      { renderForm && <Button text={'Add'} onClick={newItemHandler}/> }
    </>
  )
}
