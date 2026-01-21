import React from 'react';
import {
  Hyperlink,
} from '@openedx/paragon';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';
import { useContextSelector } from 'use-context-selector';
import { useSelector } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { ContentHighlightsContext } from '../ContentHighlightsContext';
import EVENT_NAMES from '../../../eventTracking';
import { STEPPER_HELP_CENTER_FOOTER_BUTTON_TEXT } from '../data/constants';

const HighlightStepperFooterHelpLink = () => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const stepperModal = useContextSelector(
    ContentHighlightsContext,
    v => v[0].stepperModal,
  );
  const trackClickEvent = () => {
    const trackInfo = {
      highlight_title: stepperModal.highlightTitle,
      current_selected_row_ids: stepperModal.currentSelectedRowIds,
      current_selected_row_ids_length: Object.keys(stepperModal.currentSelectedRowIds).length,
    };
    sendEnterpriseTrackEvent(
      enterpriseId,
      `${EVENT_NAMES.CONTENT_HIGHLIGHTS.STEPPER_HYPERLINK_CLICK}`,
      trackInfo,
    );
  };
  return (
    <div>
      <Hyperlink
        onClick={trackClickEvent}
        target="_blank"
        destination={getConfig().ENTERPRISE_SUPPORT_PROGRAM_OPTIMIZATION_URL}
        className="small"
      >
        {STEPPER_HELP_CENTER_FOOTER_BUTTON_TEXT}
      </Hyperlink>
    </div>
  );
};

export default HighlightStepperFooterHelpLink;
