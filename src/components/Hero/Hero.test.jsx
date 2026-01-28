import {
  render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Provider } from 'react-redux';
import Hero from './index';
import { initializeMocks } from '../../testUtils';

const lightColorStore = {
  portalConfiguration: {
    enterpriseBranding: {
      secondary_color: '#e0ceed',
    },
  },
};

const darkColorStore = {
  portalConfiguration: {
    enterpriseBranding: {
      secondary_color: '#082607',
    },
  },
};

const title = 'Quokkas Rule';

const createStore = (state = {}) => initializeMocks(state).reduxStore;

describe('Hero Component', () => {
  it('renders hero component with appropriate logo', () => {
    render(
      <Provider store={createStore(lightColorStore)}>
        <Hero title={title} />
      </Provider>,
    );
    expect(screen.queryByText(title)).toBeInTheDocument();
    const logo = screen.getByAltText('edX logo');
    expect(logo.src).toBe('https://edx-cdn.org/v3/prod/logo.svg');
  });
  it('renders white logo with dark banner color', () => {
    render(
      <Provider store={createStore(darkColorStore)}>
        <Hero title={title} />
      </Provider>,
    );
    expect(screen.queryByText(title)).toBeInTheDocument();
    const logo = screen.getByAltText('edX logo');
    expect(logo.src).toBe('https://edx-cdn.org/v3/default/logo-white.svg');
  });
});
