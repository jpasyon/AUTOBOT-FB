module.exports.config = {
    name: "noti",
    version: "1.1.1",
    role: 1,
    credits: "Juno",
    description: "Sends a message to all groups or specific groups, only available for admin.",
    usePrefix: false, // No prefix required
    commandCategory: "noti",
    usages: "[ID(s) | Text]",
    cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
    if (args.length < 1) {
        return api.sendMessage(
            "Syntax error: use noti all [Text] or noti [ID(s)] [Text].",
            event.threadID,
            event.messageID
        );
    }

    const customMessage = args.slice(1).join(' ') || args.join(' ');
    const isBroadcastToAll = args[0] === 'all';
    const targetThreadIDs = !isBroadcastToAll ? args[0].split(' ') : [];
    let sentCount = 0;

    if (!isBroadcastToAll) {
        // Validate IDs
        for (const threadID of targetThreadIDs) {
            if (!/^\d+$/.test(threadID)) {
                return api.sendMessage(
                    `Invalid ID format: ${threadID}. Provide valid numeric thread IDs or use 'all' to send to all groups.`,
                    event.threadID,
                    event.messageID
                );
            }
        }
    }

    async function sendMessageToThread(threadID) {
        try {
            // Send the exact message you entered
            await api.sendMessage(`Notification from Admin:\n\n${customMessage}`, threadID);
            sentCount++;
        } catch (error) {
            console.error(`Error sending message to thread ${threadID}:`, error);
        }
    }

    if (isBroadcastToAll) {
        // Send notification to all group chats
        const threadList = await api.getThreadList(25, null, ['INBOX']);
        for (const thread of threadList) {
            if (sentCount >= 20) break;
            if (thread.isGroup && thread.threadID !== event.threadID) {
                await sendMessageToThread(thread.threadID);
            }
        }
    } else {
        // Send notification to the specified group IDs
        for (const threadID of targetThreadIDs) {
            await sendMessageToThread(threadID);
        }
    }

    // Send feedback to the admin
    if (sentCount > 0) {
        api.sendMessage(`Notification from Admin:\n› Sent the notification to ${sentCount} group(s) successfully.`, event.threadID);
    } else {
        api.sendMessage("› No eligible group threads found or specified to send the message to.", event.threadID);
    }
};
