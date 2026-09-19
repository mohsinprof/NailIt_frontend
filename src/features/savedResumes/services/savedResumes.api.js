import axios from 'axios';

const api = axios.create({
    baseURL: 'https://150.136.170.112.sslip.io',
    withCredentials: true,
});

export const getSavedResumes = async () => {
    const response = await api.get('/api/saved-resumes');
    return response.data; // { resumes, limit }
};

export const saveResume = async (pdfBlobOrFile, source = 'upload') => {
    const formData = new FormData();
    formData.append('resumeFile', pdfBlobOrFile);
    formData.append('source', source);
    const response = await api.post('/api/saved-resumes', formData);
    return response.data;
};

export const replaceSavedResume = async (id, pdfBlobOrFile, source = 'upload') => {
    const formData = new FormData();
    formData.append('resumeFile', pdfBlobOrFile);
    formData.append('source', source);
    const response = await api.post(`/api/saved-resumes/${id}/replace`, formData);
    return response.data;
};

export const downloadSavedResume = async (id) => {
    const response = await api.get(`/api/saved-resumes/${id}/download`, {
        responseType: 'blob',
    });
    return response;
};

export const deleteSavedResume = async (id) => {
    const response = await api.delete(`/api/saved-resumes/${id}`);
    return response.data;
};

export const isLimitReachedError = (error) => {
    return error?.response?.status === 409 || error?.response?.data?.code === 'LIMIT_REACHED';
};
export const getLimitReachedResumes = (error) => {
    const data = error?.response?.data;
    if (error?.response?.status === 409 || data?.code === 'LIMIT_REACHED') {
        return Array.isArray(data?.resumes) ? data.resumes : [];
    }
    return null;
};

