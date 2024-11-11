module.exports.config = {
    name: "noti", // Command name is "noti"
    version: "1.0.0",
    role: 1, // Admin-only role
    credits: "Juno",
    description: "Sends a notification message to all groups, only usable by the admin.",
    usePrefix: false, // No prefix required
    commandCategory: "noti",
    usages: "[Text]",
    cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const isAdmin = threadInfo.adminIDs.includes(event.senderID); // Check if the user is an admin in the group

    if (!isAdmin) {
        return api.sendMessage("You do not have permission to use this command.", event.threadID);
    }

    const threadList = await api.getThreadList(25, null, ['INBOX']);
    let sentCount = 0;
    const custom = args.join(' '); // The custom message (prompt) provided by the admin

    async function sendMessage(thread) {
        try {
            await api.sendMessage(`Notification from Admin:\n${custom}`, thread.threadID);
            sentCount++;
        } catch (error) {
            console.error("Error sending a message:", error);
        }
    }

    for (const thread of threadList) {
        if (sentCount >= 20) {
            break;
        }
        if (thread.isGroup && thread.name != thread.threadID && thread.threadID != event.threadID) {
            await sendMessage(thread);
        }
    }

    if (sentCount > 0) {
        api.sendMessage(`Notification from Admin:\n› Sent the notification successfully.`, event.threadID);
    } else {
        api.sendMessage("› No eligible group threads found to send the message to.", event.threadID);
    }
};
