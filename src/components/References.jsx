import "./Document.css";
import Section from "./Section";
import Layout from "./Layout";
import ChatUI from "./ChatUI";
import MarkdownRenderer from "./MarkdownRenderer";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import InstaSearch from "./InstaSearch";

const fetchQuizContent = async (transcript) => {
  try {
    const response = await fetch(`/api/quiz`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: transcript,
      }),
    });

    const data = await response.json();
    return data?.quiz;
  } catch (error) {
    console.error(error);
    enqueueSnackbar(`An error occurred while fetching Quiz`, {
      variant: "error",
    });
    return {};
  }
};

function References({
  user,
  auth,
  socket,
  courses,
  searchQueries,
  messages,
  setMessages,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [content, setContent] = useState(null);
  const [searchResultsWeb, setSearchResultWeb] = useState([]);
  const [searchResultsYT, setSearchResultYT] = useState([]);
  const [quizContent, setQuizContent] = useState([]);

  useEffect(() => {
    if (searchQueries?.length == 0) return;
    (async function () {
      try {
        await fetch(
          `/api/search?q=${
            searchQueries[Math.floor(Math.random() * searchQueries.length)]
          }&type=bing`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          },
        )
          .then((res) => res.json())
          .then((res) => setSearchResultWeb(res.result))
          .catch((err) => {
            if (err) throw err;
          });
      } catch (err) {
        console.error(err);
        enqueueSnackbar(`An error occured`, {
          variant: "error",
        });
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQueries?.length == 0) return;
    (async function () {
      try {
        await fetch(
          `/api/reels?q=${
            searchQueries[Math.floor(Math.random() * searchQueries.length)]
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          },
        )
          .then((res) => res.json())
          .then((res) => {
            setSearchResultYT(res.result);
          })
          .catch((err) => {
            if (err) throw err;
          });
      } catch (err) {
        console.error(err);
        enqueueSnackbar(`An error occured`, {
          variant: "error",
        });
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      if (searchResultsYT.length == 0) return;

      (async function () {
        let quiz = await Promise.all(
          searchResultsYT.map(async (r) => {
            return { id: r.id, ...(await fetchQuizContent(r.transcript)) };
          }),
        );

        setQuizContent(quiz.filter((q) => q && q.question && q.key !== null));
      })();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(`An error occured`, {
        variant: "error",
      });
      console.error(err);
    }
  }, [searchResultsYT]);

  return (
    <Layout user={user}>
      <Section title="References 🌐">
        <div
          className="glass container"
          style={{
            marginTop: "10px",
            width: "100%",
            boxSizing: "border-box",
            height: "85%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <InstaSearch
            searchResultsWeb={searchResultsWeb}
            searchResultsYT={searchResultsYT}
            quizContent={quizContent}
            user={user}
            auth={auth}
            socket={socket}
            messages={messages}
            setMessages={setMessages}
          />
          {/* <ChatUI
            user={user}
            auth={auth}
            socket={socket}
            messages={messages}
            setMessages={setMessages}
          /> */}
        </div>
      </Section>
    </Layout>
  );
}

export default References;
