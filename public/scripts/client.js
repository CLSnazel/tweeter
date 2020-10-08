/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1602112211318
  }
];

$(document).ready(function(){
  const renderTweetResponse = function(){
    //init response <ul> container
    const $resList = $(`<ul>`);
  
    //init <li> sub-containers
    const $reportItem = $(`<li>`)
    $reportItem.attr('width','100');
    const $shareItem = $(`<li>`);
    const $likeItem = $(`<li>`);
  
    //adding <svg> to <li> with jQuery svg library: http://keith-wood.name/svg.html
    $reportItem.svg({loadURL:'/images/noun_Flag_2207078.svg'});
    $shareItem.svg({loadURL:'/images/noun_repost_2908225.svg'});
    $likeItem.svg({loadURL:"/images/noun_Heart_689240.svg#icon"});
  
    //nesting <li> in <ul>
    $resList.append($reportItem).append($shareItem).append($likeItem);
    
  
    return $resList;
  };
  
  //given a time in epoch format, return a human-readable string of (roughly) how much hours/days/months/years a tweet was posted
  const timePastSince = function(timeVal) {
    //get current time
    let currTime = new Date();
  
    let elapsedTime = (currTime.valueOf()) - timeVal;
  
    //init returned string with default value
    let elapsedString = "a few seconds ago";
  
    //set of time units to support, and their value in epoch time
    let timeUnits = {
      year:31556926,
      month: 2629743,
      day: 86400,
      hour: 3600,
      minute: 60,
    }
  
    //loop through each time unit to find best match 
    for (let time in timeUnits){
      //round down value
      let timeToUnit = Math.floor((elapsedTime / timeUnits[time]) / 1000);
  
      if(timeToUnit >= 1) {
        //set up string to include time unit
        elapsedString = `${timeToUnit} ${time}${timeToUnit > 1 ? 's' : ''} ago`;
        break;
      }
    }
  
    return elapsedString;
  }
  
  
  //creates new <article> element with tweet data
  const createTweetElement = function(tweet) {
    //initialize all nodes
    const $tweetArticle = $(`<article>`).addClass("tweet");
  
    //init header and child nodes
    const $tweetHeader = $(`<header>`);
    const $tweetImg = $(`<img>`).attr('src', tweet.user.avatars);
    const $tweetName = $(`<p>`).text(tweet.user.name);
    const $tweetHandle = $(`<p>`).addClass('handle').text(tweet.user.handle);
  
    //init tweet content 
    const $tweetContent = $(`<p>`).text(tweet.content.text);
  
    //init tweet footer
    const $tweetFooter = $(`<footer>`);
    const $tweetTime = $(`<p>`).text(timePastSince(tweet.created_at));
    const $resList = renderTweetResponse();
    
    //nesting nodes into header
    $tweetHeader.append($tweetImg).append($tweetName).append($tweetHandle);
  
    //nesting nodes into footer
    $tweetFooter.append($tweetTime).append($resList);
  
    //nesting header, foot and content into article
    $tweetArticle.append($tweetHeader).append($tweetContent).append($tweetFooter);
  
    return $tweetArticle;
  
  };
  
  const renderTweets = function(tweets) {
    let $tweetSection = $('#tweet-container');
  
    for (let tweet of tweets) {
      // console.log(tweet);
      let $tweetElem = createTweetElement(tweet);
      // console.log($tweetElem);
      $tweetSection.append($tweetElem);
    }
  };

  const loadTweets = function() {

  };
  
  renderTweets(data);
  
  const $tweetForm = $($('section.new-tweet form')[0]);
  
  console.log($tweetForm);
  $tweetForm.on('submit', function(event) {
    event.preventDefault();
    // console.log(event, this);
    // console.log($(this).serialize());
    let newTweet = $(this).serialize();
    $.post('/tweets', newTweet)
    .then((response) => {
      console.log(response);
    })
  });

});