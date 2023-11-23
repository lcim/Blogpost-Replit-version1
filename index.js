import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override"

const app = express();
const port = process.env.PORT || 3000;

// indicate your folder for static files
app.use("/static", express.static("public"));
// app.use('/static', express.static(join(process.cwd(), "public"))); // Even better

// middleware to modify form default methods to be able to handle PUT, PATCH, and DELETE operations
app.use(methodOverride("_method"));

// Make EJS default view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// initial data 
let quotesList = [
  { quotes: "Death on duty: State negligence leads to exodus of Nigerian doctors ", author: "Al Jazeera", id: 0 },
  { quotes: "No legal challenge to the outcome of a presidential election has succeeded in Nigeria, which returned to democracy in 1999 after three decades of almost uninterrupted military rule and has a history of electoral fraud.", author: "https://www.reuters.com/", id: 1},
  { quotes: " I'll always stand on the side of truth; even if it means standing alone.", author: "Mazi Ijeghoahia", id: 2 },
  { quotes: " international observers said serious logistical problems, violence and the slow publishing of polling-station results had marred the vote in Africa’s largest economy and most-populous nation", author: "https://www.wsj.com/", id: 3 }
];

// render homepage to display all quotes using ejs template
app.get("/", (req, res) => {
  res.render("index.ejs", { quotesList });
});

// render form on its page to create new blogpost
app.get("/quotesForm", (req, res) => {
  res.render("quotesForm.ejs");
});

// Now create a new quote and push into the data array
app.post("/quotesForm", (req, res) => {
  // destructure quotes value from html form body
  const { quotes } = req.body;
  // or const quotes = req.body["quotes"] // or req.body.quotes

  // create new blog object and push into quotesList array
  const newQuote = {
    quotes,
    author: !req.body["author"] ? "anonymous" : req.body["author"],
    id: quotesList.length + 1,
  };
  quotesList.push(newQuote);

  // return to homepage
  res.redirect("/");
});

// Update quote with a given id
app.get("/edit/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  const selectedQuote = quotesList?.find((quote) => quote.id === quoteId);
  res.render("edit.ejs", {selectedQuote});
  // console.log(selectedQuote);
});

app.patch("/edit/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  // console.log("selectedQuote ID", quoteId);

  // get the index of the selected quote object in the array
  const indexOfSelectedQuote = quotesList.findIndex(
    (quote) => quote.id === quoteId);
  if (indexOfSelectedQuote >= 0) {
    // replace the quotes key in the selected blogpost with the quotes value in html form presently.
    quotesList[indexOfSelectedQuote].quotes = req.body.quotes;
  } else {
    res.status(404).json("There is no such blogpost")
  }  

  // then return to home page
  res.redirect("/");
});

// delete request
app.delete("/delete/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  if (quoteId >= 0) {
    quotesList = quotesList.filter((quote) => quoteId !== quote.id);
    // res.status(200).json("Blogpost successfully deleted");

  } else {
    res.status(404).json("Blogpost does not exist.");
  }

  res.redirect("/");
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
