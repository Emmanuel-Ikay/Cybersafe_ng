import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './store';
import { BackRow, Button, CaseRow, Field, StatusBarMock, Title } from './components';
import { colors, font } from './theme';

const FILTERS = ['All', 'Opened', 'Resolved', 'Closed'];

export function OfficerHome() {
  const { cases, go } = useApp();
  const [f, setF] = useState(0);
  const filter = FILTERS[f];
  const list = cases.filter((c) => filter === 'All' || c.status === filter);
  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 70, paddingBottom: 30 }}>
        <Text style={s.hero}>
          <Text style={{ color: colors.primary }}>Monitor</Text> reports made by users!
        </Text>
        <Text style={s.heroSub}>Respond to citizens’ complaints</Text>

        <View style={s.headRow}>
          <Text style={s.reports}>Reports</Text>
          <Pressable onPress={() => setF((f + 1) % FILTERS.length)} style={s.filter}>
            {f > 0 && <Text style={s.filterText}>{filter}</Text>}
            <Ionicons name="options-outline" size={16} color="#333" />
          </Pressable>
        </View>
        <View style={{ gap: 8, marginTop: 14 }}>
          {list.map((c) => (
            <CaseRow key={c.id} c={c} onPress={() => go('officerCase', { id: c.id })} />
          ))}
          {list.length === 0 && <Text style={s.empty}>No reports match this filter.</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

export function NewNotice() {
  const { back, addNotice } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const publish = () => {
    if (!title.trim()) return;
    addNotice(title.trim(), description.trim() || 'No further details provided.');
    back();
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <BackRow onPress={back} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Title style={{ fontSize: 26 }}>Create notice</Title>
        <Text style={s.label}>Offender or scam name</Text>
        <Field placeholder="e.g. Fake bank alert SMS" value={title} onChangeText={setTitle} style={{ height: 40, fontSize: 12 }} />
        <Text style={s.label}>Details</Text>
        <TextInput
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Links, phone numbers, emails and how the scam works"
          placeholderTextColor="#777"
          style={s.area}
        />
        <Button title="Publish notice" size={16} onPress={publish} style={{ marginTop: 30, opacity: title.trim() ? 1 : 0.5 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { fontFamily: font.semi, fontSize: 24, lineHeight: 36, color: colors.text, textAlign: 'center', paddingHorizontal: 40 },
  heroSub: { fontFamily: font.reg, fontSize: 15, color: '#444', textAlign: 'center', marginTop: 16 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 62 },
  reports: { fontFamily: font.medium, fontSize: 16, color: colors.text },
  filter: { height: 26, minWidth: 38, borderRadius: 13, backgroundColor: colors.chip, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, gap: 6 },
  filterText: { fontFamily: font.reg, fontSize: 10.5, color: '#333' },
  empty: { fontFamily: font.reg, fontSize: 12, color: '#555', textAlign: 'center', marginTop: 16 },
  label: { fontFamily: font.medium, fontSize: 14, color: colors.text, marginTop: 22, marginBottom: 10 },
  area: {
    minHeight: 120, borderRadius: 12, borderWidth: 1, borderColor: '#DADADA', padding: 14, textAlignVertical: 'top',
    fontFamily: font.body, fontSize: 12.5, color: colors.text,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
});
