var localhost = "http://127.0.0.1:8080/";
var news = "news/";
var match = 'match/';
var commentary = 'commentary/';

var cricUpdateServices = angular.module('cricUpdateServices', []); 

cricUpdateServices.factory('CricketNewsService', function($http,$q) {
  var deferred = $q.defer();
  var newsList = [];
  var getNewsList = function() {
    $http.get(localhost + news)
      .then(function successCallback(response) {
        newsList = response.data.data;
        deferred.resolve();
      }, function errorCallback(err) {
        console.log("Error: " + err);
        deferred.reject();
      });
    
    return deferred.promise;
  }
  
  return {
    getNewsList: getNewsList,
    newsData: function() {
      return newsList;
    }
  };
});

cricUpdateServices.factory('CricketScoresService', function($http,$q) {
  var deferred = $q.defer();
  var listFullMembersICC = ["Australia", "Bangladesh", "England", "India", "New Zealand",
                            "Pakistan", "South Africa", "Sri Lanka", "West Indies", "Zimbabwe"];
  var scoreListOngoingMatchesDom = [];
  var scoreListOngoingMatchesIntl = [];
  var scoreListUpcomingMatchesDom = [];
  var scoreListUpcomingMatchesIntl = [];

  function toString(val) {
   if (val === undefined || val === null) {
     return "";
   }
   return val;
  }
  
  var getScores = function() {
    $http.get(localhost + match)
      .then(function successCallback(response) {
        var responseList = response.data.data;
        responseList.forEach(function(data) {
          var scoreElement = {};
          scoreElement['unique_id'] = data.unique_id;
          scoreElement['title'] = data.title;
          scoreElement['title'] = scoreElement['title'].replace('&amp;', '&');
          $http.get(localhost+match+data.unique_id)
            .then(function successCallback(matchDetail) {
              matchDetail = matchDetail.data;
              scoreElement['team1'] = matchDetail['team-1'];
              scoreElement['team2'] = matchDetail['team-2'];
              var isIntlGame = (listFullMembersICC.indexOf(scoreElement.team1) != -1) || 
                    (listFullMembersICC.indexOf(scoreElement.team2) != -1);
              var significantEvent = matchDetail['innings-requirement'];
              scoreElement['significantEvent'] = significantEvent;
              if (significantEvent.search("Match scheduled to begin") == -1) {
                var score = matchDetail.score;
                scoreDetail = score.slice(score.indexOf("(")+1,score.indexOf(")")).split(", ");

                scoreElement['overs'] = toString(scoreDetail[0]);
                scoreElement['batsman1'] = toString(scoreDetail[1]);
                scoreElement['batsman2'] = toString(scoreDetail[2]);
                scoreElement['bowler'] = toString(scoreDetail[3]);

                if(isIntlGame) {
                  scoreListOngoingMatchesIntl.push(scoreElement);
                } else {
                  scoreListOngoingMatchesDom.push(scoreElement);
                }
              } else {
                if(isIntlGame) {
                  scoreListUpcomingMatchesIntl.push(scoreElement);
                } else {
                  scoreListUpcomingMatchesDom.push(scoreElement);
                }
              }
              
              deferred.resolve();
            }, function errorCallback(err) {
              console.log("Error: " + err);
              deferred.reject();
            });
        });
      }, function errorCallback(err) {
        console.log("Error: " + err);
        deferred.reject();
      });
    
    return deferred.promise;
  }
  
  var scoreData = function() {
    return {
      "scoreListOngoingMatchesDom" : scoreListOngoingMatchesDom,
      "scoreListOngoingMatchesIntl" : scoreListOngoingMatchesIntl,
      "scoreListUpcomingMatchesDom" : scoreListUpcomingMatchesDom,
      "scoreListUpcomingMatchesIntl" : scoreListUpcomingMatchesIntl
    };
  }
  
  return {
    scoreData: scoreData,
    getScores: getScores
  };
});

cricUpdateServices.factory('CricketCommentaryService', function($http,$q) {
  var deferred = $q.defer();
  var commentaryHTML = "";
  
  var getCommentary = function(id) {
    var url = localhost+match+commentary+id;
    $http.get(localhost+match+commentary+id)
      .then(function successCallback(response) {
        commentaryHTML = response.data.commentary;
        deferred.resolve();
      }, function errorCallback(err) {
        console.log("Error: " + err);
        deferred.reject();
      });
    
    return deferred.promise;
  }
  
  var commentaryData = function() {
    return commentaryHTML;
  }
  
  return {
    getCommentary : getCommentary,
    commentaryData: commentaryData
  };
});
