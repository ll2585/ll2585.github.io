var myGamesApp = angular.module('myGamesApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('~~');
    $interpolateProvider.endSymbol('%$');
});

myGamesApp.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
    var gamePath   = "/mygames/games.csv";
    var games = $http.get(gamePath).then(function(response){
        return csvJSON(response.data);
    });
    var playPath   = "/mygames/games.csv";
    var plays = $http.get(playPath).then(function(response){
        return csvJSON(response.data);
    });
    
    games.then(function(data){
        console.log(data);
        $scope.games = data;
    });
    plays.then(function(data){
        $scope.plays = data;
    });
}]);
//var csv is the CSV file with headers
function csvJSON(csv){
    //http://techslides.com/convert-csv-to-json-in-javascript

    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].toString().trim().split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){

            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    

    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
}
