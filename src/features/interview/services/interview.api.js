import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true
});

/**
 * @description controller to generate the interview report.
 * @param {Object} params - The parameters for generating the interview report.
 * @param {string} params.resume - The resume content.
 * @param {string} params.selfDescription - The self-description content.
 * @param {string} params.jobDescription - The job description content.
 * @returns {Promise<Object>} - The generated interview report data.
 */

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('selfDescription', selfDescription);
    formData.append('jobDescription', jobDescription);

    // Let the browser set the multipart boundary so multer can read the file payload correctly.
    const response = await api.post('/api/interview', formData);
    return response.data;

}


/**
 * @description controller to get the interview report by its ID.
 */

export const getInterviewReportById = async (interviewId) => { 
    const response = await api.get(`/api/interview/${interviewId}`);
    return response.data;
}
/**
 * @description controller to get all interview reports.
 */

export const getAllInterviewReports = async() => {
    const response =  await api.get('/api/interview');
    return response.data;
}


// === DELETE REPORT - START (delete these blocks to remove the feature) ===
export const deleteInterviewReport = async (interviewId) => {
    const response = await api.delete(`/api/interview/${interviewId}`);
    return response.data;
};
// === DELETE REPORT - END ===
