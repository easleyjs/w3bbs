const msgDate = document.querySelector(".msg-date-data")
const msgUser = document.querySelector(".msg-user-data")
const msgSubject = document.querySelector(".msg-subject-data")
const msgBody = document.querySelector(".msg-body-data")
const msgReplyDate = document.querySelector("#reply-div > .msg-date-data")
const msgReplyUser = document.querySelector("#reply-div > .msg-user-data")
const msgReplySubject = document.querySelector("#reply-div > .msg-subject-data")
const msgReplyBody = document.querySelector("#reply-div > .msg-body-data")
const msgId = 1

//function getMessage(msgId) {
  axios.get('http://127.0.0.1:8000/msg_detail/'+msgId+'/')
    .then(function (response) {
      console.log(response.data)
      msgDate.innerHTML = response.data.msg_date;
      msgUser.innerHTML = response.data.msg_author;
      msgSubject.innerHTML = response.data.msg_title;
      msgBody.innerHTML = response.data.msg_body;
      msgReplyDate.innerHTML = response.data.replies[0].msg_date;
      msgReplyUser.innerHTML = response.data.replies[0].msg_author;
      msgReplySubject.innerHTML = response.data.replies[0].msg_title;
      msgReplyBody.innerHTML = response.data.replies[0].msg_body;
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
//}
