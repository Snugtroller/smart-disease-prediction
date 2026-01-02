"""
Simple in-memory caching service to reduce Gemini API calls.
Caches advice and responses to avoid hitting quota limits.
"""

import hashlib
import json
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import threading


class CacheEntry:
    """Single cache entry with TTL."""
    
    def __init__(self, value: str, ttl_minutes: int = 60):
        self.value = value
        self.created_at = datetime.now()
        self.ttl_minutes = ttl_minutes
    
    def is_expired(self) -> bool:
        """Check if cache entry has expired."""
        expiry = self.created_at + timedelta(minutes=self.ttl_minutes)
        return datetime.now() > expiry


class AdviceCache:
    """
    Thread-safe cache for disease advice.
    
    Cache key is generated from: disease + risk_level + top_3_features
    This way, similar inputs get cached responses.
    """
    
    def __init__(self, ttl_minutes: int = 120):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl_minutes = ttl_minutes
        self.lock = threading.Lock()
        self.hit_count = 0
        self.miss_count = 0
    
    def _generate_key(self, disease: str, risk_level: str, explanation: list) -> str:
        """Generate cache key from disease, risk level, and top features."""
        # Use only top 3 features for consistency
        features_str = "|".join([
            f"{e['feature']}:{e['value']:.1f}" 
            for e in explanation[:3]
        ])
        
        key_str = f"{disease}_{risk_level}_{features_str}"
        # Hash to keep key reasonable length
        return hashlib.md5(key_str.encode()).hexdigest()
    
    def get(self, disease: str, risk_level: str, explanation: list) -> Optional[str]:
        """Retrieve cached advice if exists and not expired."""
        key = self._generate_key(disease, risk_level, explanation)
        
        with self.lock:
            if key in self.cache:
                entry = self.cache[key]
                if not entry.is_expired():
                    self.hit_count += 1
                    return entry.value
                else:
                    # Remove expired entry
                    del self.cache[key]
            
            self.miss_count += 1
            return None
    
    def set(self, disease: str, risk_level: str, explanation: list, value: str) -> None:
        """Store advice in cache."""
        key = self._generate_key(disease, risk_level, explanation)
        
        with self.lock:
            self.cache[key] = CacheEntry(value, self.ttl_minutes)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        total = self.hit_count + self.miss_count
        hit_rate = (self.hit_count / total * 100) if total > 0 else 0
        
        return {
            "cache_size": len(self.cache),
            "hit_count": self.hit_count,
            "miss_count": self.miss_count,
            "hit_rate": f"{hit_rate:.1f}%",
            "total_requests": total
        }
    
    def clear(self) -> None:
        """Clear all cache entries."""
        with self.lock:
            self.cache.clear()
            self.hit_count = 0
            self.miss_count = 0


class ChatbotResponseCache:
    """
    Thread-safe cache for chatbot responses.
    
    Cache key is generated from: sentiment + message_keywords
    Similar conversations get similar responses.
    """
    
    def __init__(self, ttl_minutes: int = 240):
        self.cache: Dict[str, CacheEntry] = {}
        self.ttl_minutes = ttl_minutes
        self.lock = threading.Lock()
        self.hit_count = 0
        self.miss_count = 0
    
    def _get_keywords(self, text: str) -> str:
        """Extract keywords for fuzzy matching."""
        # Convert to lowercase and get words
        words = text.lower().split()
        # Keep only meaningful words (> 3 chars)
        keywords = [w for w in words if len(w) > 3]
        # Sort for consistency
        return "|".join(sorted(keywords[:5]))
    
    def _generate_key(self, sentiment: str, message: str) -> str:
        """Generate cache key from sentiment and message keywords."""
        keywords = self._get_keywords(message)
        key_str = f"{sentiment}_{keywords}"
        return hashlib.md5(key_str.encode()).hexdigest()
    
    def get(self, sentiment: str, message: str) -> Optional[str]:
        """Retrieve cached response if exists and not expired."""
        key = self._generate_key(sentiment, message)
        
        with self.lock:
            if key in self.cache:
                entry = self.cache[key]
                if not entry.is_expired():
                    self.hit_count += 1
                    return entry.value
                else:
                    del self.cache[key]
            
            self.miss_count += 1
            return None
    
    def set(self, sentiment: str, message: str, value: str) -> None:
        """Store response in cache."""
        key = self._generate_key(sentiment, message)
        
        with self.lock:
            self.cache[key] = CacheEntry(value, self.ttl_minutes)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        total = self.hit_count + self.miss_count
        hit_rate = (self.hit_count / total * 100) if total > 0 else 0
        
        return {
            "cache_size": len(self.cache),
            "hit_count": self.hit_count,
            "miss_count": self.miss_count,
            "hit_rate": f"{hit_rate:.1f}%",
            "total_requests": total
        }
    
    def clear(self) -> None:
        """Clear all cache entries."""
        with self.lock:
            self.cache.clear()
            self.hit_count = 0
            self.miss_count = 0


# Global cache instances
advice_cache = AdviceCache(ttl_minutes=120)  # 2 hours for advice
chatbot_cache = ChatbotResponseCache(ttl_minutes=240)  # 4 hours for chatbot
