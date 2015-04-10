---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 2
---

The day 2 tutorial seemed pretty easy so I combined it with the day 3 tutorial to make this app.
This app today will be similar to a quiz (with the answers given), where there will be a list of Fridays and then you either select whether a day is a Friday or not.  It will use ListViews and Toasts and a bunch of other goodies.  Those who watched the tutorials will know where I am getting my information from.

-------------
[Notes from Tutorial for those who don't want to watch a video]  
`wrap_content` will resize the widgets depending on the content and the screen size. If it is wider than the screen size, it will make a new line but any new widgets may not show up.  
`layout_weight` divides up the space given the weight.  
`match_parent` takes up the remaining weight  
######Setup
Set up a new program.  Change `RelativeLayout` to `LinearLayout` - whenever you make a `LinearLayout` you need to have an orientation set as well, so add `android:orientation="vertical"`.  Also, add the gravity: `android:gravity="center|top"`.



######The Answers
Now we will add a section that contains a list of Fridays from January 1, 2015 to April 1, 2015.  First we add a `TextView` with the text `List of Fridays` (make this a string).  Also, set the size to something large enough.
```
<TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/fridays_title"
        android:textSize="20sp"/>
```

Then we need to add the `ListView`.  Finish the layout by adding a `TextView` prompting a Friday, and two `Buttons` that allow the user to say `Yes` or `No`.
It should look something like this:  
![](http://i.imgur.com/c5PC6Lc.png)
######Fridays

In `MainActivity` first  set up the Friday logic.  First declare the Fridays in an array: 
```
private String fridays = {"January 2", "January 9", "January 16", "January 23", "January 30", 
                "February 6", "February 13", "February 20", "February 27",
                "March 6", "March 13", "March 20", "March 27"};
```
And then make helper methods to get a random date, and determine if a date is Friday.  I also wrote a method to update the prompt:   
```java
private void updateFridayText(String temp){
        tested_date = temp;
        String question_string = getString(R.string.is_friday);
        String prompt = String.format(question_string, tested_date);
        is_friday_textView.setText(prompt);
    }
```

######The Adapter
Make a custom `ListAdapter`: `ListAdapter friday_adapter = new CustomAdapter(this, fridays);`
and then set the adapter to the view:  
```
final ListView friday_view = (ListView) findViewById(R.id.fridays_listView);
friday_view.setAdapter(friday_adapter);
```



We can also add an `onItemClickListener` to change the prompt to whatever we clicked on:  
    friday_view.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                String friday_picked = String.valueOf(friday_view.getItemAtPosition(position));
                updateFridayText(friday_picked);
            }
    });

Make an `.xml` file for the `CustomLayout`.  Per the tutorial, I have a simple `ImageView` and then a `TextView`.
In `CustomAdapter.java`, I have a `LayoutInflater` that puts the data into the `.xml` file.
######Toasting
I made a `Toast` for the response clicked by the user:   
```
public void onYesButtonClick(View view) {
        String response = isFriday(tested_date) ? getString(R.string.good_job) : getString(R.string.wrong);
        Toast.makeText(this, response, Toast.LENGTH_SHORT).show();
        updateFridayText(randomDate());
    }
```  
Similar for the `No` button.  
<iframe width="420" height="315" src="https://www.youtube.com/embed/hKH9KUyYw5w" frameborder="0" allowfullscreen></iframe>

Source: [My Github](https://github.com/ll2585/app_a_day.day_2)

Tutorials used:
[Derek Banas' "How to Make Android Apps 2"](https://www.youtube.com/watch?v=kmsB_P2xbus)  
[Derek Banas' "How to Make Android Apps 3 Android ListViews"](https://www.youtube.com/watch?v=rhj4_KBD6BQ)