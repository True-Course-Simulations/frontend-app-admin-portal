import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert, Button, Icon, Pagination,
} from '@openedx/paragon';
import {
  CheckCircle, Info, Plus, SpinnerIcon, WarningFilled,
} from '@openedx/paragon/icons';

import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import SearchBar from '../SearchBar';
import CodeSearchResults from '../CodeSearchResults';
import LoadingMessage from '../LoadingMessage';
import Coupon from '../Coupon';
import { updateUrl } from '../../utils';
import { clearCouponOrders, fetchCouponOrders } from '../../data/actions/coupons';
import { ROUTE_NAMES } from '../EnterpriseApp/data/constants';
import NewFeatureAlertBrowseAndRequest from '../NewFeatureAlertBrowseAndRequest';
import { SubsidyRequestsContext } from '../subsidy-requests';
import { SUPPORTED_SUBSIDY_TYPES } from '../../data/constants/subsidyRequests';
import CodeDeprecationAlert from '../CodeDeprecationAlert/CodeDeprecationAlert';

const ManageCodesTab = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const { subsidyRequestConfiguration } = useContext(SubsidyRequestsContext);
  const [hasRequestedCodes, setHasRequestedCodes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const couponRefs = useRef([]);

  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const enterpriseSlug = useSelector(state => state.portalConfiguration.enterpriseSlug);
  const coupons = useSelector(state => state.coupons.data);
  const loading = useSelector(state => state.coupons.loading);
  const error = useSelector(state => state.coupons.error);

  const getCouponRefs = useCallback(() => couponRefs.current.filter(coupon => coupon), []);

  const setCouponOpacity = useCallback((couponId) => {
    const currentCouponRefs = getCouponRefs();

    if (couponId) {
      currentCouponRefs.forEach((coupon) => {
        const { data: { id } } = coupon.props;
        if (id !== parseInt(couponId, 10)) {
          coupon.setCouponOpacity(true);
        }
      });
    } else {
      currentCouponRefs.forEach((coupon) => {
        coupon.setCouponOpacity(false);
      });
    }
  }, [getCouponRefs]);

  const removeQueryParams = useCallback((keys) => {
    const queryParams = {};
    keys.forEach((key) => {
      queryParams[key] = undefined;
    });
    updateUrl(navigate, location.pathname, queryParams);
  }, [location.pathname, navigate]);

  const paginateCouponOrders = useCallback((pageNumber) => {
    const page = pageNumber ? parseInt(pageNumber, 10) : 1;
    dispatch(fetchCouponOrders({ page }));
  }, [dispatch]);

  const handleRefreshData = useCallback(() => {
    paginateCouponOrders(1);
    removeQueryParams(['coupon_id', 'page', 'overview_page']);
    setSearchQuery('');
  }, [paginateCouponOrders, removeQueryParams]);

  const handleCouponExpand = useCallback((selectedIndex) => {
    const currentCouponRefs = getCouponRefs();
    const selectedCoupon = currentCouponRefs[selectedIndex];
    if (!selectedCoupon) {
      return;
    }
    const couponId = selectedCoupon.props.data.id;
    updateUrl(navigate, location.pathname, { coupon_id: couponId });
    setCouponOpacity(couponId);
    setSearchQuery('');
  }, [getCouponRefs, location.pathname, navigate, setCouponOpacity]);

  const handleCouponCollapse = useCallback(() => {
    setCouponOpacity();
    removeQueryParams(['coupon_id', 'page']);
  }, [removeQueryParams, setCouponOpacity]);

  useEffect(() => (
    () => {
      dispatch(clearCouponOrders());
    }
  ), [dispatch]);

  useEffect(() => {
    if (location.state && location.state.hasRequestedCodes) {
      setHasRequestedCodes(true);
      navigate(location.pathname, { state: {}, replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  const prevEnterpriseId = useRef();
  const prevSearch = useRef(location.search);
  const prevCoupons = useRef(coupons);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const prevQueryParams = new URLSearchParams(prevSearch.current || '');
    const couponId = queryParams.get('coupon_id');

    if (enterpriseId && enterpriseId !== prevEnterpriseId.current) {
      paginateCouponOrders(queryParams.get('overview_page'));
    }

    if (queryParams.get('overview_page') !== prevQueryParams.get('overview_page')) {
      paginateCouponOrders(queryParams.get('overview_page'));
    }

    if (couponId && coupons && coupons !== prevCoupons.current) {
      const couponWithIdExists = coupons.results.find(
        coupon => coupon.id === parseInt(couponId, 10),
      );

      if (!couponWithIdExists) {
        removeQueryParams(['coupon_id', 'page']);
      }
    }

    if (location.search !== prevSearch.current) {
      setCouponOpacity(couponId);
    }

    prevEnterpriseId.current = enterpriseId;
    prevSearch.current = location.search;
    prevCoupons.current = coupons;
  }, [
    coupons,
    enterpriseId,
    location.search,
    paginateCouponOrders,
    removeQueryParams,
    setCouponOpacity,
  ]);

  const hasCouponData = (couponsData) => {
    if (!couponsData) {
      return false;
    }
    const { results } = couponsData;
    return results && results.length > 0;
  };

  const renderLoadingMessage = () => <LoadingMessage className="coupons mt-3" />;

  const renderErrorMessage = () => (
    <Alert variant="danger" icon={Info}>
      <Alert.Heading>
        <FormattedMessage
          id="admin.portal.manage.codes.tab.error.heading"
          defaultMessage="Unable to load coupons"
          description="Error heading when coupon fetch fails in code management tab"
        />
      </Alert.Heading>
      <p>
        <FormattedMessage
          id="admin.portal.manage.codes.tab.error.message.detail"
          defaultMessage="Try refreshing your screen ({errorDetail})"
          description="Error message detail for code management tab"
          values={{ errorDetail: error?.message }}
        />
      </p>
    </Alert>
  );

  const renderCoupons = () => {
    const queryParams = new URLSearchParams(location.search);
    return (
      <>
        {coupons.results.map((coupon, index) => (
          <Coupon
            ref={(node) => { couponRefs.current[index] = node; }}
            key={coupon.id}
            data={coupon}
            isExpanded={coupon.id === parseInt(queryParams.get('coupon_id'), 10)}
            onExpand={() => handleCouponExpand(index)}
            onCollapse={() => handleCouponCollapse()}
          />
        ))}
        <div className="d-flex mt-4 justify-content-center">
          <Pagination
            onPageSelect={page => updateUrl(navigate, location.pathname, {
              coupon_id: undefined,
              page: undefined,
              overview_page: page !== 1 ? page : undefined,
            })}
            pageCount={coupons.num_pages}
            currentPage={coupons.current_page}
            paginationLabel="coupons pagination"
          />
        </div>
      </>
    );
  };

  const renderRequestCodesSuccessMessage = () => (
    <Alert
      data-testid="code-request-alert"
      show={hasRequestedCodes}
      onClose={() => setHasRequestedCodes(false)}
      variant="success"
      icon={CheckCircle}
      dismissible
    >
      <Alert.Heading>
        <FormattedMessage
          id="admin.portal.manage.codes.tab.request.codes.success.heading"
          defaultMessage="Request for more codes received"
          escription="Heading for success message when requesting more codes"
        />
      </Alert.Heading>
      <p>
        <FormattedMessage
          id="admin.portal.manage.codes.tab.success.message.content"
          defaultMessage="The edX Customer Support team will contact you soon."
          description="Success message content after requesting codes on the manage codes tab"
        />
      </p>
    </Alert>
  );

  const renderEmptyDataMessage = () => (
    <Alert variant="warning" icon={WarningFilled}>
      There are no results.
    </Alert>
  );

  // don't show alert if the enterprise already has subsidy requests enabled
  const isBrowseAndRequestFeatureAlertShown = subsidyRequestConfiguration?.subsidyType
    === SUPPORTED_SUBSIDY_TYPES.coupon && !subsidyRequestConfiguration?.subsidyRequestsEnabled;

  const hasSearchQuery = !!searchQuery;
  return (
    <>
      {renderRequestCodesSuccessMessage()}
      <CodeDeprecationAlert />
      {isBrowseAndRequestFeatureAlertShown && <NewFeatureAlertBrowseAndRequest />}
      <div className="row mt-4 mb-3 no-gutters">
        <div className="col-12 col-xl-3 mb-3 mb-xl-0">
          <h2>
            <FormattedMessage
              id="admin.portal.manage.codes.tab.overview.heading"
              defaultMessage="Overview"
              description="Heading for the overview section in the manage codes tab"
            />
          </h2>
        </div>
        <div className="col-12 col-xl-4 mb-3 mb-xl-0">
          <SearchBar
            placeholder={intl.formatMessage({
              id: 'admin.portal.manage.codes.tab.search.placeholder.text',
              defaultMessage: 'Search by email or code...',
              description: 'Placeholder text for search bar in the manage codes tab',
            })}
            onSearch={(query) => {
              setSearchQuery(query);
              removeQueryParams(['coupon_id', 'page']);
            }}
            onClear={() => {
              setSearchQuery('');
              removeQueryParams(['page']);
            }}
            value={searchQuery}
            inputProps={{ 'data-hj-suppress': true }}
          />
        </div>
        <div className="col-12 col-xl-5 mb-3 mb-xl-0 text-xl-right">
          <Button
            variant="link"
            className="mr-2"
            onClick={handleRefreshData}
            disabled={loading}
          >
            <>
              <Icon data-testid="refresh-data" className="mr-2" src={SpinnerIcon} />
              <FormattedMessage
                id="admin.portal.manage.codes.tab.refresh.data.label"
                defaultMessage="Refresh data"
                description="Label to refresh data in the manage codes tab"
              />
            </>
          </Button>
          <Link
            className="request-codes-btn btn btn-primary"
            to={`/${enterpriseSlug}/admin/${ROUTE_NAMES.codeManagement}/request-codes`}
          >
            <>
              <Icon src={Plus} />
              <FormattedMessage
                id="admin.portal.manage.codes.tab.request.more.codes.label"
                defaultMessage="Request more codes"
                description="Label to request more codes in the manage codes tab"
              />
            </>
          </Link>
        </div>
      </div>
      <div className="row">
        <div
          className={classNames(
            'col',
            {
              'mt-2 mb-4': hasSearchQuery,
            },
          )}
        >
          <CodeSearchResults
            isOpen={hasSearchQuery}
            searchQuery={searchQuery}
            onClose={() => {
              setSearchQuery('');
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          {error && renderErrorMessage()}
          {loading && renderLoadingMessage()}
          {!loading && !error && !hasCouponData(coupons)
            && renderEmptyDataMessage()}
          {!loading && !error && hasCouponData(coupons) && renderCoupons()}
        </div>
      </div>
    </>
  );
};

export default ManageCodesTab;
