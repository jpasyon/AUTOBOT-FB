const axios = require('axios');

module.exports.config = {
    name: 'deletecom',
    usedby: 4,
    info: 'Delete a comment from a Facebook post using the bot',
    onPrefix: true,
    dev: 'Juno', //Updated credits
    cooldowns: 5,
    description: 'Delete a comment from a Facebook post',
    usage: 'deletecom [URL] [comment to delete]',
};

module.exports.run = async function({ api, event, target }) {
    const prompt = target.join(' ');

    if (!prompt) {
        return api.sendMessage('Usage: deletecom [URL] [comment to delete]', event.threadID, event.messageID);
    }

    const sending = await api.sendMessage('Deleting Comment......', event.threadID, event.messageID);
    const url = target[0];
    const commentToDelete = target.slice(1).join(' ');

    const regexPfbid = /pfbid\w+/;
    const regexPostSegment = /\/posts\/(\w+)/;
    const regexGroupID = /\/groups\/[^/]+\/permalink\/(\d+)/;

    let postID = url.match(regexPfbid);

    if (!postID) {
        let match = url.match(regexPostSegment);
        if (!match) {
            match = url.match(regexGroupID);
        }
        postID = match ? match[1] : null;
    } else {
        postID = postID[0];
    }

    api.editMessage('Extracting URL into Post ID', sending.messageID, event.threadID, event.messageID);

    if (!postID) {
        return api.editMessage(
            'Invalid URL. Please provide a valid Facebook post URL.',
            sending.messageID,
            event.threadID,
            event.messageID
        );
    }

    try {
        // Find the comment by matching the content with the commentToDelete
        const comments = await api.getComments(postID); // Assuming this API method is available
        const comment = comments.find(c => c.message === commentToDelete);

        if (!comment) {
            return api.editMessage(
                'No matching comment found to delete.',
                sending.messageID,
                event.threadID,
                event.messageID
            );
        }

        // Delete the comment using the commentID
        await api.deleteComment(postID, comment.commentID);
        api.editMessage(
            `Comment successfully deleted.`,
            sending.messageID,
            event.threadID,
            event.messageID
        );
    } catch (error) {
        api.editMessage(error.message, sending.messageID, event.threadID, event.messageID);
    }
};
