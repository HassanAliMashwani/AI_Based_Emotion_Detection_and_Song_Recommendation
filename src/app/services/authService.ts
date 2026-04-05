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
  'demo@moodtune.com': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@moodtune.com',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
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
  localStorage.setItem('moodtune_user', JSON.stringify(userRecord.user));
  localStorage.setItem('moodtune_session', 'active');

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

  // Generate random avatar
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
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
  localStorage.setItem('moodtune_user', JSON.stringify(newUser));
  localStorage.setItem('moodtune_session', 'active');

  return newUser;
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('moodtune_user');
  const session = localStorage.getItem('moodtune_session');

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
  localStorage.removeItem('moodtune_session');
  // Keep user data for quick re-login
}
