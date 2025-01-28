const app = require("./app");
const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Listening on ${PORT}`);
  }
});
