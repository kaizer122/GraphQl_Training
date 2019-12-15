const User = require("../../models/user");
const Event = require("../../models/event");
const { dateToIso } = require("../../helpers/date");

const user = async (userId) => {
	try {
		const user = await User.findById(userId);
		return {
			...user._doc,
			password: null,
			createdEvents: events.bind(this, user._doc.createdEvents)
		};
	} catch (error) {
		throw error;
	}
};

const events = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });
		return events.map((event) => {
			return transformEvent(event);
		});
	} catch (error) {
		throw error;
	}
};

const singleEvent = async (eventId) => {
	try {
		const event = await Event.findById(eventId);
		return transformEvent(event);
	} catch (error) {
		throw error;
	}
};

const transformEvent = (event) => {
	return {
		...event._doc,
		creator: user.bind(this, event._doc.creator),
		date: dateToIso(event._doc.date)
	};
};

const transformBooking = (booking) => {
	return {
		...booking._doc,
		user: user.bind(this, booking._doc.user),
		event: singleEvent.bind(this, booking._doc.event),
		createdAt: dateToIso(booking._doc.createdAt),
		updatedAt: dateToIso(booking._doc.updatedAt)
	};
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
