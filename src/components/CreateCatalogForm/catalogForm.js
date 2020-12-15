import React from 'react';
import {
  Button,
  LabeledInput
} from '@tarantool.io/ui-kit';

export const CreateCatalogForm = () => {
  return (
    <>
      <LabeledInput label='Catalog name' />
      <LabeledInput label='Description' />
      <Button />
    </>
  )

}
