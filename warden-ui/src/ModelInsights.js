import React, {useState, useEffect, useRef} from 'react'
import "./ModelInsights.css";
import { round } from './utilities';


function ModelInsights({rawLogs, approvedTxnLogs, rejectedTxnLogs, cacheMissLogs, 
  duplicateTxnLogs, watchDogLogs, processedTxnTotal, emissionStatus,
  averageLatency}) {

  const [selectedLogType, setSelectedLogType] = useState("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logsEndRef = useRef(null);

  // const [rawLogs, setRawLogs] = useState([
  //   {txnId: "eof876", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "oop877", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "afg878", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "ajg535", status: "REJECTED", type: "REJECTED_TXN"},
  //   {txnId: "dge879", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "bbn241", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "agh342", userId: "981", type: "REDIS_CACHE_MISS"},
  //   {txnId: "akg911", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "vja532", status: "DUPLICATE", type: "DUPLICATE_TXN"},
  //   {txnId: "prt948", status: "REJECTED", type: "REJECTED_TXN"},
  //   {type: "WATCHDOG_RUNNING"},
  //   {txnId: "abn641", status: "APPROVED", type: "APPROVED_TXN"},
  // ]);
  // const [approvedTxnLogs, setApprovedTxnLogs] = useState([
  //   {txnId: "eof876", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "oop877", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "afg878", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "dge879", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "akg911", status: "APPROVED", type: "APPROVED_TXN"},
  //   {txnId: "bbn241", status: "APPROVED", type: "APPROVED_TXN"},
  // ]);
  // const [rejectedTxnLogs, setRejectedTxnLogs] = useState([
  //   {txnId: "ajg535", status: "REJECTED", type: "REJECTED_TXN"},
  //   {txnId: "prt948", status: "REJECTED", type: "REJECTED_TXN"},
  //   {txnId: "cag841", status: "REJECTED", type: "REJECTED_TXN"},
  // ]);
  // const [duplicateTxnLogs, setDuplicateTxnLogs] = useState([
  //   {txnId: "vja532", status: "DUPLICATE", type: "DUPLICATE_TXN"},
  // ]);  // DUPLICATE or RETRY 
  // const [cacheMissLogs, setCacheMissLogs] = useState([
  //   {txnId: "agh342", userId: "981", type: "REDIS_CACHE_MISS"},
  // ]);  // Redis Cache Miss for userId logs
  // const [watchDogLogs, setWatchDogLogs] = useState([
  //   {type: "WATCHDOG_RUNNING"}
  // ]);

  const logTypeToLabel = {
    APPROVED_TXN: "LEGIT_TXN",
    REJECTED_TXN: "FRAUD_TXN",
    DUPLICATE_TXN: "DUPLICATE/RETRY",
    REDIS_CACHE_MISS: "CACHE_MISS",
    WATCHDOG_RUNNING: "WATCHDOG"
  }

  const getLogMessage = (logType, logObj) => {
    // messages returned for each specific  log type

    const shortTxnId = logObj.txnId ? (logObj.txnId.length > 5 ? logObj.txnId.slice(0, 5) : logObj.txnId) : "N/A";
    let string = "";

    if(logType === "APPROVED_TXN") {
      string = `Transaction on txnId '${shortTxnId}' cleared successfully.`
    }
    else if(logType === "REJECTED_TXN") {
      string = `High Risk Vector Blocked: txnId '${shortTxnId}' likely fraud`
    }
    else if(logType === "DUPLICATE_TXN") {
      string = `txnId '${shortTxnId}' Intercepted: Duplicate or retry event signature.`
    }
    else if(logType === "REDIS_CACHE_MISS") {
      string = `Cache Miss for userId '${logObj.userId}'. Routing fallback query to Postgres.`
    }
    else if(logType === "WATCHDOG_RUNNING") {
      string = `Watchdog Sweeper Active: Reconciling stuck pending transactions`
    }

    return string;
  }

  const logStyles = {
    APPROVED_TXN:     { bg: '#d1fae5', text: '#09b523'},
    REJECTED_TXN:     { bg: '#ffd7d7', text: '#c11b1b'},
    DUPLICATE_TXN:    { bg: '#fef3c7', text: '#cb8a09'},
    REDIS_CACHE_MISS: { bg: '#cee8ff', text: '#1394da'},
    WATCHDOG_RUNNING: { bg: '#ebd8ff', text: '#9522f4'}
  };

  // Clean mapping configuration option dictionary defining label configurations
  const filterOptions = [
    { value: "ALL", label: "All Logs" },
    { value: "APPROVED_TXN", label: "Legit Logs" },
    { value: "REJECTED_TXN", label: "Fraud Logs" },
    { value: "DUPLICATE_TXN", label: "Duplicate / Retry Logs" },
    { value: "REDIS_CACHE_MISS", label: "Cache Misses" },
    { value: "WATCHDOG_RUNNING", label: "Watchdog Cron Runs" }
  ];

  // Dynamically resolve what title should be displayed on the closed trigger label button
  const activeSelectionLabel = filterOptions.find(opt => opt.value === selectedLogType)?.label || "All Logs";

  // Maps selection keys directly to their respective state metrics arrays
  const telemetryDataRegistry = {
    ALL: rawLogs,
    APPROVED_TXN: approvedTxnLogs,
    REJECTED_TXN: rejectedTxnLogs,
    DUPLICATE_TXN: duplicateTxnLogs,
    REDIS_CACHE_MISS: cacheMissLogs,
    WATCHDOG_RUNNING: watchDogLogs
  };

  const activeDisplayCollection = telemetryDataRegistry[selectedLogType] || rawLogs;

  // const emission = "THROTTLED";

  const statusConfigs = {
    IDLE: { label: "IDLE STATE", color: "#6b7280" },
    ACTIVE: { label: "ACTIVE STREAMING", color: "#12de71" },
    THROTTLED: { label: "THROTTLED (BACKPRESSURE RETREAT)", color: "#f1b00d" }
  };

  const activeStatus = statusConfigs[emissionStatus] || statusConfigs.IDLE;

  useEffect(() => {
    if (logsEndRef.current) {
      // 'auto' cuts down rendering animation overhead under high streaming load.
      // Swap to behavior: 'smooth' if you prefer a rolling crawl effect.
      logsEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [rawLogs]);

  const fakeMetrics = {
    totalSettled: 161,
    legitClearances: 121,
    fraudBlocks: 35,
    idempotencyDrops: 6,
    redisCacheMisses: 3,
    avgProcessingTime: 2345  // in ms
  }


  const logMetrics = {
    totalSettled: (approvedTxnLogs.length + rejectedTxnLogs.length),
    legitClearances: (approvedTxnLogs.length),
    fraudBlocks: (rejectedTxnLogs.length),
    idempotencyDrops: (duplicateTxnLogs.length),
    redisCacheMisses: (cacheMissLogs.length),
    avgProcessingTime: averageLatency
  };

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [])

  if(loading) {
    return (
      <div className="loading-msg">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="model-insights">
      <div className="model-insights-header">
        Telemetry & Observability
      </div>

      <div className="emission-status-section">
      <p>Emission Pipeline: </p>
        <span style={{color: statusConfigs[emissionStatus].color}}>
          {activeStatus.label}
        </span>
      </div>

      <div className="logging-section">
        <div className="logging-section-header">
          <div className="custom-select-wrapper">
            
            {/* The clickable main trigger component face - always themes green first */}
            <div 
              className={`dropdown-trigger-face ${isDropdownOpen ? "active-panel-open" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <p>{activeSelectionLabel}</p>
              <span className="material-symbols-outlined">
                {isDropdownOpen ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            </div>

            {/* The absolute overlay element container sheet - opens with a crisp clean white background */}
            {isDropdownOpen && (
              <div className="dropdown-options-overlay-sheet">
                {filterOptions.map((option) => (
                  <div 
                    key={option.value} 
                    className={`individual-option-row ${selectedLogType === option.value ? 'selected-row-match' : ''}`}
                    onClick={() => {
                      setSelectedLogType(option.value);
                      setIsDropdownOpen(false); // Snap shut instantly upon choosing option row
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="logs">
          {activeDisplayCollection.length === 0 &&
            <div className="no-logs">
              <p>No logs for display!</p>
            </div>
          }
          {activeDisplayCollection.map((logObj, index) => {
            
            return (
              <div className="each-log" key={index}
              style={{background: logStyles[logObj.type].bg}}>
                <div className="log-time"
                >
                  {logObj.arrivalHeaderTime || "00:00:00"}
                </div>
                <div className="log-label"
                style={{background: logStyles[logObj.type].text}}>
                  {logTypeToLabel[logObj.type]}
                </div>
                <div className="log-message">
                  {getLogMessage(logObj.type, logObj)}
                </div>
              </div>
            )
          })}

          <div ref={logsEndRef} style={{ height: "0px", visibility: "hidden" }} />
        </div>
      </div>

      <div className="metrics-section">
        <div className="metrics-section-header">
          Real-time Metrics
        </div>
        <div className="metrics">
          <div id="metrics-left">
            <div className="each-metric">
              <p>Total Settled:</p>
              <span>{logMetrics.totalSettled}</span>
            </div>
            <div className="each-metric">
              <p>Legit Clearances:</p>
              <span style={{color: logStyles.APPROVED_TXN.text}}>
                {logMetrics.legitClearances}
              </span>
            </div>
            <div className="each-metric">
              <p>Fraud Blocks:</p>
              <span style={{color: logStyles.REJECTED_TXN.text}}>
                {logMetrics.fraudBlocks}
              </span>
            </div>
          </div>
          <div id="metrics-right">
            <div className="each-metric">
              <p>Idempotency Drops:</p>
              <span style={{color: logStyles.DUPLICATE_TXN.text}}>
                {logMetrics.idempotencyDrops}
              </span>
            </div>
            <div className="each-metric">
              <p>Redis Cache Misses:</p>
              <span style={{color: logStyles.REDIS_CACHE_MISS.text}}>
                {logMetrics.redisCacheMisses}
              </span>
            </div>
            <div className="each-metric">
              <p>Avg Processing Time:</p>
              <span>
                {round(logMetrics.avgProcessingTime, 2)} ms
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ModelInsights