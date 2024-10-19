import axios from 'axios';
import dayjs from 'dayjs';

const baseURL = 'https://zaza.ovh';

export class Paste {
  name;
  content;
  _;
  url;

  static _ = axios.create({
    baseURL: baseURL,
    params: { mime: 'application/json' }
  });

  static async upload(content, opts = {}) {
    const form = new FormData();
    form.append('c', content);
    if (opts.isPrivate) form.append('p', opts.isPrivate);
    if (opts.expiration) form.append('e', opts.expiration);
    if (opts.password) form.append('s', opts.password);
    if (opts.name) form.append('n', opts.name);

    const res = await Paste._.request({
      method: 'POST',
      url: "/",
      data: form
    });

    return res.data;
  }

  static async fromMessageList({ messages, data }) {
    const today = dayjs().format('MM/DD/YYYY HH:mm');
    let mdString = `# Channel: #${data.channelName} (${data.channelId})\n`;
    mdString += `- *Exported on ${today}*\n`;
    mdString += `- *Filters: coming soonTM*\n---\n`;

    console.log(messages);

    for (const message of messages) {
      console.log(message);
      const { cleanContent, author, createdAt, editedAt, url } = message;
      const time = dayjs(createdAt).format('MM/DD/YY HH:mm:ss');
      let innerStr = `* __Timestamp: ${time}__ | Author: ${author.globalName} | Link: [Jump To Message](${url})\n> ${cleanContent}\n`;
      mdString += innerStr;
    }

    const res = await this.upload(mdString);
    console.log(res);
    // return new Paste(data.name ?? res.data.name, mdString);
    return res;
  }

  constructor(name, content) {
    this.name = name;
    this.content = content;
    this._ = axios.create({
      baseURL: baseURL,
      params: { mime: 'application/json' }
    });
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setContent(content) {
    this.content = content;
    return this;
  }

  //* GET * Get Markdown-formatted file
  async getMD(name) {
    const res = await this._.request({
      method: 'GET',
      url: `/a/${name ?? this.name}`
    });

    console.log(res.data);
    return res.data;
  }

  //* POST * Upload a new paste
  async upload({ expiration, password, name, isPrivate = false } = {}) {
    const form = new FormData();
    form.append('c', this.content);
    form.append('p', isPrivate);
    if (expiration) {
      form.append('e', expiration);
    }
    if (password) {
      form.append('s', password);
    }
    if (name) {
      form.append('n', name);
    }
    const res = await this._.request({
      method: 'POST',
      url: '/',
      data: form
    });

    this.data = res.data;
    return res.data;
  }

  //* PUT * Update an existing paste
  async update({ content = this.content, password, expiration, name } = {}) {
    const form = new FormData();
    form.append('c', content);
    if (password) form.append('p', password);
    if (expiration) form.append('e', expiration);

    const url = `${name ?? this.name}`;
    if (password) url += `:${password}`;

    const res = await this._.request({
      method: 'PUT',
      url: url,
      data: form
    });

    return res.data;
  }

  //* DELETE * Delete an existing paste
  async delete({ name, password } = {}) {
    const url = `${name ?? this.name}`;
    if (password) url += `:${password}`;

    const res = await this._.request({
      method: 'DELETE',
      url: url
    });

    return res.data;
  }
}

// const p = new Paste('testAPI', 'Hello there! 1234... does this work?');
// const msg = await p.upload();

// console.log(msg);
