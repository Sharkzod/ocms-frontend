export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}