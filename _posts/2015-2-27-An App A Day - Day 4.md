---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 4
---

So I didn't think Derek Banas' Tutorials 6, 7 and 8 were that helpful in learning new things, but I shall try to adapt.  This app will have a `GridLayout` on the top with 5 names, and then a `Button` that says `Show Info` as well as a `Spinner` that lets you change your role.  For anyone that knows `Resistance` this should be very familiar.

-------------
######Mockup
So I made the following in a new app, just to show a prototypical mockup of what the app will have.  The button next to the spinner is not visible because that's just the way it is.
![](http://i.imgur.com/0aXENYp.png)

And here is the simple UML diagram.
![](http://i.imgur.com/u7NofOA.png)

-------------
######Creating the Model
So first I create two new `Classes`: `Model,` `Role` and `Player`.  The `Model` class will have an array of `Players` and will assign `Roles` to each `Player`.  The `Player` class will have a `name`, a `Role`, and a `playerID`.  The `Role` class will have a `roleName` variable and a `knowledge` variable that depends on the `Role`.  The `Model` is in charge of putting the `knowledge` variable into the `Role`.

The `Roles` are as follows:

|   Role             |   Knowledge  |
|--------------------|-----------|
|   Merlin           |   Knows Reds except Mordred|
|   Reds             |   Knows Reds|
|   Mordred [Red]    |   Knows Reds|
|   Morgana [Red]    |   Knows Reds
|   Assassin [Red]   |   Knows Reds|
|   Percival         |   Sees Merlin and Morgana|

All `Roles` will be in use.  The `knowledge` will be an inner class that has two variables: `Info` and `Relevant Players`. `Info` will be a `String` that says something like `You are 'X'! The Reds are 'Y'.`  `Relevant Players` will be an `ArrayList` of `playerIDs`.  The `playerIDs` will be used to highlight the `playerNames` in red.

-------------
######Creating the Spinner
So like the tutorial, I made an external array of roles.  I also made an Alert Dialog to show the data since I tried to used a Toast, but it wouldn't allow callbacks (making the names transparent after the Toast is over), or at least I couldn't find the solution.

<iframe width="420" height="315" src="https://www.youtube.com/embed/IEDjZO4ogBA" frameborder="0" allowfullscreen></iframe>
Source: [My Github](https://github.com/ll2585/app_a_day.day_3)

Tutorials used (not really today):
[Derek Banas' "How to Make Android Apps 6 : Fix Android Studio Errors"](https://www.youtube.com/watch?v=q9jBrwEpr6g)  
[Derek Banas' "How to Make Android Apps 7 : Android Spinners and Layouts"](https://www.youtube.com/watch?v=OY8dRInKaqY)
[Derek Banas' "How to Make Android Apps 8 : Make An Android App"](https://www.youtube.com/watch?v=Mjjuk3Fac84)  
[Auto Close Dialog After Time](https://xjaphx.wordpress.com/2011/07/13/auto-close-dialog-after-a-specific-time/)