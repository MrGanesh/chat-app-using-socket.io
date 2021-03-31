import React, { useEffect, useState } from 'react'
import queryString from 'query-string';
import io from 'socket.io-client'
import './Chat.css'
import InfoBar from './InfoBar';
import Input from './Input';
import Messages from './Messages';
import TextContainer from './TextContainer';
let socket;
const ENDPOINT = 'https://chat-app-using-socket-demo.herokuapp.com/'
function Chat({ location }) {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });

        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    );
}

export default Chat;

// const [name, setName] = useState('')
// const [room, setRoom] = useState('')
// const [messages, setMessages] = useState([])
// const [message, setMessage] = useState([])

// useEffect(() => {
//     const { name, room } = queryString.parse(location.search);

//     socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });
//     console.log(socket)
//     setName(name)
//     setRoom(room)

//     socket.emit('join', { name, room }, () => {

//     })

//     return () => {
//         socket.emit('disconnect')
//         socket.off()
//     }

// }, [ENDPOINT, location.search])


// useEffect(() => {
//     socket.on('message', (message) => {
//         setMessages([...messages, message])
//     })
// }, [messages])

// const sendMessage = (e) => {
//     e.preventDefault();
//     if (message) {
//         socket.emit('sendMessage', message, () => setMessage(''))
//     }
// }

// console.log(message, messages)

// return (
//     <div className="outerContainer">
//         <div className="container">

//             <InfoBar room={room} />
//             <Messages messages={messages} name={name} />
//             <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

{/* <input value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' ? sendMessage(e) : null}
                /> */}
//             </div>
//         </div>
//     )
// }

// export default Chat
