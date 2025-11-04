"""
Fingerprint Processing Engine
Simulates fingerprint feature extraction and matching using image processing
"""

import hashlib
import json
import numpy as np
from typing import Tuple, List

class FingerprintProcessor:
    """Processes and matches fingerprint templates"""
    
    def __init__(self):
        """Initialize fingerprint processor"""
        self.feature_dimension = 128  # Simulated feature vector dimension
        self.match_threshold = 0.85   # 85% match threshold for authentication
    
    def generate_fingerprint_template(self, fingerprint_id: str) -> Tuple[str, str]:
        """
        Simulate fingerprint template generation
        In real system, this would use actual fingerprint sensor data
        
        Args:
            fingerprint_id: Unique identifier for fingerprint
            
        Returns:
            Tuple of (template_hash, feature_vector_json)
        """
        # Simulate feature extraction - create deterministic features based on ID
        np.random.seed(hash(fingerprint_id) % (2**32))
        feature_vector = np.random.randn(self.feature_dimension).tolist()
        
        # Create hash of template for encryption simulation
        template_str = json.dumps(feature_vector)
        template_hash = hashlib.sha256(template_str.encode()).hexdigest()
        
        return template_hash, json.dumps(feature_vector)
    
    def extract_features(self, fingerprint_data: str) -> np.ndarray:
        """Extract feature vector from stored fingerprint data"""
        return np.array(json.loads(fingerprint_data))
    
    def calculate_similarity(self, features1: np.ndarray, 
                            features2: np.ndarray) -> float:
        """
        Calculate similarity between two fingerprint feature vectors
        Uses cosine similarity metric
        
        Args:
            features1: First feature vector
            features2: Second feature vector
            
        Returns:
            Similarity score between 0 and 1
        """
        # Normalize vectors
        norm1 = np.linalg.norm(features1)
        norm2 = np.linalg.norm(features2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        # Calculate cosine similarity
        similarity = np.dot(features1, features2) / (norm1 * norm2)
        
        # Convert from [-1, 1] range to [0, 1] range
        similarity = (similarity + 1) / 2
        
        return float(similarity)
    
    def match_fingerprint(self, live_features: np.ndarray, 
                         stored_features_list: List[np.ndarray]) -> Tuple[bool, float]:
        """
        Match live fingerprint against stored templates
        
        Args:
            live_features: Features from current fingerprint scan
            stored_features_list: List of stored feature vectors
            
        Returns:
            Tuple of (match_success, best_match_percentage)
        """
        if not stored_features_list:
            return False, 0.0
        
        # Find best match among all stored templates
        best_match = 0.0
        for stored_features in stored_features_list:
            similarity = self.calculate_similarity(live_features, stored_features)
            best_match = max(best_match, similarity)
        
        # Convert to percentage
        match_percentage = best_match * 100
        
        # Determine if match is successful
        is_match = best_match >= self.match_threshold
        
        return is_match, match_percentage
    
    def encrypt_template(self, template: str) -> str:
        """
        Simulate template encryption using hashing
        In production, use proper encryption like AES
        
        Args:
            template: Template string to encrypt
            
        Returns:
            Encrypted/hashed template
        """
        return hashlib.sha256(template.encode()).hexdigest()
    
    def verify_template(self, template: str, encrypted: str) -> bool:
        """Verify template against encrypted version"""
        return self.encrypt_template(template) == encrypted
