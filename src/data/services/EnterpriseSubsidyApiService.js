import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { snakeCaseObject } from '@edx/frontend-platform';

import { configuration } from '../../config';

class SubsidyApiService {
  static get baseUrl() { return `${configuration.ENTERPRISE_SUBSIDY_BASE_URL}/api`; }

  static get baseUrlV1() { return `${this.baseUrl}/v1`; }

  static get baseUrlV2() { return `${this.baseUrl}/v2`; }

  static apiClient = getAuthenticatedHttpClient;

  static fetchCustomerTransactions(subsidyUuid, options = {}) {
    const queryParams = new URLSearchParams({
      state: 'committed',
      ...snakeCaseObject(options),
    });
    const url = `${SubsidyApiService.baseUrlV2}/subsidies/${subsidyUuid}/admin/transactions/?${queryParams.toString()}`;
    return SubsidyApiService.apiClient().get(url);
  }

  static getSubsidyByCustomerUUID(uuid, options = {}) {
    const queryParams = new URLSearchParams({
      enterprise_customer_uuid: uuid,
      ...snakeCaseObject(options),
    });
    const url = `${SubsidyApiService.baseUrlV1}/subsidies/?${queryParams.toString()}`;
    return SubsidyApiService.apiClient().get(url);
  }
}

export default SubsidyApiService;
