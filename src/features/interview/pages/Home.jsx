import React from 'react'
import { FileText, UploadCloud, User, Sparkles, Info } from 'lucide-react'
import "../styles/home.scss"

export default function Home() {
  return (
      <main className='home'>
          <div className="interview-group">
              <div className="notice-banner">
                  <Info className="notice-icon" />
                  <p>Add resume and job description for better results</p>
              </div>

              <div className='left'>
                  <div className="group-header">
                      <FileText className="header-icon" />
                      <h3>Job Description</h3>
                  </div>
                  <textarea 
                      name='jobDescription' 
                      placeholder='Enter job description here.....'
                  ></textarea>
              </div>

              <div className="right">
                  <div className="input-grpup">
                      <label className="file-label" htmlFor="resume">
                          <UploadCloud className="icon" />
                          <span>Upload Resume (.pdf)</span>
                      </label>
                      <input hidden type="file" name="resume" id="resume" accept='.pdf'/>
                  </div>

                  <div className="input-group">
                      <div className="label-header">
                          <User className="header-icon" />
                          <label htmlFor="selfDescription">Self Description</label>
                      </div>
                      <textarea name="selfDescription" id="selfDescription" placeholder='Enter self description here.....'></textarea>
                  </div>

                  <button className='generate-btn'>
                      <Sparkles className="icon" />
                      <span>Generate Interview Report</span>
                  </button>
              </div>
          </div>
      </main>
  )
}