let topicListArr = ''
const topicName = document.querySelector('.topic-list > li > .topic-name')
//const topicDesc = document.querySelector('.topic-div > .topic-desc')

axios.get('http://127.0.0.1:8000/topic_list/')
  .then(function (response) {
    topicListArr = response.data.topic_list;
    topicName.innerHTML = response.data.topic_list[0].topic_title
    //topicDesc.innerHTML = response.data.topic_list[0].topic_desc
  })
  .catch(function (error) {
    console.log(error.response.data);
  });
