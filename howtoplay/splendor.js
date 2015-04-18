angular.module('SplendorCtrl', []).controller('SplendorCtrl', ['$scope', 'CardFactory', 'PlayerFactory', function($scope, CardFactory, PlayerFactory) {
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    $scope.game = "SPLENDOR";
    
    $scope.colors = ["black","white","red","blue","green"];
    
    $scope.players = {
        'bob': PlayerFactory.newPlayer('bob'),
        'you': PlayerFactory.newPlayer('you'),
        'alice': PlayerFactory.newPlayer('alice')
    };
    $scope.gemCount = {"gold": 5};
    for(var i = 0; i < $scope.colors.length; i++){
        $scope.gemCount[$scope.colors[i]] = 5;
    }
    
    $scope.getGemCount = function(color){
        return $scope.gemCount[color];
    };
    var bob = $scope.players['bob'];
    var you = $scope.players['you'];
    var alice = $scope.players['alice'];
    
    bob.setNextPlayer(you);
    alice.setNextPlayer(bob);
    you.setNextPlayer(alice);

    you.setStartingPlayer();
    
    $scope.decks = {
        'deck 1': [
            CardFactory.newCard("white", 0, {"black": 0, "white": 0, "red"  : 0, "blue" : 3, "green": 0}),
            CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red"  : 2, "blue" : 0, "green": 0}),
            CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red"  : 1, "blue" : 1, "green": 1}),
            CardFactory.newCard("white", 0, {"black": 2, "white": 0, "red"  : 0, "blue" : 2, "green": 0}),
            CardFactory.newCard("white", 1, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 4}),
            CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red"  : 1, "blue" : 1, "green": 2}),
            CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red"  : 0, "blue" : 2, "green": 2}),
            CardFactory.newCard("white", 0, {"black": 1, "white": 3, "red"  : 0, "blue" : 1, "green": 0}),
            CardFactory.newCard("blue" , 0, {"black": 2, "white": 1, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("blue" , 0, {"black": 3, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("blue" , 0, {"black": 1, "white": 1, "red"  : 1, "blue" : 0, "green": 1}),
            CardFactory.newCard("blue" , 0, {"black": 2, "white": 0, "red"  : 0, "blue" : 0, "green": 2}),
            CardFactory.newCard("blue" , 1, {"black": 0, "white": 0, "red"  : 4, "blue" : 0, "green": 0}),
            CardFactory.newCard("blue" , 0, {"black": 1, "white": 1, "red"  : 2, "blue" : 0, "green": 1}),
            CardFactory.newCard("blue" , 0, {"black": 0, "white": 1, "red"  : 2, "blue" : 0, "green": 2}),
            CardFactory.newCard("blue" , 0, {"black": 0, "white": 0, "red"  : 1, "blue" : 1, "green": 3}),
            CardFactory.newCard("green", 0, {"black": 0, "white": 2, "red"  : 0, "blue" : 1, "green": 0}),
            CardFactory.newCard("green", 0, {"black": 0, "white": 0, "red"  : 3, "blue" : 0, "green": 0}),
            CardFactory.newCard("green", 0, {"black": 1, "white": 1, "red"  : 1, "blue" : 1, "green": 0}),
            CardFactory.newCard("green", 0, {"black": 0, "white": 0, "red"  : 2, "blue" : 2, "green": 0}),
            CardFactory.newCard("green", 1, {"black": 4, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("green", 0, {"black": 2, "white": 1, "red"  : 1, "blue" : 1, "green": 0}),
            CardFactory.newCard("green", 0, {"black": 2, "white": 0, "red"  : 2, "blue" : 1, "green": 0}),
            CardFactory.newCard("green", 0, {"black": 0, "white": 1, "red"  : 0, "blue" : 3, "green": 1}),
            CardFactory.newCard("red"  , 0, {"black": 0, "white": 0, "red"  : 0, "blue" : 2, "green": 1}),
            CardFactory.newCard("red"  , 0, {"black": 0, "white": 3, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("red"  , 0, {"black": 1, "white": 1, "red"  : 0, "blue" : 1, "green": 1}),
            CardFactory.newCard("red"  , 0, {"black": 0, "white": 2, "red"  : 2, "blue" : 0, "green": 0}),
            CardFactory.newCard("red"  , 1, {"black": 0, "white": 4, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("red"  , 0, {"black": 1, "white": 2, "red"  : 0, "blue" : 1, "green": 1}),
            CardFactory.newCard("red"  , 0, {"black": 2, "white": 2, "red"  : 0, "blue" : 0, "green": 1}),
            CardFactory.newCard("red"  , 0, {"black": 3, "white": 1, "red"  : 1, "blue" : 0, "green": 0}),
            CardFactory.newCard("black", 0, {"black": 0, "white": 0, "red"  : 1, "blue" : 0, "green": 2}),
            CardFactory.newCard("black", 0, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 3}),
            CardFactory.newCard("black", 0, {"black": 0, "white": 1, "red"  : 1, "blue" : 1, "green": 1}),
            CardFactory.newCard("black", 0, {"black": 0, "white": 2, "red"  : 0, "blue" : 0, "green": 2}),
            CardFactory.newCard("black", 1, {"black": 0, "white": 0, "red"  : 0, "blue" : 4, "green": 0}),
            CardFactory.newCard("black", 0, {"black": 0, "white": 1, "red"  : 1, "blue" : 2, "green": 1}),
            CardFactory.newCard("black", 0, {"black": 0, "white": 2, "red"  : 1, "blue" : 2, "green": 0}),
            CardFactory.newCard("black", 0, {"black": 1, "white": 0, "red"  : 3, "blue" : 0, "green": 1})
        ],
        'deck 2': [
            CardFactory.newCard("white", 2, {"black": 0, "white": 0, "red"  : 5, "blue" : 0, "green": 0}),
            CardFactory.newCard("white", 3, {"black": 0, "white": 6, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("white", 1, {"black": 2, "white": 0, "red"  : 2, "blue" : 0, "green": 3}),
            CardFactory.newCard("white", 2, {"black": 2, "white": 0, "red"  : 4, "blue" : 0, "green": 1}),
            CardFactory.newCard("white", 1, {"black": 0, "white": 2, "red"  : 3, "blue" : 3, "green": 0}),
            CardFactory.newCard("white", 2, {"black": 3, "white": 0, "red"  : 5, "blue" : 0, "green": 0}),
            
            CardFactory.newCard("blue" , 2, {"black": 0, "white": 0, "red"  : 0, "blue" : 5, "green": 0}),
            CardFactory.newCard("blue" , 3, {"black": 0, "white": 0, "red"  : 0, "blue" : 6, "green": 0}),
            CardFactory.newCard("blue" , 1, {"black": 0, "white": 0, "red"  : 3, "blue" : 2, "green": 2}),
            CardFactory.newCard("blue" , 2, {"black": 4, "white": 2, "red"  : 1, "blue" : 0, "green": 0}),
            CardFactory.newCard("blue" , 1, {"black": 3, "white": 0, "red"  : 0, "blue" : 2, "green": 3}),
            CardFactory.newCard("blue" , 2, {"black": 0, "white": 5, "red"  : 0, "blue" : 3, "green": 0}),
            
            CardFactory.newCard("green", 2, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 5}),
            CardFactory.newCard("green", 3, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 6}),
            CardFactory.newCard("green", 1, {"black": 2, "white": 2, "red"  : 0, "blue" : 3, "green": 0}),
            CardFactory.newCard("green", 2, {"black": 0, "white": 3, "red"  : 3, "blue" : 0, "green": 2}),
            CardFactory.newCard("green", 1, {"black": 1, "white": 4, "red"  : 0, "blue" : 2, "green": 0}),
            CardFactory.newCard("green", 2, {"black": 0, "white": 0, "red"  : 0, "blue" : 5, "green": 3}),
            
            CardFactory.newCard("red"  , 2, {"black": 5, "white": 0, "red"  : 0, "blue" : 0, "green": 7}),
            CardFactory.newCard("red"  , 3, {"black": 0, "white": 0, "red"  : 6, "blue" : 0, "green": 7}),
            CardFactory.newCard("red"  , 1, {"black": 3, "white": 2, "red"  : 2, "blue" : 0, "green": 7}),
            CardFactory.newCard("red"  , 2, {"black": 0, "white": 1, "red"  : 0, "blue" : 4, "green": 7}),
            CardFactory.newCard("red"  , 1, {"black": 3, "white": 0, "red"  : 2, "blue" : 3, "green": 6}),
            CardFactory.newCard("red"  , 2, {"black": 5, "white": 3, "red"  : 0, "blue" : 0, "green": 3}),
            
            CardFactory.newCard("black", 2, {"black": 0, "white": 5, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("black", 3, {"black": 6, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("black", 1, {"black": 0, "white": 3, "red"  : 0, "blue" : 2, "green": 2}),
            CardFactory.newCard("black", 2, {"black": 0, "white": 0, "red"  : 2, "blue" : 1, "green": 4}),
            CardFactory.newCard("black", 1, {"black": 2, "white": 3, "red"  : 0, "blue" : 0, "green": 3}),
            CardFactory.newCard("black", 2, {"black": 0, "white": 0, "red"  : 3, "blue" : 0, "green": 5})
        ],
        'deck 3': [
            CardFactory.newCard("white", 4, {"black": 7, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("white", 5, {"black": 7, "white": 3, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("white", 4, {"black": 6, "white": 3, "red"  : 3, "blue" : 0, "green": 0}),
            CardFactory.newCard("white", 3, {"black": 3, "white": 0, "red"  : 5, "blue" : 3, "green": 3}),
            
            CardFactory.newCard("blue" , 4, {"black": 0, "white": 7, "red"  : 0, "blue" : 0, "green": 0}),
            CardFactory.newCard("blue" , 5, {"black": 0, "white": 7, "red"  : 0, "blue" : 3, "green": 0}),
            CardFactory.newCard("blue" , 4, {"black": 3, "white": 6, "red"  : 0, "blue" : 3, "green": 0}),
            CardFactory.newCard("blue" , 3, {"black": 5, "white": 3, "red"  : 3, "blue" : 0, "green": 3}),
            
            CardFactory.newCard("green", 4, {"black": 0, "white": 0, "red"  : 0, "blue" : 7, "green": 0}),
            CardFactory.newCard("green", 5, {"black": 0, "white": 0, "red"  : 0, "blue" : 7, "green": 3}),
            CardFactory.newCard("green", 4, {"black": 0, "white": 3, "red"  : 0, "blue" : 6, "green": 3}),
            CardFactory.newCard("green", 3, {"black": 3, "white": 5, "red"  : 3, "blue" : 3, "green": 0}),
            
            CardFactory.newCard("red"  , 4, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 7}),
            CardFactory.newCard("red"  , 5, {"black": 0, "white": 0, "red"  : 3, "blue" : 0, "green": 7}),
            CardFactory.newCard("red"  , 4, {"black": 0, "white": 0, "red"  : 3, "blue" : 3, "green": 6}),
            CardFactory.newCard("red"  , 3, {"black": 3, "white": 3, "red"  : 0, "blue" : 5, "green": 3}),
            
            CardFactory.newCard("black", 4, {"black": 0, "white": 0, "red"  : 7, "blue" : 0, "green": 0}),
            CardFactory.newCard("black", 5, {"black": 3, "white": 0, "red"  : 7, "blue" : 0, "green": 0}),
            CardFactory.newCard("black", 4, {"black": 3, "white": 0, "red"  : 6, "blue" : 0, "green": 3}),
            CardFactory.newCard("black", 3, {"black": 0, "white": 3, "red"  : 3, "blue" : 3, "green": 5})
        ]
    };
    for(var deck in $scope.decks){
        shuffle($scope.decks[deck]);
    }
    $scope.board = {
        'deck 1': [$scope.decks['deck 1'].pop(), $scope.decks['deck 1'].pop(), $scope.decks['deck 1'].pop()],
        'deck 2': [$scope.decks['deck 2'].pop(), $scope.decks['deck 2'].pop(), $scope.decks['deck 2'].pop()],
        'deck 3': [$scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop()]
    };
    $scope.selected_card_to_reserve = false;
    $scope.selected_card = false;
    $scope.selected_card_index = -1;
    $scope.selected_deck = null;
    
    $scope.buyCard = function(player, deck, number){ //TODO: make this a service i guess... - 0 because its an array
        $scope.show_alert = false;
        var fromReserved = false;
        var player = $scope.getPlayer(player);
        var boardDeck;
        var gameDeck;
        if(deck == 'reserved'){
            boardDeck = player.getReservedCards();
        }else{
            boardDeck = $scope.board[deck];
            gameDeck = $scope.decks[deck];
        }
        if(number < boardDeck.length){ //TODO: alert if its not. actually it doesn't matter since this is just a tutorial, but for a full game implementation...
            var card = boardDeck[number];
            if(player.canBuy(card)){
                boardDeck.splice(number, 1)[0];
                var amt_repaid = player.buyCard(card); //its really buy and return the amt repaid
                for(var g in amt_repaid){
                    $scope.gemCount[g] += amt_repaid[g];
                }
                $scope.resetSelectCard();
                
                if(deck != 'reserved' && gameDeck.length > 0 ){
                    boardDeck.splice(number, 0, gameDeck.pop());
                }
            }else{
                //someone you could buy it before but not now.
            }
            
        }
        
    };

    $scope.reserveCard = function(player, deck, number){ //TODO: make this a service i guess... - 0 because its an array
        $scope.show_alert = false;
        var boardDeck = $scope.board[deck];
        if(number < boardDeck.length){ //TODO: alert if its not. actually it doesn't matter since this is just a tutorial, but for a full game implementation...
            var player = $scope.getPlayer(player);
            var card = boardDeck[number];
            boardDeck.splice(number, 1)[0];
            player.reserveCard(card); //its really buy and return the amt repaid
            if($scope.getGemCount("gold")>=1){
                player.addGem("gold");
                $scope.gemCount["gold"] -= 1;
            }
            $scope.resetSelectCard();
            var gameDeck = $scope.decks[deck];
            if(gameDeck.length > 0){
                boardDeck.splice(number, 0, gameDeck.pop());
            }
            

        }

    };

    $scope.takeGems = function(player){ //TODO: make this a service i guess... - 0 because its an array
        for(var i = 0; i < $scope.selected_gems.length; i++){
            var color = $scope.selected_gems[i];
            if($scope.gemCount[color] > 0){
                $scope.getPlayer(player).addGem(color);
                $scope.gemCount[color] -= 1;
            }
        }
        if($scope.selected_gems.length == 1){
            var color = $scope.selected_gems[0];
            if($scope.gemCount[color] > 0){
                $scope.getPlayer(player).addGem(color);
                $scope.gemCount[color] -= 1;
            }
        }
        $scope.resetSelectGems();
        
    };
    $scope.resetSelectGems = function(){
        $scope.want_two_gems = false;
        $scope.want_three_gems = false;
        $scope.selected_gems = [];
    };
    $scope.resetSelectCard = function(){
        $scope.selected_card = false;
        $scope.selected_card_to_reserve = false;
        $scope.selected_card_index = -1;
        $scope.selected_deck = null;
    };
    
    
    $scope.showBuyButton = function(deck, index){
        $scope.show_alert = false;
        $scope.selected_card_to_reserve = false //enable it later
        //TODO: check for if you can afford it
        $scope.resetSelectGems();
        if (index == $scope.selected_card_index && deck == $scope.selected_deck) {
            $scope.resetSelectCard();
        } else {
            $scope.selected_card = true;
            $scope.selected_card_index = index;
            $scope.selected_deck = deck;
            var boardDeck;
            var player = $scope.getPlayer('you');
            if(deck == 'reserved'){
                boardDeck = player.getReservedCards();
            }else{
                boardDeck = $scope.board[deck];
            }
           
            
            var card = boardDeck[index];
            if (!player.canBuy(card)) {
                $scope.show_alert = true;
                $scope.alert_message = "Cannot afford.";
                $scope.selected_card = false;
            }
        }


    };

    $scope.showReserveButton = function(deck, index){

        //TODO: check for if you can afford it
        if(index == $scope.selected_card_index && deck == $scope.selected_deck){
            var player = $scope.getPlayer('you');
            if(player.getReservedCards().length < 3){
                //because we also select it to buy
                $scope.selected_card_to_reserve = true;
            }
            
        }else{
            $scope.selected_card_to_reserve = false;
        }
    };
    
    $scope.want_two_gems = false;
    $scope.want_three_gems = false;
    $scope.selected_gems = [];
    
    $scope.getPlayerBuildingCount = function(playername, color){
        return $scope.getPlayer(playername).getBuildingCount(color);
    };

    $scope.getPlayerGemCount = function(playername, color){
        return $scope.getPlayer(playername).getGemCount(color);
    };

    $scope.getPlayerPoints = function(playername){
        return $scope.getPlayer(playername).getPoints();
    }
    $scope.getPlayer = function(playername){
        return $scope.players[playername]
    };

    $scope.showSelectGem = function(color){
        $scope.resetSelectCard();
        $scope.show_alert = false;
        //TODO: check for if you can afford it
        if($scope.selected_gems.length == 0){
            if($scope.gemCount[color] >= 1){
                $scope.selected_gems.push(color);
                if($scope.gemCount[color] >= 4){
                    $scope.want_three_gems = false;
                    $scope.want_two_gems = true;
                }else{
                    $scope.alert_message = "Less than 4 " + color + " gems.";
                    $scope.show_alert = true;
                }
            }
            
        }else if($scope.selected_gems.indexOf(color) > -1){
            //deselected it
            var index = $scope.selected_gems.indexOf(color);
            $scope.selected_gems.splice(index, 1);
            $scope.want_three_gems = false;
            $scope.want_two_gems = false;
            if($scope.selected_gems.length == 1){
                var color_left = $scope.selected_gems[0];
                if($scope.gemCount[color_left] >= 4){
                    $scope.want_three_gems = false;
                    $scope.want_two_gems = true;
                }else{
                    $scope.alert_message = "Less than 4 " + color_left + " gems.";
                    $scope.show_alert = true;
                }
            }
        }else if($scope.selected_gems.length < 3){
            if($scope.gemCount[color] >= 1){
                $scope.selected_gems.push(color);
                $scope.want_three_gems = false;
                $scope.want_two_gems = false;
                if($scope.selected_gems.length == 3){
                    $scope.want_three_gems = true;
                }
            }
            //TODO: check if there are only 2 gems available
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
            "black": 70,
            "white": 70,
            "red": 70,
            "blue": 70,
            "green": 70,
            "gold": 70
        };
        this.points = 0;
        
        this.reservedCards = [];

        this.buyCard = function(card){
            var card_costs = card.cost;
            var gold_needed = 0;
            var amt_repaid = {'gold': 0};
            for(var c in card_costs){
                var gem_cost = Math.max(0, card_costs[c] - this.deck[c].length);
                if(this.gems[c] < gem_cost){
                    gold_needed += (gem_cost - this.gems[c])
                }
                amt_repaid[c] = Math.min(this.gems[c],  gem_cost);
                this.gems[c] -= amt_repaid[c];

            }
            this.points += card.points;
            this.gems["gold"] -= gold_needed;
            this.deck[card.color].push(card);
            amt_repaid["gold"] = gold_needed;
            return amt_repaid;
        };
        
        this.canBuy = function(card){
            var card_costs = card.cost;
            var gold_needed = 0;
            for(var c in card_costs){
                var amt_avail = this.gems[c] + this.deck[c].length;
                if(amt_avail < card_costs[c]){
                    gold_needed += (card_costs[c] - amt_avail)
                }
            }
            return gold_needed <= this.gems['gold'];
        };
        
        this.addGem = function(color){
            this.gems[color] += 1;
        };
        
        this.points = 0;
        this.firstPlayer = false;
        
        this.nextPlayer = null;
        
        this.setNextPlayer = function(player){
            this.nextPlayer = player;
        };
        
        this.setStartingPlayer = function(){
            this.firstPlayer = true;
        };
        
        this.getGemCount = function(color){
            return this.gems[color];
        };

        this.getBuildingCount = function(color){
            return this.deck[color].length;
        };
        
        this.reserveCard = function(card){
            if(this.getReservedCards().length < 3){
                this.reservedCards.push(card);
            }
        };
        
        this.getReservedCards = function(){
            return this.reservedCards;
        };

        this.getPoints = function(){
            return this.points;
        };
    }


    return {
        newPlayer: function(name) {
            return new Player(name);
        }
    };
});