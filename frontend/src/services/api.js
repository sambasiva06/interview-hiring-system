import axios from 'axios';

const api = axios.create({
    baseURL: '', // Using proxy
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        let message = 'Something went wrong';
        if (error.response && error.response.data) {
            // Check for our standard {message: "..."}
            if (typeof error.response.data.message === 'string') {
                message = error.response.data.message;
            }
            // Fallback to {error: "..."} which Spring sometimes uses
            else if (typeof error.response.data.error === 'string') {
                message = error.response.data.error;
            }
            // Fallback to raw string
            else if (typeof error.response.data === 'string') {
                message = error.response.data;
            }
        } else if (error.message) {
            message = error.message;
        }

        console.error('API Error:', message);
        return Promise.reject(message);
    }
);

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
};

export const jobService = {
    getAllOpen: () => api.get('/jobs'),
    create: (data, recruiterId) => api.post(`/jobs?recruiterId=${recruiterId}`, data),
    update: (id, data, recruiterId) => api.put(`/jobs/${id}?userId=${recruiterId}`, data),
    close: (id, recruiterId) => api.patch(`/jobs/${id}/close?userId=${recruiterId}`),
    apply: (jobId, candidateId) => api.post(`/jobs/${jobId}/apply?candidateId=${candidateId}`),
    getMyApplications: (candidateId) => api.get(`/applications/me?candidateId=${candidateId}`),
    getApplicationsForJob: (jobId, requesterId) => api.get(`/jobs/${jobId}/applications?requesterId=${requesterId}`),
    withdraw: (appId, candidateId) => api.patch(`/applications/${appId}/withdraw?candidateId=${candidateId}`),
    reject: (appId, recruiterId) => api.patch(`/applications/${appId}/reject?recruiterId=${recruiterId}`),
    getHistory: (appId) => api.get(`/applications/${appId}/history`),
};

export const interviewService = {
    schedule: (data, recruiterId) => api.post(`/interviews?recruiterId=${recruiterId}`, data),
    getByInterviewer: (interviewerId) => api.get(`/interviews/interviewer/${interviewerId}`),
    updateStatus: (id, status) => api.patch(`/interviews/${id}/status?status=${status}`),
    getForApplication: (appId) => api.get(`/interviews/application/${appId}`),
};

export const dashboardService = {
    getRecruiterStats: (recruiterId) => api.get(`/dashboard/recruiter-stats?recruiterId=${recruiterId}`),
};

export const evaluationService = {
    evaluate: (data, interviewerId) => api.post(`/evaluations?interviewerId=${interviewerId}`, data),
};

export const userService = {
    getInterviewers: () => api.get('/users/interviewers'),
};

export default api;

