# CS5200 Project 3 Redis

### Application name: Spenzoo

### Team member: YuHan Chi, Tzu-Chi Tai

### Project proposal:  
We would like to extend our previous projects, which is basically a database for an expense recording app.
Our application will let the user CRUD an expense, which stores the amount and the category. We’re going to store each user’s expense records as sorted sets, taking the sum of expense amounts in a specific category as score, and the category as value. This will allow us to rank the categories each user spent the most in, giving them a clear analysis on their spending situation.


### Installation
1. Clone the repository to your desktop
2. Open terminal
3. type: `cd SpenzooRedis`
4. type: `node query.js`
5. type: ^C
6. type: `npm start`
7. Open any browser, type in the link: `localhost:5000`

![](A.%20UML%20Class%20Diagram.png)