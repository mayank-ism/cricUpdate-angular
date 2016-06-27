var cricUpdate = angular.module('cricUpdate', ['ngSanitize']);
var localhost = "http://127.0.0.1:8080/";
var news = "news/";
var match = 'match/';
var commentary = 'commentary/';

cricUpdate.controller('newsController', function ($scope,$http,$interval,$rootScope) {
  $scope.readyData = false;
  $scope.displayCommentary = false;
  
  $scope.getNews = function() {
    $scope.displayCommentary = false;
    renderNews();
    $interval(renderNews,1000*60*60);
  }
  
  function renderNews() {
    $scope.readyData = false;
    $http.get(localhost + news)
      .then(function successCallback(response) {
        $scope.newsList = response.data.data;
        $scope.readyData = true;
      }, function errorCallback(err) {
        console.log("Error: " + err);
      });
  }

  renderNews();
  $interval(renderNews,1000*60*60);
  
  $rootScope.$on("HandleRenderCommentary", function(event, id) {
    $scope.readyData = false;
    $http.get(localhost+match+commentary+id)
    .then(function successCallback(response) {
      $scope.commentaryHTML = response.data.commentary;
      $scope.readyData = true;
      $scope.displayCommentary = true;
    }, function errorCallback(err) {
      console.log("Error in getting commentary.\nError: " + err);
    });
  });
});

cricUpdate.controller('scoresController', function($scope,$http,$interval,$attrs,$rootScope) {
  var listFullMembersICC = ["Australia", "Bangladesh", "England", "India", "New Zealand",
                            "Pakistan", "South Africa", "Sri Lanka", "West Indies", "Zimbabwe"];

  $scope.scoreListOngoingMatchesDom = [];
  $scope.scoreListOngoingMatchesIntl = [];
  $scope.scoreListUpcomingMatchesDom = [];
  $scope.scoreListUpcomingMatchesIntl = [];
  $scope.readyData = false;

  $scope.getCommentary = function() {
    var id = this.detail.unique_id;
    $scope.$emit("HandleRenderCommentary", id);
  }

  function renderScore() {
    $scope.readyData = false;
    $http.get(localhost+match)
      .then(function successCallback(response) {
        $scope.scoreListOngoingMatchesDom = [];
        $scope.scoreListOngoingMatchesIntl = [];
        $scope.scoreListUpcomingMatchesDom = [];
        $scope.scoreListUpcomingMatchesIntl = [];
        var responseList = response.data.data;
        responseList.forEach(function(data) {
          var scoreElement = {};
          scoreElement['unique_id'] = data.unique_id;
          scoreElement['title'] = data.title;
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

                $scope.readyData = true;
                if(isIntlGame) {
                  $scope.scoreListOngoingMatchesIntl.push(scoreElement);
                } else {
                  $scope.scoreListOngoingMatchesDom.push(scoreElement);
                }
              } else {
                if(isIntlGame) {
                  $scope.scoreListUpcomingMatchesIntl.push(scoreElement);
                } else {
                  $scope.scoreListUpcomingMatchesDom.push(scoreElement);
                }
              }
            }, function errorCallback(err) {
              console.log("Error: " + err);
            });
        });
      }, function errorCallback(err) {
        console.log("Error: " + err);
      });
  }
  renderScore();
  $interval(renderScore, 1000*60*1);
});

function toString(val) {
 if (val === undefined || val === null) {
   return "";
 }
 return val;
}

