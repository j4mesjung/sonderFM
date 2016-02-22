var app = angular.module('sonder', ['ngAnimate', 'ui.bootstrap', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('/home', {
      url: "/",
      controller: 'mainCtrl',
      views: {
        "list": {
          templateUrl: 'templates/list.html'
        },
        "favorites": {
          templateUrl: 'templates/favorites.html'
        }
      }
    })

  $urlRouterProvider.otherwise('/');
});

app.controller('mainCtrl', function ($scope, soundcloud, $sce) {

  $scope.userId = '';
  $scope.username = '';
  $scope.profiles = soundcloud.followings;
  $scope.isLoading = soundcloud.isLoading;
  $scope.errorMsg = soundcloud.errorMsg;
  $scope.favorites = soundcloud.favorites;

  $scope.selectedFollowingUser;
  $scope.selectFollowingUser = function (index) {
    $scope.selectedFollowingUser = index;
  }

  $scope.selectedSong;
  $scope.selectSong = function (index) {
    $scope.selectedSong = index;
  }

  $scope.searchUser = function () {
    $scope.userId = '';
    $scope.errorMsg = '';

    soundcloud.getId($scope.formData.username)
      .then(function (data) {
          $scope.userId = data;

          soundcloud.getFollowing($scope.userId)
            .then(function (data) {
                $scope.profiles = data;
              },
              function (err) {
                $scope.errorMsg = err;
              })
        },
        function (err) {
          $scope.errorMsg = err;
        })
  };

  $scope.userFavorites = function (id) {
    $scope.errorMsg = '';
    $scope.favorites = '';
    console.log(id);

    soundcloud.getUser(id).then(function (data) {
      $scope.username = data;
    }, function (err) {
      $scope.errorMsg = err;
    });

    soundcloud.getFavorites(id).then(function (data) {
      $scope.favorites = data;
      console.log($scope.favorites);
    }, function (err) {
      $scope.errorMsg = err;
    })
  };

  $scope.playTrack = function (url) {
    console.log(url);
    SC.oEmbed(url, {
      auto_play: true,
      maxwidth: 750,
      maxheight: 105
    }, function (data) {
      console.log(data);
      $scope.$apply($scope.player_html = $sce.trustAsHtml(data.html));
    })
  }

});
