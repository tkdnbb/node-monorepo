import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

const SimpleComponent = () => (
  <View>
    <Text>Hello, Test!</Text>
  </View>
);

describe('Simple Component Test', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SimpleComponent />);
    expect(getByText('Hello, Test!')).toBeTruthy();
  });
});
