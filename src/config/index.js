import { hasFeatureFlagEnabled } from '@edx/frontend-enterprise-utils';
import { getConfig } from '@edx/frontend-platform/config';

const getRuntimeConfig = () => {
  try {
    return getConfig() || {};
  } catch (error) {
    return {};
  }
};

// Prefer runtime MFE config after platform initialization; fall back to env for local/dev/tests.
const getConfigValue = (key, fallback) => {
  const runtimeConfig = getRuntimeConfig();
  return runtimeConfig?.[key] ?? fallback;
};

const configuration = {
  get BASE_URL() { return getConfigValue('BASE_URL', process.env.BASE_URL); },
  get LMS_BASE_URL() { return getConfigValue('LMS_BASE_URL', process.env.LMS_BASE_URL); },
  get LOGIN_URL() { return getConfigValue('LOGIN_URL', process.env.LOGIN_URL); },
  get LOGOUT_URL() { return getConfigValue('LOGOUT_URL', process.env.LOGOUT_URL); },
  get ENTERPRISE_SUPPORT_URL() { return getConfigValue('ENTERPRISE_SUPPORT_URL', process.env.ENTERPRISE_SUPPORT_URL); },
  get ENTERPRISE_SUPPORT_REVOKE_LICENSE_URL() {
    return getConfigValue('ENTERPRISE_SUPPORT_REVOKE_LICENSE_URL', process.env.ENTERPRISE_SUPPORT_REVOKE_LICENSE_URL);
  },
  get SURVEY_MONKEY_URL() { return getConfigValue('SURVEY_MONKEY_URL', process.env.SURVEY_MONKEY_URL); },
  get CSRF_TOKEN_API_PATH() { return getConfigValue('CSRF_TOKEN_API_PATH', process.env.CSRF_TOKEN_API_PATH); },
  get REFRESH_ACCESS_TOKEN_ENDPOINT() {
    return getConfigValue('REFRESH_ACCESS_TOKEN_ENDPOINT', process.env.REFRESH_ACCESS_TOKEN_ENDPOINT);
  },
  get DATA_API_BASE_URL() { return getConfigValue('DATA_API_BASE_URL', process.env.DATA_API_BASE_URL); },
  get ECOMMERCE_BASE_URL() { return getConfigValue('ECOMMERCE_BASE_URL', process.env.ECOMMERCE_BASE_URL); },
  get LICENSE_MANAGER_BASE_URL() { return getConfigValue('LICENSE_MANAGER_BASE_URL', process.env.LICENSE_MANAGER_BASE_URL); },
  get DISCOVERY_BASE_URL() { return getConfigValue('DISCOVERY_BASE_URL', process.env.DISCOVERY_BASE_URL); },
  get ENTERPRISE_CATALOG_BASE_URL() {
    return getConfigValue('ENTERPRISE_CATALOG_BASE_URL', process.env.ENTERPRISE_CATALOG_BASE_URL);
  },
  get ENTERPRISE_ACCESS_BASE_URL() {
    return getConfigValue('ENTERPRISE_ACCESS_BASE_URL', process.env.ENTERPRISE_ACCESS_BASE_URL);
  },
  get ENTERPRISE_SUBSIDY_BASE_URL() {
    return getConfigValue('ENTERPRISE_SUBSIDY_BASE_URL', process.env.ENTERPRISE_SUBSIDY_BASE_URL);
  },
  SECURE_COOKIES: process.env.NODE_ENV !== 'development',
  get SEGMENT_KEY() { return getConfigValue('SEGMENT_KEY', process.env.SEGMENT_KEY); },
  get ACCESS_TOKEN_COOKIE_NAME() { return getConfigValue('ACCESS_TOKEN_COOKIE_NAME', process.env.ACCESS_TOKEN_COOKIE_NAME); },
  get USER_INFO_COOKIE_NAME() { return getConfigValue('USER_INFO_COOKIE_NAME', process.env.USER_INFO_COOKIE_NAME); },
  get NODE_ENV() { return getConfigValue('NODE_ENV', process.env.NODE_ENV); },
  get CUSTOMER_SUPPORT_EMAIL() {
    return getConfigValue('CUSTOMER_SUPPORT_EMAIL', process.env.CUSTOMER_SUPPORT_EMAIL) || 'customersuccess@edx.org';
  },
  get CUSTOMER_SUPPORT_NAME() {
    return getConfigValue('CUSTOMER_SUPPORT_NAME', process.env.CUSTOMER_SUPPORT_NAME) || 'edX Customer Success team';
  },
  get PLATFORM_NAME() { return getConfigValue('PLATFORM_NAME', process.env.PLATFORM_NAME) || 'edX'; },
  get ENTERPRISE_LEARNER_PORTAL_URL() {
    return getConfigValue('ENTERPRISE_LEARNER_PORTAL_URL', process.env.ENTERPRISE_LEARNER_PORTAL_URL);
  },
  get ALGOLIA() {
    return {
      APP_ID: getConfigValue('ALGOLIA_APP_ID', process.env.ALGOLIA_APP_ID),
      SEARCH_API_KEY: getConfigValue('ALGOLIA_SEARCH_API_KEY', process.env.ALGOLIA_SEARCH_API_KEY),
      INDEX_NAME: getConfigValue('ALGOLIA_INDEX_NAME', process.env.ALGOLIA_INDEX_NAME),
    };
  },
  get LOGO_URL() { return getConfigValue('LOGO_URL', process.env.LOGO_URL); },
  get LOGO_WHITE_URL() { return getConfigValue('LOGO_WHITE_URL', process.env.LOGO_WHITE_URL); },
  get LOGO_TRADEMARK_URL() { return getConfigValue('LOGO_TRADEMARK_URL', process.env.LOGO_TRADEMARK_URL); },
  get PLOTLY_SERVER_URL() { return getConfigValue('PLOTLY_SERVER_URL', process.env.PLOTLY_SERVER_URL); },
  get DEMO_ENTEPRISE_UUID() { return getConfigValue('DEMO_ENTEPRISE_UUID', process.env.DEMO_ENTEPRISE_UUID); },
  get ADMIN_ONBOARDING_UUIDS() {
    return {
      FLOW_TRACK_LEARNER_PROGRESS_UUID: getConfigValue('FLOW_TRACK_LEARNER_PROGRESS_UUID', process.env.FLOW_TRACK_LEARNER_PROGRESS_UUID),
      FLOW_ANALYTICS_UUID: getConfigValue('FLOW_ANALYTICS_UUID', process.env.FLOW_ANALYTICS_UUID),
      FLOW_ORGANIZE_LEARNERS_UUID: getConfigValue('FLOW_ORGANIZE_LEARNERS_UUID', process.env.FLOW_ORGANIZE_LEARNERS_UUID),
      FLOW_ENROLLMENT_INSIGHTS: getConfigValue('FLOW_ENROLLMENT_INSIGHTS', process.env.FLOW_ENROLLMENT_INSIGHTS),
      FLOW_SHOWCASE_COURSES_UUID: getConfigValue('FLOW_SHOWCASE_COURSES_UUID', process.env.FLOW_SHOWCASE_COURSES_UUID),
      FLOW_PREFERENCES_UUID: getConfigValue('FLOW_PREFERENCES_UUID', process.env.FLOW_PREFERENCES_UUID),
      FLOW_CUSTOMIZE_REPORTS_UUID: getConfigValue('FLOW_CUSTOMIZE_REPORTS_UUID', process.env.FLOW_CUSTOMIZE_REPORTS_UUID),
      FLOW_ALLOCATE_BUDGETS_UUID: getConfigValue('FLOW_ALLOCATE_BUDGETS_UUID', process.env.FLOW_ALLOCATE_BUDGETS_UUID),
      FLOW_SUBSCRIPTIONS_UUID: getConfigValue('FLOW_SUBSCRIPTIONS_UUID', process.env.FLOW_SUBSCRIPTIONS_UUID),
    };
  },
};

