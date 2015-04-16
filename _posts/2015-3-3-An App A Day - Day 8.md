---
layout: post
tags: [coding, app-a-day, android]
title: An App A Day - Day 8
---
Today's app will be very simple.  Maybe I should leave the complicated apps for the weekend?

So today we will combine the `sharedPreferences` with `FileServices` to download a text file.  I guess I can also put in `notifications` and an `alarm`.

-------------
######App Details
This will be a pseudo flashcard app, similar to the one I made two years ago (but forgot everything), where clicking a `Button` will download two files from my webservice that will contain some Korean words and English words, and will display the words in an `TextView`. (No JSON because I am downloading it and then generating on the app.)

There will also be a `Button` that lets you generate new words, as well as a `TextView` that shows when the last download was.

There will be a button that lets you `flip` and go to the `next` word.  The `preferences` will allow you to change the `size` and set a duration for an `alarm` to fire when you finish, notifying you that time is up. Clicking the notification will `reset` the list.

######Webserver
First I set up a webserver that randomly generates a list of Korean-Definition word pairs (from my list of 123 pairs), given the `amt` argument.

######Mockup
Setting up the layout, it should look like this:
![](http://i.imgur.com/Cj03XYz.png)

######Setting Up Download
First set up the `manifest` to include `INTERNET` permission, also include the `FileService` (from tutorial)

Then set up the `FileService` class (straight from tutorial).
But, because I am using Heroku, remove `urlConnection.setDoOutput(true);`. 
In `MainActivity` set up the `IntentFilter` and register the receiver. Because I will be downloading two .txt files I set up a helper function.

```java
ArrayList<String> koreanWords;
ArrayList<String> definitions;
koreanWords = readFileIntoArrayList("korean");
definitions = readFileIntoArrayList("definition");

for(int i = 0; i < koreanWords.size(); i++){
  String korean = koreanWords.get(i);
  String definition = definitions.get(i);
  Word w = new Word(korean, definition);
  words.add(w);
}
TextView lastDownloadedTextView = (TextView) findViewById(R.id.last_downloaded_text_view);
DateFormat dateFormat = new SimpleDateFormat("MMMM d yyyy HH:mm:ss");
Date date = new Date();
String currentTime = dateFormat.format(date);
lastDownloadedTextView.setText("Last downloaded on " + currentTime);
generateWordsForFlashcards();
```

######Saving Preferences
Now that we have the download set up, let's save some preferences and data.  The data we will save is the `ArrayList` that holds the selected words, as well as the current `Word` being shown.  Then we will have `Settings` that allows the user to change the # of words generated, as well as the default side to be shown.

In `onCreate` set up a function for if there is a `savedInstance`:

```java
words = savedInstanceState.getParcelableArrayList("DOWNLOADED_WORDS");
curIndex = savedInstanceState.getInt("CURRENT_INDEX");
selected_words = savedInstanceState.getParcelableArrayList("SAVED_WORDS");
showingKorean = savedInstanceState.getBoolean("SHOWING_KOREAN");

String curSideShowing = showingKorean ? selected_words.get(curIndex).getKorean() : selected_words.get(curIndex).getDefinition();

text.setText(curSideShowing);
```

For preferences, we can't store objects. So we will store the `words` and the `selected_words` in some `JSON` and then parse it back into an `ArrayList` (REMEMBER TO ESCAPE THE JSON!):

```java
boolean preferencesSaved = getPreferences(Context.MODE_PRIVATE).getBoolean("PREFERENCES_SAVED", false);
if(preferencesSaved){
Set<String> wordSet = getPreferences(Context.MODE_PRIVATE).getStringSet("DOWNLOADED_WORDS", null);
Set<String> selectedWordSet = getPreferences(Context.MODE_PRIVATE).getStringSet("SAVED_WORDS", null);
words = arrayListFromSharedPreferences(wordSet);
curIndex = getPreferences(Context.MODE_PRIVATE).getInt("CURRENT_INDEX", 0);
selected_words = arrayListFromSharedPreferences(selectedWordSet);
showingKorean = getPreferences(Context.MODE_PRIVATE).getBoolean("SHOWING_KOREAN", true);

String curSideShowing = showingKorean ? selected_words.get(curIndex).getKorean() : selected_words.get(curIndex).getDefinition();

text.setText(curSideShowing);
}
```

With:

```java
private ArrayList<Word> arrayListFromSharedPreferences(Set<String> set) {

        ArrayList<Word> items = new ArrayList<Word>();
        for (String s : set) {
            try {
                JSONObject jsonObject = new JSONObject(s);
                Word w = Word.parseFromJSON(jsonObject);

                items.add(w);

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return items;
    }
```

Also save the preferences on `onSaveInstanceState`:

```java
SharedPreferences.Editor sPEditor = getPreferences(Context.MODE_PRIVATE).edit();

        Set<String> wordSet= new HashSet<String>();
        for (int i = 0; i < words.size(); i++) {
            wordSet.add(words.get(i).getJSONObject().toString());
        }

        sPEditor.putStringSet("DOWNLOADED_WORDS", wordSet);

        Set<String> selectedSet= new HashSet<String>();
        for (int i = 0; i < selected_words.size(); i++) {
            selectedSet.add(selected_words.get(i).getJSONObject().toString());
        }

        sPEditor.putStringSet("SAVED_WORDS", selectedSet);
        sPEditor.putInt("CURRENT_INDEX", curIndex);
        sPEditor.putBoolean("SHOWING_KOREAN", showingKorean);
        sPEditor.putBoolean("PREFERENCES_SAVED", true);
        // Save the shared preferences
        sPEditor.commit();
```

(oops I updated it, putting in the `lastDownloadedString` in, as well).

Now for Settings:
(I also added the `bold` and `textSize` from Tutorial just to show it actually working, otherwise it's saving)

```java
// Shared key value pairs are here
        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);

        // Check if the checkbox was clicked
        if(sharedPreferences.getBoolean("pref_text_bold", false)){
            // Set the text to bold
            text.setTypeface(null, Typeface.BOLD_ITALIC);
        } else {
            // If not checked set the text to normal
            text.setTypeface(null, Typeface.NORMAL);
        }

        // Get the value stored in the list preference or give a value of 16
        String textSizeStr = sharedPreferences.getString("pref_text_size", "16");

        // Convert the string returned to a float
        float textSizeFloat = Float.parseFloat(textSizeStr);

        // Set the text size for the EditText box
        text.setTextSize(textSizeFloat);


        startKorean = sharedPreferences.getBoolean("start_korean", true);
        wordsChosen = sharedPreferences.getInt("words_generated", 7);
```

Remember to store `startKorean` and `wordsChosen` in the `savedInstanceBundle` as well as the `savedPrefences`.

So in the `SettingsActivity`we need to `addPreferencesFromResource` the `preferences.xml` (in the `xml` folder that we have to create). Also add it to the `manifest`. I also added a button to the `Settings` panel.

```java
if (id == R.id.action_settings) {
            Intent intentPreferences = new Intent(getApplicationContext(),
                    SettingsActivity.class);

            // 3. Start the activity and then pass results to onActivityResult
            startActivityForResult(intentPreferences, SETTINGS_INFO);
            return true;
        }
```
Pretty standard.

Also note: I forgot to reset the `word` ArrayList before downloading - I changed that.

I also added a `Back` button.

######Making the app work
Now we get into actually making it flip cards. These are just standard functions in MainActivity (filling in the onClick). Note I create a label saying the current card, as well as disabling the `Next` Button on the last card.

######Adding the Alert
Now create an alert that displays when the user is done with all the words.  Replace the `Next` with `Start Alarm for 5 seconds` (preferenceable) and then after 5 seconds, have it display the alert that resets the words.

Remember to set up the `Manifest`! The `Alarm` is basically copied from the tutorial. Add `android:launchMode="singleTask"` to the Manifest Activity if you don't want multiple copies. (using `singleInstance` will prevent `onActivityResult` from firing.)

<iframe width="420" height="315" src="https://www.youtube.com/embed/Qy3TRBXRCYI" frameborder="0" allowfullscreen></iframe>

Source: [My Github](https://github.com/ll2585/app_a_day.day_8)

Tutorials used:
[Derek Banas' "How to Make Android Apps 17"](https://www.youtube.com/watch?v=1DOeLy26hOE)  
[Derek Banas' "How to Make Android Apps 18"](https://www.youtube.com/watch?v=l8XBY1sqz70)  
[Derek Banas' "How to Make Android Apps 19"](https://www.youtube.com/watch?v=WozSRUnYoNM)  