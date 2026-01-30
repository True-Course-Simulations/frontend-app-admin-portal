import { useMemo } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import ManageCodesTab from '../ManageCodesTab';

import { SubsidyRequestsContext } from '../../subsidy-requests';
import { SUPPORTED_SUBSIDY_TYPES } from '../../../data/constants/subsidyRequests';
import { initializeMocks } from '../../../testUtils';

import { fetchCouponOrders, clearCouponOrders } from '../../../data/actions/coupons';

jest.mock('../../../data/actions/coupons', () => ({
  fetchCouponOrders: jest.fn(() => () => {}),
  clearCouponOrders: jest.fn(() => () => {}),
}));

const BNR_NEW_FEATURE_ALERT_TEXT = 'browse and request new feature alert!';
jest.mock('../../NewFeatureAlertBrowseAndRequest', () => ({
  __esModule: true,
  default: () => BNR_NEW_FEATURE_ALERT_TEXT,
}));

const initialState = {
  portalConfiguration: {
    enterpriseId: 'test-enterprise-id',
    enterpriseSlug: 'test-enterprise-slug',
  },
  coupons: {
    loading: false,
    error: null,
    data: {
      count: 0,
      results: [],
    },
  },
  table: {
    'coupon-details': {},
  },
  form: {
    'code-assignment-modal-form': {
      values: {
        'email-address': '',
      },
    },
  },
};

const ManageCodesTabWrapper = ({
  initialStateOverride,
  subsidyRequestConfiguration,
  initialEntries = ['/test-page'],
  ...props
}) => {
  const { reduxStore } = initializeMocks(initialStateOverride || initialState);
  const subsidyRequestsContextValue = useMemo(() => ({
    subsidyRequestConfiguration,
  }), [subsidyRequestConfiguration]);

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Provider store={reduxStore}>
        <IntlProvider locale="en">
          <SubsidyRequestsContext.Provider value={subsidyRequestsContextValue}>
            <ManageCodesTab
              {...props}
            />
          </SubsidyRequestsContext.Provider>
        </IntlProvider>
      </Provider>
    </MemoryRouter>
  );
};

ManageCodesTabWrapper.defaultProps = {
  initialStateOverride: initialState,
  subsidyRequestConfiguration: {
    subsidyRequestsEnabled: true,
    subsidyType: 'coupon',
  },
  initialEntries: ['/test-page'],
};

ManageCodesTabWrapper.propTypes = {
  initialStateOverride: PropTypes.shape({}),
  subsidyRequestConfiguration: PropTypes.shape({}),
  initialEntries: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])),
};

const sampleCouponData = {
  id: 0,
  title: 'test-title-1',
  start_date: '2019-01-03T23:23:51.581Z',
  end_date: '2019-09-18T14:46:36.716Z',
  errors: [],
  max_uses: 10,
  num_unassigned: 2,
  num_uses: 2,
  available: true,
  usage_limitation: 'Multi-use',
};

