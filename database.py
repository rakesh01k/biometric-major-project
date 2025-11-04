"""
Database Management Module
Handles SQLite database operations for fingerprint templates storage
"""

import sqlite3
import os
from pathlib import Path

class FingerprintDatabase:
    """Manages fingerprint template storage and retrieval"""
    
    def __init__(self, db_path="fingerprint_db.sqlite"):
        """Initialize database connection"""
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Create database tables if they don't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create fingerprints table with encrypted templates
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS fingerprints (
                fingerprint_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                template_hash TEXT NOT NULL,
                feature_vector TEXT NOT NULL,
                enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        ''')
        
        # Create authentication logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS auth_logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN NOT NULL,
                match_percentage REAL,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_user(self, username, email):
        """Add new user to database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (username, email) VALUES (?, ?)', 
                         (username, email))
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            return user_id
        except sqlite3.IntegrityError:
            return None
    
    def store_fingerprint(self, user_id, template_hash, feature_vector):
        """Store encrypted fingerprint template"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO fingerprints (user_id, template_hash, feature_vector)
            VALUES (?, ?, ?)
        ''', (user_id, template_hash, feature_vector))
        conn.commit()
        conn.close()
    
    def get_user_fingerprints(self, user_id):
        """Retrieve all fingerprints for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT template_hash, feature_vector FROM fingerprints
            WHERE user_id = ?
        ''', (user_id,))
        fingerprints = cursor.fetchall()
        conn.close()
        return fingerprints
    
    def get_user_by_username(self, username):
        """Get user ID by username"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT user_id FROM users WHERE username = ?', (username,))
        result = cursor.fetchone()
        conn.close()
        return result[0] if result else None
    
    def log_authentication(self, user_id, success, match_percentage=None):
        """Log authentication attempt"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO auth_logs (user_id, success, match_percentage)
            VALUES (?, ?, ?)
        ''', (user_id, success, match_percentage))
        conn.commit()
        conn.close()
    
    def get_all_users(self):
        """Get list of all registered users"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT user_id, username FROM users')
        users = cursor.fetchall()
        conn.close()
        return users
