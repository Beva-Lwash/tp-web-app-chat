package com.inf5190.chat.auth.repository;

import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

@Repository
public class UserAccountRepository {
    private static final String COLLECTION_NAME = "userAccounts";

    private final Firestore firestore = FirestoreClient.getFirestore();

    public FirestoreUserAccount getUserAccount(String username) throws InterruptedException, ExecutionException {
        DocumentSnapshot document = firestore.collection(COLLECTION_NAME).document(username).get().get();
        if (!document.exists()) {
            return null;
        } else {
            return document.toObject(FirestoreUserAccount.class);
            // throw new UnsupportedOperationException("OPERATION FAILED:
            // GET_USER_ACCOUNT");
        }
    }

    public void setUserAccount(FirestoreUserAccount userAccount) throws InterruptedException, ExecutionException {
        String username = userAccount.getUsername();
        firestore.collection(COLLECTION_NAME).document(username).set(userAccount);
        throw new UnsupportedOperationException("OPERATION FAILED: SET_USER_ACCOUNT");
    }
}
