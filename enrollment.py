"""
Enrollment Module
Handles fingerprint enrollment process for new users
"""

from database import FingerprintDatabase
from fingerprint_processor import FingerprintProcessor
from datetime import datetime

class EnrollmentManager:
    """Manages fingerprint enrollment process"""
    
    def __init__(self):
        """Initialize enrollment manager"""
        self.db = FingerprintDatabase()
        self.processor = FingerprintProcessor()
    
    def enroll_user(self, username: str, email: str, 
                   fingerprint_samples: int = 3) -> dict:
        """
        Enroll new user with fingerprint templates
        
        Args:
            username: Username for new user
            email: Email address
            fingerprint_samples: Number of fingerprint samples to capture
            
        Returns:
            Dictionary with enrollment status and details
        """
        # Check if user already exists
        existing_user = self.db.get_user_by_username(username)
        if existing_user:
            return {
                'success': False,
                'message': f'User {username} already exists',
                'user_id': None
            }
        
        # Add user to database
        user_id = self.db.add_user(username, email)
        if not user_id:
            return {
                'success': False,
                'message': 'Failed to create user',
                'user_id': None
            }
        
        # Capture and store fingerprint templates
        templates_stored = 0
        for i in range(fingerprint_samples):
            # Generate unique fingerprint ID for each sample
            fingerprint_id = f"{username}_sample_{i+1}_{datetime.now().timestamp()}"
            
            # Generate template
            template_hash, feature_vector = self.processor.generate_fingerprint_template(
                fingerprint_id
            )
            
            # Store in database
            self.db.store_fingerprint(user_id, template_hash, feature_vector)
            templates_stored += 1
        
        return {
            'success': True,
            'message': f'User {username} enrolled successfully with {templates_stored} fingerprint samples',
            'user_id': user_id,
            'templates_stored': templates_stored,
            'enrollment_time': datetime.now().isoformat()
        }
    
    def get_enrollment_status(self, username: str) -> dict:
        """Get enrollment status for a user"""
        user_id = self.db.get_user_by_username(username)
        if not user_id:
            return {'enrolled': False, 'message': 'User not found'}
        
        fingerprints = self.db.get_user_fingerprints(user_id)
        return {
            'enrolled': True,
            'username': username,
            'user_id': user_id,
            'fingerprints_stored': len(fingerprints)
        }
