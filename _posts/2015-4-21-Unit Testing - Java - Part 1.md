---
layout: post
tags: [coding, app-a-day, android]
title: Unit Testing in Java - Learn With Me Part 1
---

One of the ideas I have is to build an app that allows you to use "flash cards" on your Android phone. I actually made a version of this a couple of years ago, but it needs serious updating, and since I made it in Eclipse, I decided to do it in Android Studio.

The problem is, I am really bad at unit testing. I know all about TDD and I do believe it is very useful, but I have never actually built a project using it. Until today. (Also, Android takes forever to load even on device so it's unwieldy)..


So I spent maybe 5+ hours looking up how to do unit tests for Android, and in typical fashion, there is no 'good' tutorial. Or one that I could easily find and follow, since they all use obscure words like JUnit, Mockito, Roboelectric, and so on.

So I decided to practice TDD JUST using java and JUnit, and that is what this post is about. A real-time, hopefully useful, beginner-learn-with-me on how to TDD with Java. My plan is to understand it through this learn-with-me (since they say teaching is the best way to learn something) and then be able to apply the same concepts to the Android app.
I guess I can also make a follow-up post when this is done, which is more tutorial-esque..


This Java program will be very simple, run from the command line. It will load a file in the same directory (for ease) that is a CSV file, consisting of Korean,English words. 
The program will randomize the list, and then will prompt you with a Korean word. If you type in 'f' it will show the Korean word: English and then the next word. If you type in 'n' it will show the next Korean word. When you get to the end, it will exit. Simple eh?


First thing first is to make a Java project (I use IntelliJ) with Project SDK 1.8. I'm going to call it 'Simple Flashcards.'

So because this is TDD, we do tests first. The testing library I will use is JUnit because it is in Android Studio as well. So download JUnit from (here)[https://github.com/junit-team/junit/wiki/Download-and-Install] and stick it in the lib folder (if it doesn't exist create it).

Actually the JUnit site says to download hamcrest-core.jar as well. I have no idea what that means so I will not do it, but if it breaks, then I will go download it again.  I also could have installed it via Maven, but I have no idea what Maven is (time to add that to my to-learn-list).

For the TDD, we create the test first. I create a file in the src/tests folder (make the test folder if it doesn't exist) called CardTest.java. I guess the name of the file has to end in -Test.java. This will test this Card class that I haven't made yet.
Let's assert that there are two fields: front and back. The guide says to import org.junit.Test and static org.junit.Assert, but those don't exist for me.  So after googling for the issue, it seems that IntelliJ already can set up tests.
According to (this)[http://stackoverflow.com/questions/19330832/setting-up-junit-with-intellij-idea-12] we didn't even have to download JUnit. Oops. I will copy paste:

```
Create and setup a "tests" folder
In the Project sidebar on the left, right-click your project and do New > Directory. Name it "test" or whatever you like.
Right-click the folder and choose "Mark Directory As > Test Source Root".
Adding JUnit library
Right-click your project and choose "Open Module Settings" or hit F4. (Alternatively, File > Project Structure, Ctrl-Alt-Shift-S is probably the "right" way to do this)
Go to the "Libraries" group, click the little green plus (look up), and choose "From Maven...".
Search for "junit" -- you're looking for something like "junit:junit:4.11".
Check whichever boxes you want (Sources, JavaDocs) then hit OK.
Keep hitting OK until you're back to the code.
```

So I moved the tests folder out of the src folder, oops, marked it as Test Source Root, and added JUnit according to those instructions. I guess that downloaded that hamcrest thing too...

Okay then, back to CardTest.java. I have the following:

```java
import org.junit.Assert;
import org.junit.Test;

public class CardTest {
    @Test
    public void hasFrontAndBack() {
        Card c = new Card("front", "back");
        Assert.assertTrue(c.getFront() == "front");
        Assert.assertTrue(c.getBack() == "back");
    }
}
```

Of course that will fail. But to actually run it (from that stackoverflow site): "Right-click on your test folder and choose "Run 'All Tests'". Presto, testo."


So it is time to make the Card class. Back in src, make a new class called Card.java. Give it a constructor taking two arguments, front and back, and make setters and getters for that, pretty easy.

```java
public class Card {
    private String front;
    private String back;
    
    public Card(String front, String back){
        this.front = front;
        this.back = back;
    }
    
    public String getFront(){
        return this.front;
    }
    
    public String getBack(){
        return this.back;
    }
}
```

Run tests again and...woohoo all tests passed! So this JUnit thing is working.

Well it isn't very useful to have one card right? So let's make a Deck class consisting of cards.  Back into tests we make DeckTest:

```java
import org.junit.Assert;
import org.junit.Test;

public class DeckTest {
    @Test
    public void hasCards() {
        Deck d = new Deck();
        Card c = new Card("front", "back");
        d.addCard(c);
        Assert.assertTrue(d.getNumCards() == 1);
        Assert.assertTrue(d.getCurCard().getFront() == "front");
        Assert.assertTrue(d.getCurCard().getBack() == "front");
    }
}
```

It should be pretty obvious what that is testing. The Deck should have a getCurCard function that returns the "current" card - this will be updated as we progress through the deck.

Tests failed of course, so back to making Deck.java:

(I am spoiled by Javascript and Python so I use ArrayLists now)

```java
import java.util.ArrayList;

public class Deck {
    private ArrayList<Card> deck;
    private int curCardIndex;

    public Deck(){
        this.deck = new ArrayList<Card>();
        curCardIndex = 0;
    }

    public void addCard(Card c){
        this.deck.add(c);
    }

    public int getNumCards(){
        return this.deck.size();
    }

    public Card getCurCard(){
        return this.deck.get(this.curCardIndex);
    }
}
```

Of course there is some error checking that needs to be done, but we can implement that in future tests.  Hmm these tests failed..double clicking the failure shows that the .getBack() test failed because of a failure in testing : it should have been `== "back"`. Yay for laziness.

Correcting that, it all passes, woohoo.

Now let's try NOT adding any cards and see if curcard fails (which it should):

```java
@Test
public void hasNoCards() {
    Deck d = new Deck();
    Assert.assertTrue(d.getNumCards() == 0);
    Assert.assertNull(d.getCurCard());
}
```

Yup failed, got `java.lang.IndexOutOfBoundsException: Index: 0, Size: 0`. So let's fix that...

```java
public Card getCurCard(){
        if(this.getNumCards() == 0){
            return null;
        }
        return this.deck.get(this.curCardIndex);
    }
```

And now all tests passed! 

Now I guess we can test to increase the deck count. 

```java
@Test
public void increasedCard() {
    Deck d = new Deck();
    Card c = new Card("front", "back");
    Card c2 = new Card("front2", "back2");
    d.addCard(c);
    d.addCard(c2);
    d.goToNext();
    Assert.assertTrue(d.getCurCard().getFront() == "front2");
}
```

It will fail so add the method:
```java
public void goToNext(){
    this.curCardIndex += 1;
}
```
and now it works!

That's it for today, I have to go off and practice Korean and then go to the gym. Maybe more later.