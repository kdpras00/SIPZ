import { Router } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Tambahkan definisi untuk session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(router: Router) {
  // Register endpoint
  router.post('/register', async (req, res) => {
    try {
      // Set content type to JSON to memastikan browser tahu ini respons JSON
      res.setHeader('Content-Type', 'application/json');

      const { name, email, password } = req.body;

      // Validasi data
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      // Hash password di server
      const hashedPassword = await bcrypt.hash(password, 10);

      // Buat user baru
      const newUser = await storage.createUser({
        id: `local-${Date.now()}`, // Generate ID lokal
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        password: hashedPassword
      });

      // Hapus password dari response
      const { password: _, ...userResponse } = newUser;

      return res.status(201).json({
        message: 'Registrasi berhasil',
        user: userResponse
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Gagal mendaftar. Silakan coba lagi." });
    }
  });

  // Login endpoint
  router.post('/login', async (req, res) => {
    try {
      console.log("Login request body:", req.body);

      const { email, password } = req.body;

      // Validasi data
      if (!email || !password) {
        console.log("Login validation failed: Email or password missing");
        return res.status(400).json({ message: 'Email dan password harus diisi' });
      }

      // Cek apakah user ada
      const user = await storage.getUserByEmail(email);
      console.log("User found:", user ? "Yes" : "No");
      console.log("User data:", user);

      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Untuk debugging, skip verifikasi password
      console.log("Skipping password verification for debugging");
      const isPasswordValid = true; // Skip bcrypt.compare untuk debugging

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Hapus password dari response
      const { password: _, ...userResponse } = user;

      // Buat session
      req.session.userId = user.id || `local-${Date.now()}`;
      console.log("Session created with userId:", req.session.userId);

      res.status(200).json({
        message: 'Login berhasil',
        user: userResponse
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Gagal login. Silakan coba lagi." });
    }
  });

  // Logout endpoint for local development
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: 'Gagal logout' });
      }
      res.clearCookie('connect.sid'); // Hapus cookie session
      return res.status(200).json({ message: 'Logout berhasil' });
    });
  });

  // Legacy logout endpoint (keeping for backward compatibility)
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Gagal logout' });
      }
      res.clearCookie('connect.sid'); // Hapus cookie session
      return res.status(200).json({ message: 'Logout berhasil' });
    });
  });

  // Get current user endpoint
  router.get('/user', async (req, res) => {
    try {
      console.log("Session in /user endpoint:", req.session);
      console.log("User ID from session:", req.session.userId);

      if (!req.session.userId) {
        return res.status(401).json({ message: 'Tidak terautentikasi' });
      }

      const user = await storage.getUser(req.session.userId);
      console.log("User found:", user ? "Yes" : "No");

      if (!user) {
        req.session.destroy((err) => {
          if (err) console.error("Error destroying session:", err);
        });
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      // Hapus password dari response
      const { password: _, ...userResponse } = user;

      res.status(200).json({ user: userResponse });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Gagal mendapatkan data user" });
    }
  });
}