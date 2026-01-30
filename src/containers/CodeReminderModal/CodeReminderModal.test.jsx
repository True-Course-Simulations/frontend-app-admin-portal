import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import '@testing-library/jest-dom/extend-expect';

import CodeReminderModal from './index';
import EcommerceApiService from '../../data/services/EcommerceApiService';
import remindEmailTemplate from '../../components/CodeReminderModal/emailTemplate';
import {
  EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE,
  EMAIL_TEMPLATE_SOURCE_NEW_EMAIL,
  SET_EMAIL_TEMPLATE_SOURCE,
} from '../../data/constants/emailTemplate';
import { configuration } from '../../config';
import { initializeMocks } from '../../testUtils';

const enterpriseSlug = 'bearsRus';
const sampleCodeData = {
  code: 'test-code-1',
  assigned_to: 'test@bestrun.com',
  redemptions: {
    total: 100,
    used: 10,
  },
  error: null,
};
const sampleTableData = {
  loading: false,
  error: null,
  data: {
    count: 3,
    num_pages: 2,
    current_page: 1,
    results: [
      sampleCodeData,
      {
        ...sampleCodeData,
        code: 'test-code-2',
        redemptions: {
          total: 100,
          used: 100,
        },
      },
      {
        ...sampleCodeData,
        code: 'test-code-3',
        assigned_to: null,
      },
    ],
  },
};

const initialState = {
  table: {
    'coupon-details': sampleTableData,
  },
  emailTemplate: {
    loading: false,
    error: null,
    emailTemplateSource: EMAIL_TEMPLATE_SOURCE_NEW_EMAIL,
    default: {
      remind: {
        'email-template-subject': remindEmailTemplate.subject,
        'email-template-greeting': remindEmailTemplate.greeting,
        'email-template-body': remindEmailTemplate.body,
        'email-template-closing': remindEmailTemplate.closing,
        'email-template-files': remindEmailTemplate.files,
      },
    },
    remind: {
      'email-template-subject': remindEmailTemplate.subject,
      'email-template-greeting': remindEmailTemplate.greeting,
      'email-template-body': remindEmailTemplate.body,
      'email-template-closing': remindEmailTemplate.closing,
      'email-template-files': remindEmailTemplate.files,
    },
  },
  portalConfiguration: {
    enterpriseSlug,
    enableLearnerPortal: true,
  },
  form: {
    'code-reminder-modal-form': {
      initial: {},
    },
  },
};

const couponId = 1;
const data = {
  code: 'ABC101',
  assigned_to: 'edx@example.com',
  base_enterprise_url: `${configuration.ENTERPRISE_LEARNER_PORTAL_URL}/${enterpriseSlug}`,
};

const codeReminderRequestData = (numCodes, selectedToggle) => {
  const assignment = {
    code: data.code,
    user: {
      email: data.assigned_to,
    },
  };
  const options = {
    template: remindEmailTemplate.body,
    template_subject: remindEmailTemplate.subject,
    template_greeting: remindEmailTemplate.greeting,
    template_closing: remindEmailTemplate.closing,
    template_files: remindEmailTemplate.files,
    base_enterprise_url: data.base_enterprise_url,
  };
  if (numCodes === 0) {
    options.code_filter = selectedToggle;
  } else {
    options.assignments = Array(numCodes).fill(assignment);
  }
  return options;
};

const createStore = (state = initialState) => initializeMocks(state).reduxStore;

const CodeReminderModalWrapper = ({ store, ...props }) => {
  const resolvedStore = store || createStore();
  return (
    <MemoryRouter>
      <Provider store={resolvedStore}>
        <IntlProvider locale="en">
          <CodeReminderModal
            couponId={couponId}
            title="AABBCC"
            onClose={() => {}}
            onSuccess={() => {}}
            {...props}
          />
        </IntlProvider>
      </Provider>
    </MemoryRouter>
  );
};

CodeReminderModalWrapper.propTypes = {
  store: PropTypes.shape({}),
};

