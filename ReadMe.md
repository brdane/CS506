# Start

## Start Mongo DB
Install Mongo DB
`
brew install mongodb-community@8.0  
`
and
brew services start mongodb/brew/mongodb-community
will start a mongo DB at 27017


We can run to check the updates in our databse.
`
mongosh
`

and create database
`
use mydatabase
`
## Setup Backend
To install requirements of the MongoDB, we can use 
`
npm init -y
npm install express mongoose cors
`

And then run
`
node server.js
`

And open the frontends.