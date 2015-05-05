---
layout: post
tags: [coding, app-a-day, android]
title: Unit Testing in Java - Learn With Me Part 3
---

I kind of left off the last time at an impasse since I didn't know what to do...My goal was to make this Flashcard App for Android and I wanted to do it using TDD, but I had to learn testing in Java, so I made another side project in Java to do that and...everything got all convoluted.

Today I deleted that side project in java and moved it to the Android app, since I can do the pure JUnit testing there anyways. The goal was also to use mock objects, and I tried to implement them in the side project via gradle, but then I thought, wait this is the same thing in Android so I'll just move it all there.

Anyways, so I tried to make a Presenter Mock test, which failed since there was no Presenter Class. So I made that, and I realized that I don't need a Flashcard Interface, I would just use the Deck that I made. (sorry right now I am rambling, once everything is fully done I will make it sound more coherent).

And then I realized I don't even need to mock it lol, at least not yet..