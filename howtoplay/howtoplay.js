var howToPlayApp = angular.module('howToPlayApp', ['ngRoute', 'SplendorCtrl'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}).config(function($routeProvider, $locationProvider) {
    $routeProvider

        // route for the home page
        .when('/howtoplay/splendor', {
            templateUrl : '/howtoplay/splendor.html',
            controller  : 'SplendorCtrl'
        })
        .otherwise({
            
        });

    $locationProvider.html5Mode(true);
}).run( function($rootScope, $location) {
    $rootScope.$watch(function() {
            return $location.path();
        },
        function(a){
            console.log('url has changed: ' + a);
            // show loading div, etc...
        });
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