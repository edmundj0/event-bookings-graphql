const authResolver = require('./auth')
const eventsResolver = require('./events')
const bookingResolver = require('./booking')

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver
}

module.exports = rootResolver;


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
