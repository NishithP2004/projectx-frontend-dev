// BrowserDialog.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MarkdownRenderer from "./MarkdownRenderer";
import ChatUI from "./ChatUI";

function BrowserDialog({
  open,
  setOpen,
  websiteContent,
  user,
  auth,
  socket,
  messages,
  setMessages,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="x-lg">
      <DialogTitle>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {"Interactive Browser"}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "column" }}>
        <div
          className="row"
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <MarkdownRenderer
            content={websiteContent}
            style={{
              maxHeight: "68vh",
            }}
          />
          <ChatUI
            user={user}
            auth={auth}
            socket={socket}
            messages={messages}
            setMessages={setMessages}
            context={websiteContent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BrowserDialog;
