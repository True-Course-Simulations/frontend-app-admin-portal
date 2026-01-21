import { initializeMocks } from '../../../testUtils';

const enterpriseId = 'an-enterprise';
const initialStore = {
  portalConfiguration: {
    enterpriseId,
    enterpriseSlug: 'sluggy',
    enterpriseName: 'sluggyent',
    enableLearnerPortal: true,
  },
};

const getMockStore = (aStore) => {
  const { reduxStore } = initializeMocks(aStore);
  return reduxStore;
};

export {
  getMockStore,
  initialStore,
  enterpriseId,
};
