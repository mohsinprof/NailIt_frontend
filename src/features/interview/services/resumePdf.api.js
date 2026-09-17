import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

export const downloadTailoredResumePdf = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}/resume-pdf`, {
        responseType: 'blob',
    });

    return response;
};