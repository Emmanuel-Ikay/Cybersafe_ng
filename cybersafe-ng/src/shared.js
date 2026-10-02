import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './store';
import { BackRow, Button, Chip, IconBtn, StatusBarMock, Title, ask, confirmAction } from './components';
import { colors, font } from './theme';

/* ---------------- Case view (user + officer) ---------------- */
export function CaseView({ role }) {
  const { route, back, cases, updateCase, removeCase, nextId } = useApp();
  const [editing, setEditing] = useState(false);
  const c = cases.find((x) => x.id === route.params.id);
  if (!c) return <View style={{ flex: 1 }} />;
  const officer = role === 'officer';

  const addEvidence = () =>
    updateCase(c.id, { evidence: [...c.evidence, { id: nextId(), name: `evidence-new-${c.evidence.length + 1}.jpg` }] });
  const removeEvidence = (id) => updateCase(c.id, { evidence: c.evidence.filter((e) => e.id !== id) });
  const renameEvidence = (e) => {
    const n = ask('Rename file', e.name);
    if (n) updateCase(c.id, { evidence: c.evidence.map((x) => (x.id === e.id ? { ...x, name: n } : x)) });
  };
  const del = () => {
    if (confirmAction('Delete this case?')) { removeCase(c.id); back(); }
  };
  const cycle = () => {
    const order = ['Opened', 'Resolved', 'Closed'];
    updateCase(c.id, { status: order[(order.indexOf(c.status) + 1) % 3] });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <BackRow onPress={back} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title style={{ fontSize: 26 }}>Case {c.id}</Title>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {!officer && <IconBtn name="pencil" box={32} size={14} onPress={() => setEditing(!editing)} />}
            <IconBtn name="trash-outline" box={32} size={14} onPress={del} />
          </View>
        </View>

        <View style={{ marginTop: 22, gap: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Meta label="Status" style={{ width: 168 }}><Chip label={c.status} kind={c.status} /></Meta>
            <Meta label="Case type"><Chip label={c.type} /></Meta>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Meta label="Date filed" style={{ width: 168 }}><Chip label={c.date} /></Meta>
            <Meta label="Number"><Chip label={c.number} /></Meta>
          </View>
        </View>

        <Text style={s.h2}>Details</Text>
        <View style={s.card}>
          <Text style={s.cardTitle}>Report description:</Text>
          {editing ? (
            <TextInput
              multiline
              value={c.description}
              onChangeText={(t) => updateCase(c.id, { description: t })}
              style={[s.desc, { minHeight: 160, ...Platform.select({ web: { outlineStyle: 'none' } }) }]}
            />
          ) : (
            <Text style={s.desc}>{c.description}</Text>
          )}
        </View>

        <LabeledInput
          label={officer ? 'Transaction reference' : 'Transaction number'}
          value={c.transaction}
          onChangeText={(t) => updateCase(c.id, { transaction: t })}
        />
        {officer && (
          <LabeledInput label="phone number" value={c.phone} onChangeText={(t) => updateCase(c.id, { phone: t })} />
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
          <Text style={[s.h2, { marginTop: 0, fontSize: 15 }]}>Evidence</Text>
          <IconBtn name="add" box={32} size={18} onPress={addEvidence} />
        </View>
        <View style={{ gap: 12, marginTop: 10 }}>
          {c.evidence.map((e) => (
            <View key={e.id} style={s.evidence}>
              <View style={s.thumb} />
              <Text style={s.evName}>{e.name}</Text>
              {!officer && (
                <View style={s.evActions}>
                  <IconBtn name="pencil" box={22} size={11} onPress={() => renameEvidence(e)} />
                  <IconBtn name="trash-outline" box={22} size={11} onPress={() => removeEvidence(e.id)} />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {officer && (
        <View style={s.footerBar}>
          <Pressable onPress={cycle} style={[s.grayBtn, { width: 92 }]}>
            <Text style={s.grayText}>Mark status</Text>
          </Pressable>
          <Pressable onPress={addEvidence} style={[s.grayBtn, { width: 40 }]}>
            <Ionicons name="add" size={20} color="#333" />
          </Pressable>
          <Pressable onPress={() => updateCase(c.id, { status: 'Resolved' })} style={s.resolve}>
            <Text style={s.resolveText}>Resolve report</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Meta({ label, children, style }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 6 }, style]}>
      <Text style={s.metaLabel}>{label}</Text>
      {children}
    </View>
  );
}

function LabeledInput({ label, value, onChangeText }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 14 }}>
      <Text style={[s.metaLabel, { width: 110, fontSize: 12 }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="555-5555-555-5555"
        placeholderTextColor="#8a8a8a"
        style={s.smallInput}
      />
    </View>
  );
}

/* ---------------- Chat (user + officer) ---------------- */
export function Chat({ role }) {
  const { messages, sendMessage } = useApp();
  const [text, setText] = useState('');
  const ref = useRef(null);
  const send = () => { sendMessage(role, text); setText(''); };

  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 25, paddingTop: 20, paddingBottom: 18, gap: 18 }}
        onContentSizeChange={() => ref.current && ref.current.scrollToEnd({ animated: true })}
      >
        {messages.map((m) => {
          const mine = m.from === role;
          return mine ? (
            <View key={m.id} style={[s.bubbleWrap, { alignSelf: 'flex-end' }]}>
              <View style={s.mine}><Text style={s.mineText}>{m.text}</Text></View>
            </View>
          ) : (
            <View key={m.id} style={[s.bubbleWrap, { alignSelf: 'flex-start', marginBottom: 10 }]}>
              <View style={s.other}><Text style={s.otherText}>{m.text}</Text></View>
              <View style={s.avatar}>
                <Ionicons name={m.from === 'officer' ? 'shield-outline' : 'person-outline'} size={12} color={colors.primary} />
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={s.inputRow}>
        <Ionicons name="happy-outline" size={22} color={colors.primary} />
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={send}
          returnKeyType="send"
          placeholder="I have an incident to report"
          placeholderTextColor="#444"
          style={s.chatInput}
        />
        <Pressable onPress={send} hitSlop={8}>
          <Ionicons name={text.trim() ? 'send' : 'mic-outline'} size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

/* ---------------- Notice board (user + officer) ---------------- */
export function Notices({ role }) {
  const { notices, removeNotice, go } = useApp();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const officer = role === 'officer';
  const list = notices.filter((n) => (n.title + ' ' + n.description).toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 50, paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
        {officer ? (
          <View style={{ alignItems: 'center' }}>
            <Title style={{ fontSize: 24 }}>Notice board</Title>
            <Text style={[s.noticeSub, { marginTop: 10, textAlign: 'center' }]}>
              Add profiles of known offenders for viewers to find.
            </Text>
            <Button
              title="Create notice"
              size={16}
              spread
              onPress={() => go('newNotice')}
              right={<Ionicons name="add" size={22} color="#fff" />}
              style={{ width: 225, marginTop: 36, marginBottom: 20 }}
            />
          </View>
        ) : (
          <>
            <Title style={{ fontSize: 26 }}>Notice board</Title>
            <Text style={[s.noticeSub, { marginTop: 14 }]}>
              Persons and entities depicted below have been found to be involved in cyber crime activities across Nigeria.
            </Text>
            <View style={s.search}>
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="inspect suspicious links, numbers, emails, etc"
                placeholderTextColor="#555"
                style={s.searchInput}
              />
              <Ionicons name="search" size={16} color="#333" />
            </View>
          </>
        )}
        <View style={{ gap: 8, marginTop: officer ? 0 : 30 }}>
          {list.map((n) => {
            const isOpen = open === n.id;
            return (
              <View key={n.id} style={s.noticeCard}>
                <Pressable onPress={() => setOpen(isOpen ? null : n.id)} style={s.noticeRow}>
                  <View style={s.noticeTile} />
                  <Text style={s.noticeTitle}>{n.title}</Text>
                  <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#222" />
                </Pressable>
                {isOpen && (
                  <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
                    <Text style={s.noticeBody}>{n.description}</Text>
                    {officer && (
                      <Text style={s.remove} onPress={() => confirmAction('Remove this notice?') && removeNotice(n.id)}>
                        Remove notice
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
          {list.length === 0 && <Text style={[s.noticeSub, { textAlign: 'center', marginTop: 20 }]}>No notices match your search.</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  h2: { fontFamily: font.medium, fontSize: 17, color: colors.text, marginTop: 28 },
  metaLabel: { fontFamily: font.body, fontSize: 13, color: '#333' },
  card: { borderWidth: 1, borderColor: '#DADADA', borderRadius: 12, padding: 16, marginTop: 14 },
  cardTitle: { fontFamily: font.reg, fontSize: 14, color: colors.text, marginBottom: 12 },
  desc: { fontFamily: font.body, fontSize: 12, lineHeight: 18, color: '#333' },
  smallInput: {
    flex: 1, height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#DADADA', paddingHorizontal: 14,
    fontFamily: font.body, fontSize: 12, color: colors.text,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  evidence: { borderWidth: 1, borderColor: '#DADADA', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 66 },
  thumb: { width: 72, height: 42, borderRadius: 8, backgroundColor: colors.tile, marginLeft: 8 },
  evName: { fontFamily: font.reg, fontSize: 12, color: '#333', flex: 1 },
  evActions: { position: 'absolute', right: 10, bottom: 8, flexDirection: 'row', gap: 4 },
  footerBar: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14, backgroundColor: colors.bg },
  grayBtn: { height: 40, borderRadius: 6, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  grayText: { fontFamily: font.reg, fontSize: 12, color: '#333' },
  resolve: { flex: 1, height: 40, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  resolveText: { fontFamily: font.reg, fontSize: 14, color: '#fff' },

  bubbleWrap: { maxWidth: '80%' },
  other: { backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 20 },
  otherText: { fontFamily: font.reg, fontSize: 12, lineHeight: 19, color: '#fff' },
  mine: { backgroundColor: '#E4E4E4', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14 },
  mineText: { fontFamily: font.reg, fontSize: 12, lineHeight: 19, color: '#333' },
  avatar: {
    position: 'absolute', left: 0, bottom: -12, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.bg,
    borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 25, paddingVertical: 12 },
  chatInput: {
    flex: 1, height: 36, borderRadius: 18, backgroundColor: '#ECECEC', paddingHorizontal: 14,
    fontFamily: font.reg, fontSize: 11.5, color: '#222',
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },

  noticeSub: { fontFamily: font.reg, fontSize: 12, lineHeight: 18, color: '#444' },
  search: {
    flexDirection: 'row', alignItems: 'center', height: 36, borderRadius: 18, backgroundColor: '#ECECEC',
    paddingHorizontal: 22, marginTop: 20, borderWidth: 1, borderColor: '#E2E2E2',
  },
  searchInput: { flex: 1, fontFamily: font.reg, fontSize: 11, color: '#222', ...Platform.select({ web: { outlineStyle: 'none' } }) },
  noticeCard: { backgroundColor: colors.card, borderRadius: 10 },
  noticeRow: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 16 },
  noticeTile: { width: 48, height: 48, borderRadius: 10, backgroundColor: colors.tile },
  noticeTitle: { flex: 1, fontFamily: font.reg, fontSize: 13, color: '#333' },
  noticeBody: { fontFamily: font.body, fontSize: 12, lineHeight: 18, color: '#333' },
  remove: { fontFamily: font.reg, fontSize: 12, color: '#D14343', marginTop: 10 },
});
