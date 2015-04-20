angular.module('SplendorCtrl', []).controller('SplendorCtrl', ['$scope', 'CardFactory', 'PlayerFactory', 'NobleFactory', function($scope, CardFactory, PlayerFactory, NobleFactory) {
    $scope.startJoyRide = false;
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
    
    $scope.game_messages = [];
    
    $scope.players = {
        'bob': PlayerFactory.newPlayer('bob'),
        'you': PlayerFactory.newPlayer('you'),
        'alice': PlayerFactory.newPlayer('alice')
    };
    
    
    $scope.getGemCount = function(color){
        return $scope.gemCount[color];
    };
    var bob = $scope.players['bob'];
    var you = $scope.players['you'];
    var alice = $scope.players['alice'];
    
    bob.setNextPlayer('you');
    alice.setNextPlayer('bob');
    you.setNextPlayer('alice');
    
    $scope.startDemo = function(){
        for(var p in $scope.players){
            if($scope.players[p].firstPlayer){
                $scope.curPlayer = $scope.players[p];
                break;
            }
        }
        $scope.addMessage($scope.curPlayer.name + " is the starting player.");
        $scope.playBots();
    };
    
    $scope.playBots = function(){
        
        while($scope.curPlayer.name != "you"){
            
            console.log($scope.curPlayer);
            //bot will buy any card they can, and then do a random action if not.
            var reserved_cards = $scope.curPlayer.reservedCards;
            var p = $scope.curPlayer;
            var turn_over = false;
            
            for(var i = 0; i < reserved_cards.length; i++){
                if(p.canBuy(reserved_cards[i])){
                    $scope.buyCard(p.name, 'reserved', i);
                    $scope.addMessage(p.name + " buys a reserved card");
                    turn_over = true;
                    break;
                }
            }
            if(!turn_over){
                var decks = ["deck 3", "deck 2", "deck 1"]; //go backwards
                for(var i = 0; i < decks.length; i++){
                    if(!turn_over){
                        for(var j = 0; j < $scope.board[decks[i]].length; j++){
                            if(p.canBuy($scope.board[decks[i]][j])){
                                $scope.buyCard(p.name, decks[i], j);
                                $scope.addMessage(p.name + " buys a card from " + decks[i]);
                                turn_over = true;
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
            
            if(!turn_over){
                var random_actions = ["take 3 gems", "take 2 gems", "reserve card"]; 
                var random_index = Math.floor((Math.random() * random_actions.length));
                console.log(random_actions[random_index]);
                var colors = ["black","white","red","blue","green"];
                shuffle(colors);
                if(random_index == 0){
                    for(var i = 0; i < colors.length; i++){
                        if($scope.selected_gems.length < 3){
                            if($scope.gemCount[colors[i]]>0){
                                $scope.selected_gems.push(colors[i]);
                            }
                        }
                    }
                    $scope.addMessage(p.name + " takes " + $scope.selected_gems);
                    $scope.takeGems(p.name)
                }else if(random_index == 1){
                    for(var i = 0; i < colors.length; i++){
                        if($scope.selected_gems.length < 2){
                            if($scope.gemCount[colors[i]]>=4){
                                $scope.selected_gems.push(colors[i]);
                                $scope.selected_gems.push(colors[i]);
                            }
                        }
                    }
                    $scope.addMessage(p.name + " takes " + $scope.selected_gems);
                    $scope.takeGems(p.name)
                }else{
                    var decks = [];
                    for(var d in $scope.board){
                        if($scope.board[d].length > 0){
                            decks.push(d);
                        }
                    }
                    var random_deck = Math.floor((Math.random() * decks.length));
                    var random_card_index = Math.floor((Math.random() * $scope.board[decks[random_deck]].length));
                    $scope.addMessage(p.name + " reserves a card from " + decks[random_deck]);
                    $scope.reserveCard(p.name, decks[random_deck], random_card_index);
                }
            }
            if(p.gemCount() > 10){
                var colors = ["black","white","red","blue","green","gold"];
                shuffle(colors);
                var gems_over = p.gemCount() - 10;
                for(var i = 0; i < colors.length; i++){
                    if(p.getGemCount(colors[i]) > 0){
                        var amt_to_return = Math.min(p.getGemCount(colors[i]), gems_over);
                        gems_over -= amt_to_return;
                        $scope.returnedGems[colors[i]] = amt_to_return;
                    }
                    if(gems_over <= 0){
                        break;
                    }
                }
                var gems_returned = [];
                for(var c in $scope.returnedGems){
                    if($scope.returnedGems[c] > 0){
                        gems_returned.push($scope.returnedGems[c] + " " + c);
                    }
                }
                $scope.returnGems(p.name);
                $scope.addMessage(p.name + " returned " + gems_returned.join(', ') + ".");
            }
            
            $scope.checkForEndDemo();
            $scope.curPlayer = $scope.players[$scope.curPlayer.nextPlayer];
        }
        $scope.addMessage("it is your turn.");
    };

    $scope.returnedGems = { //TODO: refer to factory colors instead of manually
        "black": 0,
        "white": 0,
        "red": 0,
        "blue": 0,
        "green": 0,
        "gold": 0
    };
    
    $scope.resetReturnedGems = function(){
        $scope.returnedGems = { //TODO: refer to factory colors instead of manually
            "black": 0,
            "white": 0,
            "red": 0,
            "blue": 0,
            "green": 0,
            "gold": 0
        };
    };
    
    $scope.returnedGemCount = function(){
        var total = 0;
        for(var c in $scope.returnedGems){
            total+= $scope.returnedGems[c];
        }
        return total;
    };
    $scope.returnGems = function(player){
        var p = $scope.players[player];
        p.returnGems($scope.returnedGems);
        for(var c in $scope.returnedGems){
            $scope.gemCount[c] += $scope.returnedGems[c];
        }
        $scope.resetReturnedGems();
        $scope.endYourTurnIfDemo();
    };
    $scope.endYourTurnIfDemo = function(){
        if($scope.demoStarted && !$scope.learningGame){
            if($scope.curPlayer.name == 'you'){
                $scope.gemsReturned = false;
                if($scope.curPlayer.gemCount() > 10){
                    $scope.returnedGems = { //TODO: refer to factory colors instead of manually
                        "black": 0,
                        "white": 0,
                        "red": 0,
                        "blue": 0,
                        "green": 0,
                        "gold": 0
                    };
                    $scope.gemsReturned = true;
                }
                if(!$scope.gemsReturned){
                    $scope.checkForEndDemo();
                    $scope.curPlayer = $scope.players[$scope.curPlayer.nextPlayer];
                    $scope.playBots();
                }
                
            }
        }
    };
    $scope.demoLastRound = false;
    
    $scope.checkForEndDemo = function(){
        var p = $scope.curPlayer;
        if(p.getPoints() >= 15 && !$scope.demoLastRound){
            $scope.addMessage(p.name + " has " + p.points + "! Last round!");
            $scope.demoLastRound = true;
        }
        
        if($scope.demoLastRound && $scope.players[p.nextPlayer].firstPlayer){
            var max_score = 0;
            var winners = [];
            for(var player in $scope.players){
                if($scope.players[player].getPoints() > max_score){
                    max_score = $scope.players[player].getPoints();
                }
            }
            for(var player in $scope.players){
                if($scope.players[player].getPoints() == max_score){
                    winners.push(player);
                }
            }
            $scope.addMessage("Game over! " + winners.join(", ") + " wins with " + max_score + " points!");
            $scope.demoStarted = false;
        }
    };
    
    $scope.selected_card_to_reserve = false;
    $scope.selected_card = false;
    $scope.selected_card_index = -1;
    $scope.selected_deck = null;
    
    $scope.addMessage = function(msg){
        console.log(msg);
        $scope.game_messages.push(msg);
        if($scope.game_messages.length > 5){
            $scope.game_messages.splice(0,1);
        }
    };
    
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
                console.log("BUY")
                boardDeck.splice(number, 1)[0];
                var amt_repaid = player.buyCard(card); //its really buy and return the amt repaid
                for(var g in amt_repaid){
                    $scope.gemCount[g] += amt_repaid[g];
                }
                $scope.resetSelectCard();
                
                if(deck != 'reserved' && gameDeck.length > 0 ){
                    boardDeck.splice(number, 0, gameDeck.pop());
                }
                for(var i = 0; i < $scope.board_nobles.length; i++){
                    var getNoble = true;
                    var noble = $scope.board_nobles[i];
                    for(var color in noble['requirements']){
                        getNoble = getNoble && player.getBuildingCount(color) >= noble['requirements'][color];
                        if(!getNoble){
                            break;
                        }
                    }
                    if(getNoble){
                        player.addNoble($scope.board_nobles.splice(i, 1)[0]);
                        console.log("YEAH GOT NOBLE")
                        console.log(noble)
                        console.log(player);
                    }

                }
            }else{
                //someone you could buy it before but not now.
            }
            
        }
        $scope.endYourTurnIfDemo();
        
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
        $scope.endYourTurnIfDemo();

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
        $scope.endYourTurnIfDemo();
        
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
        console.log("step: " + $scope.joyRideStep);
        console.log("demo start: " + $scope.demoStarted);
        console.log("learning: " + $scope.learningGame);
        console.log("deck: " + deck);
        console.log("index: " + index);
        
        if(
            !$scope.demoStarted &&
            !($scope.joyRideStep == $scope.demoPauseSteps[0] && $scope.learningGame && deck == 'deck 1' && index == 0)
        ) {
            return;
        }
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
    };
    
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
    $scope.resetMessages = function(){
        $scope.game_messages = [];
    };
    $scope.resetPlayers = function(){
        for(var p in $scope.players){
            $scope.players[p].reset();
        }
    };
    $scope.setUpDeck = function(){
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
    };
    
    $scope.setUpNobles = function(){
        $scope.nobles = [
            NobleFactory.newNoble(3, {"black": 3, "white": 3, "red"  : 0, "blue" : 3, "green": 0}),
            NobleFactory.newNoble(3, {"black": 0, "white": 0, "red"  : 3, "blue" : 3, "green": 3}),
            NobleFactory.newNoble(3, {"black": 3, "white": 3, "red"  : 3, "blue" : 0, "green": 0}),
            NobleFactory.newNoble(3, {"black": 0, "white": 0, "red"  : 4, "blue" : 0, "green": 4}),
            NobleFactory.newNoble(3, {"black": 0, "white": 0, "red"  : 0, "blue" : 4, "green": 4}),
            NobleFactory.newNoble(3, {"black": 4, "white": 0, "red"  : 4, "blue" : 0, "green": 0}),
            NobleFactory.newNoble(3, {"black": 4, "white": 4, "red"  : 0, "blue" : 0, "green": 0}),
            NobleFactory.newNoble(3, {"black": 0, "white": 3, "red"  : 0, "blue" : 3, "green": 3}),
            NobleFactory.newNoble(3, {"black": 3, "white": 0, "red"  : 3, "blue" : 0, "green": 3}),
            NobleFactory.newNoble(3, {"black": 0, "white": 4, "red"  : 0, "blue" : 4, "green": 0})
        ];
    };
    
    $scope.shuffleDeck = function(){
        for(var deck in $scope.decks){
            shuffle($scope.decks[deck]);
        }
    };
    $scope.shuffleNobles = function(){
        shuffle($scope.nobles);
    }
    $scope.drawDeck = function(){
        $scope.board = {
            'deck 1': [$scope.decks['deck 1'].pop(), $scope.decks['deck 1'].pop(), $scope.decks['deck 1'].pop()],
            'deck 2': [$scope.decks['deck 2'].pop(), $scope.decks['deck 2'].pop(), $scope.decks['deck 2'].pop()],
            'deck 3': [$scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop()]
        };
    };
    $scope.drawNobles = function(){
        $scope.board_nobles = [$scope.nobles.pop()];
        for(var i = 0; i < Object.keys($scope.players).length; i++){
            $scope.board_nobles.push($scope.nobles.pop());
        }
    };
    $scope.resetCards = function(){
        $scope.setUpDeck();
        $scope.setUpNobles();
        

    };
    
    $scope.startGame = function(){
        $scope.shuffleDeck();
        $scope.shuffleNobles();
        $scope.drawDeck();
        $scope.drawNobles();
    };
    
    $scope.resetGems = function(){
        $scope.gemCount = {"gold": 5};
        for(var i = 0; i < $scope.colors.length; i++){
            $scope.gemCount[$scope.colors[i]] = 5;
        }
    };
    $scope.resetGame = function(){
        $scope.resetMessages();
        $scope.resetPlayers();
        $scope.resetCards();
        $scope.resetGems();
        $scope.startGame();
        $scope.demoLastRound = false;
    };
    $scope.demoStarted = false;
    $scope.playDemo = function(){
        $scope.resetGame();
        $scope.demoStarted = true;
        var players = ["you", "alice", "bob"];
        var randomIndex = Math.floor((Math.random() * players.length));
        
        $scope.players[players[randomIndex]].setStartingPlayer();
        $scope.addMessage("Game Started!");
        $scope.startDemo();
    };
    
    $scope.resetCards();
    $scope.resetGems();
    $scope.joyRideStep = 0;
    $scope.learningGame = false;
    $scope.waiting = false;
    $scope.showTutorial = function(){
        $scope.startJoyRide = true;
        $scope.learningGame = true;
        $scope.waiting = false;
        $scope.curPlayer = $scope.players['you'];
        $scope.players['you'].setStartingPlayer();
    };
    
    $scope.onFinish = function(){
        if(!$scope.waiting){
            $scope.joyRideStep = 0;
        }
        
    };
    
    $scope.demoPauseSteps = [11];
    function buildJoyrideBoard(createdNodes){
        $scope.nobles = [
            NobleFactory.newNoble(3, {"black": 3, "white": 3, "red"  : 0, "blue" : 3, "green": 0}),
            NobleFactory.newNoble(3, {"black": 0, "white": 0, "red"  : 4, "blue" : 0, "green": 4}),
            NobleFactory.newNoble(3, {"black": 0, "white": 0, "red"  : 0, "blue" : 4, "green": 4}),
            NobleFactory.newNoble(3, {"black": 0, "white": 4, "red"  : 0, "blue" : 4, "green": 0})
        ];
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
                CardFactory.newCard("black", 0, {"black": 1, "white": 0, "red"  : 3, "blue" : 0, "green": 1}),
                CardFactory.newCard("red"  , 0, {"black": 0, "white": 0, "red"  : 0, "blue" : 2, "green": 1})
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
                CardFactory.newCard("black", 4, {"black": 3, "white": 0, "red"  : 6, "blue" : 0, "green": 3}),
                CardFactory.newCard("black", 3, {"black": 0, "white": 3, "red"  : 3, "blue" : 3, "green": 5}),
                
            ]
        };
        $scope.drawDeck();
        $scope.drawNobles();
    };
    function waitForClick(createdNodes){
        $scope.joyRideStep = $scope.demoPauseSteps[0];
        console.log("THE STEP SI " + $scope.joyRideStep);
        $scope.waiting = true;
        $scope.startJoyRide = false;
    };
    function giveJoyRideCardsGems(createdNodes){
        var you = $scope.players['you'];
        you.addCard(CardFactory.newCard("black", 5, {"black": 3, "white": 0, "red"  : 7, "blue" : 0, "green": 0}));
        you.addCard(CardFactory.newCard("black", 2, {"black": 0, "white": 5, "red"  : 0, "blue" : 0, "green": 0}));
        you.addCard(CardFactory.newCard("blue" , 0, {"black": 2, "white": 1, "red"  : 0, "blue" : 0, "green": 0}));
        $scope.selected_gems=['green', 'blue', 'red','red','red','red','black','black','black','black'];
        $scope.takeGems('you');
    };
    $scope.config = [

        {
            type: "title",
            heading: "Welcome to Splendor",
            text: 'This is a game about building the greatest gem factory, where the winner will be the player with the most points.'

        },{
            type: "function",
            fn: buildJoyrideBoard //(can also be a string, which will be evaluated on the scope)
        },/**
        {
            type: "element",
            selector: ".board-cards",
            heading: "The Board",
            text: "This is the game layout: there are three levels of possible gem buildings to build, each with differing costs. You will learn the importance of these buildings later.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: "#nobles",
            heading: "The Board",
            text: "There are also some noble cards which can give you bonus points.  You will learn how to get them later.",
            placement: "left",
            scrollPadding: 250,
            scroll: true
        },**/
        {
            type: "function",
            fn: giveJoyRideCardsGems //(can also be a string, which will be evaluated on the scope)
        },/**
        {
            type: "element",
            selector: ".you-scoreboard",
            heading: "The Board",
            text: "Normally in a real game you will start off with 0 gems and 0 buildings, but for this tutorial, we will give you some gems and some buildings already",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-black-0",
            heading: "The Board",
            text: "Because you own this building, you have 5 points,... ",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-black-1",
            heading: "The Board",
            text: "...and this building gives you 2 more points for a total of 7.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-black-deck",
            heading: "The Board",
            text: "These two buildings also produces two black gems for you (1 each).",
            placement: "left",
            scroll: true
        },**/
        {
            type: "element",
            selector: ".deck-1-0",
            heading: "The Board",
            text: "On your turn you can buy buildings if you can afford them. click this building to buy it.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: waitForClick //(can also be a string, which will be evaluated on the scope)
        }
    ];
    //welcome to splendor: this is a game about building the greatest gem factory where the winner will be the person with the most number of points.
    //this is the game layout -  as you can see, there are three levels of possible gem buildings to build, each with differing costs
    //normally in a real game you will start off with 0 gems, but for this tutorial, we will give you some gems and some cards already.
    //because you own this building, you have 3 points already.
    //this building also produces one red gem for you.
    //on your turn you can buy buildings if you can afford them. click this building to buy it. ->build some red card (+black), had ???, now 4 red, 4 blacks, 1 black building
    //the cost of this building was XYZ gems. because you produce one red gem already, the red cost is reduced by 1.
    //for the other gems, you must pay the cost
    //your turn is over so end your turn
    //on alice's turn, she took 3 gems of different colors. this is another action you can do.
    //on bob's turn, bob took 2 gems of different colors. this is another action you can do, but only if there are at least 4 gems of that color available.
    //this building provides a good number of points, but you cannot afford it yet. click it to reserve it. this is the final action you can do. -> reserve 7 red, had 4 red, 4 blacks, 1 black building
    //when you reserve a card, only you can build it, but only on a future turn. you can only reserve 3 cards max.
    //you also receive a gold gem, which is a wildcard gem color
    //end your turn
    //alice built this building
    //bob built this building
    //click the red pile to take two red gems -> take two red (had 2 red, 4 blacks, 1 gold)
    //end your turn
    //alice took 3 gems
    //bob took 3 gems
    //now you can build this building! click it to build it. -> build 7 red (+black)  (had 4 red, 4 blacks, 1 black buildings, 1 gold, now 4 blacks, 2 black buildings)
    //notice how, because you have two black buildings, the black gem cost is reduced by 2. also you used your gold gem because you do not have a black gem. now you have 11 points! buildings are replaced when built.
    //end your turn
    //alice took 2 gems
    //bob took 2 gems
    //click this card to reserve it -> reserve 7 black: white 3 points (had 4 blacks, 2 black buildings)
    //end your turn
    //alice took 3 gems
    //bob built a building
    //take these three gems
    //alice built a building
    //bob built a building
    //build this building! now you have 15 points. because you started the game, bob and alice have one final turn. -> builds 7 black: white 3 pts (had 4 blacks, 1 gold, 2 black buildings)
    //alice builds this building. because she has 3 black and 3 blue and 3 white buildings, she gets this noble card which gives her more points! noble cards are not replaced when taken.
    //bob builds this building. he gets these two nobles, and therefore has 18 points and wins! the end. replay? -> builds a green card
    
    
}]).directive('card', function() {
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

}).directive('noble', function() {
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
    var generateID = function(points, requirements){
        return 'noble-' + points  + '-' + costArr(requirements);
    };
    return {
        restrict: 'E',
        replace:true,
        scope:{
            points: '=',
            requirements: '='
        },
        link: function(scope,element,attrs){
            scope.id = generateID(scope.points, scope.requirements);
        },
        templateUrl: '/howtoplay/noble.html'

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
}).factory('NobleFactory', function() {
    function Noble(points, requirements) {
        this.points = points;
        this.requirements = requirements;
    }

    return {
        newNoble: function(points, requirements) {
            return new Noble(points, requirements);
        }
    };
}).factory('PlayerFactory', function() {
    function Player(name, deck, gems) {
        this.name = name;

        
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
        
        this.addCard = function(card){
            this.deck[card.color].push(card);
        };
        
        this.returnGems = function(gemDict){
            for(var c in gemDict){
                this.gems[c] -= gemDict[c];
            }
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
        this.addNoble = function(noble){
            this.nobles.push(noble);
            this.points += noble.points;
        };
        this.addGem = function(color){
            this.gems[color] += 1;
        };
        
        
        
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
        
        this.gemCount = function(){
            var total = 0;
            for(var g in this.gems){
                total += this.getGemCount(g);
            }
            return total;
        };
        
        this.reset = function(){
            
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
            this.points = 0;

            this.reservedCards = [];

            this.nobles = [];

            this.points = 0;
            this.firstPlayer = false;
        };

        this.reset();
    }


    return {
        newPlayer: function(name) {
            return new Player(name);
        }
    };
});