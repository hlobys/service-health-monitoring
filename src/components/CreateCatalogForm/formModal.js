import React, {
  useState
} from 'react';
import {
  Modal,
  Button, LabeledInput
} from '@tarantool.io/ui-kit';

export const formModal = props => {
  const [showMode, setShowMode] = useState(false);
  const openModal = () => { setShowMode(true); };
  const closeModal = () => setShowMode(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createNewCatalog = () => {
    const { handler } = props;
    handler && handler({ catalogName: name, description });
    closeModal();
  }

  return (
    <>
      <Button
        intent={'primary'}
        size={'l'}
        text={'New dictionary'}
        title='New dictionary'
        onClick={openModal}
      />
      <Modal
        title='Create new catalog'
        visible={showMode}
        onClose={closeModal}
        onSubmit={() => console.log('submit')}
        footerControls={[
          <Button
            intent='primary'
            size='l'
            text='Accept'
            onClick={createNewCatalog}
          />,
          <Button size='l' text='Decline' onClick={closeModal} />
        ]}
      >
        <LabeledInput
          label='Catalog name'
          value={name}
          preserveMessageSpace={true}
          onChange={e => {setName(e.target.value)}}
        />
        <LabeledInput
          label='Description'
          value={description}
          onChange={e => {setDescription(e.target.value)}}
        />
      </Modal>
    </>
  )
}
