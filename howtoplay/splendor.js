angular.module('SplendorCtrl', []).controller('SplendorCtrl', ['$scope', function($scope) {
    
    $scope.game = "SPLENDOR"
    
    //step 1: the point of this game is to have the most points, and the game ends once someone reaches 15 points
    //step 2: right now you have 3 points because you own this card
    //step 3: on your turn you can do 3 actions. one action is to buy a card. 
    //step 4: this card costs gems. this is your gem pool. but you do not have the required gems.
    //step 5: another action you can do on your turn is to take three gems of different colors. click red black and white to take those gems.
    //step 6: alice took these gems.
    //step 7: bob bought this card and returned these gems. it is now your turn.
    //step 8: another action you can do on your turn is to take two gems of the same color. click red red to take those gems. you can only do this if there are at least 4 gems of that color available.
    //step 9: alice took these gems.
    //step 10: bob bought this card and returned these gems. it is now your turn.
    //step 11: finally you can buy this card! when you buy a card, you return the gems to the pool.
    //step 12: [alice, bob]
    //step 13: you can also buy this card! your cards count as a permanent gem to that color, which you can use to purchase more cards with
    //step 14: [alice, bob] the last action you can take is to reserve a card. reserve this card. reserving a card grants you a free gold token
    //step 15: [alice, bob] now buy this card. because you have (these cards) you automatically get this noble! now you have. alice and bob have one last turn, and then whoever has the most points wins!
    
    
}]);