let username = $('#username').text()
//let callback = () => {}
const promptString = `[[;grey;](][[u;limegreen;]${username}][[;lightslategrey;]@][[;limegreen;]w3.bbs!][[;grey;]): ]`

const mainMenuAscii = `[7h[255D[15C[0;1;33m.d888[32m8b.[6C[33m888[32m888[0;32mb.   [1;33m888[32m888[0;32mb.    [1;33m.d8[32m888b.
[14C[33md88[32mP  Y88b[5C[33m88[32m8  "88[0;32mb  [1;33m88[32m8  "88[0;32mb  [1;33md8[32m8P  Y8[0;32m8b
[19C[1;33m.d[32m88P[5C[33m8[32m88  .8[0;32m8P  [1;33m8[32m88  .8[0;32m8P  [1mY88b.
[33m888  88[32m8  [33m8[32m88[5C[33m8[32m88[0;32m8"[6C[1m8888888[0;32mK.  [1m8888888[0;32mK.   [1m"Y[0;32m888b.
[1;33m88[32m8  [33m8[32m88  88[0;32m8[6C[1m"Y[0;32m8b.[5C[1m88[0;32m8  [1m"Y[0;32m88b [1m88[0;32m8  [1m"Y[0;32m88b[5C"Y88[1;30mb.
[33m8[32m88  88[0;32m8  [1m8[0;32m88 [1;33m88[32m8    [0;32m88[1;30m8[5C[32m8[0;32m88    88[1;30m8 [32m8[0;32m88    88[1;30m8[7C[0;32m"88[1;30m8
[32mY88[0;32mb [1m8[0;32m88 d88[1;30mP [33mY[32m88b  [0;32md8[1;30m8P [33md[32m8[0;32mb 888   d8[1;30m8P [0;32m888   d8[1;30m8P [32mY88[0;32mb  d8[1;30m8P
 [32m"Y[0;32m888888[1;30m8P"   [32m"Y[0;32m888[1;30m8P"  [32mY[0;32m8[1;30mP [0;32m88888[1;30m88P"  [0;32m88888[1;30m88P"   [32m"[0;32mY888[1;30m8P"
[0m[255D`

function printAnsi(text) {
    var str = text.replace(/\r?\n?\x1b\[A\x1b\[[0-9]+C/g, '');
    str = $.terminal.apply_formatters(str);
    var lines = $.terminal.split_equal(str, 80);
    lines.map(line => terminal.echo(line, {flush: false}));
    terminal.flush().resume();
}

const mainMenu = [
  '\n[[;grey;](][[;lawngreen;]G][[;grey;])]ames\n',
  '[[;grey;](][[;lawngreen;]M][[;grey;])]essage Board\n',
  '[[;grey;](][[;lawngreen;]F][[;grey;])]iles\n',
  '[[;grey;](][[;lawngreen;]L][[;grey;])]ogout\n',

]
const msgBoardCmds = [
  '[[[;white;]##]] View Topic Messages',
  '[[[;white;]Q]]uit to Main Menu'
]
const msgCmds = [
  '[[[;white;]&larr;]] Prev. Message',
  '[[[;white;]&rarr;]] Next Message',
  '[[[;white;]N]]ew Message',
  '[[[;white;]R]]eply',
  '[[[;white;]Q]]uit to Messages',
]

function delay(t, v) {
   //found on: https://stackoverflow.com/questions/39538473/using-settimeout-on-promise-chain
   return new Promise(function(resolve) {
       setTimeout(resolve.bind(null, v), t)
   });
}

function displayMenu(menuStringArr, menuTitle) {
  //use header creation stuff here, then add on menu items.
  return printHeader(menuTitle).concat(menuStringArr)
}

function makeBorder() {
  let border = '+'
  for (i=0;i<terminal.cols()-2;i++) {
    border += '-'
  }
  border += '+'
  return border
}

function printHeader(menuTitle) {
  screenWidth = terminal.cols()
  menuWidth = Math.round(screenWidth /2)
  titleWidth = Math.round(menuTitle.length /2)
  menuString = ''
  borderString = makeBorder()
  sideString = '|'
  blanks = ''
  for (i=0;i<screenWidth;i++) {
    blanks += ' '
  }
  menuString = sideString + blanks.slice(1, menuWidth - titleWidth) + menuTitle;
  menuString += blanks.slice(menuString.length, screenWidth-1) + sideString;
  return [borderString, menuString, borderString]
}

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function ajaxLogout() {
  axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/logout/'
  })
}
let topicId = 0
let topicList = []
let numTopics = 0
let msgIdArr = []
let currMsgNum = 0
let currMsgTitle = ""
let msgObj = {
  msgTitle: "",
  msgBody: "",
  parentMsg: 0,
  topicId: 0,
}

