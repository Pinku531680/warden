package org.example.springbootbackend.repository;
import org.example.springbootbackend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>, UserRepositoryCustom {

}
