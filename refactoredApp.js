require("dotenv").config();

const tmi = require("tmi.js");
const fs = require("fs-extra");
const path = require("path");
const { triggerAsyncId } = require("async_hooks");
const data = fs.readJsonSync(path.join(__dirname, "chatbotCommands.json"));
const aliasData = fs.readJsonSync(path.join(__dirname, "aliases.json"));
const dialogueData = fs.readJsonSync(
  path.join(__dirname, "dialogueSuggestions.json")
);
const usernameData = fs.readJsonSync(path.join(__dirname, "nicknames.json"));
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
  t3h_danger: false,
  ladybluenotes: false,
  goosechaser12: false,
  dancancode: false,
  undermywheel: false,
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

client.on("message", (channel, tags, message, self) => {
  console.log(message);
  if (self) return;

  let messageLC = message.replace(/\s+/, " ");
  let lowerMessageLC = messageLC.toLowerCase();
  let messageArr = messageLC.trim().split(" ");
  let username = "";
  let commandname = messageArr[0].toLowerCase();
  // const canHandle = map.has(messageArr[0])
  // if (canHandle) Map.get

  if (messageArr.length >= 2 && commandname === "!so") {
    // making it work where you can put !so nickname and it will use
    //custom shoutout for that nickname if exists
    username = messageArr[1].replace("@", "");
    console.log("username", username);
    console.log(data[`!${username}`]);
    shoutoutUser(username.toLowerCase(), channel);
  }
  console.log(lowerMessageLC)
  if (aliasData[lowerMessageLC]) {
    messageLC = aliasData[lowerMessageLC];
    if (data[messageLC]) {
      const shoutoutsArr = data[messageLC.toLowerCase()]["shoutouts"];
      let randomIndex = Math.floor(shoutoutsArr.length * Math.random());

      client.say(channel, shoutoutsArr[randomIndex]);
    }
  }
    if (data[lowerMessageLC]) {
      const shoutoutsArr = data[messageLC.toLowerCase()]["shoutouts"];
      let randomIndex = Math.floor(shoutoutsArr.length * Math.random());

      client.say(channel, shoutoutsArr[randomIndex]);
    }
  // need to add a check that sees if the shoutout already exists, and if so it adds to the shoutouts
  if (commandname === "!addso" && isModerator(tags)) {
    //!addso nickname username all of this is the shoutout
    //!addso ear earend
    // check if username
    if (messageArr.length === 1 && commandname === "!addso") {
      client.say(channel, "!addso nickname username the shoutout goes here");
      return;
    }
    
    username = messageArr[2].toLowerCase();
    const nickname = `!${messageArr[1].toLowerCase()}`;
    console.log(nickname)
    let shoutoutsArr = [];
    if (data[nickname]) {
      shoutoutsArr = data[nickname]["shoutouts"];
      shoutoutsArr.push(messageArr.slice(2).join(" "));
      data[nickname]["shoutouts"] = shoutoutsArr;
      fs.writeFileSync("chatbotCommands.json", JSON.stringify(data, null, 1));
      return;
    }else if (aliasData[nickname]) {
      shoutoutsArr = data[aliasData[nickname]]["shoutouts"];
      console.log(data[aliasData[nickname]]["shoutouts"]);
      console.log(shoutoutsArr[0])
      shoutoutsArr.push(messageArr.slice(2).join(" "));
      fs.writeFileSync("chatbotCommands.json", JSON.stringify(data, null, 1));
      return;
      // data[usernameData[aliasData[nickname]]]["shoutouts"] = shoutoutsArr;
    }
    // !so nickname username this is the shoutout
    if (usernameData[username] !== undefined) {
      shoutoutsArr = data[usernameData[username]]["shoutouts"];
      shoutoutsArr.push(messageArr.slice(3).join(" "));
      data[nickname]["shoutouts"] = shoutoutsArr;
      fs.writeFileSync("chatbotCommands.json", JSON.stringify(data, null, 1));
    } else {
      usernameData[username] = nickname;
      const newCommand = {
        username: username,
        shoutouts: [messageArr.slice(3).join(" ")],
      };
      data[nickname] = newCommand;
      fs.writeFileSync("nicknames.json", JSON.stringify(usernameData, null, 1));
      fs.writeFileSync("chatbotCommands.json", JSON.stringify(data, null, 1));
    }
  }
  if (commandname === "!addcommand" && isModerator(tags)) {
    if(messageArr.length <3){
      client.say(channel, "");
    }
    const nickname = `!${messageArr[1].toLowerCase()}`;
    // !addcommand nickname this is the shoutout
    let shoutoutsArr = [];
    // checking if already have !nickname command
    if (data[nickname] !== undefined) {
      shoutoutsArr = data[nickname]["shoutouts"];
      shoutoutsArr.push(messageArr.slice(2).join(" "));
      data[nickname]["shoutouts"] = shoutoutsArr;
    } else {
      shoutoutsArr.push(messageArr.slice(2).join(" "));
      const newCommand = {
        shoutouts: shoutoutsArr,
      };
      data[`!${messageArr[1]}`] = newCommand;
      console.log(data);
    }
    fs.writeFileSync("chatbotCommands.json", JSON.stringify(data, null, 1));
  }
  //add !adddialogue command to write to dialogueSuggestions.json
  if (commandname === "!add_dialogue") {
    add_dialogue(messageArr);
    // let dialogueArrLength = Object.keys(dialogueData).length;
    // const newObj = { dialogue: messageArr.slice(1).join(" ") };
    // console.log("this is the  new obj " + messageArr.slice(1));
    // dialogueData[`dialogue${dialogueArrLength + 1}`] = newObj;

    // fs.writeFileSync("dialogueSuggestions.json", JSON.stringify(dialogueData, null, 1));
  }

  if (commandname === "!editso" && isModerator(tags)) {
    const nickname = `!${messageArr[1].toLowerCase()}`;
    // !addcommand nickname this is the shoutout
    console.log(nickname);
    let shoutoutsArr = [];
    if (data[nickname] !== undefined) {
      shoutoutsArr = data[nickname]["shoutouts"];
      shoutoutsArr.push(messageArr.slice(2).join(" "));
      data[nickname]["shoutouts"] = shoutoutsArr;
    } else {
      shoutoutsArr.push(messageArr.slice(2).join(" "));
      const newCommand = {
        shoutouts: shoutoutsArr,
      };
      data[`!${messageArr[1]}`] = newCommand;
      console.log(data);
    }
    fs.writeFileSync("chatbotCommands.json", JSON.stringify(data, null, 1));
  }
  //  if user is in faveUsers array, check to see if
  // !faveUsers[username], and if it is change to true
  //add a !commands shoutout that shows all of the commands
  //or do command categories [!so, !addcommand, !add_dialogue,]
  // optional chaining instead of two seperate conditions possibly
  if (faveUsers[tags.username] === false) {
    faveUsers[tags.username] = true;
    shoutoutUser(tags.username, channel);
  }

  // !addAlias shoutout alias
  // !addCommand shoutout content
  // !addso username shoutout content

  //   console.log(message);
});
// add !dadjoke command and just get one from https://icanhazdadjoke.com/

