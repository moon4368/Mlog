import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

export default function SingleComment(props) {

  const [onModifyCmt, setModifyCmt] = useState(false);
  const [OpenReply, setOpenReply] = useState(false)
  const [ReplyAuthor, setReplyAuthor] = useState("");
  const [ReplyBody, setReplyBody] = useState("");
  const [editCommentBody, setEditCommentBody] = useState(props.comment.body);

  const setAddReplyForm = () => {
    setOpenReply(!OpenReply);
  }

  const setModifyMode = () => {
    setModifyCmt(!onModifyCmt);
  }

  const handleCommentBodyChange = (e) => {
    setEditCommentBody(e.currentTarget.value);
  }

  const handleReplyAuthorChange = (e) => {
    setReplyAuthor(e.currentTarget.value);
  }

  const handleReplyBodyChange = (e) => {
    setReplyBody(e.currentTarget.value);
  }

  const replyFormSubmit = (e) => {
    e.preventDefault();
    const url = `/api/posts/${props.postId}/comments/${props.comment.id}`;
    const commentInfo = {
      author: ReplyAuthor,
      body: ReplyBody,
    }
    console.log(commentInfo);
    axios.post(url, commentInfo)
      .then(response => {
        props.reRenderComments(response.data);
        alert("대댓글 등록 성공!")
        setReplyAuthor("");
        setReplyBody("");
        console.log("singleComment : ", response);
      })
      .catch(error => console.log(error));
  }

  const editCommentFormSubmit = (e) => {
    e.preventDefault();
    const url = `/api/posts/${props.postId}/comments/${props.comment.id}`;
    axios.put(url, editCommentBody).then(response => console.log(response)).catch(error => console.log(error));
  }

  return (
    <>
      <CommentCards>
        {onModifyCmt ?
          <div className="modifyMode">
            <form onSubmit={editCommentFormSubmit}>
              <textarea name="body" onChange={handleCommentBodyChange}>{props.comment.body}</textarea>
              <div>
                <button type="submit">수정완료</button>
                <button onClick={setModifyMode}>수정취소</button>
              </div>
            </form>
          </div>
          :
          <div className="comment">
            <div className="user">
              <div className="picture"></div>
              <div className="profile">
                <span className="name">{props.comment.author}</span>
                <span className="date">{props.comment.modifiedDate}</span>
              </div>
              <div className="cmtlist_btns">
                <button onClick={setModifyMode}>수정</button>
                <button>삭제</button>
                <button onClick={setAddReplyForm}>Reply to</button>
              </div>
            </div>
            <hr />
            <div className="body ">{props.comment.body}</div>
          </div>
        }
      </CommentCards>
      {OpenReply &&
        <ReplyFormContainer>
          <form onSubmit={replyFormSubmit}>
            <table>
              <tbody>
                <tr>
                  <td><label htmlFor="author">작성자 : </label>
                    <input
                      type="text"
                      value={ReplyAuthor}
                      onChange={handleReplyAuthorChange}
                      name="author" /></td>
                </tr>
                <tr>
                  <td>
                    <textarea
                      name="body"
                      id="comment"
                      value={ReplyBody}
                      onChange={handleReplyBodyChange}
                      placeholder="댓글을 작성해주세요" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <button type="submit">댓글등록</button>
                    <button onClick={setAddReplyForm}>등록취소</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </ReplyFormContainer>
      }
    </>


  )
}

const CommentCards = styled.div`
  margin: 0 auto;
  width: 45vw;
  color : #222f3e;
  display : flex;
  flex-direction : column;
  justify-content : center;
  align-items : center; 

  .modifyMode{
    border: 1px solid #dedede;
    padding: 10px 10px;
    border-radius: 5px;
    box-shadow: 2px 4px 3px #7f8fa6;
    margin-top: 10px;
    display: flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    margin-bottom : 1rem;
  }
  
  .modifyMode textarea{
    overflow-x:hidden;
    resize: none;
    border-color: #dedede;
    border-radius: 5px;
    width: 43vw;
    height: 6rem;
  }
  .modifyMode div {
    width : 43vw;
    display : flex;
    justify-content : flex-end;
  }
  .modifyMode div button {
    margin-top : 8px;
    margin-left : 8px;
    background-color : white;
    padding : 5px 5px;
    border-radius : 5px;
    border-color: #dedede;
  }
  .comment {
    width: 43vw;
    border: 1px solid #dedede;
    padding: 10px 10px;
    border-radius: 5px;
    box-shadow: 2px 4px 3px #7f8fa6;
    margin-top: 10px;
    margin-bottom : 1rem;
  }
  .user {
    display: flex;
    align-items: flex-end;
  }
  
  .profile {
    margin-left: 5px;
    display: flex;
    flex-direction: column;
  }
  .name {
    font-size: 0.8rem;
  }
  .date {
    font-size: 0.5rem;
    color: #718093;
  }
  .picture {
    width: 50px;
    height: 50px;
    background-color: tomato;
    border-radius: 50px;
  }
  .body {
    margin-top: 1rem;
  }
  .cmtlist_btns {
    margin: 10px;
  }
  .cmtlist_btns button {
    border : none;
    background-color : white;
    font-size: 0.9rem;
    margin-left : .4rem;
    cursor : pointer;
  }
  
  @media screen and (max-width: 1024px) {
    width: 80vw;

    .picture {
      width: 30px;
      height: 30px;
      background-color: tomato;
      border-radius: 50px;
    }

    .modifyMode {
      width : 70vw;
    }
    .modifyMode textarea {
      width : 65vw;
    }
    .modifyMode div {
      width : 65vw;
    }    
    .comment {
      width : 70vw;
    }
    .picture {
      align-self : center;
    }

    .cmtlist_btns{
      margin : 0px;
      width: 6rem;
      display : flex;
      align-self : center;
    }

    .cmtlist_btns button{
      width : 3rem;
      font-size : 0.8rem;
    }
  }
`;

const ReplyFormContainer = styled.div`
  margin : 0 auto;
  width : 40vw;
  padding : 10px 10px;
  border-radius : 5px;
  border : 1px solid #dedede;
  box-shadow : 2px 4px 3px #222f3e;
  margin-bottom : 1rem;

  table{
    width : 100%;
    height : 100%;
  }
  input{
    border-color: #dedede;
  }
  input:focus{
    outline : none;
  }
  textarea {
    overflow-x: hidden;
    resize: none;
    border-color: #dedede;
    border-radius: 5px;
    width: 100%;
    height: 6rem;
  }
  textarea::placeholder {
    padding-left: 10px;
    padding-top: 10px;
    font-size: 15px;
  }
  .cmt_tool .cmtBtn {
    background-color: white;
    font-size: 16px;
    padding: 5px 5px;
    border-radius: 5px;
    border-color: #dedede;
  }
  .cmt_tool .cmtBtn:hover {
    background-color: black;
    color: white;
    cursor: pointer;
  }
  @media screen and (max-width:1024px){
    width : 70vw;
  }
  .cmt textarea {
    width : 90%;
  }
`;