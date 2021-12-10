var express = require("express");
var router = express.Router();

const myDB = require("../db/myRedisDB.js");

router.get("/", async function (req, res) {
  const myExpenseFromDB = await myDB.getExpenses();
  // const categories = [];
  // if (req.body != null) {
  //   const expense = req.body;
  //   const id = expense.user;
  //   const categories = await myDB.analyzeExpense("20008");
  // }
  res.render("index", { expenses: myExpenseFromDB });
  // res.render("index", { categories: categories });
  // const categories = await myDB.analyzeExpense(expense.userId);
  // res.render("index", {
  //   data: { expenses: myExpenseFromDB, categories: categories },
  // });
  // res.render(
  //   "index",
  //   { expenses: myExpenseFromDB },
  //   { categories: categories }
  // );
});

router.post("/expense/create", async function (req, res) {
  try {
    const expense = req.body;

    console.log("got expense", expense);
    await myDB.createExpense(expense.userId, expense.amount, expense.category);
    console.log("expense created");
    res.redirect("/");
  } catch (e) {
    res.status(200).send("Error creating expense" + e);
  }
});

router.post("/expense/analyze", async function (req, res) {
  try {
    const expense = req.body;

    console.log("got expense", expense);
    const categories = await myDB.analyzeExpense(expense.userId);
    console.log("expense analyzed");
    res.render("leaderboard", { categories: categories });
    res.redirect("/");
  } catch (e) {
    res.status(200).send("Error analyzing expense" + e);
  }
});

router.post("/expense/:expenseId/delete", async function (req, res) {
  const expenseId = req.params.expenseId;
  console.log("delete got expense", expenseId);
  try {
    await myDB.deleteExpense(expenseId);
    res.redirect("/");
  } catch (e) {
    res.status(200).send("Error deleting expenseId" + e);
  }
});

// Analyze user
router.post("/expense/:userId/analyze", async function (req, res) {
  const userId = req.params.userId;
  try {
    categories = await myDB.analyzeExpense(userId);
    res.render("lb", { categories: categories });
    res.redirect("/");
  } catch (e) {
    res.status(200).send("Error deleting expenseId" + e);
  }
});

// Analyze user to lb
router.get("/analyze/:userId", async function (req, res) {
  const userId = req.params.userId;
  try {
    categories = await myDB.analyzeExpense(userId);
    res.render("lb", { categories: categories });
  } catch (e) {
    res.status(200).send("Error deleting expenseId" + e);
  }
});

/* GET fire details. */
router.get("/expense/:expenseId", async function (req, res) {
  const expenseId = req.params.expenseId;

  console.log("got expense details ", expenseId);
  const key = "expense:" + expenseId;

  const expense = await myDB.getExpense(key);
  console.log("got expense", expense);

  res.render("fireDetails", { expense: expense });
});

/* Update fire details. */
router.post("/expense/:expenseId/update", async function (req, res) {
  const expense = req.body;
  const expenseId = req.params.expenseId;
  console.log("got expense", expense);
  try {
    console.log("got expense", expenseId);
    console.log("got expense", expense.amount);
    console.log("got expense", expense.category);
    await myDB.updateExpense(expenseId, expense.amount, expense.category);
    res.redirect("/");
  } catch (e) {
    res.status(200).send("Error updating expense" + e);
  }
});

module.exports = router;
