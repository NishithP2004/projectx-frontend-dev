import React, { useState } from "react";
import "./Sidebar.css";
import { FaPlusCircle } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";
import { FaHome, FaGlobeAmericas, FaPodcast } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Tooltip, IconButton, Menu, MenuItem } from "@mui/material";

function Sidebar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [readerAnchorEl, setReaderAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReaderClick = (event) => {
    setReaderAnchorEl(event.currentTarget);
  };

  const handleReaderClose = () => {
    setReaderAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <aside className="glass">
      <ul>
        <li onClick={() => navigate("/courses")}>
          <Tooltip title="Home">
            <IconButton style={{ fontSize: "1em", color: "black" }}>
              <FaHome />
            </IconButton>
          </Tooltip>
        </li>
        <li>
          <Tooltip title="Document Reader">
            <IconButton
              style={{ fontSize: "1em", color: "black" }}
              onClick={handleReaderClick}
            >
              <SiGoogledocs />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={readerAnchorEl}
            open={Boolean(readerAnchorEl)}
            onClose={handleReaderClose}
          >
            <MenuItem
              onClick={() => {
                let course_id = localStorage.getItem("course_id");
                course_id ? navigate("/courses/" + course_id) : "";
              }}
            >
              Reader
            </MenuItem>
            <MenuItem
              onClick={() => {
                let course_id = localStorage.getItem("course_id");
                course_id ? navigate("/courses/quiz/" + course_id) : "";
              }}
            >
              Quiz
            </MenuItem>
          </Menu>
        </li>
        <li onClick={handleClick}>
          <Tooltip title="Create">
            <IconButton style={{ fontSize: "1em", color: "#3498DB" }}>
              <FaPlusCircle />
            </IconButton>
          </Tooltip>
        </li>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("/courses/create")}>
            Create a Course
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/podcasts/create")}>
            Create a Podcast
          </MenuItem>
        </Menu>
        <li onClick={() => navigate("/podcasts")}>
          <Tooltip title="Podcasts">
            <IconButton
              style={{
                fontSize: "1em",
                color: "#0a0a0a",
              }}
            >
              <FaPodcast />
            </IconButton>
          </Tooltip>
        </li>
        <li
          onClick={() => {
            let course_id = localStorage.getItem("course_id");
            course_id ? navigate("/courses/references/" + course_id) : "";
          }}
        >
          <Tooltip title="References">
            <IconButton style={{ fontSize: "1em", color: "black" }}>
              <FaGlobeAmericas />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
