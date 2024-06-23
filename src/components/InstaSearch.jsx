import "./InstaSearch.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import GoogleIcon from "@mui/icons-material/Google";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SendIcon from "@mui/icons-material/Send";
import Quiz from "react-quiz-component";
import BrowserDialog from "./BrowserDialog";
import { enqueueSnackbar } from "notistack";
// import ReactPlayer from "react-player/lazy";

function InstaSearch({
  searchResultsWeb,
  searchResultsYT,
  quizContent,
  user,
  auth,
  socket,
  messages,
  setMessages,
}) {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [websiteContent, setWebsiteContent] = useState(null);

  const fetchWebsiteContent = async (url) => {
    try {
      const response = await fetch(`/api/browser?url=${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.text();
      return data;
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`An error occurred while fetching Quiz`, {
        variant: "error",
      });
      return null;
    }
  };

  return (
    <div id="insta-search" className="glass">
      <main className="glass">
        <ul id="search-results">
          {searchResultsWeb && searchResultsWeb.length > 0 && value == 0 ? (
            searchResultsWeb.map((r, index) => {
              return (
                <li key={index}>
                  <div className="card glass">
                    <div className="row">
                      <img className="favicon" src={r?.favicon || null} />
                      <div className="col">
                        <p className="title">{r.title}</p>
                        <p className="displayLink">
                          <a href={r.link} target="_blank">
                            {r.displayLink}
                          </a>
                        </p>
                        <p className="desc">{r.snippet}</p>
                        {/* {r.image? (<img src={r.image} className="image"/>): ""} */}
                      </div>
                      <button
                        data-link={r.link}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        onClick={async (ev) => {
                          let url = ev.currentTarget.getAttribute("data-link");
                          enqueueSnackbar(
                            `Web Page requested. The web page may take a few minutes to load.`,
                            {
                              variant: "info",
                            },
                          );
                          setOpen(true);
                          let content = await fetchWebsiteContent(url);
                          if (content) setWebsiteContent(content);
                        }}
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })
          ) : searchResultsYT &&
            searchResultsYT?.length > 0 &&
            quizContent?.length > 0 &&
            value == 1 ? (
            searchResultsYT?.map((r) => {
              let quizData = quizContent.find((q) => q.id == r.id);
              let quiz = quizData
                ? {
                    nrOfQuestions: "1",
                    questions: [
                      {
                        question: quizData?.question,
                        questionType: "text",
                        answerSelectionType: quizData?.answerSelectionType,
                        answers: [...quizData?.answers],
                        correctAnswer:
                          typeof quizData?.correctAnswer == "number"
                            ? quizData.correctAnswer.toString()
                            : quizData.correctAnswer,
                        messageForCorrectAnswer: "Correct answer. Good job.",
                        messageForIncorrectAnswer:
                          "Incorrect answer. Please try again.",
                        explanation: quizData?.explanation,
                        point: "10",
                      },
                    ],
                  }
                : null;
              return (
                <li key={r.id}>
                  <div className="YT-card glass">
                    {/* <ReactPlayer
                      url={"https://www.youtube.com/embed/" + r.id}
                      style={{
                        borderRadius: "16px !important",
                        width: "560",
                        height: "315",
                      }}
                      controls={true}
                    /> */}
                    <iframe
                      width="560"
                      height="315"
                      src={"https://www.youtube.com/embed/" + r.id}
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen="true"
                      style={{
                        borderRadius: "16px",
                      }}
                    ></iframe>
                    {quizData ? (
                      <Quiz
                        quiz={quiz}
                        continueTillCorrect={true}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <Box sx={{ width: "100%", height: "30%" }}>
              <br />
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          )}
        </ul>
        <BrowserDialog
          open={open}
          setOpen={setOpen}
          websiteContent={websiteContent}
          user={user}
          auth={auth}
          socket={socket}
          messages={messages}
          setMessages={setMessages}
        />
      </main>
      <footer>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Google" icon={<GoogleIcon />} />
            <BottomNavigationAction label="YouTube" icon={<YouTubeIcon />} />
          </BottomNavigation>
        </Paper>
      </footer>
    </div>
  );
}

export default InstaSearch;
