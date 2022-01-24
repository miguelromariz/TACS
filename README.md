# TACS

Dynamic CRUD
## Report

* [Report](https://www.overleaf.com/read/zhbzcnxjchtw)

## Requirements

* [Nodejs](https://nodejs.org/en/)
* [Postgresql](https://www.postgresql.org/download/)

## Setup Instructions

Install the necessary dependencies by running `npm install` in the root directory

Create a user named `user1` with password `password` in postgresql, with database creation permissions:

1. Login with default user (ex: run `psql --username=postgres`, then use the password chosen when installing postgres). The `postgres=#` prompt should appear; 
2. run `CREATE ROLE user1 WITH LOGIN PASSWORD 'password'`
3. run `ALTER ROLE user1 CREATEDB;`
4. run `\du` to confirm everything worked, by listing all users and roles
5. run `\q` to end the default session

Create a database named `crud`:
1. Login with user1 by running `psql -d postgres -U user1`. The `postgres=>` prompt should appear
2. run `CREATE DATABASE crud;`
4. run `\list` to confirm everything worked, by listing all databases
5. run `\q` to end the session



## Running Instructions

To run the database creation app, run `node gen.js`, then open the browser at "http://localhost:3030/"

To run the generated crud application, run `node app.js`, then open the browser at "http://localhost:3000/"
