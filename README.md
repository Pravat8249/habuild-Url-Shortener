P2 : Design a url shortner

Given a long URL, the service should generate a shorter and unique alias of it.
When the user hits a short link, the service should redirect to the original link.
Links will expire after a standard default time span.
The system should be highly available. This is really important to consider because
if the service goes down, all the URL redirection will start failing.
URL redirection should happen in real-time with minimal latency.
Shortened links should not be predictable.
Short URL length can be up to 30 characters starting from prefix: www.habuild.in/

Assuming, we will have 5M new URL shortenings per month, with 100:1 read/write ratio
Database to be used : PostgreSQL
Methods to implement
1. Shorten Url (Destination Url) → Short Url
2. Update short url (Short Url, Destination Url) → Boolean
a. update meaning : new destination link on same short link
3. Get Destination Url (Short Url) → Destination Url
4. Update Expiry (Short Url, Days to add in expity) →Boolean
