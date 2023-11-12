package com.inf5190.chat.messages.repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.ArrayList;
import java.util.Collections;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest;

import org.springframework.stereotype.Repository;
import com.google.firebase.cloud.FirestoreClient;

/**
 * Classe qui gère la persistence des messages.
 * 
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {
    private static final String COLLECTION_NAME = "messages";
    Firestore firestore = FirestoreClient.getFirestore();
    private final CollectionReference messagesCollection = firestore.collection(COLLECTION_NAME);

    public List<Message> getMessages(String fromId) {
        try {
            Query query;

            if (fromId == null || fromId.isEmpty()) {
                query = messagesCollection.orderBy("timestamp").limit(20);
            } else {
                DocumentSnapshot startAfterDoc = messagesCollection.document(fromId).get().get();
                query = messagesCollection.orderBy("timestamp").startAfter(startAfterDoc).limit(20);
            }

            QuerySnapshot querySnapshot = query.get().get();
            List<Message> messages = new ArrayList<>();
            for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
                messages.add(document.toObject(Message.class));
            }

            return messages;
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return Collections.emptyList(); // Retourner une liste vide en cas d'erreur
        }
    }

    public NewMessageRequest createMessage(NewMessageRequest message) throws InterruptedException,
            ExecutionException {
        DocumentReference documentReference = this.firestore.collection(COLLECTION_NAME).document();

        FirestoreMessage firestoreMessage = new FirestoreMessage(
                message.username(),
                Timestamp.now(),
                message.text(), null);

        documentReference.create(firestoreMessage).get();

        NewMessageRequest createdMessage = new NewMessageRequest(
                firestoreMessage.getUsername(),
                firestoreMessage.getText(), null);

        return createdMessage;

    }

}
