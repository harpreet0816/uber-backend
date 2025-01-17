import { createContext, useState } from 'react';

export const captainDataContext = createContext();

const CaptainContext = ({children}) => {
 const [captain, setCaptain] = useState(null);

  return (
    <captainDataContext.Provider value={{captain, setCaptain}}>
        {children}
    </captainDataContext.Provider>
  )
}

export default CaptainContext