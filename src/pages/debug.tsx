import { useEffect, useState } from "react";

export default function Debug() {
  const [logs, setLogs] = useState<any[]>([]);
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    const loadLogs = () => {
      const storedLogs = localStorage.getItem("auth_logs");
      if (storedLogs) {
        try {
          setLogs(JSON.parse(storedLogs));
        } catch (e) {
          console.error("로그 파싱 실패:", e);
        }
      }
      setCookies(document.cookie);
    };

    loadLogs();
    const interval = setInterval(loadLogs, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    localStorage.removeItem("auth_logs");
    setLogs([]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>인증 디버그 페이지</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>현재 쿠키</h2>
        <div style={{
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          fontFamily: "monospace",
          wordBreak: "break-all"
        }}>
          {cookies || "쿠키가 없습니다"}
        </div>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>로그 ({logs.length}개)</h2>
        <button
          onClick={clearLogs}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          로그 지우기
        </button>
      </div>

      <div style={{
        maxHeight: "600px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "10px"
      }}>
        {logs.length === 0 ? (
          <div style={{ color: "#999" }}>로그가 없습니다.</div>
        ) : (
          logs.slice().reverse().map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                borderRadius: "4px",
                borderLeft: "3px solid #007bff"
              }}
            >
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                {new Date(log.time).toLocaleString()}
              </div>
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {log.message}
              </div>
              {log.data && (
                <pre style={{
                  fontSize: "12px",
                  backgroundColor: "#f0f0f0",
                  padding: "8px",
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "200px",
                  margin: 0
                }}>
                  {log.data}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

