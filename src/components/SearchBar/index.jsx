import React from 'react';
import PropTypes from 'prop-types';
import { SearchField } from '@openedx/paragon';

const SearchBar = ({ onSearch, ...rest }) => (
  <SearchField
    onSubmit={query => onSearch(query)}
    data-testid="search-field"
    {...rest}
  />
);

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