const features = {
  BULK_ENROLLMENT: process.env.FEATURE_BULK_ENROLLMENT || hasFeatureFlagEnabled('BULK_ENROLLMENT'),
  CODE_MANAGEMENT: process.env.FEATURE_CODE_MANAGEMENT || hasFeatureFlagEnabled('CODE_MANAGEMENT'),
  REPORTING_CONFIGURATIONS: process.env.FEATURE_REPORTING_CONFIGURATIONS || hasFeatureFlagEnabled('REPORTING_CONFIGURATIONS'),
  ANALYTICS: process.env.FEATURE_ANALYTICS || hasFeatureFlagEnabled('ANALYTICS'),
  ANALYTICS_SUPPORTED: process.env.ANALYTICS_SUPPORTED || hasFeatureFlagEnabled('ANALYTICS_SUPPORTED'),
  SAML_CONFIGURATION: process.env.FEATURE_SAML_CONFIGURATION || hasFeatureFlagEnabled('SAML_CONFIGURATION'),
  SUPPORT: process.env.FEATURE_SUPPORT || hasFeatureFlagEnabled('SUPPORT'),
  EXTERNAL_LMS_CONFIGURATION: process.env.FEATURE_EXTERNAL_LMS_CONFIGURATION || hasFeatureFlagEnabled('EXTERNAL_LMS_CONFIGURATION'),
  FILE_ATTACHMENT: process.env.FEATURE_FILE_ATTACHMENT || hasFeatureFlagEnabled('FILE_ATTACHMENT'),
  SETTINGS_PAGE: process.env.FEATURE_SETTINGS_PAGE || hasFeatureFlagEnabled('SETTINGS_PAGE'),
  SETTINGS_PAGE_LMS_TAB: process.env.FEATURE_SETTINGS_PAGE_LMS_TAB || hasFeatureFlagEnabled('SETTINGS_PAGE_LMS_TAB'),
  SETTINGS_PAGE_APPEARANCE_TAB: process.env.FEATURE_SETTINGS_PAGE_APPEARANCE_TAB || hasFeatureFlagEnabled('SETTINGS_PAGE_APPEARANCE_TAB'),
  FEATURE_SSO_SETTINGS_TAB: process.env.FEATURE_SSO_SETTINGS_TAB || hasFeatureFlagEnabled('SSO_SETTINGS_TAB'),
  FEATURE_API_CREDENTIALS_TAB: process.env.FEATURE_API_CREDENTIALS_TAB || hasFeatureFlagEnabled('FEATURE_API_CREDENTIALS_TAB'),
  SUBSCRIPTION_LPR: process.env.SUBSCRIPTION_LPR || hasFeatureFlagEnabled('SUBSCRIPTION_LPR'),
  AUTH0_SELF_SERVICE_INTEGRATION: process.env.AUTH0_SELF_SERVICE_INTEGRATION || hasFeatureFlagEnabled('AUTH0_SELF_SERVICE_INTEGRATION'),
  FEATURE_HIGHLIGHTS_ARCHIVE_MESSAGING: process.env.FEATURE_HIGHLIGHTS_ARCHIVE_MESSAGING || hasFeatureFlagEnabled('FEATURE_HIGHLIGHTS_ARCHIVE_MESSAGING'),
  ADMIN_V1: process.env.FEATURE_ADMIN_V1 || hasFeatureFlagEnabled('FEATURE_ADMIN_V1'),
  ENABLE_DRAG_AND_DROP: process.env.ENABLE_DRAG_AND_DROP || hasFeatureFlagEnabled('ENABLE_DRAG_AND_DROP'),
};

export { configuration, features };
