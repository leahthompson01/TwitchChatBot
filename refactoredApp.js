require("dotenv").config();

const chatCommands = {
  ear: {
    username: "earend",
    shoutouts: [
      "Some say he can sniff out Parkinsons: https://www.twitch.tv/earend ",
      "The ultimate degen hangout spot for all the besties: https://www.twitch.tv/earend ",
      "too busy thinking about grickle: https://www.twitch.tv/earend",
    ],
  },
  val: {
    username: "valkeryias",
    shoutouts: [
      "Greetings and Slututations for the slutsies: https://www.twitch.tv/valkeryias ",
      "Can't see the haters for these honkers: https://www.twitch.tv/valkeryias",
    ],
  },
  yag: {
    username: "theyagich",
    shoutouts: [
      "💅gaslight gatekeep girlboss💅: https://www.twitch.tv/theyagich",
    ],
  },
  travvy: {
    username: "techsavvytravvy",
    shoutouts: ["oh: https://www.twitch.tv/techsavvytravvy"],
  },
  wheely: {
    username: "undermywheel",
    shoutouts: [
        
    ]
  },
};
const tmi = require("tmi.js");

const client = new tmi.client({
  options: { debug: true, messagesLogLevel: "info" },
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
client.on("message", (channel, tags, message, self) => {
  if (self) return;

  let messageLC = message.toLowerCase();
  let messageArr = message.split(" ");
  let username = "";
  if (messageArr.length >= 2) {
    username = message.split(" ")[1].toLowerCase().replace("@", "");
  }

  if (messageLC === "!girlboss") {
    client.say(
      channel,
      `@${tags.username}, 💅 YOU 💅 JUST 💅 GOT 💅 GIRLBOSSED 💅`
    );
  } else if (messageLC === "!straw") {
    client.say(
      channel,
      "you come to a fork in the path. Before you are two cronozerofifteens. One of them says he cannot tell a lie, the other tells you about drinking gin through a costco hotdog like a straw"
    );
  } else if (messageLC === "!val" || username === "valkeryias") {
    client.say(
      channel,
      "Greetings and Slututations for the slutsies: https://www.twitch.tv/valkeryias "
    );
  } else if (messageLC === "!yag" || username === "theyagich") {
    client.say(
      channel,
      "💅gaslight gatekeep girlboss💅: https://www.twitch.tv/theyagich"
    );
  } else if (messageLC === "!ear" || username === "earend") {
    let num = Math.random();
    if (num <= 0.3333) {
      client.say(
        channel,
        "Some say he can sniff out Parkinsons: https://www.twitch.tv/earend "
      );
    } else if (num <= 0.6666) {
      client.say(
        channel,
        "The ultimate degen hangout spot for all the besties: https://www.twitch.tv/earend "
      );
    } else if (num <= 1) {
      client.say(
        channel,
        "too busy thinking about grickle: https://www.twitch.tv/earend"
      );
    }
  } else if (messageLC === "!wheely" || username === "undermywheel") {
    let num = Math.random();
    if (num <= 0.25) {
      client.say(
        channel,
        "The proud owner of skeeter.wtf: https://www.twitch.tv/undermywheel"
      );
    } else if (num <= 0.5) {
      client.say(channel, "WHO IS TONY?!: https://www.twitch.tv/undermywheel");
    } else if (num <= 0.75) {
      client.say(
        channel,
        "SOMEBODY GOME GET HERRRRRRR DUN DUN: https://www.twitch.tv/undermywheel"
      );
    } else if (num <= 1) {
      client.say(
        channel,
        "Our only other friend who lies to us as much as Crono does: https://www.twitch.tv/undermywheel"
      );
    }
  } else if (messageArr[0] === "!so") {
    client.say(
      channel,
      `${
        messageArr[1]
      } is an amazing streamer! Go follow them at https://www.twitch.tv/${messageArr[1].replace(
        "@",
        ""
      )}`
    );
  } else if (messageLC === "!github") {
    client.say(
      channel,
      "You can find my projects on my Github! https://github.com/leahthompson01"
    );
  } else if (messageLC === "!projectsite") {
    client.say(
      channel,
      "Here's the live site for my Animal Crossing project which I created on stream!  https://animal-crossing-app.netlify.app/"
    );
  } else if (messageLC === "!twitter") {
    client.say(
      channel,
      "When I'm offline, you can stay up to date with my coding journey on my Twitter: @LeahTCodes  https://twitter.com/LeahTCodes"
    );
  } else if (messageLC === "!100devs") {
    client.say(
      channel,
      `100devs is a free online full stack web development bootcamp run by Leon Noel 

      Twitch : https://www.twitch.tv/learnwithleon 
     
     Youtube : https://www.youtube.com/channel/UCGiRSHBdWuCgjgmPPz_13xw 
     
     Discord : https://discord.com/invite/zNxhjnmDPy and go to the getting started channel to join`
    );
  } else if (messageLC === "!grandbuh" || username === "grandbuh") {
    client.say(
      channel,
      "BoneZone BoneZone BoneZone BoneZone https://twitch.tv/Grandbuh"
    );
  } else if (messageLC === "!math") {
    client.say(
      channel,
      "oh no she's talking about math again NotLikeThis NotLikeThis"
    );
  } else if (messageLC === "!schedule") {
    client.say(channel, "Schedule? Haha. Funny");
  } else if (messageLC === "!cheerts") {
    client.say(channel, "gjet in looooser were goin DRINKINGSDLKGSDG");
  }

  //   console.log(message);
});
// tony shoutout WHO IS TONY
// wheely shoutout
// !girlboss 💅 YOU 💅 JUST 💅 GOT 💅 GIRLBOSSED 💅
