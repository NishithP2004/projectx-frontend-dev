import React, { useEffect, useRef } from "react";
import "./Transcript.css";

function Transcript({ transcript, currentIndex }) {
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current && currentIndex !== undefined) {
      const listItem = transcriptRef.current.querySelector(
        `li[data-index="${currentIndex}"]`,
      );
      if (listItem) {
        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentIndex]);

  return (
    <div className="transcript-container glass">
      <ul id="transcript" ref={transcriptRef}>
        {transcript.map((t, i) => (
          <li
            key={i}
            data-index={i}
            className={i === currentIndex ? "current" : ""}
          >
            {t.dialog}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transcript;
