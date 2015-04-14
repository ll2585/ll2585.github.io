---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 6
---
So today I wrote something that has nothing to do with the `resistance` app that I plan to eventually create, but some of the practices I use will definitely be used.  The reason is, I didn't want to spend too much time on the web server part - this time I will incorporate reading/writing `JSON` and `XML` to a web server.  I much prefer `JSON`, and, actually the resistance webserver uses `JSON` but I didn't want to spend the time to figure out how it passes it (yet, at least. Maybe after these 25 days I will).

SO today's app will be a simple population generator.  I will have a list of random first and last names for both guys and girls, and the web server will randomly generate a number of people that the user selects.  It will then randomly give them date of births and possibly spouses and possibly kill off some of the people.

The app will display these in a tabbed interface, with 5 options: `All`, `Men`, `Women`, `Married`, and `Living`.  In the `Married` tab, clicking on a person will jump to their spouse.

------
######Web Server
So I kind of glossed over this. It looks like this and is run from my node server that runs this blog.

```javascript
var o2x = require('object-to-xml');
var fs = require('fs');
var male_names = fs.readFileSync('male_names.txt').toString().split("\n");
var female_names = fs.readFileSync('female_names.txt').toString().split("\n");
var last_names = fs.readFileSync('last_names.txt').toString().split("\n");
var age_stats = [Array of statistics of population]

exports.getXML = function(req, res){
    var num_people = req.param("num");
    var death_prob = req.param("death");
    var marriage_prob = req.param("marry");
    res.set('Content-Type', 'text/xml');
    var people = make_people(num_people, death_prob, marriage_prob);
    res.send(o2x({
        '?xml version="1.0" encoding="utf-8"?' : null,
        people: {
            person: people
        }
    }));
};
function make_people(num_people, death_prob, marriage_prob){
    var people = [];
    for(var i = 0; i < num_people; i++){
        var new_person = {};
        new_person['id'] = i;
        var random_seed = Math.random();
        for(var j = 0; j< age_stats.length; j++){
            if(random_seed >= age_stats[j]['low_percentage'] && random_seed < age_stats[j]['high_percentage']){
                new_person['gender'] = age_stats[j]['gender'];
                if(new_person['gender'] == "M") {
                    new_person['name'] = male_names[Math.floor(Math.random() * male_names.length)].trim();
                }else {
                    new_person['name'] = female_names[Math.floor(Math.random() * female_names.length)].trim();
                }
                var low_age = age_stats[j]['low_age'];
                var high_age = age_stats[j]['high_age'];
                new_person['age'] = Math.floor(Math.random() * (high_age - low_age + 1)) + low_age;
            }
        }
        new_person['name'] += ' ' + last_names[Math.floor(Math.random()*last_names.length)].trim();
        if(Math.random() < death_prob){
            new_person['dead'] = true;
        }
        if(new_person['age'] > 18 && Math.random() < marriage_prob){
            new_person['married'] = true;
        }
        people.push(new_person);
    }
    for(var i = 0; i < people.length; i++){
        var person = people[i];
        if(person['age'] > 18 && Math.random() < marriage_prob){
            var spouse = find_spouse(person, people);
            if(spouse !== null) {
                spouse['married'] = true;
                person['married'] = true;
                person['spouse'] = spouse['id'];
                spouse['spouse'] = person['id'];
            }
        }
    }
    return people;
}
exports.getJSON = function(req, res) {
    var num_people = req.param("num");
    var death_prob = req.param("death");
    var marriage_prob = req.param("marry");

    res.json({'people': make_people(num_people, death_prob, marriage_prob)});
};

function find_spouse(person, people) {
    var lower_limit = Math.max(18, person['age']/2+7);
    var upper_limit = 2*(person['age']-7);
    for(var i = 0; i < people.length; i++){
        var potential_spouse = people[i];
        if(potential_spouse['gender'] != person['gender'] && potential_spouse['age'] >= lower_limit && potential_spouse['age'] <= upper_limit && !potential_spouse['married']){
            return potential_spouse;
        }
    }
    return null;
}
```

where `age_stats` is a large array of statistics (each entry has `low_percentage`, `high_percentage`, `low_age`, `high_age`, and `gender`) used to generate a distribution of people.

------
######The App
So in the app, to access the internet, we have to update the `AndroidManifest.xml`; `<uses-permission android:name="android.permission.INTERNET"></uses-permission>`

And then we need to make the actual app. Note: I actually didn't finish this in a day, because it was SO ANNOYING to make these `FragmentTabHost` and I spent a good 3+ hours looking up what they were.  This is what happens when I don't follow a tutorial..but I did end up having it work. The trick was to have `getSupportFragmentManager().executePendingTransactions();` on `setOnTabChangedListener` because otherwise the `curTab` would still be the old tab....

Anyways the app also has a custom `ArrayAdapter` consisting of a custom class, `Person` which implements `Parcelable` (which was pretty simple to figure out how to do, unlike the tabs...), which then adds a gravestone if the person is deceased.

So AGAIN I didn't put in a theme, and there are a couple of bugs/things I wanted to implement but didn't have the time to do it (in a day) so I'm just going to leave them off.  For example, the tab names aren't sized, and the rings (for married people) are cut off, and I wanted to make it so when the user clicked on a person in the married tab, it would jump to their spouse, but oh well.  And there are some people in the `married` tab that aren't married...

I also didn't implement the XML parser (it works on the server, but I didn't parse it out yet)

Also, I forgot to make the `Person` `getName` method add their age. Oh well onto tomorrow.

[on a side note, my cable is very annoying - it keeps connecting and disconnecting, making the success of debugging and recording videos very luck-based.]

<iframe width="420" height="315" src="https://www.youtube.com/embed/V2dGoyTAov4" frameborder="0" allowfullscreen></iframe>
Source: [My Github](https://github.com/ll2585/app_a_day.day_6)

Tutorials used:
[Derek Banas' "How to Make Android Apps 16"](https://www.youtube.com/watch?v=ympxfKM4Uec)  
[This FragmentTabHost tutorial](https://maxalley.wordpress.com/2013/05/18/android-creating-a-tab-layout-with-fragmenttabhost-and-fragments/)  
[This Parcelable Example](http://www.perfectapk.com/android-parcelable.html)  