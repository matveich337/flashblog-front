import "./post-page.css";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";

export default function PostCard({
  data: {
    id,
    theme,
    content,
    creator: { username },
  },
}) {
  let navigate = useNavigate();
  const handlePostRedirect = () => navigate(`/post/${id}`);

  return (
    <Card
      className="post-card"
      variant="outlined"
      id="detailsButton"
      onClick={handlePostRedirect}
      style={{ cursor: "pointer" }}
    >
      <CardContent
        sx={{
          height: "100%",
          backgroundColor: "white",
          transition: "all 0.5s",
          "&:hover": { backgroundColor: "rgb(255,240,244)" },
        }}
      >
        <Typography sx={{ fontSize: 18 }} component="div">
          Theme:
        </Typography>
        <Typography sx={{ fontSize: 18 }} component="div">
          {theme.length > 15 ? theme.slice(0, 12) + "..." : theme}
        </Typography>
        <div style={{ height: "80px" }}>
          <Typography sx={{ fontSize: 18 }} component="div">
            Content:
          </Typography>
          <Typography
            component="div"
            sx={{
              height: "75%",
              wordWrap: "break-word",
              overflow: "hidden",
              fontSize: 18,
            }}
          >
            {content.length > 40 ? content.slice(0, 37) + "..." : content}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Post added by {username}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
