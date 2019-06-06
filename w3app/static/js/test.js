



const msgSubject = document.querySelector("#msg-subject")
const msgBody = document.querySelector("#msg-body")
const msgSaveBtn = document.querySelector("#save-btn")

msgSaveBtn.addEventListener('click', (evt) => {
  //console.log(msgSubject.value)
  createMessage('1', msgSubject.value, 'phaelinx', msgBody.value)
})

//New Message
// Send a POST request
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function createMessage(topicId, msgTitle, msgPoster, msgBody) {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/messages/new',
      data: {
        topic_id: topicId,
        msg_title: msgTitle, //msg_title,
        msg_poster: msgPoster, //msg_poster,
        msg_body: msgBody, //msg_body,
        parent_id: '' //parent_id
      }
    });
}
