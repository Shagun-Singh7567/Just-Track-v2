package com.shagun.just_track_v2.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.shagun.just_track_v2.model.Transaction;
import com.shagun.just_track_v2.model.User;
import com.shagun.just_track_v2.repository.TransactionRepository;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @Mock
    private User user;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction buildTransaction(String description, double amount) {
        Transaction t = new Transaction();
        t.setDescription(description);
        t.setAmount(amount);
        // set category/type here too, using your actual field types
        return t;
    }

    // ---------- getAllTransactions ----------

    @Test
    @DisplayName("getAllTransactions returns the user's transactions")
    void getAllTransactions_returnsUserTransactions() {
        List<Transaction> expected = List.of(
                buildTransaction("Groceries", 50.00),
                buildTransaction("Salary", 1000.00));
        when(repository.findByUser(user)).thenReturn(expected);

        List<Transaction> result = transactionService.getAllTransactions(user);

        assertEquals(expected, result);
        verify(repository).findByUser(user);
    }

    @Test
    @DisplayName("getAllTransactions returns empty list when user has none")
    void getAllTransactions_whenNone_returnsEmptyList() {
        when(repository.findByUser(user)).thenReturn(List.of());

        assertTrue(transactionService.getAllTransactions(user).isEmpty());
    }

    // ---------- getTransactionById ----------

    @Test
    @DisplayName("getTransactionById returns the transaction when found")
    void getTransactionById_whenFound_returnsTransaction() {
        Transaction t = buildTransaction("Groceries",50.00);
        when(repository.findByIdAndUser(1L, user)).thenReturn(Optional.of(t));

        Transaction result = transactionService.getTransactionById(1L, user);

        assertSame(t, result);
        verify(repository).findByIdAndUser(1L, user);
    }

    @Test
    @DisplayName("getTransactionById throws when not found")
    void getTransactionById_whenNotFound_throwsException() {
        when(repository.findByIdAndUser(99L, user)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> transactionService.getTransactionById(99L, user));

        assertEquals("Transaction not found with id, 99", ex.getMessage());
    }

    // ---------- createTransaction ----------

    @Test
    @DisplayName("createTransaction assigns the user and saves")
    void createTransaction_setsUserAndSaves() {
        Transaction input = buildTransaction("Coffee", 4.50);
        when(repository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        Transaction result = transactionService.createTransaction(input, user);

        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(repository).save(captor.capture());
        assertSame(user, captor.getValue().getUser());
        assertSame(user, result.getUser());
    }

    // ---------- updateTransaction ----------

    @Test
    @DisplayName("updateTransaction copies fields onto the existing transaction and saves")
    void updateTransaction_whenFound_updatesFieldsAndSaves() {
        Transaction existing = buildTransaction("Old", 10.00);
        Transaction updated = buildTransaction("New", 25.00);
        when(repository.findByIdAndUser(1L, user)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);

        Transaction result = transactionService.updateTransaction(1L, updated, user);

        assertSame(existing, result);
        assertEquals("New", result.getDescription());
        assertEquals(25.00, result.getAmount());
        assertEquals(updated.getCategory(), result.getCategory());
        assertEquals(updated.getType(), result.getType());
        verify(repository).save(existing);
    }

    @Test
    @DisplayName("updateTransaction throws and does not save when not found")
    void updateTransaction_whenNotFound_throwsAndDoesNotSave() {
        when(repository.findByIdAndUser(99L, user)).thenReturn(Optional.empty());
        Transaction updated = buildTransaction("New", 25.00);

        assertThrows(RuntimeException.class,
                () -> transactionService.updateTransaction(99L, updated, user));

        verify(repository, never()).save(any(Transaction.class));
    }

    // ---------- deleteTransaction ----------

    @Test
    @DisplayName("deleteTransaction deletes the transaction when found")
    void deleteTransaction_whenFound_deletes() {
        Transaction t = buildTransaction("Groceries", 50.00);
        when(repository.findByIdAndUser(1L, user)).thenReturn(Optional.of(t));

        transactionService.deleteTransaction(1L, user);

        verify(repository).delete(t);
    }

    @Test
    @DisplayName("deleteTransaction throws and does not delete when not found")
    void deleteTransaction_whenNotFound_throwsAndDoesNotDelete() {
        when(repository.findByIdAndUser(99L, user)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> transactionService.deleteTransaction(99L, user));

        verify(repository, never()).delete(any(Transaction.class));
    }
}