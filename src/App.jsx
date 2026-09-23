import { useState, useEffect } from 'react'
import AttendanceControls from './components/AttendanceControls.jsx'
import AttendanceSummary from './components/AttendanceSummary.jsx'
import StudentList from './components/StudentList.jsx'
import LiveClock from './components/LiveClock.jsx'
import ClassInfo from './components/ClassInfo.jsx'
import './App.css'

const TOTAL = 40
const STORAGE_KEY = 'attendance-tracker-students'
const CLASS_INFO_KEY = 'attendance-tracker-class-info'
const DEFAULT_CLASS_INFO = {
  subject: 'Web System And Technologies 2',
  instructor: '',
}

function loadClassInfo() {
  try {
    const saved = JSON.parse(localStorage.getItem(CLASS_INFO_KEY))
    return saved ? { ...DEFAULT_CLASS_INFO, ...saved } : DEFAULT_CLASS_INFO
  } catch {
    return DEFAULT_CLASS_INFO
  }
}

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(saved)) return []
    // Older saves have no status: those students were all present
    return saved
      .slice(0, TOTAL)
      .map((student) => ({ ...student, status: student.status ?? 'present' }))
  } catch {
    return []
  }
}

function App() {
  // State lives in App and is passed down to children (lifting state up)
  const [students, setStudents] = useState(loadStudents)
  const [classInfo, setClassInfo] = useState(loadClassInfo)

  const presentStudents = students.filter((s) => s.status === 'present')
  const absentStudents = students.filter((s) => s.status === 'absent')
  const present = presentStudents.length // starts at 0

  // Adds a named student with the given status.
  // Returns an error message, or null on success.
  const addStudent = (name, status) => {
    const cleanName = name.trim().replace(/\s+/g, ' ')

    if (cleanName === '') {
      return 'Please enter a student name.'
    }
    if (students.length >= TOTAL) {
      return `The class already has ${TOTAL} students.`
    }
    const existing = students.find(
      (student) => student.name.toLowerCase() === cleanName.toLowerCase()
    )
    if (existing) {
      const listName = existing.status === 'present' ? 'Present' : 'Absent'
      return `${existing.name} is already in the ${listName} list.`
    }

    const newStudent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: cleanName,
      status,
      time: new Date().toLocaleTimeString(),
    }
    // Functional update; the class can never go above TOTAL
    setStudents((prev) => (prev.length >= TOTAL ? prev : [...prev, newStudent]))
    return null
  }

  const handleIncrement = (name) => addStudent(name, 'present')
  const handleAddAbsent = (name) => addStudent(name, 'absent')

  // Changes a student's status and moves them to the end of the list,
  // so each list stays in the order students were marked
  const setStatus = (id, status) => {
    setStudents((prev) => {
      const student = prev.find((s) => s.id === id)
      if (!student || student.status === status) return prev
      const updated = { ...student, status, time: new Date().toLocaleTimeString() }
      return [...prev.filter((s) => s.id !== id), updated]
    })
  }

  // Moves the most recently marked present student to Absent;
  // the present count can never go below 0
  const handleDecrement = () => {
    const lastPresent = presentStudents[presentStudents.length - 1]
    if (lastPresent) setStatus(lastPresent.id, 'absent')
  }

  const handleMarkPresent = (id) => setStatus(id, 'present')
  const handleMarkAbsent = (id) => setStatus(id, 'absent')

  // Removes one student from the class entirely
  const handleRemove = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id))
  }

  // Bonus: reset using the functional update form
  const handleReset = () => {
    setStudents(() => [])
  }

  // Update the browser tab title whenever present changes
  useEffect(() => {
    document.title = `Present: ${present}/${TOTAL}`
  }, [present])

  // Save the class so it survives a page refresh
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
    } catch {
      // Storage unavailable (e.g. private mode): the app still works without it
    }
  }, [students])

  // Save the subject and instructor
  useEffect(() => {
    try {
      localStorage.setItem(CLASS_INFO_KEY, JSON.stringify(classInfo))
    } catch {
      // Storage unavailable: the app still works without it
    }
  }, [classInfo])

  return (
    <main className="app">
      <header className="app-header">
        <h1>Attendance Tracker</h1>
        <LiveClock />
      </header>

      <ClassInfo
        subject={classInfo.subject}
        instructor={classInfo.instructor}
        onSave={setClassInfo}
      />

      <AttendanceSummary
        present={present}
        total={TOTAL}
        recorded={students.length}
      />

      <AttendanceControls
        present={present}
        total={TOTAL}
        isClassFull={students.length >= TOTAL}
        hasStudents={students.length > 0}
        onIncrement={handleIncrement}
        onAddAbsent={handleAddAbsent}
        onDecrement={handleDecrement}
        onReset={handleReset}
      />

      <div className="lists">
        <StudentList
          title="Present Students"
          variant="present"
          students={presentStudents}
          emptyText="No students marked present yet."
          moveLabel="Mark absent"
          onMove={handleMarkAbsent}
          onRemove={handleRemove}
        />
        <StudentList
          title="Absent Students"
          variant="absent"
          students={absentStudents}
          emptyText="No students marked absent yet."
          moveLabel="Mark present"
          onMove={handleMarkPresent}
          onRemove={handleRemove}
        />
      </div>
    </main>
  )
}

export default App
