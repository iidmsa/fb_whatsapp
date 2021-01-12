import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  DonutLarge,
  InsertEmoticon,
  Mic,
  MoreVert,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import { actionTypes } from "./reducer";

function Chat(props) {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const [typing, setTyping] = useState([]);
  const [idleWatch, setIdleWatch] = useState(null);
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user, isTyping }, dispatch] = useStateValue();

  const removeTyping = (room_id) => {
    db.collection("rooms")
      .doc(room_id || roomId)
      .collection("typing")
      .doc(user.displayName)
      .delete();
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );

      db.collection("rooms")
        .doc(roomId)
        .collection("typing")
        .onSnapshot((snapshot) => {
          const typing = snapshot.docs.map((doc) => {
            const id = doc.id;
            const age = Date.now() - doc.data().lastEdit;
            if (age < 10000) {
              return id;
            }
            return "$";
          });
          setTyping(
            typing.filter((name) => {
              return name != user.displayName && name != "$";
            })
          );
        });
      console.log(typing);
    }
    return () => {
      console.log(`Room ${roomId} has changed.`);
      removeTyping(roomId);
    };
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 500));
  }, []);

  useEffect(() => {
    if (input.length > 0) {
      db.collection("rooms")
        .doc(roomId)
        .collection("typing")
        .doc(user.displayName)
        .set({ lastEdit: Date.now() });

      setIdleWatch(setTimeout(removeTyping, 10000));
    } else {
      removeTyping();
    }

    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc("7LGChzUW5OvbTRLHr2Fy")
      .set({ name: "true" });
  }, [input]);

  useEffect(() => {
    return () => {
      if (idleWatch) {
        clearTimeout(idleWatch);
      }
    };
  }, [idleWatch]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://avatars.dicebear.com/4.5/api/human/${seed}.svg`}
        />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            {" "}
            Last seen &nbsp;
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__reciever"
            } `}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}

        <div className="chat__message">
          {typing.length > 0 && typing.join(", ") + " is typing..."}
        </div>
      </div>
      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Type a message..."
            type="text"
          ></input>
          <button onClick={sendMessage} type="submit"></button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default Chat;
