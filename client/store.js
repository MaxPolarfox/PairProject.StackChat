import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios';
import socket from './socket'

// action types:
const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';
const GOT_NEW_MESSAGE = 'GOT_NEW_MESSAGE'
const USER_SET = 'USER_SET'

//action creators:
export const gotMessagesFromServer = (messages) => ({
  type: GOT_MESSAGES_FROM_SERVER,
  messages
})
export const gotNewMessage = message => ({
  type: GOT_NEW_MESSAGE,
  message,
})

export const userSet = userName => ({
  type: USER_SET,
  payload: userName,
})


const initialState = {
  messages: [],
  user: 'Cody'
}



//Thunks:
export const fetchMessages = () => async (dispatch) => {
  const { data: messages } = await axios.get('/api/messages');
  dispatch(gotMessagesFromServer(messages));
}

export const sendMessage = message => async (dispatch, getState) => {
  message.name = getState().user
  const { data: newMessage } = await axios.post('/api/messages', message)
  dispatch(gotNewMessage(newMessage))
  socket.emit('new-message', newMessage)
}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_MESSAGES_FROM_SERVER:
      return { ...state, messages: action.messages }
    case GOT_NEW_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] }
    case USER_SET:
      return { ...state, user: action.payload }
    default:
      return state
  }
}

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
)


const store = createStore(reducer, middleware);
export default store;
