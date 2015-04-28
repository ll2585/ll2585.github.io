---
layout: post
tags: [coding, app-a-day, android]
title: Unit Testing in Java - Learn With Me Part 2
---

Okay part two of this Unit Testing learning session! See part one here.

So now that the Deck works, let's make actual cards from a file. I set up a new Interface which is the Deck Presenter in this MVP framework (I guess it could be MVC too since there's only one view but whatever)

(I'm also probably doing this entirely wrong but we shall see if it works)

I'm going to go against TDD and set up basic interfaces for the view and the presenter, because otherwise I have no idea how to do this. That also means I have to turn the model into an interface.

First the presenter interface: the user can either flip the card, go back, go forward, set the card as known, restart with all cards which sets all cards to unknown, restart with shuffling, restart with all unknown cards and shuffled, or quit. That should be it...

```java
public interface ControllerInterface {

    public void displayCard(FlashcardInterface f);
    public void flipCard();
    public void goBack();
    public void goForward();
    public void setKnown();
    public void restartAll();
    public void restartShuffle();
    public void restartUnknown();
    public void quit();
}
```
Since this FlashcardInterface class doesn't exist, I make that next. This is just the model interface.

```java

public interface FlashcardInterface {
    Deck getDeck();
    Card getCurrentCard();

    public void setKnown(boolean known);
    public boolean curCardKnown();

    void shuffle();
    void flipCard();
    void goBack();
    void goForward();
    void restartAll();
    void restartShuffle();
    void restartUnknown();
    void quit();
}
```

So it's basically the same as the Presenter Interface which is a huge red flag...maybe once I start to code it I will see what the differences should be.

Again, same thing for the View Interface (again, same functions...)

```java
public interface ViewInterface {
    void showCard(Card c);
    void addKeyListener(ActionListener listener);

    void setKnown(boolean known);
    void goToNextCard();
    void goToPreviousCard();

    void shuffle();
    void flipCard();
    void goBack();
    void goForward();
    void restartAll();
    void restartShuffle();
    void restartUnknown();
    void quit();
}
```

Okay so I then make the Presenter implementation

