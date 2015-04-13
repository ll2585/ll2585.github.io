---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 3
---

Today I will use tutorials 4 and 5: The Action Bar and Making New Activities.  So to combine these two, this app will have two screens.  On one screen will be two buttons, and clicking each button brings up a new screen with data depending on which button was clicked.  On each screen you can type in your name, and then select `Win` or `Lose` and that will return to the main page (which has a scoreboard).  The action bar will let the user change the background color of the page.  

-------------
######Exit Option
First I will set up the action bar to change the background color.  In `menu_main.xml` create a new `item` and make the title `Exit`.  Also make it `showAsAction` which will show it on the action bar horizontally on the screen, and change the `orderInCategory` to something over 100 to make it appear under `Settings`.  Also add an icon.

```xml
<item android:id="@+id/exit_app"
        android:title="@string/exit_string"
        app:showAsAction="ifRoom|withText"
        android:orderInCategory="101"
        android:icon="@drawable/exit"
        />
```

To make it work, in `MainActivity.java` add it to `onOptionsItemSelected`:

```java
else if (id == R.id.exit_app){
            finish();
            return true;
        }
```

I also made it a checkable since that's what he did in the tutorial and it's good to be able to know that this option exists.
######Changing the Background Color

Now to make colors add them in `menu_main.xml` similar to the `Exit` action, except don't make it `showAsAction`.  I made red, white and blue.  This app will open a `DialogFragment` once these options are selected, so make a custom class that extends `DialogFragment`.  Override `onCreateDialog` and make an `AlertDialog` that pops up over an activity: `AlertDialog.Builder theDialog = new AlertDialog.Builder(getActivity());`

Then make the AlertDialog have a title and a message and a `setPositiveButton` and a `setNegativeButton`:

```java
theDialog.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                getActivity().getWindow().getDecorView().setBackgroundColor(Color.RED);
            }
        });
```

Finally, make it `return theDialog.create();` instead of what was originally there.

Also, could probably add a constructor that takes in the id and maps it to the color using enums:

```java
private enum CustomColor {
        RED(R.id.make_red, R.string.red_string, Color.RED),
        WHITE(R.id.make_white, R.string.white_string, Color.WHITE),
        BLUE(R.id.make_blue, R.string.blue_string, Color.BLUE);
        protected int id, color_int, color_string_id;
        CustomColor(int r_id, int color_string_name_id, int color_id) {
            this.id = r_id;
            this.color_string_id = color_string_name_id;
            this.color_int = color_id;
        }

        protected String color_name(Context ctx) {
            return ctx.getString(color_string_id);
        }
    }
```

And then use `setArguments` and `getArguments` to apply the enum:
in `onCreateDialog`:

```java
Bundle args = getArguments();
        if (args != null) {
            int arg_id = args.getInt("color_id");
            for(CustomColor customC : CustomColor.values()){
                if(customC.id == arg_id){
                    customColor = customC;
                }
            }
        }
```

and

```java
public static CustomDialogFragment newInstance(int r_color_id) {
        CustomDialogFragment customFragment = new CustomDialogFragment();

        Bundle args = new Bundle();
        args.putInt("color_id", r_color_id);
        customFragment.setArguments(args);
        return customFragment;
    }
```

######New Activity
Now to integrate the new activity.  Let's first set up the `xml` for the`MainActivity`. Ideally it should be a `TableLayout` but since I have not learned that yet, let's go back to the `ListView`.

In `activity_main.xml` make a `TextView` saying `Scoreboard` and a hidden `ListView`. Also make a `TextView` saying `No Scores Yet`.  We will unhide this once scores are entered.

