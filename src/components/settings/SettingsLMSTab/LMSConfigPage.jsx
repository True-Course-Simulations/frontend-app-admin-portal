import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash-es';

import { useIntl } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';
import FormContextWrapper from '../../forms/FormContextWrapper';
import { getChannelMap } from '../../../utils';
import { LMSFormWorkflowConfig } from './LMSFormWorkflowConfig';

const LMSConfigPage = ({
  onClick,
  existingConfigFormData,
  existingConfigs,
  setExistingConfigFormData,
  isLmsStepperOpen,
  closeLmsStepper,
  lmsType,
}) => {
  const enterpriseCustomerUuid = useSelector(state => state.portalConfiguration.enterpriseId);
  const intl = useIntl();

  const channelMap = useMemo(() => getChannelMap(), []);
  const handleCloseWorkflow = (submitted, msg) => {
    onClick(submitted ? msg : '');
    closeLmsStepper();
    return true;
  };

  const formWorkflowConfig = LMSFormWorkflowConfig({
    enterpriseCustomerUuid,
    onSubmit: setExistingConfigFormData,
    handleCloseClick: handleCloseWorkflow,
    existingData: cloneDeep(existingConfigFormData),
    existingConfigNames: existingConfigs,
    channelMap,
    lmsType,
  });

  return (
    <div>
      <FormContextWrapper
        workflowTitle={intl.formatMessage({
          id: 'adminPortal.settings.learningPlatformTab.newIntegrationTitle',
          defaultMessage: 'New learning platform integration',
          description: 'Title for new learning platform integration workflow',
        })}
        formWorkflowConfig={formWorkflowConfig}
        onClickOut={handleCloseWorkflow}
        formData={existingConfigFormData}
        isStepperOpen={isLmsStepperOpen}
      />
    </div>
  );
};
LMSConfigPage.defaultProps = {
  existingConfigs: {},
  lmsType: '',
};

LMSConfigPage.propTypes = {
  onClick: PropTypes.func.isRequired,
  existingConfigFormData: PropTypes.shape({}).isRequired,
  existingConfigs: PropTypes.shape({}),
  setExistingConfigFormData: PropTypes.func.isRequired,
  isLmsStepperOpen: PropTypes.bool.isRequired,
  closeLmsStepper: PropTypes.func.isRequired,
  lmsType: PropTypes.string,
};

export default LMSConfigPage;
