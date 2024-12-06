// Mock React Native's Animated module
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.StatusBarManager = { getHeight: jest.fn() };
  return RN;
});

// Mock expo modules
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  useFonts: () => [true, null],
}));

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(),
  },
}));

jest.mock('expo-constants', () => ({
  Constants: {
    manifest: {},
  },
}));

// Set up required test environment variables
global.__TEST__ = true;

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: jest.fn(),
  },
}));
