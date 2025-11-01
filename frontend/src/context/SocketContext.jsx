import React, { createContext, useContext, useState, useEffect } from 'react';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
  
    const mockSocket = {
      on: (event, callback) => {},
      emit: (event, data) => {},
      off: (event) => {}
    };
    setSocket(mockSocket);
  }, []);
  
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

