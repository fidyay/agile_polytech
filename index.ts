import express from "express";
const app = express();
const port = 3000

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`App started and listening on port 3000\n Visit page: http://localhost:${port}`)
})