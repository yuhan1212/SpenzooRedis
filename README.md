# CS5200 Project 3 Redis

### Application name: Spenzoo

### Team member: YuHan Chi, Tzu-Chi Tai

### Project proposal:  
We would like to extend our previous projects, which is basically a database for an expense recording app.
Our application will let the user CRUD an expense, which stores the amount and the category. We’re going to store each user’s expense records as sorted sets, taking the sum of expense amounts in a specific category as score, and the category as value. This will allow us to rank the categories each user spent the most in, giving them a clear analysis on their spending situation.


### Installation
1. Clone the repository to your desktop
2. Open terminal
3. type: `cd Desktop/SpenzooRedis`
4. type: `npm install`
5. type: `node query.js`
6. ^C to quit Redis server
7. type: `npm start`
8. Open any browser, type in the link: `localhost:5000`

![](A.%20UML%20Class%20Diagram.png)

For the project, we discussed and wrote down the business requirements together, then split the tasks as below:

Hannah Chi @YuHan Chi worked on:
UML Class Diagram
Creating the database with MongoDB and writing the queries that represent the key features of our app

Tzu-Chi Tai @Sabrina Tai worked on:
ERD and relational schema
Generating test data with the help of Mockaroo

Then for creating a basic Node + Express application, we implemented together by doing pair programming. All commits are made by Hannah because we organized everything to do a checkdown before submitting the final work.
