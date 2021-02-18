package me.portfolio.blog.service;

import lombok.RequiredArgsConstructor;
import me.portfolio.blog.config.auth.dto.SessionUser;
import me.portfolio.blog.domain.categories.Categories;
import me.portfolio.blog.domain.categories.CategoriesRepositorySupport;
import me.portfolio.blog.domain.like.LikeVal;
import me.portfolio.blog.domain.like.LikeValRepository;
import me.portfolio.blog.domain.like.LikeValRepositorySupport;
import me.portfolio.blog.domain.user.User;
import me.portfolio.blog.domain.user.UserRepository;
import me.portfolio.blog.web.dto.posts.PostsListResponseDto;
import me.portfolio.blog.web.dto.posts.PostsResponseDto;
import me.portfolio.blog.web.dto.posts.PostsSaveRequestDto;
import me.portfolio.blog.web.dto.posts.PostsUpdateRequestDto;
import me.portfolio.blog.domain.posts.Posts;
import me.portfolio.blog.domain.posts.PostsRepository;
import me.portfolio.blog.domain.posts.PostsRepositorySupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PostsService {

    private final PostsRepository postsRepository;
    private final PostsRepositorySupport postsRepositorySupport;
    private final UserRepository userRepository;
    private final CategoriesRepositorySupport categoriesRepositorySupport;
    private final LikeValRepository likeValRepository;
    private final LikeValRepositorySupport likeValRepositorySupport;

    //포스트 리스트 조회
    @Transactional(readOnly = true)
    public List<PostsListResponseDto> getPostList() {
        return postsRepositorySupport.findAllDesc()
                .stream()
                .map(posts -> new PostsListResponseDto(posts))
                .collect(Collectors.toList());
    }

    //포스트 검색 리스트 조회
    @Transactional(readOnly = true)
    public List<PostsListResponseDto> getListSearchTitle(String title) {
        return postsRepositorySupport.findByTitle(title)
                .stream()
                .map(posts -> new PostsListResponseDto(posts))
                .collect(Collectors.toList());
    }
    //인기 포스트 조회
    public List<PostsListResponseDto> getPopPostList() {
        return postsRepositorySupport.findAllPop()
                .stream()
                .map(posts -> new PostsListResponseDto(posts))
                .collect(Collectors.toList());
    }

    //포스트 등록
    @Transactional
    public Long addPost(SessionUser sessionUser, MultipartFile image, String title, String content, String categoryName) throws IOException {
        //세션 유저 정보 불러오기
        User user = userRepository.findByEmail(sessionUser.getEmail()).get();
        Categories categories = categoriesRepositorySupport.findByUserAndName(sessionUser.getId(),categoryName);
        //파일 저장
        if (image == null) {
            PostsSaveRequestDto requestDto = PostsSaveRequestDto.builder()
                    .title(title)
                    .user(user)
                    .content(content)
                    .imageUrl("/images/default.png")
                    .categories(categories)
                    .likeCount(0)
                    .temp("Y")
                    .build();

            return postsRepository.save(requestDto.toEntity()).getId();

        } else {
            //로컬 테스트용
            String baseDir = "D:\\GitHub\\Blog-portfolio\\blog-springboot-react\\blog-frontend\\public\\images";
            String filePath = baseDir + "\\" + image.getOriginalFilename();
            //실제 리눅스 서버 배포용
//            String baseDir = "/home/ec2-user/portfolio-blog/blog-frontend/build/images";
//            String filePath = baseDir + "/" + image.getOriginalFilename();
            image.transferTo(new File(filePath));
            String fileName = image.getOriginalFilename();

            PostsSaveRequestDto requestDto = PostsSaveRequestDto.builder()
                    .title(title)
                    .user(user)
                    .content(content)
                    .imageUrl("/images/" + fileName)
                    .categories(categories)
                    .likeCount(0)
                    .temp("Y")
                    .build();
            return postsRepository.save(requestDto.toEntity()).getId();
        }
    }

    //포스트 조회
    @Transactional(readOnly = true)
    public PostsResponseDto getPost(Long postId){
        Posts entity = postsRepository.findById(postId).orElseThrow(
                ()->new IllegalArgumentException("해당 포스트가 없습니다. id="+postId));

        return new PostsResponseDto(entity);
    }

    //포스트 수정
    @Transactional
    public Long updatePost(Long postId, PostsUpdateRequestDto requestDto){
        Posts posts = postsRepository.findById(postId).orElseThrow(
                ()->new IllegalArgumentException("해당 포스트가 없습니다. id="+postId));
        posts.update(requestDto.getTitle(), requestDto.getContent());

        return postId;
    }
    //포스트 삭제
    @Transactional
    public void deletePost(Long postId){
        Posts posts = postsRepository.findById(postId).orElseThrow(
                ()->new IllegalArgumentException("해당 포스트가 없습니다. id="+postId));
        postsRepository.delete(posts);
    }
    //좋아요
    @Transactional
    public int plusLikeCount(Long postId, SessionUser sessionUser) {
        User user = userRepository.findByEmail(sessionUser.getEmail()).get();
        Posts post = postsRepository.findById(postId).get();

        LikeVal likeVal = likeValRepositorySupport.checkLikeWithUser(user, post);
        if (likeVal == null){
            likeValRepository.save(LikeVal.builder()
                    .user(user)
                    .posts(post)
                    .build());
            post.plusCount();
        }
        return post.getLikeCount();
    }
    //좋아요 취소
    @Transactional
    public int minusLikeCount(Long postId, SessionUser sessionUser) {
        User user = userRepository.findByEmail(sessionUser.getEmail()).get();
        Posts post = postsRepository.findById(postId).get();

        LikeVal likeVal = likeValRepositorySupport.checkLikeWithUser(user, post);
        if(likeVal != null){
            post.minusCount();
            likeValRepository.delete(likeVal);
        }
        return post.getLikeCount();
    }
    //임시저장
    @Transactional
    public Long addTempPost(SessionUser sessionUser, PostsSaveRequestDto requestDto) {
        User user = userRepository.findByEmail(sessionUser.getEmail()).get();

        PostsSaveRequestDto saveRequestDto = PostsSaveRequestDto.builder()
                .temp("N")
                .user(user)
                .likeCount(0)
                .content(requestDto.getContent())
                .title(requestDto.getTitle())
                .build();
        return postsRepository.save(saveRequestDto.toEntity()).getId();
    }
    //임시저장 목록 조회
    @Transactional(readOnly = true)
    public List<PostsResponseDto> getTempPost(SessionUser sessionUser) {
        return postsRepositorySupport.findTempPost(sessionUser)
                .stream()
                .map(temp -> new PostsResponseDto(temp))
                .collect(Collectors.toList());
    }
}
