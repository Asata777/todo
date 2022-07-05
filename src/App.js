import './App.css'
import { useState, useRef, useEffect } from 'react'
import { useAppContext } from './contexts/appContext';
const statuses = {
  done: ['Выполено', 'green'],
  edit: ['Редактировано', 'orange']
}
let id = 7
export default function App() {
  const { state, dispatch } = useAppContext()
  const nameRef = useRef(),
    emailRef = useRef(),
    textRef = useRef(),
    loginRef = useRef(),
    passwordRef = useRef(),
    editNameRef = useRef(),
    editEmailRef = useRef(),
    editStatusRef = useRef(),
    editTextRef = useRef()
  const [popup, setPopup] = useState({ visible: false, error: false })
  useEffect(() => {
    document.title = 'TODO App';
    (async () => {
      const res = await fetch('http://localhost:8080/todos'),
        data = await res.json()
      dispatch({
        type: ['CHANGE_TODOS'],
        value: [data]
      })
    })()
  }, [])
  const addTodo = () => {
    const name = nameRef.current.value?.trim() || '',
      email = emailRef.current.value?.trim() || '',
      text = textRef.current.value?.trim() || ''
    if (isValidFields([nameRef, emailRef, textRef])) {
      dispatch({
        type: ['CHANGE_TODOS'],
        value: [[...state.todos, { name, email, text, status: 'done', id }]]
      })
      ++id
      setPopup(prev => ({ ...prev, type: 'todoAdded', visible: true }))
    }
  }
  const isValidFields = fields => {
    let valid = true
    for (let i = 0; i < fields.length; ++i) {
      fields[i].current.style.borderColor = '#f2f6f7'
      const re = new RegExp(fields[i].current.pattern),
        value = fields[i].current.value,
        isValid = re.test(value)
      if (!value.trim() || !isValid) {
        valid = false
        fields[i].current.style.border = '.1rem solid red'
        fields[i].current.oninput = null
        fields[i].current.oninput = () => isValidFields([fields[i]])
      }
    }
    return valid
  }
  const changePage = page => {
    dispatch({
      type: ['CHANGE_PAGE'],
      value: [+page]
    })
  }
  const signIn = async () => {
    const login = loginRef.current.value?.trim() || '',
      password = passwordRef.current.value?.trim() || ''
    if (isValidFields([loginRef, passwordRef])) {
      const res = await fetch('http://localhost:8080/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      }),
        { success } = await res.json()
      if (success) {
        dispatch({
          type: ['CHANGE_ADMIN'],
          value: [true]
        })
        setPopup({ visible: false, error: false, type: 'signIn', title: 'Войти как админ' })
      } else {
        setPopup(prev => ({ ...prev, error: true, type: 'signIn', title: 'Войти как админ' }))
      }
    }
  }
  const signOut = () => {
    dispatch({
      type: ['CHANGE_ADMIN'],
      value: [false]
    })
  }
  const todoSort = () => {
    dispatch({
      type: ['CHANGE_TODOS'],
      value: [state.todos.reverse()]
    })
  }
  const saveEdits = () => {
    const name = editNameRef.current.value?.trim() || '',
      email = editEmailRef.current.value?.trim() || '',
      text = editTextRef.current.value?.trim() || '',
      status = editStatusRef.current.value?.trim() || ''
    dispatch({
      type: ['CHANGE_TODOS'],
      value: [state.todos.map(e =>
        ({ ...e, ...(e.id === popup.value && { name, email, text, status }) })
      )]
    })
    setPopup({ visible: false })
  }
  const Popup = () => {
    return (
      <div className="popup-container flex-center" hidden={!popup.visible} onClick={() => setPopup(prev => ({ ...prev, visible: false }))}>
        <div className="popup" onClick={e => e.stopPropagation()}>
          <center>
            {popup.title && <h3>{popup.title}</h3>}
            {popup.type === 'signIn' &&
              <>
                <p><input type="text" placeholder='Логин' ref={loginRef} /></p>
                <p><input type="password" placeholder='Пароль' ref={passwordRef} /></p>
                {popup.error && <p style={{ color: 'red' }}>Неверный логин или пароль</p>}
                <p><button onClick={signIn}>Войти</button></p>
              </>
            }
            {popup.type === 'edit' &&
              <>
                <p><input type="text" placeholder='Имя' ref={editNameRef} defaultValue={state.todos.find(e => e.id === popup.value)?.name || ''} /></p>
                <p><input type="text" placeholder='Эмайл' ref={editEmailRef} defaultValue={state.todos.find(e => e.id === popup.value)?.email || ''} /></p>
                <p><input type="text" placeholder='Текст' ref={editTextRef} defaultValue={state.todos.find(e => e.id === popup.value)?.text || ''} /></p>
                <p>
                  <select ref={editStatusRef} defaultValue={state.todos.find(e => e.id === popup.value)?.status || ''}>
                    <option value="done">Выполнено</option>
                    <option value="edit">Отредактировано админом</option>
                  </select>
                </p>
                <p><button onClick={saveEdits}>Сохранить</button></p>
              </>
            }
            {popup.type === 'todoAdded' &&
              <p>Задание добавлено!</p>
            }
          </center>
        </div>
      </div>
    )
  }
  return (
    <div className='screen'>
      <div className="container">
        <div>
          <div className='todo-header'>
            <center>
              <h2>TODO лист</h2>
            </center>
            <button onClick={() => state.isAdmin ? signOut() : setPopup(prev => ({ ...prev, visible: true, type: 'signIn', title: 'Войти как админ' }))}>{state.isAdmin ? 'Выйти' : 'Войти'}</button>
          </div>
          <div className="flex-center inputs">
            <input type="text" placeholder='Имя' className='task-input' ref={nameRef} />
            <input type="text" placeholder='Эмайл' className='task-input' ref={emailRef} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
            <input type="text" placeholder='Текст' className='task-input' style={{ flex: 1 }} ref={textRef} />
            <button className="round-btn add-new" onClick={addTodo}>+</button>
          </div>

          <ul className="flex-center todos">
            <li className='header'>
              <p onClick={todoSort}>Имя</p>
              <p onClick={todoSort}>Эмайл</p>
              <p onClick={todoSort}>Текст</p>
              <p onClick={todoSort}>Статус</p>
              {state.isAdmin && <p className='actions'>Действие</p>}
            </li>
            {state.todos.slice(state.page * 3, 3 * (state.page + 1)).map((e, i) =>
              <li key={i}>
                <p title={e.name}>{e.name}</p>
                <p title={e.email}>{e.email}</p>
                <p title={e.text}>{e.text}</p>
                <div><span className='todo-status' style={{ color: statuses[e.status][1] }}>{statuses[e.status][0]}</span></div>
                {state.isAdmin && <div style={{ textAlign: 'right' }}>
                  <button className='round-btn' onClick={() => setPopup(prev => ({ ...prev, visible: true, type: 'edit', value: e.id, title: 'Редактировать' }))}>✎</button>
                </div>}
              </li>
            )}
          </ul>
        </div>
        {state.todos.length > 3 && <ul className='pagination'>
          <li onClick={() => changePage(0)} style={{ backgroundColor: state.page === 0 ? 'black' : 'initial', color: state.page === 0 ? 'white' : 'black' }}>{1}</li>
          {Array.from(Array(Math.floor(state.todos.length / 3)).keys()).map((e, i) =>
            <li key={i} onClick={() => changePage(i + 1)} style={{ backgroundColor: state.page === i + 1 ? 'black' : 'initial', color: state.page === i + 1 ? 'white' : 'black' }}>{i + 2}</li>
          )}
        </ul>}
        <Popup />
      </div>
    </div>
  )
}