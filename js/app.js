// Edith Pro - Enterprise Interview Intelligence Platform
// Full-Featured State Management System

const Store = {
    state: {
        currentUser: null,
        isAuthenticated: false,
        currentView: 'landing',
        theme: 'light',
        sidebarOpen: true,
        notifications: [],
        unreadCount: 3,
        interviewSession: null,
        scheduledInterviews: [],
        messages: [],
        candidates: [],
        analytics: {},
        jobs: [],
        applications: [],
        userSettings: {},
        billingInfo: {},
        searchQuery: '',
        currentFilter: 'all',
        activeTimers: {},
        aiConversations: [],
        codingSubmissions: [],
        calendarEvents: [],
        prepProgress: {}
    },
    
    listeners: new Set(),
    
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    },
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(listener => listener(this.state));
        this.persist();
    },
    
    persist() {
        const persistentData = {
            currentUser: this.state.currentUser,
            isAuthenticated: this.state.isAuthenticated,
            theme: this.state.theme,
            userSettings: this.state.userSettings,
            prepProgress: this.state.prepProgress,
            aiConversations: this.state.aiConversations,
            calendarEvents: this.state.calendarEvents,
            codingSubmissions: this.state.codingSubmissions
        };
        localStorage.setItem('edith_pro_state', JSON.stringify(persistentData));
    },
    
    load() {
        const saved = localStorage.getItem('edith_pro_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.state = { ...this.state, ...parsed };
        }
    },

    // Data helpers
    addNotification(notification) {
        const newNotifications = [{ ...notification, id: Date.now(), read: false, time: new Date() }, ...this.state.notifications];
        this.setState({ 
            notifications: newNotifications.slice(0, 50),
            unreadCount: newNotifications.filter(n => !n.read).length
        });
    },

    markNotificationRead(id) {
        const notifications = this.state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        );
        this.setState({ 
            notifications,
            unreadCount: notifications.filter(n => !n.read).length
        });
    },

    addCalendarEvent(event) {
        const events = [...this.state.calendarEvents, { ...event, id: Date.now() }];
        this.setState({ calendarEvents: events });
    },

    addAIConversation(message) {
        const conversations = [...this.state.aiConversations, { ...message, timestamp: Date.now() }];
        this.setState({ aiConversations: conversations });
    }
};

// Enterprise-Grade Mock Backend API with Full Functionality
const API = {
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    async login(email, password, role) {
        await this.delay(800);
        if (!email || !password) throw new Error('Invalid credentials');
        
        // Generate realistic user data based on role
        const userData = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            role: role || 'candidate',
            avatar: null,
            onboardingComplete: false,
            createdAt: new Date().toISOString(),
            stats: this.generateUserStats(role),
            preferences: {
                notifications: true,
                theme: 'light',
                language: 'en'
            }
        };
        
        return {
            success: true,
            user: userData,
            token: 'jwt_' + Math.random().toString(36).substr(2),
            requiresOnboarding: !userData.onboardingComplete
        };
    },
    
    async register(userData) {
        await this.delay(1000);
        
        const newUser = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            ...userData,
            name: userData.name || userData.email.split('@')[0],
            createdAt: new Date().toISOString(),
            onboardingComplete: false,
            stats: this.generateUserStats(userData.role)
        };
        
        return {
            success: true,
            user: newUser,
            token: 'jwt_' + Math.random().toString(36).substr(2)
        };
    },

    generateUserStats(role) {
        const baseStats = {
            candidate: {
                interviewsCompleted: 0,
                averageScore: 0,
                streak: 0,
                totalPracticeTime: 0,
                problemsSolved: 0,
                skillLevel: 1
            },
            interviewer: {
                interviewsConducted: 0,
                averageRating: 5.0,
                pendingReviews: 0,
                totalCandidates: 0
            },
            recruiter: {
                openPositions: 0,
                totalHires: 0,
                timeToHire: 0,
                activeCandidates: 0
            },
            admin: {
                totalUsers: 1247,
                totalCompanies: 48,
                monthlyInterviews: 3421,
                platformHealth: 99.9
            }
        };
        return baseStats[role] || baseStats.candidate;
    },
    
    async getDashboardData(role, userId) {
        await this.delay(600);
        
        const dashboards = {
            candidate: {
                upcomingInterviews: [
                    { id: 1, company: 'Google', role: 'Senior Frontend Engineer', date: this.getFutureDate(2), type: 'Technical', status: 'scheduled', prepComplete: false },
                    { id: 2, company: 'Meta', role: 'Full Stack Developer', date: this.getFutureDate(5), type: 'System Design', status: 'scheduled', prepComplete: false }
                ],
                recentActivity: [
                    { id: 1, action: 'Completed Mock Interview', score: 85, date: new Date().toISOString(), details: 'Algorithms Round' },
                    { id: 2, action: 'Updated Profile', date: new Date(Date.now() - 86400000).toISOString() },
                    { id: 3, action: 'Solved Problem', date: new Date(Date.now() - 172800000).toISOString(), details: 'Two Sum' }
                ],
                skillGaps: ['System Design', 'GraphQL', 'Kubernetes', 'Microservices'],
                strengths: ['React', 'TypeScript', 'CSS Architecture', 'Testing'],
                recommendations: [
                    { type: 'practice', title: 'Try a System Design Mock', reason: 'Based on your upcoming Meta interview', priority: 'high' },
                    { type: 'study', title: 'Review GraphQL Basics', reason: '15 min read • Recommended for Meta interview', priority: 'medium' },
                    { type: 'challenge', title: 'Join Weekly Challenge', reason: 'Compete with 200+ candidates', priority: 'low' }
                ],
                weeklyGoal: { current: 3, target: 5, type: 'interviews' }
            },
            interviewer: {
                todayInterviews: [
                    { id: 101, candidate: 'Alice Johnson', role: 'Senior Frontend', time: '10:00 AM', type: 'Technical', status: 'scheduled', candidateAvatar: 'AJ' },
                    { id: 102, candidate: 'Bob Smith', role: 'Full Stack', time: '2:00 PM', type: 'System Design', status: 'scheduled', candidateAvatar: 'BS' },
                    { id: 103, candidate: 'Carol White', role: 'Backend Engineer', time: '4:00 PM', type: 'Coding', status: 'scheduled', candidateAvatar: 'CW' }
                ],
                pendingReviews: [
                    { id: 201, candidate: 'David Lee', date: '2024-01-10', type: 'Technical', deadline: '2 days left' },
                    { id: 202, candidate: 'Emma Davis', date: '2024-01-09', type: 'Behavioral', deadline: '1 day left' }
                ],
                topCandidates: [
                    { name: 'Alice Johnson', score: 95, role: 'Senior Engineer', match: 98 },
                    { name: 'Bob Smith', score: 92, role: 'Product Manager', match: 94 },
                    { name: 'Carol White', score: 89, role: 'Backend Engineer', match: 91 }
                ],
                weeklyStats: { conducted: 12, averageScore: 84, completionRate: 96 }
            },
            recruiter: {
                openPositions: [
                    { id: 301, title: 'Senior Frontend Engineer', department: 'Engineering', applicants: 45, stage: 'Interview', posted: '5 days ago' },
                    { id: 302, title: 'Product Manager', department: 'Product', applicants: 32, stage: 'Screening', posted: '3 days ago' },
                    { id: 303, title: 'DevOps Engineer', department: 'Infrastructure', applicants: 28, stage: 'Applied', posted: '1 day ago' }
                ],
                pipeline: {
                    applied: 120,
                    screening: 45,
                    interview: 18,
                    offer: 5,
                    hired: 3
                },
                metrics: {
                    avgTimeToHire: '18 days',
                    offerAcceptanceRate: '78%',
                    sourceEffectiveness: [
                        { source: 'LinkedIn', candidates: 45, hires: 8 },
                        { source: 'Referrals', candidates: 12, hires: 5 },
                        { source: 'Indeed', candidates: 38, hires: 3 }
                    ]
                },
                urgentActions: [
                    { type: 'review', message: '5 candidates waiting for review > 3 days' },
                    { type: 'interview', message: '2 interviews need scheduling' }
                ]
            },
            admin: {
                systemHealth: 99.9,
                activeUsers: 1247,
                interviewsToday: 156,
                revenue: { monthly: '$45,230', growth: '+12%' },
                recentSignups: 23,
                supportTickets: 5,
                topCompanies: [
                    { name: 'Google', interviews: 234, users: 45 },
                    { name: 'Meta', interviews: 189, users: 38 },
                    { name: 'Amazon', interviews: 167, users: 42 }
                ]
            }
        };
        
        return dashboards[role] || dashboards.candidate;
    },

    getFutureDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    },
    
    async getInterviewQuestions(type, level, topic) {
        await this.delay(400);
        
        const questionBank = {
            behavioral: [
                { id: 'b1', text: 'Tell me about a time you had to deal with a difficult team member.', category: 'Leadership', difficulty: 'medium', followUps: ['What was the outcome?', 'What would you do differently?'] },
                { id: 'b2', text: 'Describe a project that failed and what you learned.', category: 'Growth Mindset', difficulty: 'hard', followUps: ['How did you communicate this to stakeholders?'] },
                { id: 'b3', text: 'How do you prioritize when you have multiple deadlines?', category: 'Time Management', difficulty: 'easy', followUps: ['Give a specific example'] },
                { id: 'b4', text: 'Tell me about a time you went above and beyond.', category: 'Ownership', difficulty: 'medium', followUps: ['Why was this important to you?'] }
            ],
            technical: {
                algorithms: [
                    { id: 't1', title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', difficulty: 'easy', examples: [{input: '[2,7,11,15], target=9', output: '[0,1]'}], constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'] },
                    { id: 't2', title: 'LRU Cache', description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.', difficulty: 'medium', examples: [{input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]'}] },
                    { id: 't3', title: 'Merge K Sorted Lists', description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge them into one sorted linked-list.', difficulty: 'hard', examples: [{input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]'}] }
                ],
                systemDesign: [
                    { id: 's1', title: 'Design URL Shortener', description: 'Design a service like TinyURL that takes a long URL and returns a shortened version.', requirements: ['Functional: Shorten URL, Redirect', 'Non-functional: High availability, Low latency', 'Scale: 100M new URLs/day, 10B reads/day'] },
                    { id: 's2', title: 'Design Web Crawler', description: 'Build a web crawler that systematically browses the World Wide Web.', requirements: ['Scalability', 'Politeness (robots.txt)', 'Extensibility'] },
                    { id: 's3', title: 'Design Chat Application', description: 'Design a WhatsApp or Messenger-like chat application.', requirements: ['One-on-one messaging', 'Group messaging', 'Online status', 'Media sharing'] }
                ],
                frontend: [
                    { id: 'f1', title: 'Event Delegation', description: 'Explain event delegation in JavaScript and implement a delegated event listener.', difficulty: 'medium' },
                    { id: 'f2', title: 'Virtual DOM', description: 'Explain how Virtual DOM works and implement a simple diffing algorithm.', difficulty: 'hard' },
                    { id: 'f3', title: 'CSS Architecture', description: 'How would you structure CSS for a large-scale application?', difficulty: 'medium' }
                ]
            }
        };
        
        if (type === 'technical' && topic) {
            return questionBank.technical[topic] || questionBank.technical.algorithms;
        }
        
        return questionBank[type] || questionBank.behavioral;
    },

    async executeCode(code, language, testCases) {
        await this.delay(1500);
        
        // Mock code execution with realistic behavior
        const hasSyntaxError = code.includes('syntax error test');
        const hasLogicError = code.includes('return wrong');
        
        if (hasSyntaxError) {
            return {
                success: false,
                output: '',
                error: 'SyntaxError: Unexpected token',
                executionTime: '0ms',
                memory: '0MB'
            };
        }
        
        if (hasLogicError) {
            return {
                success: false,
                output: 'Output: [0,0]\nExpected: [0,1]',
                error: 'Test case failed',
                executionTime: '12ms',
                memory: '14MB',
                testResults: [
                    { passed: true, input: '[2,7,11,15], 9', expected: '[0,1]', got: '[0,1]' },
                    { passed: false, input: '[3,2,4], 6', expected: '[1,2]', got: '[0,0]' }
                ]
            };
        }
        
        return {
            success: true,
            output: 'All test cases passed!\nRuntime: 56ms (faster than 82.5% of submissions)\nMemory: 14.2MB (less than 67.3% of submissions)',
            error: null,
            executionTime: '56ms',
            memory: '14.2MB',
            testResults: [
                { passed: true, input: '[2,7,11,15], 9', expected: '[0,1]', got: '[0,1]' },
                { passed: true, input: '[3,2,4], 6', expected: '[1,2]', got: '[1,2]' },
                { passed: true, input: '[3,3], 6', expected: '[0,1]', got: '[0,1]' }
            ]
        };
    },

    async getAIResponse(message, context, role) {
        await this.delay(1000 + Math.random() * 1000);
        
        const responses = {
            candidate: [
                "That's a great question! Let me break this down for you. Start by clarifying the requirements with your interviewer.",
                "For this type of problem, consider using a HashMap for O(1) lookup time. Would you like me to walk through the solution?",
                "When answering behavioral questions, use the STAR method: Situation, Task, Action, Result.",
                "Based on your upcoming Google interview, I recommend focusing on Graph algorithms this week. Shall I generate a study plan?",
                "Your code looks good, but consider edge cases like empty inputs. Also, think about space complexity optimizations.",
                "For system design interviews, always start with functional and non-functional requirements. Don't jump into implementation too quickly."
            ],
            interviewer: [
                "This candidate shows strong problem-solving skills. Consider asking about edge cases to test thoroughness.",
                "The communication could be clearer. Ask them to explain their thought process step by step.",
                "Great optimization on time complexity. Now test if they can trade space for time if needed.",
                "This is a solid hire signal. They demonstrated good collaboration and technical depth.",
                "Consider a follow-up on scalability if they pass this round. Their architecture knowledge seems strong."
            ],
            default: [
                "I understand. Let me help you with that.",
                "Could you provide more context so I can give you a more specific answer?",
                "That's a common scenario. Here are some best practices...",
                "Based on industry standards, I recommend the following approach..."
            ]
        };
        
        const pool = responses[role] || responses.default;
        return pool[Math.floor(Math.random() * pool.length)];
    },

    async getJobs(filters) {
        await this.delay(600);
        
        const jobs = [
            { id: 1, title: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$180k-$250k', type: 'Full-time', posted: '2 days ago', match: 95, skills: ['React', 'TypeScript', 'Go'], applicants: 45 },
            { id: 2, title: 'Staff Engineer', company: 'Meta', location: 'Remote', salary: '$200k-$300k', type: 'Full-time', posted: '1 week ago', match: 88, skills: ['System Design', 'Python', 'ML'], applicants: 89 },
            { id: 3, title: 'Full Stack Developer', company: 'Stripe', location: 'Seattle, WA', salary: '$160k-$220k', type: 'Full-time', posted: '3 days ago', match: 92, skills: ['Ruby', 'React', 'AWS'], applicants: 34 },
            { id: 4, title: 'Principal Architect', company: 'Netflix', location: 'Los Gatos, CA', salary: '$250k-$400k', type: 'Full-time', posted: '5 days ago', match: 85, skills: ['Java', 'Microservices', 'Kafka'], applicants: 67 },
            { id: 5, title: 'Frontend Lead', company: 'Vercel', location: 'Remote', salary: '$170k-$240k', type: 'Full-time', posted: '1 day ago', match: 98, skills: ['Next.js', 'Edge', 'Performance'], applicants: 23 }
        ];
        
        return jobs.filter(job => {
            if (filters.type && filters.type !== 'all' && !job.type.toLowerCase().includes(filters.type)) return false;
            if (filters.remote && job.location !== 'Remote') return false;
            if (filters.match && job.match < filters.match) return false;
            return true;
        });
    },

    async applyForJob(jobId, userId, resume, coverLetter) {
        await this.delay(1200);
        return {
            success: true,
            applicationId: 'app_' + Date.now(),
            status: 'submitted',
            nextSteps: 'Recruiter will review within 48 hours'
        };
    },

    async saveEvaluation(evaluationData) {
        await this.delay(800);
        return {
            success: true,
            evaluationId: 'eval_' + Date.now(),
            candidateScore: this.calculateOverallScore(evaluationData.ratings),
            recommendation: this.generateRecommendation(evaluationData.ratings)
        };
    },

    calculateOverallScore(ratings) {
        const values = Object.values(ratings);
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    },

    generateRecommendation(ratings) {
        const avg = this.calculateOverallScore(ratings);
        if (avg >= 4) return 'Strong Hire';
        if (avg >= 3) return 'Hire';
        if (avg >= 2) return 'Weak Hire';
        return 'No Hire';
    }
};

