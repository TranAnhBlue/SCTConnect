import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { BottomTabParamList } from '../types';
import { Colors, FontSize } from '../constants';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { MessagesScreen } from '../screens/Messages/MessagesScreen';
import { CommunityScreen } from '../screens/Community/CommunityScreen';
import { NotificationsScreen } from '../screens/Notifications/NotificationsScreen';
import { AccountScreen } from '../screens/Account/AccountScreen';

import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_CONFIG: Record<
  keyof BottomTabParamList,
  { label: string; icon: string; activeIcon: string }
> = {
  Home: { label: 'Trang chủ', icon: 'home-outline', activeIcon: 'home' },
  Messages: { label: 'Tin nhắn', icon: 'message-text-outline', activeIcon: 'message-text' },
  Community: { label: 'Cộng đồng', icon: 'account-group-outline', activeIcon: 'account-group' },
  Notifications: { label: 'Thông báo', icon: 'bell-outline', activeIcon: 'bell' },
  Account: { label: 'Tài khoản', icon: 'account-outline', activeIcon: 'account' },
};

export const BottomTabNavigator: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const orgCode = (user?.organization?.code?.toLowerCase() || '') as any;
  const unreadCount = useNotificationStore((state) =>
    state.getUnreadCountForUser(user?.role, orgCode, isAuthenticated)
  );

  return (
    <Tab.Navigator
      id="bottom-tab"
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name];
        return {
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.tabActive,
          tabBarInactiveTintColor: Colors.tabInactive,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={(focused ? config.activeIcon : config.icon) as any}
              size={size}
              color={color}
            />
          ),
          tabBarLabel: config.label,
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: Colors.statusRejected,
    color: '#FFFFFF',
    fontSize: 10,
  },
});
