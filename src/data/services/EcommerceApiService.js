import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import { snakeCaseObject } from '@edx/frontend-platform/utils';

import { configuration } from '../../config';
import store from '../store';
import { EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE } from '../constants/emailTemplate';

class EcommerceApiService {
  static get ecommerceBaseUrl() { return configuration.ECOMMERCE_BASE_URL; }

  static apiClient = getAuthenticatedHttpClient;

  static get hasConfiguredBaseUrl() {
    return typeof EcommerceApiService.ecommerceBaseUrl === 'string'
      && EcommerceApiService.ecommerceBaseUrl.trim().length > 0;
  }

  static createUnavailableError(operation) {
    const error = new Error(`Ecommerce service is unavailable for ${operation}.`);
    error.name = 'EcommerceServiceUnavailableError';
    return error;
  }

  static executeOptionalReadRequest({
    operation,
    fallbackData,
    requestFn,
  }) {
    if (!EcommerceApiService.hasConfiguredBaseUrl) {
      logError(EcommerceApiService.createUnavailableError(operation));
      return Promise.resolve({ data: fallbackData });
    }

    return requestFn().catch((error) => {
      logError(`Ecommerce read failed for ${operation}`, error);
      return { data: fallbackData };
    });
  }

  static executeRequiredWriteRequest({
    operation,
    requestFn,
  }) {
    if (!EcommerceApiService.hasConfiguredBaseUrl) {
      return Promise.reject(EcommerceApiService.createUnavailableError(operation));
    }
    return requestFn();
  }

  static fetchCouponOrders(options) {
    const { enterpriseId } = store.getState().portalConfiguration;
    const queryParams = new URLSearchParams({
      page: 1,
      page_size: 50,
      filter: 'active',
      ...options,
    });
    return EcommerceApiService.executeOptionalReadRequest({
      operation: 'fetchCouponOrders',
      fallbackData: {
        results: [],
        count: 0,
        num_pages: 1,
        current_page: 1,
      },
      requestFn: () => {
        const url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/coupons/${enterpriseId}/overview/?${queryParams.toString()}`;
        return EcommerceApiService.apiClient().get(url);
      },
    });
  }

  static fetchCoupon(couponId) {
    return EcommerceApiService.executeOptionalReadRequest({
      operation: 'fetchCoupon',
      fallbackData: {},
      requestFn: () => {
        const url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/coupons/${couponId}/`;
        return EcommerceApiService.apiClient().get(url);
      },
    });
  }

  static fetchCouponDetails(couponId, options, { csv } = {}) {
    const endpoint = csv ? 'codes.csv' : 'codes';
    const queryParams = new URLSearchParams({
      page: 1,
      page_size: 50,
      ...options,
    });
    return EcommerceApiService.executeOptionalReadRequest({
      operation: 'fetchCouponDetails',
      fallbackData: {
        results: [],
        count: 0,
        num_pages: 1,
        current_page: 1,
      },
      requestFn: () => {
        const url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/coupons/${couponId}/${endpoint}/?${queryParams.toString()}`;
        return EcommerceApiService.apiClient().get(url);
      },
    });
  }

  static sendCodeAssignment(couponId, options) {
    return EcommerceApiService.executeRequiredWriteRequest({
      operation: 'sendCodeAssignment',
      requestFn: () => {
        const url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/coupons/${couponId}/assign/`;
        return EcommerceApiService.apiClient().post(url, options);
      },
    });
  }

  static sendCodeReminder(couponId, options) {
    return EcommerceApiService.executeRequiredWriteRequest({
      operation: 'sendCodeReminder',
      requestFn: () => {
        const url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/coupons/${couponId}/remind/`;
        return EcommerceApiService.apiClient().post(url, options);
      },
    });
  }

  static sendCodeRevoke(couponId, options) {
    return EcommerceApiService.executeRequiredWriteRequest({
      operation: 'sendCodeRevoke',
      requestFn: () => {
        const url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/coupons/${couponId}/revoke/`;
        return EcommerceApiService.apiClient().post(url, options);
      },
    });
  }

  static fetchCodeSearchResults(options) {
    const { enterpriseId } = store.getState().portalConfiguration;
    return EcommerceApiService.executeOptionalReadRequest({
      operation: 'fetchCodeSearchResults',
      fallbackData: {
        results: [],
        count: 0,
        num_pages: 1,
        current_page: 1,
      },
      requestFn: () => {
        let url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/coupons/${enterpriseId}/search/`;
        if (options) {
          const queryParams = new URLSearchParams(options);
          url += `?${queryParams.toString()}`;
        }
        return EcommerceApiService.apiClient().get(url);
      },
    });
  }

  static fetchEmailTemplate(options) {
    const { enterpriseId } = store.getState().portalConfiguration;
    return EcommerceApiService.executeOptionalReadRequest({
      operation: 'fetchEmailTemplate',
      fallbackData: { results: [] },
      requestFn: () => {
        let url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/offer-assignment-email-template/${enterpriseId}/`;
        if (options) {
          const queryParams = new URLSearchParams(options);
          url += `?${queryParams.toString()}`;
        }
        return EcommerceApiService.apiClient().get(url);
      },
    });
  }

  static saveTemplate(options) {
    const { enterpriseId } = store.getState().portalConfiguration;
    const { emailTemplateSource } = store.getState().emailTemplate;
    return EcommerceApiService.executeRequiredWriteRequest({
      operation: 'saveTemplate',
      requestFn: () => {
        let url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/offer-assignment-email-template/${enterpriseId}/`;
        if (emailTemplateSource === EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE) {
          url = `${url}${options.id}/`;
          return EcommerceApiService.apiClient().put(url, options);
        }
        return EcommerceApiService.apiClient().post(url, options);
      },
    });
  }

  static fetchEnterpriseOffer(budgetId, options) {
    const { enterpriseId } = store.getState().portalConfiguration;
    return EcommerceApiService.executeOptionalReadRequest({
      operation: 'fetchEnterpriseOffer',
      fallbackData: {},
      requestFn: () => {
        let url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/${enterpriseId}/enterprise-admin-offers/${budgetId}/`;
        if (options) {
          const queryParams = new URLSearchParams(snakeCaseObject(options));
          url += `?${queryParams.toString()}`;
        }
        return EcommerceApiService.apiClient().get(url);
      },
    });
  }

  static fetchEnterpriseOffers(options) {
    const { enterpriseId } = store.getState().portalConfiguration;
    return EcommerceApiService.executeOptionalReadRequest({
      operation: 'fetchEnterpriseOffers',
      fallbackData: { results: [] },
      requestFn: () => {
        let url = `${EcommerceApiService.ecommerceBaseUrl}/api/v2/enterprise/${enterpriseId}/enterprise-admin-offers/`;
        if (options) {
          const queryParams = new URLSearchParams(snakeCaseObject(options));
          url += `?${queryParams.toString()}`;
        }
        return EcommerceApiService.apiClient().get(url);
      },
    });
  }
}

export default EcommerceApiService;
