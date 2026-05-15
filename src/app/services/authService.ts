// Mock authentication service

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  joinedDate: number;
}

// Mock user database
const mockUsers: Record<string, { password: string; user: User }> = {
  'demo@tunelytics.com': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@tunelytics.com',
      name: 'Demo',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Demo&backgroundColor=b6e3f4',
      joinedDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    },
  },
};

export async function loginUser(email: string, password: string): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const userRecord = mockUsers[email.toLowerCase()];

  if (!userRecord || userRecord.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Store session
  localStorage.setItem('tunelytics_user', JSON.stringify(userRecord.user));
  localStorage.setItem('tunelytics_session', 'active');

  return userRecord.user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const emailLower = email.toLowerCase();

  if (mockUsers[emailLower]) {
    throw new Error('Email already exists');
  }

  // Generate random character avatar
  const avatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Jasper&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Oliver&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Peanut&backgroundColor=b6e3f4',
  ];

  const newUser: User = {
    id: Date.now().toString(),
    email: emailLower,
    name,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    joinedDate: Date.now(),
  };

  // Store in mock database
  mockUsers[emailLower] = {
    password,
    user: newUser,
  };

  // Store session
  localStorage.setItem('tunelytics_user', JSON.stringify(newUser));
  localStorage.setItem('tunelytics_session', 'active');

  return newUser;
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('tunelytics_user');
  const session = localStorage.getItem('tunelytics_session');

  if (userJson && session === 'active') {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  return null;
}

export function logoutUser(): void {
  localStorage.removeItem('tunelytics_session');
}