describe('CodeReminderModalWrapper', () => {
  let spy;

  afterEach(() => {
    if (spy) {
      spy.mockRestore();
    }
  });

  it('renders individual reminder modal', async () => {
    const codeRemindData = [data, data];
    const store = createStore();
    render(<CodeReminderModalWrapper
      data={{ ...codeRemindData, selectedCodes: [data] }}
      store={store}
    />);
    expect(await screen.findByTestId('assignment-details')).toBeInTheDocument();
  });

  it('renders bulk reminder modal', async () => {
    spy = jest.spyOn(EcommerceApiService, 'sendCodeReminder');
    const codeRemindData = [data, data];
    const store = createStore();
    render(<CodeReminderModalWrapper
      data={{ ...codeRemindData, selectedCodes: codeRemindData }}
      isBulkRemind
      store={store}
    />);
    const bulkSelectedCodes = await screen.findByTestId('bulk-selected-codes');
    expect(bulkSelectedCodes.textContent).toEqual('Selected codes: 2');
    // unable to find any dom element with id "email-template"
    // expect(container.querySelector('#email-template')).toBeInTheDocument();
    const remindSubmitBtn = await screen.findByTestId('remind-submit-btn');
    fireEvent.click(remindSubmitBtn);
    expect(spy).toHaveBeenCalledWith(couponId, codeReminderRequestData(2));
  });

  it('returns the correct data if learner portal is not enabled', async () => {
    spy = jest.spyOn(EcommerceApiService, 'sendCodeReminder');
    const codeRemindData = [data, data];
    const store = createStore({
      ...initialState,
      portalConfiguration: { ...initialState.portalConfiguration, enableLearnerPortal: false },
    });
    render(<CodeReminderModalWrapper
      data={{
        ...codeRemindData,
        selectedCodes: codeRemindData,
      }}
      store={store}
      isBulkRemind
    />);

    const bulkSelectedCodes = await screen.findByTestId('bulk-selected-codes');
    expect(bulkSelectedCodes.textContent).toEqual('Selected codes: 2');
    // unable to find any dom element with id "email-template"
    // expect(wrapper.find('#email-template')).toBeTruthy();
    const remindSubmitBtn = await screen.findByTestId('remind-submit-btn');
    fireEvent.click(remindSubmitBtn);
    const expectedData = codeReminderRequestData(2);
    delete expectedData.base_enterprise_url;
    expect(spy).toHaveBeenCalledWith(couponId, expectedData);
  });

  it('renders remind all modal if no code is selected for bulk remind', async () => {
    spy = jest.spyOn(EcommerceApiService, 'sendCodeReminder');
    const codeReminderData = [data, data];
    const selectedToggle = 'unredeemed';
    const store = createStore();
    render(<CodeReminderModalWrapper
      data={{ ...codeReminderData, selectedCodes: [] }}
      selectedToggle={selectedToggle}
      isBulkRemind
      store={store}
    />);

    const bulkSelectedCodes = await screen.findByTestId('bulk-selected-codes');
    expect(bulkSelectedCodes.textContent).toEqual('Selected codes: 3');
    const remindSubmitBtn = await screen.findByTestId('remind-submit-btn');
    fireEvent.click(remindSubmitBtn);
    expect(spy).toHaveBeenCalledWith(couponId, codeReminderRequestData(0, selectedToggle));
  });

  it('renders <SaveTemplateButton />', async () => {
    const store = createStore();
    render(<CodeReminderModalWrapper store={store} />);
    const saveTemplateButton = await screen.findByTestId('save-template-btn');
    expect(saveTemplateButton).toBeInTheDocument();
    // TODO: unable to see how can we test an internal function parameters
    // expect(saveTemplateButton.props().templateType).toEqual('remind');
  });

  it('renders <TemplateSourceFields /> with source new_email', async () => {
    const store = createStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    render(<CodeReminderModalWrapper store={store} />);
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
    const newStore = createStore({
      ...initialState,
      emailTemplate: {
        ...initialState.emailTemplate,
        emailTemplateSource: EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE,
      },
    });
    const dispatchSpy = jest.spyOn(newStore, 'dispatch');
    render(<CodeReminderModalWrapper store={newStore} />);
    const TemplateSourceFields = await screen.findAllByTestId('template-source-fields');
    expect(TemplateSourceFields.length).toEqual(1);

    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('aria-pressed', 'false');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByTestId('btn-new-email-template')).toHaveAttribute('style', 'pointer-events: auto;');
    expect(await screen.findByTestId('btn-old-email-template')).toHaveAttribute('style', 'pointer-events: none;');

    const buttonOldEmailTemplate = await screen.findByTestId('btn-new-email-template');
    fireEvent.click(buttonOldEmailTemplate);
    expect(dispatchSpy.mock.calls.some((call) => call[0]?.type === SET_EMAIL_TEMPLATE_SOURCE
      && call[0]?.payload?.emailTemplateSource === EMAIL_TEMPLATE_SOURCE_NEW_EMAIL)).toBe(true);
  });
});
