package me.portpolio.blog.web;

import lombok.RequiredArgsConstructor;
import me.portpolio.blog.domain.posts.Posts;
import me.portpolio.blog.service.PostsService;
import me.portpolio.blog.web.dto.posts.PostsResponseDto;
import me.portpolio.blog.web.dto.posts.PostsSaveRequestDto;
import me.portpolio.blog.web.dto.posts.PostsUpdateRequestDto;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8000, http://localhost:3000")
@RequestMapping("/api")
@RestController
public class PostsApiController {

    private final PostsService postsService;

    //포스트 리스트 조회
    @GetMapping("/posts")
    public List<Posts> getPostList(@RequestParam("search") String search)throws Exception{
        return postsService.getPostList(search);
    }
    
    //포스트 등록
    @PostMapping("/posts")
    public Long addPost(MultipartHttpServletRequest request,
                        @RequestParam("image") MultipartFile image,
                        @RequestParam("title")String title,
                        @RequestParam("author") String author,
                        @RequestParam("content") String content) throws Exception {

        PostsSaveRequestDto requestDto = new PostsSaveRequestDto();

        //파일 저장
        if(image.isEmpty()){
            requestDto.setTitle(title);
            requestDto.setAuthor(author);
            requestDto.setContent(content);
            requestDto.setImageUrl("/images/default.jpg");
        }else {
            String baseDir = "D:\\GitHub\\Blog-portfolio\\blog-springboot-react\\blog-frontend\\public\\images";
            String filePath = baseDir + "\\" + image.getOriginalFilename();
            image.transferTo(new File(filePath));
            requestDto.setTitle(title);
            requestDto.setAuthor(author);
            requestDto.setContent(content);
            requestDto.setImageUrl("/images/"+image.getOriginalFilename());
        }
        return postsService.addPost(requestDto);
    }

    //포스트 조회
    @GetMapping("/posts/{postId}")
    public PostsResponseDto getPost(@PathVariable Long postId) throws Exception{
        return postsService.getPost(postId);
    }

    //포스트 수정
    @PutMapping("/posts/{postId}")
    public Long updatePost(@PathVariable Long postId, @RequestBody PostsUpdateRequestDto requestDto) throws Exception{
        return postsService.updatePost(postId, requestDto);
    }

    //포스트 삭제
    @DeleteMapping("/posts/{postId}")
    public Long deletePost(@PathVariable Long postId) throws Exception{
        postsService.deletePost(postId);
        return postId;
    }


}
