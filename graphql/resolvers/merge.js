const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

//model relations dynamically and very flexible, can drill indefinitely
const user = userId => {
    return User.findById(userId)
    .then(user => {
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents), password: null}
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

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
