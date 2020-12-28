import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './SidebarChat.css'
import db from './firebase';
import { Link } from 'react-router-dom';

function SidebarChat({ id, name, addNewChat }) {

    const [seed, setSeed] = useState('');
    const [messages, setMessages] = useState('');


    useEffect(() => {
        setSeed(Math.floor(Math.random() * 500));
    }, []);

    useEffect(() => {
        if (id) {
            db.collection('rooms')
              .doc(id)
              .collection('messages')
              .orderBy('timestamp', 'desc').onSnapshot((snapshot) => (
                setMessages(snapshot.docs.map((doc) => doc.data()))
            ));
        }
    }, [id]);


    const createChat = () => {
        const channelName = prompt("Enter channel name");

        if (channelName) {
            db.collection('rooms').add({
                name: channelName
            })
        }
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/4.5/api/human/${seed}.svg` }/>
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    <p>Last Message: {messages[0]?.message}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add new chat</h2>
        </div>
    );
}

export default SidebarChat;