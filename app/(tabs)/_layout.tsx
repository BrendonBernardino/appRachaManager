import { Tabs } from 'expo-router';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import * as Animatable from 'react-native-animatable';

import IconCampo from 'react-native-vector-icons/MaterialCommunityIcons';
import IconDado from 'react-native-vector-icons/Ionicons';
import IconMoeda from 'react-native-vector-icons/FontAwesome5';
// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// import CampoIcon from '../../assets/icons/soccer.svg';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          // flex: 1,
          height: 70,
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: '#1A291A',
          // position: 'absolute',
          borderTopWidth: 0,
        },
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // tabBarActiveBackgroundColor: '#1A291A',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
              <IconCampo name="soccer-field" 
              size={40}
              color={focused ? '#4E9F3D' : color}
              />
          ),
        }}
      />
      <Tabs.Screen
        name="sorteio"
        options={{
          tabBarIcon: ({ color, focused }) => (
              <IconDado name="dice" 
                size={40}
                color={focused ? '#4E9F3D' : color}
              />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          tabBarIcon: ({ color, focused }) => (
              <IconMoeda name="coins" 
                size={35}
                color={focused ? '#4E9F3D' : color}
              />
          ),
        }}
      />
    </Tabs>
  );
}
