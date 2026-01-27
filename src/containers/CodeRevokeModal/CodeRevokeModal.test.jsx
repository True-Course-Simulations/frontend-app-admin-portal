import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import EcommerceApiService from '../../data/services/EcommerceApiService';
import CodeRevokeModal from './index';
import revokeEmailTemplate from '../../components/CodeRevokeModal/emailTemplate';
import {
  EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE,
  EMAIL_TEMPLATE_SOURCE_NEW_EMAIL,
  SET_EMAIL_TEMPLATE_SOURCE,
} from '../../data/constants/emailTemplate';
import { configuration } from '../../config';
import { initializeMocks } from '../../testUtils';

const enterpriseSlug = 'bearsRus';
const initialState = {
  emailTemplate: {
    loading: false,
    error: null,
    emailTemplateSource: EMAIL_TEMPLATE_SOURCE_NEW_EMAIL,
    default: {
      revoke: {
        'email-template-subject': revokeEmailTemplate.subject,
        'email-template-greeting': revokeEmailTemplate.greeting || '',
        'email-template-body': revokeEmailTemplate.body,
        'email-template-closing': revokeEmailTemplate.closing,
        'email-template-files': revokeEmailTemplate.files,
      },
    },
    revoke: {
      'email-template-subject': revokeEmailTemplate.subject,
      'email-template-greeting': revokeEmailTemplate.greeting || '',
      'email-template-body': revokeEmailTemplate.body,
      'email-template-closing': revokeEmailTemplate.closing,
      'email-template-files': revokeEmailTemplate.files,
    },
  },
  portalConfiguration: {
    enterpriseSlug,
    enableLearnerPortal: true,
  },
  form: {
    'code-revoke-modal-form': {
      initial: {},
    },
  },
};

const couponId = 1;
const couponTitle = 'AABBCC';
const data = {
  code: 'ABC101',
  assigned_to: 'edx@example.com',
  base_enterprise_url: `${configuration.ENTERPRISE_LEARNER_PORTAL_URL}/${enterpriseSlug}`,
};
const codeRevokeRequestData = (numCodes) => {
  const assignment = {
    code: data.code,
    user: {
      email: data.assigned_to,
    },
  };
  return {
    assignments: Array(numCodes).fill(assignment),
    do_not_email: false,
    template: revokeEmailTemplate.body,
    template_subject: revokeEmailTemplate.subject,
    template_greeting: revokeEmailTemplate.greeting || '',
    template_closing: revokeEmailTemplate.closing,
    template_files: revokeEmailTemplate.files,
    base_enterprise_url: data.base_enterprise_url,
  };
};

const CodeRevokeModalWrapper = ({ store, ...props }) => {
  const resolvedStore = store || initializeMocks(initialState).reduxStore;
  return (
  <MemoryRouter>
    <Provider store={resolvedStore}>
      <IntlProvider locale="en">
        <CodeRevokeModal
          couponId={couponId}
          title={couponTitle}
          onClose={() => {}}
          onSuccess={() => {}}
          {...props}
        />
      </IntlProvider>
    </Provider>
  </MemoryRouter>
);
};

CodeRevokeModalWrapper.propTypes = {
  store: PropTypes.shape({}),
};

