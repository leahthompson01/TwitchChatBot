require("dotenv").config();

const tmi = require("tmi.js");
const fs = require("fs-extra");
const path = require("path");
const data = fs.readJsonSync(path.join(__dirname, "chatbotCommands.json"));
const aliasData = fs.readJsonSync(path.join(__dirname, "aliases.json"));
const faveUsers = {
  earend: false,
  valkeryias: false,
  theyagich: false,
  theidofalan: false,
  schipthatcode: false,
  madeleinepatience: false,
  grimybadger: false,
  jddoesdev: false,
  seaninretro: false,
  codingwithstrangers: false,
  aza_app: false,
  grandbuh: false,
};

const client = new tmi.client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },

  identity: {
    username: `${process.env.TWITCH_USERNAME}`,
    password: `oauth:${process.env.TWITCH_OAUTH}`,
  },
  channels: [`${process.env.TWITCH_CHANNEL}`],
});

client.connect().catch(console.error);
// const map = new Map()
// map.set('!so', () => {
//   // do your so logic
// })

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  let messageLC = message.toLowerCase().replace(/\s+/, " ");
  let messageArr = messageLC.trim().split(" ");
  let username = "";
  // const canHandle = map.has(messageArr[0])
  // if (canHandle) Map.get

  if (messageArr.length >= 2 && messageArr[0] === "!so") {
    username = messageArr[1].replace("@", "");
    const keysArr = Object.keys(data);
    let noCustom = true;
    for (let i = 0; i < keysArr.length; i++) {
      if (data[keysArr[i]]["username"] === username) {
        const shoutoutsArr = data[keysArr[i]]["shoutouts"];
        let randomIndex = Math.floor(shoutoutsArr.length * Math.random());
        client.say(channel, shoutoutsArr[randomIndex]);
        noCustom = false;
      }
    }
    if (noCustom) {
      client.say(
        channel,
        `${
          messageArr[1]
        } is an amazing streamer! Go follow them at https://www.twitch.tv/${messageArr[1].replace(
          "@",
          ""
        )}`
      );
    }
  }
  if (aliasData[messageLC]) {
    messageLC = aliasData[messageLC];
  }
  if (data[messageLC]) {
    const shoutoutsArr = data[messageLC]["shoutouts"];
    let randomIndex = Math.floor(shoutoutsArr.length * Math.random());

    client.say(channel, shoutoutsArr[randomIndex]);
  }
  // need to add a check that sees if the shoutout already exists, and if so it adds to the shoutouts
  if (
    messageArr[0] === "!addcommand" &&
    (tags?.badges?.["moderator"] || tags?.badges?.["broadcaster"])
  ) {
    const newCommand = {
      shoutouts: [messageArr.slice(2).join(" ")],
    };
    data[`!${messageArr[1]}`] = newCommand;
    console.log(data);
    fs.writeFileSync("chatbotCommands.json", JSON.stringify(data, null, 1));
  }

  // !addAlias shoutout alias
  // !addCommand shoutout content
  // !addso username shoutout content

  //   console.log(message);
});
// tony shoutout WHO IS TONY
// wheely shoutout
// !girlboss 💅 YOU 💅 JUST 💅 GOT 💅 GIRLBOSSED 💅
