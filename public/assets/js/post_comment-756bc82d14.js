{let e=function(){let e=$("#new-comment-form");e.submit((function(n){n.preventDefault(),$.ajax({type:"post",url:"/comments/create",data:e.serialize(),success:function(e){console.log(e.data.comment.post);let n=t(e.data.comment);$(`#post-comments-${e.data.comment.post}`).prepend(n),pself.deleteComment($(" .delete-comment-button",n)),newToggleLike($(".toggle-like-button",n)),new Noty({theme:"relax",text:"Comment Published",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})}))},t=function(e){return $(`<li id="comment-${e._id}">\n    <p>\n    ${e.content}\n    <br />\n      <small id="user-name" >> ${e.user.name} </small>\n      <small>\n        <a class="delete-comment-button" href="/comments/destroy/${e._id}">X</a>\n      </small>\n      <small> \n      <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Comment">\n        0 Likes\n      </a>\n    </small>\n    </p>\n  </li>`)};e()}