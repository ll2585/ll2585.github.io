---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 5
---

Today's app will just build on yesterday's app.  It will consist of lots of `Fragments`: first, a login screen, which then leads into the ability to select your `Role` (from yesterday).  Then it will create a new `Activity` just like yesterday's, based off the `Role` you selected.  

-------------
######Login Fragment
First create the `login_fragment.xml` file, consisting of a `TextView` and a `Button`. Pretty simple, looks like this:
![](http://i.imgur.com/q2uQTq5.png)

######Login Class
Now we have to make the class.

```java
public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.login_fragment, container, false);

    }
```

Notes: `Inflater` inflates the `layout` into the `container` (the `View` the `Fragment` could or could not attach to), `false` is if you want to attach the `container` or not.

######Adding the Fragment
Note that, because I am using `ActionBarActivity`, I can't use `fragmentTransaction.replace(android.R.id.content...)`, to use that I have to use `Activity`.  Also I have to use `FrameLayout` in `activity_main.xml` instead of `<fragment>` (I think at least, since `FrameLayout` works).

So this is my `onCreate` in `MainActivity`:

```java
super.onCreate(savedInstanceState);
setContentView(R.layout.activity_main);
FragmentManager fragmentManager = getFragmentManager();

FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

LoginFragment loginFragment = new LoginFragment();
fragmentTransaction.replace(R.id.main_fragment, loginFragment);

fragmentTransaction.commit();
```

-------------
######Select Role Activity
This part is simple, create a new activity.  The layout file will have two fragments (similar to Tutorial 12 and 13) with the `Roles` listed, and selecting a `Role` brings up information about the `Role`.
In `select_role_screen.xml` I have a `FrameLayout` consisting of one fragment, with a class modifier pointing to `RolesFragment`.  And to make the info appear horizontally, like the tutorial, create a folder `layout-land` and put another `select_role_screen.xml` in it.

This part is basically Tutorial 12 and 13.  I just changed the data and the names to the `Roles`.  Also, I have a new `Activity` call these screens.  There is a bug here where, if you switch from horizontal to vertical and click a new `Role` and then switch back to horizontal, the old `Role` is still checked.  But I don't have the time to fix this now, have to finish this app.

-------------
######Day 4 Again
Just copy and paste from `Day 4` - probably could work on reformating but w.e.

-------------
######To Do Tomorrow
Probably make this have a theme, and make it so the info that pops up is instead displayed to the right if horizontal.  There is also a bug where, if you select a role and then rotate the screen and start the game, it will crash.  Also, have to make the button appear on the horizontal screen.  No time now, though.

<iframe width="420" height="315" src="https://www.youtube.com/embed/ZVZefh9-A84" frameborder="0" allowfullscreen></iframe>
Source: [My Github](https://github.com/ll2585/app_a_day.day_5)

Tutorials used:
[Derek Banas' "How to Make Android Apps 10 Android Fragments"](https://www.youtube.com/watch?v=tXpw4cEvecY)  
[Derek Banas' "How to Make Android Apps 11 Multipane Fragment Example"](https://www.youtube.com/watch?v=8Rjkv2-saDk)  
[Derek Banas' "How to Make Android Apps 12 Multiple Fragment Layouts"](https://www.youtube.com/watch?v=Ve6oiF0SkFA)  
[Derek Banas' "How to Make Android Apps 13 Fragment Layouts"](https://www.youtube.com/watch?v=_Gra7aJ5UQ8)  