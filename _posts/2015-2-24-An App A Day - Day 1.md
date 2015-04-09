---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 1
---

Usually day 1 projects are some sort of "Hello World" program.  For an app a day, however, that is pretty redundant, since Android Studio automatically generates a "Hello World" program.  
![](http://i.imgur.com/aaTEzmj.png)

So for this day 1, I will put in various widgets into this one activity, along with describing what I am doing.

-------------
######Simple Steps
First let's increase the text size and center it.  In `activity_main.xml`, add `android:textSize="50sp"` and `android:layout_centerHorizontal="true"` to `TextView`.  Also add an id field: `android:id="@+id/txt_view` so now it looks like:
```
<TextView
        android:text="@string/hello_world"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="50sp"
        android:layout_centerHorizontal="true"
        android:id="@+id/txt_view" />
```  
![](http://i.imgur.com/cU9jiou.png)

######Adding a Button
First let's define a string for the button.  In `strings.xml` add `<string name="button_name">The Button</string>`.  This defines a string that can be used later.
In the `Design` tab, click `Button`  and drag it to the screen.  Change the button text to `"@string/button_name"` which assigns the button text to that string we just defined.  Add an id as well: `android:id="@+id/but1"`.  
![](http://i.imgur.com/zwlJCIK.png)

######Making the Button Work
In `MainActivity.java` add `final TextView firstTextView = (TextView) findViewById(R.id.txt_view)`
Note that it is `final` because it will be used in an inner class, and it is casted because `findViewById` returns a view.
Add the button as well: `Button button = (Button) findViewById(R.id.but1)`

Then add an onclick listener:
```
button.setOnClickListener(new View.OnClickListener() {
	@Override
	public void onClick(View v) {
		firstTextView.setText("Sup");
	}
});
```

So clicking the button will change the text.
<iframe width="420" height="315" src="https://www.youtube.com/embed/1t9Mr76asNo" frameborder="0" allowfullscreen></iframe>

source: [My Github](https://github.com/ll2585/app_a_day.day_1)

Tutorials used:
[Derek Banas' "How to Make Android Apps"](https://www.youtube.com/watch?v=ef-6NZjBtW0)