"""
Fingerprint Authentication System - GUI Application
Complete Tkinter-based interface for enrollment and authentication
"""

import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import json
from datetime import datetime
from enrollment import EnrollmentManager
from authentication import AuthenticationManager
from database import FingerprintDatabase

class FingerprintAuthGUI:
    """Main GUI application for fingerprint authentication system"""
    
    def __init__(self, root):
        """Initialize GUI application"""
        self.root = root
        self.root.title("Fingerprint-Based Biometric Authentication System")
        self.root.geometry("900x700")
        self.root.configure(bg="#f0f0f0")
        
        # Initialize managers
        self.enrollment_mgr = EnrollmentManager()
        self.auth_mgr = AuthenticationManager()
        self.db = FingerprintDatabase()
        
        # Create main interface
        self.create_main_interface()
    
    def create_main_interface(self):
        """Create main tabbed interface"""
        # Header
        header_frame = tk.Frame(self.root, bg="#2c3e50", height=60)
        header_frame.pack(fill=tk.X)
        
        title_label = tk.Label(
            header_frame,
            text="Fingerprint-Based Biometric Authentication System",
            font=("Arial", 16, "bold"),
            bg="#2c3e50",
            fg="white"
        )
        title_label.pack(pady=10)
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create tabs
        self.enrollment_tab = ttk.Frame(self.notebook)
        self.authentication_tab = ttk.Frame(self.notebook)
        self.users_tab = ttk.Frame(self.notebook)
        self.history_tab = ttk.Frame(self.notebook)
        
        self.notebook.add(self.enrollment_tab, text="Enrollment")
        self.notebook.add(self.authentication_tab, text="Authentication")
        self.notebook.add(self.users_tab, text="Registered Users")
        self.notebook.add(self.history_tab, text="Auth History")
        
        # Populate tabs
        self.create_enrollment_tab()
        self.create_authentication_tab()
        self.create_users_tab()
        self.create_history_tab()
    
    def create_enrollment_tab(self):
        """Create enrollment tab"""
        frame = ttk.Frame(self.enrollment_tab, padding="20")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title = tk.Label(frame, text="User Enrollment", font=("Arial", 14, "bold"))
        title.pack(pady=10)
        
        # Username
        tk.Label(frame, text="Username:").pack(anchor=tk.W, pady=5)
        self.enroll_username = tk.Entry(frame, width=40)
        self.enroll_username.pack(anchor=tk.W, pady=5)
        
        # Email
        tk.Label(frame, text="Email:").pack(anchor=tk.W, pady=5)
        self.enroll_email = tk.Entry(frame, width=40)
        self.enroll_email.pack(anchor=tk.W, pady=5)
        
        # Fingerprint samples
        tk.Label(frame, text="Fingerprint Samples:").pack(anchor=tk.W, pady=5)
        self.enroll_samples = ttk.Spinbox(frame, from_=1, to=5, width=10)
        self.enroll_samples.set(3)
        self.enroll_samples.pack(anchor=tk.W, pady=5)
        
        # Enroll button
        enroll_btn = tk.Button(
            frame,
            text="Enroll User",
            command=self.perform_enrollment,
            bg="#27ae60",
            fg="white",
            font=("Arial", 12, "bold"),
            width=20
        )
        enroll_btn.pack(pady=20)
        
        # Result display
        tk.Label(frame, text="Enrollment Result:", font=("Arial", 10, "bold")).pack(anchor=tk.W, pady=5)
        self.enroll_result = scrolledtext.ScrolledText(frame, height=8, width=60)
        self.enroll_result.pack(pady=10)
    
    def create_authentication_tab(self):
        """Create authentication tab"""
        frame = ttk.Frame(self.authentication_tab, padding="20")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title = tk.Label(frame, text="User Authentication", font=("Arial", 14, "bold"))
        title.pack(pady=10)
        
        # Username
        tk.Label(frame, text="Username:").pack(anchor=tk.W, pady=5)
        self.auth_username = tk.Entry(frame, width=40)
        self.auth_username.pack(anchor=tk.W, pady=5)
        
        # Authenticate button
        auth_btn = tk.Button(
            frame,
            text="Authenticate with Fingerprint",
            command=self.perform_authentication,
            bg="#3498db",
            fg="white",
            font=("Arial", 12, "bold"),
            width=20
        )
        auth_btn.pack(pady=20)
        
        # Result display
        tk.Label(frame, text="Authentication Result:", font=("Arial", 10, "bold")).pack(anchor=tk.W, pady=5)
        self.auth_result = scrolledtext.ScrolledText(frame, height=12, width=60)
        self.auth_result.pack(pady=10)
    
    def create_users_tab(self):
        """Create registered users tab"""
        frame = ttk.Frame(self.users_tab, padding="20")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title = tk.Label(frame, text="Registered Users", font=("Arial", 14, "bold"))
        title.pack(pady=10)
        
        # Refresh button
        refresh_btn = tk.Button(
            frame,
            text="Refresh User List",
            command=self.refresh_users_list,
            bg="#9b59b6",
            fg="white",
            font=("Arial", 10, "bold")
        )
        refresh_btn.pack(pady=10)
        
        # Users display
        self.users_display = scrolledtext.ScrolledText(frame, height=15, width=60)
        self.users_display.pack(pady=10)
        
        # Initial load
        self.refresh_users_list()
    
    def create_history_tab(self):
        """Create authentication history tab"""
        frame = ttk.Frame(self.history_tab, padding="20")
        frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title = tk.Label(frame, text="Authentication History", font=("Arial", 14, "bold"))
        title.pack(pady=10)
        
        # Username
        tk.Label(frame, text="Username:").pack(anchor=tk.W, pady=5)
        self.history_username = tk.Entry(frame, width=40)
        self.history_username.pack(anchor=tk.W, pady=5)
        
        # View history button
        view_btn = tk.Button(
            frame,
            text="View History",
            command=self.view_auth_history,
            bg="#e74c3c",
            fg="white",
            font=("Arial", 10, "bold")
        )
        view_btn.pack(pady=10)
        
        # History display
        self.history_display = scrolledtext.ScrolledText(frame, height=12, width=60)
        self.history_display.pack(pady=10)
    
    def perform_enrollment(self):
        """Perform user enrollment"""
        username = self.enroll_username.get().strip()
        email = self.enroll_email.get().strip()
        samples = int(self.enroll_samples.get())
        
        if not username or not email:
            messagebox.showerror("Error", "Please enter username and email")
            return
        
        # Perform enrollment
        result = self.enrollment_mgr.enroll_user(username, email, samples)
        
        # Display result
        self.enroll_result.delete(1.0, tk.END)
        result_text = f"""
Enrollment Status: {'SUCCESS' if result['success'] else 'FAILED'}
Message: {result['message']}
User ID: {result.get('user_id', 'N/A')}
Templates Stored: {result.get('templates_stored', 0)}
Enrollment Time: {result.get('enrollment_time', 'N/A')}
        """
        self.enroll_result.insert(tk.END, result_text)
        
        if result['success']:
            messagebox.showinfo("Success", f"User {username} enrolled successfully!")
            self.enroll_username.delete(0, tk.END)
            self.enroll_email.delete(0, tk.END)
    
    def perform_authentication(self):
        """Perform user authentication"""
        username = self.auth_username.get().strip()
        
        if not username:
            messagebox.showerror("Error", "Please enter username")
            return
        
        # Perform authentication
        result = self.auth_mgr.authenticate_user(username)
        
        # Display result
        self.auth_result.delete(1.0, tk.END)
        status_color = "GREEN" if result['success'] else "RED"
        result_text = f"""
{'='*50}
AUTHENTICATION RESULT
{'='*50}

Status: {result['message']} ({status_color})
Username: {result['username']}
Match Percentage: {result['match_percentage']}%
Timestamp: {result['timestamp']}

{'='*50}
        """
        self.auth_result.insert(tk.END, result_text)
        
        # Show message box
        if result['success']:
            messagebox.showinfo("Success", f"Access Granted!\nMatch: {result['match_percentage']}%")
        else:
            messagebox.showerror("Failed", f"Access Denied!\nMatch: {result['match_percentage']}%")
    
    def refresh_users_list(self):
        """Refresh and display registered users"""
        users = self.db.get_all_users()
        
        self.users_display.delete(1.0, tk.END)
        
        if not users:
            self.users_display.insert(tk.END, "No registered users found.")
            return
        
        display_text = f"Total Registered Users: {len(users)}\n\n"
        display_text += "="*50 + "\n"
        
        for user_id, username in users:
            fingerprints = self.db.get_user_fingerprints(user_id)
            display_text += f"User ID: {user_id}\n"
            display_text += f"Username: {username}\n"
            display_text += f"Fingerprints Stored: {len(fingerprints)}\n"
            display_text += "-"*50 + "\n"
        
        self.users_display.insert(tk.END, display_text)
    
    def view_auth_history(self):
        """View authentication history for user"""
        username = self.history_username.get().strip()
        
        if not username:
            messagebox.showerror("Error", "Please enter username")
            return
        
        history = self.auth_mgr.get_authentication_history(username)
        
        self.history_display.delete(1.0, tk.END)
        
        if not history:
            self.history_display.insert(tk.END, f"No authentication history found for {username}")
            return
        
        display_text = f"Authentication History for {username}\n"
        display_text += f"Total Attempts: {len(history)}\n\n"
        display_text += "="*60 + "\n"
        
        for i, record in enumerate(history, 1):
            status = "SUCCESS" if record['success'] else "FAILED"
            display_text += f"Attempt {i}:\n"
            display_text += f"  Time: {record['timestamp']}\n"
            display_text += f"  Status: {status}\n"
            display_text += f"  Match %: {record['match_percentage']}%\n"
            display_text += "-"*60 + "\n"
        
        self.history_display.insert(tk.END, display_text)

def main():
    """Main entry point"""
    root = tk.Tk()
    app = FingerprintAuthGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
