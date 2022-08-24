import React, {createContext, useState} from 'react';

const LoginContext = createContext<string | any>('');

const LoginProvider = ({children}) => {
  const [token, setToken] = useState<string>('');
  const [web3Context, setWeb3Context] = useState<string>('');
  const [isWalletPasswordEntered, setIsWalletPasswordEntered] =
    useState<boolean>(false);
  const [balanceData, setBalanceData] = useState<[]>([]);
  const [rnEW, setRnEW] = useState<any>();
  return (
    <LoginContext.Provider
      value={{
        token,
        setToken,
        web3Context,
        setWeb3Context,
        isWalletPasswordEntered,
        setIsWalletPasswordEntered,
        rnEW,
        setRnEW,
        balanceData,
        setBalanceData,
      }}>
      {children}
    </LoginContext.Provider>
  );
};

export {LoginContext, LoginProvider};
