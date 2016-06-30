var cricUpdateControllers = angular.module('cricUpdateControllers', []);

cricUpdateControllers.controller('newsController', function ($scope, $interval, $rootScope, CricketNewsService, CricketCommentaryService) {
  $scope.readyData = false;
  $scope.displayCommentary = false;
  
  function renderNews() {
    $scope.readyData = false;
    $scope.displayCommentary = false;
    CricketNewsService.getNewsList()
      .then(function () {
        $scope.newsList = CricketNewsService.newsData();
        $scope.readyData = true;
      });
  }
  
  $scope.getNews = function () {
    renderNews();
    $interval(renderNews, 1000 * 60 * 60);
  };

  renderNews();
  $interval(renderNews, 1000 * 60 * 60);
  
  $rootScope.$on("HandleRenderCommentary", function (event, id) {
    $scope.readyData = false;
    CricketCommentaryService.getCommentary(id)
      .then(function () {
        $scope.commentaryHTML = CricketCommentaryService.commentaryData();
        $scope.readyData = true;
        $scope.displayCommentary = true;
      });
  });
});

cricUpdateControllers.controller('scoresController', function ($scope, $interval, $attrs, $rootScope, CricketScoresService) {
  $scope.readyData = false;

  $scope.getCommentary = function () {
    var id = this.detail.unique_id;
    $scope.$emit("HandleRenderCommentary", id);
  };

  function renderScore() {
    $scope.readyData = false;
    CricketScoresService.getScores()
      .then(function () {
        var scoreData = CricketScoresService.scoreData();
        $scope.scoreListOngoingMatchesDom = scoreData.scoreListOngoingMatchesDom;
        $scope.scoreListOngoingMatchesIntl = scoreData.scoreListOngoingMatchesIntl;
        $scope.scoreListUpcomingMatchesDom = scoreData.scoreListUpcomingMatchesDom;
        $scope.scoreListUpcomingMatchesIntl = scoreData.scoreListUpcomingMatchesIntl;
        $scope.readyData = true;
      });
  }
  
  renderScore();
  $interval(renderScore, 1000 * 60);
});
