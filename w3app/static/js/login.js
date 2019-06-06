//let callback = () => {}

const logoAscii = `[7h[255D[15C[0;1;33m.d888[32m8b.[6C[33m888[32m888[0;32mb.   [1;33m888[32m888[0;32mb.    [1;33m.d8[32m888b.
[14C[33md88[32mP  Y88b[5C[33m88[32m8  "88[0;32mb  [1;33m88[32m8  "88[0;32mb  [1;33md8[32m8P  Y8[0;32m8b
[19C[1;33m.d[32m88P[5C[33m8[32m88  .8[0;32m8P  [1;33m8[32m88  .8[0;32m8P  [1mY88b.
[33m888  88[32m8  [33m8[32m88[5C[33m8[32m88[0;32m8"[6C[1m8888888[0;32mK.  [1m8888888[0;32mK.   [1m"Y[0;32m888b.
[1;33m88[32m8  [33m8[32m88  88[0;32m8[6C[1m"Y[0;32m8b.[5C[1m88[0;32m8  [1m"Y[0;32m88b [1m88[0;32m8  [1m"Y[0;32m88b[5C"Y88[1;30mb.
[33m8[32m88  88[0;32m8  [1m8[0;32m88 [1;33m88[32m8    [0;32m88[1;30m8[5C[32m8[0;32m88    88[1;30m8 [32m8[0;32m88    88[1;30m8[7C[0;32m"88[1;30m8
[32mY88[0;32mb [1m8[0;32m88 d88[1;30mP [33mY[32m88b  [0;32md8[1;30m8P [33md[32m8[0;32mb 888   d8[1;30m8P [0;32m888   d8[1;30m8P [32mY88[0;32mb  d8[1;30m8P
 [32m"Y[0;32m888888[1;30m8P"   [32m"Y[0;32m888[1;30m8P"  [32mY[0;32m8[1;30mP [0;32m88888[1;30m88P"  [0;32m88888[1;30m88P"   [32m"[0;32mY888[1;30m8P"
[0m[255D`

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function checkLogin(userName, passWord) {
  return axios({
    method: 'post',
    url: 'http://127.0.0.1:8000/login/',
    data: {
          user_name: userName,
          password: passWord,
    }
  })
}

$(function() {
   var terminal = $('#terminal').terminal({},
   {
       name: 'login_term',
       greetings: 'w[[;white;grey]3][[;darkgrey;].]BBS v0.1a\n' + logoAscii,
       width: '100%',
       height: '100%',
       history: false,
       checkArity: false,
       clear: true,
       login: false,
       echoCommand: false,
       onCommandNotFound: function(command, terminal) {},
       keydown: function(event, terminal) {},
   });

   terminal.login(function(user, password, callback) {
     checkLogin(user, password).then(function(result) {
       if (result.data == 'Success') {
         //callback('TOKEN')
         window.location = '/bbs/';
       }else{
         terminal.echo("Bad password")
       }
     })
   })
})
