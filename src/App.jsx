import './App.css';
import {useState, useEffect} from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [users, setUsers] = useState([])
  const [filterUserId, setFilterUserId] = useState('all')

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


  //button for moving tasks
  const moveTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed}
      }
      else {
        return todo
      }
    })
    setTodos(updatedTodos)
  }

  const handleFilterChange = (userId) => {
    setFilterUserId(userId)
  }

  return (
    <div>
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

      <div className ="flex-container">
      <div className="flex-item">
        <h1>uncomplete todos</h1>
        {uncompletedTodos.map(todo => (
          <div key={todo.id} className="todo-item">
            <span>{getUserName(todo.userId)}: </span>
            {todo.title}
            <button onClick={() => moveTodo(todo.id)}>Complete</button>
          </div>
        ))}
      </div>
      <div className="flex-item">
        <h1>complete todos</h1>
        {completedTodos.map(todo => (
          <div key={todo.id} className="todo-item">
            <span>{getUserName(todo.userId)}: </span>
            {todo.title}
            <button onClick={() => moveTodo(todo.id)}>Undo</button>
          </div>
        ))}
      </div>
      </div>
    </div>
  )

}



export default App