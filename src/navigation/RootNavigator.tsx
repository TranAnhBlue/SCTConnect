import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { BottomTabNavigator } from './BottomTabNavigator';
import { FeedbackMenuScreen } from '../screens/Feedback/FeedbackMenuScreen';
import { FieldReportScreen } from '../screens/Feedback/FieldReportScreen';
import { AdminProcedureScreen } from '../screens/Feedback/AdminProcedureScreen';
import { FeedbackMapScreen } from '../screens/Feedback/FeedbackMapScreen';
import { CreateReportScreen } from '../screens/Feedback/CreateReportScreen';
import { ReportDetailScreen } from '../screens/Feedback/ReportDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Main bottom tabs */}
        <Stack.Screen name="BottomTab" component={BottomTabNavigator} />

        {/* Feedback flow */}
        <Stack.Screen name="FeedbackMenu" component={FeedbackMenuScreen} />
        <Stack.Screen name="FieldReport" component={FieldReportScreen} />
        <Stack.Screen name="AdminProcedure" component={AdminProcedureScreen} />
        <Stack.Screen
          name="FeedbackMap"
          component={FeedbackMapScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="CreateReport" component={CreateReportScreen} />
        <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
