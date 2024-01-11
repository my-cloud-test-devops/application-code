import {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleCharactersError = (value) => {
    if (value.length < 3 || value.length > 50) {
      throw new Error(  
        alert(
          'Todo must have at least 3 characters and less than 50 characters.'
        )
      );
    }
  };

  const apiUrl = 'http://demo-alb-470743486.us-east-1.elb.amazonaws.com:8080'

  const addTodo = async () => {
    handleCharactersError(todo);

    try {
      await axios.post(`${apiUrl}/create`, {
        todo,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAllTodos = async () => {
    try {
      await axios
        .get(apiUrl)
        .then((response) => {
          setTodoList(response.data);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateTodo = async (id) => {
    handleCharactersError(newTodo);

    try {
      await axios
        .put(`${apiUrl}/update/${id}`, {
          id,
          todo: newTodo,
        })
        .then((response) => {
          console.log(response.data);
          setTodoList(
            todoList.map((val) =>
              val.id === id ? {id: val.id, todo: val.todo} : val
            )
          );
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios
        .delete(`${apiUrl}/${id}`)
        .then((response) => {
          setTodoList(todoList.filter((val) => val.id !== id));
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addTodo();
    setTodo('');
  };

  useEffect(() => {
    getAllTodos();
  }, [todoList]);

  return (
    <div className='App'>
      <Layout>
        <TodoForm handleSubmit={handleSubmit} setTodo={setTodo} todo={todo} />
        <TodoList
          todoList={todoList}
          setNewTodo={setNewTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
      </Layout>
    </div>
  );
}

export default App;
