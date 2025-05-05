# DLSociety

**DLSociety** is a mobile app that is a place for viewing De La Salle Lipa's Student Organization's events, posts, and announcements.

## Requirements

**MUST** have [**Expo Go**](https://expo.dev/go)

## Installation

Copy the repository link to clone the project
Make a folder to store the files, then right click and open the terminal and type:

```
git clone <link here>
```

Open the folder and open the terminal and type this to open in code editor

```
code .
```

After opening your code editor, open a terminal and make your own **branch**.

- To make a new branch:

  ```
  git checkout -b <branch name here>
  ```

  ```powershell
  # This is to check if you are in the branch you created
  git branch
  ```

Happy coding!

## Before running the app

Unfortunately for now the app is developed in a localhost environment, meaning everytime someone wants to run the app, they have to change their IP address according to their own before running the app.
So to change the IP addresses the group has made a config file to change the IP address in one place.
To find the file, go to:

```
/softeng2/frontend/prototype-test/src/components/
```

Once you're in the components folder, open the file `config.tsx` there you will find the IP address.
Now just change that IP address and now you are ready to run the app.

## Running the app

Once you are in the editor open two new terminals:

- On the **first terminal** type:

  ```
  cd ./backend
  ```

  This will make your terminal go to the **backend folder**, and in there type in the terminal:

  ```
  npm run server
  ```

  This make so it will run the backend server.

- On the **second terminal** type:

  ```
  cd ./frontend/prototype-test
  ```

  This will make your terminal go to the **frontend folder** where you can run the app itself.
  In the terminal again type:

  ```
  npm start
  ```

  After typing this, it should generate a QR code. Use you phone with Expo Go installed to scan the code to open the app on your phone.
  Or you can run the command below or after doing `npm start` press the 'a' key on the terminal

  ```
  npm run android
  ```

  To run the app on an android emulator.
