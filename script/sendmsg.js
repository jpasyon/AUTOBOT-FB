module.exports.config = {
    name: "sendmsg",
    version: "1.1.0",  // Updated version
    hasPermission: 2,
    credits: "Juno",
    description: "Send a message to a user by their user ID",
    commandCategory: "admin",
    usages: "ID [Text]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    // Check if the user provided a valid user ID and message
    if (args.length < 2) {
        return api.sendMessage(
            "Syntax error, use: sendmsg [ID_BOX] [message]",
            event.threadID,
            event.messageID
        );
    }

    // Get the user ID (the first argument) and the message (remaining arguments)
    const idbox = args[0];
    const reason = args.slice(1).join(" ");

    // Validate that the user ID is a number and has a realistic length for Facebook IDs
    if (!/^\d+$/.test(idbox) || idbox.length < 10) {
        return api.sendMessage(
            "Invalid user ID format. Please provide a valid numeric Facebook ID.",
            event.threadID,
            event.messageID
        );
    }

    try {
        // Attempt to send the message to the specified user ID
        await api.sendMessage(reason, idbox);

        // Notify the admin that the message has been sent successfully
        api.sendMessage(
            `Sent message: "${reason}" to user ID: ${idbox}`,
            event.threadID,
            event.messageID
        );
    } catch (error) {
        // Log detailed error information
        console.error("Error sending message: ", error);

        // Send a user-friendly error message back to the admin
        let errorMessage = "An error occurred while trying to send the message.";
        
        if (error.error === 10) {
            errorMessage += " This might be due to Facebook's permissions. Make sure the bot is authorized to message this user.";
        } else if (error.error === 368) {
            errorMessage += " Your bot is temporarily restricted from sending messages. Try again later.";
        }

        api.sendMessage(
            errorMessage,
            event.threadID,
            event.messageID
        );
    }
};
