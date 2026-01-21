import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Provider } from 'react-redux';
import DismissConfirmationModal from '../DismissConfirmationModal';
import messages from '../messages';
import { initializeMocks } from '../../../../testUtils';

const mockOpenConfirmationModal = jest.fn();
const mockOnConfirm = jest.fn();

const renderComponent = (props = {}, storeState = {}) => {
  const defaultProps = {
    openConfirmationModal: mockOpenConfirmationModal,
    onConfirm: mockOnConfirm,
    ...props,
  };

  const defaultState = {
    enterpriseCustomerAdmin: {
      onboardingTourDismissed: false,
      uuid: 'test-uuid',
    },
    ...storeState,
  };

  const { reduxStore } = initializeMocks(defaultState);

  return render(
    <IntlProvider locale="en" messages={{}}>
      <Provider store={reduxStore}>
        <DismissConfirmationModal {...defaultProps} />
      </Provider>
    </IntlProvider>,
  );
};

describe('DismissConfirmationModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with correct title and content when tour is not dismissed', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Dismiss confirmation modal');
    expect(screen.getByText(messages.dismissConfirmationBody.defaultMessage)).toBeInTheDocument();
  });

  it('shows cancel and dismiss buttons', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('calls openConfirmationModal with false when cancel is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOpenConfirmationModal).toHaveBeenCalledWith(false);
  });

  it('calls onConfirm when dismiss is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(mockOnConfirm).toHaveBeenCalled();
    expect(mockOpenConfirmationModal).toHaveBeenCalledWith(false);
  });

  it('does not call onConfirm when it is not provided', () => {
    renderComponent({ onConfirm: undefined });

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOpenConfirmationModal).toHaveBeenCalledWith(false);
  });
});
