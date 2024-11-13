module.exports.config = {
    name: "noti",
    version: "1.1.0",
    role: 1,
    credits: "Juno",
    description: "Sends a message to all groups or a specific group, only available for admin.",
    usePrefix: false, // No prefix required
    commandCategory: "noti",
    usages: "[ID | Text]",
    cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
    const customMessage = args.slice(1).join(' ') || args.join(' ');
    let targetThreadID = args[0] !== 'all' ? args[0] : null;
    let sentCount = 0;

    if (args.length < 1) {
        return api.sendMessage(
            "Syntax error, use: noti all [Text] or noti [ID] [Text]",
            event.threadID,
            event.messageID
        );
    }

    if (targetThreadID && targetThreadID !== 'all' && !/^\d+$/.test(targetThreadID)) {
        return api.sendMessage(
            "Invalid ID format. Provide a numeric thread ID or use 'all' to send to all groups.",
            event.threadID,
            event.messageID
        );
    }

    async function sendMessageToThread(threadID) {
        try {
            await api.sendMessage(`Notification from Admin:\n\n${customMessage}`, threadID);
            sentCount++;
        } catch (error) {
            console.error("Error sending a message:", error);
        }
    }

    if (targetThreadID && targetThreadID !== 'all') {
        // Send notification to a specific group
        await sendMessageToThread(targetThreadID);
    } else {
        // Send notification to all group chats
        const threadList = await api.getThreadList(25, null, ['INBOX']);

        for (const thread of threadList) {
            if (sentCount >= 20) break;
            if (thread.isGroup && thread.threadID !== event.threadID) {
                await sendMessageToThread(thread.threadID);
            }
        }
    }

    // Send feedback to the admin
    if (sentCount > 0) {
        api.sendMessage(`Notification from Admin:\n› Sent the notification to ${sentCount} group(s) successfully.`, event.threadID);
    } else {
        api.sendMessage("› No eligible group threads found to send the message to.", event.threadID);
    }
};
