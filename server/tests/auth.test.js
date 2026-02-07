import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { runAsync, getAsync, allAsync, closeDatabase } from '../db/connection.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

describe('Authentication System', () => {
  let testUserId;

  beforeAll(async () => {
    // Setup test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    testUserId = uuidv4();
    await runAsync(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [testUserId, 'Test User', 'test@example.com', hashedPassword, 'student']
    );
  });

  afterAll(() => {
    closeDatabase();
  });

  it('should create a new user', async () => {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash('newpass123', 10);

    await runAsync(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, 'New User', 'newuser@example.com', hashedPassword, 'student']
    );

    const user = await getAsync('SELECT * FROM users WHERE id = ?', [userId]);
    expect(user).toBeDefined();
    expect(user.email).toBe('newuser@example.com');
    expect(user.role).toBe('student');
  });

  it('should verify password correctly', async () => {
    const user = await getAsync('SELECT * FROM users WHERE id = ?', [testUserId]);
    const isValid = await bcrypt.compare('testpass123', user.password);
    expect(isValid).toBe(true);
  });

  it('should reject invalid password', async () => {
    const user = await getAsync('SELECT * FROM users WHERE id = ?', [testUserId]);
    const isValid = await bcrypt.compare('wrongpass', user.password);
    expect(isValid).toBe(false);
  });

  it('should get all users', async () => {
    const users = await allAsync('SELECT * FROM users');
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it('should find user by email', async () => {
    const user = await getAsync('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
