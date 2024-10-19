import repl from 'node:repl';
import client from '#client';

import { $ } from 'zx';


export const initRepl = (context = {}) => {
  if (!context['client']) context.client = client;

  const r = repl.start({
    prompt: 'bot > ',
    useColors: true,
  });

  for (const [key, val] of Object.entries(context)) {
    r.context[key] = val;
  }

  r.defineCommand('login', {
    help: 'Login to the Discord API',
    async action() {
      this.clearBufferedCommand();
      await r.context.client.login(client.token);
      r.setPrompt('bot (logged in) > ');
      this.displayPrompt();
    }
  });

  r.defineCommand('logout', {
    help: 'Log out of the Discord API and stop the bot',
    action() {
      console.log('Logging out...');
      this.close();
    }
  });

  r.defineCommand('deploy', {
    help: 'Deploy/update slash commands',
    async action() {
      const res = await $`just deploy-guild`;
      console.log(res);
      this.displayPrompt();
    }
  });
};