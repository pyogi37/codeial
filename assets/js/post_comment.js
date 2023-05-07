{
  // method to submit form data for new comment using AJAX
  let createComment = function () {
    let newCommentForm = $("#new-comment-form");
    newCommentForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/comments/create",
        data: newCommentForm.serialize(),
        success: function (data) {
          console.log(data.data.comment.post);
          let newComment = newCommentDom(data.data.comment);
          $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
          pself.deleteComment($(" .delete-comment-button", newComment));

          //enable toggleLike functionality on new comment
          newToggleLike($(".toggle-like-button", newComment));

          new Noty({
            theme: "relax",
            text: "Comment Published",
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

  // method to create a comment in DOM

  let newCommentDom = function (comment) {
    return $(`<li id="comment-${comment._id}">
    <p>
    ${comment.content}
    <br />
      <small id="user-name" >> ${comment.user.name} </small>
      <small>
        <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
      </small>
      <small> 
      <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
        0 Likes
      </a>
    </small>
    </p>
  </li>`);
  };

  // method to delete a comment from DOM
  let deleteComment = function (deleteLink) {
    console.log("delete method");
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          //   console.log(data.data.comment_id);
          console.log($(`#comment-${data.data.comment_id}`));
          $(`#comment-${data.data.comment_id}`).remove();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  createComment();
}
