import "./Section.css";

function Section(props) {
  return (
    <div className="container glass">
      <h1 className="glass">{props.title}</h1>
      {props.children}
    </div>
  );
}

export default Section;
