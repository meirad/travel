import React, { createContext, useContext, useState } from 'react';

// Create the SearchContext
const SearchContext = createContext();

// Search Provider to wrap your app and provide the search query
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Update search query
  const updateSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, updateSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to access the search context
export const useSearch = () => {
  return useContext(SearchContext);
};
