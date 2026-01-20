import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import useAlgoliaSearch from './useAlgoliaSearch';

const withAlgoliaSearch = (WrappedComponent) => {
  const WithAlgoliaSearch = ({ enterpriseId, ...rest }) => {
    const selectedEnterpriseId = useSelector((state) => state.portalConfiguration.enterpriseId);
    const resolvedEnterpriseId = enterpriseId || selectedEnterpriseId;
    const algolia = useAlgoliaSearch({
      enterpriseId: resolvedEnterpriseId,
    });
    return <WrappedComponent algolia={algolia} enterpriseId={resolvedEnterpriseId} {...rest} />;
  };
  WithAlgoliaSearch.propTypes = {
    enterpriseId: PropTypes.string,
  };
  WithAlgoliaSearch.defaultProps = {
    enterpriseId: undefined,
  };
  return WithAlgoliaSearch;
};

export default withAlgoliaSearch;
