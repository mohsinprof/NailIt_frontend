import axios from 'axios';

const api = axios.create({
    baseURL: 'https://150.136.170.112.sslip.io',
    withCredentials: true,
});

export const downloadTailoredResumePdf = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}/resume-pdf`, {
        responseType: 'blob',
    });

    return response;
};