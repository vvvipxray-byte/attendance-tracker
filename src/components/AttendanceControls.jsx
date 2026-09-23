import { useState } from 'react'

function AttendanceControls({
  present,
  total,
  isClassFull,
  hasStudents,
  onIncrement,
  onAddAbsent,
  onDecrement,
  onReset,
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  // Runs the given add callback and shows its error, or clears the input
  const addWith = (addCallback) => {
    const errorMessage = addCallback(name)

    if (errorMessage) {
      setError(errorMessage)
    } else {
      setName('')
      setError('')
    }
  }

  // Pressing Enter in the input marks the student present
  const handleSubmit = (event) => {
    event.preventDefault()
    addWith(onIncrement)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
    if (error) setError('')
  }

  const handleReset = () => {
    if (window.confirm('Clear all students from both lists?')) {
      onReset()
      setError('')
    }
  }

  return (
    <section className="controls">
      <form className="name-form" onSubmit={handleSubmit}>
        <label htmlFor="student-name" className="name-label">
          Student name
        </label>
        <input
          id="student-name"
          className={`name-input ${error ? 'has-error' : ''}`}
          type="text"
          placeholder={isClassFull ? `Class is full (${total} students)` : 'e.g. Juan Dela Cruz'}
          value={name}
          onChange={handleNameChange}
          maxLength={50}
          disabled={isClassFull}
          autoComplete="off"
        />
        {error && <p className="error">{error}</p>}

        <div className="buttons">
          <button type="submit" className="btn btn-plus" disabled={isClassFull}>
            + Present
          </button>
          <button
            type="button"
            className="btn btn-absent"
            onClick={() => addWith(onAddAbsent)}
            disabled={isClassFull}
          >
            + Absent
          </button>
        </div>
        <div className="buttons">
          <button
            type="button"
            className="btn btn-minus"
            onClick={onDecrement}
            disabled={present <= 0}
            title="Move the last student marked present to Absent"
          >
            − Present
          </button>
          <button
            type="button"
            className="btn btn-reset"
            onClick={handleReset}
            disabled={!hasStudents}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  )
}

export default AttendanceControls
