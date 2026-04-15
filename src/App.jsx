import './App.css';
import {useState, useEffect} from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [users, setUsers] = useState([])
  const [filterUserId, setFilterUserId] = useState('all')
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortDate, setSortDate] = useState('asc')

  const [visibleCompleted, setVisibleCompleted] = useState(5)
  const [visibleUncompleted, setVisibleUncompleted] = useState(5)

  //reading and displaying info from api
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => setTodos(data))

    fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => setUsers(data))
  }, [])

  //combine filters
  const filteredTodos = filterUserId === 'all'
    ? todos
    : todos.filter(todo => todo.userId.toString() === filterUserId)
  
  //using for fact-checking might remove later
  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId)
    return user ? user.name : '${userId}'
  }

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

    if (setSortDate === "asc"){
      return a.completedAt - b.completedAt 
    } else {
      return b.completedAt - a.completedAt
    }
  })

  //separating so they don't 'load more' simultaneously
  const showMoreUncompleted = () => {
    setVisibleUncompleted(prevValue => prevValue + 5)
  }

  const showMoreCompleted = () => {
    setVisibleCompleted(prevValue => prevValue + 5)
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  //button for moving tasks
  const moveTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { 
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date() : null
        }
      }
      else {
        return todo
      }
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

        <div>
        <label>Filter by:</label>
        <select value={filterUserId} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="all">All</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
            {user.name}
          </option>
          ))}          
        </select>
        </div>

        <div>
        <label>Sort: </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        </div>

        <div>
        <label>Sort date: </label>
        <select value={sortDate} onChange={(e) => setSortDate(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        </div>
      </div>

      <div className ="flex-container">
      <div className="flex-item">
        <h1>uncomplete todos</h1>
        {sortUncompletedTodos.slice(0, visibleUncompleted).map(todo => (
          <div key={todo.id} className="todo-item">
            <span>{getUserName(todo.userId)}: </span>
            {todo.title}
            <button onClick={() => moveTodo(todo.id)}>Complete</button>
          </div>
        ))}
        <button onClick={showMoreUncompleted}>Load more</button>
      </div>
      <div className="flex-item">
        <h1>complete todos</h1>
        {sortCompletedTodos.slice(0, visibleCompleted).map(todo => (
          <div key={todo.id} className="todo-item">
            <span>{getUserName(todo.userId)}: </span>
            {todo.title}

            {todo.completedAt && (
              <div>Completed on: {formatDate(todo.completedAt)}</div>
            )}

            <button onClick={() => moveTodo(todo.id)}>Undo</button>
          </div>
        ))}
        <button onClick={showMoreCompleted}>Load more</button>
      </div>
      </div>
    </div>
  )
}

export default App