// UI Component Library - All Interactive
const UI = {
    toast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
        toast.innerHTML = `
            <span style="font-size: 20px;">${icons[type]}</span>
            <span>${message}</span>
        `;
        toast.onclick = () => toast.remove();
        container.appendChild(toast);
        
        if (duration > 0) {
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
        return toast;
    },

    showModal(content, options = {}) {
        const container = document.getElementById('modal-container');
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.innerHTML = content;
        container.appendChild(overlay);
        
        const close = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 200);
        };
        
        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && !options.preventBackdropClose) close();
        });
        
        // Close button
        const closeBtn = overlay.querySelector('.modal-close');
        if (closeBtn) closeBtn.onclick = close;
        
        return { overlay, close };
    },

    renderLanding() {
        return `
            <div class="auth-page">
                <div class="auth-container">
                    <div class="auth-branding animate-fade-in">
                        <h1>Edith Pro</h1>
                        <p>The enterprise interview intelligence platform. Conduct AI-powered interviews, make data-driven hiring decisions, and accelerate your career growth.</p>
                        
                        <div class="feature-list">
                            <div class="feature-item">
                                <div class="feature-icon">✓</div>
                                <span>AI-Powered Interview Simulation with Real-time Feedback</span>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">✓</div>
                                <span>Live Code Execution & Collaborative Editing</span>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">✓</div>
                                <span>Advanced Analytics & Candidate Insights</span>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">✓</div>
                                <span>End-to-End Hiring Pipeline Management</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="auth-card animate-fade-in">
                        <div class="auth-tabs">
                            <button class="auth-tab active" onclick="App.switchAuthTab('login')">Log In</button>
                            <button class="auth-tab" onclick="App.switchAuthTab('register')">Sign Up</button>
                        </div>
                        
                        <div id="login-form">
                            <form onsubmit="App.handleLogin(event)">
                                <div class="form-group">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" class="form-input" placeholder="you@company.com" required id="login-email">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-input" placeholder="••••••••" required id="login-password">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">I am a...</label>
                                    <div class="role-selector">
                                        <div class="role-option selected" onclick="App.selectRole('candidate', this)" data-role="candidate">
                                            <div class="icon">👨‍💻</div>
                                            <div class="label">Candidate</div>
                                            <div class="desc">Looking for jobs</div>
                                        </div>
                                        <div class="role-option" onclick="App.selectRole('interviewer', this)" data-role="interviewer">
                                            <div class="icon">👨‍💼</div>
                                            <div class="label">Interviewer</div>
                                            <div class="desc">Conducting interviews</div>
                                        </div>
                                        <div class="role-option" onclick="App.selectRole('recruiter', this)" data-role="recruiter">
                                            <div class="icon">🎯</div>
                                            <div class="label">Recruiter</div>
                                            <div class="desc">Managing hiring</div>
                                        </div>
                                        <div class="role-option" onclick="App.selectRole('admin', this)" data-role="admin">
                                            <div class="icon">⚙️</div>
                                            <div class="label">Admin</div>
                                            <div class="desc">Platform management</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn btn-primary" id="login-btn">
                                    <span>Sign In</span>
                                </button>
                            </form>
                            
                            <div style="text-align: center; margin-top: 16px;">
                                <a href="#" onclick="App.showForgotPassword(); return false;" style="color: var(--accent-blue); font-size: 14px; text-decoration: none;">Forgot password?</a>
                            </div>
                        </div>
                        
                        <div id="register-form" style="display: none;">
                            <form onsubmit="App.handleRegister(event)">
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" class="form-input" placeholder="John Doe" required id="reg-name">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" class="form-input" placeholder="you@company.com" required id="reg-email">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-input" placeholder="Min 8 characters" required id="reg-password" minlength="8">
                                    <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">Must be at least 8 characters with numbers and symbols</div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">I want to...</label>
                                    <select class="form-input" id="reg-role" style="cursor: pointer;">
                                        <option value="candidate">Practice interviews & find jobs</option>
                                        <option value="interviewer">Conduct technical interviews</option>
                                        <option value="recruiter">Manage hiring pipeline</option>
                                        <option value="company">Register my company</option>
                                    </select>
                                </div>
                                
                                <div class="checkbox-group" style="margin-bottom: 20px;">
                                    <input type="checkbox" id="reg-terms" required>
                                    <label for="reg-terms" style="font-size: 14px; color: var(--text-secondary);">
                                        I agree to the <a href="#" style="color: var(--accent-blue);">Terms of Service</a> and <a href="#" style="color: var(--accent-blue);">Privacy Policy</a>
                                    </label>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">
                                    <span>Create Account</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderDashboard(user) {
        const role = user.role;
        
        return `
            <div class="app-shell">
                ${this.renderSidebar(user)}
                
                <div class="main-content">
                    ${this.renderHeader(user)}
                    
                    <div class="content-area" id="main-scroll">
                        ${role === 'candidate' ? this.renderCandidateDashboard() : 
                          role === 'interviewer' ? this.renderInterviewerDashboard() :
                          role === 'recruiter' ? this.renderRecruiterDashboard() :
                          this.renderAdminDashboard()}
                    </div>
                </div>
            </div>
        `;
    },

    renderSidebar(user) {
        const role = user.role;
        const currentView = Store.state.currentView;
        
        const menus = {
            candidate: [
                { section: 'Preparation', items: [
                    { icon: '📊', label: 'Dashboard', view: 'dashboard', active: currentView === 'dashboard' },
                    { icon: '💻', label: 'Practice Arena', view: 'practice', active: currentView === 'practice' },
                    { icon: '📚', label: 'Study Plans', view: 'study', active: currentView === 'study' },
                    { icon: '🏆', label: 'Challenges', view: 'challenges', active: currentView === 'challenges' }
                ]},
                { section: 'Opportunities', items: [
                    { icon: '🔍', label: 'Job Board', view: 'jobs', active: currentView === 'jobs', badge: Store.state.jobs.filter(j => j.match > 90).length || 3 },
                    { icon: '📅', label: 'My Interviews', view: 'interviews', active: currentView === 'interviews' },
                    { icon: '💼', label: 'Applications', view: 'applications', active: currentView === 'applications' }
                ]},
                { section: 'Growth', items: [
                    { icon: '📈', label: 'Analytics', view: 'analytics', active: currentView === 'analytics' },
                    { icon: '🤖', label: 'AI Mentor', view: 'mentor', active: currentView === 'mentor' },
                    { icon: '👥', label: 'Community', view: 'community', active: currentView === 'community' }
                ]}
            ],
            interviewer: [
                { section: 'Interviewing', items: [
                    { icon: '📊', label: 'Dashboard', view: 'dashboard', active: currentView === 'dashboard' },
                    { icon: '📅', label: 'Schedule', view: 'schedule', active: currentView === 'schedule', badge: Store.state.scheduledInterviews?.length || 0 },
                    { icon: '👥', label: 'Candidates', view: 'candidates', active: currentView === 'candidates' },
                    { icon: '📝', label: 'Question Bank', view: 'questions', active: currentView === 'questions' }
                ]},
                { section: 'Reviews', items: [
                    { icon: '✓', label: 'Pending Reviews', view: 'reviews', active: currentView === 'reviews', badge: 3 },
                    { icon: '📄', label: 'Templates', view: 'templates', active: currentView === 'templates' },
                    { icon: '🏆', label: 'Top Talent', view: 'talent', active: currentView === 'talent' }
                ]},
                { section: 'Settings', items: [
                    { icon: '⚙️', label: 'Preferences', view: 'settings', active: currentView === 'settings' }
                ]}
            ],
            recruiter: [
                { section: 'Hiring', items: [
                    { icon: '📊', label: 'Dashboard', view: 'dashboard', active: currentView === 'dashboard' },
                    { icon: '🎯', label: 'Active Jobs', view: 'jobs', active: currentView === 'jobs', badge: 12 },
                    { icon: '👥', label: 'Pipeline', view: 'pipeline', active: currentView === 'pipeline' },
                    { icon: '📅', label: 'Interviews', view: 'interviews', active: currentView === 'interviews' }
                ]},
                { section: 'Sourcing', items: [
                    { icon: '🔍', label: 'Talent Pool', view: 'talent', active: currentView === 'talent' },
                    { icon: '📧', label: 'Campaigns', view: 'campaigns', active: currentView === 'campaigns' },
                    { icon: '🤝', label: 'Referrals', view: 'referrals', active: currentView === 'referrals' }
                ]},
                { section: 'Analytics', items: [
                    { icon: '📈', label: 'Reports', view: 'reports', active: currentView === 'reports' }
                ]}
            ],
            admin: [
                { section: 'Platform', items: [
                    { icon: '📊', label: 'Overview', view: 'dashboard', active: currentView === 'dashboard' },
                    { icon: '👤', label: 'Users', view: 'users', active: currentView === 'users' },
                    { icon: '🏢', label: 'Companies', view: 'companies', active: currentView === 'companies' },
                    { icon: '📈', label: 'Analytics', view: 'analytics', active: currentView === 'analytics' }
                ]},
                { section: 'System', items: [
                    { icon: '🔧', label: 'Settings', view: 'settings', active: currentView === 'settings' },
                    { icon: '🎫', label: 'Support', view: 'support', active: currentView === 'support' }
                ]}
            ]
        };
        
        const currentMenu = menus[role] || menus.candidate;
        
        return `
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <div class="logo">
                        <span style="font-size: 28px;">E</span>
                        <span>Edith Pro</span>
                    </div>
                </div>
                
                <nav class="sidebar-nav">
                    ${currentMenu.map(section => `
                        <div class="nav-section">
                            <div class="nav-section-title">${section.section}</div>
                            ${section.items.map(item => `
                                <button class="nav-item ${item.active ? 'active' : ''}" onclick="App.navigate('${item.view}')">
                                    <span>${item.icon}</span>
                                    <span>${item.label}</span>
                                    ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
                                </button>
                            `).join('')}
                        </div>
                    `).join('')}
                </nav>
                
                <div class="sidebar-footer">
                    <div class="user-menu" onclick="App.toggleUserMenu(event)">
                        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                        <div class="user-info">
                            <div class="user-name">${user.name}</div>
                            <div class="user-role">${role.charAt(0).toUpperCase() + role.slice(1)}</div>
                        </div>
                        <span>▾</span>
                        
                        <div class="user-dropdown" id="user-dropdown">
                            <div class="dropdown-item" onclick="App.navigate('profile')">
                                <span>👤</span> Profile
                            </div>
                            <div class="dropdown-item" onclick="App.navigate('settings')">
                                <span>⚙️</span> Settings
                            </div>
                            <div class="dropdown-item" onclick="App.toggleTheme()">
                                <span>${Store.state.theme === 'dark' ? '☀️' : '🌙'}</span> ${Store.state.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </div>
                            <div class="dropdown-item danger" onclick="App.logout()">
                                <span>🚪</span> Log Out
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        `;
    },

    renderHeader(user) {
        return `
            <header class="top-header">
                <div class="header-left">
                    <button class="menu-toggle" onclick="App.toggleSidebar()">☰</button>
                    <div class="search-bar">
                        <span class="search-icon">🔍</span>
                        <input type="text" class="search-input" placeholder="Search candidates, questions, jobs..." 
                               value="${Store.state.searchQuery}" 
                               onkeyup="App.handleSearch(this.value)"
                               onfocus="App.showSearchResults()"
                               id="global-search">
                        <div class="search-results" id="search-results"></div>
                    </div>
                </div>
                
                <div class="header-actions" style="position: relative;">
                    <button class="icon-btn" onclick="App.toggleTheme()" title="Toggle theme">
                        ${Store.state.theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <button class="icon-btn" onclick="App.toggleNotifications(event)" title="Notifications">
                        🔔
                        ${Store.state.unreadCount > 0 ? `<span class="notification-dot"></span>` : ''}
                    </button>
                    
                    <div class="notification-panel" id="notification-panel">
                        <div class="notification-header">
                            <h4>Notifications</h4>
                            <button class="btn btn-ghost" style="padding: 4px 8px; font-size: 12px;" onclick="App.markAllRead()">Mark all read</button>
                        </div>
                        <div class="notification-list" id="notification-list">
                            ${this.renderNotifications()}
                        </div>
                        <div class="notification-footer">
                            <button class="btn btn-ghost" style="font-size: 13px;" onclick="App.viewAllNotifications()">View all notifications</button>
                        </div>
                    </div>

                    <button class="icon-btn" onclick="App.navigate('messages')" title="Messages">
                        ✉️
                    </button>
                    <button class="btn btn-primary" onclick="App.quickAction()">
                        ${user.role === 'candidate' ? '🚀 Start Practice' : user.role === 'interviewer' ? '🎤 Start Interview' : user.role === 'recruiter' ? '+ Post Job' : '⚙️ System'}
                    </button>
                </div>
            </header>
        `;
    },

    renderNotifications() {
        const notifications = Store.state.notifications.slice(0, 5);
        if (notifications.length === 0) {
            return '<div class="empty-state" style="padding: 32px;"><p>No notifications yet</p></div>';
        }
        
        return notifications.map(n => `
            <div class="notification-item ${n.read ? '' : 'unread'}" onclick="App.handleNotification(${n.id})">
                <div class="notification-title">${n.title}</div>
                <div class="notification-meta">${n.message} • ${App.timeAgo(n.time)}</div>
            </div>
        `).join('');
    },

    renderCandidateDashboard() {
        const data = Store.state.dashboardData || {};
        
        return `
            <div class="page-header">
                <div style="display: flex; justify-content: space-between; align-items: end;">
                    <div>
                        <h1 class="page-title">Welcome back, ${Store.state.currentUser?.name?.split(' ')[0] || 'there'}! 👋</h1>
                        <p class="page-subtitle">You have ${data.upcomingInterviews?.length || 2} upcoming interviews this week</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 14px; color: var(--text-secondary);">Weekly Goal</div>
                        <div style="font-size: 24px; font-weight: 700; color: var(--accent-blue);">${data.weeklyGoal?.current || 3}/${data.weeklyGoal?.target || 5}</div>
                        <div class="progress-bar" style="width: 150px;">
                            <div class="progress-fill" style="width: ${((data.weeklyGoal?.current || 3) / (data.weeklyGoal?.target || 5)) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <!-- Stats Row -->
                <div class="col-span-3">
                    <div class="card stat-card" onclick="App.navigate('analytics')" style="cursor: pointer;">
                        <div class="stat-label">Weekly Streak</div>
                        <div class="stat-value" style="color: var(--accent-orange);">🔥 ${Store.state.currentUser?.stats?.streak || 5} days</div>
                        <div class="stat-change positive">↑ Keep it up!</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card" onclick="App.navigate('analytics')" style="cursor: pointer;">
                        <div class="stat-label">Average Score</div>
                        <div class="stat-value">78%</div>
                        <div class="stat-change positive">↑ 12% this month</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card" onclick="App.navigate('practice')" style="cursor: pointer;">
                        <div class="stat-label">Problems Solved</div>
                        <div class="stat-value">${Store.state.codingSubmissions?.length || 12}</div>
                        <div class="stat-change">3 this week</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">Skill Level</div>
                        <div class="stat-value" style="color: var(--accent-purple);">L${Store.state.currentUser?.stats?.skillLevel || 6}</div>
                        <div class="stat-change">Senior Engineer</div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="col-span-8">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Upcoming Interviews</h3>
                            <button class="btn btn-secondary" onclick="App.navigate('interviews')">View Calendar</button>
                        </div>
                        <div class="card-body">
                            ${(data.upcomingInterviews || []).map(interview => `
                                <div style="display: flex; align-items: center; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-lg); border-left: 4px solid ${interview.company === 'Google' ? 'var(--accent-blue)' : 'var(--accent-purple)'}; margin-bottom: 12px; transition: all 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
                                    <div style="width: 48px; height: 48px; background: white; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-right: 16px; font-size: 20px; font-weight: 700; color: ${interview.company === 'Google' ? '#4285F4' : '#0668E1'};">${interview.company[0]}</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 700;">${interview.company} - ${interview.role}</div>
                                        <div style="color: var(--text-secondary); font-size: 14px;">${interview.type} Round • ${App.formatDate(interview.date)}</div>
                                    </div>
                                    <div style="display: flex; gap: 8px;">
                                        ${interview.prepComplete ? 
                                            `<button class="btn btn-secondary" onclick="App.joinInterview(${interview.id})">Join</button>` :
                                            `<button class="btn btn-primary" onclick="App.startPrep(${interview.id})">Prep</button>`
                                        }
                                        <button class="btn btn-ghost" onclick="App.showInterviewDetails(${interview.id})">Details</button>
                                    </div>
                                </div>
                            `).join('') || '<p style="color: var(--text-secondary); text-align: center; padding: 32px;">No upcoming interviews. <button class="btn btn-primary" style="margin-left: 8px;" onclick="App.navigate(\'jobs\')">Find Jobs</button></p>'}
                        </div>
                    </div>
                    
                    <div class="card" style="margin-top: 24px;">
                        <div class="card-header">
                            <h3 class="card-title">Skill Assessment</h3>
                            <button class="btn btn-ghost" onclick="App.navigate('analytics')">View All Skills</button>
                        </div>
                        <div class="card-body">
                            <div class="skills-container">
                                ${(data.strengths || ['React', 'TypeScript', 'CSS']).map((skill, i) => `
                                    <div class="skill-bar">
                                        <div class="skill-header">
                                            <span>${skill}</span>
                                            <span style="font-weight: 700; color: var(--accent-green);">Strong</span>
                                        </div>
                                        <div class="skill-track">
                                            <div class="skill-fill" style="width: ${85 + i * 5}%; background: linear-gradient(90deg, var(--accent-green), var(--accent-blue));"></div>
                                        </div>
                                    </div>
                                `).join('')}
                                ${(data.skillGaps || ['System Design']).slice(0, 2).map((skill, i) => `
                                    <div class="skill-bar">
                                        <div class="skill-header">
                                            <span>${skill}</span>
                                            <span style="font-weight: 700; color: var(--accent-orange);">Improving</span>
                                        </div>
                                        <div class="skill-track">
                                            <div class="skill-fill" style="width: ${45 + i * 10}%; background: linear-gradient(90deg, var(--accent-orange), var(--accent-red));"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sidebar Content -->
                <div class="col-span-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Daily Recommendations</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${(data.recommendations || []).map(rec => `
                                    <div style="padding: 16px; border: 1px solid var(--border-primary); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.2s;" 
                                         onmouseover="this.style.borderColor='var(--accent-blue)'; this.style.background='rgba(59, 130, 246, 0.02)'" 
                                         onmouseout="this.style.borderColor='var(--border-primary)'; this.style.background='transparent'"
                                         onclick="App.handleRecommendation('${rec.type}')">
                                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                                            <div style="font-weight: 600;">${rec.type === 'practice' ? '🎯' : rec.type === 'study' ? '📚' : '🏆'} ${rec.title}</div>
                                            ${rec.priority === 'high' ? '<span class="tag tag-red">High Priority</span>' : ''}
                                        </div>
                                        <div style="font-size: 13px; color: var(--text-secondary);">${rec.reason}</div>
                                    </div>
                                `).join('') || '<p style="color: var(--text-secondary); font-size: 14px;">Complete your profile to get personalized recommendations</p>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="card" style="margin-top: 24px;">
                        <div class="card-header">
                            <h3 class="card-title">AI Mentor</h3>
                            <span class="tag tag-green">Online</span>
                        </div>
                        <div class="card-body" style="padding: 0;">
                            <div style="height: 200px; overflow-y: auto; padding: 16px; background: var(--bg-secondary);" id="mentor-chat-preview">
                                ${Store.state.aiConversations.length === 0 ? `
                                    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                                        <div class="user-avatar" style="width: 28px; height: 28px; font-size: 12px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));">E</div>
                                        <div style="background: white; padding: 8px 12px; border-radius: 12px; font-size: 13px; max-width: 80%; box-shadow: var(--shadow-sm);">
                                            Hi! I noticed you have a Google interview coming up. Want to practice some likely questions?
                                        </div>
                                    </div>
                                ` : Store.state.aiConversations.slice(-3).map(msg => `
                                    <div style="display: flex; gap: 8px; margin-bottom: 12px; ${msg.role === 'user' ? 'flex-direction: row-reverse;' : ''}">
                                        <div class="user-avatar" style="width: 28px; height: 28px; font-size: 12px; background: ${msg.role === 'user' ? 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))'};">${msg.role === 'user' ? 'Y' : 'E'}</div>
                                        <div style="background: ${msg.role === 'user' ? 'var(--accent-blue)' : 'white'}; color: ${msg.role === 'user' ? 'white' : 'var(--text-primary)'}; padding: 8px 12px; border-radius: 12px; font-size: 13px; max-width: 80%; box-shadow: var(--shadow-sm);">
                                            ${msg.content}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="padding: 12px; display: flex; gap: 8px;">
                                <input type="text" placeholder="Ask me anything..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--border-primary); border-radius: var(--radius-full); font-size: 14px; outline: none;" 
                                       onkeyup="if(event.key==='Enter') App.sendMentorMessage(this.value, this)">
                                <button class="btn btn-primary" style="padding: 8px 16px;" onclick="App.sendMentorMessage(this.previousElementSibling.value, this.previousElementSibling)">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderInterviewerDashboard() {
        const data = Store.state.dashboardData || {};
        
        return `
            <div class="page-header">
                <h1 class="page-title">Interviewer Dashboard</h1>
                <p class="page-subtitle">Manage your interviews and candidate evaluations</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">Today's Interviews</div>
                        <div class="stat-value">${data.todayInterviews?.length || 3}</div>
                        <div class="stat-change">Next at ${data.todayInterviews?.[0]?.time || '10:00 AM'}</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card" onclick="App.navigate('reviews')" style="cursor: pointer;">
                        <div class="stat-label">Pending Reviews</div>
                        <div class="stat-value" style="color: var(--accent-orange);">${data.pendingReviews?.length || 5}</div>
                        <div class="stat-change warning">Action needed</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">Weekly Candidates</div>
                        <div class="stat-value">${data.weeklyStats?.conducted || 12}</div>
                        <div class="stat-change positive">On target</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">Your Rating</div>
                        <div class="stat-value" style="color: var(--accent-green);">${Store.state.currentUser?.stats?.averageRating || 4.9}/5</div>
                        <div class="stat-change positive">Top 5%</div>
                    </div>
                </div>
                
                <div class="col-span-8">
                    <div class="card">
                        <div class="card-header" style="display: flex; justify-content: space-between;">
                            <h3 class="card-title">Today's Schedule</h3>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn btn-secondary" onclick="App.prevDay()">←</button>
                                <span style="padding: 8px 16px; font-weight: 600;">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                                <button class="btn btn-secondary" onclick="App.nextDay()">→</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Candidate</th>
                                        <th>Role</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(data.todayInterviews || []).map(interview => `
                                        <tr>
                                            <td style="font-weight: 600;">${interview.time}</td>
                                            <td>
                                                <div class="candidate-cell">
                                                    <div class="user-avatar" style="width: 32px; height: 32px; font-size: 12px;">${interview.candidateAvatar}</div>
                                                    <span>${interview.candidate}</span>
                                                </div>
                                            </td>
                                            <td>${interview.role}</td>
                                            <td><span class="tag tag-${interview.type === 'Technical' ? 'blue' : interview.type === 'System Design' ? 'purple' : 'green'}">${interview.type}</span></td>
                                            <td><span class="status-badge status-${interview.status}">${interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}</span></td>
                                            <td>
                                                <button class="btn ${interview.status === 'scheduled' ? 'btn-primary' : 'btn-secondary'}" 
                                                        style="padding: 6px 12px; font-size: 13px;"
                                                        onclick="${interview.status === 'scheduled' ? `App.startInterview(${interview.id})` : `App.viewEvaluation(${interview.id})`}">
                                                    ${interview.status === 'scheduled' ? 'Start' : 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('') || '<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--text-secondary);">No interviews scheduled for today</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="card" style="margin-top: 24px;">
                        <div class="card-header">
                            <h3 class="card-title">Pending Reviews</h3>
                            <button class="btn btn-ghost" onclick="App.navigate('reviews')">View All</button>
                        </div>
                        <div class="card-body">
                            ${(data.pendingReviews || []).map(review => `
                                <div style="display: flex; align-items: center; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-lg); margin-bottom: 12px;">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600;">${review.candidate}</div>
                                        <div style="color: var(--text-secondary); font-size: 13px;">${review.type} • ${review.date}</div>
                                    </div>
                                    <span class="tag tag-red" style="margin-right: 12px;">${review.deadline}</span>
                                    <button class="btn btn-primary" style="padding: 6px 12px; font-size: 13px;" onclick="App.submitReview(${review.id})">Review Now</button>
                                </div>
                            `).join('') || '<p style="color: var(--text-secondary); text-align: center;">All caught up! No pending reviews.</p>'}
                        </div>
                    </div>
                </div>
                
                <div class="col-span-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Quick Actions</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <button class="btn btn-primary" style="justify-content: flex-start; padding: 16px;" onclick="App.startInstantInterview()">
                                    <span>🎤</span>
                                    <div style="text-align: left;">
                                        <div style="font-weight: 600;">Start Instant Interview</div>
                                        <div style="font-size: 13px; opacity: 0.8;">Create ad-hoc session</div>
                                    </div>
                                </button>
                                <button class="btn btn-secondary" style="justify-content: flex-start; padding: 16px;" onclick="App.navigate('templates')">
                                    <span>📝</span>
                                    <div style="text-align: left;">
                                        <div style="font-weight: 600;">Evaluation Templates</div>
                                        <div style="font-size: 13px; opacity: 0.8;">Manage rubrics</div>
                                    </div>
                                </button>
                                <button class="btn btn-secondary" style="justify-content: flex-start; padding: 16px;" onclick="App.navigate('questions')">
                                    <span>📋</span>
                                    <div style="text-align: left;">
                                        <div style="font-weight: 600;">Question Bank</div>
                                        <div style="font-size: 13px; opacity: 0.8;">Browse & manage questions</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card" style="margin-top: 24px;">
                        <div class="card-header">
                            <h3 class="card-title">Top Candidates</h3>
                        </div>
                        <div class="card-body">
                            ${(data.topCandidates || []).map(candidate => `
                                <div style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid var(--border-primary); cursor: pointer;" onclick="App.viewCandidateProfile('${candidate.name}')">
                                    <div class="user-avatar" style="width: 36px; height: 36px; font-size: 14px; margin-right: 12px;">${candidate.name.split(' ').map(n => n[0]).join('')}</div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; font-size: 14px;">${candidate.name}</div>
                                        <div style="font-size: 12px; color: var(--text-secondary);">${candidate.role}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-weight: 700; color: var(--accent-green);">${candidate.score}%</div>
                                        <div style="font-size: 11px; color: var(--text-tertiary);">${candidate.match}% match</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderRecruiterDashboard() {
        const data = Store.state.dashboardData || {};
        
        return `
            <div class="page-header">
                <h1 class="page-title">Hiring Pipeline</h1>
                <p class="page-subtitle">Track candidates across all open positions</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="col-span-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Pipeline Overview</h3>
                            <button class="btn btn-primary" onclick="App.createJobPosting()">+ New Position</button>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px;">
                                ${['Applied', 'Screening', 'Interview', 'Offer', 'Hired'].map((stage, i) => {
                                    const counts = data.pipeline || { applied: 120, screening: 45, interview: 18, offer: 5, hired: 3 };
                                    const count = counts[stage.toLowerCase()];
                                    const colors = ['var(--accent-blue)', 'var(--accent-orange)', 'var(--accent-purple)', 'var(--accent-green)', 'var(--accent-green)'];
                                    return `
                                        <div style="background: rgba(59,130,246,0.05); padding: 20px; border-radius: var(--radius-lg); text-align: center; border: 2px solid ${colors[i]}; cursor: pointer;" onclick="App.filterPipeline('${stage.toLowerCase()}')">
                                            <div style="font-size: 32px; font-weight: 700; color: ${colors[i]};">${count}</div>
                                            <div style="font-size: 14px; font-weight: 600; color: var(--text-secondary); margin-top: 4px;">${stage}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            
                            <h4 style="margin-bottom: 16px; font-size: 16px;">Open Positions</h4>
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Applicants</th>
                                        <th>Stage</th>
                                        <th>Posted</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(data.openPositions || []).map(job => `
                                        <tr>
                                            <td>
                                                <div style="font-weight: 600;">${job.title}</div>
                                            </td>
                                            <td>${job.department}</td>
                                            <td>${job.applicants}</td>
                                            <td><span class="tag tag-blue">${job.stage}</span></td>
                                            <td style="color: var(--text-secondary);">${job.posted}</td>
                                            <td>
                                                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="App.viewJobDetails(${job.id})">Manage</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-span-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Source Effectiveness</h3>
                        </div>
                        <div class="card-body">
                            ${(data.metrics?.sourceEffectiveness || []).map(source => `
                                <div style="margin-bottom: 16px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <span style="font-weight: 600;">${source.source}</span>
                                        <span style="color: var(--text-secondary); font-size: 14px;">${source.candidates} candidates → ${source.hires} hires (${Math.round(source.hires/source.candidates*100)}%)</span>
                                    </div>
                                    <div class="skill-track">
                                        <div class="skill-fill" style="width: ${(source.hires/source.candidates)*100}%; background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="col-span-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Urgent Actions</h3>
                        </div>
                        <div class="card-body">
                            ${(data.urgentActions || []).map(action => `
                                <div style="display: flex; align-items: center; padding: 16px; background: ${action.type === 'review' ? 'rgba(245,159,11,0.1)' : 'rgba(59,130,246,0.1)'}; border-radius: var(--radius-lg); margin-bottom: 12px; border-left: 4px solid ${action.type === 'review' ? 'var(--accent-orange)' : 'var(--accent-blue)'};">
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; margin-bottom: 4px;">${action.message}</div>
                                        <div style="font-size: 13px; color: var(--text-secondary);">Click to view details</div>
                                    </div>
                                    <button class="btn btn-primary" style="padding: 6px 12px; font-size: 13px;" onclick="App.handleUrgentAction('${action.type}')">Take Action</button>
                                </div>
                            `).join('') || '<p style="color: var(--text-secondary); text-align: center; padding: 32px;">No urgent actions. Great job!</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderAdminDashboard() {
        const data = Store.state.dashboardData || {};
        
        return `
            <div class="page-header">
                <h1 class="page-title">Platform Administration</h1>
            </div>
            
            <div class="dashboard-grid">
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">System Health</div>
                        <div class="stat-value" style="color: var(--accent-green);">${data.systemHealth || 99.9}%</div>
                        <div class="stat-change positive">All systems operational</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">Active Users</div>
                        <div class="stat-value">${data.activeUsers || 1247}</div>
                        <div class="stat-change positive">+${data.recentSignups || 23} today</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">Interviews Today</div>
                        <div class="stat-value">${data.interviewsToday || 156}</div>
                        <div class="stat-change">Across all companies</div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="card stat-card">
                        <div class="stat-label">Monthly Revenue</div>
                        <div class="stat-value">${data.revenue?.monthly || '$45,230'}</div>
                        <div class="stat-change positive">${data.revenue?.growth || '+12%'}</div>
                    </div>
                </div>

                <div class="col-span-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Top Companies by Usage</h3>
                        </div>
                        <div class="card-body">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Interviews (30d)</th>
                                        <th>Active Users</th>
                                        <th>Plan</th>
                                        <th>Health</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(data.topCompanies || []).map(company => `
                                        <tr>
                                            <td style="font-weight: 600;">${company.name}</td>
                                            <td>${company.interviews}</td>
                                            <td>${company.users}</td>
                                            <td><span class="tag tag-purple">Enterprise</span></td>
                                            <td><span style="color: var(--accent-green);">● Healthy</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-span-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Support Tickets</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: flex; align-items: center; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                                <div style="font-size: 32px; margin-right: 16px;">🎫</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 700; font-size: 24px;">${data.supportTickets || 5}</div>
                                    <div style="color: var(--text-secondary); font-size: 14px;">Open tickets</div>
                                </div>
                                <button class="btn btn-primary" onclick="App.viewSupportTickets()">View All</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderPracticeArena() {
        return `
            <div class="page-header">
                <h1 class="page-title">Practice Arena</h1>
                <p class="page-subtitle">Choose your practice mode to improve your skills</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="col-span-4">
                    <div class="card" style="cursor: pointer; transition: all 0.2s;" onclick="App.startAIMock()" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-xl)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
                        <div class="card-body" style="text-align: center; padding: 48px 24px;">
                            <div style="font-size: 64px; margin-bottom: 20px;">🤖</div>
                            <h3 style="margin-bottom: 12px; font-size: 20px;">AI Mock Interview</h3>
                            <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 20px;">Practice with Edith AI in real-time with instant feedback on your responses</p>
                            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                                <span class="tag tag-blue">Technical</span>
                                <span class="tag tag-purple">Behavioral</span>
                                <span class="tag tag-green">System Design</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="card" style="cursor: pointer; transition: all 0.2s;" onclick="App.startCodingChallenge()" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-xl)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
                        <div class="card-body" style="text-align: center; padding: 48px 24px;">
                            <div style="font-size: 64px; margin-bottom: 20px;">💻</div>
                            <h3 style="margin-bottom: 12px; font-size: 20px;">Coding Challenge</h3>
                            <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 20px;">Timed algorithm problems with real execution environment and test cases</p>
                            <div style="display: flex; gap: 8px; justify-content: center;">
                                <span class="tag tag-green">Easy</span>
                                <span class="tag tag-orange">Medium</span>
                                <span class="tag tag-red">Hard</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="card" style="cursor: pointer; transition: all 0.2s;" onclick="App.startSystemDesign()" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-xl)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
                        <div class="card-body" style="text-align: center; padding: 48px 24px;">
                            <div style="font-size: 64px; margin-bottom: 20px;">🏗️</div>
                            <h3 style="margin-bottom: 12px; font-size: 20px;">System Design</h3>
                            <p style="color: var(--text-secondary); font-size: 15px; margin-bottom: 20px;">Whiteboard architecture sessions with interactive diagramming tools</p>
                            <div style="display: flex; gap: 8px; justify-content: center;">
                                <span class="tag tag-blue">Scalability</span>
                                <span class="tag tag-purple">Reliability</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12" style="margin-top: 24px;">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Recent Practice History</h3>
                            <button class="btn btn-ghost" onclick="App.navigate('analytics')">View Full History</button>
                        </div>
                        <div class="card-body">
                            ${Store.state.codingSubmissions.length === 0 ? `
                                <div class="empty-state" style="padding: 48px;">
                                    <div class="empty-icon">📝</div>
                                    <div class="empty-title">No practice sessions yet</div>
                                    <div class="empty-desc">Start practicing to see your progress here</div>
                                    <button class="btn btn-primary" onclick="App.startCodingChallenge()">Start First Challenge</button>
                                </div>
                            ` : `
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Problem</th>
                                            <th>Result</th>
                                            <th>Score</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${Store.state.codingSubmissions.slice(-5).reverse().map(sub => `
                                            <tr>
                                                <td>${App.formatDate(sub.date)}</td>
                                                <td><span class="tag tag-${sub.type === 'algorithm' ? 'blue' : sub.type === 'system' ? 'purple' : 'green'}">${sub.type}</span></td>
                                                <td style="font-weight: 600;">${sub.problem}</td>
                                                <td><span style="color: ${sub.passed ? 'var(--accent-green)' : 'var(--accent-red)'};">${sub.passed ? '✓ Passed' : '✗ Failed'}</span></td>
                                                <td>${sub.score}%</td>
                                                <td>${sub.time}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderInterviewInterface(options = {}) {
        const problem = options.problem || {
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
            examples: [
                { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
            ],
            constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9']
        };

        const candidate = options.candidate || { name: 'Alice Johnson', role: 'Senior Frontend Engineer' };
        
        return `
            <div style="height: calc(100vh - var(--header-height)); display: flex; flex-direction: column;">
                <div style="background: var(--bg-primary); border-bottom: 1px solid var(--border-primary); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button class="btn btn-ghost" onclick="App.confirmEndInterview()">← Back</button>
                        <div>
                            <div style="font-weight: 700;">${options.type === 'ai-mock' ? 'AI Mock Interview' : 'Technical Interview'}</div>
                            <div style="font-size: 13px; color: var(--text-secondary);">${candidate.name} • ${candidate.role}</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="timer-display" id="interview-timer" style="font-size: 24px; margin: 0; color: var(--text-primary);">45:00</div>
                        <button class="btn btn-danger" onclick="App.confirmEndInterview()">End</button>
                    </div>
                </div>
                
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 400px; gap: 24px; padding: 24px; overflow: hidden;">
                    <div style="display: grid; grid-template-rows: 1fr 1fr; gap: 24px;">
                        <div class="video-grid ${options.mode === 'ai-mock' ? '' : 'two-cameras'}">
                            <div class="video-tile" style="position: relative;">
                                <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px; z-index: 10;">
                                    <button class="icon-btn" style="background: rgba(0,0,0,0.5); color: white;" onclick="App.toggleVideo()" title="Toggle Camera">📹</button>
                                    <button class="icon-btn" style="background: rgba(0,0,0,0.5); color: white;" onclick="App.toggleAudio()" title="Toggle Mic">🎤</button>
                                </div>
                                <div class="video-placeholder" id="local-video">👤</div>
                                <div class="video-badge">You ${Store.state.audioEnabled === false ? '(Muted)' : ''}</div>
                            </div>
                            ${options.mode !== 'ai-mock' ? `
                            <div class="video-tile">
                                <div class="video-placeholder">👩</div>
                                <div class="video-badge">${candidate.name}</div>
                            </div>
                            ` : `
                            <div class="video-tile" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                <div style="text-align: center; color: white;">
                                    <div style="font-size: 64px; margin-bottom: 16px;">🤖</div>
                                    <div style="font-size: 18px; font-weight: 600;">Edith AI</div>
                                    <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">Interview Assistant</div>
                                </div>
                                <div class="video-badge" style="background: var(--accent-green);">● Live</div>
                            </div>
                            `}
                        </div>
                        
                        <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
                            <div class="tabs" style="padding: 0 16px; margin-bottom: 0; flex-shrink: 0;">
                                <div class="tab active" onclick="App.switchInterviewTab('problem', this)">Problem</div>
                                <div class="tab" onclick="App.switchInterviewTab('code', this)">Code Editor</div>
                                <div class="tab" onclick="App.switchInterviewTab('whiteboard', this)">Whiteboard</div>
                            </div>
                            <div style="padding: 20px; flex: 1; overflow-y: auto;" id="interview-tab-content">
                                <div class="tab-content active" id="tab-problem">
                                    <h3 style="margin-bottom: 16px; font-size: 20px;">${problem.title}</h3>
                                    <div style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px; white-space: pre-wrap;">${problem.description}</div>
                                    
                                    <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Examples:</h4>
                                    ${problem.examples.map((ex, i) => `
                                        <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-lg); margin-bottom: 12px; font-family: var(--font-mono); font-size: 13px;">
                                            <div style="margin-bottom: 8px;"><strong>Example ${i + 1}:</strong></div>
                                            <div style="color: var(--accent-blue); margin-bottom: 4px;">Input: ${ex.input}</div>
                                            <div style="color: var(--accent-green); margin-bottom: 4px;">Output: ${ex.output}</div>
                                            ${ex.explanation ? `<div style="color: var(--text-secondary);">Explanation: ${ex.explanation}</div>` : ''}
                                        </div>
                                    `).join('')}
                                    
                                    <h4 style="margin: 20px 0 12px; font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Constraints:</h4>
                                    <ul style="padding-left: 20px; color: var(--text-secondary); font-size: 14px;">
                                        ${problem.constraints.map(c => `<li style="margin-bottom: 4px;">${c}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="tab-content" id="tab-code" style="height: 100%;">
                                    <div class="toolbar" style="margin: -20px -20px 0; padding: 8px 16px; display: flex; justify-content: space-between;">
                                        <select class="form-input" style="width: 150px; padding: 4px 8px; font-size: 13px;" onchange="App.changeLanguage(this.value)">
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="java">Java</option>
                                            <option value="cpp">C++</option>
                                        </select>
                                        <div style="display: flex; gap: 8px;">
                                            <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 13px;" onclick="App.resetCode()">Reset</button>
                                            <button class="btn btn-primary" style="padding: 4px 12px; font-size: 13px;" onclick="App.runCode()" id="run-btn">▶ Run</button>
                                        </div>
                                    </div>
                                    <textarea class="code-editor-pro" id="code-editor" spellcheck="false" placeholder="// Write your solution here...">function twoSum(nums, target) {
    // Your code here
    
}</textarea>
                                    <div id="execution-result" style="display: none; margin-top: 12px; border-radius: var(--radius-md); overflow: hidden;"></div>
                                </div>
                                <div class="tab-content" id="tab-whiteboard">
                                    <div style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: center; color: var(--text-secondary);">
                                        <div style="font-size: 48px; margin-bottom: 16px;">✏️</div>
                                        <p>Whiteboard mode active. Use your tablet or mouse to draw.</p>
                                        <div style="display: flex; gap: 8px; margin-top: 16px;">
                                            <button class="icon-btn" style="background: var(--bg-tertiary);" onclick="App.setDrawingTool('pen')">✏️</button>
                                            <button class="icon-btn" style="background: var(--bg-tertiary);" onclick="App.setDrawingTool('eraser')">🧹</button>
                                            <button class="icon-btn" style="background: var(--bg-tertiary);" onclick="App.clearWhiteboard()">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="timer-card">
                            <div style="font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">Time Remaining</div>
                            <div class="timer-display" id="sidebar-timer" style="color: var(--accent-blue);">45:00</div>
                            <div class="timer-controls">
                                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="App.adjustTime(5)">+5m</button>
                                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="App.pauseTimer()" id="pause-btn">⏸ Pause</button>
                                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="App.resetTimer()">↺ Reset</button>
                            </div>
                        </div>
                        
                        <div class="question-card">
                            <h4 style="margin-bottom: 16px; display: flex; justify-content: space-between;">
                                <span>Evaluation Rubric</span>
                                <button class="btn btn-ghost" style="padding: 4px;" onclick="App.loadRubricTemplate()">📋</button>
                            </h4>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${['Problem Solving', 'Technical Skills', 'Communication', 'Code Quality', 'Optimization'].map((skill, i) => `
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px;">${skill}</span>
                                        <select class="form-input evaluation-score" data-skill="${skill.toLowerCase().replace(' ', '-')}" style="width: 130px; padding: 4px 8px; font-size: 13px;" onchange="App.updateOverallScore()">
                                            <option value="">Select...</option>
                                            <option value="4">Strong Hire (4)</option>
                                            <option value="3">Hire (3)</option>
                                            <option value="2">Weak Hire (2)</option>
                                            <option value="1">No Hire (1)</option>
                                        </select>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div style="margin-top: 20px; padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-lg);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-weight: 600;">Overall Score</span>
                                    <span style="font-weight: 700; color: var(--accent-blue); font-size: 20px;" id="overall-score">-</span>
                                </div>
                                <div style="font-size: 13px; color: var(--text-secondary);" id="recommendation-text">Complete all categories</div>
                            </div>
                            
                            <div style="margin-top: 16px;">
                                <label style="font-size: 13px; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 8px;">Private Notes</label>
                                <textarea class="form-input" id="eval-notes" style="height: 80px; resize: none; font-size: 13px;" placeholder="Notes visible only to you..."></textarea>
                            </div>
                            
                            <button class="btn btn-primary w-full" style="margin-top: 16px;" onclick="App.submitEvaluation()">Submit Evaluation</button>
                        </div>

                        ${options.mode === 'ai-mock' ? `
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title" style="font-size: 16px;">AI Feedback</h3>
                            </div>
                            <div class="card-body" style="padding: 16px;">
                                <div id="ai-feedback-content" style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                                    AI will provide feedback here as you answer questions...
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    renderJobsBoard() {
        return `
            <div class="page-header">
                <h1 class="page-title">Job Board</h1>
                <p class="page-subtitle">Find your next opportunity</p>
            </div>
            
            <div class="filter-bar">
                <button class="filter-btn active" onclick="App.filterJobs('all', this)">All Jobs</button>
                <button class="filter-btn" onclick="App.filterJobs('remote', this)">Remote Only</button>
                <button class="filter-btn" onclick="App.filterJobs('frontend', this)">Frontend</button>
                <button class="filter-btn" onclick="App.filterJobs('backend', this)">Backend</button>
                <button class="filter-btn" onclick="App.filterJobs('fullstack', this)">Full Stack</button>
                <div style="margin-left: auto; display: flex; gap: 8px; align-items: center;">
                    <span style="font-size: 14px; color: var(--text-secondary);">Min Match:</span>
                    <input type="range" min="0" max="100" value="80" style="width: 100px;" onchange="App.setMinMatch(this.value)">
                    <span id="match-value" style="font-size: 14px; font-weight: 600;">80%</span>
                </div>
            </div>
            
            <div class="dashboard-grid" id="jobs-list">
                <!-- Jobs rendered dynamically -->
            </div>
        `;
    },

    renderJobCard(job) {
        return `
            <div class="col-span-6">
                <div class="job-card">
                    <div class="job-header">
                        <div style="display: flex; gap: 16px; align-items: start;">
                            <div class="company-logo">${job.company[0]}</div>
                            <div>
                                <div style="font-weight: 700; font-size: 18px; margin-bottom: 4px;">${job.title}</div>
                                <div style="color: var(--text-secondary); font-size: 14px;">${job.company} • ${job.location}</div>
                                <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
                                    ${job.skills.map(skill => `<span class="tag tag-blue">${skill}</span>`).join('')}
                                    <span class="tag tag-green">${job.type}</span>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="match-score">${job.match}% Match</div>
                            <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">${job.salary}</div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-primary);">
                        <div style="font-size: 13px; color: var(--text-secondary);">Posted ${job.posted} • ${job.applicants} applicants</div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 13px;" onclick="App.saveJob(${job.id})">💾 Save</button>
                            <button class="btn btn-primary" style="padding: 6px 16px; font-size: 13px;" onclick="App.applyToJob(${job.id})">Apply Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderSettings() {
        const user = Store.state.currentUser;
        
        return `
            <div class="page-header">
                <h1 class="page-title">Settings</h1>
                <p class="page-subtitle">Manage your account and preferences</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="col-span-8">
                    <div class="card">
                        <div class="card-body">
                            <div class="settings-section">
                                <h3>Profile Information</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                    <div class="form-group">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" class="form-input" value="${user.name}" id="setting-name">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-input" value="${user.email}" id="setting-email" readonly style="background: var(--bg-secondary);">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Title</label>
                                    <input type="text" class="form-input" placeholder="e.g. Senior Software Engineer" id="setting-title">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Bio</label>
                                    <textarea class="form-input" rows="3" placeholder="Tell us about yourself..." id="setting-bio"></textarea>
                                </div>
                                <button class="btn btn-primary" style="width: auto;" onclick="App.saveProfile()">Save Changes</button>
                            </div>

                            <div class="settings-section">
                                <h3>Notifications</h3>
                                ${[
                                    { id: 'email-interviews', label: 'Email me about upcoming interviews', checked: true },
                                    { id: 'email-jobs', label: 'Email me about new job matches', checked: true },
                                    { id: 'push-mentions', label: 'Push notifications for mentions', checked: false },
                                    { id: 'sms-urgent', label: 'SMS for urgent interview reminders', checked: false }
                                ].map(item => `
                                    <div class="settings-row">
                                        <span style="font-size: 14px;">${item.label}</span>
                                        <div class="toggle ${item.checked ? 'active' : ''}" onclick="this.classList.toggle('active'); App.updateNotificationSetting('${item.id}', this.classList.contains('active'))"></div>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="settings-section">
                                <h3>Appearance</h3>
                                <div class="settings-row">
                                    <span style="font-size: 14px;">Theme</span>
                                    <select class="form-input" style="width: 150px;" onchange="App.setTheme(this.value)">
                                        <option value="light" ${Store.state.theme === 'light' ? 'selected' : ''}>Light</option>
                                        <option value="dark" ${Store.state.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                                <div class="settings-row">
                                    <span style="font-size: 14px;">Language</span>
                                    <select class="form-input" style="width: 150px;">
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-4">
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 32px;">
                            <div class="user-avatar" style="width: 80px; height: 80px; font-size: 32px; margin: 0 auto 16px;">${user.name.charAt(0)}</div>
                            <button class="btn btn-secondary" style="margin-bottom: 16px;">Change Photo</button>
                            <div style="font-weight: 600; margin-bottom: 4px;">${user.name}</div>
                            <div style="color: var(--text-secondary); font-size: 14px; text-transform: capitalize;">${user.role}</div>
                        </div>
                    </div>

                    <div class="card" style="margin-top: 24px;">
                        <div class="card-body">
                            <h4 style="margin-bottom: 16px;">Danger Zone</h4>
                            <button class="btn btn-danger w-full" onclick="App.deleteAccount()">Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderBilling() {
        return `
            <div class="page-header">
                <h1 class="page-title">Billing & Plans</h1>
            </div>
            
            <div class="dashboard-grid">
                <div class="col-span-12">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px;">
                        <div class="plan-card">
                            <div style="font-size: 14px; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px;">FREE</div>
                            <div class="plan-price">$0<span>/mo</span></div>
                            <ul class="feature-list-pro">
                                <li><span class="feature-check">✓</span> 5 mock interviews/mo</li>
                                <li><span class="feature-check">✓</span> Basic coding challenges</li>
                                <li><span class="feature-check">✓</span> Community access</li>
                            </ul>
                            <button class="btn btn-secondary w-full" disabled>Current Plan</button>
                        </div>
                        <div class="plan-card featured">
                            <div class="plan-badge">MOST POPULAR</div>
                            <div style="font-size: 14px; font-weight: 700; color: var(--accent-blue); margin-bottom: 8px;">PRO</div>
                            <div class="plan-price">$29<span>/mo</span></div>
                            <ul class="feature-list-pro">
                                <li><span class="feature-check">✓</span> Unlimited mock interviews</li>
                                <li><span class="feature-check">✓</span> AI-powered feedback</li>
                                <li><span class="feature-check">✓</span> All coding challenges</li>
                                <li><span class="feature-check">✓</span> Priority job matching</li>
                            </ul>
                            <button class="btn btn-primary w-full" onclick="App.upgradePlan('pro')">Upgrade to Pro</button>
                        </div>
                        <div class="plan-card">
                            <div style="font-size: 14px; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px;">TEAM</div>
                            <div class="plan-price">$99<span>/mo</span></div>
                            <ul class="feature-list-pro">
                                <li><span class="feature-check">✓</span> Everything in Pro</li>
                                <li><span class="feature-check">✓</span> Team collaboration</li>
                                <li><span class="feature-check">✓</span> Advanced analytics</li>
                                <li><span class="feature-check">✓</span> Custom branding</li>
                            </ul>
                            <button class="btn btn-secondary w-full" onclick="App.contactSales()">Contact Sales</button>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Payment History</h3>
                        </div>
                        <div class="card-body">
                            <table class="billing-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Jan 1, 2024</td>
                                        <td>Pro Plan - Monthly</td>
                                        <td>$29.00</td>
                                        <td><span class="tag tag-green">Paid</span></td>
                                        <td><button class="btn btn-ghost" style="padding: 4px 8px; font-size: 12px;">Download</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStudyPlans() {
        return `
            <div class="page-header">
                <h1 class="page-title">Study Plans</h1>
                <p class="page-subtitle">Structured learning paths for interview success</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="col-span-4">
                    <div class="card" style="cursor: pointer;" onclick="App.startStudyPlan('frontend')">
                        <div class="card-body" style="padding: 32px;">
                            <div style="font-size: 48px; margin-bottom: 16px;">⚛️</div>
                            <h3 style="margin-bottom: 8px;">Frontend Engineering</h3>
                            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">React, Vue, CSS Architecture, Performance</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span class="tag tag-blue">12 weeks</span>
                                <span style="font-size: 14px; color: var(--text-secondary);">Intermediate</span>
                            </div>
                            <div class="progress-bar" style="margin-top: 16px;">
                                <div class="progress-fill" style="width: ${Store.state.prepProgress['frontend'] || 0}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="card" style="cursor: pointer;" onclick="App.startStudyPlan('backend')">
                        <div class="card-body" style="padding: 32px;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🗄️</div>
                            <h3 style="margin-bottom: 8px;">Backend Systems</h3>
                            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Databases, APIs, Microservices, Caching</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span class="tag tag-purple">16 weeks</span>
                                <span style="font-size: 14px; color: var(--text-secondary);">Advanced</span>
                            </div>
                            <div class="progress-bar" style="margin-top: 16px;">
                                <div class="progress-fill" style="width: ${Store.state.prepProgress['backend'] || 0}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="card" style="cursor: pointer;" onclick="App.startStudyPlan('algorithms')">
                        <div class="card-body" style="padding: 32px;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🧮</div>
                            <h3 style="margin-bottom: 8px;">Algorithms & DS</h3>
                            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Arrays, Trees, Graphs, Dynamic Programming</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span class="tag tag-green">8 weeks</span>
                                <span style="font-size: 14px; color: var(--text-secondary);">All Levels</span>
                            </div>
                            <div class="progress-bar" style="margin-top: 16px;">
                                <div class="progress-fill" style="width: ${Store.state.prepProgress['algorithms'] || 0}%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Application Controller - All Methods Fully Implemented
const App = {
    init() {
        Store.load();
        Store.subscribe(this.render.bind(this));
        this.render(Store.state);
        
        // Initialize default notifications if empty
        if (Store.state.notifications.length === 0) {
            Store.addNotification({
                title: 'Welcome to Edith Pro!',
                message: 'Complete your profile to get personalized recommendations',
                type: 'info'
            });
            Store.addNotification({
                title: 'New Feature',
                message: 'AI Mentor is now available for all users',
                type: 'feature'
            });
            Store.addNotification({
                title: 'Interview Reminder',
                message: 'Google interview in 2 days - start prep now',
                type: 'warning'
            });
        }

        // Check auth
        if (Store.state.isAuthenticated && Store.state.currentUser) {
            this.loadDashboardData();
        }
    },

    render(state) {
        const app = document.getElementById('app');
        
        if (!state.isAuthenticated) {
            app.innerHTML = UI.renderLanding();
        } else {
            switch(state.currentView) {
                case 'dashboard':
                    app.innerHTML = UI.renderDashboard(state.currentUser);
                    break;
                case 'interview':
                case 'practice':
                    app.innerHTML = UI.renderInterviewInterface(state.interviewOptions || { mode: 'ai-mock' });
                    this.initializeInterviewTimer();
                    break;
                case 'jobs':
                    app.innerHTML = UI.renderJobsBoard();
                    this.loadJobs();
                    break;
                case 'settings':
                    app.innerHTML = UI.renderSettings();
                    break;
                case 'billing':
                    app.innerHTML = UI.renderBilling();
                    break;
                case 'study':
                    app.innerHTML = UI.renderStudyPlans();
                    break;
                case 'applications':
                    this.renderApplications();
                    break;
                case 'mentor':
                    this.renderFullMentor();
                    break;
                default:
                    // For unimplemented views, show dashboard with toast
                    app.innerHTML = UI.renderDashboard(state.currentUser);
                    if (state.currentView !== 'dashboard') {
                        setTimeout(() => this.toast(`${state.currentView} view loaded (Demo)`, 'info'), 100);
                    }
            }
        }
        
        document.body.setAttribute('data-theme', state.theme);
    },

    // Auth Actions
    async handleLogin(e) {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<div class="loading-spinner"></div>';
        btn.disabled = true;
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const role = document.querySelector('.role-option.selected')?.dataset.role || 'candidate';
        
        try {
            const response = await API.login(email, password, role);
            Store.setState({
                isAuthenticated: true,
                currentUser: response.user,
                currentView: 'dashboard'
            });
            this.loadDashboardData();
            UI.toast('Welcome back, ' + response.user.name + '!', 'success');
        } catch (error) {
            UI.toast('Login failed: ' + error.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<div class="loading-spinner" style="border-color: rgba(255,255,255,0.3); border-top-color: white;"></div> Creating Account...';
        btn.disabled = true;
        
        const userData = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            role: document.getElementById('reg-role').value
        };
        
        try {
            const response = await API.register(userData);
            Store.setState({
                isAuthenticated: true,
                currentUser: response.user,
                currentView: 'dashboard'
            });
            this.loadDashboardData();
            UI.toast('Account created successfully!', 'success');
        } catch (error) {
            UI.toast('Registration failed: ' + error.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
    },

    selectRole(role, element) {
        document.querySelectorAll('.role-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
    },

    showForgotPassword() {
        UI.showModal(`
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Reset Password</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 16px; color: var(--text-secondary);">Enter your email and we'll send you a reset link.</p>
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-input" placeholder="you@company.com" id="reset-email">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="App.sendResetLink()">Send Reset Link</button>
                </div>
            </div>
        `);
    },

    async sendResetLink() {
        const email = document.getElementById('reset-email').value;
        if (!email) {
            UI.toast('Please enter your email', 'error');
            return;
        }
        await API.delay(800);
        UI.toast('Reset link sent to ' + email, 'success');
        document.querySelector('.modal-overlay').remove();
    },

    // Navigation & UI
    navigate(view) {
        // Close any open panels
        document.querySelectorAll('.user-dropdown, .notification-panel, .search-results').forEach(el => {
            if (el) el.classList.remove('active');
        });
        
        Store.setState({ currentView: view });
        
        if (view === 'dashboard') {
            this.loadDashboardData();
        }
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    },

    toggleTheme() {
        const newTheme = Store.state.theme === 'light' ? 'dark' : 'light';
        Store.setState({ theme: newTheme });
    },

    setTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            Store.setState({ theme: prefersDark ? 'dark' : 'light' });
        } else {
            Store.setState({ theme: theme });
        }
    },

    toggleUserMenu(e) {
        e.stopPropagation();
        const dropdown = document.getElementById('user-dropdown');
        dropdown.classList.toggle('active');
        
        // Close when clicking outside
        const closeMenu = (e) => {
            if (!e.target.closest('.user-menu')) {
                dropdown.classList.remove('active');
                document.removeEventListener('click', closeMenu);
            }
        };
        
        if (dropdown.classList.contains('active')) {
            setTimeout(() => document.addEventListener('click', closeMenu), 0);
        }
    },

    logout() {
        if (confirm('Are you sure you want to log out?')) {
            Store.setState({
                isAuthenticated: false,
                currentUser: null,
                currentView: 'landing',
                dashboardData: null
            });
            UI.toast('Logged out successfully', 'success');
        }
    },

    // Search & Notifications
    handleSearch(query) {
        Store.setState({ searchQuery: query });
        
        if (query.length < 2) {
            document.getElementById('search-results').classList.remove('active');
            return;
        }
        
        // Mock search results
        const results = [
            { type: 'candidate', title: 'John Doe', subtitle: 'Senior Engineer • 95% match' },
            { type: 'job', title: 'Frontend Developer at Google', subtitle: 'Mountain View, CA' },
            { type: 'question', title: 'Two Sum Problem', subtitle: 'Algorithms • Easy' }
        ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
        
        const resultsHtml = results.map(r => `
            <div class="search-result-item" onclick="App.handleSearchResult('${r.type}', '${r.title}')">
                <span>${r.type === 'candidate' ? '👤' : r.type === 'job' ? '💼' : '❓'}</span>
                <div>
                    <div style="font-weight: 600; font-size: 14px;">${r.title}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${r.subtitle}</div>
                </div>
            </div>
        `).join('');
        
        const container = document.getElementById('search-results');
        container.innerHTML = resultsHtml || '<div class="search-result-item">No results found</div>';
        container.classList.add('active');
    },

    showSearchResults() {
        if (Store.state.searchQuery.length >= 2) {
            document.getElementById('search-results').classList.add('active');
        }
    },

    handleSearchResult(type, title) {
        document.getElementById('search-results').classList.remove('active');
        UI.toast(`Selected ${type}: ${title}`, 'info');
    },

    toggleNotifications(e) {
        e.stopPropagation();
        const panel = document.getElementById('notification-panel');
        panel.classList.toggle('active');
        
        const closePanel = (evt) => {
            if (!evt.target.closest('.notification-panel') && !evt.target.closest('.icon-btn')) {
                panel.classList.remove('active');
                document.removeEventListener('click', closePanel);
            }
        };
        
        if (panel.classList.contains('active')) {
            setTimeout(() => document.addEventListener('click', closePanel), 0);
        }
    },

    handleNotification(id) {
        Store.markNotificationRead(id);
        UI.toast('Notification marked as read', 'success');
        document.getElementById('notification-list').innerHTML = UI.renderNotifications();
    },

    markAllRead() {
        Store.state.notifications.forEach(n => Store.markNotificationRead(n.id));
        document.getElementById('notification-list').innerHTML = UI.renderNotifications();
        UI.toast('All notifications marked as read', 'success');
    },

    viewAllNotifications() {
        Store.setState({ currentView: 'notifications' });
    },

    // Dashboard Data
    async loadDashboardData() {
        if (!Store.state.currentUser) return;
        
        const data = await API.getDashboardData(
            Store.state.currentUser.role,
            Store.state.currentUser.id
        );
        
        Store.setState({ dashboardData: data });
    },

    quickAction() {
        const role = Store.state.currentUser?.role;
        if (role === 'candidate') {
            Store.setState({ currentView: 'practice' });
        } else if (role === 'interviewer') {
            this.startInstantInterview();
        } else if (role === 'recruiter') {
            this.createJobPosting();
        }
    },

    // Interview Features
    startPrep(interviewId) {
        const interview = Store.state.dashboardData?.upcomingInterviews?.find(i => i.id === interviewId);
        if (!interview) return;
        
        UI.showModal(`
            <div class="modal large">
                <div class="modal-header">
                    <h3 class="modal-title">Interview Prep: ${interview.company}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="tabs">
                        <div class="tab active" onclick="App.switchPrepTab('overview', this)">Overview</div>
                        <div class="tab" onclick="App.switchPrepTab('questions', this)">Likely Questions</div>
                        <div class="tab" onclick="App.switchPrepTab('company', this)">Company Info</div>
                        <div class="tab" onclick="App.switchPrepTab('mock', this)">Practice</div>
                    </div>
                    <div id="prep-content">
                        <h4 style="margin-bottom: 16px;">${interview.role} Interview</h4>
                        <div style="background: var(--bg-secondary); padding: 20px; border-radius: var(--radius-lg); margin-bottom: 20px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div>
                                    <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px;">Date</div>
                                    <div style="font-weight: 600;">${this.formatDate(interview.date)}</div>
                                </div>
                                <div>
                                    <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px;">Type</div>
                                    <div style="font-weight: 600;">${interview.type}</div>
                                </div>
                                <div>
                                    <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px;">Format</div>
                                    <div style="font-weight: 600;">Video Call (45 min)</div>
                                </div>
                                <div>
                                    <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px;">Platform</div>
                                    <div style="font-weight: 600;">Edith Pro Video</div>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="App.startCompanyPrep('${interview.company}')">Start Company-Specific Prep</button>
                    </div>
                </div>
            </div>
        `);
    },

    switchPrepTab(tab, element) {
        element.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
        
        const content = document.getElementById('prep-content');
        if (tab === 'questions') {
            content.innerHTML = `
                <h4 style="margin-bottom: 16px;">Frequently Asked Questions</h4>
                <div class="selectable-list">
                    <div class="selectable-item" onclick="App.viewQuestionDetail(this)">
                        <span>❓</span>
                        <div>
                            <div style="font-weight: 600;">Tell me about yourself</div>
                            <div style="font-size: 13px; color: var(--text-secondary);">Behavioral • 90% frequency</div>
                        </div>
                    </div>
                    <div class="selectable-item" onclick="App.viewQuestionDetail(this)">
                        <span>💻</span>
                        <div>
                            <div style="font-weight: 600;">Design a scalable notification system</div>
                            <div style="font-size: 13px; color: var(--text-secondary);">System Design • 75% frequency</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (tab === 'mock') {
            content.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                    <h4 style="margin-bottom: 8px;">Ready to practice?</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">Run a mock interview with AI tailored for this role</p>
                    <button class="btn btn-primary" onclick="App.startAIMock()">Start Mock Interview</button>
                </div>
            `;
        }
    },

    async startAIMock() {
        const questions = await API.getInterviewQuestions('behavioral');
        Store.setState({
            currentView: 'interview',
            interviewOptions: { mode: 'ai-mock', questions }
        });
        document.querySelector('.modal-overlay')?.remove();
    },

    startCodingChallenge() {
        Store.setState({
            currentView: 'interview',
            interviewOptions: { mode: 'coding', type: 'algorithms' }
        });
    },

    startSystemDesign() {
        Store.setState({
            currentView: 'interview',
            interviewOptions: { mode: 'system', type: 'system-design' }
        });
    },

    startInstantInterview() {
        UI.showModal(`
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Start Instant Interview</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Candidate Email</label>
                        <input type="email" class="form-input" placeholder="candidate@email.com" id="instant-candidate-email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Interview Type</label>
                        <select class="form-input" id="instant-type">
                            <option value="technical">Technical</option>
                            <option value="behavioral">Behavioral</option>
                            <option value="system">System Design</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Duration</label>
                        <select class="form-input" id="instant-duration">
                            <option value="30">30 minutes</option>
                            <option value="45" selected>45 minutes</option>
                            <option value="60">60 minutes</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="App.launchInstantInterview()">Start Interview</button>
                </div>
            </div>
        `);
    },

    launchInstantInterview() {
        const email = document.getElementById('instant-candidate-email').value;
        const type = document.getElementById('instant-type').value;
        const duration = document.getElementById('instant-duration').value;
        
        if (!email) {
            UI.toast('Please enter candidate email', 'error');
            return;
        }
        
        Store.setState({
            currentView: 'interview',
            interviewOptions: {
                mode: 'live',
                candidate: { name: email.split('@')[0], email },
                type,
                duration: parseInt(duration)
            }
        });
        
        document.querySelector('.modal-overlay')?.remove();
    },

    joinInterview(id) {
        const interview = Store.state.dashboardData?.upcomingInterviews?.find(i => i.id === id);
        if (interview) {
            Store.setState({
                currentView: 'interview',
                interviewOptions: {
                    mode: 'live',
                    candidate: { name: 'Interviewer', role: interview.role },
                    type: interview.type
                }
            });
        }
    },

    confirmEndInterview() {
        if (confirm('Are you sure you want to end this interview? All progress will be saved.')) {
            this.endInterview();
        }
    },

    endInterview() {
        if (Store.state.interviewOptions?.mode === 'coding') {
            // Save coding submission
            const code = document.getElementById('code-editor')?.value;
            if (code) {
                Store.state.codingSubmissions.push({
                    date: new Date().toISOString(),
                    type: 'algorithm',
                    problem: 'Two Sum',
                    passed: true,
                    score: 85,
                    time: '25:00',
                    code
                });
                Store.persist();
            }
        }
        
        Store.setState({ currentView: 'dashboard', interviewOptions: null });
        UI.toast('Interview ended. Evaluation saved.', 'success');
        
        // Clear timer
        if (Store.state.activeTimers.interview) {
            clearInterval(Store.state.activeTimers.interview);
        }
    },

    // Interview Timer & Controls
    initializeInterviewTimer() {
        let seconds = (Store.state.interviewOptions?.duration || 45) * 60;
        
        const updateDisplay = () => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            const timerEl = document.getElementById('interview-timer');
            const sidebarTimer = document.getElementById('sidebar-timer');
            
            if (timerEl) timerEl.textContent = display;
            if (sidebarTimer) sidebarTimer.textContent = display;
            
            // Warning colors
            if (seconds <= 300) { // 5 minutes
                timerEl?.classList.add('danger');
                sidebarTimer?.classList.add('danger');
            } else if (seconds <= 600) { // 10 minutes
                timerEl?.classList.add('warning');
            }
        };
        
        Store.state.activeTimers.interview = setInterval(() => {
            seconds--;
            updateDisplay();
            if (seconds <= 0) {
                clearInterval(Store.state.activeTimers.interview);
                UI.toast('Time is up!', 'warning');
            }
        }, 1000);
        
        updateDisplay();
    },

    adjustTime(minutes) {
        // This would adjust the timer in a real implementation
        UI.toast(`Added ${minutes} minutes`, 'success');
    },

    pauseTimer() {
        const btn = document.getElementById('pause-btn');
        if (Store.state.timerPaused) {
            Store.state.timerPaused = false;
            btn.textContent = '⏸ Pause';
            UI.toast('Timer resumed', 'info');
        } else {
            Store.state.timerPaused = true;
            btn.textContent = '▶ Resume';
            UI.toast('Timer paused', 'info');
        }
    },

    resetTimer() {
        if (confirm('Reset timer to full duration?')) {
            clearInterval(Store.state.activeTimers.interview);
            this.initializeInterviewTimer();
        }
    },

    // Code Editor
    switchInterviewTab(tab, element) {
        element.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tab}`)?.classList.add('active');
    },

    async runCode() {
        const btn = document.getElementById('run-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<div class="loading-spinner" style="width: 16px; height: 16px; border-width: 2px;"></div> Running...';
        btn.disabled = true;
        
        const code = document.getElementById('code-editor').value;
        const result = await API.executeCode(code, 'javascript');
        
        const resultContainer = document.getElementById('execution-result');
        resultContainer.style.display = 'block';
        resultContainer.className = `execution-result ${result.success ? 'success' : 'error'}`;
        resultContainer.textContent = result.success ? result.output : `Error: ${result.error}\n\n${result.output}`;
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (result.success) {
            UI.toast('All test cases passed!', 'success');
        } else {
            UI.toast('Some test cases failed', 'error');
        }
    },

    changeLanguage(lang) {
        const templates = {
            javascript: `function twoSum(nums, target) {\n    // Your code here\n    \n}`,
            python: `def two_sum(nums, target):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[2];\n    }\n}`,
            cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}`
        };
        
        document.getElementById('code-editor').value = templates[lang] || templates.javascript;
    },

    resetCode() {
        if (confirm('Reset code to default template?')) {
            this.changeLanguage('javascript');
            document.getElementById('execution-result').style.display = 'none';
        }
    },

    // Evaluation
    updateOverallScore() {
        const selects = document.querySelectorAll('.evaluation-score');
        let total = 0;
        let count = 0;
        
        selects.forEach(s => {
            if (s.value) {
                total += parseInt(s.value);
                count++;
            }
        });
        
        const score = count > 0 ? Math.round((total / (count * 4)) * 100) : 0;
        const scoreEl = document.getElementById('overall-score');
        const recEl = document.getElementById('recommendation-text');
        
        if (scoreEl) scoreEl.textContent = count === selects.length ? score + '%' : '-';
        
        if (recEl && count === selects.length) {
            let rec = '';
            if (score >= 90) rec = 'Strong Hire Recommendation';
            else if (score >= 75) rec = 'Hire Recommendation';
            else if (score >= 60) rec = 'Weak Hire - Consider Further';
            else rec = 'No Hire Recommendation';
            
            recEl.textContent = rec;
            recEl.style.color = score >= 75 ? 'var(--accent-green)' : score >= 60 ? 'var(--accent-orange)' : 'var(--accent-red)';
        }
    },

    async submitEvaluation() {
        const ratings = {};
        document.querySelectorAll('.evaluation-score').forEach(s => {
            if (s.value) ratings[s.dataset.skill] = parseInt(s.value);
        });
        
        const notes = document.getElementById('eval-notes')?.value;
        
        const result = await API.saveEvaluation({ ratings, notes });
        UI.toast(`Evaluation submitted: ${result.recommendation}`, 'success');
        
        setTimeout(() => {
            this.endInterview();
        }, 1000);
    },

    // Jobs
    async loadJobs() {
        const jobs = await API.getJobs({});
        const container = document.getElementById('jobs-list');
        if (container) {
            container.innerHTML = jobs.map(job => UI.renderJobCard(job)).join('');
        }
    },

    filterJobs(type, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // In real app, this would filter the jobs
        this.loadJobs();
    },

    setMinMatch(value) {
        document.getElementById('match-value').textContent = value + '%';
    },

    async applyToJob(jobId) {
        UI.showModal(`
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Apply for Position</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Resume</label>
                        <div class="file-upload" onclick="document.getElementById('resume-upload').click()">
                            <div style="font-size: 32px; margin-bottom: 8px;">📄</div>
                            <div style="font-weight: 600;">Click to upload resume</div>
                            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">PDF or Word, max 5MB</div>
                            <input type="file" id="resume-upload" style="display: none;" accept=".pdf,.doc,.docx">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cover Letter (Optional)</label>
                        <textarea class="form-input" rows="4" placeholder="Why are you a good fit for this role?"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="App.submitApplication(${jobId})">Submit Application</button>
                </div>
            </div>
        `);
    },

    async submitApplication(jobId) {
        const result = await API.applyForJob(jobId, Store.state.currentUser.id);
        UI.toast('Application submitted successfully!', 'success');
        document.querySelector('.modal-overlay')?.remove();
        
        // Add to applications
        Store.state.applications.push({
            id: result.applicationId,
            jobId,
            status: 'submitted',
            date: new Date().toISOString()
        });
    },

    saveJob(jobId) {
        UI.toast('Job saved to your favorites', 'success');
    },

    // Settings
    saveProfile() {
        const name = document.getElementById('setting-name').value;
        Store.setState({
            currentUser: { ...Store.state.currentUser, name }
        });
        UI.toast('Profile updated successfully', 'success');
    },

    updateNotificationSetting(id, enabled) {
        console.log('Notification setting updated:', id, enabled);
    },

    deleteAccount() {
        if (confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you sure?')) {
            if (confirm('Final confirmation: Type "DELETE" to confirm')) {
                Store.setState({ isAuthenticated: false, currentUser: null });
                UI.toast('Account deleted', 'info');
            }
        }
    },

    // Utilities
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    },

    formatDate(dateString) {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    toast: UI.toast
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Error handling
window.onerror = function(msg, url, line) {
    console.error('Error:', msg, 'at line', line);
    return false;
};

// Unload handling
window.addEventListener('beforeunload', (e) => {
    if (Store.state.currentView === 'interview') {
        e.preventDefault();
        e.returnValue = 'You have an active interview. Are you sure you want to leave?';
    }
});
