### Overview

## User stories

### Authentication

- As a user, I can register for a new account with name, email, passwor.
- As a user, I can sign in with email and password.

### Users

- As a user, I can see a list of other users so that I can send, accept or decline friend requests.
- As a user, I can get my current profile info (stay signed in after page refresh)
- As a user, I can see the profile of a specific user given a user ID
- As a user, I can update my profile info like Avatar, Company, Job Title, Social links and short description.

### Posts

CRUD

- As a user, I can see a list of posts.
- As a user, I can create a new post with text content and an image.
- As a user, I can edit my posts.
- As a user, I can delete my posts.

### Comments

- As a user, I can see a list of comments.
- As a user, I can write comments on a post.
- As a user, I can edit my comments.
- As a user, I can delete my comments.

### Reactions

- As a user, I can like or dislike to a post or a comment.

### Friends

- As a user, I can see a friend request from another user who is not my friend.
- As a user, I can see a list of friend requests I have recieved.
- As a user, I can see a list of friend requests I have sent.
- As a user, I can see a list of my friend.
- As a user, I can accept or decline a friend request.
- As a user, I can cancel a friend request I sent.
- As a user, I can unfriend a user in my friend list.

## Endpoint APIs

### Auth APIs

...javascript

<!--
* @rout POST /auth/login
* @description Login with username and password.
* @body (email, password)
* @access Public
 -->

...

### User APIs

<!--
* @rout POST /users
* @description Register new user
* @body (name, email, password)
* @access Public
 -->

<!--
* @rout GET /users?page=1&limit=10
* @description get users with pagination
* @body (name, email, password)
* @access Login required
 -->

 <!--
* @rout GET /users/me
* @description get current user info
* @access Login required
 -->

 <!--
* @rout GET /users/:id
* @description get a user profile
* @access Login required
 -->

 <!--
* @rout PUT /users/:id
* @description Update user profile
* @body (name, avatarUrl, coverUrl,aboutme, city, country, company, job title, facebookLink,InstagramLink, LinkedInLink,...)
* @access Login required
 -->

### Posts APIs

<!--
* @rout GET /posts/user.:userId?page=1&limit=10
* @description get all posts a user can see  with pagination
* @access Login required
 -->

<!--
* @rout POST /posts
* @description create a new post
* @body (content, image)
* @access Login required
 -->

<!--
* @rout PUT /posts/:id
* @description update a post
* @body (content, image)
* @access Login required
 -->

 <!--
* @rout DELETE /posts/:id
* @description Delete a post
* @access Login required
 -->

  <!--
* @rout GET /posts/:id
* @description Get a single post
* @access Login required
-->

  <!--
* @rout GET /posts/:id/comments
* @description Get comments of a post
* @access Login required
-->

### Comments APIs

<!--
* @rout POST /comments
* @description create a new comment
* @body {content, postId}
* @access Login required
-->

<!--
* @rout PUT /comments/:id
* @description update a comment
* @access Login required
-->

<!--
* @rout DELETE /comments/:id
* @description delete a comment
* @access Login required
-->

<!--
* @rout GET /comments/:id
* @description get detail of a comment
* @access Login required
-->

### Reactions APIs

<!--
* @rout POST /reactions
* @description save a raction for post or comment
* @body {targetType: 'Post' or 'Comment', targetId, emoji: 'like' or 'dislike' }
* @access Login required
-->

### Friends APIs

<!--
* @rout POST /friends/requests
* @description Send a friend request
* @body {to: User ID}
* @access Login required
-->
<!--
* @rout GET /friends/requests/incoming
* @description get the list of recieved pending requests
* @access Login required
-->

<!--
* @rout GET /friends/requests/outcoming
* @description get the list of friends
* @access Login required
-->
<!--
* @rout PUT /friends/requests
* @description Accept/Reject a received pending request
*@body{status: 'accepted' or 'declined'}
* @access Login required
-->

<!--
* @rout DELETE /friends/requests/:userId
* @description Cancel a friend request
* @access Login required
-->

<!--
* @rout DELETE /friends/:userId
* @description Removed a friend
* @access Login required
-->
