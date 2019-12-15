const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformEvent, transformBooking } = require("./mergeHelpers");

module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map((booking) => {
				return transformBooking(booking);
			});
		} catch (error) {
			throw error;
		}
	},
	bookEvent: async (args) => {
		const event = await Event.findById(args.eventId);
		const booking = new Booking({
			user: "5df45aa6d608a620d598eec4",
			event: event
		});
		try {
			const res = await booking.save();
			return transformBooking(res);
		} catch (error) {
			throw error;
		}
	},
	cancelBooking: async (args) => {
		try {
			const booking = await Booking.findById(args.bookingId);
			if (!booking) {
				throw Error("Booking does not exist");
			}
			const event = await Event.findById(booking.event);
			await Booking.deleteOne(booking);
			return transformEvent(event);
		} catch (error) {
			throw error;
		}
	}
};
