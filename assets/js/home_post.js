{
  // method to submit form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#post-list-container>ul").prepend(newPost);
          $("#user-name", newPost).replaceWith(data.data.user);
          // console.log(data.data.user);
          deletePost($(" .delete-post-button", newPost));

          // call the create comment class
          new PostComments(data.data.post._id);

          //enable toggleLike functionality on new post
          newToggleLike($(".toggle-like-button", newPost));

          new Noty({
            theme: "relax",
            text: "Post Published",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
    <p id="post">
    ${post.content}
    <small>~
      <small id="user-name"> ${post.user.name} </small>
      </small>
      <small>
        <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
      </small>
    </p>
    <small> 
      <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
        0 Likes
      </a>
    </small>
  
    <div class="post-comments-form">
      <form action="comments/create" id="new-comment" method="post">
        <input type="text" name="content" placeholder="comment..." required />
        <input type="hidden" name="post" value="${post._id}" />
        <input type="submit" value="Add Comment" />
      </form>
    </div>
  
    <div class="post-comments-list">
      <ul id="post-comments-${post._id}">
      </ul>
    </div>
  </li>
  `);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          console.log($(`#post-${data.data.post_id}`));
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  createPost();
}
