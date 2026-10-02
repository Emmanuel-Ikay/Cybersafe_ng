import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Mulish_400Regular, Mulish_600SemiBold } from '@expo-google-fonts/mulish';

import { AppProvider, useApp } from './src/store';
import { TabBar } from './src/components';
import { colors } from './src/theme';
import { Login, Register, OfficerLogin, Verify } from './src/auth';
import { UserHome, UserReports, NewReport } from './src/user';
import { OfficerHome, NewNotice } from './src/officer';
import { CaseView, Chat, Notices } from './src/shared';

const SCREENS = {
  login: Login,
  register: Register,
  officerLogin: OfficerLogin,
  verify: Verify,
  userHome: UserHome,
  userReports: UserReports,
  userNotices: () => <Notices role="user" />,
  userChat: () => <Chat role="user" />,
  userCase: () => <CaseView role="user" />,
  newReport: NewReport,
  officerHome: OfficerHome,
  officerNotices: () => <Notices role="officer" />,
  officerChat: () => <Chat role="officer" />,
  officerCase: () => <CaseView role="officer" />,
  newNotice: NewNotice,
};

const USER_TABS = [
  { key: 'userHome', label: 'Home', icon: 'home-outline' },
  { key: 'userReports', label: 'Reports', icon: 'document-text-outline' },
  { key: 'userNotices', label: 'Notices', icon: 'megaphone-outline' },
  { key: 'userChat', label: 'Chat', icon: 'chatbubble-outline' },
];
const OFFICER_TABS = [
  { key: 'officerHome', label: 'Reports', icon: 'document-text-outline' },
  { key: 'officerNotices', label: 'Notices', icon: 'megaphone-outline' },
  { key: 'officerChat', label: 'Chat', icon: 'chatbubble-outline' },
];

function Shell() {
  const { route, reset } = useApp();
  const Screen = SCREENS[route.name] || Login;
  const tabs = route.name.startsWith('officer') ? OFFICER_TABS : USER_TABS;
  const showTabs = tabs.some((t) => t.key === route.name);
  const items = [
    ...tabs.map((t) => ({ ...t, onPress: () => reset(t.key) })),
    { key: 'logout', label: 'Log out', icon: 'log-out-outline', onPress: () => reset('login') },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <Screen />
      </View>
      {showTabs && <TabBar items={items} active={route.name} />}
    </View>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Mulish_400Regular, Mulish_600SemiBold,
  });
  const { width, height } = useWindowDimensions();
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const wide = Platform.OS === 'web' && width > 500;
  return (
    <View style={[s.outer, wide && s.outerWide]}>
      <View style={wide ? [s.phone, { height: Math.min(height - 24, 844) }] : { flex: 1, width: '100%' }}>
        <AppProvider>
          <Shell />
        </AppProvider>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer: { flex: 1, backgroundColor: colors.bg },
  outerWide: { backgroundColor: '#DCE6E5', alignItems: 'center', justifyContent: 'center' },
  phone: {
    width: 390, borderRadius: 36, overflow: 'hidden', backgroundColor: colors.bg,
    ...Platform.select({ web: { boxShadow: '0 20px 60px rgba(0,0,0,0.18)' } }),
  },
});
