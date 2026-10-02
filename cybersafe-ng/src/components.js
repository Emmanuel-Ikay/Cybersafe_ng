import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, statusColors } from './theme';

export const ask = (msg, def = '') =>
  Platform.OS === 'web' && typeof window !== 'undefined' ? window.prompt(msg, def) : null;
export const confirmAction = (msg) =>
  Platform.OS === 'web' && typeof window !== 'undefined' ? window.confirm(msg) : true;

export function StatusBarMock() {
  if (Platform.OS !== 'web') return <View style={{ height: 44 }} />;
  return (
    <View style={s.status}>
      <Text style={s.time}>9:41</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="cellular" size={16} color="#1a1a1a" />
        <Ionicons name="wifi" size={16} color="#1a1a1a" />
        <Ionicons name="battery-full" size={24} color="#1a1a1a" />
      </View>
    </View>
  );
}

export function Title({ children, style, center }) {
  return <Text style={[s.title, center && { textAlign: 'center' }, style]}>{children}</Text>;
}

export function Button({ title, onPress, right, style, size = 18, variant = 'primary', spread }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        variant === 'gray' && { backgroundColor: colors.chip },
        spread && { justifyContent: 'space-between', paddingHorizontal: 40 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Text style={[s.btnText, { fontSize: size }, variant === 'gray' && { color: colors.text }]}>
        {title}
      </Text>
      {right}
    </Pressable>
  );
}

export function Field(props) {
  return <TextInput placeholderTextColor="#5a5a5a" {...props} style={[s.field, props.style]} />;
}

export function Chip({ label, kind }) {
  const c = statusColors[kind];
  return (
    <View style={[s.chip, c && { backgroundColor: c.bg }]}>
      <Text style={[s.chipText, c && { color: c.fg }]}>{label}</Text>
    </View>
  );
}

export function IconBtn({ name, onPress, box = 32, size = 16 }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { width: box, height: box, borderRadius: box / 2, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons name={name} size={size} color="#333" />
    </Pressable>
  );
}

export function BackRow({ onPress }) {
  return (
    <View style={{ height: 40, justifyContent: 'center', paddingHorizontal: 18 }}>
      <Pressable onPress={onPress} hitSlop={10}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

export function Banner({ height = 125 }) {
  const [i, setI] = useState(0);
  return (
    <Pressable onPress={() => setI((i + 1) % 4)} style={[s.banner, { height }]}>
      <View style={{ flexDirection: 'row', gap: 3, marginBottom: 12 }}>
        {[0, 1, 2, 3].map((n) => (
          <View
            key={n}
            style={{ height: 3, width: n === i ? 12 : 8, borderRadius: 2, backgroundColor: n === i ? '#3a3a3a' : '#fff' }}
          />
        ))}
      </View>
    </Pressable>
  );
}

export function TabBar({ items, active }) {
  return (
    <View style={s.tabbar}>
      {items.map((t) => {
        const on = t.key === active;
        return (
          <Pressable key={t.key} onPress={t.onPress} style={s.tab}>
            <Ionicons name={t.icon} size={22} color={on ? colors.primary : '#8a8a8a'} />
            <Text style={[s.tabLabel, on && { color: colors.primary }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CaseRow({ c, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.8 }]}>
      <Text style={s.rowTitle}>Case {c.id}</Text>
      <Chip label={c.status} kind={c.status} />
      <Chip label={c.type} />
      <View style={{ flex: 1 }} />
      <Ionicons name="chevron-forward" size={14} color="#222" />
    </Pressable>
  );
}

const s = StyleSheet.create({
  status: { height: 54, paddingHorizontal: 34, paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontFamily: font.semi, fontSize: 15, color: '#1a1a1a' },
  title: { fontFamily: font.semi, fontSize: 32, color: colors.text },
  btn: { height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  btnText: { fontFamily: font.reg, color: '#fff' },
  field: {
    height: 47, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg,
    paddingHorizontal: 18, fontFamily: font.body, fontSize: 13, color: colors.text,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  chip: { backgroundColor: colors.chip, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontFamily: font.reg, fontSize: 10.5, color: '#333' },
  banner: { backgroundColor: colors.tile, borderRadius: 24, justifyContent: 'flex-end', alignItems: 'center' },
  tabbar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E6E6E6', backgroundColor: colors.bg, paddingTop: 8, paddingBottom: 14 },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  tabLabel: { fontFamily: font.reg, fontSize: 10, color: '#8a8a8a' },
  row: { height: 48, borderRadius: 10, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, gap: 8 },
  rowTitle: { fontFamily: font.reg, fontSize: 13, color: colors.text, marginRight: 4 },
});
