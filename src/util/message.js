import dayjs from "dayjs";

const formatTime = d => dayjs(d).format('HH:mm:ss');
const currentDate = dayjs().format('MM/DD/YYYY');

export const txtFormatter = m => `[${formatTime(m.createdAt)}] ${m.author.username}: ${m.cleanContent}\n`;
export const mdFormatter = m => `* [${formatTime(m.createdAt)}] __${m.author.username}__: ${m.cleanContent}\n`;


export const jsonMessageFormatter = m => {
  const message = {
    id: m.id,
    guildId: m.guildId,
    channelId: m.channelId,
    createdOn: m.createdTimestamp,
    content: m.content,
    authorId: m.author.id,
    authorName: m.author.username
  };
  if (m.attachments) message.attachments = m.attachments;
  return message;
};