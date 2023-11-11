package com.inf5190.chat.auth;

import java.util.concurrent.ExecutionException;

import javax.servlet.http.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
public class AuthController {
    public static final String AUTH_LOGIN_PATH = "/auth/login";
    public static final String AUTH_LOGOUT_PATH = "/auth/logout";
    public static final String SESSION_ID_COOKIE_NAME = "sid";

    private final UserAccountRepository userAccountRepository;
    private final SessionManager sessionManager;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserAccountRepository userAccountRepository, SessionManager sessionManager,
            PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.sessionManager = sessionManager;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(AUTH_LOGIN_PATH)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest)
            throws InterruptedException, ExecutionException {
        FirestoreUserAccount existingUserAccount = userAccountRepository.getUserAccount(loginRequest.username());

        if (existingUserAccount == null) {
            String hashedPassword = passwordEncoder.encode(loginRequest.password());
            FirestoreUserAccount newUserAccount = new FirestoreUserAccount(loginRequest.username(), hashedPassword);
            userAccountRepository.setUserAccount(newUserAccount);
        } else if (!passwordEncoder.matches(loginRequest.password(), existingUserAccount.getEncodedPassword()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Mot de passe incorrect!");

        SessionData sessionData = new SessionData(loginRequest.username());
        String sessionId = this.sessionManager.addSession(sessionData);

        LoginResponse loginResponse = new LoginResponse(loginRequest.username());
        ResponseCookie cookie = ResponseCookie.from(SESSION_ID_COOKIE_NAME, sessionId)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(86400)
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(loginResponse);
    }

    @PostMapping(AUTH_LOGOUT_PATH)
    public ResponseEntity<Void> logout(@CookieValue("sid") Cookie sessionCookie) {
        this.sessionManager.removeSession(sessionCookie.getValue());
        ResponseCookie cookie_vide = ResponseCookie.from(SESSION_ID_COOKIE_NAME, "").maxAge(0).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie_vide.toString()).build();
    }
}
