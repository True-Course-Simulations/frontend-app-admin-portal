import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeAssignmentModal from './index';
import assignEmailTemplate from '../../components/CodeAssignmentModal/emailTemplate';
import {
  EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE,
  EMAIL_TEMPLATE_SOURCE_NEW_EMAIL,
} from '../../data/constants/emailTemplate';
import '@testing-library/jest-dom/extend-expect';
import { initializeMocks } from '../../testUtils';

const initialState = {
  table: {
    'coupon-details': {
      data: {
        count: 0,
        results: [],

      },
    },
  },
  form: {
    'code-assignment-modal-form': {
      values: {
        'email-address': 'test@edx.org',
      },
    },
  },
  portalConfiguration: {
    enterpriseSlug: 'bearsRus',
    enableLearnerPortal: true,
    enterpriseId: 'bestId',
  },
  emailTemplate: {
    saving: false,
    loading: false,
    error: null,
    emailTemplateSource: EMAIL_TEMPLATE_SOURCE_NEW_EMAIL,
    allTemplates: [],
    default: {
      assign: {
        'email-address': '',
        'email-template-subject': assignEmailTemplate.subject,
        'email-template-greeting': assignEmailTemplate.greeting,
        'email-template-body': assignEmailTemplate.body,
        'email-template-closing': assignEmailTemplate.closing,
        'email-template-files': assignEmailTemplate.files,
      },
    },
    assign: {
      'email-address': '',
      'email-template-subject': assignEmailTemplate.subject,
      'email-template-greeting': assignEmailTemplate.greeting,
      'email-template-body': assignEmailTemplate.body,
      'email-template-closing': assignEmailTemplate.closing,
      'email-template-files': assignEmailTemplate.files,
    },
  },
};

const CodeAssignmentModalWrapper = props => (
  <MemoryRouter>
    <Provider store={props.store}>
      <IntlProvider locale="en">
        <CodeAssignmentModal
          couponId={1}
          title="AABBCC"
          onClose={() => {}}
          onSuccess={() => {}}
          {...props}
        />
      </IntlProvider>
    </Provider>
  </MemoryRouter>
);

const store = initializeMocks(initialState).reduxStore;

CodeAssignmentModalWrapper.defaultProps = {
  store,
};

CodeAssignmentModalWrapper.propTypes = {
  store: PropTypes.shape({}),
};

describe('CodeAssignmentModalWrapper', () => {
  it('renders individual assignment modal', async () => {
    render(<CodeAssignmentModalWrapper />);
    const fields = await screen.findByText('Add learner');
    expect(fields).toBeInTheDocument();
  });

  it('renders bulk assignment modal', async () => {
    render(<CodeAssignmentModalWrapper isBulkAssign />);
    const fields = await screen.findByText('Email Addresses');
    expect(fields).toBeInTheDocument();
  });

  it('renders <SaveTemplateButton />', async () => {
    render(<CodeAssignmentModalWrapper />);
    const saveTemplateButton = await screen.findByTestId('save-template-btn');
    expect(saveTemplateButton).toBeInTheDocument();
  });

  it('renders <TemplateSourceFields /> with source new_email', async () => {
    const user = userEvent.setup();
    render(<CodeAssignmentModalWrapper />);
    const templateSourceFields = await screen.findByTestId('template-source-fields');
    expect(templateSourceFields).toBeInTheDocument();

    expect(templateSourceFields.querySelector('button#btn-new-email-template')).toHaveAttribute('aria-pressed', 'true');
    expect(templateSourceFields.querySelector('button#btn-old-email-template')).toHaveAttribute('aria-pressed', 'false');
    expect(templateSourceFields.querySelector('button#btn-new-email-template')).toHaveAttribute('style', 'pointer-events: none;');
    expect(templateSourceFields.querySelector('button#btn-old-email-template')).toHaveAttribute('style', 'pointer-events: auto;');

    const btnOldEmailTemplate = await screen.findByTestId('btn-old-email-template');
    await user.click(btnOldEmailTemplate);
    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('aria-pressed', 'false');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders <TemplateSourceFields /> with source from_template', async () => {
    const user = userEvent.setup();
    const newStore = initializeMocks({
      ...initialState,
      emailTemplate: {
        ...initialState.emailTemplate,
        emailTemplateSource: EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE,
      },
    }).reduxStore;
    render(<CodeAssignmentModalWrapper store={newStore} />);
    const templateSourceFields = await screen.findByTestId('template-source-fields');
    expect(templateSourceFields).toBeInTheDocument();

    expect(templateSourceFields.querySelector('button#btn-new-email-template')).toHaveAttribute('aria-pressed', 'false');
    expect(templateSourceFields.querySelector('button#btn-old-email-template')).toHaveAttribute('aria-pressed', 'true');
    expect(templateSourceFields.querySelector('button#btn-new-email-template')).toHaveAttribute('style', 'pointer-events: auto;');
    expect(templateSourceFields.querySelector('button#btn-old-email-template')).toHaveAttribute('style', 'pointer-events: none;');

    const btnNewEmailTemplate = await screen.findByTestId('btn-new-email-template');
    await user.click(btnNewEmailTemplate);
    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('aria-pressed', 'false');
  });
});
