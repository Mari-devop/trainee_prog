# App functionality:

1. Create multiple users
2. Enter info about users
    1. name
    2. gender from the list
    3. age
3. After adding a user, it should offer to create another one
4. Pressing ENTER instead of entering a name, stops the process of adding users.
5. After declining to add more users, app offers to find a user by name. There are two options: Y/N. N — exit, Y - the search is performed, and the results are reported. If the user is found in the database, all their information is displayed; if not, it's indicated that such a user doesn't exist

![CLI_Task_1.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/541b7f6a-3be1-4563-9460-36b9330aa2c0/CLI_Task_1.gif)

<aside>
⚠️ Use [`Inquirer`](https://www.npmjs.com/package/inquirer) for CLI

</aside>
