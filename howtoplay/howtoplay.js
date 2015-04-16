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
    
    $scope.loadGame('splendor');

    $scope.generateRandomID = function(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ ){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        
        return text;
    }
    
    $scope.randomID = $scope.generateRandomID()
});
//angular.module('howToPlayApp', ['ngRoute', 'howtoroutes', 'MainCtrl', 'SplendorCtrl', 'ui.bootstrap', 'ngCookies', 'ngStorage', 'mgcrea.ngStrap', 'ngJoyRide','smart-table', 'ngSanitize']);