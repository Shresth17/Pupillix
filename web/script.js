// API Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('pupillix_token') || null;
let currentUser = null;

// API Helper Functions
const api = {
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            ...options.headers
        };

        try {
            console.log('Making request to:', `${API_URL}${endpoint}`);
            console.log('Request options:', { ...options, headers });
            
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                // Handle validation errors
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map(err => err.msg).join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error Details:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    },

    async signup(name, email, password) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        
        if (data.success && data.data.token) {
            authToken = data.data.token;
            localStorage.setItem('pupillix_token', authToken);
            currentUser = data.data.user;
        }
        
        return data;
    },

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.success && data.data.token) {
            authToken = data.data.token;
            localStorage.setItem('pupillix_token', authToken);
            currentUser = data.data.user;
        }
        
        return data;
    },

    async verifyToken() {
        if (!authToken) return null;
        
        try {
            const data = await this.request('/auth/verify', {
                method: 'POST'
            });
            
            if (data.success) {
                currentUser = data.data.user;
                return currentUser;
            }
        } catch (error) {
            this.logout();
        }
        
        return null;
    },

    async getProfile() {
        return await this.request('/user/profile');
    },

    async trackDownload(version = '1.0.0') {
        return await this.request('/download/track', {
            method: 'POST',
            body: JSON.stringify({ version })
        });
    },

    async getDownloadHistory() {
        return await this.request('/user/download-history');
    },

    async getAllUsers() {
        return await this.request('/user/all');
    },

    async getDownloadStats() {
        return await this.request('/download/stats');
    },

    logout() {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('pupillix_token');
    }
};

// Modal functionality
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const downloadModal = document.getElementById('downloadModal');

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const downloadBtn = document.getElementById('downloadBtn');

const closeBtns = document.getElementsByClassName('close');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

// Update UI based on login status
function updateUI() {
    if (currentUser) {
        loginBtn.textContent = 'Dashboard';
        signupBtn.textContent = 'Logout';
        signupBtn.onclick = logout;
        loginBtn.onclick = showDashboard;
    } else {
        loginBtn.textContent = 'Login';
        signupBtn.textContent = 'Get Started';
        loginBtn.onclick = () => loginModal.style.display = 'block';
        signupBtn.onclick = () => signupModal.style.display = 'block';
    }
}

// Open modals
downloadBtn.onclick = async () => {
    if (currentUser) {
        await handleDownload();
    } else {
        signupModal.style.display = 'block';
        showToast('Please create an account to download', 'info');
    }
};

// Close modals
Array.from(closeBtns).forEach(btn => {
    btn.onclick = function() {
        this.parentElement.parentElement.style.display = 'none';
    }
});

window.onclick = (event) => {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
};

// Switch between login and signup
switchToSignup.onclick = (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
};

switchToLogin.onclick = (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
};

// Login form handler
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    try {
        const result = await api.login(email, password);
        
        if (result.success) {
            loginModal.style.display = 'none';
            showToast(`Welcome back, ${currentUser.name}!`, 'success');
            updateUI();
            
            // Clear form
            e.target.reset();
            
            // Show download modal
            setTimeout(() => {
                handleDownload();
            }, 1000);
        }
    } catch (error) {
        showToast(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
};

// Signup form handler
document.getElementById('signupForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Client-side validation
    if (name.length < 2 || name.length > 50) {
        showToast('Name must be between 2 and 50 characters', 'error');
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const result = await api.signup(name, email, password);
        
        if (result.success) {
            signupModal.style.display = 'none';
            showToast('Account created successfully!', 'success');
            updateUI();
            
            // Clear form
            e.target.reset();
            
            // Show download modal
            setTimeout(() => {
                handleDownload();
            }, 1000);
        }
    } catch (error) {
        showToast(error.message || 'Signup failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
};

// Handle download
async function handleDownload() {
    try {
        const result = await api.trackDownload('1.0.0');
        
        if (result.success) {
            downloadModal.style.display = 'block';
            showToast('Download tracked successfully!', 'success');
          
            const downloadLink = downloadModal.querySelector('a.btn-primary');
            downloadLink.href = 'https://drive.google.com/file/d/1mCLrdcmrXXq5FoT2x-EqkcHO19FOUVwQ/view?usp=sharing';
        }
    } catch (error) {
        showToast('Error tracking download: ' + error.message, 'error');
    }
}

// Logout
function logout() {
    api.logout();
    updateUI();
    showToast('Logged out successfully', 'success');
}

// Show dashboard
async function showDashboard() {
    try {
        const profile = await api.getProfile();
        const history = await api.getDownloadHistory();
        
        if (profile.success && history.success) {
            const stats = profile.data.stats;
            const downloads = history.data.downloads;
            
            let message = `📊 Your Dashboard\n\n`;
            message += `Name: ${profile.data.name}\n`;
            message += `Email: ${profile.data.email}\n`;
            message += `Member since: ${new Date(profile.data.registeredAt).toLocaleDateString()}\n`;
            message += `Total Downloads: ${stats.totalDownloads}\n`;
            message += `Last Download: ${stats.lastDownload ? new Date(stats.lastDownload).toLocaleString() : 'Never'}\n\n`;
            
            if (downloads.length > 0) {
                message += `Recent Downloads:\n`;
                downloads.slice(0, 5).forEach((d, i) => {
                    message += `${i + 1}. ${new Date(d.downloadedAt).toLocaleString()} - v${d.version}\n`;
                });
            }
            
            alert(message);
        }
    } catch (error) {
        showToast('Error loading dashboard: ' + error.message, 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        error: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.onclick = () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    };
}

// Add animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .step').forEach(el => {
    observer.observe(el);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app
async function init() {
    // Verify existing token
    if (authToken) {
        await api.verifyToken();
    }
    updateUI();
    
    // Setup form validation
    setupFormValidation();
    
    console.log('🚀 Pupillix App Initialized');
    console.log('📡 API URL:', API_URL);
    console.log('🔐 Authenticated:', !!currentUser);
}

// Real-time form validation
function setupFormValidation() {
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    // Name validation
    if (signupName) {
        signupName.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length > 0 && (value.length < 2 || value.length > 50)) {
                e.target.setCustomValidity('Name must be between 2 and 50 characters');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }
    
    // Email validation
    [signupEmail, loginEmail].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                if (value.length > 0 && (!value.includes('@') || !value.includes('.'))) {
                    e.target.setCustomValidity('Please enter a valid email address');
                } else {
                    e.target.setCustomValidity('');
                }
            });
        }
    });
    
    // Password validation
    [signupPassword, loginPassword].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length > 0 && value.length < 6) {
                    e.target.setCustomValidity('Password must be at least 6 characters');
                } else {
                    e.target.setCustomValidity('');
                }
            });
        }
    });
}

// Admin function to view all users (protected by backend auth)
window.viewAllUsers = async function() {
    try {
        const result = await api.getAllUsers();
        if (result.success) {
            console.table(result.data);
            return result.data;
        }
    } catch (error) {
        console.error('Access denied:', error.message);
    }
};

window.viewStats = async function() {
    try {
        const result = await api.getDownloadStats();
        if (result.success) {
            console.log('📊 Download Statistics:');
            console.log(result.data);
            return result.data;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Start the app
init();

console.log('💡 Admin Commands:');
console.log('  viewAllUsers() - View all registered users');
console.log('  viewStats() - View download statistics');
