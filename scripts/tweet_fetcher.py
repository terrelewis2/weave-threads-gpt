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
twitter_handle = "joulee"

# Number of tweets per page
tweets_per_page = 200

# Date range for tweets to fetch
end_date = datetime.now() - timedelta(days=1) # exclude today's tweets
start_date = datetime.now(pytz.utc) - timedelta(days=3*365)

# Fetch the first page of tweets
tweets = api.user_timeline(screen_name=twitter_handle, count=tweets_per_page, tweet_mode='extended')
print(f"First tweets fetched :{len(tweets)}")
all_tweets = []
all_tweets.extend(tweets)
processed_tweet_ids = []
threads = []

# Keep fetching pages of tweets until we've reached the end of the timeline or the start date
while len(tweets) > 0 and tweets[-1].created_at > start_date:
	# Fetch the next page of tweets
    tweets = api.user_timeline(screen_name=twitter_handle, count=tweets_per_page, max_id=tweets[-1].id-1, tweet_mode='extended')
    print(f"Loop tweets fetched :{len(tweets)}")
    # Wait for 1 second before fetching the next page to avoid hitting rate limits
    time.sleep(1)
    all_tweets.extend(tweets)

print(f"All tweets fetched :{len(all_tweets)}")

# Loop through each tweet and print its details
for tweet in all_tweets:
    if tweet.in_reply_to_screen_name is not None and tweet.in_reply_to_screen_name == twitter_handle and tweet.full_text[0] != "@" and tweet.id_str not in processed_tweet_ids:
    	#This is a reply to a tweet from the same handle
        processed_tweet_ids.append(tweet.id_str)
        thread = tweet.full_text
        #get the tweet to which the reply is made
        try:
        	parentTweet = api.get_status(tweet.in_reply_to_status_id_str, tweet_mode='extended')
        except tweepy.errors.TweepyException as e:
            print(f"Error getting parent tweet for tweet id {tweet.id_str}: {e}")
            continue
        #loop until you reach the first tweet of the thread
        while(parentTweet.in_reply_to_screen_name is not None):
        	tweet = parentTweet
        	processed_tweet_ids.append(tweet.id_str)
        	thread = parentTweet.full_text +'\n'+ thread
        	try:
        		parentTweet = api.get_status(tweet.in_reply_to_status_id_str, tweet_mode='extended')
        	except tweepy.errors.TweepyException as e:
        		print(f"Error getting parent tweet for tweet id {tweet.id_str}: {e}")
        		break
        if parentTweet.id_str in processed_tweet_ids:
        	continue
        else:
        	processed_tweet_ids.append(parentTweet.id_str)
        	thread = parentTweet.full_text +'\n'+ thread
        	url = f"https://twitter.com/{parentTweet.user.screen_name}/status/{parentTweet.id_str}"
        	date = parentTweet.created_at.isoformat()
        	tweeter = parentTweet.user.screen_name
        	status_id = parentTweet.id_str
        	print(f"Final thread fetched")
        	thread_obj = {"thread":thread,"url":url,"date":date,"tweeter":tweeter,"status_id":status_id}
        	threads.append(thread_obj)
    # elif tweet.in_reply_to_screen_name is None and tweet.id_str not in processed_tweet_ids and not tweet.is_quote_status and len(tweet.full_text)>200:
    # 	url = f"https://twitter.com/{tweet.user.screen_name}/status/{tweet.id_str}"
    # 	date = tweet.created_at.isoformat()
    # 	tweeter = tweet.user.screen_name
    # 	status_id = tweet.id_str
    # 	print(f"Final long tweet fetched")
    # 	thread_obj = {"thread":tweet.full_text,"url":url,"date":date,"tweeter":tweeter,"status_id":status_id}
    # 	threads.append(thread_obj)
    else:
    	# This is a reply from a different handle, so we ignore it
    	pass
print(f"Thread count: {len(threads)}")
data = {
	"tweeter":twitter_handle,
	"count":len(threads),
	"threads":threads
}

# open a file in write mode
filename = twitter_handle+"-threads.json"
with open(filename, "w") as outfile:
    # write the JSON object to the file
    json.dump(data, outfile)
