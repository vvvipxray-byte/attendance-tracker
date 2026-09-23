function AttendanceSummary({ present, total, recorded }) {
  const absent = total - present
  const rate = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0'
  const notRecorded = total - recorded

  return (
    <section className="summary">
      <div className="stat">
        <span className="stat-label">Present</span>
        <span className="stat-value present">{present}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Absent</span>
        <span className="stat-value absent">{absent}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Attendance Rate</span>
        <span className="stat-value">{rate}%</span>
      </div>

      <div className="progress">
        <div className="progress-bar" style={{ width: `${rate}%` }} />
      </div>

      <p className="summary-note">
        {recorded} of {total} students recorded
        {notRecorded > 0 && ` · ${notRecorded} not yet recorded (counted as absent)`}
      </p>
    </section>
  )
}

export default AttendanceSummary
