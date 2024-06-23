import "./Feedback.css";
import Layout from "./Layout";
import Section from "./Section";

function Feedback(props) {
  return (
    <Layout user={props.user}>
      <Section title="Feedback 🫱🏻‍🫲🏼">
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
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdDr_gJCJ38kDabfO1Fhlh5VQMWvQbFOS-wEWdnCo4UcFJ2rQ/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="google-form glass"
          >
            Loading…
          </iframe>
        </div>
      </Section>
    </Layout>
  );
}

export default Feedback;
