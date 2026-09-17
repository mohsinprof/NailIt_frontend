import React, { useState, useRef } from 'react';
import {
    Upload,
    X,
    CheckCircle2,
    FileText,
    Mail,
    Phone,
    Briefcase,
    BookOpen,
    Award,
    Zap,
    Download,
    ArrowLeft
} from 'lucide-react';
import { generateFreshResume } from '../services/freshResume.api';
// === SAVED RESUMES FEATURE - START ===
import { saveResume, isLimitReachedError, getLimitReachedResumes } from '../../savedResumes/services/savedResumes.api';
import ReplaceResumeModal from '../../savedResumes/components/ReplaceResumeModal';
// === SAVED RESUMES FEATURE - END ===

import '../styles/makeResume.scss';
import { useNavigate } from 'react-router-dom';



export default function MakeFreshResumeForm() {
    const navigate = useNavigate();
    // Form state
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
    });

    const [summary, setSummary] = useState('');
    const [experience, setExperience] = useState([
        { company: '', position: '', duration: '', description: '' },
    ]);

    const [education, setEducation] = useState([
        { school: '', degree: '', field: '', graduationYear: '' },
    ]);

    const [skills, setSkills] = useState('');
    const [certifications, setCertifications] = useState([
        { name: '', issuer: '', year: '' },
    ]);

    // Upload state
    const [uploadedPdf, setUploadedPdf] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadConfirm, setUploadConfirm] = useState(null);
    const pdfInputRef = useRef();

    // Generation state
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState(null);
// === SAVED RESUMES FEATURE - START ===
const [lastGeneratedPdf, setLastGeneratedPdf] = useState(null);
const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
const [replaceContext, setReplaceContext] = useState(null); // { resumes, pendingFile }
// === SAVED RESUMES FEATURE - END ===


    // Personal info change handler
    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Experience handlers
    const handleExperienceChange = (index, field, value) => {
        setExperience((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addExperienceEntry = () => {
        setExperience((prev) => [...prev, { company: '', position: '', duration: '', description: '' }]);
    };

    const removeExperienceEntry = (index) => {
        setExperience((prev) => prev.filter((_, i) => i !== index));
    };

    // Education handlers
    const handleEducationChange = (index, field, value) => {
        setEducation((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addEducationEntry = () => {
        setEducation((prev) => [...prev, { school: '', degree: '', field: '', graduationYear: '' }]);
    };

    const removeEducationEntry = (index) => {
        setEducation((prev) => prev.filter((_, i) => i !== index));
    };

    // Certification handlers
    const handleCertificationChange = (index, field, value) => {
        setCertifications((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addCertificationEntry = () => {
        setCertifications((prev) => [...prev, { name: '', issuer: '', year: '' }]);
    };

    const removeCertificationEntry = (index) => {
        setCertifications((prev) => prev.filter((_, i) => i !== index));
    };

    // PDF upload handler
    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        // Simulate upload progress
        setUploadProgress(0);
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + Math.random() * 30;
            });
        }, 200);

        // Store file and show confirmation
        setTimeout(() => {
            clearInterval(progressInterval);
            setUploadProgress(100);

            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            const uploadTime = new Date().toLocaleTimeString();

            setUploadedPdf(file);
            setUploadConfirm({
                fileName: file.name,
                fileSize: `${fileSize} MB`,
                uploadTime,
            });

            // Reset progress after 2 seconds
            setTimeout(() => setUploadProgress(0), 2000);
        }, 1000);
    };

    const removePdfUpload = () => {
        setUploadedPdf(null);
        setUploadConfirm(null);
        setUploadProgress(0);
        pdfInputRef.current.value = '';
    };

    // Generate resume handler
    const handleGenerateResume = async () => {
        setGenerationError(null);

        // Validate: either form data or PDF required
        const hasFormData =
            personalInfo.fullName ||
            experience.some((e) => e.company || e.position) ||
            education.some((ed) => ed.school) ||
            skills;

        if (!hasFormData && !uploadedPdf) {
            setGenerationError('Please fill in some form fields or upload a resume PDF');
            return;
        }

        setIsGenerating(true);

        try {
            const resumeData = {
                personalInfo,
                summary,
                experience: experience.filter((e) => e.company || e.position),
                education: education.filter((e) => e.school),
                skills: skills
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s),
                certifications: certifications.filter((c) => c.name),
            };

            const pdfBlob = await generateFreshResume(resumeData, uploadedPdf);
       
            const safeName = (personalInfo.fullName || 'Resume')            
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')   // strip odd characters
    .replace(/\s+/g, '_');   
        // === SAVED RESUMES FEATURE - START ===
setLastGeneratedPdf({
    file: new File([pdfBlob], `${safeName}_Resume.pdf`, { type: 'application/pdf' }),
});
// === SAVED RESUMES FEATURE - END ===

            // Trigger download
            const downloadUrl = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${safeName}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            // Reset form after successful generation
            setTimeout(() => {
                setPersonalInfo({ fullName: '', email: '', phone: '', location: '' });
                setSummary('');
                setExperience([{ company: '', position: '', duration: '', description: '' }]);
                setEducation([{ school: '', degree: '', field: '', graduationYear: '' }]);
                setSkills('');
                setCertifications([{ name: '', issuer: '', year: '' }]);
                removePdfUpload();
            }, 1000);
        } catch (error) {
            console.error('Failed to generate resume:', error);
            setGenerationError('Failed to generate resume. Please check your input and try again.');
        } finally {
            setIsGenerating(false);
        }

    };
  // === SAVED RESUMES FEATURE - START ===
const handleSaveToLibrary = async () => {
    if (!lastGeneratedPdf) return;
    setIsSavingToLibrary(true);
    try {
        await saveResume(lastGeneratedPdf.file, 'fresh');
        alert('Saved! See it on the Home page under "My Resumes".');
    } catch (error) {
        const resumes = getLimitReachedResumes(error);
        if (resumes) {
            setReplaceContext({ resumes, pendingFile: lastGeneratedPdf.file });
        } else {
            alert(error?.response?.data?.message || 'Could not save the resume.');
        }
    } finally {
        setIsSavingToLibrary(false);
    }
};
// === SAVED RESUMES FEATURE - END ===

                  

    return (
        <div className="make-fresh-resume-form">
               <button
                    type="button"
                    onClick={() => navigate('/')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'transparent',
                        color: '#ff0000',
                        border: '1px solid #050c00',
                        padding: '0.4rem 0.9rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </button>
            <div className="form-header">
                <h1>Make Fresh Resume</h1>
                <p className="form-subtitle">
                    Fill out your information below or upload an existing resume and enhance it. AI will generate a
                    professional, truthful resume based on what you provide.
                </p>
            </div>

            {/* Error message */}
            {generationError && (
                <div className="error-banner">
                    <span>{generationError}</span>
                </div>
            )}

            <div className="form-container">
                {/* LEFT COLUMN: Form fields */}
                <div className="form-left">
                    {/* Personal Info Section */}
                    <section className="form-section">
                        <div className="section-header">
                            <FileText className="section-icon" />
                            <h2>Personal Information</h2>
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={personalInfo.fullName}
                                onChange={handlePersonalInfoChange}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>
                                    <Mail size={14} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={personalInfo.email}
                                    onChange={handlePersonalInfoChange}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <Phone size={14} />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={personalInfo.phone}
                                    onChange={handlePersonalInfoChange}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={personalInfo.location}
                                onChange={handlePersonalInfoChange}
                                placeholder="City, State"
                            />
                        </div>
                    </section>

                    {/* Professional Summary */}
                    <section className="form-section">
                        <div className="section-header">
                            <Briefcase className="section-icon" />
                            <h2>Professional Summary</h2>
                        </div>
                        <div className="form-group">
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Brief overview of your professional background, key achievements, and career objectives..."
                                rows={4}
                            />
                        </div>
                    </section>

                    {/* Work Experience */}
                    <section className="form-section">
                        <div className="section-header">
                            <Briefcase className="section-icon" />
                            <h2>Work Experience</h2>
                        </div>
                        {experience.map((exp, index) => (
                            <div key={index} className="entry-block">
                                <div className="entry-header">
                                    <h3>Experience {index + 1}</h3>
                                    {experience.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeExperienceEntry(index)}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) =>
                                                handleExperienceChange(index, 'company', e.target.value)
                                            }
                                            placeholder="Company Name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Position</label>
                                        <input
                                            type="text"
                                            value={exp.position}
                                            onChange={(e) =>
                                                handleExperienceChange(index, 'position', e.target.value)
                                            }
                                            placeholder="Job Title"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        value={exp.duration}
                                        onChange={(e) =>
                                            handleExperienceChange(index, 'duration', e.target.value)
                                        }
                                        placeholder="e.g., Jan 2020 - Dec 2022"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description / Achievements</label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) =>
                                            handleExperienceChange(index, 'description', e.target.value)
                                        }
                                        placeholder="Key responsibilities and achievements (one per line)"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-entry-btn" onClick={addExperienceEntry}>
                            + Add Experience
                        </button>
                    </section>

                    {/* Education */}
                    <section className="form-section">
                        <div className="section-header">
                            <BookOpen className="section-icon" />
                            <h2>Education</h2>
                        </div>
                        {education.map((edu, index) => (
                            <div key={index} className="entry-block">
                                <div className="entry-header">
                                    <h3>Education {index + 1}</h3>
                                    {education.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeEducationEntry(index)}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>School / University</label>
                                        <input
                                            type="text"
                                            value={edu.school}
                                            onChange={(e) =>
                                                handleEducationChange(index, 'school', e.target.value)
                                            }
                                            placeholder="School Name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Degree</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) =>
                                                handleEducationChange(index, 'degree', e.target.value)
                                            }
                                            placeholder="e.g., Bachelor of Science"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Field of Study</label>
                                        <input
                                            type="text"
                                            value={edu.field}
                                            onChange={(e) =>
                                                handleEducationChange(index, 'field', e.target.value)
                                            }
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Graduation Year</label>
                                        <input
                                            type="text"
                                            value={edu.graduationYear}
                                            onChange={(e) =>
                                                handleEducationChange(index, 'graduationYear', e.target.value)
                                            }
                                            placeholder="2020"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-entry-btn" onClick={addEducationEntry}>
                            + Add Education
                        </button>
                    </section>

                    {/* Skills */}
                    <section className="form-section">
                        <div className="section-header">
                            <Zap className="section-icon" />
                            <h2>Skills</h2>
                        </div>
                        <div className="form-group">
                            <label>Skills (comma-separated)</label>
                            <textarea
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="e.g., JavaScript, React, Node.js, Python, SQL, AWS"
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="form-section">
                        <div className="section-header">
                            <Award className="section-icon" />
                            <h2>Certifications</h2>
                        </div>
                        {certifications.map((cert, index) => (
                            <div key={index} className="entry-block">
                                <div className="entry-header">
                                    <h3>Certification {index + 1}</h3>
                                    {certifications.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeCertificationEntry(index)}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Certification Name</label>
                                    <input
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) =>
                                            handleCertificationChange(index, 'name', e.target.value)
                                        }
                                        placeholder="e.g., AWS Solutions Architect"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Issuing Organization</label>
                                        <input
                                            type="text"
                                            value={cert.issuer}
                                            onChange={(e) =>
                                                handleCertificationChange(index, 'issuer', e.target.value)
                                            }
                                            placeholder="Organization"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Year</label>
                                        <input
                                            type="text"
                                            value={cert.year}
                                            onChange={(e) =>
                                                handleCertificationChange(index, 'year', e.target.value)
                                            }
                                            placeholder="2023"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-entry-btn" onClick={addCertificationEntry}>
                            + Add Certification
                        </button>
                    </section>
                </div>

                {/* RIGHT COLUMN: PDF Upload */}
                <aside className="form-right">
                    <div className="upload-card">
                        <h3>Upload Existing Resume (Optional)</h3>
                        <p className="upload-hint">
                            If you have an existing resume PDF, upload it to enhance or rebuild it. If you skip this,
                            fill out the form fields above and AI will create a resume from that information.
                        </p>

                        {!uploadedPdf ? (
                            <div
                                className="upload-zone"
                                onClick={() => pdfInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        const event = new Event('change', { bubbles: true });
                                        pdfInputRef.current.files = e.dataTransfer.files;
                                        pdfInputRef.current.dispatchEvent(event);
                                    }
                                }}
                            >
                                <Upload className="upload-icon" />
                                <p>Click to upload or drag and drop</p>
                                <span className="upload-hint-small">PDF up to 3MB</span>
                            </div>
                        ) : (
                            <div className="upload-success">
                                <div className="upload-progress-container">
                                    <div className="upload-progress-bar">
                                        <div
                                            className="upload-progress-fill"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{Math.round(uploadProgress)}%</span>
                                </div>

                                {uploadConfirm && (
                                    <div className="upload-confirmation">
                                        <CheckCircle2 className="confirm-icon" />
                                        <div className="confirm-details">
                                            <p className="confirm-filename">{uploadConfirm.fileName}</p>
                                            <p className="confirm-meta">
                                                {uploadConfirm.fileSize} • Uploaded at {uploadConfirm.uploadTime}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="remove-pdf-btn"
                                    onClick={removePdfUpload}
                                >
                                    Remove and Upload Different File
                                </button>
                            </div>
                        )}

                        <input
                            ref={pdfInputRef}
                            type="file"
                            accept=".pdf"
                            hidden
                            onChange={handlePdfUpload}
                        />
                    </div>
                    {/* === SAVED RESUMES FEATURE - START === */}
<button
    type="button"
    className="generate-btn"
    onClick={handleSaveToLibrary}
    disabled={isSavingToLibrary || !lastGeneratedPdf}
>
    <Download size={18} />
    <span>{isSavingToLibrary ? 'Saving...' : 'Save to My Resumes'}</span>
</button>
{/* === SAVED RESUMES FEATURE - END === */}


                    {/* Generate button */}
                    <button
                        type="button"
                        className="generate-btn"
                        onClick={handleGenerateResume}
                        disabled={isGenerating}
                    >
                        <Download size={18} />
                        <span>{isGenerating ? 'Generating Resume...' : 'Generate & Download Resume'}</span>
                    </button>
                </aside>
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

        </div>
    );
}
