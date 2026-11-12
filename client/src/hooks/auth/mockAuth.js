// MOCK: temporary fake accounts, remove when the backend is functional
export const MOCK_USERS = [
  {
    email: 'admin@imas.com', // from the spec
    password: 'TestPassword123', // from the spec
    staff: { id: 'mock-admin', fullName: 'Mock Admin', email: 'admin@imas.com', role: 'ADMINISTRATOR', status: 'ACTIVE' },
  },
  {
    email: 'coordinator@imas.com', // assumed
    password: 'TestPassword123', // assumed
    staff: { id: 'mock-coordinator', fullName: 'Mock Coordinator', email: 'coordinator@imas.com', role: 'INTERN_COORDINATOR', status: 'ACTIVE' },
  },
  {
    email: 'supervisor@imas.com', // assumed
    password: 'TestPassword123', // assumed
    staff: { id: 'mock-supervisor', fullName: 'Mock Supervisor', email: 'supervisor@imas.com', role: 'SUPERVISOR', status: 'ACTIVE' },
  },
];

const KEY = 'imas-mock-staff'; // assumed

export function getMockSession() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function setMockSession(staff) {
  sessionStorage.setItem(KEY, JSON.stringify(staff));
}

export function clearMockSession() {
  sessionStorage.removeItem(KEY);
}