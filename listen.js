const app = require("./app");
const { PORT = 3000 } = process.env;

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Listening on ${PORT}`);
  }
});
