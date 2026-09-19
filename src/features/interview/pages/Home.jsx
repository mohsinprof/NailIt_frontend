import React, { useEffect, useState, useRef } from 'react'
import { FileText, UploadCloud, User, Sparkles, Info, CheckCircle2, FileDown } from 'lucide-react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview.js'

import { useNavigate, Link } from 'react-router-dom'
import Loading from '../../auth/pages/Loading'
import Collapsible from '../../auth/components/Collapsible'
// === DELETE REPORT - START (delete these blocks to remove the feature) ===
import { X } from 'lucide-react'
// === DELETE REPORT - END ===

// === SAVED RESUMES FEATURE - START (delete this block to remove the feature) ===
import SavedResumesPanel from '../../savedResumes/components/SavedResumesPanel';
// === SAVED RESUMES FEATURE - END ===

export default function Home() {
    const { isLoading, generateReport, reports, getAllReports ,deleteReport} = useInterview()
   
    const [jobDescription, SetJobDescription] = useState("")
    const [selfDescription, SetSelfDescrition] = useState("")
    const [uploadedFile, setUploadedFile] = useState(null)
    const [activeTab, setActiveTab] = useState("generate") // generate | reports | resumes (mobile tabs)
    const resumeInputRef = useRef()
    const navigate = useNavigate()
    

    useEffect(() => {
        getAllReports()
    }, [])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0])
        }
    }
        // === DELETE REPORT - START ===
    const handleDeleteReport = async (e, reportId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this report? This cannot be undone.")) return;
        await deleteReport(reportId)
    };
    // === DELETE REPORT - END ===


    const handleGenerateReport = async () => {
        const resume = resumeInputRef.current?.files[0]
        
        if (!jobDescription) {
            alert("Please enter a job description so the AI knows which role to evaluate you for.")
            return
        }

        if (!resume && !selfDescription) {
            alert("Please upload a resume PDF OR write a self description to continue.")
            return
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resume
            })
            if (!data?._id) {
                throw new Error("Interview report was not created")
            }
            navigate(`/interview/${data._id}`)
        } catch (error) {
            console.error("Failed to generate interview report:", error)
            alert("Unable to generate the interview report right now. Please try again.")
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <main className='home'>
            {/* MOBILE TABS — switch panes on phones; hidden on desktop via CSS */}
            <div className="home-tabs">
                <button type="button" className={`home-tab ${activeTab === "generate" ? "is-active" : ""}`} onClick={() => setActiveTab("generate")}>
                    <Sparkles size={15} />
                    <span>Generate</span>
                </button>
                <button type="button" className={`home-tab ${activeTab === "reports" ? "is-active" : ""}`} onClick={() => setActiveTab("reports")}>
                    <FileText size={15} />
                    <span>Reports</span>
                    {Array.isArray(reports) && reports.length > 0 && <span className="home-tab-badge">{reports.length}</span>}
                </button>
                <button type="button" className={`home-tab ${activeTab === "resumes" ? "is-active" : ""}`} onClick={() => setActiveTab("resumes")}>
                    <FileDown size={15} />
                    <span>Resumes</span>
                </button>
            </div>
            <div className={`interview-group tab-pane ${activeTab === "generate" ? "is-active" : ""}`}>
                 <div className="card-header">

                <div className="notice-banner">
                    <Info className="notice-icon" />
                    <p>Upload a resume OR enter a self description. Providing both gives the best results!</p>
                </div>

                </div>

                <div className='left'>
                    <div className="group-header">
                        <FileText className="header-icon" />
                        <h3>Job Description</h3>
                    </div>
                    <textarea 
                        onChange={(e) => SetJobDescription(e.target.value)}
                        name='jobDescription' 
                        placeholder='Enter  job description here.....'
                    ></textarea>
                </div>

                <div className="right">
                    <div className="input-grpup">
                        <label className="file-label" htmlFor="resume">
                            <UploadCloud className="icon" />
                            <span>{uploadedFile ? 'Change PDF' : 'Upload Resume (.pdf)'}</span>
                        </label>
                        <input 
                            ref={resumeInputRef} 
                            hidden 
                            type="file" 
                            name="resume" 
                            id="resume" 
                            accept='.pdf'
                            onChange={handleFileChange}
                        />
                        {uploadedFile && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#10B981',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                <CheckCircle2 size={16} />
                                <span>{uploadedFile.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <div className="label-header">
                            <User className="header-icon" />
                            <label htmlFor="selfDescription">Self Description (Optional if PDF uploaded)</label>
                        </div>
                        <textarea
                            onChange={(e) => SetSelfDescrition(e.target.value)} 
                            name="selfDescription" 
                            id="selfDescription" 
                            placeholder='Enter self description here.....'
                        ></textarea>
                    </div>

                    <button onClick={handleGenerateReport} className='generate-btn'>
                        <Sparkles className="icon" />
                        <span>Generate Interview Report</span>
                    </button>
                </div>
            </div>
                {/* === SAVED RESUMES FEATURE - START (delete this block to remove the feature) === */}
<div className={`tab-pane ${activeTab === "resumes" ? "is-active" : ""}`}>
<SavedResumesPanel />
</div>
{/* === SAVED RESUMES FEATURE - END === */}

            <div className={`reports-history-container tab-pane ${activeTab === "reports" ? "is-active" : ""}`}>
                {/* Added Array.isArray check to prevent crashes when reports is an object */}
                {Array.isArray(reports) && reports.length > 0 && (             
                    <section className="recent-reports-section">
                        <Collapsible title="Recent Reports" badge={String(reports.length)} framed>
                        <ul className="reports-list">
                            {reports.map(report => (
                                <li key={report._id} className="report-item">
                                    <Link to={`/interview/${report._id}`} className="report-link">
                                        <span className="report-title">{report.title || "untitled report"}</span>
                                        <span className="report-date">
                                            {new Date(report.createdAt).toLocaleString()}
                                        </span>
                                    </Link>
                                                                        {/* === DELETE REPORT - START === */}
                                    <button
                                        className="report-delete-btn"
                                        title="Delete report"
                                        onClick={(e) => handleDeleteReport(e, report._id)}
                                    >
                                        <X size={15} />
                                    </button>
                                    {/* === DELETE REPORT - END === */}

                                </li>
                            ))}
                        </ul>
                        </Collapsible>
                    </section>
                )}
            </div>
        </main>
    )
}