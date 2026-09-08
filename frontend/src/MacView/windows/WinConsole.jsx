import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import OsWindow from '../OsWindow.jsx';
import { executeCode } from './codeRunner.js';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'html', name: 'HTML / CSS' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' },
];

export default function WinConsole({
  isOpen,
  isMinimized,
  isFocused,
  zIndex,
  onClose,
  onMin,
  onFocus,
}) {
  const [lang, setLang] = useState('javascript');
  const [codes, setCodes] = useState({});
  const [outputLogs, setOutputLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'preview'
  const [layoutMode, setLayoutMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'stacked' : 'split'
  );
  const [executionTime, setExecutionTime] = useState(null);
  const outputEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutMode('stacked');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentCode = codes[lang] || '';

  // Auto scroll output
  useEffect(() => {
    if (activeTab === 'output') {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputLogs, activeTab]);

  const handleCodeChange = (newVal) => {
    setCodes((prev) => ({ ...prev, [lang]: newVal }));
  };

  const handleClearOutput = () => {
    setOutputLogs([]);
  };

  /**
   * Universal Runner Engine Execution Trigger
   */
  const handleRun = useCallback(() => {
    setIsRunning(true);
    const startTime = performance.now();

    setOutputLogs([
      { type: 'header', text: `[Console] Executing ${lang.toUpperCase()} source code...` },
    ]);

    setTimeout(() => {
      try {
        const result = executeCode(lang, currentCode);

        const logs = [
          { type: 'system', text: result.cmd },
          { type: 'system', text: result.compilerLog },
        ];

        if (result.stdout && result.stdout.length > 0) {
          result.stdout.forEach((line) => {
            logs.push({ type: 'stdout', text: line });
          });
        } else {
          logs.push({ type: 'stdout', text: '(Program exited with empty stdout)' });
        }

        if (result.exitCode === 0) {
          logs.push({ type: 'success', text: `✓ Process completed with exit code 0` });
        } else {
          logs.push({ type: 'error', text: `✖ Process exited with error code ${result.exitCode}` });
        }

        setOutputLogs(logs);

        // If HTML, ensure preview tab or split view is visible
        if (lang === 'html') {
          setActiveTab('preview');
        }
      } catch (err) {
        setOutputLogs((prev) => [
          ...prev,
          { type: 'error', text: `✖ Execution Exception:\n${err.message || String(err)}` },
        ]);
      } finally {
        const elapsed = (performance.now() - startTime).toFixed(1);
        setExecutionTime(elapsed);
        setIsRunning(false);
      }
    }, 120);
  }, [lang, currentCode]);

  // Handle Tab key in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const updated = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      handleCodeChange(updated);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  // Line numbers calculation
  const lineCount = useMemo(() => {
    return currentCode.split('\n').length;
  }, [currentCode]);

  return (
    <OsWindow
      id="win-console"
      title={`Terminal / IDE — ${LANGUAGES.find((l) => l.id === lang)?.name || 'Code Runner'} (Console)`}
      isOpen={isOpen}
      isMinimized={isMinimized}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={900}
      initialHeight={600}
      initialTop={56}
      initialLeft={100}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
      bodyStyle={{
        padding: 0,
        background: '#090d16',
        color: '#e6edf3',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'SF Mono', Menlo, Monaco, Consolas, monospace",
      }}
    >
      {/* 1. Top Bar: Language Pills & Run Trigger */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {/* Language selector pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
          {LANGUAGES.map((l) => {
            const isActive = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => {
                  setLang(l.id);
                  if (l.id === 'html') setActiveTab('preview');
                  else setActiveTab('output');
                }}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #2563eb, #0284c7)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  borderRadius: '6px',
                  padding: '4px 9px',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
                }}
              >
                <span>{l.icon}</span>
                <span>{l.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Layout Toggle Button */}
          <button
            onClick={() => setLayoutMode((m) => (m === 'split' ? 'stacked' : 'split'))}
            title="Toggle between Split (side-by-side) and Stacked view"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              borderRadius: '6px',
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {layoutMode === 'split' ? '◫ Split' : '☰ Stacked'}
          </button>

          <button
            onClick={() => handleCodeChange('')}
            title="Clear editor to write from blank"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ✕ Clear Code
          </button>

          {/* RUN BUTTON */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            style={{
              background: isRunning
                ? '#475569'
                : 'linear-gradient(135deg, #22c55e, #10b981)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '7px',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: isRunning ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 12px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.15s',
            }}
          >
            <span>{isRunning ? '⏳ Running...' : '▶ Run'}</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace: Editor + Terminal Output (Split or Stacked) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: layoutMode === 'split' ? 'row' : 'column',
          minHeight: 0,
        }}
      >
        {/* Code Editor Section */}
        <div
          style={{
            flex: layoutMode === 'split' ? '1.1' : '1.1',
            display: 'flex',
            minHeight: layoutMode === 'split' ? '0' : '180px',
            background: '#0d1117',
            borderRight: layoutMode === 'split' ? '1px solid #30363d' : 'none',
            borderBottom: layoutMode === 'split' ? 'none' : '1px solid #30363d',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Line Numbers Gutter */}
          <div
            style={{
              width: '42px',
              padding: '12px 6px 12px 0',
              textAlign: 'right',
              color: '#484f58',
              fontSize: '12px',
              lineHeight: '1.6',
              userSelect: 'none',
              background: '#090d16',
              borderRight: '1px solid #21262d',
              fontFamily: 'inherit',
              overflowY: 'hidden',
            }}
          >
            {Array.from({ length: Math.max(lineCount, 8) }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={currentCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            placeholder="// Write your code here..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e6edf3',
              padding: '12px 14px',
              fontFamily: 'inherit',
              fontSize: '12.5px',
              lineHeight: '1.6',
              resize: 'none',
              whiteSpace: 'pre',
              overflowWrap: 'normal',
              overflowX: 'auto',
            }}
          />
        </div>

        {/* Right / Bottom: Terminal & Preview Column */}
        <div
          style={{
            flex: layoutMode === 'split' ? '1' : '0.9',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            background: '#090d16',
          }}
        >
          {/* Terminal Output Header Tabs */}
          <div
            style={{
              background: '#161b22',
              borderBottom: '1px solid #30363d',
              padding: '4px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#8b949e',
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveTab('output')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'output' ? '#58a6ff' : '#8b949e',
                  fontWeight: activeTab === 'output' ? 700 : 500,
                  borderBottom: activeTab === 'output' ? '2px solid #58a6ff' : '2px solid transparent',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                💻 Terminal Output
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'preview' ? '#58a6ff' : '#8b949e',
                  fontWeight: activeTab === 'preview' ? 700 : 500,
                  borderBottom: activeTab === 'preview' ? '2px solid #58a6ff' : '2px solid transparent',
                  padding: '4px 6px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                🌐 Live Preview {lang === 'html' ? '★' : ''}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {executionTime && (
                <span style={{ color: '#3fb950', fontSize: '10.5px' }}>
                  ✓ {executionTime}ms
                </span>
              )}
              <button
                onClick={handleClearOutput}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8b949e',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                }}
                title="Clear terminal output"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Output Body or Live Preview */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              minHeight: '140px',
              background: '#090d16',
              position: 'relative',
            }}
          >
            {activeTab === 'output' ? (
              <div
                style={{
                  padding: '12px 16px',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  fontFamily: 'inherit',
                }}
              >
                {outputLogs.length === 0 ? (
                  <div style={{ color: '#484f58', fontStyle: 'italic' }}>
                    Output console ready. Click "▶ Run" or press ⌘↵ / Ctrl+Enter to execute code.
                  </div>
                ) : (
                  outputLogs.map((log, i) => {
                    let color = '#c9d1d9';
                    if (log.type === 'header') color = '#58a6ff';
                    if (log.type === 'system') color = '#8b949e';
                    if (log.type === 'stdout') color = '#e6edf3';
                    if (log.type === 'success') color = '#3fb950';
                    if (log.type === 'error') color = '#f85149';

                    return (
                      <div
                        key={i}
                        style={{
                          color,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          marginBottom: '2px',
                        }}
                      >
                        {log.text}
                      </div>
                    );
                  })
                )}
                <div ref={outputEndRef} />
              </div>
            ) : (
              /* Live HTML/CSS Preview Iframe */
              <div style={{ width: '100%', height: '100%', background: '#0f172a' }}>
                <iframe
                  title="Live HTML Preview"
                  srcDoc={currentCode}
                  sandbox="allow-scripts"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </OsWindow>
  );
}
