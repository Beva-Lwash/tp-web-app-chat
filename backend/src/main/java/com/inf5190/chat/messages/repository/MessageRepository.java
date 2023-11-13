package com.inf5190.chat.messages.repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.Query.Direction;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest;
import com.inf5190.chat.messages.model.ChatImageData;

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
            List<Message> messages = new ArrayList<>();
            // messages = this.messages.stream().sorted(Comparator.comparingLong((m) ->
            // m.timestamp())).toList();
            if (fromId == null || fromId.isEmpty()) {
                Query query = messagesCollection.orderBy("timestamp", Direction.ASCENDING).limit(20);

                ApiFuture<QuerySnapshot> querysnapshot = query.get();
                List<QueryDocumentSnapshot> documents = querysnapshot.get().getDocuments();
                for (DocumentSnapshot document : documents) {
                    long time = Long.parseLong(document.toObject(FirestoreMessage.class).getTimestamp().toString());
                    messages.add(new Message(document.getId(), document.toObject(FirestoreMessage.class).getUsername(),
                            time,
                            document.toObject(FirestoreMessage.class).getText(), null));
                }
            } else {
                Query query = messagesCollection.orderBy(fromId);
                ApiFuture<QuerySnapshot> future = query.get();
                List<QueryDocumentSnapshot> docs = future.get().getDocuments();

                QueryDocumentSnapshot docsava = docs.get(docs.size() - 1);
                Query actualquery = messagesCollection.orderBy("timestamp").startAfter(docsava);

                future = actualquery.get();
                docs = future.get().getDocuments();
                for (DocumentSnapshot document : docs) {
                    long time = Long.parseLong(document.toObject(FirestoreMessage.class).getTimestamp().toString());
                    messages.add(new Message(document.getId(), document.toObject(FirestoreMessage.class).getUsername(),
                            time,
                            document.toObject(FirestoreMessage.class).getText(), null));
                }
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
        ChatImageData img;
        if (message.imageData() != null) {
            img = new ChatImageData(message.imageData().data(), message.imageData().type());
        } else {
            img = new ChatImageData(null, null);
        }
        FirestoreMessage firestoreMessage = new FirestoreMessage(
                message.username(),
                Timestamp.now(),
                message.text(), img.data());

        documentReference.create(firestoreMessage).get();

        NewMessageRequest createdMessage = new NewMessageRequest(
                firestoreMessage.getUsername(),
                firestoreMessage.getText(), null);

        return createdMessage;

    }

}
