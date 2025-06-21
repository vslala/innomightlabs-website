import React, { useState, useRef, useEffect } from 'react';
import styles from './InputArea.module.css';

export interface FormValues {
    userQuery: string;
    selectedAgent: string;
}

export interface InputAreaProps {
    loading: boolean;
    onSubmit: (values: FormValues) => void;
}

const AGENT_OPTIONS = [
    { value: 'krishna', label: 'Krishna (Multi-step Reasoning)' },
    { value: 'krishna-mini', label: 'Krishna Mini (Fast)' },
    { value: 'krishna-pro', label: 'Krishna Pro (Advanced)' },
    { value: 'krishna-code', label: 'Krishna Code (Coding Expert)' },
];

const InputArea: React.FC<InputAreaProps> = ({ loading, onSubmit }) => {
    const [message, setMessage] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('krishna');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const maxLength = 10000;

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !loading) {
            onSubmit({
                userQuery: message.trim(),
                selectedAgent,
            });
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text');
        if (paste.includes('```')) {
            // Handle code block pasting
            e.preventDefault();
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newMessage = message.substring(0, start) + paste + message.substring(end);
                setMessage(newMessage);

                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + paste.length;
                    adjustTextareaHeight();
                }, 0);
            }
        }
    };

    const insertFormatting = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = message.substring(start, end);
            const newText = prefix + selectedText + suffix;
            const newMessage = message.substring(0, start) + newText + message.substring(end);
            setMessage(newMessage);

            setTimeout(() => {
                textarea.focus();
                if (selectedText) {
                    textarea.selectionStart = start;
                    textarea.selectionEnd = start + newText.length;
                } else {
                    textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
                }
                adjustTextareaHeight();
            }, 0);
        }
    };

    const getCharacterCountClass = () => {
        const length = message.length;
        if (length > maxLength * 0.9) return styles.error;
        if (length > maxLength * 0.8) return styles.warning;
        return '';
    };

    return (
        <form onSubmit={handleSubmit} className={`${styles.inputContainer} ${loading ? styles.loading : ''}`}>
            <div className={styles.textareaWrapper}>
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder="Ask anything... Use Shift+Enter for new lines, paste code with ``` blocks"
                    className={styles.textarea}
                    disabled={loading}
                    maxLength={maxLength}
                />
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.agentSelector}>
                    <label className={styles.agentLabel}>Agent:</label>
                    <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className={styles.agentSelect} disabled={loading}>
                        {AGENT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.actionButtons}>
                    <div className={styles.formatButtons}>
                        <button type="button" className={styles.formatButton} onClick={() => insertFormatting('```\n', '\n```')} title="Insert code block">
                            {`</>`}
                        </button>
                        <button type="button" className={styles.formatButton} onClick={() => insertFormatting('`', '`')} title="Insert inline code">
                            `code`
                        </button>
                        <button type="button" className={styles.formatButton} onClick={() => insertFormatting('**', '**')} title="Bold text">
                            **B**
                        </button>
                    </div>
                    <span className={`${styles.characterCount} ${getCharacterCountClass()}`}>
                        {message.length}/{maxLength}
                    </span>
                    <button type="submit" disabled={!message.trim() || loading} className={styles.sendButton}>
                        {loading ? (
                            <>
                                <span>●</span>
                                Thinking...
                            </>
                        ) : (
                            <>
                                <span>↗</span>
                                Send
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default InputArea;
