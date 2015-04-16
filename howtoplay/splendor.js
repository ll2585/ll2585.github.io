angular.module('SplendorCtrl', []).controller('SplendorCtrl', ['$scope', 'CardFactory', 'PlayerFactory', function($scope, CardFactory, PlayerFactory) {
    
    $scope.game = "SPLENDOR";
    
    $scope.colors = ["black","white","red","blue","green"];
    
    $scope.players = {
        'bob': PlayerFactory.newPlayer('bob'),
        'me': PlayerFactory.newPlayer('me'),
        'alice': PlayerFactory.newPlayer('alice')
    };
    $scope.decks = {
        'deck 1': [],
        'deck 2': [],
        'deck 3': [CardFactory.newCard("white", 4, {"black": 7}),
            CardFactory.newCard("white", 5, {"black": 7, "white": 3}),
            CardFactory.newCard("white", 4, {"black": 6, "white": 3, "red": 3}),
            CardFactory.newCard("white", 3, {"black": 3, "red": 5, "blue": 3, "green": 3}),
            CardFactory.newCard("blue", 4, {"white": 7}),
            CardFactory.newCard("blue", 5, {"white": 7, "blue": 3}),
            CardFactory.newCard("blue", 4, {"black": 3, "white": 6, "blue": 3}),
            CardFactory.newCard("blue", 3, {"black": 5, "white": 3, "red": 3, "green": 3}),
            CardFactory.newCard("green", 4, {"blue": 7}),
            CardFactory.newCard("green", 5, {"blue": 7, "green": 3}),
            CardFactory.newCard("green", 4, {"white": 3, "blue": 6, "green": 3}),
            CardFactory.newCard("green", 3, {"black": 3, "white": 5, "red": 3, "blue": 3}),
            CardFactory.newCard("red", 4, {"green": 7}),
            CardFactory.newCard("red", 5, {"red": 3, "green": 7}),
            CardFactory.newCard("red", 4, {"red": 3, "blue": 3, "green": 6}),
            CardFactory.newCard("red", 3, {"black": 3, "white": 3, "blue": 5, "green": 3}),
            CardFactory.newCard("black", 4, {"red": 7}),
            CardFactory.newCard("black", 5, {"black": 3, "red": 7}),
            CardFactory.newCard("black", 4, {"black": 3, "red": 6, "green": 3}),
            CardFactory.newCard("black", 3, {"white": 3, "red": 3, "blue": 3, "green": 5})]
    };
    $scope.board = {
        'deck 1': [],
        'deck 2': [],
        'deck 3': [$scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop()]
    };

    
    $scope.buyCard = function(player, deck, number){ //TODO: make this a service i guess... - 0 because its an array
        
        var boardDeck = $scope.board[deck];
        if(number < boardDeck.length){ //TODO: alert if its not. actually it doesn't matter since this is just a tutorial, but for a full game implementation...
            var card = boardDeck.splice(number, 1)[0]; 
            $scope.players[player].buyCard(card);
            var gameDeck = $scope.decks[deck];
            if(gameDeck.length > 1){
                boardDeck.push(gameDeck.pop());
            }
        }
        
    };
    
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
    var costArr = function(cost){
        var colors = ["black","white","red","blue","green"]; //TODO: refer to factory colors instead of manually
        var result = [];
        for(var i = 0; i < colors.length; i++){
            var c = colors[i];
            if(c in cost){
                result.push(cost[c])
            }else{
                result.push(0)
            }
        }
        return result.join('-');
        
    };
    var generateID = function(color, points, cost){
        return color + '-' + points  + '-' + costArr(cost);
    };
    return {
        restrict: 'E',
        replace:true,
        scope:{
            points: '=',
            color: '=',
            cost: '='
        },
        link: function(scope,element,attrs){
            scope.id = generateID(scope.color, scope.points, scope.cost);
        },
        templateUrl: '/howtoplay/card.html'

    };

}).factory('CardFactory', function() {
    function Card(color, points, cost) {
        this.color = color;
        this.points = points;
        this.cost = cost;
        this.coststring = JSON.stringify(this.cost);
    }

    return {
        newCard: function(color, points, cost) {
            return new Card(color, points, cost);
        }
    };
}).factory('PlayerFactory', function() {
    function Player(name, deck, gems) {
        this.name = name;
        this.deck = {//TODO: refer to factory colors instead of manually
            "black": [],
            "white": [], 
            "red": [], 
            "blue": [], 
            "green": []
        };
        this.gems = { //TODO: refer to factory colors instead of manually
            "black": 0,
            "white": 0,
            "red": 0,
            "blue": 0,
            "green": 0,
            "gold": 0
        };

        this.buyCard = function(card){
            this.deck[card.color].push(card);
        }
    }


    return {
        newPlayer: function(name) {
            return new Player(name);
        }
    };
});