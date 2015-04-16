---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 7
---
Wow okay so I made this late. Since I keep not doing the themed app, today's app will be themed. It will also communciate via `XML` with a web server, and will use `text to speech`.

What will today's app be? It will be a simple one, since the past few days have been super complicated.  The user can input in a `EditText` a role they want to look up, and then the app will communicate with my web server to return the role's data.  The user can also TTS the role, and can make the app read the role's data back.

------
######Theme

In the `Manifest` the theme is `AppTheme`(`android:theme="@style/AppTheme"`)

So set up that theme in `styles.xml`: `<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">`

Also add a `BaseTheme` that changes everything

And then let's set up random stuff.  I was random and lazy and just set up a couple:

```xml
<!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <!-- Customize your theme here. -->
        <item name="android:windowBackground">@color/custom_theme_background</item>
        <item name="android:editTextColor">#C8B0B5</item>
        <item name="android:textSize">15sp</item>



    </style>

    <style name="ButtonStyle">
        <item name="android:background">#AEBCA6</item>
        <item name="android:textColor">#E3EDDE</item>
    </style>
```

Okay done with the theme.  Note: for the background, we have to make a `color.xml` file with `<color name="custom_theme_background">#F4E5E9</color>`.

For some reason, the Application theme is not being applied. But whatever, I don't know how to fix this.

------
######Layout
Add a `EditText` and a `Button` and make sure the `Button`'s style is `ButtonStyle`. The preview looks like this:
![](http://i.imgur.com/cR5K1Wx.png)
but for some reason, on my phone the bg is not pink. (EDIT: after watching the video it is pink...but definitely not on my screen..???)

Anyways, now set up listeners on the buttons, with `Speak` being the Speech to text listener (from tutorial), `Read Info` being the TTS listener (from tutorial), and `Get Info` be the XML parser connecting to the webserver.

REMEMBER TO GIVE IT INTERNET PERMISSION!

Okay this post was pretty short because I basically followed the tutorials.  The only nitpick is that I could not get the theme to appear in the phone, but oh well.  Also, no audio on the video but oh well.

<iframe width="420" height="315" src="https://www.youtube.com/embed/R5KhG-x0z70" frameborder="0" allowfullscreen></iframe>
Source: [My Github](https://github.com/ll2585/app_a_day.day_7)

Tutorials used:
[Derek Banas' "How to Make Android Apps 9 Android Themes and Styles"](https://www.youtube.com/watch?v=W3xHIN15hP8)  
[Derek Banas' "How to Make Android Apps 15"](https://www.youtube.com/watch?v=HVvYRcxSq-Y)  
[Derek Banas' "How to Make Android Apps 16"](https://www.youtube.com/watch?v=ympxfKM4Uec)  