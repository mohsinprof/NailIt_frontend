import axios from 'axios';

const api = axios.create({
    baseURL: 'import.meta.env.VITE_API_URL || http://localhost:3000',
    withCredentials: true,
});

export const downloadTailoredResumePdf = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}/resume-pdf`, {
        responseType: 'blob',
    });

    return response;
};