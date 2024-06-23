import React, { useState, useEffect } from "react";
import "./Courses.css";
import Section from "./Section";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { enqueueSnackbar } from "notistack";
import Quiz from "react-quiz-component"; // Assuming this component handles rendering quizzes

const fetchQuizContent = async (doc_id) => {
  try {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doc_id, questions: 10 }),
    });
    const data = await response.json();
    return data.quiz;
  } catch (error) {
    console.error(error);
    enqueueSnackbar("An error occurred while fetching Quiz", {
      variant: "error",
    });
    return null;
  }
};

function CourseQuiz({ user, courses }) {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadQuiz = async () => {
    try {
      const course = courses.find(
        (c) => c.course.id === localStorage.getItem("course_id"),
      );
      const doc_id = course ? course.docs[0] : null;

      if (!doc_id) {
        throw new Error("Course not selected.");
      } else {
        setLoading(true);
        const quizData = await fetchQuizContent(doc_id);
        if (quizData) {
          setQuiz(
            Array.isArray(quizData)
              ? quizData.filter((q) => q && q.question && q.key !== null) || []
              : [quizData],
          );
        } else {
          throw new Error("Failed to fetch quiz data");
        }
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("An error occurred", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  return (
    <Layout user={user}>
      <Section title="Quiz 📔">
        <div
          className="glass courses"
          style={{
            justifyContent: "center",
          }}
        >
          {loading ? (
            <Box sx={{ width: "100%", height: "30%" }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          ) : quiz && quiz.length > 0 ? (
            <div
              className="glass"
              style={{
                padding: "10px",
              }}
            >
              <Quiz
                quiz={{
                  nrOfQuestions: quiz.length,
                  questions: quiz.map((quizItem) => {
                    return {
                      question: quizItem?.question,
                      questionType: "text",
                      answerSelectionType: quizItem?.answerSelectionType,
                      answers: [...quizItem?.answers],
                      correctAnswer:
                        typeof quizItem?.correctAnswer === "number"
                          ? quizItem.correctAnswer.toString()
                          : quizItem.correctAnswer,
                      messageForCorrectAnswer: "Correct answer. Good job.",
                      messageForIncorrectAnswer:
                        "Incorrect answer. Please try again.",
                      explanation: quizItem?.explanation,
                      point: "10",
                    };
                  }),
                }}
                continueTillCorrect={true}
              />
              <button
                className="regenerate glass"
                onClick={loadQuiz}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  fontFamily: '"Righteous", cursive',
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Regenerate Quiz
              </button>
            </div>
          ) : (
            <b style={{ fontFamily: "Quicksand" }}>
              No quizzes found. Please select a course to view quizzes ✨
            </b>
          )}
        </div>
      </Section>
    </Layout>
  );
}

export default CourseQuiz;
