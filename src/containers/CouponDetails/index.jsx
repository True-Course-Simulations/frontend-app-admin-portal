import { useDispatch, useSelector } from 'react-redux';

import CouponDetails from '../../components/CouponDetails';

import { fetchCouponOrder } from '../../data/actions/coupons';

const couponDetailsTableId = 'coupon-details';

const CouponDetailsContainer = (props) => {
  const dispatch = useDispatch();
  const {
    couponDetailsTable,
    couponOverviewError,
    couponOverviewLoading,
  } = useSelector(state => ({
    couponDetailsTable: state.table[couponDetailsTableId],
    couponOverviewError: state.coupons.couponOverviewError,
    couponOverviewLoading: state.coupons.couponOverviewLoading,
  }));

  const fetchCouponOrderAction = (couponId) => {
    dispatch(fetchCouponOrder(couponId));
  };

  return (
    <CouponDetails
      {...props}
      couponDetailsTable={couponDetailsTable}
      couponOverviewError={couponOverviewError}
      couponOverviewLoading={couponOverviewLoading}
      fetchCouponOrder={fetchCouponOrderAction}
    />
  );
};

export default CouponDetailsContainer;
