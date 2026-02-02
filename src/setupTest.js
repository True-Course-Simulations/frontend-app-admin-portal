/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import 'jest-localstorage-mock';
import 'jest-canvas-mock';

jest.mock('@edx/frontend-platform/auth');
jest.mock('@edx/frontend-platform/logging');
jest.mock('@edx/frontend-platform/analytics');

// Set up axios mocks
export const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);
axios.isAccessTokenExpired = jest.fn();
axios.isAccessTokenExpired.mockReturnValue(false);

// Provide a default mock for secured Algolia API key lookups to avoid noisy retries in tests
axiosMock.onGet(/secured-algolia-api-key/).reply(200, {
  algolia: {
    secured_api_key: 'test-secured-api-key',
    valid_until: '2100-01-01T00:00:00Z',
  },
  catalog_uuids_to_catalog_query_uuids: {},
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = ResizeObserverPolyfill;

// Stub createObjectURL
global.URL.createObjectURL = jest.fn();

// Suppress specific console.error warnings
/* eslint-disable no-console */
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const normalizeConsoleArgs = (args) => args.map((arg) => {
  if (typeof arg === 'string') {
    return arg;
  }
  if (arg && typeof arg.message === 'string') {
    return arg.message;
  }
  try {
    return JSON.stringify(arg);
  } catch (e) {
    return String(arg);
  }
}).join(' ');

const CONSOLE_FILTERS = {
  warn: [
    'PubSub already loaded',
    'React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7',
    'React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7',
  ],
  error: [
    'Support for defaultProps will be removed from function components',
    'findDOMNode is deprecated and will be removed in the next major release',
    'was not wrapped in act',
    'Failed prop type:',
    'MISSING_TRANSLATION',
    'React does not recognize',
    'Select elements must be either controlled or uncontrolled',
    'A component is changing a controlled input to be uncontrolled',
    'A component is changing an uncontrolled input to be controlled',
    'Each child in a list should have a unique "key" prop',
    'Invalid prop `variant` of value',
    'Invalid prop `size` of value',
    'The prop `alt` is marked as required',
    '[@formatjs/intl Error INVALID_CONFIG]',
    'locale" was not configured',
  ],
};

// Override `console.error`
console.error = (...args) => {
  const message = normalizeConsoleArgs(args);

  if (
    message
    && CONSOLE_FILTERS.error.some((ignored) => message.includes(ignored))
  ) {
    return;
  }

  originalConsoleError(...args);
};

// Override `console.warn`
console.warn = (...args) => {
  const message = normalizeConsoleArgs(args);
  if (message && CONSOLE_FILTERS.warn.some(ignored => message.includes(ignored))) {
    return;
  }
  originalConsoleWarn(...args);
};
/* eslint-enable no-console */

// TODO: Once there are no more console errors in tests, uncomment the code below
// const { error } = global.console;

// global.console.error = (...args) => {
//   error(...args);
//   throw new Error(args.join(' '));
// };
