
var app = getApp();

function getNewsList(){
  let list=[];
  for(var i=0;i<news.length;i++)
  {
    let obj={};
    obj.id=news[i].id;
    obj.content=news[i].content;
    obj.edition=news[i].edition;
    obj.title=news[i].title;
    list.push(obj);
  }
  return list;       //返回新闻列表
}

//获取新闻内容
function getNewsDetail(newsID){
  let msg={
    code:'404',
    news:{}
  };

  var news = app.globalData.news;

  for(var i=0;i<news.length;i++)
  {
    if(newsID==news[i].id){  //匹配新闻id
     msg.code='200';         //成功
     msg.news=news[i];       //更新当前新闻内容
     break;
    }
  } 
  return msg;                //返回查找结果
}

function initialnews(newsList){
  news=news.concat(newsList);
  console.log(news);
}
//获取新闻评论内容
function  getcommentDetail(commentID){
  let msg={
    code:'404',
    comments:[]
  };
  for(var i=0;i<news.length;i++)
  {
    if(commentID==news[i].id){  //匹配新闻id
     msg.code='200';         //成功
     //msg.comments=news[i].comments;       //更新当前评论内容
     break;
    }
  } 
  return msg;                //返回查找结果
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports={
  getNewsList:getNewsList,
  getNewsDetail:getNewsDetail,
  getcommentDetail:getcommentDetail,
  formatTime:formatTime
}

