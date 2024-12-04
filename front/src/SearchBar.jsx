// src/SearchBar.js
import React from 'react';
import { useSearch } from './SearchContext';

const SearchBar = () => {
  const { searchQuery, updateSearchQuery } = useSearch();

  const handleChange = (e) => {
    updateSearchQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleChange}
        style={{ padding: '8px', margin: '10px', width: '200px' }}
      />
    </div>
  );
};

export default SearchBar;
