package me.portfolio.blog.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.portfolio.blog.domain.user.Role;
import me.portfolio.blog.domain.user.User;
import me.portfolio.blog.domain.user.UserRepository;
import me.portfolio.blog.web.dto.user.UserUpdateRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("local")
@AutoConfigureMockMvc
@ExtendWith(MockitoExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    private MockMvc mvc;

    @BeforeEach
    public void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        User testUser = userRepository.save(User.builder()
                .email("test@test.com")
                .name("test user")
                .picture("/images/default.png")
                .role(Role.USER)
                .build());

        User guestUser = userRepository.save(User.builder()
                .email("guest@test.com")
                .name("guest user")
                .picture("/images/default.png")
                .role(Role.GUEST)
                .build());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void 사용자_유저_정보_수정() throws Exception {
        String exceptedName = "exceptedName";
        String exceptedPicture = "exceptedPicture";

        User user = userRepository.findByEmail("test@test.com").get();

        UserUpdateRequestDto requestDto = UserUpdateRequestDto.builder()
                .name(exceptedName)
                .picture(exceptedPicture)
                .build();

        String url = "http://localhost:" + port + "/api/v2/user/" + user.getId();

        mvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(requestDto)))
                .andExpect(status().isOk());

        userRepository.delete(user);
        userRepository.delete(userRepository.findByEmail("guest@test.com").get());
    }

    @Test
    @WithMockUser(roles = "GUEST")
    public void 게스트_유저_정보_수정() throws Exception {
        String exceptedName = "exceptedName";
        String exceptedPicture = "exceptedPicture";

        User guestUser = userRepository.findByEmail("guest@test.com").get();

        UserUpdateRequestDto requestDto = UserUpdateRequestDto.builder()
                .name(exceptedName)
                .picture(exceptedPicture)
                .build();

        String url = "http://localhost:" + port + "/api/v2/user/" + guestUser.getId();

        mvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(requestDto)))
                .andExpect(status().isOk());

        userRepository.delete(userRepository.findByEmail("test@test.com").get());
        userRepository.delete(guestUser);
    }

    //사용자 유저 탈퇴로 이름바꾸자
    @Test
    @WithMockUser(roles = "USER")
    public void 사용자_유저_탈퇴() throws Exception {
        User user = userRepository.findByEmail("test@test.com").get();

        String url = "http://localhost:" + port + "/api/v2/user/" + user.getId();
        mvc.perform(delete(url)).andExpect(status().isOk());

        userRepository.delete(userRepository.findByEmail("guest@test.com").get());
    }

    @Test
    @WithMockUser(roles = "GUEST")
    public void 게스트_유저_탈퇴() throws Exception {
        User guestUser = userRepository.findByEmail("guest@test.com").get();

        String url = "http://localhost:" + port + "/api/v2/user/" + guestUser.getId();
        mvc.perform(delete(url)).andExpect(status().isOk());

        userRepository.delete(userRepository.findByEmail("test@test.com").get());
    }
}