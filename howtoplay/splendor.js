angular.module('SplendorCtrl', []).controller('SplendorCtrl', ['$scope', function($scope) {
    
    $scope.game = "SPLENDOR";
    
    //welcome to splendor: this is a game about building the greatest gem factory where the winner will be the person with the most number of points.
    //this is the game layout -  as you can see, there are three levels of possible gem buildings to build, each with differing costs
    //normally in a real game you will start off with 0 gems, but for this tutorial, we will give you some gems and some cards already.
    //because you own this building, you have 3 points already.
    //this building also produces one red gem for you.
    //on your turn you can buy buildings if you can afford them. click this building to buy it. 
    //the cost of this building was XYZ gems. because you produce one red gem already, the red cost is reduced by 1.
    //for the other gems, you must pay the cost
    //your turn is over so end your turn
    //on alice's turn, she took 3 gems of different colors. this is another action you can do.
    //on bob's turn, bob took 2 gems of different colors. this is another action you can do, but only if there are at least 4 gems of that color available.
    //this building provides a good number of points, but you cannot afford it yet. click it to reserve it. this is the final action you can do. 
    //when you reserve a card, only you can build it, but only on a future turn. you can only reserve 3 cards max.
    //you also receive a gold gem, which is a wildcard gem color
    //end your turn
    //alice built this building
    //bob built this building
    //click the red pile to take two red gems
    //end your turn
    //alice took 3 gems
    //bob took 3 gems
    //now you can build this building! click it to build it.
    //notice how, because you have two red buildings, the red gem cost is reduced by 2. also you used your gold gem because you do not have a black gem. now you have 11 points! buildings are replaced when built.
    //end your turn
    //alice took 2 gems
    //bob took 2 gems
    //click this card to reserve it
    //end your turn
    //alice took 3 gems
    //bob built a building
    //take these three gems
    //alice built a building
    //bob built a building
    //build this building! now you have 15 points. because you started the game, bob and alice have one final turn.
    //alice builds this building. because she has 3 green and 3 blue and 3 red buildings, she gets this noble card which gives her more points! noble cards are not replaced when taken.
    //bob builds this building. he gets these two nobles, and therefore has 18 points and wins! the end. replay?
    
    
}]).directive('card', function($timeout, $window) {
    return {
        restrict: 'E',
        scope:{
            points: '=',
            color: '@'
        },
        link: function(scope,element,attrs){
            scope.costDict = JSON.parse(attrs.cost);
        },
        templateUrl: '/howtoplay/card.html'

    };

});