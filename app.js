const express = require('express');
const bodyParser = require ('body-parser');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql')
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use('/graphql', expressGraphQL({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }
        input UserInput {
            email: String!
            password: String!
        }

        input EventInput {
            title : String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `) ,
    rootValue: {
        events: () => {
            return Event
                .find()
                .then(events => {
                    return events.map(event =>  {
                        return  {...event._doc};
                    })
                 })
                .catch(err => {
                console.log(err);
                throw err;
                })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5df454786a7c66cf2cfb01d0"
            })
            let createdEvent;
            return event
                  .save()
                  .then(res => {
                    createdEvent = {...res._doc};
                     return User.findById("5df454786a7c66cf2cfb01d0")
                  })
                  .then( user => {
                      if(! user) {
                          throw new Error('User not found');
                      }
                        user.createdEvents.push(event);
                        return user.save();
                  })
                  .then(res => {
                      return createdEvent;
                  })
                  .catch(err => {
                        console.log(err);
                        throw err;
                  });
        },
        createUser: args => {
            return User.findOne({email: args.userInput.email}).then(user => {
                if (user) {
                    throw new Error('User already exists');
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
                  .then( hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    })
                    return user.save();

                  })
                  .then(result => {
                      return {...result._doc, password: null};
                  })
                  .catch(err => {
                      console.log(err);
                      throw err;
                  })

        
             
        }

    },
    graphiql: true
})
);

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@dawaltest-3stqz.gcp.mongodb.net/${
    process.env.MONGO_DB
    }?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(process.env.MONGO_USER)
        console.log (err); 
    })
