import { useContext } from 'react';
import { InterviewContext } from '../../interview.context';
import { generateInterviewReport,deleteInterviewReport, getAllInterviewReports, getInterviewReportById } from '../services/interview.api';

export const useInterview = () => {
  // ONE shared state from the provider in Layout.jsx — not local useState
  const { reports, setReports, report, setReport, isLoading, setLoading, error, setError } = useContext(InterviewContext);

  const generateReport = async ({ jobDescription, selfDescription, resume }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resume });
      const newReport = response.data;   // api returns the body: { message, data }
      setReport(newReport);              // Interview page renders instantly after navigate()
      setReports(prev => [newReport, ...(Array.isArray(prev) ? prev : [])]); // newest first in history
      return newReport;
    } catch (err) {
      console.error("Failed to generate interview report:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    if (!interviewId) return null;
    setLoading(true);
    setError(null);
    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.data);          // <- setReport (single), NOT setReports (array)
      return response.data;
    } catch (err) {
      console.error("Failed to fetch interview report:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllInterviewReports();
      setReports(Array.isArray(response.data) ? response.data : []);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch interview reports:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
    // === DELETE REPORT - START ===
  const deleteReport = async (interviewId) => {
    try {
      await deleteInterviewReport(interviewId);
      // Remove instantly from the Home list - no refetch needed
      setReports(prev => (Array.isArray(prev) ? prev.filter(r => r._id !== interviewId) : []));
      return true;
    } catch (err) {
      console.error("Failed to delete interview report:", err);
      setError(err);
      return false;
    }
  };
  // === DELETE REPORT - END ===


  return { reports, report, generateReport,deleteReport, getReportById, getAllReports, isLoading, error };
};
