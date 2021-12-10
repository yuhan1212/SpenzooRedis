const { createClient } = require("redis");

async function getRConnection() {
  let rclient = createClient();
  rclient.on("error", (err) => console.log("Redis Client Error", err));
  await rclient.connect();

  console.log("redis connected");

  return rclient;
}

async function getExpense(expenseId) {
  let rclient;
  try {
    rclient = await getRConnection();

    return await rclient.hGetAll(`${expenseId}`);
  } finally {
    rclient.quit();
  }
}
async function createExpense(userId, amount, category) {
  let rclient;
  try {
    console.log(userId);
    console.log(amount);
    console.log(category);
    rclient = await getRConnection();

    const expenseId = await rclient.incr("expenseId");

    console.log("creating expense", expenseId);
    const key = `expense:${expenseId}`;
    await rclient.hSet(key, {
      id: expenseId,
      userId: userId,
      amount: amount,
      category: category,
    });
    await rclient.SADD(userId, key);

    await rclient.rPush("expenses", key);
  } finally {
    rclient.quit();
  }
}

async function analyzeExpense(userId) {
  let rclient;
  try {
    console.log("analyzeExpense: userId", userId);
    rclient = await getRConnection();
    const userExpenses = await rclient.sMembers(userId);
    console.log("analyzeExpense: userExpenses", userExpenses);

    const key = `leaderboard:${userId}`;
    await rclient.del(key);

    await Promise.all(
      userExpenses.map(async (userExpense) => {
        console.log(userExpense);
        const expense = await rclient.hGetAll(userExpense);
        console.log("analyzeExpense: expense", expense);

        await rclient.zIncrBy(
          `leaderboard:${userId}`,
          expense.amount,
          expense.category
        );
      })
    );

    // creating the output, take top 10 tweeters
    const userLeaderBoard = await rclient.zRangeWithScores(
      `leaderboard:${userId}`,
      0,
      -1,
      {
        BY: "score",
        REV: true,
      }
    );

    const categories = [];
    for (let ulb of userLeaderBoard) {
      const category = ulb["value"];
      const sum = ulb["score"];
      const s = category + ": " + sum;
      categories.push(s);
    }
    console.log(categories);
    return categories;
  } finally {
    rclient.quit();
  }
}

async function getExpenses() {
  let rclient;
  try {
    rclient = await getRConnection();

    const expenseIds = await rclient.lRange("expenses", -5, -1);

    // console.log("expenses expenseIds", expenseIds);

    const expenses = [];
    for (let eId of expenseIds) {
      const expense = await getExpense(eId);
      expenses.push(expense);
    }

    return expenses;
  } finally {
    rclient.quit();
  }
}

async function deleteExpense(expenseId) {
  let rclient;
  try {
    rclient = await getRConnection();

    const key = `expense:${expenseId}`;
    await rclient.lRem("expenses", 0, key);
    await rclient.del(key);
  } finally {
    rclient.quit();
  }
}

async function updateExpense(expenseId, amount, category) {
  let rclient;
  try {
    rclient = await getRConnection();
    console.log("updating expense", expenseId);
    const key = `expense:${expenseId}`;
    await rclient.lRem("expenses", 0, key);
    await rclient.hSet(key, {
      amount: amount,
      category: category,
    });

    await rclient.rPush("expenses", key);
  } finally {
    rclient.quit();
  }
}

module.exports.getExpense = getExpense;
module.exports.createExpense = createExpense;
module.exports.getExpenses = getExpenses;
module.exports.deleteExpense = deleteExpense;
module.exports.updateExpense = updateExpense;
module.exports.analyzeExpense = analyzeExpense;
