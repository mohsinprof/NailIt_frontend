import { useState } from "react";
import { createContext } from "react";


export const InterviewContext = createContext(null)


export const InterviewProvider = ({ children }) => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [report, setReport] = useState(null)      // single report (Interview page)
    const [reports, setReports] = useState([])      // history list (Home page)
    return (
        <InterviewContext.Provider value={{ isLoading, setLoading, error, setError, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    )}
