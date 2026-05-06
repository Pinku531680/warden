package org.example.springbootbackend.repository;
import org.example.springbootbackend.model.User;
import java.util.List;


public interface UserRepositoryCustom {

    void bulkInsertUsers(List<User> users);
}