function printTopicList(term) {
  term.pause()
  term.clear()
  term.echo(printHeader('Messages'))
  axios.get('http://127.0.0.1:8000/topic_list/').then((res) => {
        res.data.topic_list.forEach((t) => {
          term.echo('\n[[;white;]'+t.pk + '][[;grey;])] [[;lightseagreen;]' + t.topic_title.trim() + ']')
          topicList.push(t)
        })
    }).then(() => {
      numTopics = topicList.length
      term.echo()
      term.resume()
    })
}

function getMsgIds(topicId) {
  msgIdArr = []
  axios.get('http://127.0.0.1:8000/msg_ids/'+topicId+'/').then(function(response) {
      response.data.msg_ids.forEach((i) => {
          msgIdArr.push(i)
      })
  })
  .catch(function (error) {
      terminal.echo('No messages in this topic.')
      console.log(error.response.data);
  });
}


function displayMsg(term, topicId, currMsgId) {
    if (msgIdArr.length > 0) {
        let msgId = msgIdArr[currMsgId]
        //console.log('Current Msg Number: ' + currMsgId)
        let msgHeader = []
        //need to add topic id in url here and in django view.
        //figure out 'flicker' issue at some point..
        term.pause()
        term.clear()
        axios.get('http://127.0.0.1:8000/msg_detail/'+topicId+'/'+msgId+'/').then(function(res){
          msgHeader.push('[[;cyan;]Date][[;grey;]:] [[;darkcyan;]' + res.data.msg_date + ']')
          msgHeader.push('\n[[;cyan;]Title][[;grey;]:] [[;darkcyan;]' + res.data.msg_title + ']')
          msgHeader.push('[[;cyan;]From][[;grey;]:] [[;darkcyan;]' + res.data.msg_author + ']')
          msgHeader.push('\n\n[[;darkcyan;]'+res.data.msg_body+']\n')
          msgHeader.push('\n')
          currMsgTitle = res.data.msg_title
          //term.pause()
          //term.clear()
          term.echo(msgHeader)
          //term.resume()
        })
        .finally(function (msgHeader) {
          term.resume()
        })
        .catch(function (error) {
            terminal.echo('Error retrieving message in this topic.')
            console.log(error.response.data);
        });
  }else{
    //console.log(msgIdArr)
    term.clear()
    term.echo('No messages in this topic.\n')
  }
}
//Displays instructions, accepts message, POSTs msgObj data to api, refreshes msg id arr.
function msgBodyInput(term) {
  term.clear()
  //Insert header..
  term.echo("[[;cyan;]Title][[;grey;]:] " + msgObj.msgTitle)
  term.echo("[[;slategrey;]" + makeBorder() + "]")
  term.echo('Enter "[[;cyan;]^Z]" to end message.\n')
  //read Message body
  term.push(function(cmd, term){
    if (cmd.slice(cmd.length-2,cmd.length).toUpperCase() == "^Z") {
      //POST new message to api, then pop back to current message.
      postMsg()
      getMsgIds(topicId)
      delay(100).then(function () {
        term.clear()
        displayMsg(term, topicId, currMsgNum)
      })
      terminal.pop()
    }else{
      msgObj.msgBody += cmd + '\n'
      this.echo(cmd)
    }
  }, { name: 'msgBody', prompt: '' })
}

