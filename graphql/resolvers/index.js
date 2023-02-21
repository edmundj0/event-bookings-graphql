const bcrypt = require('bcryptjs')

const Event = require("../../models/event")
const User = require('../../models/user')
const Booking = require('../../models/booking')

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString()
    }
}


//model relations dynamically and very flexible, can drill indefinitely
const user = userId => {
    return User.findById(userId)
    .then(user => {
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
    })
    .catch(err => {
        throw err
    })
}

const events = eventIds => {
    return Event.find({ _id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return transformEvent(event)
        })
    })
    .catch(err => {
        throw err
    })
}

const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId)
        return transformEvent(event)

    } catch (err) {
        throw err
    }
}

// const user = async (userId) => {
//     try {
//         const user = await User.findById(userId).lean();
//         return { ...user, createdEvents: user.createdEvents }
//     } catch (err) {
//         throw err
//     }
// }


// const events = async (eventIds) => {
//     try {
//         const foundEvents = await Event.find({_id: {$in: eventIds}}).lean()
//         const eventsWithCreators = await Promise.all(foundEvents.map(async (event) => {
//             const creator = await user(event.creator);
//             return { ...event, _id: event.id, creator}
//         }))
//         return eventsWithCreators
//     } catch (err) {
//         throw err
//     }
// }


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
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                // console.log(booking, 'BOOKING')
                return transformBooking(booking)
            })
        }catch (err){
            throw err
        }
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
    },
    createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('Email already exists.')
                }
                return bcrypt.hash(args.userInput.password, 12)  //12 rounds of salting
                    .then(hashedPassword => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword
                        })
                        return user.save();
                    })
                    .then(result => {
                        return { ...result._doc, password: null }
                    })
                    .catch(err => {
                        throw err
                    })
            })
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
            user: '63eab061aad97e6cb740ba94',
            event: fetchedEvent
        })
        const result = await booking.save();
        return transformBooking(result)
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({_id: args.bookingId})
            return event
        } catch (err) {
            throw err
        }
    }
}



    // events: async () => {
    //     try {
    //         // return await Event.find().populate('creator').lean(); //populates with relations
    //         const events = await Event.find().lean();
    //         const creatorPromises = events.map(event => user(event.creator));
    //         const creators = await Promise.all(creatorPromises)
    //         const eventsWithCreators = events.map((event, index) => {
    //             return {...event, creator: creators[index]}
    //         })
    //         return eventsWithCreators
    //     } catch (err) {
    //         throw err
    //     }
    // },
