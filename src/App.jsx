import './App.css';
import {useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [todos, setTodos] = useState([])
  const [users, setUsers] = useState([])
  const [filterUserId, setFilterUserId] = useState('all')
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortDate, setSortDate] = useState('asc')

  const [visibleCompleted, setVisibleCompleted] = useState(5)
  const [visibleUncompleted, setVisibleUncompleted] = useState(5)

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)

  const filterRef = useRef(null)
  const sortRef = useRef(null)
  const dateRef = useRef(null)

  //reading and displaying info from api
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => {
      //adding dates to all elements so they can be sorted by date
      const todosWithDates = data.map(todo => {
      if(todo.completed) {
        return {
          ...todo,
          completedAt:new Date('2026-01-01').toISOString()
        }
      }
      return todo
    }
    )
    setTodos(todosWithDates)
    })
    

    fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => setUsers(data))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false)
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

    const filterOptions = [
    {value: 'all', label: 'All Users'},
    ...users.map(user => ({value: user.id.toString(), label: user.name}))
  ]



  //combine filters
  const filteredTodos = filterUserId === 'all'
    ? todos
    : todos.filter(todo => todo.userId.toString() === filterUserId)
  
  // //using for fact-checking might remove later
  // const getUserName = (userId) => {
  //   const user = users.find(user => user.id === userId)
  //   return user ? user.name : '${userId}'
  // }

  //creating consts to filter through the todos
  const completedTodos = filteredTodos.filter(todo => todo.completed)
  const uncompletedTodos = filteredTodos.filter(todo => !todo.completed)

  const sortUncompletedTodos = [...uncompletedTodos].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  })
  

  const sortCompletedTodos = [...completedTodos].sort((a,b) => {
    if (!a.completedAt || !b.completedAt) {
      return 0
    }
    if (!a.completedAt) return 1
    if (!b.completedAt) return -1

    const dateA = new Date(a.completedAt).getTime()
    const dateB = new Date(b.completedAt).getTime()

    if (sortDate === "asc"){
      return dateB - dateA
    } else {
      return dateA- dateB
    }
  })

  //separating so they don't 'load more' simultaneously
  const showMoreUncompleted = () => {
    setVisibleUncompleted(prevValue => prevValue + 5)
  }

  const showMoreCompleted = () => {
    setVisibleCompleted(prevValue => prevValue + 5)
  }

  //date formatting to string for comparison
  const formatDate = (dateInput) => {
    if (!dateInput) return ''
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  //button for moving tasks
  const moveTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const newTodo = {...todo}

        newTodo.completed = !newTodo.completed

        if (newTodo.completed === true) {
          newTodo.completedAt = new Date().toISOString()
          console.log('Date added:', newTodo.completedAt)
        }
        else {
          delete newTodo.completedAt
          console.log('Date removed from todo:', id)
        }
        return newTodo
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  //reset after filter/reload
  const handleFilterChange = (userId) => {
    setFilterUserId(userId)
    setVisibleUncompleted(5)
    setVisibleCompleted(5)
  }



  return (
    <div>
      <div className="dropdown">

        <div className="dropdowns-container">
          <div className="dropdown" ref={filterRef}>
            <label className="dropdown-label">Filter by:</label>
            <div 
              className={`dropdown-content ${isFilterOpen ? "content-open" : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              User
            <span className="toggle-icon"> 
              <FontAwesomeIcon icon={isFilterOpen ? faChevronUp : faChevronDown} />
            </span>

            <div className="selected-value">
              {filterOptions.find(option => option.value === filterUserId)?.label || 'All'}
            </div>

            {isFilterOpen && (
              <div className="dropdown-options">
                <div className={`dropdown-option ${filterUserId === 'all' ? 'selected' : ''}`}
                onClick={() => {
                  handleFilterChange('all')
                  setIsFilterOpen(false)
              }}
              >
                All
                </div>
                {users.map(user => (
                  <div key={user.id} className={`dropdown-option ${filterUserId === user.id.toString() ? 'selected' : ''}`}
                  onClick={() => {
                    handleFilterChange(user.id.toString())
                    setIsFilterOpen(false)
                  }}>
                    {user.name}
                  </div>
                ))}
                </div>
            )}

            </div>

          </div>

        


            <div className="dropdown" ref={sortRef}>
              <label className="dropdown-label">Sort:</label>
              <div className={`dropdown-content ${isSortOpen ? "content-open" : ''}`}
              onClick={() => setIsSortOpen(!isSortOpen)}>
                Title
                <span className="toggle-icon">
                  <FontAwesomeIcon icon={isSortOpen ? faChevronUp : faChevronDown} />
                </span>
                <div className="selected-value">
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </div>
                {isSortOpen && (
                  <div className="dropdown-options">
                    <div className={`dropdown-option ${sortOrder === 'asc'? 'selected': ''}`}
                    onClick={() => {
                      setSortOrder('asc')
                      setIsSortOpen(false)
                    }}>
                      Ascending
                    </div>
                    <div className={`dropdown-option ${sortOrder === 'desc' ? 'selected' : ''}`}
                    onClick={() => {
                      setSortOrder('desc')
                      setIsSortOpen(false)
                    }}>
                      Descending
                    </div>
                  </div>
                )}
              </div>

            </div>

          <div className="dropdown" ref={dateRef}>
            <label className="dropdown-label">Sort:</label>
            <div className={`dropdown-content ${isDateOpen ? "content-open" : ''}`}
            onClick={() => setIsDateOpen(!isDateOpen)}>
              Date
              <span className="toggle-icon">
                <FontAwesomeIcon icon={isDateOpen ? faChevronUp : faChevronDown} />
              </span>
              <div className="selected-value">
                {sortDate === 'asc' ? 'Ascending' : 'Descending'}
              </div>

              {isDateOpen && (
                <div className="dropdown-options">
                  <div className={`dropdown-option ${sortDate === 'asc' ? 'selected' : ''}`}
                  onClick={() => {
                    setSortDate('asc')
                    setIsDateOpen(false)
                  }}>
                    Ascending
                  </div>
                  <div className={`dropdown-option ${sortDate === 'desc' ? 'selected' : ''}`}
                  onClick={() => {
                    setSortDate('desc')
                    setIsDateOpen(false)
                  }}>
                    Descending
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>  


      </div>


      <div className ="flex-container">
      <div className="flex-item">
        <h1>Pending: </h1>
        {sortUncompletedTodos.slice(0, visibleUncompleted).map(todo => (
          <div key={todo.id} className="todo-item">
            {/* <span>{getUserName(todo.userId)}: </span> */}
            {todo.title}
            <button className="complete-btn" onClick={() => moveTodo(todo.id)}>Complete</button>
          </div>
        ))}
        {visibleUncompleted < sortUncompletedTodos.length && (
          <button className="load-more-btn" onClick={showMoreUncompleted}>Load more</button>
        )}
        
      </div>
      <div className="flex-item">
        <h1>Completed: </h1>
        {sortCompletedTodos.slice(0, visibleCompleted).map(todo => (
          <div key={todo.id} className="todo-item">
            {/* <span>{getUserName(todo.userId)}: </span> */}
            {todo.title}
            
            {todo.completedAt && (
              <div>Completed on: {formatDate(todo.completedAt)}</div>
            )}

            <button className="undo-btn" onClick={() => moveTodo(todo.id)}>Undo</button>
            
          </div>

        ))}
        {visibleCompleted < sortCompletedTodos.length && (
          <button className="load-more-btn" onClick={showMoreCompleted}>Load more</button>
        )}
        
      </div>
      </div>
    </div>
  )
}

export default App