import colors from "../colors";

function Comments({ comments, onCommentSubmit }) {
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
      </div>
      <div style={{ display: "flex", alignItems: "center" }}></div>
    </div>
  );
}

export default Comments;