Then make a new layout file `second_screen.xml` and in it, make a `EditText` and two `Buttons`.  Also add a couple of `TextViews` to transmit secret info and label things.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:gravity="left"
    android:padding="20dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/secret_info_text_view"
        android:textSize="30sp"/>

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/enter_name_text_view"/>

        <EditText
            android:layout_width="185dp"
            android:layout_height="wrap_content"
            android:id="@+id/users_name_edit_text"/>

        </LinearLayout>
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:paddingTop="10dp"
        android:layout_gravity="center">

        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/win_button_text"
            android:onClick="onWinButtonClick"/>

        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/lose_button_text"
            android:onClick="onLoseButtonClick"/>

        </LinearLayout>

</LinearLayout>
```

######Coding
In `MainActivity.java` set up an `ArrayList` for the names and an `ArrayAdapter` for the `ListView`.  In the click function, set up a simple `Intent` to call the other screen.  Put extra some random information to be passed. (I suppose this should be extracted into a model class but whatever.)

Create `SecondScreen.java` and handle the `Intent` that called it to put the info into the `TextView`:

```java
protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.second_screen);
        Intent activityThatCalled = getIntent();
        String random_info = activityThatCalled.getExtras().getString("randomInfo");
        String random_prompt = getString(R.string.secret_info_text_view);
        TextView random_info_text_view = (TextView) findViewById(R.id.secret_info_text_view_id);
        random_info_text_view.setText(String.format(random_prompt, random_info));
    }
```
Then set up the responses to clicking the buttons:

```java
public void onWinButtonClick(View view) {
        handleClick(true);
    }

    public void onLoseButtonClick(View view) {
        handleClick(false);
    }
    
    private void handleClick(boolean win){
        EditText usersNameET = (EditText) findViewById(R.id.users_name_edit_text);
        String usersName = String.valueOf(usersNameET.getText());
        Intent goingBack = new Intent();
        goingBack.putExtra("usersName", usersName);
        goingBack.putExtra("winStatus", win);
        setResult(RESULT_OK, goingBack);
        finish();
    }
```

And finally, back in `MainActivity.java`, handle that `Intent`:

```java
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        String usersName = data.getStringExtra("usersName");
        boolean win = data.getBooleanExtra("winStatus", false);
        boolean new_user = false;
        if(user_map.size() == 0 || !user_map.containsKey(usersName)){
            user_map.put(usersName, new User(usersName, listItems.size()));
            new_user = true;
        }
        if(win){
            user_map.get(usersName).win();
        }else{
            user_map.get(usersName).lose();
        }
        if(new_user){
            addToListView(user_map.get(usersName));
        }else{
            updateListView(user_map.get(usersName));
        }
    }

    private void addToListView(User u){
        ListView scoreboard = (ListView) findViewById(R.id.score_list_view);
        if (scoreboard.getVisibility() == View.GONE) {
            TextView no_scores_text_view = (TextView) findViewById(R.id.no_scores_text_view_id);
            no_scores_text_view.setVisibility(View.GONE);

            scoreboard.setVisibility(View.VISIBLE);
        }

        String player_score = getString(R.string.user_score);
        listItems.add(String.format(player_score, u.name, u.wins, u.losses));
        adapter.notifyDataSetChanged();
    }

    private void updateListView(User u){
        String user_score = listItems.get(u.arraylist_index);
        String player_score = getString(R.string.user_score);
        user_score = String.format(player_score, u.name, u.wins, u.losses);
        listItems.set(u.arraylist_index, user_score);
        adapter.notifyDataSetChanged();
    }
```

(Note: I created an inner `User` class - again, could extract this out)

<iframe width="420" height="315" src="https://www.youtube.com/embed/Za5lKQQ7JgE" frameborder="0" allowfullscreen></iframe>

Source: [My Github](https://github.com/ll2585/app_a_day.day_3)

Tutorials used:
[Derek Banas' "How to Make Android Apps 4"](https://www.youtube.com/watch?v=cioMt6Rv6yk)  
[Derek Banas' "How to Make Android Apps 5 : Multiple Android Activities"](https://www.youtube.com/watch?v=45gq0Q8GFMM)