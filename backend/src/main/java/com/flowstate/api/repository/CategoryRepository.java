package com.flowstate.api.repository;

import com.flowstate.api.entity.Category;
import com.flowstate.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUser(User user);

    List<Category> findByUserId(UUID userId);
}
