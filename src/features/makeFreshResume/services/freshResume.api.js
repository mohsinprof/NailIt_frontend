// frontend: src/services/freshResume.api.js
import axios from 'axios';

// 1. Create the exact same Axios instance with withCredentials: true
const api = axios.create({
    baseURL: "import.meta.env.VITE_API_URL || http://localhost:3000",
    withCredentials: true
});

export const generateFreshResume = async (resumeData, uploadedPdf) => {
    const formData = new FormData();
    
    // Append the JSON data
    formData.append('resumeFormData', JSON.stringify(resumeData));
    
    // Append the PDF if it exists
    if (uploadedPdf) {
        formData.append('resumePdf', uploadedPdf);
    }

    try {
        // 2. Use the 'api' instance, and DON'T add any Authorization headers!
        // The cookie will attach itself automatically.
        const response = await api.post('/api/makeFreshResume/generate', formData, {
            responseType: 'blob' // Required to receive the PDF file back
        });
        return response.data;
    } catch (error) {
        console.error('Error generating fresh resume:', error);
        throw error;
    }
};