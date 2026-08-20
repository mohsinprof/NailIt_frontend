import React, { useState } from 'react'
import { 
    Code, 
    Users, 
    Calendar, 
    AlertTriangle, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp, 
    Sparkles 
} from 'lucide-react'
import "../styles/interview.scss"

export default function InterviewReport({ reportData }) {
  const data = reportData || {
    matchScore: 85,
    scoreReasoning: "The candidate demonstrates strong proficiency in React and modern frontend ecosystems, closely matching the job description's core requirements. However, there is a minor gap in advanced backend optimization techniques.",
    skillsGaps: [
      { skill: "Docker & Containerization", severity: "medium" },
      { skill: "GraphQL", severity: "low" },
      { skill: "System Architecture", severity: "high" }
    ],
    technicalQuestions: [
      {
        question: "How do you manage state in large-scale React applications?",
        intention: "Assess architecture scalability, understanding of context vs redux/zustand, and performance optimization.",
        answer: "Discuss lifting state, using Zustand or Redux Toolkit for global states, and leveraging React Query/SWR for server state caching."
      }
    ],
    behavioralQuestions: [
      {
        question: "Tell me about a time you handled a tight deadline under pressure.",
        intention: "Evaluate time management, prioritization skills, and professional resilience.",
        answer: "Use the STAR method (Situation, Task, Action, Result). Highlight communication with stakeholders and scope trimming."
      }
    ],
    preparationPlan: [
      {
        day: 1,
        focus: "Core Skill Alignment & Architecture Review",
        tasks: [
          "Review MERN stack performance patterns",
          "Brush up on system design principles for web apps"
        ]
      },
      {
        day: 2,
        focus: "Mock Technical & Behavioral Practice",
        tasks: [
          "Practice coding challenges focused on state management",
          "Prepare 3 distinct STAR stories for behavioral rounds"
        ]
      }
    ]
  };

  // State to switch between Technical, Behavioral, and Preparation Plan
  const [activeTab, setActiveTab] = useState('technical');
  const [expandedTech, setExpandedTech] = useState({});
  const [expandedBehavioral, setExpandedBehavioral] = useState({});

  const toggleTech = (index) => {
    setExpandedTech(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleBehavioral = (index) => {
    setExpandedBehavioral(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <main className='interview-report-page'>
      <div className="report-container">
        
        {/* TOP HEADER: LARGE TITLE & PERMANENT MATCH SCORE */}
        <header className="report-header">
          <div className="brand-badge-large">
            <Sparkles className="brand-icon" />
            <h1>NailIt Intelligence Report</h1>
          </div>
          
          <div className="score-overview-card">
            <div className="score-badge-circle">
              <span className="score-number">{data.matchScore}%</span>
              <span className="score-label">Match</span>
            </div>
            <div className="score-details">
              <h2>Candidate Compatibility Analysis</h2>
              <p>{data.scoreReasoning}</p>
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
                {data.skillsGaps && data.skillsGaps.map((gap, idx) => (
                  <div key={idx} className={`skill-tag severity-${gap.severity}`}>
                    <span>{gap.skill}</span>
                    <span className="severity-badge">{gap.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER WORKSPACE: TABS & DYNAMIC CONTENT */}
          <section className="workspace-center">
            
            {/* TABS NAVIGATION */}
            <div className="report-tabs">
              <button 
                className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveTab('technical')}
              >
                <Code className="tab-icon" /> Technical Questions
              </button>
              <button 
                className={`tab-btn ${activeTab === 'behavioral' ? 'active' : ''}`}
                onClick={() => setActiveTab('behavioral')}
              >
                <Users className="tab-icon" /> Behavioral Questions
              </button>
              <button 
                className={`tab-btn ${activeTab === 'prep' ? 'active' : ''}`}
                onClick={() => setActiveTab('prep')}
              >
                <Calendar className="tab-icon" /> Preparation Plan
              </button>
            </div>

            {/* TAB CONTENT BOX */}
            <div className="tab-content-box">
              
              {/* 1. TECHNICAL QUESTIONS */}
              {activeTab === 'technical' && (
                <div className="animate-fade">
                  <div className="questions-list">
                    {data.technicalQuestions.map((item, idx) => (
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
                              <strong>Interviewer's Intention:</strong>
                              <p>{item.intention}</p>
                            </div>
                            <div className="answer-box">
                              <strong>Winning Answer Strategy:</strong>
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. BEHAVIORAL QUESTIONS */}
              {activeTab === 'behavioral' && (
                <div className="animate-fade">
                  <div className="questions-list">
                    {data.behavioralQuestions.map((item, idx) => (
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
                              <strong>Interviewer's Intention:</strong>
                              <p>{item.intention}</p>
                            </div>
                            <div className="answer-box">
                              <strong>Winning Answer Strategy:</strong>
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PREPARATION PLAN */}
              {activeTab === 'prep' && (
                <div className="animate-fade">
                  <div className="prep-timeline">
                    {data.preparationPlan.map((plan, idx) => (
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
                    ))}
                  </div>
                </div>
              )}

            </div>

          </section>

        </div>

      </div>
    </main>
  )
}