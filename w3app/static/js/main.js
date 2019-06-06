const topicName = document.querySelector("#topic-name")
const topicDesc = document.querySelector("#topic-desc")

/*
Topic List GET
Once topic list is pulled, when user selects a topic,
store the title/desc/count so that it doesn't
need to be pulled (again).
*/
axios.get('http://127.0.0.1:8000/topic_list/')
  .then(function (response) {
    topicListArr = response.data.topics;
  })
  .catch(function (error) {
    console.log(error.response.data);
  });

/*
Topic Details GET
*/
axios.get('http://127.0.0.1:8000/topic_detail/1')
  .then(function (response) {
    topicName.innerHTML = response.data.topic_title;
    topicDesc.innerHTML = response.data.topic_desc;
  })
  .catch(function (error) {
    topicName.innerHTML = error.response.data;
  });

//Message List GET
//Topic #, Start Msg #, End Msg #
//messages/<int:pk>/<int:strt>/<int:end>/
axios.get('http://127.0.0.1:8000/messages/1/5/20')
  .then(function (response) {
    messages = response.data;
  })
  .catch(function (error) {
    console.log(error.response.data);
  });


/*
When user selects a message, hold onto date/title/author/pk
*/
//Message Details GET
//msg_detail/<int:pk>/
axios.get('http://127.0.0.1:8000/msg_detail/1/')
  .then(function (response) {
    msg_detail = response.data;
  })
  .catch(function (error) {
    console.log(error.response.data);
  });

//New Message
// Send a POST request
/*
const msgTitle = document.querySelector("")
const msgBody = document.querySelector("")
const msgPubBtn = document.querySelector("")
*/
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function createMessage() {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/messages/new',
      data: {
        topic_id: '1',
        msg_title: 'TEST AJAX MSG', //msg_title,
        msg_poster: 'phaelinx', //msg_poster,
        msg_body: 'This is a test msg from Axios', //msg_body,
        parent_id: '' //parent_id
      }
    });
}
