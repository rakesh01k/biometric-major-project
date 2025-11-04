"""
Authentication Module
Handles fingerprint-based authentication and verification
"""

from database import FingerprintDatabase
from fingerprint_processor import FingerprintProcessor
from datetime import datetime

class AuthenticationManager:
    """Manages fingerprint-based authentication"""
    
    def __init__(self):
        """Initialize authentication manager"""
        self.db = FingerprintDatabase()
        self.processor = FingerprintProcessor()
    
    def authenticate_user(self, username: str, 
                         fingerprint_sample: str = None) -> dict:
        """
        Authenticate user using fingerprint
        
        Args:
            username: Username to authenticate
            fingerprint_sample: Fingerprint sample (auto-generated if None)
            
        Returns:
            Dictionary with authentication result
        """
        # Get user ID
        user_id = self.db.get_user_by_username(username)
        if not user_id:
            return {
                'success': False,
                'message': 'User not found',
                'match_percentage': 0.0
            }
        
        # Get stored fingerprints
        stored_fingerprints = self.db.get_user_fingerprints(user_id)
        if not stored_fingerprints:
            return {
                'success': False,
                'message': 'No fingerprints enrolled for this user',
                'match_percentage': 0.0
            }
        
        # Generate live fingerprint sample if not provided
        if fingerprint_sample is None:
            fingerprint_id = f"{username}_auth_{datetime.now().timestamp()}"
            _, fingerprint_sample = self.processor.generate_fingerprint_template(
                fingerprint_id
            )
        
        # Extract features from live sample
        live_features = self.processor.extract_features(fingerprint_sample)
        
        # Extract features from stored templates
        stored_features_list = [
            self.processor.extract_features(fp[1]) 
            for fp in stored_fingerprints
        ]
        
        # Match fingerprints
        is_match, match_percentage = self.processor.match_fingerprint(
            live_features, 
            stored_features_list
        )
        
        # Log authentication attempt
        self.db.log_authentication(user_id, is_match, match_percentage)
        
        return {
            'success': is_match,
            'message': 'Access Granted' if is_match else 'Access Denied',
            'match_percentage': round(match_percentage, 2),
            'username': username,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_authentication_history(self, username: str, limit: int = 10) -> list:
        """Get authentication history for a user"""
        user_id = self.db.get_user_by_username(username)
        if not user_id:
            return []
        
        conn = __import__('sqlite3').connect(self.db.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT attempt_time, success, match_percentage 
            FROM auth_logs 
            WHERE user_id = ? 
            ORDER BY attempt_time DESC 
            LIMIT ?
        ''', (user_id, limit))
        
        history = cursor.fetchall()
        conn.close()
        
        return [
            {
                'timestamp': h[0],
                'success': bool(h[1]),
                'match_percentage': h[2]
            }
            for h in history
        ]
