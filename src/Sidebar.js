import { Avatar, IconButton } from '@material-ui/core';
import { Chat, DonutLarge, MoreVert, SearchOutlined } from '@material-ui/icons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import SidebarChat from './SidebarChat';
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import { actionTypes } from './reducer';

function Sidebar(props) {

    const [rooms, setRooms] = useState([]);
    // const [signedOut, setSignOut] = useState();
    const [{ user }, dispatch] = useStateValue();

    const signOutButtonPressed = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            dispatch({
                type: actionTypes.SET_USER,
                user: null,
            });
          }).catch(function(error) {
            // An error happened.
          });
    }

    useEffect(() => {
        db.collection('rooms').onSnapshot(snapshot => {
            setRooms(snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    data: doc.data()
                }
            )))
        })
    }, []);

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user?.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLarge/>                        
                    </IconButton>
                    <IconButton>
                        <Chat/>
                    </IconButton>
                    <IconButton>
                        <ExitToAppIcon onClick={signOutButtonPressed} />
                    </IconButton>
                </div>    
            </div>  
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined/> 
                    <input className="sidebar__input" placeholder="Search or start new chat" type="text"/>
                </div>
            </div>  
            <div className="sidebar__chats">
                <SidebarChat addNewChat/>    
                {
                    rooms.map(room => (
                        <SidebarChat key={room.id} id={room.id} name={room.data.name}/>
                    ))
                } 
            </div>  
        </div>
    );
}

export default Sidebar;