---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 9
---
The tutorial for today was SQLite (which is easy) and so I watched one more about Content Providers.  But because I have other projects I want to work on (hello March madness) I will implement the Content Provider tomorrow.  Still going to keep this super simple.  

This app will really be two apps - one that kind of mimics Day 8, except reading from a DB instead of downloading words, and one that lets the User add `Words` to that database.

Let's do the 'add words' app today and the other one tomorrow:

-------------
######Mockup
Day 8 was Korean and Definitions, but this time it will be generic `Word` and `Definition`.
So the table is (simply):
`Words`:
<table>
<thead>
<tr>
<th>Column</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>ID</td>
<td>integer</td>
</tr>
<tr>
<td>Word</td>
<td>text</td>
</tr>
<tr>
<td>Definition</td>
<td>text</td>
</tbody>
</table>

In the app, it should look like: a `TextView` alerting no table and db if no table and db, and a `Button` allowing the user to create the table and db. Upon creation, the button will let the user delete the table and db.
There will be an `EditText` allowing the user to type in an item for the word and the definition
Finally there will be a button to insert the word. No checking so far if the word exists already.
It will also display all the words in the database.
![](http://i.imgur.com/n5zqyS6.png)

-------------
######Modeling
First make the SQL table create if it doesn't exist. The rest is actually pretty easy...

<iframe width="420" height="315" src="https://www.youtube.com/embed/z38dwJeUT_0" frameborder="0" allowfullscreen></iframe>

Source: [My Github](https://github.com/ll2585/app_a_day.day_9_words) (ignore Day 9 Prices - I tried to make another version but it was too complicated to finish in a day, I just settled for this simple version.)

Tutorials used:
[Derek Banas' "How to Make Android Apps 20"](https://www.youtube.com/watch?v=WLoy_rz12SM&)  