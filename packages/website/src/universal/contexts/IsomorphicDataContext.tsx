import React from 'react';

const IsomorphicDataContext = React.createContext<IsomorphicData | undefined>(undefined);

const IsomorphicDataProvider = ({
  children,
  data,
}) => {
  return (
    <IsomorphicDataContext.Provider value={data}>
      {children}
    </IsomorphicDataContext.Provider>
  );
};

const useIsomorphicData = (): IsomorphicData | undefined => React.useContext(IsomorphicDataContext);

export {
  IsomorphicDataProvider,
  useIsomorphicData,
};

interface IsomorphicData {
  builtAt: number;
}
