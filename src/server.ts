import app from "./app";

const port = 4444 || process.env.PORT;

app.listen(port, () => {
    console.log(`The server is listening on port ${port}.`);
});
