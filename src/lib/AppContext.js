"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";


const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [scrollDirection, setScrollDirection] = useState("up");

 

  return (
    <AppContext.Provider  value={{ scrollDirection , setScrollDirection}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