function newMsgInput(term) {
  term.clear()
  //read Message subject if new message. Otherwise, just display RE: <title>
  term.push(function(cmd, term){
    msgObj.msgTitle = cmd
    //this.echo("[[;cyan;]Title][[;grey;]:] " + cmd)
    term.pop()
    msgBodyInput(term)
  }, { name: 'msgTitle', prompt: '[[;cyan;]Title][[;grey;]:] ' })
}

function postMsg() {
  axios({
    method: 'post',
    url: 'http://127.0.0.1:8000/messages/new',
    data: {
      topic_id: msgObj.topicId,
      msg_title: msgObj.msgTitle, //msg_title,
      msg_poster: username, //msg_poster,
      msg_body: msgObj.msgBody, //msg_body,
      parent_id: msgObj.parentMsg //parent_id
    }
  })
  .catch(function (error) {
      terminal.echo('Error occured while posting message.')
      console.log(error.response.data);
  });
}

//Message viewing, new, reply, etc.
function msgDetailsScreen(term, topicId) { //cmd
  const  msgDetailsOptions = {
    name: 'msg_details',
    prompt: msgCmds.join(' ')+'\n'+promptString,
    keydown: function(evt, term) {
      //Previous Message
      if (evt.keyCode == '37') {
        if (currMsgNum > 0) {
          currMsgNum--;
          displayMsg(term, topicId, currMsgNum)
        }
      //Next Message
      }else if (evt.keyCode ==  '39') {
        if (currMsgNum < msgIdArr.length-1) {
          currMsgNum++;
          displayMsg(term, topicId, currMsgNum)
        }
      }
    }
  }

  displayMsg(term, topicId, currMsgNum)
  terminal.push(function(cmd, term){
    //New message
    if (cmd.toUpperCase() === 'N') {
      msgObj.msgTitle = ""
      msgObj.msgBody = ""
      msgObj.topicId = topicId
      msgObj.parentMsg = 0
      msgObj.msgType = 'new'
      newMsgInput(term)
    //Reply to message
    }else if (cmd.toUpperCase() === 'R') {
      msgObj.msgTitle = 'RE: ' + currMsgTitle
      msgObj.msgBody = ""
      msgObj.topicId = topicId
      msgObj.parentMsg = msgIdArr[currMsgNum]
      msgObj.msgType = 'reply'
      msgBodyInput(term)
    //Quit to main menu
    }else if (cmd.toUpperCase() === 'Q') {
      term.pause()
      term.clear()
      printTopicList(term)
      term.pop()
      term.resume()
    }
  }, msgDetailsOptions)
}

//$(function() {
   var terminal = $('#terminal').terminal(function(cmd, term) {
       if (cmd.toUpperCase() == 'M') {
          //get the list of topics returned as objs, set count variable, display to term.
          printTopicList(term)
          term.push(function(cmd, term) {
              if (!isNaN(parseInt(cmd)) && parseInt(cmd) <= numTopics && parseInt(cmd) > 0) {
                topicId = cmd
                //console.log(topicId)
                msgIdArr = []
                getMsgIds(topicId)
                delay(100).then(function () {
                  //console.log("Message Count: " + msgIdArr.length)
                  msgDetailsScreen(term, topicId)
                })
              } else if (cmd.toUpperCase() == 'Q') {
                term.pop()
              }
          }, {
              prompt: '\n' + msgBoardCmds.join(' ') + '\n' + promptString,
              name: 'messages',
              onExit: function(term) {
                term.clear()
                term.echo(mainMenuAscii)
                terminal.echo(displayMenu(mainMenu, 'Main Menu'))
              },
          });
       }else if (cmd.toUpperCase() == 'L') {
         ajaxLogout()
         term.purge()
         term.logout()
         window.location = "/"
       }
     },
     {
       name: 'main',
       greetings: 'w[[;white;grey]3][[;darkgrey;].]BBS v0.1a',
       prompt: promptString,
       width: '100%',
       height: '100%',
       history: false,
       checkArity: false,
       clear: true,
       login: false,
       echoCommand: false,
       //onInit: terminal.echo(displayMenu(mainMenu, 'Main Menu')),
       onCommandNotFound: function(command, terminal) {},
   });
   terminal.echo(mainMenuAscii)
   terminal.echo(displayMenu(mainMenu, 'Main Menu'))
//})
