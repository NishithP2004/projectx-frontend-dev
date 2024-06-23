import "./Document.css";
import Section from "./Section";
import Layout from "./Layout";
import ChatUI from "./ChatUI";
import MarkdownRenderer from "./MarkdownRenderer";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";

const fetchDocumentContent = async (docId) => {
  try {
    const response = await fetch(`/api/courses/documents/${docId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    enqueueSnackbar(`An error occurred while fetching document content`, {
      variant: "error",
    });
    throw error;
  }
};

// Function to update search queries
const updateSearchQueries = async (doc_id, setSearchQuery) => {
  try {
    const response = await fetch(`/api/search-queries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // content: content,
        doc_id: doc_id,
      }),
    });

    const data = await response.json();
    setSearchQuery(data.queries);
  } catch (error) {
    console.error(error);
    enqueueSnackbar(`An error occurred while updating search queries`, {
      variant: "error",
    });
  }
};

function Document({
  user,
  auth,
  socket,
  courses,
  searchQueries,
  setSearchQuery,
  messages,
  setMessages,
  content,
  setContent,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchDocument = async () => {
      if (!courses) return;
      try {
        const docId = courses.filter(
          (course) => course.course.id === localStorage.getItem("course_id"),
        )[0].docs[0];

        const documentContent = await fetchDocumentContent(docId);
        if (documentContent.content) {
          setContent((prevContent) => {
            return [
              ...prevContent,
              {
                id: localStorage.getItem("course_id"),
                content: documentContent.content,
                summary: documentContent?.summary,
              },
            ];
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!content.find((d) => d.id == localStorage.getItem("course_id")))
      fetchDocument();
  }, []);

  useEffect(() => {
    if (!content.find((d) => d.id == localStorage.getItem("course_id"))) return;

    const updateSearch = async () => {
      try {
        const docId = courses.filter(
          (course) => course.course.id === localStorage.getItem("course_id"),
        )[0].docs[0];
        await updateSearchQueries(docId, setSearchQuery);
      } catch (error) {
        console.error(error);
      }
    };

    updateSearch();
  }, [content]);

  return (
    <Layout user={user}>
      <Section title="Document Reader 📄">
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
          <MarkdownRenderer
            content={
              content.find((d) => d.id == localStorage.getItem("course_id"))
                ?.content
            }
          />
          <ChatUI
            user={user}
            auth={auth}
            socket={socket}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </Section>
    </Layout>
  );
}

export default Document;