// equalsLowerCase(s1, s2){ return s1.toLowerCase() === s2.toLowerCase()}. Then just call it in the ifs.
//Instead of writing if( foo.toLower === bar.toLower ) over and over, the idea is to have a function that does the toLower for you, so you can just do if( compare( foo , bar ) ).
function compareString(string1, string2) {
  return string1.toLowerCase() === string2.toLowerCase();
}
function shoutoutUser(username, channel) {
  const keysArr = Object.keys(data);
  let noCustom = true;
  if (aliasData[`!${username}`]) {
      noCustom = false;
      const shoutoutsArr = data[aliasData[`!${username}`]]["shoutouts"];
      let randomIndex = Math.floor(shoutoutsArr.length * Math.random());

      client.say(channel, shoutoutsArr[randomIndex]);
  }else if (data[`!${username}`] !== undefined) {
    const shoutoutsArr = data[`!${username}`]["shoutouts"];
    let randomIndex = Math.floor(shoutoutsArr.length * Math.random());
    client.say(channel, shoutoutsArr[randomIndex]);
    noCustom = false;
  } else {
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
        `${username} is an amazing streamer! Go follow them at https://www.twitch.tv/${username}
          `
      );
    }
    // if (aliasData[`!${username}`]) {
    //   if (data[aliasData[`!${username}`]]) {
    //     const shoutoutsArr = data[aliasData[`!${username}`]]["shoutouts"];
    //     let randomIndex = Math.floor(shoutoutsArr.length * Math.random());
  
    //     client.say(channel, shoutoutsArr[randomIndex]);
    //   }
    // }
  }
}
function isModerator(tags) {
  return tags?.badges?.["moderator"] || tags?.badges?.["broadcaster"];
}
function add_dialogue(messageArr) {
  let dialogueArrLength = Object.keys(dialogueData).length;
  const newObj = { dialogue: messageArr.slice(1).join(" ") };
  console.log("this is the  new obj " + messageArr.slice(1));
  dialogueData[`dialogue${dialogueArrLength + 1}`] = newObj;

  fs.writeFileSync(
    "dialogueSuggestions.json",
    JSON.stringify(dialogueData, null, 1)
  );
}
// consider changing to switch statement to reduce all of the chained if statements
//  or refactor to where commands are a key in a hashmap and the functions are the values
