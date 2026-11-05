// MOCK: temporary fake attendance data, remove when the backend is functional.
// Data lives in memory only, so a page refresh resets it.

const today = () => new Date().toISOString().slice(0, 10); // assumed: UTC date counts as "today"
export const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms)); // fake loading time
export const MOCK_PIN = '1234'; // assumed: every mock intern uses this PIN

const NAMES = [
  'Ada Okafor', 'Chidi Nwosu', 'Ngozi Eze', 'Emeka Obi', 'Tunde Bello', 'Amina Yusuf',
  'Ifeanyi Uche', 'Sade Adebayo', 'Kelechi Anya', 'Bola Ige', 'Zainab Musa', 'David Kalu',
]; // assumed: 12 names so you can test pagination (10 per page)
const AREAS = ['Web Development', 'Design', 'Cloud', 'AI', 'Data']; // assumed

const interns = NAMES.map((name, i) => ({
  id: `mock-intern-${i + 1}`,
  fullName: name,
  email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
  techArea: AREAS[i % AREAS.length],
  status: 'ACTIVE',
}));

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function at(date, hour, minute) {
  return `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`;
}

let nextId = 1;
const records = [];

function addRecord(intern, date, signInAt, signOutAt) {
  records.push({
    id: `mock-att-${nextId++}`,
    internId: intern.id,
    internName: intern.fullName,
    date,
    signInAt,
    signOutAt,
  });
}

// past 6 days, with some days skipped so counts differ between interns
interns.forEach((intern, i) => {
  for (let n = 1; n <= 6; n++) {
    if ((i + n) % 4 === 0) continue;
    const date = daysAgo(n);
    addRecord(intern, date, at(date, 8, (i * 5 + n) % 30), at(date, 16, 0));
  }
});

// today: first 3 interns are signed in, the 4th has signed in and out, the rest are away
const t = today();
[0, 1, 2].forEach((i) => addRecord(interns[i], t, new Date().toISOString(), null));
addRecord(interns[3], t, at(t, 8, 10), at(t, 12, 0));

const inRange = (r, from, to) => (!from || r.date >= from) && (!to || r.date <= to);

export function paginate(list, page, limit) {
  const total = list.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;
  return { data: list.slice(start, start + limit), meta: { page, limit, total, totalPages } };
}

export function getInterns({ search, page, limit }) {
  const s = (search || '').toLowerCase();
  return paginate(interns.filter((i) => i.fullName.toLowerCase().includes(s)), page, limit);
}

export function getTodayRecord(internId) {
  return records.find((r) => r.internId === internId && r.date === today()) || null;
}

export function getStats() {
  return {
    activeInterns: interns.length,
    currentlyPresent: records.filter((r) => r.date === today() && !r.signOutAt).length,
  };
}

export function signInIntern(internId, pin) {
  const intern = interns.find((i) => i.id === internId);
  if (!intern) throw new Error('Intern not found');
  if (pin !== MOCK_PIN) throw new Error('Invalid PIN');
  if (getTodayRecord(internId)) throw new Error('This intern is already signed in'); // assumed: one record per day
  addRecord(intern, today(), new Date().toISOString(), null);
}

export function signOutIntern(internId, pin) {
  const intern = interns.find((i) => i.id === internId);
  if (!intern) throw new Error('Intern not found');
  if (pin !== MOCK_PIN) throw new Error('Invalid PIN');
  const rec = getTodayRecord(internId);
  if (!rec) throw new Error('This intern has not signed in');
  if (rec.signOutAt) throw new Error('This intern is already signed out'); // assumed: message wording
  rec.signOutAt = new Date().toISOString();
}

export function getInternRecords(internId, { from, to, page, limit }) {
  const list = records
    .filter((r) => r.internId === internId && inRange(r, from, to))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return paginate(list, page, limit);
}

export function countInternRecords(internId, { from, to }) {
  return records.filter((r) => r.internId === internId && inRange(r, from, to)).length;
}

export function countAllRecords({ from, to }) {
  return records.filter((r) => inRange(r, from, to)).length;
}

export function getRecord(id) {
  const rec = records.find((r) => r.id === id);
  if (!rec) throw new Error('Attendance record not found');
  return { ...rec };
}

export function updateRecord(id, { date, signInAt, signOutAt }) {
  const rec = records.find((r) => r.id === id);
  if (!rec) throw new Error('Attendance record not found');
  rec.date = date;
  rec.signInAt = signInAt;
  rec.signOutAt = signOutAt;
}

export function deleteRecord(id) {
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Attendance record not found');
  records.splice(index, 1);
}