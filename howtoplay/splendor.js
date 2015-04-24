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

    bob.setPriorPlayer('alice');
    alice.setPriorPlayer('you');
    you.setPriorPlayer('bob');
    
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
            $scope.players[$scope.curPlayer.priorPlayer].resetGemChanges();
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
                    $scope.players[$scope.curPlayer.priorPlayer].resetGemChanges();
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
                boardDeck.splice(number, 1);
                
                var amt_repaid = player.buyCard(card); //its really buy and return the amt repaid
                for(var g in amt_repaid){
                    $scope.gemCount[g] += amt_repaid[g];
                }
                $scope.resetSelectCard();
                
                if(deck != 'reserved' && gameDeck.length > 0 ){
                    boardDeck.splice(number, 0, gameDeck.pop());
                }
                var nobles_to_add = [];
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
                        var spliced_noble = $scope.board_nobles.splice(i, 1)[0];
                        spliced_noble.setOldLocation(i);
                        nobles_to_add.push(spliced_noble)
                        i -= 1;
                    }
                }
                player.addNobles(nobles_to_add);
            }else{
                //someone you could buy it before but not now.
            }
            
        }
        $scope.endYourTurnIfDemo();
        
    };

    $scope.unBuyLastCard = function(player, deck, number){ //TODO: make this a service i guess... - 0 because its an array 
        if(!$scope.learningGame){
            return;
        }
        $scope.show_alert = false;//ONLY IF ITS TUTORIAL
        var fromReserved = false;
        var player = $scope.getPlayer(player);
        var boardDeck;
        var gameDeck;
        if(deck == 'reserved'){
            boardDeck = player.getReservedCards();
        }else{
            boardDeck = $scope.board[deck];
            gameDeck = $scope.decks[deck];
            var newCard = boardDeck.splice(number, 1)[0];//remove the new card
        };
        var lastCard = player.getLastBoughtCard();
        boardDeck.splice(number, 0, lastCard);//put the old card back
        var player_paid = player.getOldCost(); //its really buy and return the amt repaid
        player.unBuyLastCard(); //this pops
        player.resetGemChanges();
        
        for(var g in player_paid){
            $scope.gemCount[g] -= player_paid[g];
        }
        $scope.resetSelectCard();
        if(deck != 'reserved'){
            gameDeck.push(newCard);//put the new card on top of the game deck
        }
        var nobles = player.popLastNobles(); //this pops and removes from the player
        for(var i = 0; i < nobles.length; i++){
            var noble = nobles[i];
            $scope.board_nobles.splice(noble.oldLocation, 0, noble);
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
        $scope.endYourTurnIfDemo();

    };

    $scope.unReserveLastCard = function(player, deck, number){ //TODO: make this a service i guess... - 0 because its an array
        if(!$scope.learningGame){ return; }
        $scope.show_alert = false;
        var boardDeck = $scope.board[deck];
        if(number < boardDeck.length){ //TODO: alert if its not. actually it doesn't matter since this is just a tutorial, but for a full game implementation...
            var player = $scope.getPlayer(player);
            var newCard = boardDeck.splice(number, 1)[0];//remove the new card
            var lastCard = player.getLastReservedCard();
            boardDeck.splice(number, 0, lastCard);//put the old card back
            player.unReserveLastCard(); //this pops
            
            if(player.getGemCount("gold")>=1){
                player.removeGem("gold");
                $scope.gemCount["gold"] += 1;
            }
            player.resetGemChanges();
            $scope.resetSelectCard();
            var gameDeck = $scope.decks[deck];
            gameDeck.push(newCard);//put the new card on top of the game deck


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
        $scope.endYourTurnIfDemo();
        
    };
    
    $scope.giveBackGems = function(player, gems){
        if(!$scope.learningGame){
            return;
        }
        for(var i = 0; i < gems.length; i++){
            var color = gems[i];
            $scope.getPlayer(player).removeGem(color);
            $scope.gemCount[color] += 1;
        }
    }
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
        if($scope.learningGame) {
            return;
        }
        if($scope.joyRideStep == $scope.demoPauseSteps[0] && $scope.learningGame && deck == 'deck 1' && index == 0){
            $scope.selected_card_index = index;
            $scope.selected_deck = deck;
            $scope.selected_card = true;
            $scope.startJoyRide = true;
            return;
        }
        $scope.show_alert = false;
        $scope.selected_card_to_reserve = false; //enable it later
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
        if($scope.learningGame) {
            return;
        }
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

    $scope.getPlayerGemChange = function(playername, color){
        return $scope.players[playername].getChange(color)
    };

    $scope.showSelectGem = function(color){
        if($scope.learningGame) {
            return;
        }
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

                CardFactory.newCard("red"  , 2, {"black": 5, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),
                CardFactory.newCard("red"  , 3, {"black": 0, "white": 0, "red"  : 6, "blue" : 0, "green": 0}),
                CardFactory.newCard("red"  , 1, {"black": 3, "white": 2, "red"  : 2, "blue" : 0, "green": 0}),
                CardFactory.newCard("red"  , 2, {"black": 0, "white": 1, "red"  : 0, "blue" : 4, "green": 2}),
                CardFactory.newCard("red"  , 1, {"black": 3, "white": 0, "red"  : 2, "blue" : 3, "green": 0}),
                CardFactory.newCard("red"  , 2, {"black": 5, "white": 3, "red"  : 0, "blue" : 0, "green": 0}),

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
    };$scope.drawDeck = function(){
        $scope.board = {
            'deck 1': [$scope.decks['deck 1'].pop(), $scope.decks['deck 1'].pop(), $scope.decks['deck 1'].pop()],
            'deck 2': [$scope.decks['deck 2'].pop(), $scope.decks['deck 2'].pop(), $scope.decks['deck 2'].pop()],
            'deck 3': [$scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop(), $scope.decks['deck 3'].pop()]
        };
    };
    $scope.drawNobles = function(){
        $scope.board_nobles = [$scope.nobles.pop()];
        for(var i = 0; i < Object.keys($scope.players).length; i++){
            var noble = $scope.nobles.pop();
            noble.setOldLocation($scope.board_nobles.length);
            $scope.board_nobles.push(noble);
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
        $scope.learningGame = false;
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
        $scope.resetMessages();
        $scope.resetPlayers();
        $scope.resetCards();
        $scope.resetGems();
        $scope.demoLastRound = false;
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
    
    $scope.demoPauseSteps = [5,7,17];
    function buildJoyrideBoard(createdNodes){
        if(createdNodes){
            $scope.nobles = [
                NobleFactory.newNoble(3, {"black": 3, "white": 3, "red"  : 0, "blue" : 3, "green": 0}),
                NobleFactory.newNoble(3, {"black": 0, "white": 0, "red"  : 4, "blue" : 0, "green": 4}),
                NobleFactory.newNoble(3, {"black": 0, "white": 0, "red"  : 0, "blue" : 4, "green": 4}),
                NobleFactory.newNoble(3, {"black": 0, "white": 4, "red"  : 0, "blue" : 4, "green": 0})
            ];
            $scope.decks = {
                'deck 1': [
                    CardFactory.newCard("green", 0, {"black": 0, "white": 2, "red"  : 0, "blue" : 1, "green": 0}),
                    CardFactory.newCard("white", 0, {"black": 0, "white": 0, "red"  : 0, "blue" : 3, "green": 0}),
                    CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red"  : 2, "blue" : 0, "green": 0}),

                    CardFactory.newCard("white", 0, {"black": 2, "white": 0, "red"  : 0, "blue" : 2, "green": 0}),
                    CardFactory.newCard("white", 1, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 4}),
                    CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red"  : 1, "blue" : 1, "green": 2}),

                    CardFactory.newCard("white", 0, {"black": 1, "white": 3, "red"  : 0, "blue" : 1, "green": 0}),




                    CardFactory.newCard("blue" , 1, {"black": 0, "white": 0, "red"  : 4, "blue" : 0, "green": 0}),
                    CardFactory.newCard("green", 0, {"black": 1, "white": 1, "red"  : 1, "blue" : 1, "green": 0}),
                    CardFactory.newCard("black", 0, {"black": 1, "white": 0, "red"  : 3, "blue" : 0, "green": 1}),
                    CardFactory.newCard("green", 1, {"black": 4, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),
                    CardFactory.newCard("green", 0, {"black": 2, "white": 1, "red"  : 1, "blue" : 1, "green": 0}),
                    CardFactory.newCard("green", 0, {"black": 2, "white": 0, "red"  : 2, "blue" : 1, "green": 0}),


                    CardFactory.newCard("red"  , 0, {"black": 1, "white": 1, "red"  : 0, "blue" : 1, "green": 1}),


                    CardFactory.newCard("red"  , 0, {"black": 1, "white": 2, "red"  : 0, "blue" : 1, "green": 1}),
                    CardFactory.newCard("red"  , 0, {"black": 2, "white": 2, "red"  : 0, "blue" : 0, "green": 1}),

                    CardFactory.newCard("black", 0, {"black": 0, "white": 0, "red"  : 1, "blue" : 0, "green": 2}),
                    CardFactory.newCard("black", 0, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 3}),
                    CardFactory.newCard("black", 0, {"black": 0, "white": 1, "red"  : 1, "blue" : 1, "green": 1}),
                    CardFactory.newCard("black", 0, {"black": 0, "white": 2, "red"  : 0, "blue" : 0, "green": 2}),

                    CardFactory.newCard("black", 0, {"black": 0, "white": 1, "red"  : 1, "blue" : 2, "green": 1}),
                    CardFactory.newCard("black", 0, {"black": 0, "white": 2, "red"  : 1, "blue" : 2, "green": 0}),

                    CardFactory.newCard("green", 0, {"black": 0, "white": 0, "red"  : 3, "blue" : 0, "green": 0}),
                    CardFactory.newCard("green", 0, {"black": 0, "white": 0, "red"  : 2, "blue" : 2, "green": 0}),
                    CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red"  : 1, "blue" : 1, "green": 1}),
                    CardFactory.newCard("red"  , 0, {"black": 0, "white": 0, "red"  : 0, "blue" : 2, "green": 1})
                ],
                'deck 2': [
                    CardFactory.newCard("white", 2, {"black": 0, "white": 0, "red"  : 5, "blue" : 0, "green": 0}),
                    CardFactory.newCard("white", 3, {"black": 0, "white": 6, "red"  : 0, "blue" : 0, "green": 0}),
                    CardFactory.newCard("white", 1, {"black": 2, "white": 0, "red"  : 2, "blue" : 0, "green": 3}),
                    CardFactory.newCard("white", 2, {"black": 2, "white": 0, "red"  : 4, "blue" : 0, "green": 1}),
                    CardFactory.newCard("white", 1, {"black": 0, "white": 2, "red"  : 3, "blue" : 3, "green": 0}),


                    CardFactory.newCard("blue" , 2, {"black": 0, "white": 0, "red"  : 0, "blue" : 5, "green": 0}),

                    CardFactory.newCard("black", 2, {"black": 0, "white": 0, "red"  : 2, "blue" : 1, "green": 4}),
                    CardFactory.newCard("blue" , 2, {"black": 4, "white": 2, "red"  : 1, "blue" : 0, "green": 0}),
                    CardFactory.newCard("blue" , 1, {"black": 3, "white": 0, "red"  : 0, "blue" : 2, "green": 3}),
                    CardFactory.newCard("blue" , 2, {"black": 0, "white": 5, "red"  : 0, "blue" : 3, "green": 0}),

                    CardFactory.newCard("green", 2, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 5}),
                    CardFactory.newCard("green", 3, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 6}),
                    CardFactory.newCard("green", 1, {"black": 2, "white": 2, "red"  : 0, "blue" : 3, "green": 0}),
                    CardFactory.newCard("green", 2, {"black": 0, "white": 3, "red"  : 3, "blue" : 0, "green": 2}),
                    CardFactory.newCard("green", 1, {"black": 1, "white": 4, "red"  : 0, "blue" : 2, "green": 0}),
                    CardFactory.newCard("green", 2, {"black": 0, "white": 0, "red"  : 0, "blue" : 5, "green": 3}),

                    CardFactory.newCard("red"  , 2, {"black": 5, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),

                    CardFactory.newCard("red"  , 1, {"black": 3, "white": 2, "red"  : 2, "blue" : 0, "green": 0}),
                    CardFactory.newCard("red"  , 2, {"black": 0, "white": 1, "red"  : 0, "blue" : 4, "green": 2}),
                    CardFactory.newCard("red"  , 1, {"black": 3, "white": 0, "red"  : 2, "blue" : 3, "green": 0}),
                    CardFactory.newCard("red"  , 2, {"black": 5, "white": 3, "red"  : 0, "blue" : 0, "green": 0}),


                    CardFactory.newCard("black", 3, {"black": 6, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),


                    CardFactory.newCard("blue" , 1, {"black": 0, "white": 0, "red"  : 3, "blue" : 2, "green": 2}),
                    CardFactory.newCard("black", 1, {"black": 2, "white": 3, "red"  : 0, "blue" : 0, "green": 3}),
                    CardFactory.newCard("black", 2, {"black": 0, "white": 0, "red"  : 3, "blue" : 0, "green": 5})
                ],
                'deck 3': [

                    CardFactory.newCard("white", 5, {"black": 7, "white": 3, "red"  : 0, "blue" : 0, "green": 0}),
                    CardFactory.newCard("white", 4, {"black": 6, "white": 3, "red"  : 3, "blue" : 0, "green": 0}),
                    CardFactory.newCard("white", 3, {"black": 3, "white": 0, "red"  : 5, "blue" : 3, "green": 3}),

                    CardFactory.newCard("blue" , 4, {"black": 0, "white": 7, "red"  : 0, "blue" : 0, "green": 0}),
                    CardFactory.newCard("blue" , 5, {"black": 0, "white": 7, "red"  : 0, "blue" : 3, "green": 0}),
                    CardFactory.newCard("blue" , 4, {"black": 3, "white": 6, "red"  : 0, "blue" : 3, "green": 0}),
                    CardFactory.newCard("blue" , 3, {"black": 5, "white": 3, "red"  : 3, "blue" : 0, "green": 3}),

                    CardFactory.newCard("green", 4, {"black": 0, "white": 0, "red"  : 0, "blue" : 7, "green": 0}),
                    CardFactory.newCard("black", 3, {"black": 0, "white": 3, "red"  : 3, "blue" : 3, "green": 5}),
                    CardFactory.newCard("green", 4, {"black": 0, "white": 3, "red"  : 0, "blue" : 6, "green": 3}),
                    CardFactory.newCard("green", 3, {"black": 3, "white": 5, "red"  : 3, "blue" : 3, "green": 0}),

                    CardFactory.newCard("red"  , 4, {"black": 0, "white": 0, "red"  : 0, "blue" : 0, "green": 7}),
                    CardFactory.newCard("red"  , 5, {"black": 0, "white": 0, "red"  : 3, "blue" : 0, "green": 7}),
                    CardFactory.newCard("red"  , 4, {"black": 0, "white": 0, "red"  : 3, "blue" : 3, "green": 6}),
                    CardFactory.newCard("red"  , 3, {"black": 3, "white": 3, "red"  : 0, "blue" : 5, "green": 3}),


                    CardFactory.newCard("black", 4, {"black": 3, "white": 0, "red"  : 6, "blue" : 0, "green": 3}),
                    CardFactory.newCard("black", 4, {"black": 0, "white": 0, "red"  : 7, "blue" : 0, "green": 0}),

                    CardFactory.newCard("green", 5, {"black": 0, "white": 0, "red"  : 0, "blue" : 7, "green": 3}),
                    CardFactory.newCard("white", 4, {"black": 7, "white": 0, "red"  : 0, "blue" : 0, "green": 0}),

                ]
            };
            $scope.drawDeck();
            $scope.drawNobles();
        }else{
            $scope.nobles = [

            ];
            $scope.decks = {
                'deck 1': [
                ],
                'deck 2': [
                ],
                'deck 3': [
                ]
            };
                $scope.board = {
                };
                $scope.board_nobles = [];
        }
        
    };

    $scope.wait_count = 0;
    function waitForClick(createdNodes){
        $scope.joyRideStep = $scope.demoPauseSteps[$scope.wait_count];
        $scope.waiting = true;
        $scope.startJoyRide = false;
        $scope.wait_count += 1;
    };
    function giveJoyRideCardsGems(createdNodes){
        if(createdNodes) {
            var you = $scope.players['you'];
            you.addCard(CardFactory.newCard("black", 5, {"black": 3, "white": 0, "red": 7, "blue": 0, "green": 0}));
            you.addCard(CardFactory.newCard("black", 2, {"black": 0, "white": 5, "red": 0, "blue": 0, "green": 0}));
            you.addCard(CardFactory.newCard("blue", 0, {"black": 2, "white": 1, "red": 0, "blue": 0, "green": 0}));
            you.addCard(CardFactory.newCard("red", 0, {"black": 3, "white": 1, "red": 1, "blue": 0, "green": 0}));
            you.points = 7;
            $scope.selected_gems = ['green', 'blue', 'red', 'red', 'red', 'red', 'black', 'black', 'black'];
            $scope.takeGems('you');
            you.resetGemChanges();

            var alice = $scope.players['alice'];
            alice.addCard(CardFactory.newCard("white", 0, {"black": 1, "white": 0, "red": 0, "blue": 2, "green": 2}));
            alice.addCard(CardFactory.newCard("white", 2, {"black": 3, "white": 0, "red": 5, "blue": 0, "green": 0}));
            alice.addCard(CardFactory.newCard("black", 1, {"black": 0, "white": 0, "red": 0, "blue": 4, "green": 0}));
            alice.addCard(CardFactory.newCard("black", 1, {"black": 0, "white": 3, "red": 0, "blue": 2, "green": 2}));
            alice.addCard(CardFactory.newCard("blue", 0, {"black": 3, "white": 0, "red": 0, "blue": 0, "green": 0}));
            alice.addCard(CardFactory.newCard("blue", 0, {"black": 1, "white": 1, "red": 1, "blue": 0, "green": 1}));
            alice.addCard(CardFactory.newCard("blue", 3, {"black": 0, "white": 0, "red": 0, "blue": 6, "green": 0}));
            alice.points = 7;

            var bob = $scope.players['bob'];
            bob.addCard(CardFactory.newCard("blue", 0, {"black": 2, "white": 0, "red": 0, "blue": 0, "green": 2}));

            bob.addCard(CardFactory.newCard("blue", 0, {"black": 1, "white": 1, "red": 2, "blue": 0, "green": 1}));
            bob.addCard(CardFactory.newCard("blue", 0, {"black": 0, "white": 1, "red": 2, "blue": 0, "green": 2}));
            bob.addCard(CardFactory.newCard("blue", 0, {"black": 0, "white": 0, "red": 1, "blue": 1, "green": 3}));
            bob.addCard(CardFactory.newCard("green", 0, {"black": 0, "white": 1, "red": 0, "blue": 3, "green": 1}));
            bob.addCard(CardFactory.newCard("red", 3, {"black": 0, "white": 0, "red": 6, "blue": 0, "green": 0}));
            bob.addCard(CardFactory.newCard("red", 0, {"black": 0, "white": 2, "red": 2, "blue": 0, "green": 0}));
            bob.addCard(CardFactory.newCard("red", 0, {"black": 0, "white": 3, "red": 0, "blue": 0, "green": 0}));
            bob.addCard(CardFactory.newCard("red", 1, {"black": 0, "white": 4, "red": 0, "blue": 0, "green": 0}));
            bob.points = 4;
        }else{
            $scope.resetPlayers();
            $scope.resetGems();
        }

    };

    function aliceTurn1(addedNodes){
        if(addedNodes){
            $scope.players['you'].resetGemChanges();
            $scope.selected_gems=['green', 'red', 'white']; //takes 2 greens
            $scope.takeGems('alice'); //takes green, red, white
        }else{
            $scope.giveBackGems('alice', ['green', 'red', 'white']);
            $scope.players['alice'].resetGemChanges();
            $scope.players['you'].unResetGemChanges();
            $scope.$apply();
        }
        
    };
    function aliceTurn2(addedNodes){
        if(addedNodes){
            $scope.players['you'].resetGemChanges();
            $scope.buyCard('alice', 'deck 1', 1); //white ->needs black red blue green but she has black and blue
            $scope.$apply();
        }else{
            $scope.players['alice'].resetGemChanges();
            $scope.players['you'].unResetGemChanges();
            $scope.unBuyLastCard('alice', 'deck 1', 1);
            $scope.$apply();
        }
        
    };
    function aliceTurn3(addedNodes){
        if(addedNodes){
            $scope.players['you'].resetGemChanges();
            $scope.selected_gems=['green', 'green']; //takes 2 greens
            $scope.takeGems('alice');
            $scope.$apply();
        }else{
            $scope.players['alice'].resetGemChanges();
            $scope.players['you'].unResetGemChanges();
            $scope.giveBackGems('alice', ['green', 'green']);
            $scope.$apply();
        }
    };
    function aliceTurn4(addedNodes){
        if(addedNodes){
            $scope.players['you'].resetGemChanges();
            $scope.reserveCard('alice', 'deck 2', 1);
            $scope.$apply();
        }else{
            $scope.players['alice'].resetGemChanges();
            $scope.players['you'].unResetGemChanges();
            $scope.unReserveLastCard('alice', 'deck 2', 1);
            $scope.$apply();
        }
        
    };
    function aliceTurn5(addedNodes){
        if(addedNodes){
            $scope.players['you'].resetGemChanges();
            $scope.buyCard('alice', 'reserved', 0) //need 2 black 3 green 3 white -> gets 3 black 3 blue 3 white
            $scope.$apply();
        }else{
            $scope.players['alice'].resetGemChanges();
            $scope.players['you'].unResetGemChanges();
            $scope.unBuyLastCard('alice', 'reserved', 0);
            $scope.$apply();
        }
    };
    function bobTurn1(addedNodes){
        if(addedNodes){
            $scope.players['alice'].resetGemChanges();
            $scope.selected_gems=['blue', 'blue']; //takes 2 blues
            $scope.takeGems('bob');
        }else{
            $scope.giveBackGems('bob', ['blue', 'blue']);
            $scope.players['bob'].resetGemChanges();
            $scope.players['alice'].unResetGemChanges();
            $scope.$apply(); 
        }
        
    };
    function bobTurn2(addedNodes){
        if(addedNodes){
            $scope.players['alice'].resetGemChanges();
            $scope.buyCard('bob', 'deck 1', 2) //green: needs 2 red 2 blue, he has 4 blue buildings and 1 green buildings already (and 3 red buildings...) so he has 2 blue gems lol.
            $scope.$apply();
        }else{
            $scope.players['bob'].resetGemChanges();
            $scope.players['alice'].unResetGemChanges();
            $scope.unBuyLastCard('bob', 'deck 1', 2);
            $scope.$apply();
        }
    };
    function bobTurn3(addedNodes){
        if(addedNodes){
            $scope.players['alice'].resetGemChanges();
            $scope.buyCard('bob', 'deck 1', 0)//green - should be needing 3 reds but he has it lol. he now has 4 blue 2 green 4 red
            $scope.$apply();
        }else{
            $scope.players['bob'].resetGemChanges();
            $scope.players['alice'].unResetGemChanges();
            $scope.unBuyLastCard('bob', 'deck 1', 0);
            $scope.$apply();
        }
    };
    function bobTurn4(addedNodes){
        if(addedNodes){
            $scope.players['alice'].resetGemChanges();
            $scope.buyCard('bob', 'deck 2', 2) //blue: needs 3 red 2 blue 2 green, he has 4 blue buildings and 3 green buildings already (and 4 red buildings...) so he has 2 blue gems lol.
            $scope.$apply();
        }else{
            $scope.players['bob'].resetGemChanges();
            $scope.players['alice'].unResetGemChanges();
            $scope.unBuyLastCard('bob', 'deck 2', 2);
            $scope.$apply();
        }
    };
    function bobTurn5(addedNodes){
        if(addedNodes){
            $scope.players['alice'].resetGemChanges();
            $scope.buyCard('bob', 'deck 3', 1) //green: needs 7 blue 3 green, he has 5 blue buildings and 3 green buildings already (and 4 red buildings...) so he has 2 blue gems lol.
            $scope.$apply();
        }else{
            $scope.players['bob'].resetGemChanges();
            $scope.players['alice'].unResetGemChanges();
            $scope.unBuyLastCard('bob', 'deck 3', 1);
            $scope.$apply();
        }
        
    };
    function yourTurn1(addedNodes){
        if(addedNodes){
            $scope.players['bob'].resetGemChanges();
            $scope.buyCard('you', 'deck 1', 0);
            $scope.$apply();
        }else{
            $scope.players['you'].resetGemChanges();
            $scope.players['bob'].unResetGemChanges();
            $scope.unBuyLastCard('you', 'deck 1', 0);
            $scope.$apply();
        }
        
    };
    function yourTurn2(addedNodes){
        if(addedNodes){
            $scope.players['bob'].resetGemChanges();
            $scope.reserveCard('you', 'deck 3', 2);
            $scope.$apply();
        }else{
            $scope.players['you'].resetGemChanges();
            $scope.players['bob'].unResetGemChanges();
            $scope.unReserveLastCard('you', 'deck 3', 2);
            $scope.$apply();
        }
        
    };
    function yourTurn3(addedNodes){
        if(addedNodes){
            $scope.players['bob'].resetGemChanges();
            $scope.buyCard('you', 'reserved', 0);
            $scope.$apply();
        }else{
            $scope.players['you'].resetGemChanges();
            $scope.players['bob'].unResetGemChanges();
            $scope.unBuyLastCard('you', 'reserved', 0);
            $scope.$apply();
        }
    };
    function yourTurn4(addedNodes){
        if(addedNodes){
            $scope.players['bob'].resetGemChanges();
            $scope.reserveCard('you', 'deck 3', 0);
            $scope.$apply();
        }else{
            $scope.players['you'].resetGemChanges();
            $scope.players['bob'].unResetGemChanges();
            $scope.unReserveLastCard('you', 'deck 3', 0);
            $scope.$apply();
        }
        
    };
    function yourTurn5(addedNodes){
        if(addedNodes){
            $scope.players['bob'].resetGemChanges();
            $scope.buyCard('you', 'reserved', 0)
            $scope.$apply();
        }else{
            $scope.players['you'].resetGemChanges();
            $scope.players['bob'].unResetGemChanges();
            $scope.unBuyLastCard('you', 'reserved', 0);
            $scope.$apply();
        }
        
    };
    

    function endTutorial(){
        $scope.resetPlayers();
        $scope.learningGame = false;
        $scope.demoStarted = false;
    }
    $scope.config = [

        {
            type: "title",
            heading: "Welcome to Splendor",
            text: 'This is a game about building the greatest gem factory, where the winner will be the player with the most points.'

        },{
            type: "function",
            fn: buildJoyrideBoard //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".board-cards",
            heading: "The Board",
            text: "This is the game layout: there are three levels of three possible gem cards to build, each with differing costs. You will learn the importance of these cards later.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: "#nobles-cards",
            heading: "The Board",
            text: "There are also some noble cards which can give you bonus points.  You will learn how to get them later. There are n+1 noble cards, where n is the number of players in the game. In this tutorial, there are 3 players, so 4 noble cards.",
            placement: "left",
            scrollPadding: 250,
            scroll: true
        },
        {
            type: "function",
            fn: giveJoyRideCardsGems //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".you-scoreboard",
            heading: "The Board",
            text: "Normally in a real game you will start off with 0 gems and 0 cards, but for this tutorial, we will give you some gems and some cards already. The number of gems and cards each player has are public information.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-black-0",
            heading: "The Board",
            text: "Because you own this card, you have 5 points,... ",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-black-1",
            heading: "The Board",
            text: "...and this card gives you 2 more points for a total of 7.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".deck-1-0",
            heading: "The Board",
            text: "On your turn you can buy cards if you can afford them.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".deck-1-0 > .bottom > .costs",
            heading: "The Board",
            text: "The cost of this card is 2 blue gems and 1 green gem.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-green-gem-count",
            heading: "The Board",
            text: "You have 1 green gem...",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-blue-gem-count",
            heading: "The Board",
            text: "and one blue gem...",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-blue-building-count",
            heading: "The Board",
            text: "but because you have one blue card, the cost is reduced by 1 (the blue card 'generates' a blue gem).",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".deck-1-0",
            heading: "The Board",
            text: "Now you will buy this card! There are always three cards of each level available (regardless of number of players), unless that level has run out of cards.",
            placement: "left"
        },
        {
            type: "function",
            fn: yourTurn1 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".you-scoreboard",
            heading: "The Board",
            text: "By buying the card, you pay the gems back to the game.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".gems",
            heading: "The Board",
            text: "This is the gem pool, and it shows how many of each gem are available. If there are 2 players, there are initially 4 gems of each color, if 3 players, 5,a nd if 4 players, 7. You can select gems (except for gold, which will be explained later) from here.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".deck-1-0",
            heading: "The Board",
            text: "Cards are replaced when bought. Your turn is now over. It is now Alice's turn.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: aliceTurn1 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".alice-scoreboard",
            heading: "The Board",
            text: "On Alice's turn, she took 3 gems of different colors.",
            placement: "bottom",
            scrollPadding: 250,
            scroll: true
        },
        {
             type: "element",
             selector: ".alice-total-gem-count",
             heading: "The Board",
             text: "Be careful though, you can only have 10 gems max at the end of your turn. It is now Bob's turn.",
             placement: "left",
            scrollPadding: 250,
             scroll: true
         },
        {
            type: "function",
            fn: bobTurn1 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".bob-scoreboard",
            heading: "The Board",
            text: "On Bob's turn, he took 2 blue gems. This is another action you can do, but only if there are at least 4 gems of that color available",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".gems",
            heading: "The Board",
            text: "Again, if there are at least 4 gems available, you can take 2 of that color.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".deck-3-2",
            heading: "The Board",
            text: "This card provides a good number of points, but you cannot afford it yet. Instead you will reserve it. This is the final action that you can do on your turn.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: yourTurn2 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: "#you > .image-and-stats > .reserved-cards",
            heading: "The Board",
            text: "When you reserve a card, only you can build it, but only on a future turn. You can only reserve 3 cards max.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".deck-3-2",
            heading: "The Board",
            text: "Once a card is reserved, it is removed from the board (because you take it and set it aside near you) and replaced.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-gold-count",
            heading: "The Board",
            text: "You also receive a gold gem every time you reserve a card (if available). This is the only way to get a gold gem. Gold gems can be used as a wild card gem and be used as any color. It is now Alice's turn.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: aliceTurn2 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".alice-white-2",
            heading: "The Board",
            text: "Alice built this card, paying one red gem and one green gem. She did not have to pay a black or a blue gem because she has more than one of those cards.",
            placement: "left",
            scrollPadding: 250,
            scroll: true
        },
        {
            type: "function",
            fn: bobTurn2 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".bob-green-1",
            heading: "The Board",
            text: "Bob built this card.  This card cost Bob no gems because he already owned 2 blue cards and 2 red cards.",
            placement: "right",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-reserved-0",
            heading: "The Board",
            text: "Now you can build this card! Once you build it, it is no longer 'reserved' and does not count to your reserved card limit of 3 cards.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: yourTurn3 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".you-black-2 > .bottom > .costs",
            heading: "The Board",
            text: "This card cost 7 red gems. ",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-red-gem-count",
            heading: "The Board",
            text: "You paid only 4 red gems though, because you already owned two red cards. That gives a total of 6.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-gold-count",
            heading: "The Board",
            text: "The last red gem was paid for by your gold gem. Remember, gold gems can be used as a wildcard for any color gem.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-point-count",
            heading: "The Board",
            text: "Now you have 11 points! When someone gets 15 points, that round is the last round. The order continues, but ends when it comes back to the starting player. So be careful! You are the starting player in this game.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: aliceTurn3 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".alice-green-deck",
            heading: "The Board",
            text: "Alice took 2 green gems (Remember this can only be done if there are at least 4 gems prior to taking two gems).",
            placement: "right",
            scrollPadding: 250,
            scroll: true
        },
        {
            type: "function",
            fn: bobTurn3 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".bob-green-2",
            heading: "The Board",
            text: "Bob built this green card (again it cost no gems).",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".deck-3-0",
            heading: "The Board",
            text: "You will reserve this card.  It will give 4 points, bringing you to 15 total! Also, it costs 7 black gems, and you already have 3 black gems and 3 black cards.  By reserving you get a gold gem, meaning you will be able to build it your next turn.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: yourTurn4 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "function",
            fn: aliceTurn4 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: "#alice > .image-and-stats > .reserved-count",
            heading: "The Board",
            text: "Alice reserved a card. Reserved cards are the only private information - you cannot see which cards other players have reserved.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: bobTurn4 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".bob-blue-4",
            heading: "The Board",
            text: "Bob built ANOTHER blue card (free once again).",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".you-reserved-0",
            heading: "The Board",
            text: "Now you will build this card! It will get you to 15 points.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: yourTurn5 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".you-point-count",
            heading: "The Board",
            text: "Because you have 15 points, this is the last round. Because you are the starting player, Alice and Bob get to have one last turn.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: aliceTurn5 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".alice-black-2",
            heading: "The Board",
            text: "Alice builds this card.",
            placement: "left",
            scrollPadding: 250,
            scroll: true
        },
        {
            type: "element",
            selector: ".alice-scoreboard",
            heading: "The Board",
            text: "Because she has 3 black and 3 blue and 3 white cards...",
            placement: "left",
            scrollPadding: 250,
            scroll: true
        },
        {
            type: "element",
            selector: "#noble-3-3-3-0-3-0",
            heading: "The Board",
            text: "...she gets this noble card!  Why?",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: "#noble-3-3-3-0-3-0 > .bottom > .requirements",
            heading: "The Board",
            text: "The 'cost' on this noble card indicates the number of colored cards you have to have built in order to get the noble. The requirements for this noble is 3 black cards, 3 blue cards, and 3 white cards, which Alice has after building that last card. Therefore she received the noble.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: "#noble-3-3-3-0-3-0 ",
            heading: "The Board",
            text: "Getting the noble is automatic and does not cost a turn. You cannot reject the noble.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".alice-point-count",
            heading: "The Board",
            text: "This gives her more points! Unfortunately, she did not beat you.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: "#nobles",
            heading: "The Board",
            text: "Nobles  are not replaced when taken. There are now only 3 nobles left.",
            scrollPadding: 250,
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: bobTurn5 //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".bob-green-3",
            heading: "The Board",
            text: "Bob builds this card (using only two blue gems)...",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: "#noble-3-0-0-0-4-4",
            heading: "The Board",
            text: "...which gives him this noble (since he now has 4 blue cards and 4 green cards)...",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: "#noble-3-0-0-4-0-4",
            heading: "The Board",
            text: "...AND this noble (because he ALSO has 4 green cards and 4 red cards)!",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".first-player",
            heading: "The Board",
            text: "Since you are the next player, and you are the starting player, the game is over.  Remember, the game ends after the round where someone reaches 15 points.  Because you started the round and you reached 15 points, you cannot go again.",
            placement: "left",
            scroll: true
        },
        {
            type: "element",
            selector: ".bob-point-count",
            heading: "The Board",
            text: "Even though you have 15 points, Bob wins because he has 16 points.",
            placement: "left",
            scroll: true
        },
        {
            type: "function",
            fn: endTutorial //(can also be a string, which will be evaluated on the scope)
        },
        {
            type: "element",
            selector: ".demo-button",
            heading: "The Board",
            text: "That's it! Play a demo if you need practice. The bots are pretty bad, so you should win if you understand the game.",
            scrollPadding: 250,
            placement: "bottom",
            scroll: true
        },

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
        this.oldLocation = -1;
        
        this.setOldLocation = function(i){
            this.oldLocation = i;
        }
    }

    return {
        newNoble: function(points, requirements) {
            return new Noble(points, requirements);
        }
    };
}).factory('PlayerFactory', function() {
    function Player(name, deck, gems) {
        this.name = name;
        this.noblesAdded = [];
        this.cardsBuilt = [];
        this.cardCosts = [];
        this.reservedCardsOrder = [];
        
        this.getOldCost = function(){
            return this.cardCosts[this.cardCosts.length-1];
        };
        
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
                this.gemChange[c] -= amt_repaid[c];

            }
            this.points += card.points;
            this.gems["gold"] -= gold_needed;
            this.gemChange["gold"] =- gold_needed;
            this.deck[card.color].push(card);
            amt_repaid["gold"] = gold_needed;
            this.cardCosts.push(amt_repaid);
            this.cardsBuilt.push(card);
            return amt_repaid;
        };

        this.unBuyLastCard = function(){
            var lastCard = this.cardsBuilt.pop();
            this.deck[lastCard.color].pop();
            this.points -= lastCard.points;
            var last_costs = this.cardCosts.pop();
            for(var c in last_costs){
                this.gems[c] += last_costs[c];
            }
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
        this.addNobles = function(nobles){
            for(var i = 0; i < nobles.length; i++){
                var noble = nobles[i];
                this.nobles.push(noble);
                this.points += noble.points;
            }
            this.noblesAdded.push(nobles); //can be empty lol.
        };
        this.popLastNobles = function(){
            var last_nobles = this.noblesAdded.pop();
            for(var i = 0; i < last_nobles.length; i++){
                var noble = last_nobles[i];
                for(var j = 0; j < this.nobles.length; j++){
                    if(this.nobles[j].id == noble.id){
                        this.nobles.splice(j,1);
                        this.points -= noble.points;
                        break;
                    }
                }
            }
            return last_nobles;
        };
        this.getLastNobles = function(){
            return this.noblesAdded[this.noblesAdded.length-1];
        };
        this.addGem = function(color){
            this.gems[color] += 1;
            this.gemChange[color] += 1;
        };

        this.nextPlayer = null;
        
        this.setNextPlayer = function(player){
            this.nextPlayer = player;
        };
        
        this.unResetGemChanges = function(){
            this.gemChange = this.oldGemChange;
        };
        
        this.setStartingPlayer = function(){
            this.firstPlayer = true;
        };

        this.setPriorPlayer = function(player){
            this.priorPlayer = player;
        };
        
        this.getGemCount = function(color){
            return this.gems[color];
        };

        this.getBuildingCount = function(color){
            return this.deck[color].length;
        };
        
        this.reserveCard = function(card){
            
            this.lastReservedCard = card;
            if(this.getReservedCards().length < 3){
                this.reservedCards.push(card);
                this.reservedCardsOrder.push(card);
            }
        };

        this.unReserveLastCard = function(){
            var lastReservedCard = this.reservedCardsOrder.pop();
            for(var i = 0; i < this.reservedCards.length; i++){
                if(this.reservedCards[i].id == lastReservedCard.id){
                    this.reservedCards.splice(i, 1);
                }
            }
        };
        
        this.getReservedCards = function(){
            return this.reservedCards;
        };

        this.getPoints = function(){
            return this.points;
        };
        
        this.getLastReservedCard = function(){
            return this.reservedCardsOrder[this.reservedCardsOrder.length-1];
        };
        this.popLastBoughtCard = function(){
            return this.cardsBuilt.pop();
        };
        this.getLastBoughtCard = function(){
            return this.cardsBuilt[this.cardsBuilt.length-1];
        };

        
        this.gemCount = function(){
            var total = 0;
            for(var g in this.gems){
                total += this.getGemCount(g);
            }
            return total;
        };
        
        this.getChange = function(color){
            return this.gemChange[color];
        };

        this.resetGemChanges = function(){
            this.oldGemChange = this.gemChange;
            this.gemChange = { //TODO: refer to factory colors instead of manually
                "black": 0,
                "white": 0,
                "red": 0,
                "blue": 0,
                "green": 0,
                "gold": 0
            };
        };
        
        this.removeGem = function(color){
            this.gems[color] -= 1;
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
            this.gemChange = { //TODO: refer to factory colors instead of manually
                "black": 0,
                "white": 0,
                "red": 0,
                "blue": 0,
                "green": 0,
                "gold": 0
            };
            this.oldGemChange = { //TODO: refer to factory colors instead of manually
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