import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform } from 'react-native';
import { useApp } from './store';
import { Button, Field, StatusBarMock, Title } from './components';
import { colors, font } from './theme';

function AuthShell({ title, subtitle, fields, gap, onNext, footerText, footerLink, onFooter, extra }) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ marginTop: 70, alignItems: 'center' }}>
          <Title center>{title}</Title>
          <Text style={s.sub}>{subtitle}</Text>
        </View>
        <View style={{ marginTop: gap, gap: 23 }}>{fields}</View>
        <View style={{ flex: 1, minHeight: 40 }} />
        <View style={{ paddingBottom: 40, alignItems: 'center' }}>
          <Button title="Next" onPress={onNext} style={{ alignSelf: 'stretch', marginHorizontal: 18 }} />
          <Text style={s.footer}>
            {footerText}{' '}
            <Text style={s.link} onPress={onFooter}>{footerLink}</Text>
          </Text>
          {extra}
        </View>
      </ScrollView>
    </View>
  );
}

export function Login() {
  const { reset, setEmail } = useApp();
  const [em, setEm] = useState('');
  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to  access your account"
      gap={150}
      fields={
        <>
          <Field placeholder="Email" value={em} onChangeText={setEm} autoCapitalize="none" keyboardType="email-address" />
          <Field placeholder="Password" secureTextEntry />
        </>
      }
      onNext={() => { setEmail(em); reset('verify', { next: 'userHome' }); }}
      footerText="New member?"
      footerLink="Register Now"
      onFooter={() => reset('register')}
      extra={
        <Text style={[s.footer, { marginTop: 8 }]}>
          Are you an officer?{' '}
          <Text style={s.link} onPress={() => reset('officerLogin')}>Login as Officer</Text>
        </Text>
      }
    />
  );
}

export function Register() {
  const { reset, setEmail } = useApp();
  const [em, setEm] = useState('');
  return (
    <AuthShell
      title="Get Started"
      subtitle="by creating a free account."
      gap={70}
      fields={
        <>
          <Field placeholder="Full Name" />
          <Field placeholder="Email" value={em} onChangeText={setEm} autoCapitalize="none" keyboardType="email-address" />
          <Field placeholder="Phone Number" keyboardType="phone-pad" />
          <Field placeholder="Password" secureTextEntry />
        </>
      }
      onNext={() => { setEmail(em); reset('verify', { next: 'userHome' }); }}
      footerText="Already a member?"
      footerLink="Log In"
      onFooter={() => reset('login')}
    />
  );
}

export function OfficerLogin() {
  const { reset } = useApp();
  return (
    <AuthShell
      title="Login as Officer"
      subtitle="Authorized personnel only"
      gap={150}
      fields={
        <>
          <Field placeholder="Work email" autoCapitalize="none" keyboardType="email-address" />
          <Field placeholder="Officer ID" />
        </>
      }
      onNext={() => reset('officerHome')}
      footerText="New member?"
      footerLink="Register Now"
      onFooter={() => reset('register')}
      extra={
        <Text style={[s.footer, { marginTop: 8 }]}>
          Not an officer?{' '}
          <Text style={s.link} onPress={() => reset('login')}>Back to user login</Text>
        </Text>
      }
    />
  );
}

export function Verify() {
  const { reset, email, route } = useApp();
  const [code, setCode] = useState(['6', '9', '7', '5', '4', '9']);
  const [secs, setSecs] = useState(30);
  const [err, setErr] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (secs <= 0) return undefined;
    const t = setTimeout(() => setSecs((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const change = (i, text) => {
    const d = text.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    setErr(false);
    if (d && i < 5 && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.nativeEvent.key === 'Backspace' && !code[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1].focus();
  };
  const verify = () => {
    if (code.some((c) => !c)) { setErr(true); return; }
    reset((route.params && route.params.next) || 'userHome');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBarMock />
      <View style={{ paddingHorizontal: 24, marginTop: 70 }}>
        <Text style={s.almost}>Almost There</Text>
        <Text style={s.verifySub}>
          Please enter the 6-digit code sent to your email{' '}
          <Text style={{ color: colors.primary, fontFamily: font.medium }}>{email || 'email.yours@gmail.com'}</Text>{' '}
          for verification.
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 52 }}>
        {code.map((c, i) => (
          <TextInput
            key={i}
            ref={(r) => { refs.current[i] = r; }}
            value={c}
            onChangeText={(t) => change(i, t)}
            onKeyPress={(e) => onKey(i, e)}
            keyboardType="number-pad"
            maxLength={2}
            style={[s.box, err && !c && { borderColor: '#D14343' }]}
          />
        ))}
      </View>
      {err && <Text style={s.err}>Enter all 6 digits to continue.</Text>}
      <Button title="Verify" size={16} onPress={verify} style={{ marginHorizontal: 57, marginTop: 28 }} />
      <View style={{ alignItems: 'center', marginTop: 64 }}>
        <Text style={s.resend}>
          Didn’t receive any code?{' '}
          <Text style={secs === 0 ? s.link : null} onPress={secs === 0 ? () => setSecs(30) : undefined}>Resend Again</Text>
        </Text>
        <Text style={s.resend}>
          Request new code in{' '}
          <Text style={{ color: colors.primary }}>{`00:${String(secs).padStart(2, '0')}s`}</Text>
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  sub: { fontFamily: font.reg, fontSize: 14, color: colors.text, marginTop: 6 },
  footer: { fontFamily: font.reg, fontSize: 12.5, color: '#111', marginTop: 16 },
  link: { color: colors.primary, fontFamily: font.reg },
  almost: { fontFamily: font.semi, fontSize: 32, color: colors.text },
  verifySub: { fontFamily: font.reg, fontSize: 14, lineHeight: 21, color: '#333', marginTop: 6 },
  box: {
    width: 37, height: 37, borderRadius: 4, borderWidth: 1, borderColor: '#E4E4E4', backgroundColor: '#F0F0F0',
    textAlign: 'center', fontFamily: font.reg, fontSize: 14, color: '#222',
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  err: { fontFamily: font.reg, fontSize: 12, color: '#D14343', textAlign: 'center', marginTop: 10 },
  resend: { fontFamily: font.reg, fontSize: 12.5, color: '#111', lineHeight: 20 },
});
