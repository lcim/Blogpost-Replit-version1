import express from "express";
import bodyParser from "body-parser";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
import { join } from "path";
// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

// indicate your folder for static files
// app.use(express.static("public")); // Not enough
app.use("/static", express.static("public"));
// app.use('/static', express.static(join(process.cwd(), "public"))); // Even better

// Make EJS default view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// define views directory
// app.set("views", __dirname + "/views")

// initial data container set to empty array
let quotesList = [
  { quotes: "Death on duty: State negligence leads to exodus of Nigerian doctors ", author: "Al Jazeera", id: 0 },
  { quotes: "No legal challenge to the outcome of a presidential election has succeeded in Nigeria, which returned to democracy in 1999 after three decades of almost uninterrupted military rule and has a history of electoral fraud.", author: "https://www.reuters.com/", id: 1},
  { quotes: " international observers said serious logistical problems, violence and the slow publishing of polling-station results had marred the vote in Africa’s largest economy and most-populous nation", author: "https://www.wsj.com/", id: 2 }
];

// render homepage to display all quotes using ejs template
app.get("/", (req, res) => {
  res.render("index.ejs", { quotesList });
});

// render form on quotes page to create new quotes
app.get("/quotesForm", (req, res) => {
  res.render("quotesForm.ejs");
});

// Now create a new quote and push into the data array
app.post("/quotesForm", (req, res) => {
  const { quotes } = req.body;
  const newQuote = {
    quotes, //: req.body["quotes"], I chose to use destructured value of quotes from above.
    author: !req.body["author"] ? "anonymous" : req.body["author"],
    id: quotesList.length + 1,
  };
  quotesList.push(newQuote);
  res.redirect("/");
});

// Update quote with a given id
app.get("/edit/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  const currentQuote = quotesList?.find((quote) => quote.id === quoteId);
  res.render("edit.ejs", currentQuote);
  console.log(currentQuote);

  //   const newQuotesList = quotesList.map((quote) => {
  //     if (quote.id === quoteId) {
  //       return [...quotesList, { ...quote, quotes: req.body.quotes }];
  //     }
  //   });
  //   quotesList = newQuotesList;
});
app.post("/edit/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  // const currentQuote = req.body["quotes"];
  // const upDatedList = quotesList.map((quote) => {
  //   if (quote.id === quoteId) {
  //     return { ...quote, quotes: currentQuote };
  //   }
  //   return quote;
  // });

  // quotesList = upDatedList;

  // Alternatively,
  const indexOfCurrentQuote = quotesList.findIndex(
    (quote) => quote.id === quoteId );
  // const { quotes: currentQuote } = req.body; // OR
  const currentQuote = req.body.quotes;
  quotesList[indexOfCurrentQuote].quotes = currentQuote; // ie, the destructured current quote

  // then return to home page
  res.redirect("/");
});

// delete request
app.get("/delete/:id", (req, res) => {
  const quoteId = Number(req.params.id);
  quotesList = quotesList.filter((quote) => quoteId !== quote.id);

  res.redirect("/");
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
