# C.R.U.D-app-with-Authentication
It is a basic C.R.U.D. app made with node.js., express and mongoDB. For authentication passport and bcryptjs. We are using port 8888.

**AUTHENTICAION:**

It has sign up and login options for admins. The URL endpoints and functionalities related with them is following.

*'/signup'* - A new admin registers here.

*'/login'* - Admin logs in.

**C.R.U.D:**

The URL endpoints and functionalities related with them is following.

*'/'* - This is the home page containing CRUD menu. 4 button button are present which redirects to following pages which contain relevant forms.

*'/adduser'* - A user (data) is added (POST)

*'/users'* - All the users are retrieved (GET)

*'/update'* - A user is updated here (PUT)

*'/delete'* - A user is deleted here. (DELETE)

**DIRECTORY INFO:**

The server file is named as NewServer.js. All the *.html*, *.css* and *.js* files are present in home/main directory except models. Models are present in *models* folder.
