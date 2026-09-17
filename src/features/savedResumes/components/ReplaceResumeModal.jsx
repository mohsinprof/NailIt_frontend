import React, { useEffect, useState } from 'react';
import { X, RefreshCw, FileText, AlertTriangle, Check } from 'lucide-react';
import { replaceSavedResume } from '../services/savedResumes.api';
import '../styles/savedResumes.scss';

function formatSize(bytes) {
    if (bytes === undefined || bytes === null) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Shared "storage full -> pick one to replace" modal.
 * Props:
 *  - open (bool)
 *  - resumes: metadata list (from the 409 response)
 *  - pendingFile: the File/Blob that failed to save
 *  - onClose(): close without replacing
 *  - onReplaced(): called after a successful replace
 */
export default function ReplaceResumeModal({ open, resumes, pendingFile, onClose, onReplaced }) {
    const [isReplacing, setIsReplacing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    // Reset selection each time the modal opens
    useEffect(() => {
        if (open) {
            setSelectedId(null);
            setError(null);
        }
    }, [open]);

    if (!open || !pendingFile) return null;

    const handleReplace = async () => {
        if (!selectedId) return;
        setIsReplacing(true);
        setError(null);
        try {
            await replaceSavedResume(selectedId, pendingFile);
            onReplaced?.();
            onClose();
        } catch (e) {
            setError(e?.response?.data?.message || 'Could not replace the resume.');
        } finally {
            setIsReplacing(false);
        }
    };

    return (
        <div className="srx-backdrop" onClick={() => !isReplacing && onClose()}>
            <div className="srx-modal" onClick={(e) => e.stopPropagation()}>
                <button className="srx-close" onClick={onClose} disabled={isReplacing}>
                    <X size={16} />
                </button>

                <div className="srx-head">
                    <div className="srx-head-icon">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <h4>Storage Full</h4>
                        <p>You already have {(resumes || []).length} saved resumes — that's the limit.</p>
                    </div>
                </div>

                <div className="srx-incoming">
                    <div className="srx-file-icon">
                        <FileText size={18} />
                    </div>
                    <div className="srx-incoming-info">
                        <span className="srx-incoming-name">{pendingFile.name || 'This resume'}</span>
                        <span className="srx-incoming-meta">
                            {formatSize(pendingFile.size)} · will replace your selection
                        </span>
                    </div>
                    <span className="srx-badge-new">NEW</span>
                </div>

                <div className="srx-divider">
                    <span>Choose a resume to replace</span>
                </div>

                {error && <div className="srx-error">{error}</div>}

                <ul className="srx-list">
                    {(resumes || []).map((resume) => (
                        <li key={resume._id}>
                            <button
                                type="button"
                                className={`srx-option ${selectedId === resume._id ? 'selected' : ''}`}
                                onClick={() => !isReplacing && setSelectedId(resume._id)}
                                disabled={isReplacing}
                            >
                                <div className="srx-file-icon srx-file-icon-sm">
                                    <FileText size={16} />
                                </div>
                                <div className="srx-option-info">
                                    <span className="srx-option-name">{resume.fileName}</span>
                                    <span className="srx-option-meta">
                                        {formatSize(resume.size)} · {new Date(resume.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="srx-check">
                                    <Check size={14} />
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="srx-actions">
                    <button className="srx-cancel" onClick={onClose} disabled={isReplacing}>
                        Cancel
                    </button>
                    <button
                        className="srx-replace"
                        onClick={handleReplace}
                        disabled={!selectedId || isReplacing}
                    >
                        <RefreshCw size={15} className={isReplacing ? 'srx-spin' : ''} />
                        <span>{isReplacing ? 'Replacing...' : 'Replace Selected'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
