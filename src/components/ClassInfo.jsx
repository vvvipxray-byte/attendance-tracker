import { useState } from 'react'

function ClassInfo({ subject, instructor, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftSubject, setDraftSubject] = useState(subject)
  const [draftInstructor, setDraftInstructor] = useState(instructor)
  const [error, setError] = useState('')

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const startEditing = () => {
    setDraftSubject(subject)
    setDraftInstructor(instructor)
    setError('')
    setIsEditing(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const cleanSubject = draftSubject.trim().replace(/\s+/g, ' ')
    const cleanInstructor = draftInstructor.trim().replace(/\s+/g, ' ')

    if (cleanSubject === '') {
      setError('Please enter the subject.')
      return
    }
    if (cleanInstructor === '') {
      setError('Please enter the instructor name.')
      return
    }

    onSave({ subject: cleanSubject, instructor: cleanInstructor })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <section className="class-info">
        <form className="class-form" onSubmit={handleSubmit}>
          <label htmlFor="subject" className="name-label">Subject</label>
          <input
            id="subject"
            className="name-input"
            type="text"
            value={draftSubject}
            onChange={(e) => setDraftSubject(e.target.value)}
            maxLength={80}
            autoComplete="off"
          />

          <label htmlFor="instructor" className="name-label">Instructor</label>
          <input
            id="instructor"
            className="name-input"
            type="text"
            placeholder="Instructor's full name"
            value={draftInstructor}
            onChange={(e) => setDraftInstructor(e.target.value)}
            maxLength={60}
            autoComplete="off"
            autoFocus
          />
          {error && <p className="error">{error}</p>}

          <div className="buttons">
            <button type="submit" className="btn btn-plus">Save</button>
            <button
              type="button"
              className="btn btn-reset"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    )
  }

  return (
    <section className="class-info">
      <div className="class-details">
        <p className="class-subject">{subject}</p>
        <p className="class-instructor">
          Instructor:{' '}
          {instructor ? (
            <strong>{instructor}</strong>
          ) : (
            <em className="not-set">Not set yet</em>
          )}
        </p>
        <p className="class-date">{today}</p>
      </div>
      <button className="edit-btn" onClick={startEditing}>
        {instructor ? 'Edit' : 'Set instructor'}
      </button>
    </section>
  )
}

export default ClassInfo
