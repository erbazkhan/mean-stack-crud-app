# C.R.U.D-app-with-Authentication
A basic C.R.U.D. app made using MEAN Stack, in which all four types of requests are entertained using HTML forms. For front end, simple HTML and CSS were used intead of Angular.

**AUTHENTICAION:**

`bcryptjs` was used for hashing the passwords, which were then stored in database. `passport-local` was used for authentication. After validation `express` middleware was used to authenticate the whole app. The URL endpoints and functionalities related with them is following.

*'/signup'* - A new admin registers here.

*'/login'* - Admin logs in. Each request redirects to this URL if NOT authenticated.

**C.R.U.D. :**

`express` was used as the middleware. The URL endpoints and functionalities related with them is following.

*'/'* - This is the home page containing CRUD menu. 4 button button are present which redirects to following pages which contain relevant forms.

*'/adduser'* - A user (data) is added (PUT)

*'/users'* - All the users are retrieved (GET)

*'/update'* - A user is updated here (POST)

*'/delete'* - A user is deleted here. (DELETE)

**DIRECTORY INFO:**

The server file is named as *NewServer.js*. All the *.html*, *.css* and *.js* files are present in home/main directory except models. Models are present in *models* directory.
