angular.module('NoThanksCtrl', []).controller('NoThanksCtrl', ['$scope', 'CardFactory', 'PlayerFactory', 'GameFactory', function($scope, CardFactory, PlayerFactory, NobleFactory, GameFactory) {

}]).factory('PlayerFactory', function() {
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