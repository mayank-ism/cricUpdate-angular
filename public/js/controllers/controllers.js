/*global angular*/
var cricUpdateControllers = angular.module('cricUpdateControllers', []);

cricUpdateControllers.controller('newsController', function ($scope, $timeout, $rootScope, $interval, CricketNewsService, CricketCommentaryService) {
  $scope.readyData = false;
  $scope.displayCommentary = false;

  function renderNews() {
    $scope.readyData = false;
    $scope.displayCommentary = false;
    var newsPromise = CricketNewsService.getNewsList(),
      newsTimeout = $timeout(function () {
        newsPromise.then(function () {
          var newsData = CricketNewsService.newsData();
          $scope.newsList = newsData.newsList;
          $scope.readyData = true;
          $timeout.cancel(newsTimeout);
        });
      }, 1000 * 5);
  }

  renderNews();
  var intervalPromise = $interval(renderNews, 1000 * 60 * 30);

  $scope.getNews = function () {
    renderNews();
    $interval.cancel(intervalPromise);
    intervalPromise = $interval(renderNews, 1000 * 60 * 30);
  };

  $rootScope.$on("HandleRenderCommentary", function (event, id) {
    $interval.cancel(intervalPromise);
    $scope.readyData = false;
    var commentaryPromise = CricketCommentaryService.getCommentary(id),
      commentaryTimeout = $timeout(function () {
        commentaryPromise.then(function () {
          $scope.commentaryHTML = CricketCommentaryService.commentaryData();
          $scope.readyData = true;
          $scope.displayCommentary = true;
          $timeout.cancel(commentaryTimeout);
        });
      }, 1000 * 5);
  });

  $scope.$on('$destroy', function () {
    $interval.cancel(intervalPromise);
  });
});

cricUpdateControllers.controller('scoresController', function ($scope, $interval, $timeout, $attrs, $rootScope, CricketScoresService) {
  $scope.readyData = false;

  $scope.getCommentary = function () {
    var id = this.detail.unique_id;
    $scope.$emit("HandleRenderCommentary", id);
  };

  function renderScore() {
    $scope.readyData = false;
    var scorePromise = CricketScoresService.getScores(),
      scoreTimeout = $timeout(function () {
        scorePromise.then(function () {
          var scoreData = CricketScoresService.scoreData();
          $scope.scoreListOngoingMatchesDom = scoreData.scoreListOngoingMatchesDom;
          $scope.scoreListOngoingMatchesIntl = scoreData.scoreListOngoingMatchesIntl;
          $scope.scoreListUpcomingMatchesDom = scoreData.scoreListUpcomingMatchesDom;
          $scope.scoreListUpcomingMatchesIntl = scoreData.scoreListUpcomingMatchesIntl;
          $scope.readyData = true;
          $timeout.cancel(scoreTimeout);
        });
      }, 1000 * 5);
  }

  renderScore();
  var intervalPromise = $interval(renderScore, 1000 * 60 * 5);

  $scope.$on('$destroy', function () {
    $interval.cancel(intervalPromise);
  });
});
