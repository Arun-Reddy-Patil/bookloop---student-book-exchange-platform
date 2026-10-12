/**
 * User Model & Schema definition for BookLoop (MERN Stack)
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  college: string;
  course: string;
  city: string;
  role: 'student' | 'admin';
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export const userValidation = {
  validateEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  validatePassword: (password: string) => typeof password === 'string' && password.length >= 6
};
