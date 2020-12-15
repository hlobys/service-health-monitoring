import React, { useState } from 'react';
import { Input } from '@tarantool.io/ui-kit';

export const InputWrapper = props => {
  const { description, onChangeHandler, name } = props;
  const [value, changeValue] = useState(description);

  return (
    <Input
      name={name}
      value={value}
      onChange={e => {
        const value = e.target.value;
        const name = e.target.name;
        changeValue(value);
        onChangeHandler && onChangeHandler(name, value);
      }}
    />
  )

}

export default InputWrapper;
