import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { configuration } from '../../config';
import { initializeMocks } from '../../testUtils';

import Footer from './index';

const createStore = (state = {}) => initializeMocks(state).reduxStore;

const FooterWrapper = ({ store, ...props }) => (
  <MemoryRouter>
    <Provider store={store}>
      <IntlProvider locale="en">
        <Footer
          {...props}
        />
      </IntlProvider>
    </Provider>
  </MemoryRouter>
);

FooterWrapper.propTypes = {
  store: PropTypes.shape({}).isRequired,
};

describe('<Footer />', () => {
  let store;
  let tree;

  it('renders enterprise logo correctly', () => {
    store = createStore({
      portalConfiguration: {
        enterpriseName: 'Test Enterprise',
        enterpriseSlug: 'test-enterprise',
        enterpriseBranding: {
          logo: 'https://test.url/image/1.png',
        },
      },
    });

    tree = renderer
      .create((
        <FooterWrapper store={store} />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders edX logo correctly', () => {
    store = createStore({
      portalConfiguration: {},
    });
    tree = renderer
      .create((
        <FooterWrapper store={store} />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correct help center link from config', () => {
    configuration.ENTERPRISE_SUPPORT_URL = 'http://test-hc.com/hc';
    store = createStore({
      portalConfiguration: {},
    });
    tree = renderer
      .create((
        <FooterWrapper store={store} />
      ))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
