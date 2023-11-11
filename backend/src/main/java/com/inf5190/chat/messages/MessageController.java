package com.inf5190.chat.messages;

import com.inf5190.chat.auth.session.SessionDataAccessor;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.repository.MessageRepository;
import com.inf5190.chat.websocket.WebSocketManager;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Contrôleur qui gère l'API de messages.
 */
@RestController
public class MessageController {
    public static final String MESSAGES_PATH = "/messages";

    private MessageRepository messageRepository;
    private WebSocketManager webSocketManager;

    public MessageController(MessageRepository messageRepository,
            WebSocketManager webSocketManager,
            SessionDataAccessor sessionDataAccessor) {
        this.messageRepository = messageRepository;
        this.webSocketManager = webSocketManager;
    }

    @GetMapping(MESSAGES_PATH)
    public List<Message> getMessages(@RequestParam(name = "fromId", required = false) String fromId) {
        List<Message> allMessages = messageRepository.getMessages(fromId);
        if (fromId != null) {
            return allMessages.stream()
                    .filter(message -> message.id().compareTo(fromId) > 0)
                    .collect(Collectors.toList());
        }
        return allMessages;
    }

    @PostMapping(MESSAGES_PATH)
    public Message creer_message(@RequestBody Message message) {
        Message newMessage = messageRepository.createMessage(message);
        webSocketManager.notifySessions();
        return newMessage;
    }
}
