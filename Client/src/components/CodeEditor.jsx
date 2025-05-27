import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Terminal from "./Terminal";
import { getSocket } from "../sockets/socket"; // Import getSocket

export default function CodeEditor({
  code,
  onChange,
  onExecute,
  output = "",
  hideTerminal = false,
  hideHeader = false,
  roomId = null,
}) {
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const isLocalChange = useRef(false);
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket(); // Use getSocket
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("Code editor socket connected:", socket.id);
      if (!hasJoined.current) {
        socket.emit("join-room", {
          roomId,
          username: `CodeEditor-${Date.now()}`,
        });
        hasJoined.current = true;
      }
    };

    const handleDisconnect = () => {
      console.log("Code editor socket disconnected");
      hasJoined.current = false;
    };

    const handleCodeUpdate = (newCode) => {
      console.log("Received code update:", newCode);
      if (onChange && !isLocalChange.current) {
        isLocalChange.current = true;
        onChange(newCode);
        setTimeout(() => {
          isLocalChange.current = false;
        }, 100);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("code-update", handleCodeUpdate);

    if (socket.connected && !hasJoined.current) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("code-update", handleCodeUpdate);
    };
  }, [roomId, onChange]);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme("ayuLight", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "abb0b6", fontStyle: "italic" },
        { token: "keyword", foreground: "fa8d3e" },
        { token: "operator", foreground: "ed9366" },
        { token: "string", foreground: "86b300" },
        { token: "number", foreground: "4cbf99" },
        { token: "regexp", foreground: "4cbf99" },
        { token: "type", foreground: "399ee6" },
        { token: "variable", foreground: "55b4d4" },
        { token: "function", foreground: "f2ae49" },
        { token: "constant", foreground: "a37acc" },
        { token: "class", foreground: "399ee6" },
        { token: "interface", foreground: "399ee6" },
        { token: "namespace", foreground: "399ee6" },
        { token: "property", foreground: "55b4d4" },
        { token: "method", foreground: "f2ae49" },
        { token: "attribute", foreground: "a37acc" },
        { token: "tag", foreground: "fa8d3e" },
      ],
      colors: {
        "editor.background": "#fafafa",
        "editor.foreground": "#5c6166",
        "editorLineNumber.foreground": "#8a9199",
        "editorLineNumber.activeForeground": "#5c6166",
        "editor.selectionBackground": "#035bd626",
        "editor.lineHighlightBackground": "#f0f0f000",
        "editorCursor.foreground": "#ff6a00",
        "editorWhitespace.foreground": "#5c61661a",
        "editorIndentGuide.background": "#5c61661a",
        "editorBracketMatch.background": "#5c616626",
        "editorBracketMatch.border": "#5c616600",
      },
    });

    monaco.editor.setTheme("ayuLight");

    editor.updateOptions({
      fontSize: 16,
      lineHeight: 26,
      fontFamily: `"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", Consolas, monospace`,
      fontWeight: "400",
      letterSpacing: 0.5,
      cursorBlinking: "smooth",
      bracketPairColorization: { enabled: false },
      guides: {
        bracketPairs: false,
        indentation: false,
      },
      minimap: { enabled: false },
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      smoothScrolling: true,
      renderLineHighlight: "none",
      lineNumbers: "on",
      lineNumbersMinChars: 4,
      glyphMargin: false,
      occurrencesHighlight: false,
      selectionHighlight: false,
      matchBrackets: "never",
      renderWhitespace: "none",
      renderControlCharacters: false,
    });
  };

  const handleCodeChange = (value) => {
    if (onChange) {
      onChange(value);
    }
    if (roomId && socketRef.current?.connected && !isLocalChange.current) {
      isLocalChange.current = true;
      socketRef.current.emit("code-update", { roomId, code: value });
      setTimeout(() => {
        isLocalChange.current = false;
      }, 100);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {!hideHeader && (
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-gray-700 font-medium text-sm">app.js</span>
          </div>

          <button
            onClick={onExecute}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            Run Code
          </button>
        </div>
      )}

      <div className={hideTerminal ? "flex-1" : "flex-1"}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="ayuLight"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorMount}
          options={{
            fontSize: 16,
            lineHeight: 26,
            minimap: { enabled: false },
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
            lineNumbers: "on",
            lineNumbersMinChars: 4,
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            parameterHints: false,
            wordBasedSuggestions: false,
            inlineSuggest: false,
            renderWhitespace: "none",
            renderLineHighlight: "none",
            fontFamily:
              '"JetBrains Mono", "Fira Code", "SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", Consolas, monospace',
            fontWeight: "400",
            letterSpacing: 0.5,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            mouseWheelScrollSensitivity: 1,
            fastScrollSensitivity: 5,
            bracketPairColorization: { enabled: false },
            guides: {
              bracketPairs: false,
              indentation: false,
            },
            occurrencesHighlight: false,
            selectionHighlight: false,
            matchBrackets: "never",
          }}
        />
      </div>

      {!hideTerminal && (
        <div className="h-[30%] bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200/60">
          <Terminal output={output} />
        </div>
      )}
    </div>
  );
}