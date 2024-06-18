import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useState } from "react";

import colors from "../colors";

function Comments({ comments, onCommentSubmit }) {
  const [commentText, setCommentText] = useState();

  return (
    <div style={{ borderTop: "1px solid black", padding: "10px" }}>
      <h3>Komentáře</h3>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "15px" }}>
        {comments.map((comment) => {
          return (
            <div
              key={comment.id}
              style={{
                padding: "10px",
                border: "2px solid",
                borderRadius: "15px",
                borderColor: colors.accentDark,
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                color: "white",
                backgroundColor: colors.primaryMedium,
              }}
            >
              <div>
                <strong>{`${comment.user.name} ${comment.user.surname}:`}</strong>
              </div>
              <div>{comment.content}</div>
            </div>
          );
        })}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Komentář"
            aria-label="comment"
            aria-describedby="basic-addon1"
            onChange={(e) => {
              console.log(e);
              setCommentText(e.target.value);
            }}
          />
          <Button
            variant="primary"
            disabled={commentText ? false : true}
            onClick={() => {
              onCommentSubmit(commentText);
            }}
          >
            Uložit
          </Button>
        </InputGroup>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}></div>
    </div>
  );
}

export default Comments;