describe('CodeRevokeModalWrapper', () => {
  let spy;

  afterEach(() => {
    if (spy) {
      spy.mockRestore();
    }
  });

  it('renders individual assignment revoke modal', async () => {
    spy = jest.spyOn(EcommerceApiService, 'sendCodeRevoke');
    const { reduxStore } = initializeMocks(initialState);
    render(<CodeRevokeModalWrapper data={data} store={reduxStore} />);
    const modalTitle = await screen.findByTestId('modal-title');
    expect(modalTitle.textContent).toEqual(couponTitle);

    expect(await screen.getByTestId('assignment-details-code').textContent).toEqual(`Code: ${data.code}`);
    expect(await screen.getByTestId('assignment-details-email').textContent).toEqual(`Email: ${data.assigned_to}`);
    expect(await screen.getByTestId('email-template-form-title').textContent).toEqual('Email Template');
    const revokeSaveBtn = await screen.getByTestId('revoke-submit-btn');
    fireEvent.click(revokeSaveBtn);
    expect(spy).toHaveBeenCalledWith(couponId, codeRevokeRequestData(1));
  });

  it('renders bulk assignment revoke modal', async () => {
    spy = jest.spyOn(EcommerceApiService, 'sendCodeRevoke');
    const codeRevokeData = [data, data];
    const { reduxStore } = initializeMocks(initialState);
    render(<CodeRevokeModalWrapper
      data={{ ...codeRevokeData, selectedCodes: codeRevokeData }}
      isBulkRevoke
      store={reduxStore}
    />);
    expect(await screen.getByTestId('bulk-selected-codes').textContent).toEqual('Selected codes: 2');
    const RevokeSaveBtn = await screen.getByTestId('revoke-submit-btn');
    fireEvent.click(RevokeSaveBtn);
    expect(spy).toHaveBeenCalledWith(couponId, codeRevokeRequestData(2));
  });

  it('returns the correct data if learner portal is not enabled', async () => {
    spy = jest.spyOn(EcommerceApiService, 'sendCodeRevoke');
    const codeRevokeData = [data, data];
    const { reduxStore } = initializeMocks({
      ...initialState,
      portalConfiguration: { ...initialState.portalConfiguration, enableLearnerPortal: false },
    });
    render(<CodeRevokeModalWrapper
      data={{ ...codeRevokeData, selectedCodes: codeRevokeData }}
      isBulkRevoke
      store={reduxStore}
    />);

    const RevokeSaveBtn = await screen.getByTestId('revoke-submit-btn');
    fireEvent.click(RevokeSaveBtn);
    const expectedData = codeRevokeRequestData(2);
    delete expectedData.base_enterprise_url;
    expect(spy).toHaveBeenCalledWith(couponId, expectedData);
  });

  it('throws error if no code is selected for bulk revoke', async () => {
    spy = jest.spyOn(EcommerceApiService, 'sendCodeRevoke');
    const codeRevokeData = [data, data];
    const { reduxStore } = initializeMocks(initialState);
    render(<CodeRevokeModalWrapper
      data={{ ...codeRevokeData, selectedCodes: [] }}
      isBulkRevoke
      store={reduxStore}
    />);

    const bulkSelectedCodes = await screen.queryByTestId('bulk-selected-codes');
    expect(bulkSelectedCodes).not.toBeInTheDocument();
    const RevokeSaveBtn = await screen.getByTestId('revoke-submit-btn');
    fireEvent.click(RevokeSaveBtn);
    expect(spy).not.toHaveBeenCalled();
  });

  it('renders <SaveTemplateButton />', async () => {
    const { reduxStore } = initializeMocks(initialState);
    render(<CodeRevokeModalWrapper store={reduxStore} />);
    const saveTemplateButton = await screen.findByTestId('save-template-btn');
    expect(saveTemplateButton).toBeInTheDocument();
    // TODO: unable to see how can we test an internal function parameters
    // expect(saveTemplateButton.props().templateType).toEqual('revoke');
  });

  it('renders <TemplateSourceFields /> with source new_email', async () => {
    const { reduxStore } = initializeMocks(initialState);
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    render(<CodeRevokeModalWrapper store={reduxStore} />);
    const TemplateSourceFields = await screen.findAllByTestId('template-source-fields');
    expect(TemplateSourceFields.length).toEqual(1);

    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('aria-pressed', 'false');
    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('style', 'pointer-events: none;');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('style', 'pointer-events: auto;');

    const buttonOldEmailTemplate = await screen.findByTestId('btn-old-email-template');
    fireEvent.click(buttonOldEmailTemplate);
    expect(dispatchSpy.mock.calls.some((call) => call[0]?.type === SET_EMAIL_TEMPLATE_SOURCE
      && call[0]?.payload?.emailTemplateSource === EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE)).toBe(true);
  });

  it('renders <TemplateSourceFields /> with source from_template', async () => {
    const { reduxStore } = initializeMocks({
      ...initialState,
      emailTemplate: {
        ...initialState.emailTemplate,
        emailTemplateSource: EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE,
      },
    });
    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch');
    render(<CodeRevokeModalWrapper store={reduxStore} />);
    const TemplateSourceFields = await screen.findAllByTestId('template-source-fields');
    expect(TemplateSourceFields.length).toEqual(1);

    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('aria-pressed', 'false');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('style', 'pointer-events: auto;');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('style', 'pointer-events: none;');

    const buttonNewEmailTemplate = await screen.findByTestId('btn-new-email-template');
    fireEvent.click(buttonNewEmailTemplate);
    expect(dispatchSpy.mock.calls.some((call) => call[0]?.type === SET_EMAIL_TEMPLATE_SOURCE
      && call[0]?.payload?.emailTemplateSource === EMAIL_TEMPLATE_SOURCE_NEW_EMAIL)).toBe(true);
  });
});
