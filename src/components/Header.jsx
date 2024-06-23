import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InfoIcon from "@mui/icons-material/Info";

function Header(props) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavClick = (type) => {
    navigate(`/${type}`);
    handleClose();
  };

  return (
    <header className="glass">
      <h4>Project X</h4>
      <IconButton onClick={handleClick}>
        <Avatar
          src={props.user.img}
          alt="Open Profile"
          style={{ width: "25px", height: "25px" }}
          variant="soft"
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            handleNavClick("profile");
          }}
        >
          <AccountCircleIcon fontSize="small" style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleNavClick("feedback");
          }}
        >
          <FeedbackIcon fontSize="small" style={{ marginRight: 8 }} />
          Feedback
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleNavClick("about");
          }}
        >
          <InfoIcon fontSize="small" style={{ marginRight: 8 }} />
          About
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleNavClick("signout");
          }}
        >
          <ExitToAppIcon fontSize="small" style={{ marginRight: 8 }} />
          Sign Out
        </MenuItem> */}
      </Menu>
    </header>
  );
}

export default Header;
