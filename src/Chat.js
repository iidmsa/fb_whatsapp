import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, DonutLarge, InsertEmoticon, Mic, MoreVert } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Chat.css';
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import { actionTypes } from './reducer';

function Chat(props) {

    const [input, setInput] = useState('');
    const [seed, setSeed] = useState('');
    var [docID, setDocId] = useState('test');
    const [typing, setTyping] = useState(false);
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{ user, isTyping }, dispatch] = useStateValue();

    useEffect (() => {
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name)
            })

            db.collection('rooms').doc(roomId)
              .collection('messages')
              .orderBy('timestamp', 'asc')
              .onSnapshot(snapshot => (
                  setMessages(snapshot.docs.map((doc) => doc.data()))
              ));
        }
    }, [roomId]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 500));
    }, []);

    useEffect(() => {

        if (input != '') {
            setTyping(true);
            dispatch({
                type: actionTypes.SET_TYPING,
                isTyping: true,
            });
        } else {
            dispatch({
                type: actionTypes.SET_TYPING,
                isTyping: false,
            });
        }


        // db.collection('rooms').doc(roomId)
        //     .collection('messages').add({
        //         message: input,
        //         name: user.displayName,
        //         typing: true,
        //         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        //     });


    //    console.log(db.collection('rooms').doc().id);
                   
            //   setDocId( db.collection('rooms').doc );


            // db.collection('rooms').doc(roomId)
            //   .collection('messages')
            //   .orderBy('timestamp', 'desc').limit(2)
            //   .onSnapshot(snapshot => (
            //     snapshot.docs.map((doc) => { 
            //         console.log(doc.id);
            //         if (doc.data().typing === true) {
            //             setTyping(true);
            //         } 
            //         if (input === '' ) {
            //             db.collection('rooms')
            //             .doc(roomId)
            //             .collection('messages')
            //             .doc(doc.id).update({ typing: "false"  })
            //             setTyping(false);
            //         }
                    
            //     } ) 
            // ));

            // db.collection('rooms')
            //   .doc(roomId)
            //   .collection('messages')
            //   .doc('7LGChzUW5OvbTRLHr2Fy').set({ name: "true"  })



            //   .orderBy('timestamp', 'desc').limit(1).id );
            //   .onSnapshot(snapshot => (
            //       snapshot.docs.map((doc) => {  doc.data() ; console.log ( doc.set({ typing: false }))}  )  
                  
            // ));





        
              










        console.log(input)
        // db.collection('rooms')
        //   .doc(roomId)
        //   .collection('typing')
        //   .doc('VjntTj6WAt2Iqr6H7Jbs').set({ flag: true  })


        // db.collection('rooms').doc(roomId).collection('typing').onSnapshot(snapshot => {
        //     snapshot.docs.map(doc => (
        //      //  console.log(doc.data().flag),
        //        setTyping(doc.data().flag),
        //       console.log(doc.data().flag)
        //     ))
        // })

        // console.log("input is changing");
        // console.log(typing);
    
        // if (input === '') {

            // console.log('input is empty');
            // console.log(typing);

            // db.collection('rooms')
            //   .doc(roomId)
            //   .collection('typing')
            //   .doc('VjntTj6WAt2Iqr6H7Jbs').set({ flag: false  })

            //   db.collection('rooms').doc(roomId).collection('typing').onSnapshot(snapshot => {
            //     snapshot.docs.map(doc => (
            //     //    console.log(doc.data().flag),
            //        setTyping(doc.data().flag)
            //     ))

              //console.log(typing)
            // })
        // }



        // db.collection('rooms').doc(roomId)
        //       .collection('messages').add({
        //         message: input,
        //         name: user.displayName,
        //         typing: false,
        //         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        //       });





    }, [input]);

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(input);


        db.collection('rooms').doc(roomId)
              .collection('messages').add({
                message: input,
                name: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });

        setInput('');
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/4.5/api/human/${seed}.svg` }/>
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p> Last seen &nbsp; 
                       { new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString() }
                    </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <DonutLarge/>                        
                    </IconButton>
                    <IconButton>
                        <AttachFile/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </div>
             </div>
            <div className="chat__body">

                {messages.map((message) => (
                    <p className={`chat__message ${message.name === user.displayName && 'chat__reciever'} `}>

                        <span className="chat__name" >
                            {message.name}
                        </span>
                        {message.message}
                        <span className="chat__timestamp" >
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}

                
                    <div>
                         {isTyping ? (
                            <div className= {`chat__message ${messages[messages.length - 1].name === user.displayName && 'chat--invisible'} `} >
                            {user.displayName} is Typing...
                            </div>
                   ) : (<div></div>)}
                    </div>
                

            </div>
            <div className="chat__footer">
                <InsertEmoticon/>
                <form>
                    <input value={input} onChange={e => {
                        setInput(e.target.value)
                        







                    }} placeholder="Type a message..." type="text"></input>
                    <button onClick={sendMessage} type="submit"></button>
                </form>
                <Mic/>
            </div>
        </div>
    );
}

export default Chat;