import { useEffect, useState } from 'react';
import { axiosPrivate } from '../../service/api';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../state/slices/userSlice';


const TodoList = (props) => {
    const [todos, setTodos] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                const response = await axiosPrivate.get("/todos");
                setTodos(response?.data?.todos);
            } catch (error) {
                console.log(error)
                if (error.response.data.reAuthenticate) {
                    dispatch(clearUser());
                }
            }
        })();

    }, [])

    return (
        <div className="bg-gray-200 p-4">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            <ul>
                {todos && todos.map((todo) => (
                    <li key={todo} className="mb-2">{todo}</li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;