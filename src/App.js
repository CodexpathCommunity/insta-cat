import React, {useState, useEffect} from 'react';
import './App.css';
import Posts from './Posts';
import {db, auth} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed'


function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: "50%",
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle]=useState(getModalStyle)
  const [posts, setposts] = useState([])
  const [open, setopen] = useState(false)
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [user, setUser]=useState(null)
  const [openSignIn, setopenSignIn] = useState(false)

  useEffect(() => {
    const unsubscribe= auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        console.log(authUser)
        setUser(authUser)
      }else{
        //user is logged out
        setUser(null)
      }
    })
    return ()=>{
      unsubscribe()
    }
  }, [user, username])



  useEffect(()=>{
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot =>{
      setposts(snapshot.docs.map(doc=>({
        id:doc.id,
        posts:doc.data()
      })))
    })
  },[])

    const signUp = (event)=>{
      event.preventDefault()

      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser)=>{
       return authUser.user.updateProfile({
          displayName:username
        })
      })
      .catch((error)=> alert(error.message))
      setopen(false)
    }

    const signIn = (event)=>{
      event.preventDefault()

      auth.signInWithEmailAndPassword(email, password)
      .catch((error)=> alert(error.message))
      setopenSignIn(false)
    }

  return (
    <div className="App">
       <Modal
        open={open}
        onClose={()=>setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >
            <center>
              <img
              className="input__logo"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="" />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setusername(e.target.value)}
              />


              <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setemail(e.target.value)}
              />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setpassword(e.target.value)}
              />

              <Button type="Submit" onClick={signUp} >Sign up</Button>
          </form>
          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setopenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" >
            <center>
              <img
              className="input__logo"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="" />
            </center>
              
              <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setemail(e.target.value)}
              />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setpassword(e.target.value)}
              />

              <Button type="Submit" onClick={signIn} >Sign In</Button>
          </form>
          
        </div>
      </Modal>

     <div className="app__header">
       <img
       className="app__headerImage"
       src="./images/instacat.png"
       alt=""/>
      
        {user ? (
          <Button onClick={()=>auth.signOut()} >Logout</Button>
        ):(
          <div className="app__loginContainer" >
            <Button onClick={()=>setopenSignIn(true)} >Sign In</Button>

            <Button onClick={()=>setopen(true)} >Sign up</Button>
          </div>
          
        ) }
     </div>
     <div className="app__posts">
       <div className="app__postLeft">
          {
            posts.map(({id,posts})=>(
              <Posts key={id} postId={id} user={user} username={posts.username} caption={posts.caption} imageUrl={posts.imageUrl}/>
              ))
          }
       </div>
       <div className="app__postRight">
        <InstagramEmbed
          url='https://www.instagram.com/p/CFdr6rEAsfV/?utm_source=ig_web_copy_link'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          className="app__instagramEmbed"
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
       </div>
     </div>
     
     <div className="app__imageuploader">
      {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ):(
          <center>
            <h3>login to upload</h3>
          </center>
          
        )}
     </div>

    </div>
  );
}

export default App;