describe('ManageCodesTabWrapper', () => {
  describe('renders', () => {
    it('renders empty results correctly', () => {
      const { container } = render(<ManageCodesTabWrapper />);
      expect(container.textContent).toContain('There are no results.');
    });

    it('renders non-empty results correctly', () => {
      const stateWithResults = {
        ...initialState,
        coupons: {
          ...initialState.coupons,
          data: {
            count: 2,
            num_pages: 1,
            results: [
              sampleCouponData,
              {
                ...sampleCouponData,
                id: 1,
                title: 'test-title-2',
              },
            ],
          },
        },
      };

      const { container } = render(<ManageCodesTabWrapper initialStateOverride={stateWithResults} />);
      expect(container.textContent).toContain('test-title-1');
      expect(container.textContent).toContain('test-title-2');
    });

    it('renders loading state correctly', () => {
      const loadingState = {
        ...initialState,
        coupons: {
          ...initialState.coupons,
          loading: true,
        },
      };

      const { container } = render(<ManageCodesTabWrapper initialStateOverride={loadingState} />);
      expect(container.textContent).toContain('Loading');
    });

    it('renders error state correctly', () => {
      const errorState = {
        ...initialState,
        coupons: {
          ...initialState.coupons,
          error: new Error('test error'),
        },
      };

      const { container } = render(<ManageCodesTabWrapper initialStateOverride={errorState} />);
      expect(container.textContent).toContain('test error');
    });
  });

  it('handles location.state on componentDidMount', async () => {
    render((
      <ManageCodesTabWrapper
        initialEntries={[{
          pathname: '/test-page',
          state: { hasRequestedCodes: true },
        }]}
      />
    ));
    const requestedCodeAlert = await screen.findByTestId('code-request-alert');
    expect(requestedCodeAlert).toBeInTheDocument();
  });

  it('handles overview_page query parameter on render', () => {
    const stateWithPages = {
      ...initialState,
      coupons: {
        ...initialState.coupons,
        data: {
          count: 100,
          num_pages: 2,
          results: [...Array(50)].map((_, index) => ({ ...sampleCouponData, id: index })),
        },
      },
    };
    fetchCouponOrders.mockClear();
    render(
      <ManageCodesTabWrapper
        initialStateOverride={stateWithPages}
        initialEntries={['/test-page?overview_page=2']}
      />,
    );

    expect(fetchCouponOrders).toHaveBeenCalledWith({ page: 2 });
  });

  it('calls clearCouponOrders() on componentWillUnmount', () => {
    clearCouponOrders.mockClear();
    const { unmount } = render(<ManageCodesTabWrapper />);
    unmount();
    expect(clearCouponOrders).toHaveBeenCalled();
  });

  it('calls expand/collapse callbacks properly', async () => {
    const stateWithCoupons = {
      ...initialState,
      coupons: {
        ...initialState.coupons,
        data: {
          count: 1,
          num_pages: 1,
          results: [
            sampleCouponData,
            {
              ...sampleCouponData,
              id: 1,
              title: 'test-title-2',
            },
          ],
        },
      },
      table: {
        'coupon-details': {},
      },
      csv: {
        'coupon-details': {},
      },
    };
    const user = userEvent.setup();
    render(<ManageCodesTabWrapper initialStateOverride={stateWithCoupons} />);

    // expand
    const couponItem = (await screen.findAllByTestId('coupon-item-toggle'))[0];
    await user.click(couponItem);
    expect(couponItem).toHaveAttribute('aria-expanded', 'true');

    // collapse
    await user.click(couponItem);
    expect(couponItem).toHaveAttribute('aria-expanded', 'false');
  });

  it('fetches coupons on refresh button click', async () => {
    const user = userEvent.setup();
    fetchCouponOrders.mockClear();
    render(<ManageCodesTabWrapper />);
    const refreshDataComponent = await screen.findByTestId('refresh-data');
    await user.click(refreshDataComponent);
    expect(fetchCouponOrders).toHaveBeenCalledWith({ page: 1 });
  });

  describe('<NewFeatureAlertBrowseAndRequest />', () => {
    it.each([
      {
        subsidyRequestConfiguration: {
          subsidyType: SUPPORTED_SUBSIDY_TYPES.coupon,
          subsidyRequestsEnabled: false,
        },
        shouldShowAlert: true,
      },
      {
        subsidyRequestConfiguration: {
          subsidyType: SUPPORTED_SUBSIDY_TYPES.license,
          subsidyRequestsEnabled: false,
        },
        shouldShowAlert: false,
      },
      {
        subsidyRequestConfiguration: {
          subsidyType: SUPPORTED_SUBSIDY_TYPES.coupon,
          subsidyRequestsEnabled: true,
        },
        shouldShowAlert: false,
      },
    ])('should render correctly', ({ subsidyRequestConfiguration, shouldShowAlert }) => {
      const { container } = render(<ManageCodesTabWrapper subsidyRequestConfiguration={subsidyRequestConfiguration} />);

      if (shouldShowAlert) {
        expect(container.textContent).toContain(BNR_NEW_FEATURE_ALERT_TEXT);
      } else {
        expect(container.textContent).not.toContain(BNR_NEW_FEATURE_ALERT_TEXT);
      }
    });
  });
});
