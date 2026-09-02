import { useState, type ReactNode } from 'react';
import { X, StickyNote, ChevronRight, Pencil, Check, Trash2, ArrowLeft, List, ListOrdered } from 'lucide-react';
import type { SubjectNote } from '../utils/storage';

interface SubjectNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: string[];
  subjectNotes: SubjectNote[];
  onSave: (subject: string, text: string) => void;
}

function formatNoteText(text: string): ReactNode[] {
  const lines = text.split('\n');
  let inOl = false;
  let inUl = false;
  const parts: ReactNode[] = [];
  let olItems: string[] = [];
  let ulItems: string[] = [];
  let key = 0;

  const flushOl = () => {
    if (olItems.length > 0) {
      parts.push(
        <ol key={key++} className="list-decimal list-inside space-y-0.5 my-1.5 pl-1">
          {olItems.map((item, i) => (
            <li key={i} className="text-sm text-slate-800 dark:text-slate-200">{item}</li>
          ))}
        </ol>
      );
      olItems = [];
    }
    inOl = false;
  };

  const flushUl = () => {
    if (ulItems.length > 0) {
      parts.push(
        <ul key={key++} className="list-disc list-inside space-y-0.5 my-1.5 pl-1">
          {ulItems.map((item, i) => (
            <li key={i} className="text-sm text-slate-800 dark:text-slate-200">{item}</li>
          ))}
        </ul>
      );
      ulItems = [];
    }
    inUl = false;
  };

  for (const line of lines) {
    const olMatch = line.match(/^(\d+)\.\s+(.*)/);
    const ulMatch = line.match(/^[-•*]\s+(.*)/);

    if (olMatch) {
      if (!inOl) flushUl();
      inOl = true;
      olItems.push(olMatch[2]);
    } else if (ulMatch) {
      if (!inUl) flushOl();
      inUl = true;
      ulItems.push(ulMatch[1]);
    } else {
      flushOl();
      flushUl();
      if (line.trim() === '') {
        parts.push(<div key={key++} className="h-2" />);
      } else {
        parts.push(
          <p key={key++} className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {line}
          </p>
        );
      }
    }
  }

  flushOl();
  flushUl();

  return parts;
}

function convertListType(text: string, newMode: 'ul' | 'ol'): string {
  const lines = text.split('\n');
  let counter = 0;
  return lines.map((line) => {
    const olMatch = line.match(/^\d+\.\s+(.*)/);
    const ulMatch = line.match(/^[-•*]\s+(.*)/);
    const content = olMatch?.[1] || ulMatch?.[1] || line;

    if (newMode === 'ol') {
      counter++;
      return `${counter}. ${content}`;
    } else {
      return `• ${content}`;
    }
  }).join('\n');
}

