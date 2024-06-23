import "./About.css";
import Layout from "./Layout";
import Section from "./Section";

function About(props) {
  return (
    <Layout user={props.user}>
      <Section title="About 🚀">
        <div
          className="glass container"
          style={{
            marginTop: "10px",
            width: "100%",
            boxSizing: "border-box",
            height: "85%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <div id="about" className="glass">
            <div className="col">
              <h3>
                <b>
                  Project X is an innovative learning platform that empowers
                  users to effortlessly gather relevant information from the web
                  related to a document, without any user prompts or search
                  queries.
                </b>
              </h3>
            </div>
            <ul>
              <li>
                Project X aims to unify references and data from various
                sources, including websites, YouTube videos, etc., creating an
                interactive and educational module.
              </li>
              <li>
                Project X leverages cutting-edge technologies like AI, cloud
                computing, and a robust technology stack to provide a seamless
                and interactive learning experience.
              </li>
              <li>Key features of Project X include:</li>
              <ul>
                <li>Secure user authentication</li>
                <li>
                  Document analysis and extraction of relevant information
                </li>
                <li>Educational YouTube "Reels" with quizzes</li>
                <li>Document chat for engaging discussions </li>
                <li>
                  Multi-document chat for simultaneous discussions on multiple
                  documents
                </li>
                <li>Chat with websites within the platform </li>
                <li>AI-curated content for further exploration</li>
              </ul>
            </ul>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export default About;
