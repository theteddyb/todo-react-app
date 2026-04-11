import './App.css';
import {useState, useEffect} from 'react'

function App() {
  const [todos, setTodos] = useState([])

  //reading and displaying info from api
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(data => setTodos(data))
  }, [])

  // return (
  //   <ul>
  //     {todos.map(todo => (
  //       <li key={todo.id}>{todo.title}</li>
  //     ))}
  //   </ul>
  // )
    
  //creating consts to filter through the todos
  const completedTodos = todos.filter(todo => todo.completed)
  const uncompletedTodos = todos.filter(todo => !todo.completed)

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

  return (
    <div className ="flex-container">
      <div className="flex-item">
        <h1>uncomplete todos</h1>
        {uncompletedTodos.map(todo => (
          <div>{todo.title}
          <button onClick={() => moveTodo(todo.id)}>Complete</button>
          </div>
        ))}
      </div>
      <div className="flex-item">
        <h1>complete todos</h1>
        {completedTodos.map(todo => (
          <div>{todo.title}
          <button onClick={() => moveTodo(todo.id)}>Undo</button>
          </div>
        ))}
      </div>
    </div>
  )

}



export default App