export function SubjectNotesPanel({
  isOpen,
  onClose,
  subjects,
  subjectNotes,
  onSave,
}: SubjectNotesPanelProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [savedDraft, setSavedDraft] = useState('');
  const [listMode, setListMode] = useState<'none' | 'ul' | 'ol'>('none');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingBack, setPendingBack] = useState(false);

  if (!isOpen) return null;

  const getNote = (subject: string) =>
    subjectNotes.find((n) => n.subject === subject);

  const hasUnsavedChanges = draft !== savedDraft;

  const handleSelect = (subject: string) => {
    const note = getNote(subject);
    setSelectedSubject(subject);
    if (note) {
      setDraft(note.text);
      setSavedDraft(note.text);
      setIsEditing(false);
    } else {
      setDraft('');
      setSavedDraft('');
      setIsEditing(true);
    }
    setListMode('none');
  };

  const handleSave = () => {
    if (selectedSubject) {
      onSave(selectedSubject, draft);
      setSavedDraft(draft);
      setIsEditing(false);
      setListMode('none');
    }
  };

  const handleDelete = () => {
    if (selectedSubject) {
      onSave(selectedSubject, '');
      setDraft('');
      setSavedDraft('');
      setIsEditing(false);
      setSelectedSubject(null);
      setListMode('none');
    }
  };

  const confirmBack = () => {
    setDraft(savedDraft);
    setIsEditing(false);
    setSelectedSubject(null);
    setListMode('none');
    setShowConfirm(false);
  };

  const handleBack = () => {
    if (isEditing && hasUnsavedChanges) {
      setShowConfirm(true);
      setPendingBack(true);
    } else {
      setSelectedSubject(null);
      setIsEditing(false);
      setListMode('none');
    }
  };

  const handleClose = () => {
    if (isEditing && hasUnsavedChanges) {
      setShowConfirm(true);
      setPendingBack(false);
    } else {
      setSelectedSubject(null);
      setIsEditing(false);
      setListMode('none');
      onClose();
    }
  };

  const getLineCount = (text: string, pos: number) => {
    return text.slice(0, pos).split('\n').length;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    const cursorPos = e.target.selectionStart;

    if (listMode === 'none') {
      setDraft(newVal);
      return;
    }

    const prevVal = draft;
    const addedNewline = newVal.length > prevVal.length && newVal[cursorPos - 1] === '\n';
    const isFirstChar = prevVal === '' && newVal.length === 1;

    if (isFirstChar) {
      const prefix = listMode === 'ol' ? '1. ' : '• ';
      setDraft(prefix + newVal);
      return;
    }

    if (addedNewline) {
      const lineNum = getLineCount(newVal, cursorPos);
      const prefix = listMode === 'ol' ? `${lineNum}. ` : '• ';
      const before = newVal.slice(0, cursorPos);
      const after = newVal.slice(cursorPos);
      const updated = before + prefix + after;
      setDraft(updated);
    } else {
      setDraft(newVal);
    }
  };

  const insertListPrefix = (mode: 'ul' | 'ol') => {
    if (listMode === mode) {
      setListMode('none');
      return;
    }
    if (draft) {
      setDraft(convertListType(draft, mode));
    }
    if (draft === '') {
      const prefix = mode === 'ol' ? '1. ' : '• ';
      setDraft(prefix);
    }
    setListMode(mode);
  };

  const subjectsWithNotes = subjects.filter((s) => getNote(s));
  const subjectsWithoutNotes = subjects.filter((s) => !getNote(s));

  return (
    <>
      <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col max-w-2xl mx-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {selectedSubject && (
              <button
                onClick={handleBack}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <StickyNote className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {selectedSubject ? selectedSubject : 'Subject Notes'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto p-4 ${isEditing && selectedSubject ? 'overflow-hidden' : ''}`}>
          {!selectedSubject ? (
            <div className="space-y-3">
              {subjectsWithNotes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    With Notes
                  </p>
                  <div className="space-y-1.5">
                    {subjectsWithNotes.map((subject) => {
                      const note = getNote(subject);
                      return (
                        <button
                          key={subject}
                          onClick={() => handleSelect(subject)}
                          className="w-full p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-between group"
                        >
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {subject}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {note?.text.slice(0, 60)}...
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex-shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {subjectsWithoutNotes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    {subjectsWithNotes.length > 0 ? 'Other Subjects' : 'All Subjects'}
                  </p>
                  <div className="space-y-1.5">
                    {subjectsWithoutNotes.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => handleSelect(subject)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex items-center justify-between group"
                      >
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
                          {subject}
                        </p>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            isEditing ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 mb-3">
                  <button
                    onClick={() => insertListPrefix('ul')}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      listMode === 'ul'
                        ? 'bg-indigo-500 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    aria-label="Bullet list"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => insertListPrefix('ol')}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      listMode === 'ol'
                        ? 'bg-indigo-500 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    aria-label="Numbered list"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={draft}
                  onChange={handleTextChange}
                  placeholder={`Add notes for ${selectedSubject}...`}
                  className="flex-1 min-h-0 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 scrollbar-hide"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setDraft(savedDraft);
                      setIsEditing(false);
                      setListMode('none');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[120px]">
                  {draft ? (
                    <div className="space-y-0">
                      {formatNoteText(draft)}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                      No notes yet for this subject.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    {draft ? 'Edit' : 'Add Note'}
                  </button>
                  {draft && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Unsaved Changes
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              You have unsaved changes. Do you want to discard them?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Keep Editing
              </button>
              <button
                onClick={pendingBack ? confirmBack : () => { confirmBack(); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
