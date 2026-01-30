import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import EnterpriseIndexPage from './index';
import { initializeMocks } from '../../testUtils';

describe('<EnterpriseIndexPage />', () => {
  let store;
  let dispatchSpy;

  const initialState = {
    table: {
      'enterprise-list': {
        loading: false,
        error: null,
        data: {
          count: 3,
          num_pages: 1,
          current_page: 1,
          results: [
            {
              uuid: 'ee5e6b3a-069a-4947-bb8d-d2dbc323396c',
              name: 'Enterprise 1',
              slug: 'enterprise-1',
              active: true,
            },
          ],
        },
      },
    },
  };

  beforeEach(() => {
    const { reduxStore } = initializeMocks(initialState);
    store = reduxStore;
    dispatchSpy = jest.spyOn(store, 'dispatch');
    render((
      <Provider store={store}>
        <IntlProvider locale="en">
          <EnterpriseIndexPage />
        </IntlProvider>
      </Provider>
    ));
  });

  it('clearPortalConfiguration dispatches clearPortalConfiguration action', () => waitFor(() => {
    expect(dispatchSpy).toHaveBeenCalled();
  }));
});
