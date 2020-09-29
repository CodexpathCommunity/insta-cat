import React,{useState, useEffect} from 'react'
import './Post.css'
import {db} from "./firebase"
import Avatar from "@material-ui/core/Avatar"
import { Button, Input } from '@material-ui/core'
import firebase from 'firebase'

function Posts({username,postId,user ,caption, imageUrl}) {
    const [Comments, setComments] = useState([])
    const [comment, setcomment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe=db
             .collection("posts")
             .doc(postId)
             .collection("comments")
             .orderBy("timestamp", "desc")
             .onSnapshot((snapshot)=>{
                 setComments(snapshot.docs.map((doc)=> doc.data()))
             })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment=(e)=>{
        e.preventDefault()
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setcomment("")
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar"
                alt={username}
                src=""/>
                <h3>{username}</h3>
            </div>
            

            <img className="post__image" src={imageUrl}/>
            <h4 className="post__text"><strong> {username} </strong> {caption}</h4>

            <div className="post__comments" >
                {
                    Comments.map((comment)=>(
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            {
                user&&(
                    <form className="post__commentBox">
                        <Input
                            className="post__input"
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e)=> setcomment(e.target.value) } />

                            <Button
                            disabled={!comment}
                            className="post__button"
                            type="submit"
                            onClick={postComment} >
                                post
                            </Button>
                    </form>
                )
            }

            
        </div>
    )
}

export default Posts
