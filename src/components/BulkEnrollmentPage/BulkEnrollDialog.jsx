import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import BulkEnrollmentStepper from './stepper/BulkEnrollmentStepper';
import BulkEnrollContextProvider from './BulkEnrollmentContext';

/**
* @param {object} props Props
* @param {array<string>} props.learners learner email list to enroll
*/
const BulkEnrollDialog = (props) => {
  const { learners } = props;
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  return (
    <BulkEnrollContextProvider initialEmailsList={learners}>
      <BulkEnrollmentStepper
        {...props}
        enterpriseSlug={enterpriseSlug}
        enterpriseId={enterpriseId}
      />
    </BulkEnrollContextProvider>
  );
};

BulkEnrollDialog.propTypes = {
  learners: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BulkEnrollDialog;
