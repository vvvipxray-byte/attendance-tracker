function StudentList({ title, variant, students, emptyText, moveLabel, onMove, onRemove }) {
  return (
    <section className={`student-list ${variant}`}>
      <h2>
        {title} <span className="count">{students.length}</span>
      </h2>

      {students.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <ol>
          {students.map((student, index) => (
            <li key={student.id} className="student">
              <span className="student-number">{index + 1}</span>
              <span className="student-info">
                <span className="student-name">{student.name}</span>
                <span className="student-time">{student.time}</span>
              </span>
              <button
                className="move-btn"
                onClick={() => onMove(student.id)}
                aria-label={`${moveLabel}: ${student.name}`}
              >
                {moveLabel}
              </button>
              <button
                className="remove-btn"
                onClick={() => onRemove(student.id)}
                aria-label={`Remove ${student.name}`}
                title={`Remove ${student.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default StudentList
