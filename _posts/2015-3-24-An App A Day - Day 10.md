---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 10
---

Or should I say Day 25...since I haven't done this app a day in about two weeks. In my defense, I was working hard on my March Madness website (located at tinyurl.com/lukesmarchmadness but you need to log in) which was pretty comprehensive.  Since the tournament has begun already, it's time to get back on the wagon.

I was also too ambitious last time, trying to incorporate too many things in one app.  So today I will just do one simple task, and slowly work my way back up.  My ultimate goal is to create a board game app, but we will get there hopefully.

So last time I talked about content providers talking to SQL databases that were created in other apps.  This time I will actually implement it.

-------------
######Mockup
So this will be like the flashcard app I made back in Day 8, but using the database in Day 9. First we have to update the Day 9 app to allow for Content Providers.

1) Create a new class called WordContentProvider and extend Content Provider; also implement all methods.
2) In Day 9 app, change the insert to the Content Provider insertion.

(note: this tutorial was kind of confusing, so I just copied and pasted most of it)

So it's pretty simple actually, right now the Day 10 app just lets you see the items that are in the database.
