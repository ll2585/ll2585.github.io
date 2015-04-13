var howToPlayApp = angular.module('howToPlayApp', ['SplendorCtrl', 'ngJoyRide'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

howToPlayApp.controller('MainCtrl', function($scope){
    $scope.message = "HI!"
    $scope.selectedGame = '';
    $scope.selectedGameURL = null;
    
    $scope.loadGame = function(name){
        $scope.selectedGame = name;
        $scope.selectedGameURL = "/howtoplay/" + $scope.selectedGame + ".html";
    }
});
//angular.module('howToPlayApp', ['ngRoute', 'howtoroutes', 'MainCtrl', 'SplendorCtrl', 'ui.bootstrap', 'ngCookies', 'ngStorage', 'mgcrea.ngStrap', 'ngJoyRide','smart-table', 'ngSanitize']);