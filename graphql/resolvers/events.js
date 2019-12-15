const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("./mergeHelpers");

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				return transformEvent(event);
			});
		} catch (error) {
			throw error;
		}
	},
	createEvent: async (args) => {
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: args.eventInput.price,
			date: new Date(args.eventInput.date),
			creator: "5df45aa6d608a620d598eec4"
		});
		try {
			const res = await event.save();
			const userfound = await User.findById("5df45aa6d608a620d598eec4");
			if (!userfound) {
				throw new Error("User not found");
			}
			userfound.createdEvents.push(event);
			await userfound.save();

			return transformEvent(res);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
