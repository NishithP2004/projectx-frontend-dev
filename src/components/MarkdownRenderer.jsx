import "./MarkdownRenderer.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { remark } from "remark";

function MarkdownRenderer(props) {
  return (
    <div className="glass" id="markdown-container" style={props.style}>
      {props.content ? (
        <Markdown remarkPlugins={[[remarkGfm, rehypeRaw, remark]]}>
          {props.content || "Loading"}
        </Markdown>
      ) : (
        <Box sx={{ width: "100%", height: "30%" }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      )}
    </div>
  );
}

export default MarkdownRenderer;
