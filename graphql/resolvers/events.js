const Event = require("../../models/event")
const User = require('../../models/user')
const { transformEvent } = require('./merge');



module.exports = {
    events: () => {
        return Event.find()
        .then(events => {
            return events.map(event => {
                return transformEvent(event)
            })
        })
        .catch(err => {
            throw err
        })
    },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '63eab061aad97e6cb740ba94'
        });
        let createdEvent;
        return event
            .save() //save to db
            .then(result => {
                createdEvent = transformEvent(result)
                return User.findById('63eab061aad97e6cb740ba94')
            })
            .then(user => {
                if (!user){
                    throw new Error('User not found') //rarely will hit this
                }
                user.createdEvents.push(event);
                return user.save()
            })
            .then(result => {
                return createdEvent;
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    }
}
