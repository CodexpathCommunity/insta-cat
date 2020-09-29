import { Button, Input } from '@material-ui/core'
import React, {useState} from 'react'
import {storage, db} from "./firebase"
import firebase from "firebase"
import './Imageupload.css'

function ImageUpload({username}) {
    const [image, setimage] = useState(null)
    const [progress, setprogress] = useState(0)
    const [caption, setcaption] = useState("")
    

    const handleChange=(e)=>{
        if (e.target.files[0]){
            setimage(e.target.files[0])
        }
    }
    const handleUpload=()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                )
                setprogress(progress)
            },
            (error)=>{
                alert(error.message)
            },
            ()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username
                    });
                    setprogress(0)
                    setimage(null)
                    setcaption("")
                    
                })
            }
        )
    }

    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100"/>
            <Input type="text" placeholder='enter a caption...' value={caption} onChange={event=>setcaption(event.target.value)} />
            <input type="file"  onChange={handleChange}/>
            
            <Button onClick={handleUpload} >
                Upload
            </Button>
            
        </div>
    )
}

export default ImageUpload
