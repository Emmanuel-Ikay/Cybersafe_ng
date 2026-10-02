import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './store';
import { Banner, BackRow, Button, CaseRow, Chip, Field, IconBtn, StatusBarMock, Title } from './components';
import { colors, font } from './theme';

export function UserHome() {
  const { go, reset } = useApp();
  const items = [
    { icon: 'flag-outline', label: 'Reported' },
    { icon: 'time-outline', label: 'In progress' },
    { icon: 'checkmark-circle-outline', label: 'Resolved' },
  ];
  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 70, paddingBottom: 30 }}>
        <Text style={s.hero}>
          Staying <Text style={{ color: colors.primary }}>safe</Text> in the digital world!
        </Text>
        <Text style={s.heroSub}>Do you have a cyber crime to report?</Text>
        <Button title="Report an incident" size={15} onPress={() => go('newReport')} style={{ marginTop: 40 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 15 }}>
          {items.map((i) => (
            <Pressable key={i.label} onPress={() => reset('userReports')} style={{ alignItems: 'center', width: 80 }}>
              <View style={s.circle}><Ionicons name={i.icon} size={20} color="#333" /></View>
              <Text style={s.circleLabel}>{i.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ gap: 16, marginTop: 28 }}>
          <Banner />
          <Banner />
        </View>
      </ScrollView>
    </View>
  );
}

export function UserReports() {
  const { cases, go } = useApp();
  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 56, paddingBottom: 30 }}>
        <Banner height={175} />
        <Button
          title="File new report"
          size={15}
          spread
          onPress={() => go('newReport')}
          right={<Ionicons name="add" size={22} color="#fff" />}
          style={{ marginTop: 47 }}
        />
        <Text style={s.myCases}>My cases</Text>
        <View style={{ gap: 8, marginTop: 14 }}>
          {cases.map((c) => (
            <CaseRow key={c.id} c={c} onPress={() => go('userCase', { id: c.id })} />
          ))}
          {cases.length === 0 && <Text style={s.empty}>No cases yet. Tap “File new report” to start.</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const TYPES = ['Phishing', 'Malware attack', 'SIM swap scam', 'Romance scam', 'Identity theft', 'Other'];

export function NewReport() {
  const { back, addCase, reset, nextId } = useApp();
  const [type, setType] = useState('Malware attack');
  const [description, setDescription] = useState('');
  const [transaction, setTransaction] = useState('');
  const [phone, setPhone] = useState('');
  const [evidence, setEvidence] = useState([]);

  const submit = () => {
    addCase({
      type,
      description: description.trim() || 'No description provided.',
      transaction, phone, evidence,
    });
    reset('userReports');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <BackRow onPress={back} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Title style={{ fontSize: 26 }}>File new report</Title>
        <Text style={s.label}>Case type</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[s.typeChip, type === t && { backgroundColor: colors.primary }]}
            >
              <Text style={[s.typeText, type === t && { color: '#fff' }]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Report description</Text>
        <TextInput
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Tell us what happened"
          placeholderTextColor="#777"
          style={s.area}
        />

        <Text style={s.label}>Transaction number</Text>
        <Field placeholder="555-5555-555-5555" value={transaction} onChangeText={setTransaction} style={{ height: 40, fontSize: 12 }} />
        <Text style={s.label}>Phone number</Text>
        <Field placeholder="555-5555-555-5555" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ height: 40, fontSize: 12 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
          <Text style={[s.label, { marginTop: 0 }]}>Evidence</Text>
          <IconBtn
            name="add"
            box={32}
            size={18}
            onPress={() => setEvidence([...evidence, { id: nextId(), name: `evidence-${evidence.length + 1}.jpg` }])}
          />
        </View>
        <View style={{ gap: 10, marginTop: 10 }}>
          {evidence.map((e) => (
            <View key={e.id} style={s.evidence}>
              <View style={s.thumb} />
              <Text style={s.evName}>{e.name}</Text>
              <IconBtn name="trash-outline" box={22} size={11} onPress={() => setEvidence(evidence.filter((x) => x.id !== e.id))} />
            </View>
          ))}
        </View>

        <Button title="Submit report" size={16} onPress={submit} style={{ marginTop: 30 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { fontFamily: font.semi, fontSize: 24, lineHeight: 36, color: colors.text, textAlign: 'center' },
  heroSub: { fontFamily: font.reg, fontSize: 15, color: '#444', textAlign: 'center', marginTop: 14 },
  circle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  circleLabel: { fontFamily: font.reg, fontSize: 11.5, color: '#333', marginTop: 8 },
  myCases: { fontFamily: font.medium, fontSize: 16, color: colors.text, marginTop: 28 },
  empty: { fontFamily: font.reg, fontSize: 12, color: '#555', textAlign: 'center', marginTop: 16 },
  label: { fontFamily: font.medium, fontSize: 14, color: colors.text, marginTop: 22, marginBottom: 10 },
  typeChip: { backgroundColor: colors.chip, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7 },
  typeText: { fontFamily: font.reg, fontSize: 12, color: '#333' },
  area: {
    minHeight: 120, borderRadius: 12, borderWidth: 1, borderColor: '#DADADA', padding: 14, textAlignVertical: 'top',
    fontFamily: font.body, fontSize: 12.5, color: colors.text,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  evidence: { borderWidth: 1, borderColor: '#DADADA', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 14 },
  thumb: { width: 60, height: 36, borderRadius: 8, backgroundColor: colors.tile },
  evName: { fontFamily: font.reg, fontSize: 12, color: '#333', flex: 1 },
});
