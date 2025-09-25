import React from 'react';
import { View } from 'react-native';

export default function TabBarBackground() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#261f46ff', // match your tab bar color
        marginTop: 0,
        paddingTop: 0,
      }}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
