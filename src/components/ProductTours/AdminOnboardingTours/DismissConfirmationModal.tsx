import React, { useEffect } from 'react';
import {
  ActionRow, Button, ModalDialog, useToggle,
} from '@openedx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';

import messages from './messages';

interface DismissConfirmationModalProps {
  openConfirmationModal: (value: boolean) => void;
  onConfirm?: () => void;
}

const DismissConfirmationModal: React.FC<DismissConfirmationModalProps> = ({
  openConfirmationModal,
  onConfirm,
}) => {
  const onboardingTourDismissed = useSelector(
    state => state.enterpriseCustomerAdmin.onboardingTourDismissed as boolean,
  );
  const intl = useIntl();
  const [isOpen, open, close] = useToggle(true);

  useEffect(() => {
    if (!onboardingTourDismissed) {
      open();
    }
  }, [onboardingTourDismissed, open]);

  const handleDismiss = () => {
    close();
    openConfirmationModal(false);
  };

  const handleConfirmSubmit = () => {
    if (onConfirm) {
      onConfirm();
    }
    close();
    openConfirmationModal(false);
  };

  return (
    <ModalDialog
      title="Dismiss confirmation modal"
      isOpen={isOpen}
      onClose={close}
      size="sm"
      hasCloseButton={false}
      isFullscreenOnMobile
      isOverflowVisible={false}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {intl.formatMessage(messages.dismissConfirmationTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>

      <ModalDialog.Body>
        <p>
          {intl.formatMessage(messages.dismissConfirmationBody)}
        </p>
      </ModalDialog.Body>

      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary" onClick={handleDismiss}>
            <FormattedMessage
              id="admin.portal.productTours.adminOnboarding.dismissConfirmationModal.cancel"
              defaultMessage="Cancel"
              description="Label for the cancel button on the dismiss confirmation modal."
            />
          </ModalDialog.CloseButton>
          <Button onClick={handleConfirmSubmit}>
            <FormattedMessage
              id="admin.portal.productTours.adminOnboarding.dismissConfirmationModal.dismiss"
              defaultMessage="Dismiss"
              description="Label for the dismiss button on the dismiss confirmation modal."
            />
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default DismissConfirmationModal;
