# Truth Dare or Die!!!!!

> Truth or Dare from Anywhere!! Play Truth or Dare with your friends over the internet.

## Team

  - __Product Owner__: Taylor Shephard
  - __Scrum Master__: Andy
  - __Development Team Members__: Andy, Taylor, Elijah

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Play Truth or Dare with your friends.

## Requirements

- Node 10.3.x
- Mongo
- etc
- etc

## Development

Database: 
  the mongoose.js file includes the schemas for user, rooms, truths, and dares. There are also helper functions under the schemas. 
  Helper Function:
    -save
        Save function handles the sign up for the users. It takes a user which is the user information, hash which is bcrypt to has the password, and a callback function that will be used on the server as res.send. It checks if the user exists already first, if the user doesn't exist then it will save the user's information to the database. 
    -getUser
        getUser function handles the log in for a user. It queries the database to find the user's username. If the username or password that was inserted is incorrect then it will return 'Username or Password not found', if the user is found then the user's information is returned and the user can sign in.
    -findRooms
        findRooms function queries through the database to find the roomname that the user is looking for.
    -randomID 
        randomID function will return a random number. It is used in the getTruth and getDare functions
    -getTruth
        getruth function will query through the database and find a random truth by its id using the randomID function
    -getDare
        getDare function will query through the database and find a random dare by its id using the randomID function
    -createRoom
        createRoom function creates a new room and saves it to the database. If the room name exists already then it will return 'Room already Exists', if not then it will create a new room.
    -updateRoom
        sets the status of the room to start when the game starts
    -endRoom
        deletes the room once the game is over
    -addDeath
        queries through the database and adds a death token to the user.

Server: 
  The server folder has server.js, video room key file, and video certificate file. The video room key and certificate is for the game room's web cam feature. The server.js file requires everything at the top of the file. Express is used for this server. The file also includes socketIO and the get and post requests.
    The requests: 
       - get request to '/users' for log in that will use the getUser function in the mongoose.js file.

       -post request to '/users' used for sign up, it hashes the password and saved the user's info to the database using the save function from mongoose.js.

       - post request to '/start' that will add a room to dv. It uses the createRoom function in mongoose.js

       -get request to a specific room for when a user puts in a room name when trying to add join a room

       -get request to '/truths' to get a truth from the database. It uses the getTruth function from the mongoose.js file

       -get request to '/dares' to get a dare from the database. It uses the getDare function from the mongoose.js file

       -get request to '/ready' to start the game. it uses the updateRoom function in mongoose.js

       -post request to '/grave' to go the database and a a death token to a user's info. It uses the addDeath function in mongoose.js

       -post request to '/end' to remove a room. It uses the endRoom function in the mongoose.js file.

    the socketIO
      -io is equal to socketIO.listen(server), it was made a variable up at the top
      
      -io.on 'connection' listens for when a user comes to the app

      -socket.on 'start' listens for when a game is started and will emit the game has started

      -socket.on 'sendTruth' will emit a truth

      -socket.on sendMessage will listen for when a message is sent and emit a message

      - socket.on 'join' will listen for when a user joins a room and inside of it will add a username, hasGone, and alive property to the socket and push the username into the players array at the top of io.on, which will be an array of all of the users in that room. then it will emit the room. socket.on 'join' also includes a post request to '/room' that will  make an array of sockets ids in the room and pick a random socket. It also has a game function that emit's who's turn it is. There is also a post request to '/votes' that counts the votes sent from the user and checks if a user was voted out or not. It will take a user out of the users array if the user fails.

      -socket.on 'disconnect' listens for when a user leaves the app

Client: 
  


### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
