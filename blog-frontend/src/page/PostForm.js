import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PostLayout, ModalBackLayout } from './components/atoms/Layouts';
import { TitleInput, FormTextarea } from './components/atoms/Inputs';
import { FormButton, LongButton } from './components/atoms/Buttons';
import TempCard from './components/modal/TempCard';
import axios from 'axios';


export default function PostForm(props) {

  const windowHeight = (window.innerHeight - 300) + 'px';
  const [onCategory, setOnCategory] = useState(false);
  const [onTempPost, setOnTempPost] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);
  const [image, setImage] = useState({
    file: null,
    fileName: ""
  });
  const [category, setCategory] = useState("");
  const userCategories = [];
  const [TempData, setTempData] = useState({});
  const [tempPosts, setTempPosts] = useState([]);

  const handleFileChange = (e) => {
    setImage({
      file: e.target.files[0],
      fileName: e.target.value
    })
  }
  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
  }

  const loadTempPosts = (callTemp) => {
    setTitle(callTemp.title);
    setContent(callTemp.content);
  }

  const addPost = () => {
    const url = '/api/v2/write';
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    formData.append('categories', category);
    const config = {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }

    return axios.post(url, formData, config);
  }

  const handleFormSubmit = (e) => {
    addPost().then((response) => {
      alert('게시글 등록이 완료되었습니다.');
      console.log(response);
      props.history.push(`/api/v2/posts/${response.data}`)
    }).catch(error => console.log(error));
  }


  const onModalCategory = () => {
    setOnCategory(!onCategory);
  }

  const onModalTempPost = () => {
    setOnTempPost(!onTempPost);
  }


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleContentChange = (e) => {
    setContent(e.target.value);
  }

  useEffect(() => {
    axios.get("/api/v2/write/temp")
      .then(response => setTempPosts(response.data));
  }, [])

  const addTempPost = () => {
    const url = "/api/v2/write/temp";
    setTempData({
      title: title,
      content: content
    })
    console.log(TempData)
    return axios.post(url, TempData);
  }

  const submitTempPost = (e) => {
    if (title && content) {
      addTempPost()
        .then(response => {
          setTempPosts(tempPosts.concat(response));
          alert("현재 글이 임시저장 되었습니다.");
        })
        .catch(error => console.log(error));
    } else {
      alert("제목과 내용을 입력해야 임시저장이 가능합니다.");
    }
  }

  const reRenderTempPostDelete = () => {
    const url = "/api/v2/write/temp";
    axios.get(url)
      .then(response => setTempPosts(response.data))
      .catch(error => console.log(error));
  }

  return (
    <>
      <PostLayout>
        <TitleInput name="title" onChange={handleTitleChange} value={title} placeholder="제목을 입력하세요." />
        <FormTextarea name="content" onChange={handleContentChange} value={content} placeholder="내용을 입력하세요." height={windowHeight}></FormTextarea>
      </PostLayout>
      <FormTools>
        <div>
          <FormButton onClick={props.history.goBack}><i className="fas fa-arrow-left"></i> 나가기</FormButton>
        </div>
        <div>
          <FormButton>미리보기</FormButton>
          <FormButton onClick={onModalTempPost}>임시저장</FormButton>
          <FormButton onClick={onModalCategory}>작성완료</FormButton>
        </div>
      </FormTools>
      {/* 카테고리 */}
      {onCategory &&
        <ModalBackLayout>
          <ModalLayout>
            <p>
              <span>게시글 발행</span>
              <button onClick={onModalCategory}>X</button>
            </p>
            <div>
              <label htmlFor="thumbnail">썸네일</label>
              <input onChange={handleFileChange}
                image={image.file}
                value={image.fileName}
                accept="image/*"
                name="image"
                type="file"
                id="thumbnail" />
            </div>
            <div>
              <label htmlFor="category">시리즈</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                name="category"
                id="category">
                <option value="">선택하지 않음</option>
                {userCategories &&
                  userCategories.map(category => {
                    return <option value={category}>{category}</option>
                  })}
              </select>
            </div>
            <SubmitButton onClick={handleFormSubmit}>글을 발행합니다.</SubmitButton>
          </ModalLayout>
        </ModalBackLayout>}
      {/* 임시저장 */}
      {onTempPost &&
        <ModalBackLayout>
          <TempModalLayout>
            <p><span>임시 저장</span><button onClick={onModalTempPost}>X</button></p>
            {tempPosts ?
              tempPosts.map(temp => {
                return (
                  <TempCard
                    loadTempPosts={loadTempPosts}
                    reRenderTempPostDelete={reRenderTempPostDelete}
                    temp={temp}
                    key={temp.id} />)
              })
              : <h3>임시 저장글이 없습니다.</h3>}
            <SubmitTempButton style={{ "marginTop": "1rem" }} onClick={submitTempPost}>현재 글 임시 저장</SubmitTempButton>
          </TempModalLayout>
        </ModalBackLayout>}
    </>
  )
}


const FormTools = styled.div`
width: 100%;
position: absolute;
height: 4rem;
bottom: 0;
display:flex;
justify-content: space-evenly;
align-items : center;

button {
  margin : 0.5rem;
}
`;

const ModalLayout = styled.div`
  width : 30rem;
  padding : 1rem;
  background-color : #fafafa;
  display : flex;
  flex-direction : column;
  border-radius : 10px;
  box-shadow : 0px 4px 6px 0px;

  p{
    display : flex;
    justify-content : space-between;
  }

  p span{
    font-size : 1.5rem;
    font-weight : 600;
  }

  p button{
    background-color : #fafafa;
    border : none;
    font-size:1.5rem;

    &:hover{
      cursor:pointer;
    }
    &:focus{
      outline : none;
    }
  }

  div{
    margin : 1rem 1rem;
    overflow:hidden;
  }  

  div label {
    padding : 0.5rem;
    background-color : black;
    color : white;
    margin-right : 0.5rem;
  }
  div input[type="file"] {
    width : 83.5%;
    height : 2rem;
  }

  #file-upload-button{
    height : 2rem;
  }
  
  div select {
    width : 83.5%;
    height : 2rem;
  }
`;

const SubmitButton = styled(LongButton)`
  width : 100%;
`;

const TempModalLayout = styled.div`
  width : 500px;
  display : flex;
  flex-direction : column;
  justify-content:center;
  align-items : center;
  background-color : #fafafa;
  box-shadow : 0 4px 8px 0;
  border-radius : 10px;

  p{
    width : 90%;
    display :flex;
    justify-content : space-between;
  }

  p span{
    font-size : 1.3rem;
  }
  p button{
    background-color : #fafafa;
    border : none;
    font-size:1.3rem;

    &:hover{
      cursor:pointer;
    }
    &:focus{
      outline : none;
    }
  }

  @media screen and (max-width : 550px){
    width : calc(100% - 2rem);
  }

`;

const SubmitTempButton = styled(LongButton)`
width : 100%;
`;