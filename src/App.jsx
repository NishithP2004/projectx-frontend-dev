import "./App.css";
import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Profile from "./components/Profile";
import Courses from "./components/Courses";
import Create from "./components/Create";
import Document from "./components/Document";
import References from "./components/References";
import Feedback from "./components/Feedback";
import About from "./components/About";
import Podcasts from "./components/Podcasts";
import CreatePodcast from "./components/CreatePodcast";
import CourseQuiz from "./components/CourseQuiz";

import { SnackbarProvider, enqueueSnackbar } from "notistack";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { socket } from "./socket";

function App() {
  const [user, setUser] = useState({ email: "", uid: "", name: "" });

  const firebaseConfig = {
    apiKey: "AIzaSyAoKpZpoexyJn0CTkeVaYyEo24b5X2ezmg",
    authDomain: "project-x-92081.firebaseapp.com",
    projectId: "project-x-92081",
    storageBucket: "project-x-92081.appspot.com",
    messagingSenderId: "302116065870",
    appId: "1:302116065870:web:e08f6d6c92848100ebe91f",
    measurementId: "G-P1X8M6SYEH",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const analytics = getAnalytics(app);

  /* auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL) */

  useEffect(() => {
    onAuthStateChanged(auth, (user, error) => {
      if (error) {
        console.error("Authentication error:", error);
      } else {
        if (user) {
          setUser({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            img: user.photoURL || "https://i.imgur.com/LzFRRWx.png",
          });
          sessionStorage.setItem("token", user.accessToken);
          enqueueSnackbar(`Logged in as ${user.displayName}`, {
            variant: "success",
          });
        } else {
          setUser(null);
        }
      }
    });
  }, [auth]);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const [courses, setCourses] = useState(null);
  const [podcasts, setPodcasts] = useState(null);
  const [searchQueries, setSearchQuery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState([]);

  return (
    <main>
      <SnackbarProvider />
      <Router>
        {user && user?.email ? (
          <Routes>
            <Route path="/login" element={<LoginPage auth={auth} />} />
            <Route
              exact
              path="/courses"
              element={
                <Courses
                  user={user}
                  auth={auth}
                  courses={courses}
                  setCourses={setCourses}
                />
              }
            />
            <Route
              exact
              path="/courses/create"
              element={<Create user={user} auth={auth} />}
            />
            <Route
              path="/profile"
              element={<Profile user={user} auth={auth} />}
            />
            <Route
              path="/feedback"
              element={<Feedback user={user} auth={auth} />}
            />
            <Route path="/about" element={<About user={user} auth={auth} />} />
            <Route
              exact
              path="/podcasts"
              element={
                <Podcasts
                  user={user}
                  auth={auth}
                  podcasts={podcasts}
                  setPodcasts={setPodcasts}
                />
              }
            />
            <Route
              exact
              path="/podcasts/create"
              element={<CreatePodcast user={user} auth={auth} />}
            />
            <Route
              path="/courses/:id"
              element={
                <Document
                  user={user}
                  auth={auth}
                  socket={socket}
                  courses={courses}
                  searchQueries={searchQueries}
                  setSearchQuery={setSearchQuery}
                  messages={messages}
                  setMessages={setMessages}
                  content={content}
                  setContent={setContent}
                />
              }
            />
            <Route
              path="/courses/references/:id"
              element={
                <References
                  user={user}
                  auth={auth}
                  socket={socket}
                  courses={courses}
                  searchQueries={searchQueries}
                  setSearchQuery={setSearchQuery}
                  messages={messages}
                  setMessages={setMessages}
                />
              }
            />
            <Route
              path="/courses/quiz/:id"
              element={<CourseQuiz user={user} auth={auth} courses={courses} />}
            />
            <Route path="*" element={<Navigate to="/courses" />} />
          </Routes>
        ) : (
          <LoginPage auth={auth} />
        )}
      </Router>
    </main>
  );
}

export default App;
