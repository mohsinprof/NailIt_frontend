import React, { useEffect, useRef, useState } from 'react';
import { Download, Trash2, UploadCloud, FileText } from 'lucide-react';
import {
    getSavedResumes,
    saveResume,
    downloadSavedResume,
    deleteSavedResume,
    isLimitReachedError,
} from '../services/savedResumes.api';
import ReplaceResumeModal from './ReplaceResumeModal';
import '../styles/savedResumes.scss';

function formatSize(bytes) {
    if (bytes === undefined || bytes === null) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SavedResumesPanel() {
    const [resumes, setResumes] = useState([]);
    const [limit, setLimit] = useState(3);
    const [isUploading, setIsUploading] = useState(false);
    const [panelError, setPanelError] = useState(null);
    const [pendingFile, setPendingFile] = useState(null);
    const fileInputRef = useRef();

    useEffect(() => {
        loadResumes();
    }, []);

    const loadResumes = async () => {
        try {
            setPanelError(null);
            const data = await getSavedResumes();
            setResumes(Array.isArray(data.resumes) ? data.resumes : []);
            setLimit(data.limit || 3);
        } catch (error) {
            console.error('[SavedResumes] failed to load:', error);
            setPanelError('Could not load your saved resumes right now.');
        }
    };

    const handleFileChosen = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        await uploadFile(file);
    };

    const uploadFile = async (file) => {
        setIsUploading(true);
        setPanelError(null);
        try {
            await saveResume(file);
            await loadResumes();
        } catch (error) {
            if (isLimitReachedError(error)) {
                setPendingFile(file);
            } else {
                setPanelError(error?.response?.data?.message || 'Could not save this PDF. Please try again.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (resume) => {
        try {
            const response = await downloadSavedResume(resume._id);
            const downloadUrl = window.URL.createObjectURL(
                new Blob([response.data], { type: 'application/pdf' })
            );
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = resume.fileName || 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('[SavedResumes] download failed:', error);
            setPanelError('Could not download the resume.');
        }
    };

    const handleDelete = async (resume) => {
        if (!window.confirm(`Delete "${resume.fileName}"? This cannot be undone.`)) return;
        try {
            await deleteSavedResume(resume._id);
            await loadResumes();
        } catch (error) {
            setPanelError('Could not delete the resume.');
        }
    };

    return (
        <section className="saved-resumes-panel">
            <div className="sr-card">
                <div className="sr-header">
                    <div className="sr-header-left">
                        <FileText className="sr-header-icon" />
                        <h3>My Resumes</h3>
                        <span className="sr-count">{resumes.length}/{limit}</span>
                    </div>
                    <button
                        className="sr-upload-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <UploadCloud size={16} />
                        <span>{isUploading ? 'Saving...' : 'Save Resume'}</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        hidden
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleFileChosen}
                    />
                </div>

                {panelError && <div className="sr-error">{panelError}</div>}

                {resumes.length === 0 ? (
                    <p className="sr-empty">
                        No resumes saved yet. Click "Save Resume" to store your first one (max {limit}, PDF only).
                    </p>
                ) : (
                    <ul className="sr-list">
                        {resumes.map((resume) => (
                            <li key={resume._id} className="sr-item">
                                <div className="sr-item-info">
                                    <span className="sr-item-name">{resume.fileName}</span>
                                    <span className="sr-item-meta">
                                        {formatSize(resume.size)} · {new Date(resume.createdAt).toLocaleDateString()}
                                        {resume.source && resume.source !== 'upload' ? ` · ${resume.source}` : ''}
                                    </span>
                                </div>
                                <div className="sr-item-actions">
                                    <button className="sr-icon-btn" title="Download" onClick={() => handleDownload(resume)}>
                                        <Download size={16} />
                                    </button>
                                    <button className="sr-icon-btn sr-danger" title="Delete" onClick={() => handleDelete(resume)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ReplaceResumeModal
                open={!!pendingFile}
                resumes={resumes}
                pendingFile={pendingFile}
                onClose={() => setPendingFile(null)}
                onReplaced={loadResumes}
            />
        </section>
    );
}
