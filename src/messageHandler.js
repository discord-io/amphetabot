function parseMessage(rawMessage) {
  if (rawMessage.author.bot) return;
  const splitMessage = rawMessage.split(' ');
  const cmd = splitMessage[0].replace('>', '');
  const parsedMessage = splitMessage.slice(1);
  return { cmd, args: parsedMessage };
}

export class MessageHandler {
  cmd;
  args;

  static botPrefix = ">";

  static fromMessage(rawMessage) {
    if (!rawMessage.startsWith('>') || rawMessage.author.bot) return;
    const { cmd, args } = parseMessage(rawMessage);
    return new MessageHandler(cmd, args);
  }

  constructor(cmd, args) {
    this.cmd = cmd;
    this.args = args;
  }

  parse(msg = this.cmd) {
    const { cmd, args } = parseMessage(msg);
    this.cmd = cmd;
    this.args = args;
    return this;
  }
}
