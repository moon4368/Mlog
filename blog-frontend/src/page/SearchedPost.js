import React, { useEffect, useState } from 'react'
import SearchedPostCard from './components/posts/SearchedPostCard';
import { CardsLayout, SearchLayoutHeight } from './components/atoms/Layouts';
import Footer from './components/common/Footer';
import axios from 'axios';
import { SearchInput } from './components/atoms/Inputs';

export default function SearchedPost() {
  const [Posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios.get("/api/v2/posts")
      .then(response => { setPosts(response.data); })
      .catch(error => console.log(error))
  }, [])

  const searchTextChange = (e) => {
    setSearchText(e.currentTarget.value);
  }

  const searchPostList = Posts.filter(post => {
    return post.title.includes(searchText)
  })

  return (
    <>
      <SearchLayoutHeight>
        <div style={{
          "margin": "0 auto",
          "width": "80%",
          "display": "flex",
          "justifyContent": "center",
          "marginTop": "8rem",
        }}>
          <SearchInput type="text"
            placeholder="검색어를 입력하세요"
            value={searchText}
            onChange={searchTextChange} />
        </div>
        <CardsLayout style={{ "margin": ".5rem auto" }}>
          {searchPostList &&
            searchPostList.map((post, index) => {
              return <SearchedPostCard post={post} key={index} />
            })
          }
        </CardsLayout>
      </SearchLayoutHeight>
      <Footer />
    </>
  )
}

