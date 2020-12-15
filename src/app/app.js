import React, { useReducer } from 'react';
import { ContextApp, appReducer, initialState } from './reducer';
import Dictionary from '../pages/dictionary';
const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <ContextApp.Provider value={ { state, dispatch } }>
      <Dictionary />
    </ContextApp.Provider>
  )
}
export default App;
