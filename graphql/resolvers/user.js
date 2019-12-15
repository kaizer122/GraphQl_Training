const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
	createUser: async (args) => {
		try {
			const duplicate = await User.findOne({ email: args.userInput.email });
			if (duplicate) {
				throw new Error("User already exists");
			}
			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword
			});
			const savedUser = await user.save();
			return { ...savedUser._doc, password: null };
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};
