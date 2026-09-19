
import React, { useEffect, useState } from 'react'
import { 
    Code, 
    Users, 
    Calendar, 
    AlertTriangle, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp, 
    Sparkles,
    Target,
    FileDown,
    ArrowLeft
} from 'lucide-react'
import "../styles/interview.scss"
import { useInterview } from '../hooks/useInterview.js';
import { useParams,useNavigate } from 'react-router-dom'


import Loading from '../../auth/pages/Loading'
import NotFound from '../../auth/pages/NotFound'
import { downloadTailoredResumePdf } from '../services/resumePdf.api'
// === SAVED RESUMES FEATURE - START ===
import { saveResume, isLimitReachedError, getLimitReachedResumes } from '../../savedResumes/services/savedResumes.api';
import ReplaceResumeModal from '../../savedResumes/components/ReplaceResumeModal';
// === SAVED RESUMES FEATURE - END ===


export default function InterviewReport() {
  const navigate=useNavigate()
  const [activeTab, setActiveTab] = useState('technical');
  const [expandedTech, setExpandedTech] = useState({});
  
  const [expandedBehavioral, setExpandedBehavioral] = useState({});
  // === SAVED RESUMES FEATURE - START ===
const [isResumeSaving, setIsResumeSaving] = useState(false);
const [replaceContext, setReplaceContext] = useState(null); // { resumes, pendingFile }
// === SAVED RESUMES FEATURE - END ===

  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  

  const { interviewId } = useParams()
  const { report, getReportById, isLoading } = useInterview()

  useEffect(() => {
    if (!interviewId) return;
    // Fetch if we don't have data, or if the ID doesn't match
    if (!report || String(report._id) !== interviewId) {
        getReportById(interviewId).catch((error) => console.error("Failed to load interview report:", error))
    }
  }, [interviewId, report, getReportById])
// === SAVED RESUMES FEATURE - START ===
// === SAVED RESUMES FEATURE - START ===
const handleSaveTailoredResume = async () => {
    setIsResumeSaving(true);
    try {
        const response = await downloadTailoredResumePdf(interviewId);
        const file = new File(
            [response.data],
            `${report.title || 'tailored-resume'}.pdf`,
            { type: 'application/pdf' }
        );
        try {
            await saveResume(file, 'tailored');
            alert('Saved! See it on the Home page under "My Resumes".');
        } catch (saveError) {
            const resumes = getLimitReachedResumes(saveError);
            if (resumes) {
                // Refetch the PDF so the replace call has fresh bytes
                const resp = await downloadTailoredResumePdf(interviewId);
                setReplaceContext({
                    resumes,
                    pendingFile: new File(
                        [resp.data],
                        `${report.title || 'tailored-resume'}.pdf`,
                        { type: 'application/pdf' }
                    ),
                });
            } else {
                alert(saveError?.response?.data?.message || 'Could not save the tailored resume.');
            }
        }
    } catch (error) {
        console.error('Failed to prepare tailored resume for saving:', error);
        alert('Could not save the tailored resume.');
    } finally {
        setIsResumeSaving(false);
    }
};
// === SAVED RESUMES FEATURE - END ===

// === SAVED RESUMES FEATURE - END ===


  // 1. If no ID in URL
  if (!interviewId) return <NotFound />
  
  // 2. If loading, or data doesn't exist yet, or data ID doesn't match URL ID -> SHOW LOADING

  if (isLoading || !report || String(report._id) !== interviewId) {
      return <Loading />
  }

  // If we reach here, report is guaranteed to exist
  const toggleTech = (index) => setExpandedTech(prev => ({ ...prev, [index]: !prev[index] }));
  const toggleBehavioral = (index) => setExpandedBehavioral(prev => ({ ...prev, [index]: !prev[index] }));

  // Dynamic Score Color Logic
  const getScoreStyles = (score) => {
    if (score >= 75) return { 
      class: 'score-high', 
      label: 'Strong Match', 
      color: '#10B981' /* Emerald Green */ 
    };
    if (score >= 40) return { 
      class: 'score-medium', 
      label: 'Moderate Match', 
      color: '#F59E0B' /* Amber Orange */ 
    };
    return { 
      class: 'score-low', 
      label: 'Needs Improvement', 
      color: '#EF4444' /* Red */ 
    };
  };

  const scoreInfo = getScoreStyles(report.matchScore || 0);

  const handleDownloadResumePdf = async () => {
    setIsPdfDownloading(true);

    try {
      const response = await downloadTailoredResumePdf(interviewId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = `${report.title || 'tailored-resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download tailored resume PDF:', error);
      alert('Unable to generate the tailored resume PDF right now. Please try again.');
    } finally {
      setIsPdfDownloading(false);
    }
  };

  return (
    <main className='interview-report-page'>
      <div className="report-container">
           
            

        <header className="report-header">
          <div className="brand-badge-large">
            <Sparkles className="brand-icon" />
            
            <h1>NailIt Intelligence Report</h1>
          </div>
          
          <div className="score-overview-card">
            <div className={`score-badge-circle ${scoreInfo.class}`}>
              <span className="score-number">{report.matchScore || 0}%</span>
              <span className="score-label">Match</span>
            </div>
            <div className="score-details">
              <div className="title-row">
                <h2>{report.title || "Interview Report"}</h2>
                <div className="match-level-badge" style={{ backgroundColor: `${scoreInfo.color}20`, color: scoreInfo.color }}>
                  <Target size={14} />
                  {scoreInfo.label}
                </div>
              </div>
              <p>{report.scoreReasoning || "No reasoning provided."}</p>
              
              {(report.matchScore || 0) >= 75 && (
                <div className="report-actions">
                  {/* === SAVED RESUMES FEATURE - START === */}
<button
    type="button"
    className="pdf-download-btn"
    onClick={handleSaveTailoredResume}
    disabled={isResumeSaving}
>
    <FileDown size={16} />
    <span>{isResumeSaving ? 'Saving...' : 'Save to My Resumes'}</span>
</button>
{/* === SAVED RESUMES FEATURE - END === */}

                  
                  <button
                    type="button"
                    className="pdf-download-btn"
                    onClick={handleDownloadResumePdf}
                    disabled={isPdfDownloading}
                  >
                    <FileDown size={16} />
                    <span>{isPdfDownloading ? 'Preparing PDF...' : 'Download Tailored Resume PDF'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY GRID: LEFT SIDEBAR (SKILL GAPS) + CENTER WORKSPACE */}
        <div className="report-main-grid">
          
          {/* LEFT SIDEBAR: SKILL GAPS */}
          <aside className="sidebar-left">
            <div className="section-card skill-gaps-card">
              <div className="section-title">
                <AlertTriangle className="section-icon" />
                <h3>Identified Skill Gaps</h3>
              </div>
              <div className="skills-tags">
                {report.skillsGaps && report.skillsGaps.length > 0 ? (
                  report.skillsGaps.map((gap, idx) => (
                    <div key={idx} className={`skill-tag severity-${gap.severity}`}>
                      <span>{gap.skill}</span>
                      <span className="severity-badge">{gap.severity}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-gaps">
                    <CheckCircle2 size={24} />
                    <p>No major skill gaps detected!</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* CENTER WORKSPACE: TABS & DYNAMIC CONTENT */}
          <section className="workspace-center">
            
            {/* TABS NAVIGATION */}
            <div className="report-tabs">
              <button className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`} onClick={() => setActiveTab('technical')}>
                <Code className="tab-icon" /> Technical
              </button>
              <button className={`tab-btn ${activeTab === 'behavioral' ? 'active' : ''}`} onClick={() => setActiveTab('behavioral')}>
                <Users className="tab-icon" /> Behavioral
              </button>
              <button className={`tab-btn ${activeTab === 'prep' ? 'active' : ''}`} onClick={() => setActiveTab('prep')}>
                <Calendar className="tab-icon" /> Prep Plan
              </button>
            </div>

            {/* TAB CONTENT BOX */}
            <div className="tab-content-box">
              
              {/* 1. TECHNICAL QUESTIONS */}
              {activeTab === 'technical' && (
                <div className="animate-fade">
                  <div className="questions-list">
                    {report.technicalQuestions?.length > 0 ? (
                      report.technicalQuestions.map((item, idx) => (
                        <div key={idx} className="q-card">
                          <div className="q-header" onClick={() => toggleTech(idx)}>
                            <div className="q-title-wrapper">
                              <span className="q-number">T{idx + 1}</span>
                              <h4>{item.question}</h4>
                            </div>
                            {expandedTech[idx] ? <ChevronUp /> : <ChevronDown />}
                          </div>
                          {expandedTech[idx] && (
                            <div className="q-body">
                              <div className="intention-box">
                                <strong>Interviewer's Intention</strong>
                                <p>{item.intention}</p>
                              </div>
                              <div className="answer-box">
                                <strong>Winning Answer Strategy</strong>
                                <p>{item.answer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-gaps">
                        <p>No technical questions generated for this report.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. BEHAVIORAL QUESTIONS */}
              {activeTab === 'behavioral' && (
                <div className="animate-fade">
                  <div className="questions-list">
                    {report.behavioralQuestions?.length > 0 ? (
                      report.behavioralQuestions.map((item, idx) => (
                        <div key={idx} className="q-card">
                          <div className="q-header" onClick={() => toggleBehavioral(idx)}>
                            <div className="q-title-wrapper">
                              <span className="q-number">B{idx + 1}</span>
                              <h4>{item.question}</h4>
                            </div>
                            {expandedBehavioral[idx] ? <ChevronUp /> : <ChevronDown />}
                          </div>
                          {expandedBehavioral[idx] && (
                            <div className="q-body">
                              <div className="intention-box">
                                <strong>Interviewer's Intention</strong>
                                <p>{item.intention}</p>
                              </div>
                              <div className="answer-box">
                                <strong>Winning Answer Strategy</strong>
                                <p>{item.answer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-gaps">
                        <p>No behavioral questions generated for this report.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. PREPARATION PLAN */}
              {activeTab === 'prep' && (
                <div className="animate-fade">
                  <div className="prep-timeline">
                    {report.preparationPlan?.length > 0 ? (
                      report.preparationPlan.map((plan, idx) => (
                        <div key={idx} className="prep-day-card">
                          <div className="day-badge">Day {plan.day}</div>
                          <div className="day-content">
                            <h4>{plan.focus}</h4>
                            <ul className="task-list">
                              {plan.tasks.map((task, tIdx) => (
                                <li key={tIdx}>
                                  <CheckCircle2 className="task-check" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-gaps">
                        <CheckCircle2 size={32} />
                        <p>No preparation plan needed. You are fully ready for this role!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </section>

        </div>

      </div>
      {/* === SAVED RESUMES FEATURE - START === */}
<ReplaceResumeModal
    open={!!replaceContext}
    resumes={replaceContext?.resumes}
    pendingFile={replaceContext?.pendingFile}
    onClose={() => setReplaceContext(null)}
    onReplaced={() => alert('Saved! See it on the Home page under "My Resumes".')}
/>
{/* === SAVED RESUMES FEATURE - END === */}

    </main>
  )
}
