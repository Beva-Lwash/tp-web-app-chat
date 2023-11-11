package com.inf5190.chat.auth.session;

import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Repository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

import java.time.Instant;
import java.util.Date;


/**
 * Classe qui gère les sessions utilisateur.
 * 
 * Pour le moment, on gère en mémoire.
 */
@Repository
public class SessionManager {

    private final Map<String, SessionData> sessions = new HashMap<String, SessionData>();
    
    private static SecretKey key = Jwts.SIG.HS256.key().build(); 
    private static final String SECRET_KEY_BASE64 = Encoders.BASE64.encode(key.getEncoded());
    private final SecretKey secretKey;
    private final JwtParser jwtParser;
    
    public SessionManager() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_BASE64));
        this.jwtParser = Jwts.parser().verifyWith(this.secretKey).build();
    }

    public String addSession(SessionData authData) {
        Date expirationDate = new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000);
        String jws = Jwts.builder().
            issuedAt(Date.from(Instant.now())).
            expiration(expirationDate). 
            claim("aud","Chat-page-app").
            subject(authData.username()).
            signWith(this.secretKey).
            compact();
            
        return jws;
    }

    public SessionData getSession(String sessionId) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(sessionId)
                .getPayload();

            String username = claims.getSubject();
            return new SessionData(username);
        } catch (JwtException e) {
            return null;
        }
    }  
    
    public void removeSession(String sessionId) {
        this.sessions.remove(sessionId);
    }

}
    
  
    

   

