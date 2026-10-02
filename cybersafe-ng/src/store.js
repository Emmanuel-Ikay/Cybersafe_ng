import React, { createContext, useContext, useRef, useState } from 'react';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const LOREM =
  'Lorem ipsum dolor sit amet consectetur. Diam dolor feugiat ut sagittis arcu phasellus. Quis semper sed habitant aliquam sit aliquam libero. Lectus ornare sit odio suspendisse pulvinar ipsum ullamcorper tincidunt. Elit mus integer cum lorem lobortis donec ipsum. Ultrices egestas sodales phasellus eget nibh. Eget nunc malesuada quis egestas et cras morbi vitae. Non pellentesque laoreet metus mi eget fermentum nulla arcu aliquam.\nNulla rutrum ultricies proin id leo nam volutpat aliquet nisl.';

const seedCases = [
  {
    id: 1, status: 'Opened', type: 'Malware attack', date: '05-Mar-25', number: 'CAS-38461-9B',
    description: LOREM, transaction: '', phone: '',
    evidence: [{ id: 1, name: 'evidence-img.jpg' }, { id: 2, name: 'evidence-doc.pdf' }],
  },
  {
    id: 2, status: 'Resolved', type: 'Malware attack', date: '21-Feb-25', number: 'CAS-27714-4C',
    description: LOREM, transaction: '', phone: '',
    evidence: [{ id: 3, name: 'evidence-img.jpg' }],
  },
  {
    id: 3, status: 'Closed', type: 'Malware attack', date: '09-Jan-25', number: 'CAS-19052-7A',
    description: LOREM, transaction: '', phone: '',
    evidence: [{ id: 4, name: 'evidence-doc.pdf' }],
  },
];

const seedNotices = [
  {
    id: 1, title: 'SIM swap scam',
    description:
      'Fraudsters trick a telecom agent into moving your number to a new SIM, then use it to reach your bank and wallet apps. Never share OTP codes or your NIN with anyone who calls you.',
  },
  {
    id: 2, title: 'I LOVE U Scam',
    description:
      'A romance scam where a "friend" you met online builds trust, then asks for money, gift cards or crypto for an emergency. Do not send money to someone you have not met in person.',
  },
];

const seedMessages = [
  {
    id: 1, from: 'officer',
    text: 'Good day, do you have a cyber crime incident to report?\nExplain your complaints below, while awaiting a response from personnel.',
  },
  { id: 2, from: 'user', text: 'Good day.' },
];

const autoReplies = [
  'Thank you for reaching out. An officer has been assigned and will review your report shortly.',
  'Please share any transaction references, phone numbers or screenshots you have.',
  'We have noted this. You can track progress under Reports.',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function AppProvider({ children }) {
  const [stack, setStack] = useState([{ name: 'login', params: {} }]);
  const [cases, setCases] = useState(seedCases);
  const [notices, setNotices] = useState(seedNotices);
  const [messages, setMessages] = useState(seedMessages);
  const [email, setEmail] = useState('');
  const counter = useRef(1000);
  const replyIdx = useRef(0);

  const route = stack[stack.length - 1];
  const go = (name, params = {}) => setStack((s) => [...s, { name, params }]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const reset = (name, params = {}) => setStack([{ name, params }]);

  const sendMessage = (from, text) => {
    const t = text.trim();
    if (!t) return;
    const id = counter.current++;
    setMessages((m) => [...m, { id, from, text: t }]);
    if (from === 'user') {
      const reply = autoReplies[replyIdx.current++ % autoReplies.length];
      const rid = counter.current++;
      setTimeout(() => setMessages((m) => [...m, { id: rid, from: 'officer', text: reply }]), 1400);
    }
  };

  const updateCase = (id, patch) =>
    setCases((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const removeCase = (id) => setCases((cs) => cs.filter((c) => c.id !== id));

  const addCase = ({ type, description, transaction, phone, evidence }) => {
    const d = new Date();
    const id = cases.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    const rand = () => Math.floor(10000 + Math.random() * 89999);
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const newCase = {
      id,
      status: 'Opened',
      type,
      date: `${String(d.getDate()).padStart(2, '0')}-${MONTHS[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`,
      number: `CAS-${rand()}-${Math.floor(Math.random() * 9)}${letters[Math.floor(Math.random() * letters.length)]}`,
      description, transaction, phone, evidence,
    };
    setCases((cs) => [newCase, ...cs]);
  };

  const addNotice = (title, description) =>
    setNotices((n) => [...n, { id: counter.current++, title, description }]);
  const removeNotice = (id) => setNotices((n) => n.filter((x) => x.id !== id));

  const nextId = () => counter.current++;

  const value = {
    route, go, back, reset, cases, updateCase, removeCase, addCase,
    notices, addNotice, removeNotice, messages, sendMessage, email, setEmail, nextId,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
