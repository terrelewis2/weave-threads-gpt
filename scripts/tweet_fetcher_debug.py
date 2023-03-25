import tweepy
from datetime import datetime, timedelta
import time
import json
import pytz


# Authenticate with your own Twitter API credentials
consumer_key = "balUy5XVSl9OqZDJAl4aIdwFu"
consumer_secret = "BhsH66kfoRbZ5m7JIrF5Gqe4hKIcydcH6ReidHO4RxBb4cLy0K"
access_token = "1456375214-iuRymetFdeHM1UKkaKu8oKr1iCAjDgUFiNHDr40"
access_token_secret = "X4AxmjsUUCQTeidO1XfVwZBgXnJJWNk8rtbZGUEydEIsx"

# Create an instance of the Tweepy API and authenticate with your credentials
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

# Specify the Twitter handle whose tweets you want to fetch
twitter_handle = "AliAbdaal"
tweet = api.get_status("1633860298930024449", tweet_mode='extended')
print(f"Tweet:{tweet}")
if tweet.in_reply_to_screen_name is not None and tweet.in_reply_to_screen_name == twitter_handle and (tweet.full_text[0] != "@" or tweet.display_text_range[0] != 0):
    #This is a reply to a tweet from the same handle
    thread = tweet.full_text
    #get the tweet to which the reply is made
    try:
        parentTweet = api.get_status(tweet.in_reply_to_status_id_str, tweet_mode='extended')
    except tweepy.errors.TweepyException as e:
        print(f"Error getting parent tweet for tweet id {tweet.id_str}: {e}")
    #loop until you reach the first tweet of the thread
    while(parentTweet.in_reply_to_status_id_str is not None):
        tweet = parentTweet
        thread = parentTweet.full_text +'\n'+ thread
        try:
            parentTweet = api.get_status(tweet.in_reply_to_status_id_str, tweet_mode='extended')
        except tweepy.errors.TweepyException as e:
            print(f"Error getting parent tweet for tweet id {tweet.id_str}: {e}")
            break
    thread = parentTweet.full_text +'\n'+ thread
    url = f"https://twitter.com/{parentTweet.user.screen_name}/status/{parentTweet.id_str}"
    date = parentTweet.created_at.isoformat()
    tweeter = parentTweet.user.screen_name
    status_id = parentTweet.id_str
    print(f"Final thread fetched {thread}")
    thread_obj = {"thread":thread,"url":url,"date":date,"tweeter":tweeter,"status_id":status_id}
else:
    print(f"Tweet {tweet.id_str} is not a reply to {twitter_handle} or is a reply to a different handle")
    # This is a reply from a different handle, so we ignore it
    pass
